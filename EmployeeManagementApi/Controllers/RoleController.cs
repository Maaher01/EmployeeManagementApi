using EmployeeManagementApi.Dtos.Role;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,HR")]
    public class RoleController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleController(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        [HttpGet]
        public IActionResult GetRoles()
        {
            var callerRole = User.FindFirstValue(ClaimTypes.Role);
            var roles = _roleManager.Roles
                .Select(r => new RoleGetDto
                {
                    Name = r.Name
                }).ToList();


            if (callerRole == "Admin")
            {
                roles = roles.Where(r => r.Name == "Employee" || r.Name == "HR").ToList();
            } 
            else if (callerRole == "HR")
            {
                roles = roles.Where(r => r.Name == "Employee").ToList();
            }

            return Ok(roles);
        }
    }
}
