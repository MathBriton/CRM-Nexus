namespace DevStore.Domain.Entities;

public class Product
{
    public int Id {get;private set;}
    public string Name {get; private set;} = string.Empty;
    public string Description {get; private set;} = string.Empty;
    public decimal Price {get; private set;}

    public int Stock {get; private set;}
    public DateTime CreatedAt {get; private set;}

    protected Product() {} 

    public Product(string name, string description, decimal price, int stock)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(price);
        ArgumentOutOfRangeException.ThrowIfNegative(stock);

        Name = name;
        Description = description;
        Price = price;
        Stock = stock;
        CreatedAt = DateTime.UtcNow;
    }

    public void Update(string name, string description, decimal price, int stock)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(price);
        ArgumentOutOfRangeException.ThrowIfNegative(stock);

        Name = name;
        Description = description;
        Price = price;
        Stock = stock;
    }
}