using Microsoft.AspNetCore.Mvc;

namespace com.nerdyweirdwords.backend.Controller;

public class SendSignInLinkIncoming
{
    [FromBody]
    public string Email { get; }
}

[ApiController]
[Route("[controller]")]
public class PersonController(
    NerdyWeirdWordsBackendDbContext db
) : ControllerBase
{
    [Route("[action]")]
    public IActionResult SendSignInLink(SendSignInLinkIncoming sendSignInLinkIncoming)
    {
        var person = db.People.FirstOrDefault(x => x.Email == sendSignInLinkIncoming.Email);

        if (person == null)
        {
            return BadRequest("A person with this email doesn't exist in our database.");
        }

        return Ok();
    }
}

