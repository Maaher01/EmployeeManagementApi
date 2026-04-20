using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpGet]
        public async Task<IActionResult> GetUserProfile()
        {
            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync();

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
