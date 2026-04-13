using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeManagementApi.Dtos.Employee;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeDbContext _context;
        private readonly IWebHostEnvironment _env;

        public EmployeeController(EmployeeDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetEmployees() 
        { 
            var employees = await _context.Employees
                .Select(e => new EmployeeGetDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    DepartmentId = e.DepartmentId,
                    DepartmentName = e.Department.Name,
                    DateOfJoining = e.DateOfJoining,
                    Image = e.Image
                }).ToListAsync();

            return Ok(employees);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null) return NotFound();

            var result = new EmployeeGetDto
            {
                Id = employee.Id,
                Name = employee.Name,
                DepartmentId = employee.DepartmentId,
                DepartmentName = (await _context.Departments.FindAsync(employee.DepartmentId))?.Name,
                DateOfJoining = employee.DateOfJoining,
                Image = employee.Image
            };

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddEmployee([FromBody] EmployeeCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var departmentExists = await _context.Departments.AnyAsync(d => d.Id == dto.DepartmentId);
            if (!departmentExists) return BadRequest("Department does not exist");

            var employee = new Employee
            {
                Name = dto.Name,
                DepartmentId = dto.DepartmentId,
                DateOfJoining = dto.DateOfJoining,
                Image = dto.Image
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            var result = new EmployeeGetDto
            {
                Id = employee.Id,
                Name = employee.Name,
                DepartmentId = employee.DepartmentId,
                DepartmentName = (await _context.Departments.FindAsync(employee.DepartmentId))?.Name,
                DateOfJoining = employee.DateOfJoining,
                Image = employee.Image
            };

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] EmployeeCreateUpdateDto dto)
        {
            if(!ModelState.IsValid) return BadRequest(ModelState);

            var existingEmployee = await _context.Employees.FindAsync(id);
            if (existingEmployee == null) return NotFound();

            existingEmployee.Name = dto.Name;
            existingEmployee.DepartmentId = dto.DepartmentId;
            existingEmployee.DateOfJoining = dto.DateOfJoining;
            existingEmployee.Image = dto.Image;

            await _context.SaveChangesAsync();

            var result = new EmployeeGetDto
            {
                Id = existingEmployee.Id,
                Name = existingEmployee.Name,
                DepartmentId = existingEmployee.DepartmentId,
                DepartmentName = (await _context.Departments.FindAsync(existingEmployee.DepartmentId))?.Name,
                DateOfJoining = existingEmployee.DateOfJoining,
                Image = existingEmployee.Image
            };

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if(employee == null)
            {
                return NotFound();
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Route("UploadImage")]
        [HttpPost]
        public async Task<IActionResult> UploadImage()
        {
            try
            {
                var file = Request.Form.Files.FirstOrDefault();

                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file uploaded");
                }

                // Generate unique filename
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

                var folderPath = Path.Combine(_env.ContentRootPath, "Photos");

                // Ensure folder exists
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return Ok(fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error uploading file: " + ex.Message);
            }
        }
    }
}
