export interface Job {
  id?: string;
  jobId?: string;
  recruiterId?: string;
  title: string;
  company: string;
  companyId?: string | null;
  location: string;
  salary: string;
  employmentType: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  companyLogo?: string;
  postedDate?: string;
  isActive: boolean;
  status?: "Active" | "Draft" | "Closed" | "Paused";
  views?: number;
  applicants?: number;
  commitment?: string;
  workMode?: string;
  skills?: string[];
  createdAt?: number;
}
