import { Education } from './Education';
import { WorkExperience } from './WorkExperience';
import { Resume } from './Resume';

export class Candidate {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    education: Education[];
    workExperience: WorkExperience[];
    resumes: Resume[];

    constructor(data: any) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.phone = data.phone;
        this.address = data.address;
        this.education = data.educations?.map((edu: any) => new Education(edu)) || [];
        this.workExperience = data.workExperiences?.map((exp: any) => new WorkExperience(exp)) || [];
        this.resumes = data.resumes?.map((resume: any) => new Resume(resume)) || [];
    }
}
