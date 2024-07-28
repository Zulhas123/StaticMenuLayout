using Contract;
using Entities;
using Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllersWithViews();
builder.Services.AddHttpContextAccessor(); // Add HttpContextAccessor for accessing HttpContext

// Add session support
builder.Services.AddDistributedMemoryCache(); // Register the memory cache
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Set session timeout
    options.Cookie.HttpOnly = true; // Makes the cookie inaccessible to client-side scripts
    options.Cookie.IsEssential = true; // Makes the session cookie essential
});

// Register application services
builder.Services.AddSingleton<ApplicationDbContext>(); // Consider whether Singleton is appropriate for your DbContext
builder.Services.AddScoped<IEmployee, EmployeeRepository>(); // Scoped is typically used for repository patterns

var app = builder.Build();

// Configure the HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts(); // Add HSTS in production environment
}

app.UseHttpsRedirection(); // Redirect HTTP requests to HTTPS
app.UseStaticFiles(); // Serve static files (e.g., CSS, JavaScript, images)

// Ensure that the session middleware is used before routing and authorization
app.UseSession();

app.UseRouting(); // Adds routing middleware

app.UseAuthorization(); // Adds authorization middleware

// Map routes for controllers with views
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"); // Default route

app.Run();
