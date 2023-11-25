import { NoteDetailViewDto } from "./NoteDetailViewDto";

export interface EmployeeDto{
    completed: boolean | false,
    employeeId?: number,
    employeeName?: string,
    employeeLevel?: string,
    employeeDepartment?: string,
    noteDetailViewDtos?: NoteDetailViewDto[],
}