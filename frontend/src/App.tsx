// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";

// Import pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Product from './pages/Product';
import SelectAction from './pages/SelectAction';
import Sale from "./pages/Sale";
import Receive from "./pages/Receive";
import Stock from './pages/Stock';
import NotaFiscal from './pages/NotaFiscal';
import CadastroObra from "./pages/CadastroObra";
import Error404 from "./pages/Error404";

// Import layout and auth components
import Menu from './components/Menu';
import Header from './components/Header';
import RequireAuth from "./services/PrivateRoutes";

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
          <Route path="/obras" element={<CadastroObra />} />
          <Route path="/produto" element={<Product />} />
          <Route path="/select-action" element={<SelectAction />} />
          <Route path="/select-action/venda" element={<Sale />} />
          <Route path="/select-action/receber" element={<Receive />} />
          <Route path="/notaFiscal" element={<NotaFiscal />} />
          <Route path="/estoque" element={<Stock />} />

          {/* Catch-all route for pages not found within logged area */}
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;