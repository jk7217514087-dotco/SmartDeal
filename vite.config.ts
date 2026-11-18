import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { spawn, type ChildProcess } from 'node:child_process'
import http from 'node:http'

function smartdealBackendPlugin(): Plugin {
  let backendProc: ChildProcess | null = null;

  const ensureBackendRunning = () => {
    const req = http.get('http://localhost:3001/api/health', (res) => {
      // Backend is already up and running on port 3001
      res.resume();
    });

    req.on('error', () => {
      // Port 3001 is not running, spawn backend server
      console.log('\n🚀 [SmartDeal] Starting backend API server on port 3001...');
      backendProc = spawn('node', ['server/server.mjs'], {
        stdio: 'inherit',
        shell: true
      });
    });
  };

  return {
    name: 'smartdeal-backend-starter',
    configureServer(server) {
      ensureBackendRunning();
      server.httpServer?.on('close', () => {
        if (backendProc) {
          console.log('\n🛑 [SmartDeal] Stopping backend server...');
          backendProc.kill();
        }
      });
    },
    configurePreviewServer(server) {
      ensureBackendRunning();
      server.httpServer?.on('close', () => {
        if (backendProc) {
          backendProc.kill();
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), smartdealBackendPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            if ('writeHead' in res && !res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(
                JSON.stringify({
                  success: false,
                  error:
                    'Backend API server is not running on port 3001 (Bad Gateway HTTP 502). Please start the backend server with "npm run server" or "npm run dev:all".',
                  code: 'BACKEND_OFFLINE',
                  status: 502
                })
              );
            }
          });
        }
      }
    }
  }
})
