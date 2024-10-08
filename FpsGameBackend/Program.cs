using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();


/* builder.Services.AddDbContext<GameDbContext>(options =>
    options.UseSqlServer("YourConnectionString"));*/

// Add SignalR
builder.Services.AddSignalR();

app.MapHub<GameHub>("/gamehub");

app.Run();
