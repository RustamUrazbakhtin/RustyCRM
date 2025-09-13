using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RustyCRM.Server.Data;
using RustyCRM.Server.Models;
using Microsoft.AspNetCore.Routing;

var builder = WebApplication.CreateBuilder(args);

// ---------- DB ----------
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// ---------- Identity ----------
builder.Services
    .AddIdentityCore<ApplicationUser>(opt =>
    {
        opt.User.RequireUniqueEmail = true;
        opt.Password.RequiredLength = 6;
        opt.Password.RequireDigit = false;
        opt.Password.RequireUppercase = false;
        opt.Password.RequireNonAlphanumeric = false;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddSignInManager<SignInManager<ApplicationUser>>();

// ---------- JWT ----------
var jwt = builder.Configuration.GetSection("Jwt");
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = signingKey,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// ---------- CORS (для Vite) ----------
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("vite",
        p => p.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// ---------- Controllers/Swagger ----------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ---------- Static SPA (если раздаёшь сборку фронта из /dist) ----------
app.UseDefaultFiles();
app.UseStaticFiles();

// ---------- Swagger ----------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("vite");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/api/health", () => Results.Ok(new { ok = true, time = DateTime.UtcNow }));

app.MapGet("/__routes", (EndpointDataSource eds) =>
    Results.Ok(eds.Endpoints.Select(e => e.DisplayName)));

// ---------- MINIMAL AUTH API ----------
app.MapPost("/api/auth/register", async (
    UserManager<ApplicationUser> users,
    IConfiguration cfg,
    RegisterDto dto) =>
{
    var user = new ApplicationUser
    {
        UserName = dto.Email,
        Email = dto.Email,
        FirstName = dto.FirstName ?? string.Empty,
        LastName = dto.LastName ?? string.Empty,
        CompanyName = dto.CompanyName
    };

    var result = await users.CreateAsync(user, dto.Password);
    if (!result.Succeeded)
        return Results.BadRequest(result.Errors.Select(e => e.Description));

    var token = JwtHelper.CreateToken(user, cfg);
    return Results.Ok(new { token });
});

app.MapPost("/api/auth/login", async (
    SignInManager<ApplicationUser> signIn,
    UserManager<ApplicationUser> users,
    IConfiguration cfg,
    LoginDto dto) =>
{
    var user = await users.FindByEmailAsync(dto.Email);
    if (user is null) return Results.Unauthorized();

    var check = await signIn.CheckPasswordSignInAsync(user, dto.Password, false);
    if (!check.Succeeded) return Results.Unauthorized();

    user.LastLoginAt = DateTime.UtcNow;
    await users.UpdateAsync(user);

    var token = JwtHelper.CreateToken(user, cfg);
    return Results.Ok(new { token });
});

app.MapGet("/api/auth/me", async (UserManager<ApplicationUser> users, HttpContext http) =>
{
    var id = http.User?.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
    if (id is null) return Results.Unauthorized();
    var u = await users.FindByIdAsync(id);
    return Results.Ok(new { u!.Id, u.Email, u.FirstName, u.LastName, u.CompanyName });
}).RequireAuthorization();

// ---------- SPA fallback ----------
//app.MapFallbackToFile("/index.html");

app.Run();


// ===== DTOs & JWT helper =====
record RegisterDto(string Email, string Password, string? FirstName, string? LastName, string? CompanyName);
record LoginDto(string Email, string Password);

static class JwtHelper
{
    public static string CreateToken(ApplicationUser user, IConfiguration cfg)
    {
        var jwt = cfg.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new System.Security.Claims.Claim("sub", user.Id),
            new System.Security.Claims.Claim("email", user.Email ?? ""),
            new System.Security.Claims.Claim("name", $"{user.FirstName} {user.LastName}".Trim())
        };

        var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(int.Parse(jwt["ExpiresMinutes"]!)),
            signingCredentials: creds);

        return new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);
    }
}
