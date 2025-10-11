using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace com.nerdyweirdwords.backend.StatusDomain;

[ApiController]
[Route("[controller]")]
public class StatusController(NerdyWeirdDatabase database) : ControllerBase
{
    public async Task<IActionResult> Get()
    {
        try
        {
            await database.Database.CanConnectAsync();
            return Ok("😎");
        }
        catch (Exception e)
        {
            return StatusCode(500, e);
        }
    }
}