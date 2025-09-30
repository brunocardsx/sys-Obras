// Core domain types
export interface User {
  readonly id: string;
  readonly username: string;
  readonly role: UserRole;
}

export type UserRole = 'admin' | 'user';

export interface Product {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly categoryId?: string;
  readonly unit?: string;
  readonly costPrice: number;
  readonly sellingPrice: number;
  readonly stockQuantity?: number;
  readonly minStock?: number;
  readonly maxStock?: number;
  readonly isActive?: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly address?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Invoice {
  readonly id: string;
  readonly number: string;
  readonly series?: string;
  readonly supplierId?: string;
  readonly projectId: string;
  readonly issueDate: Date;
  readonly dueDate?: Date;
  readonly subtotal?: number;
  readonly taxAmount?: number;
  readonly totalAmount: number;
  readonly status?: string;
  readonly paymentDate?: Date;
  readonly notes?: string;
  readonly project?: Project | undefined;
  readonly items: InvoiceItem[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface InvoiceItem {
  readonly id: string;
  readonly invoiceId: string;
  readonly productId: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly product?: Product | undefined;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  readonly status: boolean;
  readonly data?: T;
  readonly message?: string | undefined;
  readonly error?: string | undefined;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
  };
}

// Request types
export interface CreateProductRequest {
  readonly code: string;
  readonly name: string;
  readonly description?: string | undefined;
  readonly categoryId?: string | undefined;
  readonly unit?: string | undefined;
  readonly costPrice: number;
  readonly sellingPrice: number;
  readonly stockQuantity?: number | undefined;
  readonly minStock?: number | undefined;
  readonly maxStock?: number | undefined;
  readonly isActive?: boolean | undefined;
}

export interface CreateProjectRequest {
  readonly name: string;
  readonly address?: string | undefined;
}

export interface CreateInvoiceRequest {
  readonly number: string;
  readonly series?: string | undefined;
  readonly supplierId?: string | undefined;
  readonly projectId: string;
  readonly issueDate: string;
  readonly dueDate?: string | undefined;
  readonly subtotal?: number | undefined;
  readonly taxAmount?: number | undefined;
  readonly totalAmount: number;
  readonly status?: string | undefined;
  readonly paymentDate?: string | undefined;
  readonly notes?: string | undefined;
  readonly items: CreateInvoiceItemRequest[];
}

export interface CreateInvoiceItemRequest {
  readonly productId: string;
  readonly quantity: number;
  readonly unitPrice: number;
}

// Auth types
export interface LoginRequest {
  readonly username: string;
  readonly password: string;
}

export interface LoginResponse {
  readonly message: string;
  readonly token: string;
}

export interface AuthPayload {
  readonly user: string;
  readonly role: UserRole;
  readonly iat: number;
  readonly exp: number;
}

// Error types
export interface ApiError {
  readonly message: string;
  readonly statusCode: number;
  readonly code?: string;
}

// Database types
export interface DatabaseConfig {
  readonly host: string;
  readonly port: number;
  readonly database: string;
  readonly username: string;
  readonly password: string;
  readonly ssl?: boolean;
}

// Environment types
export interface Environment {
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly PORT: number;
  readonly DB_HOST: string;
  readonly DB_PORT: number;
  readonly DB_NAME: string;
  readonly DB_USER: string;
  readonly DB_PASS: string;
  readonly JWT_SECRET: string;
  readonly ADMIN_USER: string;
  readonly ADMIN_PASS: string;
  readonly FRONTEND_URL: string;
}

