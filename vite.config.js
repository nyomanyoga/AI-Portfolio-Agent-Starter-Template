import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const hasChatConfig = Boolean(env.API_UPSTREAM_URL && env.CHAT_RUN_ID && env.CHAT_API_KEY);

  return {
    plugins: [react()],
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
      __APP_UPDATE_TIME__: JSON.stringify(new Date().toISOString()),
    },
    server: {
      host: '0.0.0.0',
      port: 5174,
      watch: {
        usePolling: true
      },
      hmr: {
        clientPort: 3000,
      },
      proxy: hasChatConfig
        ? {
            '/api/chat/output-stream': {
              target: env.API_UPSTREAM_URL,
              changeOrigin: true,
              proxyTimeout: 300000,
              timeout: 300000,
              headers: {
                Authorization: `Bearer ${env.CHAT_API_KEY}`
              },
              rewrite: () => `/api/v1/run/${env.CHAT_RUN_ID}/output-stream`,
            }
          }
        : undefined
    }
  }
})
