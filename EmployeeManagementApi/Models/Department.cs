using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementApi.Models
{
    public class Department
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        public ICollection<Weekend> Weekends { get; set; } = new List<Weekend>();
    }
}
