using Microsoft.Extensions.FileProviders;

namespace EmployeeManagementApi.Extensions
{
    public static class AppConfigExtensions
    {
        private const string PolicyName = "AllowedOrigins";

        public static IServiceCollection ConfigureCORS(this IServiceCollection services, IConfiguration config)
        {
            //Add CORS
            services.AddCors(options =>
            {
                options.AddPolicy(PolicyName,
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                    });
            });

            return services;
        }

        public static WebApplication UseCORSConfiguration(this WebApplication app)
        {
            app.UseCors(PolicyName);
            return app;
        }

        public static IApplicationBuilder UseStaticFilesConfiguration(this IApplicationBuilder app)
        {
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "Photos")
                ),
                RequestPath = "/Photos"
            });

            return app;
        }
    }
}
