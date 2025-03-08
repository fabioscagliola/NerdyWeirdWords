using Microsoft.AspNetCore.Mvc;

namespace com.nerdyweirdwords.backend.Controller;

[ApiController]
[Route("[controller]")]
public class StatusController() : ControllerBase
{
    public IActionResult Get()
    {
        return Ok("😎");
    }
}