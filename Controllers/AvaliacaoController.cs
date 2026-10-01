using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EcoMapBrasil.Data;
using EcoMapBrasil.Models;

namespace EcoMapBrasil.Controllers
{
    public class AvaliacaoController : Controller
    {
        private readonly ApplicationDbContext _db;

        public AvaliacaoController(ApplicationDbContext db)
        {
            _db = db;
        }

        public IActionResult Index()
        {
            var lista = _db.Avaliacoes
                .OrderByDescending(a => a.DataAvaliacao)
                .Select(a => new {
                    a.IdAvaliacao,
                    a.Comentario,
                    a.Nota,
                    a.DataAvaliacao,
                    UsuarioNome = a.Usuario.Nome
                }).ToList();
            return View(lista);
        }

        [Authorize]
        public IActionResult Create()
        {
            return View();
        }

        [Authorize]
        [HttpPost]
        public IActionResult Create(string comentario, int nota)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var avaliacao = new Avaliacao
            {
                Comentario = comentario,
                Nota = nota,
                IdUsuario = userId,
                DataAvaliacao = DateTime.UtcNow
            };
            _db.Avaliacoes.Add(avaliacao);
            _db.SaveChanges();
            return RedirectToAction("Index");
        }

        [Authorize]
        public IActionResult Edit(int id)
        {
            var a = _db.Avaliacoes.Find(id);
            if (a == null) return NotFound();

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var role = User.FindFirstValue(ClaimTypes.Role);

            if (role != "ADM" && a.IdUsuario != userId) return Forbid();

            return View(a);
        }

        [Authorize]
        [HttpPost]
        public IActionResult Edit(int id, string comentario, int nota)
        {
            var a = _db.Avaliacoes.Find(id);
            if (a == null) return NotFound();

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var role = User.FindFirstValue(ClaimTypes.Role);
            if (role != "ADM" && a.IdUsuario != userId) return Forbid();

            a.Comentario = comentario;
            a.Nota = nota;
            _db.SaveChanges();
            return RedirectToAction("Index");
        }

        // Nova ação: excluir avaliação (só ADM ou dono)
        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            var a = _db.Avaliacoes.Find(id);
            if (a == null) return NotFound();

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var role = User.FindFirstValue(ClaimTypes.Role);

            if (role != "ADM" && a.IdUsuario != userId) return Forbid();

            _db.Avaliacoes.Remove(a);
            _db.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}
