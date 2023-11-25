import { NoteViewDto } from "./note-view-dto";

export interface NotesPerDayDto {
    dateSubmit: number[];
    lst: NoteViewDto[];
}
