using EmployeeManagementApi.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.ConfigureCORS(builder.Configuration)
                .AddSwaggerExplorer()
                .InjectDbContext(builder.Configuration)
                .AddIdentityHandlersAndStores()
                .ConfigureIdentityOptions()
                .AddIdentityAuth(builder.Configuration);

var app = builder.Build();

app.ConfigureSwaggerExplorer();
app.UseCORSConfiguration();
app.UseStaticFilesConfiguration();
app.UseHttpsRedirection();
app.AddIdentityAuthMiddlewares();
app.MapControllers();

app.Run();
