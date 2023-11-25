import { TypeTimeOff } from "../my-absence-day/absence-form-dialog/absence-form-dialog.component";

export interface AbsenceDto {
    id : number | null,
    reason : string | null,
    employeeId : number | null,
    absenceTypeId : number | null,
    absenceTypeOffId : number | null,
    dateRequest : Date | null,
    dateSubmit : Date | null,
    typeTimeOff : TypeTimeOff | null,
    timeOff : number | null
}

export enum AbsenceStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}