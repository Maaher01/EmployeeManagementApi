using EmployeeManagementApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowedOrigins",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//builder.Services.AddDbContext<EmployeeDbContext>(options => 
//    options.UseSqlServer(builder.Configuration.GetConnectionString("EmployeeAppCon"))
//);
builder.Services.AddDbContext<EmployeeDbContext>(options => 
    options.UseInMemoryDatabase("TestDb")
);

var app = builder.Build();

app.UseCors("AllowedOrigins");

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Photos")),
    RequestPath = "/Photos"
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
