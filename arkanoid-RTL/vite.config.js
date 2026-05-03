import { defineConfig } from "vite";

/**
 * HTML servido como file:// no puede cargar <script type="module"> ni
 * <link crossorigin> por política CORS (origen null). Este plugin deja
 * script clásico + hoja sin crossorigin; el bundle va en formato IIFE.
 */
function fileUrlFriendlyHtml() {
  return {
    name: "file-url-friendly-html",
    enforce: "post",
    /** @param {string} html */
    transformIndexHtml(html) {
      return html
        .replace(
          /<script type="module" crossorigin src="([^"]+)"><\/script>/g,
          '<script defer src="$1"></script>',
        )
        .replace(
          /<link rel="stylesheet" crossorigin href="([^"]+)"([^>]*)>/g,
          '<link rel="stylesheet" href="$1"$2>',
        );
    },
  };
}

export default defineConfig({
  root: ".",
  base: "./",
  publicDir: "public",
  plugins: [fileUrlFriendlyHtml()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        format: "iife",
        name: "ArkanoidLite",
        inlineDynamicImports: true,
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
