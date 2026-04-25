using DevStore.Domain.Entities;
using DevStore.Domain.Enums;
using FluentAssertions;

namespace DevStore.UnitTests.Domain;

public class UserTests
{
    [Fact]
    public void Construtor_DadosValidos_CriaUsuarioCorretamente()
    {
        var user = new User("joao", "João Silva", "joao@dev.com", UserRole.Manager);

        user.Username.Should().Be("joao");
        user.Name.Should().Be("João Silva");
        user.Email.Should().Be("joao@dev.com");
        user.Role.Should().Be(UserRole.Manager);
        user.IsActive.Should().BeTrue();
        user.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public void Construtor_SemRole_UsaUserPorPadrao()
    {
        var user = new User("maria", "Maria", "maria@dev.com");
        user.Role.Should().Be(UserRole.User);
    }

    [Theory]
    [InlineData("", "Nome", "email@dev.com")]
    [InlineData("   ", "Nome", "email@dev.com")]
    [InlineData("user", "", "email@dev.com")]
    [InlineData("user", "   ", "email@dev.com")]
    [InlineData("user", "Nome", "")]
    [InlineData("user", "Nome", "   ")]
    public void Construtor_CamposObrigatoriosVazios_LancaArgumentException(
        string username, string name, string email)
    {
        var acao = () => new User(username, name, email);
        acao.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Construtor_NormalizaUsernameEEmailParaMinusculas()
    {
        var user = new User("ADMIN", "Admin", "ADMIN@DEV.COM");
        user.Username.Should().Be("admin");
        user.Email.Should().Be("admin@dev.com");
    }

    [Fact]
    public void SetPasswordHash_HashValido_DefineHash()
    {
        var user = new User("user", "User", "user@dev.com");
        user.SetPasswordHash("hash_bcrypt_simulado");
        user.PasswordHash.Should().Be("hash_bcrypt_simulado");
    }

    [Fact]
    public void SetPasswordHash_HashVazio_LancaArgumentException()
    {
        var user = new User("user", "User", "user@dev.com");
        var acao = () => user.SetPasswordHash("");
        acao.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Update_DadosValidos_AtualizaNomeEEmail()
    {
        var user = new User("user", "Nome Antigo", "antigo@dev.com");
        user.Update("Nome Novo", "novo@dev.com");
        user.Name.Should().Be("Nome Novo");
        user.Email.Should().Be("novo@dev.com");
    }

    [Fact]
    public void AlterarRole_MudaRole()
    {
        var user = new User("user", "User", "user@dev.com", UserRole.User);
        user.AlterarRole(UserRole.Admin);
        user.Role.Should().Be(UserRole.Admin);
    }

    [Fact]
    public void Desativar_DefineIsActiveComoFalso()
    {
        var user = new User("user", "User", "user@dev.com");
        user.Desativar();
        user.IsActive.Should().BeFalse();
    }

    [Fact]
    public void Reativar_DefineIsActiveComoVerdadeiro()
    {
        var user = new User("user", "User", "user@dev.com");
        user.Desativar();
        user.Reativar();
        user.IsActive.Should().BeTrue();
    }
}
