using EmployeeManagementApi.Dtos.User;
using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly EmployeeDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public UserController(EmployeeDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize(Roles ="Admin, HR")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var result = new List<UserGetDto>();

            foreach(var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new UserGetDto
                {
                    Id = user.Id,
                    UserName = user.UserName!,
                    Email = user.Email!,
                    Role = roles.FirstOrDefault()!
                });
            }
              
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin, HR")]
        public async Task<IActionResult> AddUser([FromBody] UserCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (dto.EmployeeId.HasValue)
            {
                var employeeExists = await _context.Employees.AnyAsync(e => e.Id == dto.EmployeeId.Value);
                if (!employeeExists) return BadRequest("Employee ID is invalid");
            }

            var callerRole = User.FindFirstValue(ClaimTypes.Role);

            if (callerRole == "HR" && dto.Role != "Employee") return Forbid();

            var user = new AppUser
            {
                UserName = dto.UserName,
                Email = dto.Email,
                EmployeeId = dto.EmployeeId,
            };

            var createResult = await _userManager.CreateAsync(user, dto.Password!);
            if (!createResult.Succeeded) return BadRequest(createResult.Errors);

            await _userManager.AddToRoleAsync(user, dto.Role!);

            var result = new UserGetDto
            {
                Id = user?.Id,
                UserName = user?.UserName,
                Email = user?.Email,
                Role = dto?.Role,
            };

            return Ok(result);
        }
    }
}
