using EmployeeManagementApi.Dtos.Holiday;
using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HolidayController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public HolidayController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllHolidays()
        {
            var holidays = await _context.Holidays.ToListAsync();

            return Ok(holidays);
        }

        [HttpPost]
        public async Task<IActionResult> AddHoliday([FromBody] HolidayAddDto dto)
        {
            if(!ModelState.IsValid) return BadRequest(ModelState);

            var holiday = new Holiday
            {
                Name = dto.Name,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate
            };

            _context.Holidays.Add(holiday);
            await _context.SaveChangesAsync();

            return Ok(holiday);
        }
    }
}
