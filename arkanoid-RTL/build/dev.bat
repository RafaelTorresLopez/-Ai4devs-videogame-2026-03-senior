@echo off
chcp 65001 >nul
setlocal

REM =============================================================================
REM  USO: Modo desarrollo (Vite dev server)
REM  Para qué sirve: Arranca el servidor de desarrollo con recarga en caliente (HMR).
REM  Abre la URL que muestra Vite (normalmente http://localhost:5173) en el navegador.
REM  Detén el servidor con Ctrl+C en esta ventana.
REM =============================================================================

cd /d "%~dp0.."
echo.
echo [Arkanoid lite] Iniciando modo desarrollo...
echo.

call npm run dev

endlocal
