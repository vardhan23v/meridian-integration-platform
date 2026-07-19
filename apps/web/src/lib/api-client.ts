import axios, { AxiosRequestConfig } from 'axios';

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token
instance.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('meridian_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore localStorage access errors
    }
  }
  return config;
});

// Interceptor to handle global errors (e.g. 401 logout)
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Force logout on token expiry
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('meridian_token');
          window.location.href = '/login';
        } catch {
          // Ignore localStorage access errors
        }
      }
    }

    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const apiClient = {
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await instance.get(url, config);
    return response.data as ApiResponse<T>;
  },
  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await instance.post(url, data, config);
    return response.data as ApiResponse<T>;
  },
  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await instance.put(url, data, config);
    return response.data as ApiResponse<T>;
  },
  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await instance.patch(url, data, config);
    return response.data as ApiResponse<T>;
  },
  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await instance.delete(url, config);
    return response.data as ApiResponse<T>;
  },
};
