// src/components/Logo.tsx
import React from 'react';
import './logo.css';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  className = ''
}) => {
  return (
    <div className={`logo-container ${size} ${className}`}>
      <img 
        src="/logo-gn.png" 
        alt="GN EMPREENDIMENTOS" 
        className="logo-image"
      />
    </div>
  );
};

export { Logo };
