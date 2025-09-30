// src/pages/Error404.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Error404: React.FC = () => {
  return (
    <div>
      <h1>404 - Página não encontrada</h1>
      <p>A página que você está procurando não existe.</p>
      <Link to="/dashboard">Voltar ao Dashboard</Link>
    </div>
  );
};

export { Error404 };