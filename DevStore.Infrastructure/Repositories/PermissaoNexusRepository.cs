using DevStore.Domain.Entities;
using DevStore.Domain.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DevStore.Infrastructure.Repositories;

public class PermissaoNexusRepository(IConfiguration configuration) : IPermissaoNexusRepository
{
    private SqlConnection AbrirGestao() =>
        new(configuration.GetConnectionString("Nexus-Gestao")
            ?? throw new InvalidOperationException("Connection string 'Nexus-Gestao' não configurada."));

    private SqlConnection AbrirAuditoria() =>
        new(configuration.GetConnectionString("Nexus-Auditoria")
            ?? throw new InvalidOperationException("Connection string 'Nexus-Auditoria' não configurada."));

    public async Task<IEnumerable<NexusUsuario>> ListarUsuariosAsync()
    {
        const string sql = """
            SELECT CRM_R_E_C_N_O, CRM_COD, EMP_CODIGO, CRM_NOME, CRM_LOGIN
            FROM CRM_DTI
            WHERE CRM_D_E_L_E_T <> '*'
            ORDER BY CRM_NOME
            """;

        await using var conn = AbrirGestao();
        await conn.OpenAsync();
        await using var cmd = new SqlCommand(sql, conn);
        await using var reader = await cmd.ExecuteReaderAsync();

        var lista = new List<NexusUsuario>();
        while (await reader.ReadAsync())
        {
            lista.Add(new NexusUsuario(
                reader.GetInt32(0),
                reader.GetString(1).Trim(),
                reader.GetString(2).Trim(),
                reader.GetString(3).Trim(),
                reader.GetString(4).Trim()));
        }
        return lista;
    }

    public async Task<(IEnumerable<ItemPermissao> Servicos, IEnumerable<ItemPermissao> Consultas)> CarregarPermissoesAsync(
        string matricula, string filial)
    {
        var servicos = await CarregarServicosAsync(matricula, filial);
        var consultas = await CarregarConsultasAsync(matricula, filial);
        return (servicos, consultas);
    }

    private async Task<List<ItemPermissao>> CarregarServicosAsync(string matricula, string filial)
    {
        const string sql = """
            SELECT SERVICO.LIN_COD, SERVICO.LIN_DESC, SUBMENU.SUB_MENU,
                   ISNULL(ACESSO.SRV_CODSERV, 0) AS HABILITADO
            FROM LINKS SERVICO
            INNER JOIN SUBMENU ON SERVICO.SUB_COD = SUBMENU.SUB_COD
            LEFT JOIN (
                SELECT SRV_CODSERV, LIN_COD FROM MONTAMENU
                WHERE CRM_COD = @mat AND FILIAL = @fil AND ISNULL(MON_D_E_L_E_T, '') = ''
            ) ACESSO ON SERVICO.LIN_COD = ACESSO.LIN_COD
            WHERE ISNULL(SERVICO.LIN_D_E_L_E_T, '') = ''
              AND ISNULL(SUBMENU.SUB_D_E_L_E_T, '') = ''
            ORDER BY SUBMENU.SUB_MENU, SERVICO.LIN_DESC
            """;

        return await ExecutarConsultaItemAsync(sql, matricula, filial, "LIN_COD", "LIN_DESC", "SUB_MENU");
    }

    private async Task<List<ItemPermissao>> CarregarConsultasAsync(string matricula, string filial)
    {
        const string sql = """
            SELECT REL.REL_COD, REL.REL_QUERY, CAT.CAT_NOME,
                   ISNULL(ACESSO.SRV_CODSERV, 0) AS HABILITADO
            FROM RELATORIOSCAPA REL
            INNER JOIN CAT_RELATORIOS CAT ON REL.CAT_COD = CAT.CAT_COD
            LEFT JOIN (
                SELECT SRV_CODSERV, REL_COD FROM MONTARELAT
                WHERE CRM_COD = @mat AND FILIAL = @fil AND ISNULL(MON_D_E_L_E_T_E_D, '') = ''
            ) ACESSO ON REL.REL_COD = ACESSO.REL_COD
            WHERE ISNULL(REL_D_E_L_E_T_E_D, '') = ''
            ORDER BY CAT.CAT_NOME, REL.REL_QUERY
            """;

        return await ExecutarConsultaItemAsync(sql, matricula, filial, "REL_COD", "REL_QUERY", "CAT_NOME");
    }

