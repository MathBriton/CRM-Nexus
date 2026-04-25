using DevStore.Domain.Entities;
using FluentAssertions;

namespace DevStore.UnitTests.Domain;

public class ProductTests
{
    [Fact]
    public void Construtor_DadosValidos_CriaProdutoCorretamente()
    {
        var produto = new Product("Notebook", "Notebook gamer", 4999.99m, 10);

        produto.Name.Should().Be("Notebook");
        produto.Description.Should().Be("Notebook gamer");
        produto.Price.Should().Be(4999.99m);
        produto.Stock.Should().Be(10);
        produto.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Construtor_NomeVazioOuEspacos_LancaArgumentException(string nomeInvalido)
    {
        var acao = () => new Product(nomeInvalido, "Descrição", 100m, 1);

        acao.Should().Throw<ArgumentException>();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-100)]
    public void Construtor_PrecoZeroOuNegativo_LancaArgumentOutOfRangeException(decimal precoInvalido)
    {
        var acao = () => new Product("Produto", "Descrição", precoInvalido, 1);

        acao.Should().Throw<ArgumentOutOfRangeException>();
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(-50)]
    public void Construtor_EstoqueNegativo_LancaArgumentOutOfRangeException(int estoqueInvalido)
    {
        var acao = () => new Product("Produto", "Descrição", 100m, estoqueInvalido);

        acao.Should().Throw<ArgumentOutOfRangeException>();
    }

    [Fact]
    public void Construtor_EstoqueZero_CriaProdutoComSucesso()
    {
        var acao = () => new Product("Produto", "Descrição", 100m, 0);

        acao.Should().NotThrow();
    }

    [Fact]
    public void Update_DadosValidos_AtualizaPropriedades()
    {
        var produto = new Product("Nome antigo", "Descrição antiga", 100m, 5);

        produto.Update("Nome novo", "Descrição nova", 200m, 15);

        produto.Name.Should().Be("Nome novo");
        produto.Description.Should().Be("Descrição nova");
        produto.Price.Should().Be(200m);
        produto.Stock.Should().Be(15);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Update_NomeVazioOuEspacos_LancaArgumentException(string nomeInvalido)
    {
        var produto = new Product("Produto", "Descrição", 100m, 1);

        var acao = () => produto.Update(nomeInvalido, "Descrição", 100m, 1);

        acao.Should().Throw<ArgumentException>();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void Update_PrecoZeroOuNegativo_LancaArgumentOutOfRangeException(decimal precoInvalido)
    {
        var produto = new Product("Produto", "Descrição", 100m, 1);

        var acao = () => produto.Update("Produto", "Descrição", precoInvalido, 1);

        acao.Should().Throw<ArgumentOutOfRangeException>();
    }

    [Fact]
    public void Update_EstoqueNegativo_LancaArgumentOutOfRangeException()
    {
        var produto = new Product("Produto", "Descrição", 100m, 1);

        var acao = () => produto.Update("Produto", "Descrição", 100m, -1);

        acao.Should().Throw<ArgumentOutOfRangeException>();
    }
}
