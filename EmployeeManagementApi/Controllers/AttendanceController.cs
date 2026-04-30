using EmployeeManagementApi.Dtos.Attendance.Records;
using EmployeeManagementApi.Dtos.Attendance.Settings;
using EmployeeManagementApi.Enums;
using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public AttendanceController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet("settings")]
        [Authorize(Roles = "Admin, HR")]
        public async Task<IActionResult> GetSettings()
        {
            var settings = await _context.AttendanceSettings
                .Select(s => new AttendanceSettingGetDto
                {
                    Id = s.Id,
                    InTime = s.InTime,
                    OutTime = s.OutTime,
                    GracePeriodMinutes = s.GracePeriodMinutes,
                    DepartmentId = s.DepartmentId,
                    DepartmentName = s.Department.Name
                }).ToListAsync();

            return Ok(settings);
        }

        [HttpPost("settings")]
        [Authorize(Roles = "Admin, HR")]
        public async Task<IActionResult> AddSettings([FromBody] AttendanceSettingCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var departmentExists = await _context.Departments.AnyAsync(d => d.Id == dto.DepartmentId);
            if (!departmentExists) return BadRequest("Department does not exist");

            var settingExists = await _context.AttendanceSettings.AnyAsync(s => s.DepartmentId == dto.DepartmentId);
            if (settingExists) return BadRequest("Settings for this department already exists");

            var setting = new AttendanceSetting
            {
                InTime = dto.InTime,
                OutTime = dto.OutTime,
                GracePeriodMinutes = dto.GracePeriodMinutes,
                DepartmentId = dto.DepartmentId
            };

            _context.AttendanceSettings.Add(setting);
            await _context.SaveChangesAsync();

            return Ok(setting);
        }

        [HttpPut("settings/{id}")]
        [Authorize(Roles = "Admin, HR")]
        public async Task<IActionResult> UpdateSettings(int id, [FromBody] AttendanceSettingUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var setting = await _context.AttendanceSettings.FindAsync(id);
            if (setting == null) return NotFound();

            setting.InTime = dto.InTime;
            setting.OutTime = dto.OutTime;
            setting.GracePeriodMinutes = dto.GracePeriodMinutes;

            await _context.SaveChangesAsync();
            return Ok(setting);
        }

        [HttpGet]
        [Authorize(Roles = "Admin, HR")]
        public async Task<IActionResult> GetAttendanceByDate([FromQuery] DateOnly date)
        {
            var employees = await _context.Employees
                .Select(e => new
                {
                    e.Id,
                    e.Name
                }).ToListAsync();

            var existingRecords = await _context.Attendances
                .Where(a => a.Date == date)
                .ToListAsync();

            var result = employees.Select(e =>
            {
                var record = existingRecords.FirstOrDefault(a => a.EmployeeId == e.Id);

                return new AttendanceGetDto
                {
                    EmployeeName = e.Name,
                    Date = date,
                    InTime = record?.InTime,
                    OutTime = record?.OutTime,
                    Status = record?.Status ?? AttendanceStatus.Absent,
                    Note = record?.Note
                };
            }).ToList();

            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> MarkAttendance([FromBody] AttendanceCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var employee = await _context.Employees
                .Include(e => e.Department)
                .FirstOrDefaultAsync(e => e.Id == dto.EmployeeId);

            if (employee == null) return NotFound("Employee not found");

            var alreadyMarked = await _context.Attendances
                .AnyAsync(a => a.EmployeeId == dto.EmployeeId && a.Date == dto.Date);

            if (alreadyMarked) return Conflict($"Attendance for {employee.Name} on {dto.Date} has already been given.");

            var settings = await _context.AttendanceSettings
                .FirstOrDefaultAsync(s => s.DepartmentId == employee.DepartmentId);

            AttendanceStatus status;

            if(!dto.InTime.HasValue)
            {
                status = AttendanceStatus.Absent;
            } else  {
                var allowedTime = settings?.InTime.AddMinutes(settings.GracePeriodMinutes);

                status = dto.InTime.Value <= allowedTime ? AttendanceStatus.Present : AttendanceStatus.Late; 
            }

            var attendance = new Attendance
            {
                EmployeeId = dto.EmployeeId,
                Date = dto.Date,
                InTime = dto.InTime,
                OutTime = dto.OutTime,
                Note = dto.Note,
                Status = status
            };

            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();

            var result = new AttendanceGetDto
            {
                EmployeeName = attendance?.Employee?.Name,
                Date = attendance.Date,
                InTime = attendance.InTime,
                OutTime = attendance.OutTime,
                Status = attendance.Status,
                Note = attendance.Note
            };

            return Ok(result);
        }
    }
}
