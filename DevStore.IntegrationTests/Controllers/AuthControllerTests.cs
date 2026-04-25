using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using DevStore.IntegrationTests.Fixtures;
using FluentAssertions;

namespace DevStore.IntegrationTests.Controllers;

public class AuthControllerTests(ApiFactory factory)
    : IClassFixture<ApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task POST_Login_CredenciaisValidas_Retorna200ComToken()
    {
        var response = await _client.PostAsJsonAsync("/auth/login",
            new { username = "admin", password = "Admin@123" });

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("token").GetString().Should().NotBeNullOrEmpty();
        json.GetProperty("name").GetString().Should().Be("Administrador");
        json.GetProperty("role").GetString().Should().Be("Admin");
        json.GetProperty("expiresAt").GetDateTime().Should().BeAfter(DateTime.UtcNow);
    }

    [Fact]
    public async Task POST_Login_SenhaInvalida_Retorna401()
    {
        var response = await _client.PostAsJsonAsync("/auth/login",
            new { username = "admin", password = "senha_errada" });

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("message").GetString().Should().Be("Credenciais inválidas.");
    }

    [Fact]
    public async Task POST_Login_UsuarioInexistente_Retorna401()
    {
        var response = await _client.PostAsJsonAsync("/auth/login",
            new { username = "nao_existe", password = "qualquer" });

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GET_Me_SemToken_Retorna401()
    {
        var response = await _client.GetAsync("/auth/me");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GET_Me_ComTokenValido_Retorna200ComDadosDoUsuario()
    {
        var clientAutenticado = await factory.CreateAuthenticatedClientAsync();

        var response = await clientAutenticado.GetAsync("/auth/me");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("username").GetString().Should().Be("admin");
        json.GetProperty("name").GetString().Should().Be("Administrador");
        json.GetProperty("role").GetString().Should().Be("Admin");
    }
}
