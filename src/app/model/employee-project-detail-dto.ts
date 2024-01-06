import { RoleDto } from "./role-dto";

export interface EmployeeProjectDetailDto{
    id?: number,
    employeeId?: number,
    employeeName?: string,
    email?: string,
    departmentLevelStatus?: string,
    roleProjectType?: RoleDto,
}