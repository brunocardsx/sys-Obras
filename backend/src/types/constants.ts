// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API Routes
export const API_ROUTES = {
  AUTH: '/api/auth',
  PRODUCTS: '/api/products',
  PROJECTS: '/api/projects',
  INVOICES: '/api/invoices',
  SALES: '/api/sales',
  DASHBOARD: '/api/dashboard',
  HEALTH: '/api/health',
} as const;

// Database Table Names
export const TABLE_NAMES = {
  PRODUCTS: 'products',
  PROJECTS: 'projects',
  INVOICES: 'invoices',
  INVOICE_ITEMS: 'invoice_items',
} as const;

// JWT Configuration
export const JWT_CONFIG = {
  EXPIRES_IN: '8h',
  ALGORITHM: 'HS256',
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'Campo obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PASSWORD: 'Senha inválida',
  INVALID_DATE: 'Data inválida',
  INVALID_NUMBER: 'Número inválido',
  DUPLICATE_ENTRY: 'Registro já existe',
  NOT_FOUND: 'Registro não encontrado',
  UNAUTHORIZED: 'Acesso não autorizado',
  FORBIDDEN: 'Acesso negado',
  INTERNAL_ERROR: 'Erro interno do servidor',
} as const;

// Error Codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  JWT_ERROR: 'JWT_ERROR',
} as const;

// Cache Keys
export const CACHE_KEYS = {
  PRODUCTS: 'products',
  PROJECTS: 'projects',
  INVOICES: 'invoices',
  USER_SESSION: 'user_session',
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

