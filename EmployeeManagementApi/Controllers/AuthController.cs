using EmployeeManagementApi.Dtos.Auth;
using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _user;
        private readonly IConfiguration _config;

        public AuthController(UserManager<AppUser> user, IConfiguration config, RoleManager<IdentityRole> roleManager)
        {
            _user = user;
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _user.FindByEmailAsync(dto.Email);
            if (user == null) return Unauthorized("Invalid email or password");

            var passwordValid = await _user.CheckPasswordAsync(user, dto.Password);
            if (!passwordValid) return Unauthorized("Invalid email or password");

            var token = await GenerateJwtToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
            });
        }

        private async Task<string> GenerateJwtToken(AppUser user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["AppSettings:JwtSecret"]!));

            var roles = await _user.GetRolesAsync(user);
            var claims = new[]
            {
                new Claim("uid", user.Id),
                new Claim("username", user.UserName!),
                new Claim("email", user.Email!),
                new Claim("role", roles.First())
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
