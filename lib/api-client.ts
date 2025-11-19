import axios, { AxiosError } from 'axios';
import type {
  CreateLeadData,
  Lead,
  LeadStats,
  PaginationParams,
  CreateTestimonialData,
  Testimonial,
  TestimonialStats,
  ReviewTestimonialData,
  LoginResponse,
  User,
} from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.amanahbestcredit.com/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  // ✅ SECURITY FIX: Enable credentials to send httpOnly cookies automatically
  withCredentials: true,
});

// ✅ Add Authorization token to all requests
apiClient.interceptors.request.use((config) => {
  // Get auth token from cookie
  if (typeof document !== 'undefined') {
    const authToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='))
      ?.split('=')[1];

    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }

    // Add CSRF token for state-changing methods
    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
  }
  return config;
});

// Response interceptor (for error handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - cookies will be cleared by server
      // Redirect to login page
      if (typeof window !== 'undefined') {
        const lang = window.location.pathname.split('/')[1] || 'en';
        window.location.href = `/${lang}/admin`;
      }
    }
    return Promise.reject(error);
  }
);

// API Methods
export const api = {
  // Leads
  leads: {
    create: async (data: CreateLeadData): Promise<Lead> => {
      const response = await apiClient.post<Lead>('/leads', data);
      return response.data;
    },
    getAll: async (params?: PaginationParams): Promise<Lead[]> => {
      const response = await apiClient.get<Lead[]>('/leads', { params });
      return response.data;
    },
    getStats: async (): Promise<LeadStats> => {
      const response = await apiClient.get<LeadStats>('/leads/stats');
      return response.data;
    },
    getOne: async (id: string): Promise<Lead> => {
      const response = await apiClient.get<Lead>(`/leads/${id}`);
      return response.data;
    },
    updateStatus: async (id: string, status: string): Promise<Lead> => {
      const response = await apiClient.patch<Lead>(`/leads/${id}/status`, { status });
      return response.data;
    },
    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/leads/${id}`);
    },
  },

  // Testimonials
  testimonials: {
    create: async (data: CreateTestimonialData): Promise<Testimonial> => {
      const response = await apiClient.post<Testimonial>('/testimonials', data);
      return response.data;
    },
    getApproved: async (): Promise<Testimonial[]> => {
      const response = await apiClient.get<Testimonial[]>('/testimonials/approved');
      return response.data;
    },
    getPending: async (): Promise<Testimonial[]> => {
      const response = await apiClient.get<Testimonial[]>('/testimonials/pending');
      return response.data;
    },
    getStats: async (): Promise<TestimonialStats> => {
      const response = await apiClient.get<TestimonialStats>('/testimonials/stats');
      return response.data;
    },
    getOne: async (id: string): Promise<Testimonial> => {
      const response = await apiClient.get<Testimonial>(`/testimonials/${id}`);
      return response.data;
    },
    approve: async (id: string, reviewedBy: string): Promise<Testimonial> => {
      const response = await apiClient.patch<Testimonial>(`/testimonials/${id}/approve`, { reviewedBy } as ReviewTestimonialData);
      return response.data;
    },
    reject: async (id: string, reviewedBy: string): Promise<Testimonial> => {
      const response = await apiClient.patch<Testimonial>(`/testimonials/${id}/reject`, { reviewedBy } as ReviewTestimonialData);
      return response.data;
    },
    toggleFeatured: async (id: string): Promise<Testimonial> => {
      const response = await apiClient.patch<Testimonial>(`/testimonials/${id}/featured`);
      return response.data;
    },
    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/testimonials/${id}`);
    },
  },

  // Auth
  auth: {
    login: async (email: string, password: string): Promise<LoginResponse> => {
      const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
      return response.data;
    },
    getProfile: async (): Promise<User> => {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    },
  },

  // Admin Users
  adminUsers: {
    getAll: async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
      status?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }): Promise<any> => {
      const response = await apiClient.get('/admin-users', { params });
      return response.data;
    },
    getStats: async (): Promise<any> => {
      const response = await apiClient.get('/admin-users/stats');
      return response.data;
    },
    getOne: async (id: string): Promise<any> => {
      const response = await apiClient.get(`/admin-users/${id}`);
      return response.data;
    },
    create: async (data: {
      name: string;
      email: string;
      password: string;
      role: string;
      status: string;
    }): Promise<any> => {
      const response = await apiClient.post('/admin-users', data);
      return response.data;
    },
    update: async (id: string, data: {
      name?: string;
      email?: string;
      role?: string;
      status?: string;
    }): Promise<any> => {
      const response = await apiClient.patch(`/admin-users/${id}`, data);
      return response.data;
    },
    updateStatus: async (id: string, status: string): Promise<any> => {
      const response = await apiClient.patch(`/admin-users/${id}/status`, { status });
      return response.data;
    },
    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/admin-users/${id}`);
    },
  },

  // Settings
  settings: {
    get: async (): Promise<any> => {
      const response = await apiClient.get('/settings');
      return response.data;
    },
    update: async (data: any): Promise<any> => {
      const response = await apiClient.patch('/settings', data);
      return response.data;
    },
    testEmail: async (email: string): Promise<any> => {
      const response = await apiClient.post('/settings/test-email', { email });
      return response.data;
    },
  },

  // Audit Logs
  auditLogs: {
    getAll: async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      action?: string;
      status?: string;
      userId?: string;
      startDate?: string;
      endDate?: string;
    }): Promise<any> => {
      const response = await apiClient.get('/audit-logs', { params });
      return response.data;
    },
    export: async (format: 'csv' | 'json'): Promise<any> => {
      const response = await apiClient.get(`/audit-logs/export/${format}`, {
        responseType: 'blob',
      });
      return response.data;
    },
  },

  // Reports
  reports: {
    getMetrics: async (params?: { startDate?: string; endDate?: string }): Promise<any> => {
      const response = await apiClient.get('/reports/metrics', { params });
      return response.data;
    },
    getLeadSources: async (params?: { startDate?: string; endDate?: string }): Promise<any> => {
      const response = await apiClient.get('/reports/lead-sources', { params });
      return response.data;
    },
    getLoanTypes: async (params?: { startDate?: string; endDate?: string }): Promise<any> => {
      const response = await apiClient.get('/reports/loan-types', { params });
      return response.data;
    },
    getMonthlyTrends: async (params?: { months?: number }): Promise<any> => {
      const response = await apiClient.get('/reports/monthly-trends', { params });
      return response.data;
    },
    getTopProducts: async (params?: { limit?: number }): Promise<any> => {
      const response = await apiClient.get('/reports/top-products', { params });
      return response.data;
    },
    export: async (format: 'csv' | 'pdf', params?: any): Promise<any> => {
      const response = await apiClient.get(`/reports/export/${format}`, {
        params,
        responseType: 'blob',
      });
      return response.data;
    },
  },
};

export default apiClient;
