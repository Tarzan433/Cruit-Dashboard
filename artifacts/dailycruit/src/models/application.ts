export type ApplicationStatus =
  | "Applied"
  | "Viewed"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Rejected"
  | "Hired";

export interface Application {
  applicationId?: string;
  jobId: string;
  recruiterId: string;
  applicantId: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  employmentType: string;
  experience: string;
  appliedDate?: unknown;
  status: ApplicationStatus;
}
