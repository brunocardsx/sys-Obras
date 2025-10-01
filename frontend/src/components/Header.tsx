// src/components/Header.tsx
import React from 'react';
import './header.css';
import { Logo } from './Logo';

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
      <Logo size="medium" className="header-logo" />
    </header>
  );
};

export { Header };