// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../login/login.css';
import { STORAGE_KEYS, ERROR_MESSAGES } from '../types/constants';


const Login: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiUrl = process.env['REACT_APP_API_URL'] || 'http://localhost:8081';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || ERROR_MESSAGES.NETWORK_ERROR);
      }

      if (!data.status || !data.data || !data.data.token) {
        throw new Error('Resposta inválida do servidor');
      }

      localStorage.setItem(STORAGE_KEYS.LOGIN_TOKEN, data.data.token);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-form-container">
          <div className="form-box">
            <div className="logo">
              <div className="logo-main">GN EMPREENDIMENTOS</div>
              <div className="logo-sub">IMÓVEIS</div>
            </div>
            <h2>Acesse o <strong>PORTAL DE GESTÃO</strong></h2>

            {error && <div className="login-error-message">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="user">USUÁRIO</label>
                <input
                  type="text"
                  id="user"
                  placeholder="Digite o seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">SENHA</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="form-options">
                <div className="keep-connected">
                  <input type="checkbox" id="keep-connected-checkbox" />
                  <label htmlFor="keep-connected-checkbox">Manter Conectado</label>
                </div>
              </div>
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'ENTRANDO...' : 'ENTRAR'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Login };