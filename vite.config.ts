import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Load CSS without blocking first paint (PageSpeed render-blocking audit). */
function asyncCss(): Plugin {
  return {
    name: 'async-css',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html.replace(
          /<link\s+rel="stylesheet"(\s+crossorigin)?\s+href="([^"]+\.css)"(\s+crossorigin)?>/g,
          (_match, _c1, href, _c2) => {
            const cross = ' crossorigin'
            return [
              `<link rel="stylesheet" href="${href}" media="print" onload="this.media='all'"${cross}>`,
              `<noscript><link rel="stylesheet" href="${href}"${cross}></noscript>`,
            ].join('\n    ')
          },
        )
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), asyncCss()],
  // Keep public/ for dev; do not copy multi-MB assets into dist/ on build.
  // Production Express serves public/ then slim dist/.
  build: {
    copyPublicDir: false,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
