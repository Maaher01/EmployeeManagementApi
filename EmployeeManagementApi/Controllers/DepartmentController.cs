using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public DepartmentController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetDepartments() 
        {
            var departments = _context.Departments.ToList();

            return Ok(departments);
        }

        [HttpGet("{id}")]
        public IActionResult GetDepartmentById(int id)
        {
            var department = _context.Departments.Find(id);

            if (department == null)
            {
                return NotFound();
            }

            return Ok(department);
        }

        [HttpPost]
        public IActionResult AddDepartment([FromBody] Department department) 
        {
            if (department == null || string.IsNullOrEmpty(department.Name)) 
            { 
                return BadRequest("Invalid department name");        
            }

            _context.Departments.Add(department);
            _context.SaveChanges();

            return Ok(department);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateDepartment(int id, [FromBody] Department department)
        {
            var existingDepartment = _context.Departments.Find(id);

            if (existingDepartment == null)
            {
                return NotFound();
            }

            existingDepartment.Name = department.Name;

            _context.SaveChanges();

            return Ok(existingDepartment);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteDepartment(int id)
        {
            var department = _context.Departments.Find(id);

            if(department == null)
            {
                return NotFound();
            }

            bool hasEmployees = _context.Employees.Any(e => e.DepartmentId == id);

            if (hasEmployees)
            {
                return BadRequest("This department has employees");
            }

            _context.Departments.Remove(department);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
