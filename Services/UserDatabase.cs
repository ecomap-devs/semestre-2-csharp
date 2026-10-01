using System.Collections.Generic;
using System.Linq;
using EcoMapBrasil.Models;

namespace EcoMapBrasil.Services
{
    public static class FakeUserDatabase
    {
        // Banco em memória
        private static List<Usuario> Users = new List<Usuario>()
        {
            new Usuario { IdUsuario = 1, Nome = "admin", Email = "admin@site.com", Senha = "123" }
        };

        private static int nextId = 2;

        public static List<Usuario> GetAll() => Users;

        public static Usuario Get(int id) =>
            Users.FirstOrDefault(x => x.IdUsuario == id);

        public static void Add(Usuario u)
        {
            u.IdUsuario = nextId++;
            Users.Add(u);
        }

        public static void Update(Usuario u)
        {
            var old = Get(u.IdUsuario);
            if (old == null) return;

            old.Nome = u.Nome;
            old.Email = u.Email;
            old.Senha = u.Senha;
        }

        public static void Delete(int id)
        {
            var user = Get(id);
            if (user != null)
                Users.Remove(user);
        }
    }
}
