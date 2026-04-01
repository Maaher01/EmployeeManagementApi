using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementApi.Dtos.Department
{
    public class DepartmentCreateUpdateDto
    {
        [Required]
        public string Name { get; set; }
    }
}
