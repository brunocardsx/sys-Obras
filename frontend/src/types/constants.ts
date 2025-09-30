// API Routes
export const API_ROUTES = {
  AUTH: '/api/auth',
  PRODUCTS: '/api/products',
  PROJECTS: '/api/projects',
  INVOICES: '/api/invoices',
  SALES: '/api/sales',
  HEALTH: '/api/health',
} as const;

// App Routes
export const APP_ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  PROJECTS: '/projects',
  INVOICES: '/invoices',
  STOCK: '/stock',
  SALE: '/select-action',
  SALE_VENDA: '/select-action/venda',
  SALE_RECEIVE: '/select-action/receber',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  LOGIN_TOKEN: 'login_token',
  USER_DATA: 'user_data',
} as const;

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#2DD4BF',
  SECONDARY: '#F5A623',
  TERTIARY: '#4A90E2',
  QUATERNARY: '#BD10E0',
  QUINARY: '#7ED321',
  SENARY: '#E350A2',
} as const;

// Form Validation
export const VALIDATION_RULES = {
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 255,
  MIN_PASSWORD_LENGTH: 1,
  MAX_PASSWORD_LENGTH: 255,
  MIN_QUANTITY: 1,
  MIN_PRICE: 0,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Campo obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PASSWORD: 'Senha inválida',
  INVALID_DATE: 'Data inválida',
  INVALID_NUMBER: 'Número inválido',
  NETWORK_ERROR: 'Erro de conexão',
  UNAUTHORIZED: 'Acesso não autorizado',
  FORBIDDEN: 'Acesso negado',
  NOT_FOUND: 'Registro não encontrado',
  INTERNAL_ERROR: 'Erro interno do servidor',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login realizado com sucesso',
  PRODUCT_CREATED: 'Produto criado com sucesso',
  PRODUCT_UPDATED: 'Produto atualizado com sucesso',
  PRODUCT_DELETED: 'Produto excluído com sucesso',
  PROJECT_CREATED: 'Projeto criado com sucesso',
  PROJECT_UPDATED: 'Projeto atualizado com sucesso',
  PROJECT_DELETED: 'Projeto excluído com sucesso',
  INVOICE_CREATED: 'Nota fiscal criada com sucesso',
} as const;

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 4000,
  MODAL_ANIMATION_DURATION: 200,
  PAGINATION_DEFAULT_PAGE: 1,
  PAGINATION_DEFAULT_LIMIT: 10,
} as const;

// Chart Configuration
export const CHART_CONFIG = {
  PIE_CHART_HEIGHT: 350,
  RESPONSIVE: true,
  MAINTAIN_ASPECT_RATIO: false,
  BORDER_WIDTH: 4,
  HOVER_OFFSET: 8,
} as const;
