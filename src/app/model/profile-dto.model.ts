export class ProfileDto {
    public fullName: string;
    public companyEmail: string;
    public dob: Date;
    public department: string;
    public jobDepartment: string;

    constructor(fullName: string, companyEmail: string, dob: Date, department: string, jobDepartment: string) {
        this.fullName = fullName;
        this.companyEmail = companyEmail;
        this.dob = dob;
        this.department = department;
        this.jobDepartment = jobDepartment;
    }

    public getFullName() {
        return this.fullName;
    }

    public getCompanyEmail() {
        return this.companyEmail;
    }

    public getDob() {
        return this.dob;
    }

    public getDepartment() {
        return this.department;
    }

    public getJobDepartment() {
        return this.jobDepartment;
    }
}
