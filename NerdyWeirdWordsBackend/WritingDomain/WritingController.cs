using com.nerdyweirdwords.backend.WritingDomain.UploadWriting;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace com.nerdyweirdwords.backend.WritingDomain;

[ApiController]
[Route("[controller]/[action]")]
public class WritingController(NerdyWeirdDatabase database, IValidator<UploadWritingIncoming> validator) : ControllerBase
{
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Upload([FromForm] UploadWritingIncoming incoming)
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub"), out var ownerId))
        {
            return Unauthorized();
        }

        var owner = await database.People.FirstOrDefaultAsync(person => person.Id == ownerId);
        if (owner is null)
        {
            return Unauthorized();
        }

        var validation = await validator.ValidateAsync(incoming);
        if (!validation.IsValid)
        {
            return BadRequest(string.Join(" ", validation.Errors.Select(error => error.ErrorMessage).Distinct()));
        }

        Writing writing;

        try
        {
            await using var stream = incoming.Writing!.OpenReadStream();
            using var reader = new StreamReader(stream);
            var markdown = await reader.ReadToEndAsync();
            writing = new WritingParser().Do(markdown);
        }
        catch (Exception)
        {
            return BadRequest("The writing could not be parsed.");
        }

        writing.Title = incoming.Title!.Trim();
        writing.Description = string.IsNullOrEmpty(incoming.Description) ? null : incoming.Description;
        writing.OwnerId = owner.Id;
        writing.Owner = owner;

        for (var index = 0; index < writing.Blocks.Count; index++)
        {
            var block = writing.Blocks[index];
            block.Writing = writing;
            block.WritingId = writing.Id;
            block.Index = index;

            foreach (var attribute in block.Attributes)
            {
                attribute.Block = block;
                attribute.BlockId = block.Id;
            }
        }

        database.Writings.Add(writing);
        await database.SaveChangesAsync();

        return Ok();
    }
}