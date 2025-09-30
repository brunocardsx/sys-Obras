import { Response } from 'express';
import { HTTP_STATUS, VALIDATION_MESSAGES } from '../types/constants';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = HTTP_STATUS.OK
): void => {
  const response: ApiResponse<T> = {
    status: true,
    data,
    message,
  };
  
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  error?: string
): void => {
  const response: ApiResponse = {
    status: false,
    message,
    error,
  };
  
  res.status(statusCode).json(response);
};

export const sendValidationError = (
  res: Response,
  message: string = VALIDATION_MESSAGES.REQUIRED_FIELD
): void => {
  sendError(res, message, HTTP_STATUS.BAD_REQUEST);
};

export const sendNotFoundError = (
  res: Response,
  message: string = VALIDATION_MESSAGES.NOT_FOUND
): void => {
  sendError(res, message, HTTP_STATUS.NOT_FOUND);
};

export const sendUnauthorizedError = (
  res: Response,
  message: string = VALIDATION_MESSAGES.UNAUTHORIZED
): void => {
  sendError(res, message, HTTP_STATUS.UNAUTHORIZED);
};

export const sendForbiddenError = (
  res: Response,
  message: string = VALIDATION_MESSAGES.FORBIDDEN
): void => {
  sendError(res, message, HTTP_STATUS.FORBIDDEN);
};

export const sendConflictError = (
  res: Response,
  message: string = VALIDATION_MESSAGES.DUPLICATE_ENTRY
): void => {
  sendError(res, message, HTTP_STATUS.CONFLICT);
};

export const sendInternalError = (
  res: Response,
  message: string = VALIDATION_MESSAGES.INTERNAL_ERROR
): void => {
  sendError(res, message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
};

