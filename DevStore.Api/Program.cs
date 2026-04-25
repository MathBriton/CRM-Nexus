using System.Text;
using BCrypt.Net;
using DevStore.Domain.Entities;
using DevStore.Domain.Enums;
using DevStore.Domain.Interfaces;
using DevStore.Infrastructure.Data;
using DevStore.Infrastructure.Repositories;
using DevStore.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ── Banco de dados ─────────────────────────────────────────────────────────────
// Produção: SQL Server com autenticação integrada Windows (Active Directory)
// Desenvolvimento: SQLite como fallback
var sqlServerConn = builder.Configuration.GetConnectionString("SqlServer");

if (!string.IsNullOrWhiteSpace(sqlServerConn))
{
    builder.Services.AddDbContext<DevStoreDbContext>(opt =>
        opt.UseSqlServer(sqlServerConn));
}
else
{
    builder.Services.AddDbContext<DevStoreDbContext>(opt =>
        opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
}

// ── Repositórios e Serviços ────────────────────────────────────────────────────
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITokenService, JwtTokenService>();

// ── JWT ────────────────────────────────────────────────────────────────────────
var jwtSecret = builder.Configuration["Jwt:Secret"]!;
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer = !string.IsNullOrEmpty(jwtIssuer),
            ValidIssuer = jwtIssuer,
            ValidateAudience = !string.IsNullOrEmpty(jwtAudience),
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
        };
    });

builder.Services.AddAuthorization();

// ── API ────────────────────────────────────────────────────────────────────────
builder.Services.AddOpenApi();
builder.Services.AddControllers();

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

// ── Migrations + Seed ──────────────────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DevStoreDbContext>();
    await db.Database.MigrateAsync();

    if (!await db.Users.AnyAsync())
    {
        var admin = new User("admin", "Administrador", "admin@devstore.com", UserRole.Admin);
        admin.SetPasswordHash(BCrypt.Net.BCrypt.HashPassword("Admin@123"));
        db.Users.Add(admin);
        await db.SaveChangesAsync();

        if (app.Environment.IsDevelopment())
            app.Logger.LogInformation("Usuário admin criado com senha: Admin@123");
    }
}

// ── Pipeline ───────────────────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

public partial class Program { }
