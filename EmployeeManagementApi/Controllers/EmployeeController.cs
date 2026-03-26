using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public EmployeeController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetEmployees() 
        { 
            var employees = _context.Employees.ToList();

            return Ok(employees);
        }

        [HttpGet("{id}")]
        public IActionResult GetEmployeeById(int id)
        {
            var employee = _context.Employees.Find(id);

            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);
        }

        //[HttpPost]
        //public IActionResult AddEmployee([FromBody] Employee employee)
        //{
        //    if (employee == null)
        //    {
        //        return BadRequest("Employee data is required");
        //    }

        //    if (string.IsNullOrEmpty(employee.Name))
        //    {
        //        return BadRequest("Employee name is required");
        //    }

        //    if(employee.DepartmentId <= 0)
        //    {
        //        return BadRequest("Valid department is required");
        //    }

        //    var departmentExists = _context.Departments.Any(d => d.Id  == employee.DepartmentId);
        //    if (!departmentExists)
        //    { 
        //        return BadRequest("Department does not exist");
        //    }

        //    _context.Employees.Add(employee);
        //    _context.SaveChanges();

        //    return Ok(employee);
        //}

        [HttpDelete("{id}")]
        public IActionResult DeleteEmployee(int id)
        {
            var employee = _context.Employees.Find(id);

            if(employee == null)
            {
                return NotFound();
            }

            _context.Employees.Remove(employee);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
