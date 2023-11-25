export interface NoteDetailViewDto {
    completed: boolean | false;
    noteId?: number;
    note?: string;
    dateSubmit?: Date;
    dateModify?: Date;
    workingTime?: number;
    taskDes?: string;
    workingType?: string;
    status?: string;
    noteCommentId?: number;
    comment?: string;
    readed?: boolean;
}
