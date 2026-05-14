namespace EmployeeManagementApi.Dtos.Holiday
{
    public class HolidayAddDto
    {
        public string Name { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
