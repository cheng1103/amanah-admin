/**
 * API Type Definitions
 * Defines types for all API requests and responses
 */

// Common types
export interface PaginationParams {
  skip?: number;
  take?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Lead types
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  loanAmount: number;
  loanPurpose: string;
  employmentStatus: string;
  monthlyIncome?: number;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface CreateLeadData {
  fullName: string;
  email: string;
  contactNumber: string;
  state: string;
  desiredAmount: number;
  loanType: string;
  employmentStatus: string;
  monthlyIncome?: number;
  companyName?: string;
  purpose?: string;
  comments?: string;
  source?: string;
  locale?: 'ms' | 'en';
  recaptchaToken: string;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  rejected: number;
}

export interface UpdateLeadStatusData {
  status: string;
}

// Testimonial types
export interface Testimonial {
  id: string;
  name: string;
  location?: string;
  rating: number;
  comment: string;
  loanType?: string;
  loanAmount?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isFeatured: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialData {
  customerName: string;
  customerTitle?: string;
  location?: string;
  content: string;
  contentMs?: string;
  rating: number;
  loanType?: string;
  loanAmount?: number;
  recaptchaToken: string;
}

export interface TestimonialStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  featured: number;
}

export interface ReviewTestimonialData {
  reviewedBy: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

// Error types
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
