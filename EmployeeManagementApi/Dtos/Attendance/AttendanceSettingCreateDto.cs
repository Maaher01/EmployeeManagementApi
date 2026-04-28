namespace EmployeeManagementApi.Dtos.Attendance
{
    public class AttendanceSettingCreateDto
    {
        public TimeOnly InTime { get; set; }
        public TimeOnly OutTime { get; set; }
        public int GracePeriodMinutes { get; set; }
        public int DepartmentId { get; set; }
    }
}
