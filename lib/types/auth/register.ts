export const ACADEMIC_ROLES = [
    "Undergraduate Student",
    "Master's Student",
    "PhD Student",
    "Postdoctoral Researcher",
    "Research Assistant",
    "Teaching Assistant",
    "Research Associate",
    "Research Fellow",
    "Lecturer",
    "Assistant Professor",
    "Associate Professor",
    "Professor",
    "Research Scientist",
    "AI/ML Engineer",
    "Data Scientist",
    "Software Engineer",
    "Industry Researcher",
    "Independent Researcher",
    "Visiting Scholar",
    "Entrepreneur",
    "Other",
] as const;

export type AcademicRole = (typeof ACADEMIC_ROLES)[number];

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    scholarId: string;
    institution: string;
    role: AcademicRole | "";
}

export type RegisterTextField = keyof Omit<RegisterFormData, "role">;

export interface RegisterFormErrors {
    name?: string;
    email?: string;
    password?: string;
    scholarId?: string;
    institution?: string;
    role?: string;
}

export interface RegisterApiPayload {
    name: string;
    email: string;
    password: string;
    scholarId: string;
    institution: string;
    role: AcademicRole;
}

export interface RegisterApiResponse {
    success: boolean;
    message: string;
    userId?: string;
}