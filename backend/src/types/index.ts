// Core domain types
export interface User {
  readonly id: number;
  readonly username: string;
  readonly role: UserRole;
}

export type UserRole = 'admin' | 'user';

export interface Product {
  readonly id: number;
  readonly name: string;
  readonly brand?: string;
  readonly cost: number;
  readonly resalePrice: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Obra {
  readonly id: number;
  readonly name: string;
  readonly address?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface NotaFiscal {
  readonly id: number;
  readonly numero: string;
  readonly dataEmissao: Date;
  readonly obraId: number;
  readonly obra?: Obra | undefined;
  readonly itens: ItemNotaFiscal[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ItemNotaFiscal {
  readonly id: number;
  readonly notaFiscalId: number;
  readonly produtoId: number;
  readonly quantidade: number;
  readonly valorUnitario: number;
  readonly produto?: Product | undefined;
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
  readonly name: string;
  readonly brand?: string | undefined;
  readonly cost: number;
  readonly resalePrice: number;
}

export interface CreateObraRequest {
  readonly name: string;
  readonly address?: string | undefined;
}

export interface CreateNotaFiscalRequest {
  readonly numero: string;
  readonly dataEmissao: string;
  readonly obraId: number;
  readonly itens: CreateItemNotaFiscalRequest[];
}

export interface CreateItemNotaFiscalRequest {
  readonly produtoId: number;
  readonly quantidade: number;
  readonly valorUnitario: number;
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

