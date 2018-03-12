using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using System;
using System.Linq;
using adg.Models;
using adg.Data;

namespace adg.Data
{


    public class DatabaseInitializer
    {
        private readonly RequestDelegate _next;

        public DatabaseInitializer(RequestDelegate next)
        {
            _next = next;
        }

        public Task Invoke(HttpContext httpContext)
        {

            return _next(httpContext);
        }
    }

    public static class DbInitializerExtensions
    {
        public static IApplicationBuilder UseMiddlewareClassTemplate(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<DatabaseInitializer>();
        }
    }



    public class DatabaseContextInitializer : IDatabaseContextInitializer
    {
        private readonly DatabaseContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public DatabaseContextInitializer(DatabaseContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _roleManager = roleManager;
            _userManager = userManager;
        }

        public async Task Initialize()
        {
            var email = "test@test.test";
            if (await _userManager.FindByEmailAsync(email) == null)
            {
                var seed = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                };

                await _userManager.CreateAsync(seed, "T3st!ng");
            }
            _context.SaveChanges();
        }
    }


    public interface IDatabaseContextInitializer
    {
        Task Initialize();
    }



    public class DesignTimeDatabaseContext : IDesignTimeDbContextFactory<DatabaseContext>
    {
        public DatabaseContext CreateDbContext(string[] args)
        {
            var config = new ConfigurationBuilder()
                  .SetBasePath(System.IO.Directory.GetCurrentDirectory())
                  .AddJsonFile("appsettings.json")
                  .Build();

            var options = new DbContextOptionsBuilder<DatabaseContext>();
            options.UseSqlite(config.GetConnectionString("DefaultConnectionString"));

            return new DatabaseContext(options.Options);
        }
    }
}
