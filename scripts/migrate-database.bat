@echo off
echo 🚀 Migração do Banco de Dados para Railway
echo.

echo 📋 Passo 1: Exportando banco local...
pg_dump -h localhost -U postgres -d sysobras -f backup.sql
if %errorlevel% neq 0 (
    echo ❌ Erro ao exportar banco local
    pause
    exit /b 1
)
echo ✅ Backup criado: backup.sql

echo.
echo 📋 Passo 2: Importando para Railway...
echo ⚠️  Configure as credenciais do Railway antes de continuar
echo.
set /p RAILWAY_HOST="Host do Railway: "
set /p RAILWAY_DB="Database name: "
set /p RAILWAY_USER="Username: "
set /p RAILWAY_PASS="Password: "

echo.
echo 🔄 Importando dados...
psql -h %RAILWAY_HOST% -U %RAILWAY_USER% -d %RAILWAY_DB% -f backup.sql
if %errorlevel% neq 0 (
    echo ❌ Erro ao importar para Railway
    pause
    exit /b 1
)

echo.
echo 🎉 Migração concluída com sucesso!
echo ✅ Banco migrado para Railway
echo.
echo 🗑️ Removendo arquivo de backup...
del backup.sql

pause
