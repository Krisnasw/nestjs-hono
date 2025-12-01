export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta: {
    requestId: string;
    platform: string;
    ip: string;
    pagination?: PaginationMeta;
  };
  errors?: any;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
