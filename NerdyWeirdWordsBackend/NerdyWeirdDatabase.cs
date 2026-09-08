using com.nerdyweirdwords.backend.PersonDomain;
using com.nerdyweirdwords.backend.WritingDomain;
using Microsoft.EntityFrameworkCore;

namespace com.nerdyweirdwords.backend;

public sealed class NerdyWeirdDatabase : DbContext
{
    public NerdyWeirdDatabase(DbContextOptions<NerdyWeirdDatabase> options) : base(options)
    {
        Database.EnsureCreated();
    }

    public DbSet<Person> People { get; set; }
    public DbSet<Writing> Writings { get; set; }
    public DbSet<Block> Blocks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Person>().ToTable(nameof(Person));

        modelBuilder.Entity<Writing>(entity =>
        {
            entity.ToTable(nameof(Writing));
            entity.HasKey(writing => writing.Id);
            entity.HasOne(writing => writing.Owner)
                .WithMany()
                .HasForeignKey(writing => writing.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(writing => writing.Blocks)
                .WithOne(block => block.Writing)
                .HasForeignKey(block => block.WritingId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Block>(entity =>
        {
            entity.ToTable(nameof(Block));
            entity.HasKey(block => block.Id);
            entity.HasIndex(block => new { block.WritingId, block.Index }).IsUnique();
            entity.HasDiscriminator<string>("Type")
                .HasValue<Heading>(nameof(Heading))
                .HasValue<Paragraph>(nameof(Paragraph));
            entity.HasMany(block => block.Attributes)
                .WithOne(attribute => attribute.Block)
                .HasForeignKey(attribute => attribute.BlockId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}