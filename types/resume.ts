export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: {
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
  }[];
  skills: string[];
}

export interface JobDescriptionData {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  keywords: string[];
}

export interface TailoredResume {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: {
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
  }[];
  skills: string[];
  jobTitle: string;
  companyName: string;
} 

export interface InterviewQuestions {
  question: string;
  answer: string;
}