@echo off
chcp 65001 >nul
setlocal

REM =============================================================================
REM  USO: Construir la solución para producción
REM  Para qué sirve: Genera los archivos estáticos optimizados en la carpeta "dist".
REM  Es el paso previo a desplegar el juego en un hosting o a abrirlo como archivo local
REM  según la configuración del proyecto (Vite build).
REM =============================================================================

cd /d "%~dp0.."
echo.
echo [Arkanoid lite] Construyendo para producción (salida: dist\)...
echo.

call npm run build

echo.
if errorlevel 1 (
  echo Build terminado con errores.
) else (
  echo Build completado. Revisa la carpeta dist\
)
pause
endlocal
