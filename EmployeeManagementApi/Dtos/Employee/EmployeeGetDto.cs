namespace EmployeeManagementApi.Dtos.Employee
{
    public class EmployeeGetDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public DateTime DateOfJoining { get; set; }
        public string? Image { get; set; }
    }
}
