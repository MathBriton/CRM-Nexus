using DevStore.Api.DTOs;
using DevStore.Domain.Entities;
using DevStore.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DevStore.Api.Controllers;

[Authorize]
[ApiController]
[Route("products")]
public class ProductsController(IProductRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await repository.GetAllAsync();
        return Ok(products);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await repository.GetByIdAsync(id);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductRequest request)
    {
        var product = new Product(request.Name, request.Description, request.Price, request.Stock);
        await repository.AddAsync(product);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductRequest request)
    {
        var product = await repository.GetByIdAsync(id);
        if (product is null)
            return NotFound();

        product.Update(request.Name, request.Description, request.Price, request.Stock);
        await repository.UpdateAsync(product);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await repository.GetByIdAsync(id);
        if (product is null)
            return NotFound();

        await repository.DeleteAsync(id);
        return NoContent();
    }
}
