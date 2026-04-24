using DevStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DevStore.Infrastructure.Data;

public class DevStoreDbContext(DbContextOptions<DevStoreDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(p => p.Id);

            entity.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(p => p.Description)
                .HasMaxLength(1000);

            entity.Property(p => p.Price)
                .HasPrecision(18, 2);
        });
    }
}
