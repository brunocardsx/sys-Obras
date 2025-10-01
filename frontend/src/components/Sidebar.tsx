import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Logo Section */}
      <div className="sidebar-logo">
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#gradient)" />
              <path d="M8 12h16v8H8V12z" fill="white" />
              <path d="M12 8h8v4h-8V8z" fill="white" />
              <path d="M12 20h8v4h-8v-4z" fill="white" />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-title">SisTest</span>
            <span className="logo-subtitle">Gestão de Obras</span>
          </div>
        </div>
        <button className="sidebar-toggle" onClick={onToggle}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">MENU</div>
          
          <a href="/dashboard" className="nav-item active">
            <div className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" fill="currentColor" />
              </svg>
            </div>
            <span className="nav-text">Dashboard</span>
          </a>

          <a href="/invoices" className="nav-item">
            <div className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" fill="currentColor" />
                <path d="M6 8h8v1H6V8zm0 2h8v1H6v-1zm0 2h5v1H6v-1z" fill="currentColor" />
              </svg>
            </div>
            <span className="nav-text">Notas Fiscais</span>
            <div className="nav-badge">170</div>
          </a>

          <a href="/projects" className="nav-item">
            <div className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" fill="currentColor" />
              </svg>
            </div>
            <span className="nav-text">Projetos</span>
            <div className="nav-badge">2</div>
          </a>

          <a href="/products" className="nav-item">
            <div className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" fill="currentColor" />
              </svg>
            </div>
            <span className="nav-text">Produtos</span>
            <div className="nav-badge">180</div>
          </a>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">RELATÓRIOS</div>
          
          <a href="/reports" className="nav-item">
            <div className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" fill="currentColor" />
              </svg>
            </div>
            <span className="nav-text">Relatórios</span>
          </a>

          <a href="/analytics" className="nav-item">
            <div className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" fill="currentColor" />
              </svg>
            </div>
            <span className="nav-text">Analytics</span>
          </a>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">CONFIGURAÇÕES</div>
          
          <a href="/settings" className="nav-item">
            <div className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" fill="currentColor" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" fill="currentColor" />
              </svg>
            </div>
            <span className="nav-text">Configurações</span>
          </a>
        </div>
      </nav>

      {/* User Profile */}
      <div className="sidebar-user">
        <div className="user-avatar">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="User" />
        </div>
        <div className="user-info">
          <div className="user-name">Bruno Silva</div>
          <div className="user-role">Administrador</div>
        </div>
        <button className="user-menu">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
