using Microsoft.EntityFrameworkCore;

public class GameDbContext : DbContext
{
    public DbSet<Player> Players { get; set; }

    public GameDbContext(DbContextOptions<GameDbContext> options) : base(options) { }
}
