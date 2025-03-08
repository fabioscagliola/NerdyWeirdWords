using com.nerdyweirdwords.backend.Entity;
using Microsoft.EntityFrameworkCore;

namespace com.nerdyweirdwords.backend;

public sealed class NerdyWeirdWordsBackendDbContext : DbContext
{
    public NerdyWeirdWordsBackendDbContext(DbContextOptions<NerdyWeirdWordsBackendDbContext> options) : base(options)
    {
        Database.EnsureCreated();
    }

    public DbSet<Person> People { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Person>().ToTable(nameof(Person));
    }
}