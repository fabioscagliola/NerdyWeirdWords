using com.nerdyweirdwords.backend.PersonDomain;
using com.nerdyweirdwords.backend.WritingDomain;
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
        Assert.That(writing.Blocks.Select(block => block.Index), Is.EqualTo(new[] { 0, 1 }));
        Assert.That(writing.Blocks[0], Is.TypeOf<Heading>());
        Assert.That(writing.Blocks[1], Is.TypeOf<Paragraph>());
        Assert.That(writing.Blocks.All(block => block.Id != Guid.Empty && block.WritingId == writing.Id), Is.True);
        Assert.That(writing.Blocks[1].Attributes, Has.Count.EqualTo(1));
        Assert.That(writing.Blocks[1].Attributes[0].BlockId, Is.EqualTo(writing.Blocks[1].Id));
    }

    private static IFormFile CreateFile(string fileName, string contents)
    {
        var stream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(contents));
        return new FormFile(stream, 0, stream.Length, "writing", fileName);
    }

    private static NerdyWeirdDatabase CreateDatabase(SqliteConnection connection)
    {
        var options = new DbContextOptionsBuilder<NerdyWeirdDatabase>()
            .UseSqlite(connection)
            .Options;
        return new NerdyWeirdDatabase(options);
    }
}