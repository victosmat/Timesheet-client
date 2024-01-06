export interface NoteDetailViewDto {
    completed: boolean | false;
    noteId?: number;
    note?: string;
    dateSubmit?: Date;
    dateModify?: Date;
    workingTime?: number;
    taskId?: number;
    taskCode?: string;
    taskStatus?: string;
    workingType?: string;
    status?: string;
    noteCommentId?: number;
    comment?: string;
    readed?: boolean;
}
