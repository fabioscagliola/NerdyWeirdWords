using com.nerdyweirdwords.backend.PersonDomain;
using com.nerdyweirdwords.backend.WritingDomain;
using com.nerdyweirdwords.backend.WritingDomain.ListWriting;
using com.nerdyweirdwords.backend.WritingDomain.UploadWriting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System.Security.Claims;

namespace com.nerdyweirdwords.backend.test.WritingDomain;

public class UploadWritingTests
{
    [Test]
    public async Task GivenMissingFile_WhenValidated_ThenRequestIsRejected()
    {
        var result = await new UploadWritingIncomingValidator().ValidateAsync(new UploadWritingIncoming
        {
            Title = "A title",
        });

        Assert.That(result.IsValid, Is.False);
    }

    [Test]
    public async Task GivenUppercaseMarkdownFileAndEmptyDescription_WhenValidated_ThenRequestIsAccepted()
    {
        var result = await new UploadWritingIncomingValidator().ValidateAsync(new UploadWritingIncoming
        {
            Writing = CreateFile("writing.MD", "# Title"),
            Title = "A title",
            Description = string.Empty,
        });

        Assert.That(result.IsValid, Is.True);
    }

    [Test]
    public async Task GivenNonMarkdownFile_WhenValidated_ThenRequestIsRejected()
    {
        var result = await new UploadWritingIncomingValidator().ValidateAsync(new UploadWritingIncoming
        {
            Writing = CreateFile("writing.txt", "# Title"),
            Title = "A title",
        });

        Assert.That(result.IsValid, Is.False);
    }

    [TestCase(null)]
    [TestCase("")]
    [TestCase(" ")]
    public async Task GivenBlankTitle_WhenValidated_ThenRequestIsRejected(string? title)
    {
        var result = await new UploadWritingIncomingValidator().ValidateAsync(new UploadWritingIncoming
        {
            Writing = CreateFile("writing.md", "# Title"),
            Title = title,
        });

        Assert.That(result.IsValid, Is.False);
    }

    [Test]
    public async Task GivenValidUpload_WhenSubmitted_ThenWritingGraphIsPersistedRelationally()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        await using var database = CreateDatabase(connection);
        var owner = new Person
        {
            Id = Guid.NewGuid(),
            Email = "writer@example.com",
            FName = "Writer",
            LName = "Example",
        };
        database.People.Add(owner);
        await database.SaveChangesAsync();

        var controller = new WritingController(database, new UploadWritingIncomingValidator());
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(
                    [new Claim(ClaimTypes.NameIdentifier, owner.Id.ToString())],
                    "test")),
            },
        };

        var result = await controller.Upload(new UploadWritingIncoming
        {
            Writing = CreateFile("writing.md", "# Heading\n\nA **paragraph**."),
            Title = "A title",
            Description = "A description",
        });

        Assert.That(result, Is.TypeOf<OkResult>());

        var writing = await database.Writings
            .Include(item => item.Blocks)
            .ThenInclude(block => block.Attributes)
            .SingleAsync();
        Assert.That(writing.OwnerId, Is.EqualTo(owner.Id));
        Assert.That(writing.Title, Is.EqualTo("A title"));
        Assert.That(writing.Description, Is.EqualTo("A description"));
        Assert.That(writing.DateUploaded, Is.Not.EqualTo(default(DateTime)));
        Assert.That(writing.DateUploaded.Kind, Is.EqualTo(DateTimeKind.Utc));
        Assert.That(writing.Blocks.Select(block => block.Index), Is.EqualTo(new[] { 0, 1 }));
        Assert.That(writing.Blocks[0], Is.TypeOf<Heading>());
        Assert.That(writing.Blocks[1], Is.TypeOf<Paragraph>());
        Assert.That(writing.Blocks.All(block => block.Id != Guid.Empty && block.WritingId == writing.Id), Is.True);
        Assert.That(writing.Blocks[1].Attributes, Has.Count.EqualTo(1));
        Assert.That(writing.Blocks[1].Attributes[0].BlockId, Is.EqualTo(writing.Blocks[1].Id));
    }

    [Test]
    public async Task GivenWritingsForMultipleOwners_WhenListed_ThenOnlyCurrentOwnersWritingsAreReturnedNewestFirst()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        await using var database = CreateDatabase(connection);
        var owner = CreatePerson("writer@example.com");
        var otherOwner = CreatePerson("other@example.com");
        database.People.AddRange(owner, otherOwner);
        var oldest = new Writing
        {
            OwnerId = owner.Id,
            Title = "Oldest",
            DateUploaded = new DateTime(2026, 9, 20, 10, 0, 0, DateTimeKind.Utc),
        };
        var newest = new Writing
        {
            OwnerId = owner.Id,
            Title = "Newest",
            Description = "A description",
            DateUploaded = new DateTime(2026, 9, 21, 10, 0, 0, DateTimeKind.Utc),
        };
        var other = new Writing
        {
            OwnerId = otherOwner.Id,
            Title = "Other owner's writing",
            DateUploaded = new DateTime(2026, 9, 22, 10, 0, 0, DateTimeKind.Utc),
        };
        database.Writings.AddRange(oldest, newest, other);
        await database.SaveChangesAsync();

        var controller = CreateController(database, owner.Id);

        var result = await controller.List();

        var response = (OkObjectResult)result;
        var writings = (List<ListWritingItemOutgoing>)response.Value!;
        Assert.That(writings, Has.Count.EqualTo(2));
        Assert.That(writings.Select(writing => writing.Title), Is.EqualTo(new[] { "Newest", "Oldest" }));
        Assert.That(writings[0].Id, Is.EqualTo(newest.Id));
        Assert.That(writings[0].Description, Is.EqualTo("A description"));
        Assert.That(writings[1].Description, Is.Null);
        Assert.That(writings.All(writing => writing.Id != other.Id), Is.True);
    }

    [Test]
    public async Task GivenOwnerHasNoWritings_WhenListed_ThenEmptyListIsReturned()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        await using var database = CreateDatabase(connection);
        var owner = CreatePerson("writer@example.com");
        database.People.Add(owner);
        await database.SaveChangesAsync();

        var result = await CreateController(database, owner.Id).List();

        var response = (OkObjectResult)result;
        Assert.That((List<ListWritingItemOutgoing>)response.Value!, Is.Empty);
    }

    [Test]
    public async Task GivenMissingOwnerClaim_WhenListed_ThenUnauthorizedIsReturned()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        await using var database = CreateDatabase(connection);
        var controller = new WritingController(database, new UploadWritingIncomingValidator());
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity()),
            },
        };

        var result = await controller.List();

        Assert.That(result, Is.TypeOf<UnauthorizedResult>());
    }

    private static IFormFile CreateFile(string fileName, string contents)
    {
        var stream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(contents));
        return new FormFile(stream, 0, stream.Length, "writing", fileName);
    }

    private static Person CreatePerson(string email)
    {
        return new Person
        {
            Id = Guid.NewGuid(),
            Email = email,
            FName = "Writer",
            LName = "Example",
        };
    }

    private static WritingController CreateController(NerdyWeirdDatabase database, Guid ownerId)
    {
        var controller = new WritingController(database, new UploadWritingIncomingValidator());
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(
                    [new Claim(ClaimTypes.NameIdentifier, ownerId.ToString())],
                    "test")),
            },
        };
        return controller;
    }

    private static NerdyWeirdDatabase CreateDatabase(SqliteConnection connection)
    {
        var options = new DbContextOptionsBuilder<NerdyWeirdDatabase>()
            .UseSqlite(connection)
            .Options;
        return new NerdyWeirdDatabase(options);
    }
}
