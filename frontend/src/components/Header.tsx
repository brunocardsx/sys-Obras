// src/components/Header.tsx
import React from 'react';
import './header.css';

interface HeaderProps {
  readonly toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  return (
    <header className="main-header">
      <button 
        className="menu-toggle-btn" 
        onClick={toggleMenu} 
        aria-label="Abrir menu"
        type="button"
      >
        <i className="fas fa-bars" />
      </button>
      <h1 className="header-title">Sistema de Gestão</h1>
    </header>
  );
};

export { Header };