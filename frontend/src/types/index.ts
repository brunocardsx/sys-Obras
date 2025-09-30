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
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Obra {
  readonly id: number;
  readonly name: string;
  readonly address?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface NotaFiscal {
  readonly id: number;
  readonly numero: string;
  readonly dataEmissao: string;
  readonly obraId: number;
  readonly obra?: Obra;
  readonly itens: ItemNotaFiscal[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ItemNotaFiscal {
  readonly id: number;
  readonly notaFiscalId: number;
  readonly produtoId: number;
  readonly quantidade: number;
  readonly valorUnitario: number;
  readonly produto?: Product;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  readonly status: boolean;
  readonly data?: T;
  readonly message?: string;
  readonly error?: string;
}

// Request types
export interface CreateProductRequest {
  readonly name: string;
  readonly brand?: string;
  readonly cost: number;
  readonly resalePrice: number;
}

export interface CreateObraRequest {
  readonly name: string;
  readonly address?: string;
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

// UI types
export interface SelectOption {
  readonly value: number;
  readonly label: string;
}

export interface ChartData {
  readonly labels: string[];
  readonly datasets: ChartDataset[];
}

export interface ChartDataset {
  readonly data: number[];
  readonly backgroundColor: string[];
  readonly borderColor: string;
  readonly borderWidth: number;
  readonly hoverOffset: number;
}

// Form types
export interface ProductFormData {
  readonly name: string;
  readonly brand: string;
  readonly cost: string;
  readonly resalePrice: string;
}

export interface ObraFormData {
  readonly name: string;
  readonly address: string;
}

export interface NotaFiscalFormData {
  readonly numero: string;
  readonly dataEmissao: string;
  readonly obraId: number;
  readonly itens: NotaFiscalItemFormData[];
}

export interface NotaFiscalItemFormData {
  readonly produtoId: number;
  readonly quantidade: number;
  readonly valorUnitario: number;
}

// Error types
export interface ApiError {
  readonly message: string;
  readonly statusCode: number;
  readonly code?: string;
}
