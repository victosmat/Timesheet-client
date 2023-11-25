export interface AbsenceViewDto {
    id : number | null,
    absenceType : string | null,
    typeTimeOff : string | null,
    absenceTypeOff : string | null,
    timeOff : number | null,
    reason : string | null,
    status : string | null, 
    punishmentStatus : Boolean | null,
}
