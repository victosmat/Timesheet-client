import { EmployeeProjectDetailDto } from "./employee-project-detail-dto";

export interface ProjectDetailDto{
    id?: number,
    code?: string,
    name?: string,
    description?: string,
    projectType?: string,
    projectStatus?: string,
    startDate?: string,
    endDate?: string,
    employeeProjectDetailDto?: EmployeeProjectDetailDto[],
}