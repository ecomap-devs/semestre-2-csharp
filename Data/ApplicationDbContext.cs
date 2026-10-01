using Microsoft.EntityFrameworkCore;
using EcoMapBrasil.Models;

namespace EcoMapBrasil.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Usuario>()
                .HasKey(u => u.IdUsuario);
        }
        public DbSet<Avaliacao> Avaliacoes { get; set; }
    }
}
