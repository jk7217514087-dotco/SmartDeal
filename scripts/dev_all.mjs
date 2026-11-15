// Script to launch both Vite frontend and Node.js REST API server concurrently
import { spawn } from 'node:child_process';
import path from 'node:path';

console.log('🚀 Starting SmartDeals Full-Stack Development Environment...\n');

// 1. Start Node.js API Server
const apiServer = spawn('node', ['server/server.mjs'], {
  stdio: 'inherit',
  shell: true
});

// 2. Start Vite Dev Server
const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

const viteServer = spawn(npxCmd, ['vite', '--host'], {
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\n🛑 Shutting down SmartDeals servers...');
  apiServer.kill();
  viteServer.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
