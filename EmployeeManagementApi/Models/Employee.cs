using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementApi.Models
{
    public class Employee
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Department ID must be greater than 0")]
        public int DepartmentId { get; set; }

        [Required]
        public DateTime DateOfJoining { get; set; }
        public string? Image {  get; set; }
    }
}
