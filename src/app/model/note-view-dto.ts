export interface NoteViewDto {
    id?: number;
    projectCode?: string;
    taskName?: string;
    noteDescription?: string;
    workingTime?: number;
    dateSubmit?: number[];
    dateModify?: number[];
    status?: string;
    comment?: string;
    read: boolean;
}
