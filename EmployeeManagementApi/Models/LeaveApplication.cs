using EmployeeManagementApi.Enums;

namespace EmployeeManagementApi.Models
{
    public class LeaveApplication
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee? Employee { get; set; }
        public int LeaveTypeId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public LeaveStatus Status { get; set; }
    }
}
