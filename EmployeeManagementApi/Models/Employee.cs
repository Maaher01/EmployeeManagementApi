namespace EmployeeManagementApi.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int DepartmentId { get; set; }
        public Department Department { get; set; }
        public DateTime DateOfJoining { get; set; }
        public string? Image {  get; set; }
    }
}
