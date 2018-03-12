using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using adg.Models;
using adg.Data;

namespace adg
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var config = new ConfigurationBuilder()
                  .SetBasePath(Directory.GetCurrentDirectory())
                  .AddJsonFile("appsettings.json")
                  .Build();

            var host = BuildHost(config["ServerBindingUrl"], args);
            using (var scope = host.Services.CreateScope())
            {
                var dbInitializer = scope.ServiceProvider.GetRequiredService<IDatabaseContextInitializer>();
                var env = scope.ServiceProvider.GetRequiredService<IHostingEnvironment>();

                if (env.IsDevelopment())
                {
                    // Seed the database in development mode
                    dbInitializer.Initialize();
                }
            }
            host.Run();
        }

        public static IWebHost BuildHost(string serverBindingUrl, string[] args) =>
            WebHost.CreateDefaultBuilder(args)
            .UseContentRoot(Directory.GetCurrentDirectory())
            .UseUrls(serverBindingUrl)
                .UseStartup<Startup>()
                .Build();
    }
}
