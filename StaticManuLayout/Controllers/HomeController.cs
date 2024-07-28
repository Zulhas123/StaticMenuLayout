using Contract;
using Entities;
using Microsoft.AspNetCore.Mvc;
using StaticManuLayout.Models;
using StaticManuLayout.ViewModel;
using System.Diagnostics;

namespace StaticManuLayout.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IEmployee _employee;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public HomeController(ILogger<HomeController> logger, IEmployee employee, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _employee = employee;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        [HttpGet]
        public async Task<IActionResult> GetEmployee()
        {
            var data = await _employee.GetEmployee();
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> GetEmployee( int id)
        {
            return View();
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                // Retrieve the list of users from the database
                var users = await _employee.GetUsr();

                // Find the user with the matching username
                var user = users.FirstOrDefault(u => u.Email == model.Email);

                // Check if the user exists and the password matches
                if (user != null && user.Password == model.Password)
                {
                    // Set the session with the username
                    HttpContext.Session.SetString("Username", model.Email);

                    // Redirect to the Index action on successful login
                    return RedirectToAction("Index");
                }
                else
                {
                    // Add an error message to the model state for an invalid login attempt
                    ModelState.AddModelError("", "Invalid login attempt.");
                }
            }
            // Return the view with the model if the model state is not valid or login fails
            return View(model);
        }



        [HttpPost]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login");
        }

    }
}
