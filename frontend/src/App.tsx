// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";

// Import pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Product } from './pages/Product';
import { SelectAction } from './pages/SelectAction';
import { Sale } from "./pages/Sale";
import { Receive } from "./pages/Receive";
import { Stock } from './pages/Stock';
import { Invoices } from './pages/Invoices';
import { Projects } from "./pages/Projects";
import { Error404 } from "./pages/Error404";

// Import layout and auth components
import { Menu } from './components/Menu';
import { Header } from './components/Header';
import { RequireAuth } from "./services/PrivateRoutes";

// ==============================================================================
// MainLayout controls menu state and renders Header
// ==============================================================================
const MainLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);
  const closeMenu = (): void => setIsMenuOpen(false);

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/products" element={<Product />} />
          <Route path="/select-action" element={<SelectAction />} />
          <Route path="/select-action/venda" element={<Sale />} />
          <Route path="/select-action/receber" element={<Receive />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/stock" element={<Stock />} />

          {/* Catch-all route for pages not found within logged area */}
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export { App };