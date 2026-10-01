using System.Security.Claims;
using EcoMapBrasil.Data;
using EcoMapBrasil.Models;
using EcoMapBrasil.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EcoMapBrasil.Controllers
{
    public class UsuarioController : Controller
    {
        private readonly ApplicationDbContext _db;
        public UsuarioController(ApplicationDbContext db) { _db = db; }

        [Authorize(Roles = "ADM")]
        public IActionResult Index()
        {
            return View(_db.Usuarios.ToList());
        }

        [Authorize]
        public IActionResult Edit(int id)
        {
            var user = _db.Usuarios.Find(id);
            if (user == null) return NotFound();

            var currentId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var role = User.FindFirstValue(ClaimTypes.Role);
            if (role != "ADM" && currentId != id) return Forbid();

            return View(user);
        }

        [Authorize]
        [HttpPost]
        public IActionResult Edit(int id, string nome, string email, string senha)
        {
            var user = _db.Usuarios.Find(id);
            if (user == null) return NotFound();

            var currentId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var role = User.FindFirstValue(ClaimTypes.Role);
            if (role != "ADM" && currentId != id) return Forbid();

            user.Nome = nome;
            user.Email = email;
            if (!string.IsNullOrWhiteSpace(senha)) user.Senha = senha;
            _db.SaveChanges();

            return RedirectToAction(role == "ADM" ? "Index" : "Edit", new { id });
        }

        [Authorize(Roles = "ADM")]
        [HttpPost]
        public IActionResult Delete(int id)
        {
            var user = _db.Usuarios.Find(id);
            if (user == null) return NotFound();
            _db.Usuarios.Remove(user);
            _db.SaveChanges();
            return RedirectToAction("Index");
        }
    }

namespace EcoMapBrasil.Controllers
    {
        public class UserController : Controller
        {
            public ActionResult Index()
            {
                return View(FakeUserDatabase.GetAll());
            }

            public ActionResult Create()
            {
                return View();
            }

            [HttpPost]
            public ActionResult Create(Usuario user)
            {
                FakeUserDatabase.Add(user);
                return RedirectToAction("Index");
            }

            public ActionResult Edit(int id)
            {
                return View(FakeUserDatabase.Get(id));
            }

            [HttpPost]
            public ActionResult Edit(Usuario user)
            {
                FakeUserDatabase.Update(user);
                return RedirectToAction("Index");
            }

            public ActionResult Delete(int id)
            {
                return View(FakeUserDatabase.Get(id));
            }

            [HttpPost, ActionName("Delete")]
            public ActionResult DeleteConfirmed(int id)
            {
                FakeUserDatabase.Delete(id);
                return RedirectToAction("Index");
            }
        }
    }

}