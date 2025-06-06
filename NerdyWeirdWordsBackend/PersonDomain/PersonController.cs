using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using com.nerdyweirdwords.backend.PersonDomain.SendSignInLink;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace com.nerdyweirdwords.backend.PersonDomain;

[ApiController]
[Route("[controller]/[action]")]
public class PersonController(IOptions<NerdyWeirdConfig> config, NerdyWeirdDatabase database) : ControllerBase
{
    public async Task<IActionResult> SendSignInLink(SendSignInLinkIncoming incoming)
    {
        // insert into Person values ('1c6ea2a0-3b70-4b01-bc27-97c45294d3f2', 'fabio@nerdyweirdwords.com', 'Fabio', 'Scagliola');

        var person = await database.People.FirstOrDefaultAsync(x => x.Email == incoming.Email);

        if (person == null)
        {
            return BadRequest("A person with this email doesn't exist in our database!");
        }

        var href = $"https://nerdyweirdwords.com/signin/{GetJwt(person)}";

        try
        {
            var sendGridClient = new SendGridClient(config.Value.TwilioSendGridApiKey);
            var from = new EmailAddress("fabio@nerdyweirdwords.com", "Fabio Scagliola");
            var to = new EmailAddress(incoming.Email, $"{person.FName} {person.LName}");
            var subject = "/nerdy|weird|words/";
            var htmlTextContent = $"""
                                   <p>Hello, {person.FName}!</p>
                                   <p>Step into the place where <a href="{href}">nerdy</a> thoughts shape <a href="{href}">weird</a> stories into written <a href="{href}">words</a>&hellip;</p>
                                   <p>Cheers,<br/>Fabio</p>
                                   """;
            var msg = MailHelper.CreateSingleEmail(from, to, subject, null, htmlTextContent);
            await sendGridClient.SendEmailAsync(msg);
        }
        catch (Exception e)
        {
            return StatusCode(500, "Something went wrong while attempting to send the link via email!");
        }

        return Ok();
    }

    [Authorize]
    public IActionResult IsAuthorized()
    {
        return Ok();
    }

    private string GetJwt(Person person)
    {
        var issuedAt = DateTimeOffset.Now;

        var claims = new List<Claim>
        {
            //new(JwtRegisteredClaimNames.Aud, ""),
            new(JwtRegisteredClaimNames.Email, person.Email),
            //new (JwtRegisteredClaimNames.Exp, $"{issuedAt.AddSeconds(Duration).ToUnixTimeSeconds()}"),
            new(JwtRegisteredClaimNames.FamilyName, person.FName),
            new(JwtRegisteredClaimNames.GivenName, person.LName),
            new(JwtRegisteredClaimNames.Iat, $"{issuedAt.ToUnixTimeSeconds()}"),
            new(JwtRegisteredClaimNames.Iss, config.Value.Issuer),
            new(JwtRegisteredClaimNames.Sub, person.Id.ToString()),
        };

        var rsa = RSA.Create();
        rsa.ImportFromPem(System.IO.File.ReadAllText("cert.pem").ToCharArray());

        var signingCredentials = new SigningCredentials(new RsaSecurityKey(rsa), SecurityAlgorithms.RsaSha256);

        var header = new JwtHeader(signingCredentials) { { "kid", "1" } };

        var jwtPayload = new JwtPayload(claims);

        var token = new JwtSecurityToken(header, jwtPayload);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}