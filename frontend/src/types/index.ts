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
  readonly message?: string;
  readonly error?: string;
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

// UI types
export interface SelectOption {
  readonly value: string;
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
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly categoryId: string;
  readonly unit: string;
  readonly costPrice: string;
  readonly sellingPrice: string;
  readonly stockQuantity: string;
  readonly minStock: string;
  readonly maxStock: string;
  readonly isActive: boolean;
}

export interface ProjectFormData {
  readonly name: string;
  readonly address: string;
}

export interface InvoiceFormData {
  readonly number: string;
  readonly series: string;
  readonly supplierId: string;
  readonly projectId: string;
  readonly issueDate: string;
  readonly dueDate: string;
  readonly subtotal: string;
  readonly taxAmount: string;
  readonly totalAmount: string;
  readonly status: string;
  readonly paymentDate: string;
  readonly notes: string;
  readonly items: InvoiceItemFormData[];
}

export interface InvoiceItemFormData {
  readonly productId: string;
  readonly quantity: number;
  readonly unitPrice: number;
}

// Error types
export interface ApiError {
  readonly message: string;
  readonly statusCode: number;
  readonly code?: string;
}
