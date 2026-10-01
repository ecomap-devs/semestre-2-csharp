using System.ComponentModel.DataAnnotations;

namespace EcoMapBrasil.Models
{
    public class Usuario
    {
        [Key]
        public int IdUsuario { get; set; }

        [Required]
        public string Nome { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Senha { get; set; }

        public string Tipo { get; set; }
    }
}
