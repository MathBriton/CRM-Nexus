using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using DevStore.Api.DTOs;
using DevStore.Domain.Enums;
using DevStore.Infrastructure.Data;
using DevStore.IntegrationTests.Fixtures;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;

namespace DevStore.IntegrationTests.Controllers;

public class UsersControllerTests(ApiFactory factory)
    : IClassFixture<ApiFactory>, IAsyncLifetime
{
    private HttpClient _admin = null!;

    public async Task InitializeAsync()
    {
        _admin = await factory.CreateAuthenticatedClientAsync();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    // ── Autenticação / autorização ─────────────────────────────────────────────

    [Fact]
    public async Task GET_Users_SemToken_Retorna401()
    {
        var client = factory.CreateClient();
        var resposta = await client.GetAsync("/users");
        resposta.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    // ── Listar ────────────────────────────────────────────────────────────────

    [Fact]
    public async Task GET_Users_ComAdmin_Retorna200ComLista()
    {
        var resposta = await _admin.GetAsync("/users");

        resposta.StatusCode.Should().Be(HttpStatusCode.OK);
        var lista = await resposta.Content.ReadFromJsonAsync<List<JsonElement>>();
        lista.Should().NotBeNull();
        lista!.Should().NotBeEmpty();
    }

    // ── Buscar por id ─────────────────────────────────────────────────────────

    [Fact]
    public async Task GET_UsersId_IdInexistente_Retorna404()
    {
        var resposta = await _admin.GetAsync("/users/99999");
        resposta.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── Criar ─────────────────────────────────────────────────────────────────

    [Fact]
    public async Task POST_Users_DadosValidos_Retorna201()
    {
        var request = new CreateUserRequest(
            "novousuario", "Novo Usuário", "novo@dev.com", "Senha@123", UserRole.User);

        var resposta = await _admin.PostAsJsonAsync("/users", request);

        resposta.StatusCode.Should().Be(HttpStatusCode.Created);
        resposta.Headers.Location.Should().NotBeNull();
    }

    [Fact]
    public async Task POST_Users_Retorna201_EUsuarioPodeLogar()
    {
        var username = $"user_{Guid.NewGuid():N}"[..12];
        var request = new CreateUserRequest(
            username, "Usuário Teste", $"{username}@dev.com", "Senha@123", UserRole.User);

        var criar = await _admin.PostAsJsonAsync("/users", request);
        criar.StatusCode.Should().Be(HttpStatusCode.Created);

        var loginClient = factory.CreateClient();
        var login = await loginClient.PostAsJsonAsync("/auth/login",
            new { username, password = "Senha@123" });
        login.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    // ── Atualizar ─────────────────────────────────────────────────────────────

    [Fact]
    public async Task PUT_UsersId_IdExistente_Retorna204()
    {
        var id = await CriarUsuarioNoBancoAsync("upd");
        var request = new UpdateUserRequest("Nome Atualizado", "atualizado@dev.com");

        var resposta = await _admin.PutAsJsonAsync($"/users/{id}", request);

        resposta.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task PUT_UsersId_IdInexistente_Retorna404()
    {
        var request = new UpdateUserRequest("Nome", "email@dev.com");
        var resposta = await _admin.PutAsJsonAsync("/users/99999", request);
        resposta.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── Alterar papel ─────────────────────────────────────────────────────────

    [Fact]
    public async Task PUT_UsersIdRole_AlteraRole_Retorna204()
    {
        var id = await CriarUsuarioNoBancoAsync("role");
        var request = new ChangeRoleRequest(UserRole.Manager);

        var resposta = await _admin.PutAsJsonAsync($"/users/{id}/role", request);

        resposta.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    // ── Desativar ─────────────────────────────────────────────────────────────

    [Fact]
    public async Task DELETE_UsersId_IdExistente_Retorna204()
    {
        var id = await CriarUsuarioNoBancoAsync("del");

        var resposta = await _admin.DeleteAsync($"/users/{id}");

        resposta.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task DELETE_UsersId_IdInexistente_Retorna404()
    {
        var resposta = await _admin.DeleteAsync("/users/99999");
        resposta.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private async Task<int> CriarUsuarioNoBancoAsync(string sufixo)
    {
        var username = $"usr_{sufixo}_{Guid.NewGuid():N}"[..14];
        var request = new CreateUserRequest(
            username, $"Usuário {sufixo}", $"{username}@dev.com", "Senha@123", UserRole.User);

        var resposta = await _admin.PostAsJsonAsync("/users", request);
        resposta.EnsureSuccessStatusCode();

        var json = await resposta.Content.ReadFromJsonAsync<JsonElement>();
        return json.GetProperty("id").GetInt32();
    }
}
