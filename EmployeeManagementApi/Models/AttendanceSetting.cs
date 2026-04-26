namespace EmployeeManagementApi.Models
{
    public class AttendanceSetting
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public TimeOnly InTime { get; set; }
        public TimeOnly OutTime { get; set; }
        public int GracePeriodMinutes { get; set; }
    }
}
