using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public  AttendanceController(EmployeeDbContext context)
        {
            _context = context;
        }

        //[HttpGet("settings")]
        //[Authorize(Roles ="Admin, HR")]
        //public async Task<IActionResult> GetSettings()
        //{
        //    var settings = await _context.AttendanceSettings.FirstOrDefaultAsync();
        //}
    }
}
