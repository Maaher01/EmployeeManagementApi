namespace EmployeeManagementApi.Dtos.Attendance
{
    public class AttendanceSettingUpdateDto
    {
        public TimeOnly InTime { get; set; }
        public TimeOnly OutTime { get; set; }
        public int GracePeriodMinutes { get; set; }
    }
}
