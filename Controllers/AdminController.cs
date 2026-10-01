using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EcoMapBrasil.Data;
using EcoMapBrasil.Models;

namespace EcoMapBrasil.Controllers
{
    [Authorize(Roles = "ADM")]
    public class AdminController : Controller
    {
        private readonly ApplicationDbContext _db;
        public AdminController(ApplicationDbContext db) { _db = db; }

        public IActionResult Index()
        {
            var avals = _db.Avaliacoes
                .OrderByDescending(a => a.DataAvaliacao)
                .ToList();
            return View(avals);
        }

        [HttpPost]
        public IActionResult Delete(int id)
        {
            var a = _db.Avaliacoes.Find(id);
            if (a == null) return NotFound();
            _db.Avaliacoes.Remove(a);
            _db.SaveChanges();
            return RedirectToAction("Index");
        }

        public IActionResult Edit(int id)
        {
            var a = _db.Avaliacoes.Find(id);
            if (a == null) return NotFound();
            return View(a);
        }

        [HttpPost]
        public IActionResult Edit(int id, string comentario, int nota)
        {
            var a = _db.Avaliacoes.Find(id);
            if (a == null) return NotFound();
            a.Comentario = comentario;
            a.Nota = nota;
            _db.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}
