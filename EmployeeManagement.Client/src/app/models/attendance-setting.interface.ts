export interface AttendanceSetting {
  id: number;
  inTime: string;
  outTime: string;
  gracePeriodMinutes: number;
  departmentId: number;
  departmentName: string;
}
