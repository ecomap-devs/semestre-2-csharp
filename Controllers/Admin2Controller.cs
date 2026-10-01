using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EcoMapBrasil.Data;
using EcoMapBrasil.Models;
using Microsoft.EntityFrameworkCore;

namespace EcoMapBrasil.Controllers
{
    [Authorize(Roles = "ADM")]
    public class Admin2Controller : Controller
    {
        private readonly ApplicationDbContext _db;

        public Admin2Controller(ApplicationDbContext db)
        {

            _db = db;
        }

        // LISTAR USUÁRIOS
        public async Task<IActionResult> Index()
        {
            var usuarios = await _db.Usuarios.ToListAsync();
            return View(usuarios);
        }

        // CREATE GET
        public IActionResult Create()
        {
            return View();
        }

        // CREATE POST
        [HttpPost]
        public async Task<IActionResult> Create(string nome, string email, string senha, string tipo)
        {
            if (string.IsNullOrWhiteSpace(nome) ||
                string.IsNullOrWhiteSpace(email) ||
                string.IsNullOrWhiteSpace(senha))
            {
                ViewBag.Error = "Preencha todos os campos!";
                return View();
            }

            var novo = new Usuario
            {
                Nome = nome,
                Email = email,
                Senha = senha,
                Tipo = tipo
            };

            _db.Usuarios.Add(novo);
            await _db.SaveChangesAsync();

            return RedirectToAction("Index");
        }

        // EDIT GET
        public async Task<IActionResult> Edit(int id)
        {
            var user = await _db.Usuarios.FindAsync(id);

            if (user == null) return NotFound();

            return View(user);
        }

        // EDIT POST
        [HttpPost]
        public async Task<IActionResult> Edit(int id, string nome, string email, string senha, string tipo)
        {
            var user = await _db.Usuarios.FindAsync(id);

            if (user == null) return NotFound();

            user.Nome = nome;
            user.Email = email;
            user.Senha = senha;
            user.Tipo = tipo;

            await _db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        // DELETE GET
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _db.Usuarios.FindAsync(id);

            if (user == null) return NotFound();

            return View(user);
        }

        // DELETE POST
        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var user = await _db.Usuarios.FindAsync(id);

            if (user == null) return NotFound();

            _db.Usuarios.Remove(user);
            await _db.SaveChangesAsync();

            return RedirectToAction("Index");
        }
    }
}
