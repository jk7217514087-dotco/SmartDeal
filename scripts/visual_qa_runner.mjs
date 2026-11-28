import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Dell\\.gemini\\antigravity\\brain\\7726bfe5-9efb-48e0-a038-60fff39f93b2';
const baseUrl = 'https://smart-deal-m4ca.vercel.app';

const testCases = [
  { name: 'desktop_1440_home', url: `${baseUrl}/`, width: 1440, height: 900 },
  { name: 'desktop_1440_deals', url: `${baseUrl}/deals`, width: 1440, height: 900 },
  { name: 'desktop_1440_product', url: `${baseUrl}/product/prod-apple-iphone15`, width: 1440, height: 900 },
  { name: 'desktop_1440_compare', url: `${baseUrl}/compare`, width: 1440, height: 900 },
  { name: 'desktop_1440_admin', url: `${baseUrl}/admin/login`, width: 1440, height: 900 },
  { name: 'laptop_1024_deals', url: `${baseUrl}/deals`, width: 1024, height: 768 },
  { name: 'tablet_768_home', url: `${baseUrl}/`, width: 768, height: 1024 },
  { name: 'tablet_768_deals', url: `${baseUrl}/deals`, width: 768, height: 1024 },
  { name: 'mobile_390_deals', url: `${baseUrl}/deals`, width: 390, height: 844 },
  { name: 'mobile_360_home', url: `${baseUrl}/`, width: 360, height: 780 }
];

console.log('--- Starting Visual QA Screenshot Capture via spawnSync ---');

for (const tc of testCases) {
  const outputPath = path.join(artifactDir, `${tc.name}.png`);
  console.log(`Capturing: ${tc.name} (${tc.width}x${tc.height}) from ${tc.url}...`);
  try {
    const args = [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      `--window-size=${tc.width},${tc.height}`,
      `--screenshot=${outputPath}`,
      tc.url
    ];
    const res = spawnSync(chromePath, args, { timeout: 30000 });
    if (fs.existsSync(outputPath)) {
      const sz = fs.statSync(outputPath).size;
      console.log(`✓ Saved ${tc.name}.png (${sz} bytes)`);
    } else {
      console.error(`✗ Failed to create ${tc.name}.png, status: ${res.status}, stderr: ${res.stderr?.toString()}`);
    }
  } catch (err) {
    console.error(`Error capturing ${tc.name}:`, err.message);
  }
}

console.log('--- Visual QA Screenshot Capture Completed ---');
