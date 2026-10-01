using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EcoMapBrasil.Data;
using EcoMapBrasil.Models;

namespace EcoMapBrasil.Controllers
{
    public class LoginController : Controller
    {
        private readonly ApplicationDbContext _db;
        public LoginController(ApplicationDbContext db) { _db = db; }

        // GET: /Login
        public IActionResult Index()
        {
            return View();
        }

        // GET: /Login/Register
        public IActionResult Register() => View();

        // POST: /Login/Entrar
        [HttpPost]
        public async Task<IActionResult> Entrar(string email, string senha)
        {
            var user = _db.Usuarios.FirstOrDefault(u => u.Email == email && u.Senha == senha);
            if (user == null)
            {
                ViewBag.Mensagem = "Usuário ou senha inválidos!";
                return View("Index");
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.IdUsuario.ToString()),
                new Claim(ClaimTypes.Name, user.Nome),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Tipo)
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            return RedirectToAction("Index", "Home");
        }

        // POST: /Login/Register
        [HttpPost]
        public async Task<IActionResult> Register(string nome, string email, string senha)
        {
            if (_db.Usuarios.Any(u => u.Email == email))
            {
                ViewBag.Mensagem = "Email já cadastrado.";
                return View("Register");
            }

            var user = new Usuario { Nome = nome, Email = email, Senha = senha, Tipo = "NORMAL" };
            _db.Usuarios.Add(user);
            _db.SaveChanges();

            // sign in
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.IdUsuario.ToString()),
                new Claim(ClaimTypes.Name, user.Nome),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Tipo)
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            return RedirectToAction("Index", "Avaliacao");
        }

        // GET: /Login/Logout
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Index", "Home");
        }

        // GET: /Login/AccessDenied
        public IActionResult AccessDenied() => View();
    }
}
