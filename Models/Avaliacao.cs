using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcoMapBrasil.Models
{
    public class Avaliacao
    {
        [Key]
        public int IdAvaliacao { get; set; }

        [Required]
        public string Comentario { get; set; }

        [Required]
        [Range(1,5)]
        public int Nota { get; set; }

        public DateTime DataAvaliacao { get; set; } = DateTime.UtcNow;

        [ForeignKey("Usuario")]
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }
    }
}
