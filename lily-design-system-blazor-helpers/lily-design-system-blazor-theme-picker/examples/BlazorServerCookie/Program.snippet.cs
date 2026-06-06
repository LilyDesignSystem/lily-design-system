// Program.cs — Blazor Web App with cookie-backed theme persistence.
//
// This snippet shows the DI and routing setup. Adapt to your actual
// Program.cs.

using Microsoft.AspNetCore.Components.Web;

var builder = WebApplication.CreateBuilder(args);

// Razor Components + Interactive Server render mode.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

// Required so App.razor can read the request cookie.
builder.Services.AddHttpContextAccessor();

// HttpClient for SettingsPage to POST back to the cookie endpoint.
builder.Services.AddScoped(sp => new HttpClient
{
    BaseAddress = new Uri(sp.GetRequiredService<NavigationManager>().BaseUri),
});

var app = builder.Build();

// Static asset middleware for the themes directory.
app.UseStaticFiles();

// The cookie-write endpoint.
app.MapPost("/api/theme", async (HttpContext ctx) =>
{
    var body = await ctx.Request.ReadFromJsonAsync<ThemeBody>();
    var slug = body?.Theme ?? "light";

    // Validate against known themes.
    if (slug is not ("light" or "dark" or "abyss"))
    {
        return Results.BadRequest(new { error = "Unknown theme" });
    }

    ctx.Response.Cookies.Append("theme", slug, new CookieOptions
    {
        Path = "/",
        SameSite = SameSiteMode.Lax,
        MaxAge = TimeSpan.FromDays(365),
        HttpOnly = false, // client-side JS reads it via document.cookie too
    });
    return Results.NoContent();
});

// Routes the Blazor Web App.
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();

record ThemeBody(string Theme);

// Stand-ins so this snippet compiles in isolation. Remove these in
// your real Program.cs — Blazor and ASP.NET Core provide the real
// classes.
internal sealed class NavigationManager
{
    public string BaseUri { get; } = "https://localhost/";
}
