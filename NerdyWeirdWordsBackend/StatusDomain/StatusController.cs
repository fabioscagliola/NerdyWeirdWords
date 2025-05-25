using Microsoft.AspNetCore.Mvc;

namespace com.nerdyweirdwords.backend.StatusDomain;

[ApiController]
[Route("[controller]")]
public class StatusController() : ControllerBase
{
    public IActionResult Get()
    {
        return Ok("😎");
    }
}