import { VALIDATION_RULES } from '@/types/constants';

// Form validation functions
export const validateRequired = (value: string): string | null => {
  if (!value || value.trim().length === 0) {
    return 'Campo obrigatório';
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number): string | null => {
  if (value.length < minLength) {
    return `Mínimo de ${minLength} caracteres`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number): string | null => {
  if (value.length > maxLength) {
    return `Máximo de ${maxLength} caracteres`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Email inválido';
  }
  return null;
};

export const validateNumber = (value: string | number, min: number = 0): string | null => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num) || !isFinite(num)) {
    return 'Número inválido';
  }
  if (num < min) {
    return `Valor deve ser maior ou igual a ${min}`;
  }
  return null;
};

export const validatePositiveNumber = (value: string | number): string | null => {
  return validateNumber(value, 0);
};

export const validateInteger = (value: string | number): string | null => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num) || !isFinite(num) || !Number.isInteger(num)) {
    return 'Número inteiro inválido';
  }
  if (num < 1) {
    return 'Valor deve ser maior que zero';
  }
  return null;
};

// Product validation
export const validateProductName = (name: string): string | null => {
  const required = validateRequired(name);
  if (required) return required;
  
  const minLength = validateMinLength(name, VALIDATION_RULES.MIN_NAME_LENGTH);
  if (minLength) return minLength;
  
  const maxLength = validateMaxLength(name, VALIDATION_RULES.MAX_NAME_LENGTH);
  if (maxLength) return maxLength;
  
  return null;
};

export const validateProductPrice = (price: string | number): string | null => {
  return validatePositiveNumber(price);
};

export const validateProductQuantity = (quantity: string | number): string | null => {
  return validateInteger(quantity);
};

// Obra validation
export const validateObraName = (name: string): string | null => {
  return validateProductName(name); // Same validation rules
};

// Generic form validation
export const validateForm = (data: Record<string, any>, rules: Record<string, (value: any) => string | null>): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const error = rules[field](value);
    if (error) {
      errors[field] = error;
    }
  });
  
  return errors;
};