    private async Task<List<ItemPermissao>> ExecutarConsultaItemAsync(
        string sql, string matricula, string filial,
        string colCodigo, string colNome, string colCategoria)
    {
        await using var conn = AbrirGestao();
        await conn.OpenAsync();
        await using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@mat", matricula);
        cmd.Parameters.AddWithValue("@fil", filial);

        await using var reader = await cmd.ExecuteReaderAsync();
        var itens = new List<ItemPermissao>();
        while (await reader.ReadAsync())
        {
            itens.Add(new ItemPermissao(
                reader[colCodigo].ToString()!.Trim(),
                reader[colNome].ToString()!.Trim(),
                reader[colCategoria].ToString()!.Trim(),
                Convert.ToInt32(reader["HABILITADO"]) == 1));
        }
        return itens;
    }

    public async Task SalvarPermissoesAsync(
        string matricula, string filial,
        IEnumerable<string> servicosHabilitados,
        IEnumerable<string> consultasHabilitadas)
    {
        await using var conn = AbrirGestao();
        await conn.OpenAsync();
        await using var tx = (SqlTransaction)await conn.BeginTransactionAsync();
        try
        {
            await LimparPermissoesAsync(conn, tx, matricula, filial);
            await InserirServicosAsync(conn, tx, matricula, filial, servicosHabilitados);
            await InserirConsultasAsync(conn, tx, matricula, filial, consultasHabilitadas);
            await tx.CommitAsync();
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    private static async Task LimparPermissoesAsync(SqlConnection conn, SqlTransaction tx, string matricula, string filial)
    {
        await using var cmd = new SqlCommand(
            "DELETE FROM MONTAMENU  WHERE CRM_COD = @mat AND FILIAL = @fil;" +
            "DELETE FROM MONTARELAT WHERE CRM_COD = @mat AND FILIAL = @fil", conn, tx);
        cmd.Parameters.AddWithValue("@mat", matricula);
        cmd.Parameters.AddWithValue("@fil", filial);
        await cmd.ExecuteNonQueryAsync();
    }

    private static async Task InserirServicosAsync(
        SqlConnection conn, SqlTransaction tx,
        string matricula, string filial, IEnumerable<string> codigos)
    {
        const string sql = """
            INSERT INTO MONTAMENU (CRM_COD, SRV_CODSERV, LIN_COD, MON_PERSONAL, MON_D_E_L_E_T, CRM_TIPO, FILIAL)
            VALUES (@mat, 1, @cod, 'S', '', 1, @fil)
            """;

        await using var cmd = new SqlCommand(sql, conn, tx);
        cmd.Parameters.AddWithValue("@mat", matricula);
        cmd.Parameters.AddWithValue("@fil", filial);
        var pCod = cmd.Parameters.Add("@cod", System.Data.SqlDbType.VarChar);

        foreach (var codigo in codigos)
        {
            pCod.Value = codigo;
            await cmd.ExecuteNonQueryAsync();
        }
    }

    private static async Task InserirConsultasAsync(
        SqlConnection conn, SqlTransaction tx,
        string matricula, string filial, IEnumerable<string> codigos)
    {
        // R_E_C_N_O_ é chave da tabela — usa sequência baseada em MAX para evitar conflito
        const string sql = """
            INSERT INTO MONTARELAT (CRM_COD, SRV_CODSERV, REL_COD, MON_PERSONAL, MON_D_E_L_E_T_E_D, R_E_C_N_O_, CRM_TIPO, FILIAL)
            SELECT @mat, 1, @cod, 'S', '',
                   (SELECT ISNULL(MAX(R_E_C_N_O_), 0) + 1 FROM MONTARELAT WITH (NOLOCK)), 1, @fil
            """;

        await using var cmd = new SqlCommand(sql, conn, tx);
        cmd.Parameters.AddWithValue("@mat", matricula);
        cmd.Parameters.AddWithValue("@fil", filial);
        var pCod = cmd.Parameters.Add("@cod", System.Data.SqlDbType.VarChar);

        foreach (var codigo in codigos)
        {
            pCod.Value = codigo;
            await cmd.ExecuteNonQueryAsync();
        }
    }

    public async Task ImportarPermissoesAsync(
        string matriculaOrigem, string filialOrigem,
        string matriculaDestino, string filialDestino)
    {
        await using var conn = AbrirGestao();
        await conn.OpenAsync();
        await using var tx = (SqlTransaction)await conn.BeginTransactionAsync();
        try
        {
            await LimparPermissoesAsync(conn, tx, matriculaDestino, filialDestino);
            await CopiarMontamenuAsync(conn, tx, matriculaOrigem, filialOrigem, matriculaDestino, filialDestino);
            await CopiarMontarelatAsync(conn, tx, matriculaOrigem, filialOrigem, matriculaDestino, filialDestino);
            await tx.CommitAsync();
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    private static async Task CopiarMontamenuAsync(
        SqlConnection conn, SqlTransaction tx,
        string matOrig, string filOrig, string matDest, string filDest)
    {
        const string sql = """
            INSERT INTO MONTAMENU (CRM_COD, SRV_CODSERV, LIN_COD, MON_PERSONAL, MON_D_E_L_E_T, CRM_TIPO, FILIAL)
            SELECT @dest, SRV_CODSERV, LIN_COD, MON_PERSONAL, MON_D_E_L_E_T, CRM_TIPO, @filDest
            FROM MONTAMENU WHERE CRM_COD = @orig AND FILIAL = @filOrig
            """;

        await using var cmd = new SqlCommand(sql, conn, tx);
        cmd.Parameters.AddWithValue("@dest", matDest);
        cmd.Parameters.AddWithValue("@filDest", filDest);
        cmd.Parameters.AddWithValue("@orig", matOrig);
        cmd.Parameters.AddWithValue("@filOrig", filOrig);
        await cmd.ExecuteNonQueryAsync();
    }

    private static async Task CopiarMontarelatAsync(
        SqlConnection conn, SqlTransaction tx,
        string matOrig, string filOrig, string matDest, string filDest)
    {
        // Gera R_E_C_N_O_ único por linha com ROW_NUMBER para evitar colisão
        const string sql = """
            INSERT INTO MONTARELAT (CRM_COD, SRV_CODSERV, REL_COD, MON_PERSONAL, MON_D_E_L_E_T_E_D, R_E_C_N_O_, CRM_TIPO, FILIAL)
            SELECT @dest, SRV_CODSERV, REL_COD, MON_PERSONAL, MON_D_E_L_E_T_E_D,
                   (SELECT ISNULL(MAX(R_E_C_N_O_), 0) FROM MONTARELAT WITH (NOLOCK))
                   + ROW_NUMBER() OVER (ORDER BY REL_COD),
                   CRM_TIPO, @filDest
            FROM MONTARELAT WHERE CRM_COD = @orig AND FILIAL = @filOrig
            """;

        await using var cmd = new SqlCommand(sql, conn, tx);
        cmd.Parameters.AddWithValue("@dest", matDest);
        cmd.Parameters.AddWithValue("@filDest", filDest);
        cmd.Parameters.AddWithValue("@orig", matOrig);
        cmd.Parameters.AddWithValue("@filOrig", filOrig);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task RegistrarLogAsync(
        int idAcao, int idAlvo, string nomeAlvo, string acao, string nomeItem)
    {
        var descricao = $"Usuário {idAcao} {(acao == "habilitar" ? "habilitou" : "desabilitou")} {nomeItem} para {nomeAlvo}";
        const string sql = """
            INSERT INTO LogAtividade (IdUsuarioAcao, IdUsuarioAlvo, Rotina, Sistema, Acao, Descricao, DataCriacao)
            VALUES (@idAcao, @idAlvo, 'Acessos Usuários', 'Nexus', @acao, @descricao, GETDATE())
            """;

        await using var conn = AbrirAuditoria();
        await conn.OpenAsync();
        await using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@idAcao", idAcao);
        cmd.Parameters.AddWithValue("@idAlvo", idAlvo);
        cmd.Parameters.AddWithValue("@acao", acao);
        cmd.Parameters.AddWithValue("@descricao", descricao);
        await cmd.ExecuteNonQueryAsync();
    }
}
