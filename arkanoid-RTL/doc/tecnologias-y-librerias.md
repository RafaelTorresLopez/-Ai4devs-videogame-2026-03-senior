# Tecnologías y librerías — Arkanoid ligero

Documento técnico que resume el *stack* utilizado en el desarrollo del videojuego **Arkanoid ligero** (`arkanoid-lite`).

## Resumen ejecutivo

El juego es una aplicación web **sin motor de juegos de terceros**: la lógica y el dibujado están implementados en **JavaScript** sobre APIs nativas del navegador (**Canvas 2D** y **Web Audio**). El empaquetado y el entorno de desarrollo se apoyan en **Vite**.

## Plataforma y estándares web

| Área | Tecnología | Uso en el proyecto |
|------|------------|-------------------|
| Marcado | **HTML5** | Punto de entrada (`index.html`), lienzo `<canvas>` 640×480, estructura accesible (`aria-label`). |
| Estilos | **CSS3** | Presentación de la interfaz (`src/style.css`). |
| Lenguaje | **JavaScript (ES modules)** | Código modular (`import`/`export`) en `src/`. |
| Gráficos | **Canvas API** (`CanvasRenderingContext2D`) | Dibujo de pala, pelota, ladrillos, texto de estado y fondo. |
| Sonido | **Web Audio API** (`AudioContext`, osciladores, ganancia) | Efectos sintéticos sin archivos de audio externos (`src/game/sfx.js`). |
| Entrada | **DOM / eventos** | Teclado (`keydown`/`keyup`), ratón sobre el lienzo (`mousemove`, `click`). |
| Animación | **`requestAnimationFrame`** | Bucle principal del juego con control de delta time. |

No se utilizan frameworks de interfaz (React, Vue, etc.) ni librerías de física o colisiones externas.

## Dependencias npm declaradas

En `package.json` la única dependencia directa es de desarrollo:

| Paquete | Versión aproximada | Rol |
|---------|-------------------|-----|
| **vite** | ^6.0.0 | Servidor de desarrollo, bundling y optimización de build. |

El proyecto usa `"type": "module"` para módulos ES nativos en Node durante el build.

## Cadena de herramientas indirecta (Vite)

Vite integra y arrastra, entre otras, herramientas usadas en el proceso de construcción (no importadas desde el código del juego):

- **Rollup**: empaquetado del código para producción.
- **esbuild**: transformación y minificación rápida en el flujo de Vite.
- **PostCSS**: canal de procesamiento de CSS en el build (p. ej. cuando Vite procesa hojas de estilo).

Estas piezas forman parte del ecosistema de Vite y no requieren configuración explícita en este repositorio más allá de `vite.config.js`.

## Configuración de build relevante

- **Salida**: directorio `dist`, `base: "./"` para rutas relativas.
- **Formato del bundle**: **IIFE** (`rollupOptions.output.format: "iife"`) con nombre global `ArkanoidLite`, adecuado para despliegues simples.
- **Plugin personalizado** (`fileUrlFriendlyHtml`): ajusta el HTML generado para que abrir el juego como `file://` sea viable (sin `type="module"` ni `crossorigin` en enlaces problemáticos bajo origen nulo).

## Entorno de ejecución

- **Navegador moderno** con soporte para Canvas 2D, ES modules (en desarrollo con Vite), Web Audio y `requestAnimationFrame`.
- **Node.js** (versión compatible con Vite 6) para ejecutar `npm run dev`, `npm run build` y `npm run preview`.

## Scripts npm

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `vite` | Servidor de desarrollo con HMR. |
| `build` | `vite build` | Genera la versión estática en `dist/`. |
| `preview` | `vite preview` | Sirve la carpeta `dist` para pruebas locales post-build. |

---

*Documento generado a partir del estado del repositorio `arkanoid-lite`. Para versiones exactas de dependencias transitivas, consultar `package-lock.json`.*
