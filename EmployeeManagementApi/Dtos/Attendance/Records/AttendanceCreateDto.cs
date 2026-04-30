namespace EmployeeManagementApi.Dtos.Attendance.Records
{
    public class AttendanceCreateDto
    {
        public int EmployeeId { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly? InTime { get; set; }
        public TimeOnly? OutTime { get; set; }
        public string? Note { get; set; }
    }
}
