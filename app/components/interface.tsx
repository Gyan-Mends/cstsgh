export interface ContactInterface {
    _id: string,
    fullname: string,
    email: string,
    phone: string,
    message: string,
    createdAt?: string,
    updatedAt?: string,
}

export interface ContactResponse {
    success: boolean;
    message: string;
}

export interface LoginInterface {
    _id: string,
    email: string,
    password: string,
}

export interface UsersInterface {
    _id?: string;
    fullName: string;
    email: string;
    phone: string;
    position: string;
    role?: 'admin' | 'staff';
    password: string;
    image?: string;
}

export interface BlogInterface {
    _id: string
    name: string
    description: string
    image: string
    category: string | { _id: string; name: string; description: string }
    admin: string | { _id: string; fullName: string; email: string }
    status?: 'draft' | 'review' | 'published'
    createdAt?: string
    updatedAt?: string
}

export interface CategoryInterface {
    _id: string;
    name: string
    description: string
    admin: string
}
export interface TrainingResponse {
    success: boolean;
    message: string;
}

export interface TrainingInterface {
    _id: string;
    title: string;
    description: string;
    date: string;
    duration: string;
    format: string;
    image: string;
    client: string;
    trainingType?: string;
    trainingTypeId?: string;
}

export interface TrainingTypeInterface {
    _id: string;
    name: string;
    description: string;
    image: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface TrainingTypeResponse {
    success: boolean;
    message: string;
}

export interface EventInterface {
    _id: string;
    title: string;
    description: string;
    date: string;
    duration: string;
    location: string;
    image: string;
}
export interface ComplianceNoticeInterface {
    _id: string;
    title: string;
    description: string;
}

export interface GalleryInterface {
    _id: string;
    title: string;
    type: string;
    image: string;
}

export interface DirectorsBankInterface {
    _id: string;
    name: string;
    position: string;
    bio?: string;
    image: string;
    areasOfExpertise: string[];
    email?: string;
    phone?: string;
}

// Report interfaces
export type ReportCategory = 
  | 'Trade Forums'
  | 'Legal Conferences'
  | 'Technology Conferences'
  | 'Government Meetings'
  | 'Business Roundtables'
  | 'Academic Conferences';

export interface ReportInterface {
    _id: string;
    title: string;
    description: string;
    category: ReportCategory;
    eventDate: string;
    createdAt?: string;
    updatedAt?: string;
    filename?: string;
    fileUrl?: string;
    fileSize?: number;
    filePath?: string;
    isPublished: boolean;
    tags?: string[];
    eventLocation?: string;
    eventOrganizer?: string;
    summary?: string;
    keyOutcomes?: string[];
}

