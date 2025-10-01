// src/components/Menu.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../menu/menu.css';

interface MenuItem {
  readonly path: string;
  readonly icon: string;
  readonly label: string;
}

interface MenuProps {
  readonly isOpen: boolean;
  readonly closeMenu: () => void;
}

const PRIMARY_MENU_ITEMS: readonly MenuItem[] = [
  { path: '/dashboard', icon: 'fas fa-home', label: 'Início' },
  { path: '/invoices/create', icon: 'fas fa-file-invoice-dollar', label: 'Cadastrar Nota' },
  { path: '/invoices/search', icon: 'fas fa-search', label: 'Consultar Nota' },
  { path: '/projects', icon: 'fas fa-building-columns', label: 'Projetos' },
] as const;

const SECONDARY_MENU_ITEMS: readonly MenuItem[] = [
  { path: '/configuracoes', icon: 'fas fa-cog', label: 'Configurações' },
  { path: '/login', icon: 'fas fa-sign-out-alt', label: 'Sair' },
] as const;

const Menu: React.FC<MenuProps> = ({ isOpen, closeMenu }) => {
  const location = useLocation();

  const isActive = (path: string): string => {
    if (path === '/invoices/search' && location.pathname.includes('/invoices/search')) {
      return 'active';
    }
    if (path === '/invoices/create' && location.pathname.includes('/invoices/create')) {
      return 'active';
    }
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      {/* Mobile overlay to close menu when clicking outside */}
      <div
        className={`menu-overlay ${isOpen ? 'show' : ''}`}
        onClick={closeMenu}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            closeMenu();
          }
        }}
        aria-label="Fechar menu"
      />

      {/* Menu container with dynamic 'open' class */}
      <aside className={`menu-container ${isOpen ? 'open' : ''}`}>
        <div className="logo-container">
          <Link to="/dashboard" onClick={closeMenu}>
            <img src={require("../images/logo.png").default} alt="Logo do Sistema" />
          </Link>
        </div>

        <nav className="menu-nav">
          {PRIMARY_MENU_ITEMS.map(item => (
            <Link 
              to={item.path} 
              className="menu-item-link" 
              key={item.label} 
              onClick={closeMenu}
            >
              <div className={`menu-item ${isActive(item.path)}`}>
                <i className={item.icon} />
                <span className="menu-item-text">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="menu-spacer" />

        <nav className="menu-nav">
          {SECONDARY_MENU_ITEMS.map(item => (
            <Link 
              to={item.path} 
              className="menu-item-link" 
              key={item.label} 
              onClick={closeMenu}
            >
              <div className={`menu-item ${isActive(item.path)}`}>
                <i className={item.icon} />
                <span className="menu-item-text">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export { Menu };