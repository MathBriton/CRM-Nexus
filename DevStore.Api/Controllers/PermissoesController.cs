using DevStore.Api.DTOs;
using DevStore.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DevStore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/permissoes")]
public class PermissoesController(IPermissaoNexusRepository repository) : ControllerBase
{
    [HttpGet("usuarios")]
    public async Task<IActionResult> ListarUsuarios()
    {
        var usuarios = await repository.ListarUsuariosAsync();
        var response = usuarios.Select(u =>
            new NexusUsuarioResponse(u.Id, u.Matricula, u.Filial, u.Nome, u.Login));
        return Ok(response);
    }

    [HttpGet("usuario/{matricula}/{filial}")]
    public async Task<IActionResult> CarregarPermissoes(string matricula, string filial)
    {
        var (servicos, consultas) = await repository.CarregarPermissoesAsync(matricula, filial);

        var response = new PermissoesUsuarioResponse(
            servicos.Select(i => new ItemPermissaoResponse(i.Codigo, i.Nome, i.Categoria, i.Habilitado)),
            consultas.Select(i => new ItemPermissaoResponse(i.Codigo, i.Nome, i.Categoria, i.Habilitado)));

        return Ok(response);
    }

    [HttpPost("usuario/{matricula}/{filial}")]
    public async Task<IActionResult> SalvarPermissoes(
        string matricula, string filial,
        [FromBody] SalvarPermissoesRequest request)
    {
        await repository.SalvarPermissoesAsync(
            matricula, filial,
            request.ServicosHabilitados,
            request.ConsultasHabilitadas);

        return NoContent();
    }

    [HttpPost("usuario/{matricula}/{filial}/importar")]
    public async Task<IActionResult> ImportarPermissoes(
        string matricula, string filial,
        [FromBody] ImportarPermissoesRequest request)
    {
        await repository.ImportarPermissoesAsync(
            request.MatriculaOrigem, request.FilialOrigem,
            matricula, filial);

        return NoContent();
    }
}
