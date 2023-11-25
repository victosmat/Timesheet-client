import { TimeSheetStatus } from "../my-timesheet/my-timesheet.component";

export interface NoteSummaryRequestDto {
    month?: number,
    year?: number,
    employeeId?: number,
    statuses?: TimeSheetStatus[],
}
