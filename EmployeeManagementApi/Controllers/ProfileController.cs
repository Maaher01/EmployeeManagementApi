using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public ProfileController(EmployeeDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = User.FindFirstValue("uid");
            var user = await _context.Users
                .Include(u => u.Employee)
                .ThenInclude(e => e.Department)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if(user == null) return NotFound();

            var result = new
            {
                username = user.UserName,
                email = user.Email,
                employeeId = user.EmployeeId,
                name = user.Employee?.Name,
                department = user.Employee?.Department.Name,
                dateOfJoining = user.Employee?.DateOfJoining,
                image = user.Employee?.Image
            };

            return Ok(result);
        }
    }
}
