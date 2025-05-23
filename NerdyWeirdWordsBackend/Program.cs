using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace com.nerdyweirdwords.backend;

public class Program
{
    public static void Main(string[] args)
    {
        var webApplicationBuilder = WebApplication.CreateBuilder(args);

        var configurationSection = webApplicationBuilder.Configuration.GetSection(nameof(NerdyWeirdConfig));
        webApplicationBuilder.Services.Configure<NerdyWeirdConfig>(configurationSection);
        var config = configurationSection.Get<NerdyWeirdConfig>()!;

        webApplicationBuilder.Services.AddControllers();
        webApplicationBuilder.Services.AddOpenApi();

        var rsa = RSA.Create();
        rsa.ImportFromPem(System.IO.File.ReadAllText("cert.pem").ToCharArray());

        webApplicationBuilder.Services.AddAuthentication().AddJwtBearer(opts =>
        {
            opts.TokenValidationParameters = new TokenValidationParameters
            {
                IssuerSigningKey = new RsaSecurityKey(rsa),
                ValidIssuer = config.Issuer,
                ValidateAudience = false,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = false,
            };
        });

        webApplicationBuilder.Services.AddDbContext<NerdyWeirdDatabase>(opts =>
        {
            var connectionString = webApplicationBuilder.Configuration.GetConnectionString("ConnectionString"); // TODO: Move the connection string to the config object
            var mySqlServerVersion = new MySqlServerVersion(new Version(11, 0, 0));
            opts.UseMySql(connectionString, mySqlServerVersion);
        });

        webApplicationBuilder.WebHost.UseSentry(opts =>
        {
            opts.Dsn = config.SentryDataSourceName;
        });

        var webApplication = webApplicationBuilder.Build();

        if (webApplication.Environment.IsDevelopment())
        {
            webApplication.MapOpenApi();
        }

        webApplication.UseHttpsRedirection();
        webApplication.UseAuthorization();
        webApplication.MapControllers();

        webApplication.UseCors(configurePolicy =>
        {
            configurePolicy.AllowAnyOrigin();
        });

        webApplication.Run();
    }
}