using EmployeeManagementApi.Dtos.Weekend;
using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,HR")]
    public class WeekendController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public WeekendController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDepartmentWeekends()
        {
            var result = await _context.Departments
                .Select(d => new
                {
                    DepartmentId = d.Id,
                    DepartmentName = d.Name,
                    WeekendDays = d.Weekends.Select(w => w.Day).ToList()
                }).ToListAsync();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> SetWeekend([FromBody] WeekendAddDto dto)
        {
            if (dto.Days == null) dto.Days = new List<DayOfWeek>();

            var existing = await _context.Weekends
                .Where(w => w.DepartmentId == dto.DepartmentId)
                .ToListAsync();
            _context.Weekends.RemoveRange(existing);

            if(dto.Days.Any())
            {
                var weekends = dto.Days.Select(day => new Weekend
                {
                    DepartmentId = dto.DepartmentId,
                    Day = day
                });

                await _context.Weekends.AddRangeAsync(weekends);
            }
           
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
