import { EmployeeDto } from "./EmployeeDto";

export interface NoteDetailDto {
    completed: boolean | false,
    projectId?: number,
    projectDes?: string,
    employeeDtoList?: EmployeeDto[],
}