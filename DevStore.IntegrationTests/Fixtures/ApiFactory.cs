using System.Net.Http.Headers;
using System.Net.Http.Json;
using DevStore.Api.DTOs;
using DevStore.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DevStore.IntegrationTests.Fixtures;

public class ApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private SqliteConnection _connection = null!;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<DevStoreDbContext>));

            if (descriptor is not null)
                services.Remove(descriptor);

            _connection = new SqliteConnection("DataSource=:memory:");
            _connection.Open();

            services.AddDbContext<DevStoreDbContext>(options =>
                options.UseSqlite(_connection));
        });
    }

    public async Task InitializeAsync()
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DevStoreDbContext>();
        await db.Database.MigrateAsync();
    }

    public async Task<HttpClient> CreateAuthenticatedClientAsync(
        string username = "admin", string password = "Admin@123")
    {
        var client = CreateClient();
        var response = await client.PostAsJsonAsync("/auth/login", new { username, password });
        response.EnsureSuccessStatusCode();
        var login = await response.Content.ReadFromJsonAsync<LoginResponse>();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", login!.Token);
        return client;
    }

    public new async Task DisposeAsync()
    {
        await _connection.DisposeAsync();
        await base.DisposeAsync();
    }
}
