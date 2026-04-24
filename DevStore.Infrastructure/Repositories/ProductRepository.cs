using DevStore.Domain.Entities;
using DevStore.Domain.Interfaces;
using DevStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DevStore.Infrastructure.Repositories;

public class ProductRepository(DevStoreDbContext context) : IProductRepository
{
    public async Task<IEnumerable<Product>> GetAllAsync() =>
        await context.Products.AsNoTracking().ToListAsync();

    public async Task<Product?> GetByIdAsync(int id) =>
        await context.Products.FindAsync(id);

    public async Task AddAsync(Product product)
    {
        context.Products.Add(product);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Product product)
    {
        context.Products.Update(product);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var product = await context.Products.FindAsync(id);
        if (product is not null)
        {
            context.Products.Remove(product);
            await context.SaveChangesAsync();
        }
    }
}
