// src/App.tsx
import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";

// Import layout and auth components (not lazy loaded)
import { Menu } from './components/Menu';
import { Header } from './components/Header';
import { RequireAuth } from "./services/PrivateRoutes";
import { Login } from './pages/Login';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Product = lazy(() => import('./pages/Product').then(module => ({ default: module.Product })));
const SelectAction = lazy(() => import('./pages/SelectAction').then(module => ({ default: module.SelectAction })));
const Sale = lazy(() => import('./pages/Sale').then(module => ({ default: module.Sale })));
const Receive = lazy(() => import('./pages/Receive').then(module => ({ default: module.Receive })));
const Stock = lazy(() => import('./pages/Stock').then(module => ({ default: module.Stock })));
const Invoices = lazy(() => import('./pages/Invoices').then(module => ({ default: module.Invoices })));
const InvoiceSearch = lazy(() => import('./pages/InvoiceSearch').then(module => ({ default: module.InvoiceSearch })));
const CreateInvoice = lazy(() => import('./pages/CreateInvoice').then(module => ({ default: module.CreateInvoice })));
const Projects = lazy(() => import('./pages/Projects').then(module => ({ default: module.Projects })));
const Error404 = lazy(() => import('./pages/Error404').then(module => ({ default: module.Error404 })));

// Loading component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '50vh',
    fontSize: '18px',
    color: '#666'
  }}>
    <div>
      <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
      Carregando...
    </div>
  </div>
);

// ==============================================================================
// MainLayout controls menu state and renders Header
// ==============================================================================
const MainLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);
  const closeMenu = (): void => setIsMenuOpen(false);

  // Fecha o menu quando a tela for redimensionada para desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-layout">
      <Menu isOpen={isMenuOpen} closeMenu={closeMenu} />
      <div className="main-content-area">
        <Header toggleMenu={toggleMenu} />
        <main className="content-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes that don't use MainLayout */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />

        {/* Protected routes that use MainLayout with menu */}
        <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
          <Route path="/dashboard" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="/projects" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Projects />
            </Suspense>
          } />
          <Route path="/products" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Product />
            </Suspense>
          } />
          <Route path="/select-action" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SelectAction />
            </Suspense>
          } />
          <Route path="/select-action/venda" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Sale />
            </Suspense>
          } />
          <Route path="/select-action/receber" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Receive />
            </Suspense>
          } />
          <Route path="/invoices" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Invoices />
            </Suspense>
          } />
          <Route path="/invoices/search" element={
            <Suspense fallback={<LoadingSpinner />}>
              <InvoiceSearch />
            </Suspense>
          } />
          <Route path="/invoices/create" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CreateInvoice />
            </Suspense>
          } />
          <Route path="/stock" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Stock />
            </Suspense>
          } />

          {/* Catch-all route for pages not found within logged area */}
          <Route path="*" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Error404 />
            </Suspense>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export { App };