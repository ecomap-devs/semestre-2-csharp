using Microsoft.AspNetCore.Mvc;

namespace EcoMapBrasil.Controllers
{
    public class MapaController : Controller
    {
        public IActionResult Index()
        {
            return View(); // Procura automaticamente Views/Mapa/Index.cshtml
        }
    }
}
