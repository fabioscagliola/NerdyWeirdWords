using Microsoft.EntityFrameworkCore;

namespace com.nerdyweirdwords.backend;

public class Program
{
    public static void Main(string[] args)
    {
        WebApplicationBuilder webApplicationBuilder = WebApplication.CreateBuilder(args);

        webApplicationBuilder.Services.AddControllers();
        webApplicationBuilder.Services.AddOpenApi();
        webApplicationBuilder.Services.AddDbContext<NerdyWeirdWordsBackendDbContext>(dbContextOptionsBuilder =>
        {
            string? connectionString = webApplicationBuilder.Configuration.GetConnectionString("ConnectionString");
            MySqlServerVersion mySqlServerVersion = new (new Version(11, 0, 0));
            dbContextOptionsBuilder.UseMySql(connectionString, mySqlServerVersion);
        });

        WebApplication webApplication = webApplicationBuilder.Build();

        if (webApplication.Environment.IsDevelopment())
        {
            webApplication.MapOpenApi();
        }

        webApplication.UseHttpsRedirection();
        webApplication.UseAuthorization();
        webApplication.MapControllers();
        webApplication.Run();
    }
}