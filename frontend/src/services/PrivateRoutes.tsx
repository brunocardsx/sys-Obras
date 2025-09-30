// src/services/PrivateRoutes.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../types/constants';

interface RequireAuthProps {
  readonly children: React.ReactNode;
}

const verifyAuth = (): boolean => {
  const token = localStorage.getItem(STORAGE_KEYS.LOGIN_TOKEN);
  return Boolean(token);
};

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const isAuth = verifyAuth();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export { RequireAuth };