namespace EmployeeManagementApi.Dtos.Attendance.Records
{
    public class AttendanceCreateDto
    {
        public DateOnly Date { get; set; }
        public string? Note { get; set; }
    }
}
