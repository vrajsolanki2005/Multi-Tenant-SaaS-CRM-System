// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
  message?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

// Auth Types
export interface LoginResponse {
  token: string;
  userId: number;
  orgId: number;
  message?: string;
}

export interface CreateOrgResponse {
  message: string;
  orgId: number;
  userId: number;
  token: string;
}
