using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementApi.Dtos.Employee
{
    public class EmployeeCreateUpdateDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        public DateTime DateOfJoining { get; set; }

        public string? Image { get; set; }
    }
}
