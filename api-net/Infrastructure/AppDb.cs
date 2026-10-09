using JediApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JediApi.Infrastructure;

public class AppDb : DbContext
{
    public AppDb(DbContextOptions<AppDb> options) : base(options) { }

    public DbSet<Jedi> Jedis => Set<Jedi>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Jedi>(entity =>
        {
            entity.ToTable("Jedi");
            entity.HasKey(jedi => jedi.JediId);
            entity.Property(jedi => jedi.Name).HasMaxLength(200);
            entity.Property(jedi => jedi.JediTypeId).HasColumnType("tinyint unsigned");
        });
    }
}
