/**
 * API Service for SMS Dashboard
 * Centralizes all API calls and handles authentication
 */

// Base API URL - should be stored in .env file in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || 'your-default-token';

// Request timeout in milliseconds
const TIMEOUT = 30000;

// HTTP request methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Interface for API request options
interface RequestOptions {
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string;
  timeout?: number;
}

// Interface for API response
interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  error: string | null;
  message: string | null;
  status: number;
}

/**
 * Creates a timeout promise that rejects after specified milliseconds
 */
const timeoutPromise = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });
};

/**
 * Get authentication token - either from localStorage or fallback to env variable
 */
const getAuthToken = (): string => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) return token;
  }
  return API_TOKEN;
};

/**
 * Main API request function
 */
async function apiRequest<T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  data: any = null,
  customHeaders: Record<string, string> = {},
  includeAuth: boolean = true
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };
    
    // Add auth token if needed
    if (includeAuth) {
      headers['Authorization'] = `Bearer ${getAuthToken()}`;
    }
    
    // Prepare request options
    const options: RequestOptions = {
      method,
      headers,
    };
    
    // Add body for non-GET requests
    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }
    
    // Make the request with timeout
    const response = await Promise.race([
      fetch(url, options),
      timeoutPromise(TIMEOUT)
    ]);
    
    // Parse response
    const responseData = await response.json();
    
    // Return standardized response
    return {
      data: response.ok ? responseData.data : null,
      success: response.ok ? responseData.success : false,
      error: response.ok ? null : responseData.error || 'An error occurred',
      message: responseData.message || null,
      status: response.status
    };
  } catch (error) {
    // Handle network errors or timeouts
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Network or server error',
      status: 0
    };
  }
}

/**
 * API Service with methods for different endpoints
 */
const apiService = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) => 
      apiRequest<{ token: string, user: any }>('/auth/login', 'POST', { email, password }, {}, false),
    
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
      return Promise.resolve({ 
        data: null, 
        success: true, 
        error: null, 
        message: 'Logged out successfully', 
        status: 200 
      });
    },
    
    validateToken: () => 
      apiRequest<{ valid: boolean }>('/auth/validate', 'GET')
  },
  
  // Students endpoints
  students: {
    getAll: (filters?: any) => 
      apiRequest<any[]>('/students', 'GET', filters),
    
    getById: (id: string) => 
      apiRequest<any>(`/students/${id}`, 'GET'),
    
    create: (data: any) => 
      apiRequest<any>('/students', 'POST', data),
    
    update: (id: string, data: any) => 
      apiRequest<any>(`/students/${id}`, 'PUT', data),
    
    delete: (id: string) => 
      apiRequest<any>(`/students/${id}`, 'DELETE')
  },
  
  // Classes endpoints
  classes: {
    getAll: (filters?: any) => 
      apiRequest<any[]>('/classes', 'GET', filters),
    
    getById: (id: string) => 
      apiRequest<any>(`/classes/${id}`, 'GET'),
    
    create: (data: any) => 
      apiRequest<any>('/classes', 'POST', data),
    
    update: (id: string, data: any) => 
      apiRequest<any>(`/classes/${id}`, 'PUT', data),
    
    delete: (id: string) => 
      apiRequest<any>(`/classes/${id}`, 'DELETE')
  },
  
  // Teachers endpoints
  teachers: {
    getAll: (filters?: any) => 
      apiRequest<any[]>('/teachers', 'GET', filters),
    
    getById: (id: string) => 
      apiRequest<any>(`/teachers/${id}`, 'GET'),
    
    create: (data: any) => 
      apiRequest<any>('/teachers', 'POST', data),
    
    update: (id: string, data: any) => 
      apiRequest<any>(`/teachers/${id}`, 'PUT', data),
    
    delete: (id: string) => 
      apiRequest<any>(`/teachers/${id}`, 'DELETE')
  },
  
  // Subjects endpoints
  subjects: {
    getAll: (filters?: any) => 
      apiRequest<any[]>('/subjects', 'GET', filters),
    
    getById: (id: string) => 
      apiRequest<any>(`/subjects/${id}`, 'GET'),
    
    create: (data: any) => 
      apiRequest<any>('/subjects', 'POST', data),
    
    update: (id: string, data: any) => 
      apiRequest<any>(`/subjects/${id}`, 'PUT', data),
    
    delete: (id: string) => 
      apiRequest<any>(`/subjects/${id}`, 'DELETE')
  },
  
  // Attendance endpoints
  attendance: {
    getAll: (filters?: any) => 
      apiRequest<any[]>('/attendance', 'GET', filters),
    
    getByDate: (date: string, classId?: string) => 
      apiRequest<any[]>(`/attendance/date/${date}${classId ? `?classId=${classId}` : ''}`, 'GET'),
    
    create: (data: any) => 
      apiRequest<any>('/attendance', 'POST', data),
    
    update: (id: string, data: any) => 
      apiRequest<any>(`/attendance/${id}`, 'PUT', data),
    
    delete: (id: string) => 
      apiRequest<any>(`/attendance/${id}`, 'DELETE')
  },
  
  // Reports endpoints
  reports: {
    getAll: (filters?: any) => 
      apiRequest<any[]>('/reports', 'GET', filters),
    
    getById: (id: string) => 
      apiRequest<any>(`/reports/${id}`, 'GET'),
    
    generate: (reportType: string, params: any) => 
      apiRequest<any>('/reports/generate', 'POST', { reportType, ...params }),
    
    download: (id: string, format: 'pdf' | 'csv' = 'pdf') => 
      apiRequest<Blob>(`/reports/${id}/download?format=${format}`, 'GET', null, {
        Accept: format === 'pdf' ? 'application/pdf' : 'text/csv'
      })
  }
};

export default apiService;
