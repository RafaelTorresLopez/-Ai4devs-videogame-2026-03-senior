@echo off
chcp 65001 >nul
setlocal

REM =============================================================================
REM  USO: Vista previa del build de producción
REM  Para qué sirve: Sirve localmente el contenido ya generado en "dist" (como en producción).
REM  Ejecuta "build-produccion.bat" antes si aún no existe o está desactualizada la carpeta dist.
REM  Detén el servidor con Ctrl+C en esta ventana.
REM =============================================================================

cd /d "%~dp0.."
echo.
echo [Arkanoid lite] Preview del build (carpeta dist\)...
echo.

call npm run preview

endlocal
