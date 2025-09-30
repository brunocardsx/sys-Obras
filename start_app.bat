@echo off
echo Iniciando Sistema de Gestao...
echo.

echo Iniciando Backend...
start "Backend" cmd /k "cd backend && npm run dev"

echo Aguardando 3 segundos...
timeout /t 3 /nobreak > nul

echo Iniciando Frontend...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo Aplicacao iniciada!
echo Backend: http://localhost:8081
echo Frontend: http://localhost:3000
echo.
pause