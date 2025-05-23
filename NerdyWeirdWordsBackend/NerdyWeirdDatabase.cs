using com.nerdyweirdwords.backend.PersonDomain;
using Microsoft.EntityFrameworkCore;

namespace com.nerdyweirdwords.backend;

public sealed class NerdyWeirdDatabase : DbContext
{
    public NerdyWeirdDatabase(DbContextOptions<NerdyWeirdDatabase> options) : base(options)
    {
        Database.EnsureCreated();
    }

    public DbSet<Person> People { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Person>().ToTable(nameof(Person));
    }
}