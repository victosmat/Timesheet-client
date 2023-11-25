import { TimeSheetStatus, WorkingType } from "../my-timesheet/timesheet-dialog/timesheet-dialog.component";

export interface NoteFormDto {
    id?: number,
    employeeId?: number,
    projectId?: number,
    taskId?: number,
    noteDescription?: number,
    workingTime?: number,
    workingType?: WorkingType,
    dateSubmit?: Date,
    dateModify?: Date,
    status?: TimeSheetStatus,
}


