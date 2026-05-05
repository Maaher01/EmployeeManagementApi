using EmployeeManagementApi.Dtos.Attendance.Records;
using EmployeeManagementApi.Enums;
using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

        [HttpGet]
        [Authorize(Roles = "Admin, HR")]
        public async Task<IActionResult> GetAttendanceByDate([FromQuery] DateTime date)
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

        [HttpGet("employee/month")]
        [Authorize(Roles ="Admin, HR")]
        public async Task<IActionResult> GetEmployeeMonthlyAttendance(int id, [FromQuery] int month, [FromQuery] int year)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == id);
            if (employee == null) return NotFound("Employee not found");

            var attendances = await _context.Attendances
                .Where(a => a.EmployeeId == id && a.Date.Month == month && a.Date.Year == year)
                .OrderByDescending(a => a.Date)
                .Select(a => new AttendanceGetDto
                {
                    Id = a.Id,
                    EmployeeId = a.EmployeeId,
                    EmployeeName =a.Employee.Name,
                    Date = a.Date,
                    InTime = a.InTime,
                    OutTime = a.OutTime,
                    Status = a.Status,
                    Note = a.Note
                }).ToListAsync();

            return Ok(attendances);
        }
        
        [HttpGet("employee")]
        [Authorize(Roles = "Employee, HR")]
        public async Task<IActionResult> GetEmployeeAttendance()
        {
            var userId = User.FindFirstValue("uid");
            if (userId == null) return Unauthorized("User not found in token");

            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Employee == null) return NotFound("No employee record found for this user");

            var employee = user.Employee;

            var allAttendance = await _context.Attendances
                .Where(a => a.EmployeeId == employee.Id)
                .OrderByDescending(a => a.Date)
                .ToListAsync();

            var result = allAttendance.Select(a =>
            {
                return new AttendanceGetDto
                {
                    Id = a.Id,
                    EmployeeId = a?.Employee?.Id,
                    EmployeeName = a.Employee?.Name,
                    Date = a.Date,
                    InTime = a.InTime,
                    OutTime = a.OutTime,
                    Status = a.Status,
                    Note = a.Note
                };
            }).ToList();

            return Ok(result);
        }
        
        [HttpGet("employee/today")]
        [Authorize]
        public async Task<IActionResult> GetTodayAttendanceByEmployee()
        {
            var userId = User.FindFirstValue("uid");
            if (userId == null) return Unauthorized("User not found in token");

            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Employee == null) return NotFound("No employee record found for this user");

            var employee = user.Employee;

            var date = DateTime.Today;

            var todayAttendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.EmployeeId == employee.Id && a.Date == date);

            if (todayAttendance == null)
            {
                return Ok(new AttendanceGetDto
                {
                    EmployeeId = employee.Id,
                    EmployeeName = employee.Name,
                    Date = date,
                    InTime = null,
                    OutTime = null,
                    Status = null,
                    Note = null
                });
            }

            var result = new AttendanceGetDto
            {
                Id = todayAttendance.Id,
                EmployeeId = employee.Id,
                EmployeeName = employee.Name,
                Date = todayAttendance.Date,
                InTime = todayAttendance.InTime,
                OutTime = todayAttendance.OutTime,
                Status = todayAttendance.Status,
                Note = todayAttendance.Note
            };

            return Ok(result);

        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, HR")]
        public async Task<IActionResult> GetAttendanceDetails(int id)
        {
            var attendance = await _context.Attendances
                .Include(e => e.Employee)
                .FirstOrDefaultAsync(e => e.Id == id);
            if (attendance == null) return NotFound();

            var result = new AttendanceGetDto
            {
                Id = attendance.Id,
                EmployeeId = attendance.Employee.Id,
                EmployeeName = attendance.Employee.Name,
                Date = attendance.Date,
                InTime = attendance.InTime,
                OutTime = attendance.OutTime,
                Status = attendance.Status,
                Note = attendance.Note
            };

            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> MarkAttendance([FromBody] AttendanceCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = User.FindFirstValue("uid");
            if (userId == null) return Unauthorized("User not found in token");

            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Employee == null) return NotFound("No employee record found for this user");

            var employee = user.Employee;

            var date = DateTime.Today;
            var inTime = TimeOnly.FromDateTime(DateTime.Now);

            var alreadyMarked = await _context.Attendances
                .AnyAsync(a => a.EmployeeId == employee.Id && a.Date == date && a.InTime != null);
            if (alreadyMarked) return Conflict($"Attendance for {employee.Name} on {date} has already been given.");

            var settings = await _context.AttendanceSettings
                .FirstOrDefaultAsync(s => s.DepartmentId == employee.DepartmentId);

            AttendanceStatus status;
            var allowedTime = settings?.InTime.AddMinutes(settings.GracePeriodMinutes);
            status = allowedTime.HasValue 
                ? inTime <= allowedTime ? AttendanceStatus.Present : AttendanceStatus.Late : AttendanceStatus.Present; 

            var attendance = new Attendance
            {
                EmployeeId = employee.Id,
                Date = date,
                InTime = inTime,
                OutTime = null,
                Note = dto.Note,
                Status = status
            };

            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();

            var result = new AttendanceGetDto
            {
                Id = attendance.Id,
                EmployeeId = employee.Id,
                EmployeeName = employee.Name,
                Date = attendance.Date,
                InTime = attendance.InTime,
                OutTime = attendance.OutTime,
                Status = attendance.Status,
                Note = attendance.Note
            };

            return Ok(result);
        }

        [HttpPut("employee/edit")]
        [Authorize]
        public async Task<IActionResult> EmployeeUpdateAttendance([FromBody] AttendanceUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = User.FindFirstValue("uid");
            if (userId == null) return Unauthorized("User not found in token");

            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Employee == null) return NotFound("No employee record found for this user");

            var today = DateTime.Today;

            var existingAttendance = await _context.Attendances
                .Include(a => a.Employee)
                .FirstOrDefaultAsync(a => a.EmployeeId == user.Employee.Id && a.Date == today);

            var outTime = TimeOnly.FromDateTime(DateTime.Now);

            if (existingAttendance == null || existingAttendance.InTime == null)
            {
                return BadRequest("You must check in before checking out.");
            }
            else
            {
                existingAttendance.OutTime = outTime;
            }

            existingAttendance.Note = dto.Note;

            await _context.SaveChangesAsync();

            var result = new AttendanceGetDto
            {
                Id = existingAttendance.Id,
                EmployeeId = existingAttendance.EmployeeId,
                EmployeeName = existingAttendance?.Employee?.Name,
                Date = existingAttendance.Date,
                InTime = existingAttendance.InTime,
                OutTime = existingAttendance.OutTime,
                Status = existingAttendance.Status,
                Note = existingAttendance.Note
            };

            return Ok(result);
        }
    }
}
