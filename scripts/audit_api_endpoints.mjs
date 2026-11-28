import fs from 'fs';

const content = fs.readFileSync('server/server.mjs', 'utf8');
const lines = content.split('\n');

const endpoints = [];
lines.forEach((line, index) => {
  if (line.includes("path === '/api/") || line.includes("path.startsWith('/api/")) {
    endpoints.push({ line: index + 1, code: line.trim() });
  }
});

console.log('Total API route branches found:', endpoints.length);
endpoints.forEach(e => console.log(`${e.line}: ${e.code}`));
