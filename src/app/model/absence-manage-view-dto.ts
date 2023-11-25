export interface AbsenceManageViewDto {
  id: number | null;
  fullName: string | null;
  email: string | null;
  departmentName: string | null;
  absenceType: string | null;
  typeTimeOff: string | null;
  absenceTypeOff: string | null;
  timeOff: number | null;
  reason: string | null;
  status: string | null;
  punishmentStatus: Boolean | null;
}
