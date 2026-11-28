import { spawn } from 'child_process';
import http from 'http';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetUrl = 'https://smart-deal-m4ca.vercel.app/deals';

async function run() {
  console.log('--- Launching Chrome with remote debugging ---');
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    targetUrl
  ]);

  // Wait 4 seconds for Chrome to start
  await new Promise(r => setTimeout(r, 4000));

  try {
    const listRes = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9222/json/list', res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });

    const pageTarget = listRes.find(t => t.type === 'page');

    if (pageTarget && pageTarget.webSocketDebuggerUrl) {
      const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

      await new Promise((resolve, reject) => {
        ws.onopen = resolve;
        ws.onerror = reject;
      });

      let reqId = 1;
      function send(method, params = {}) {
        return new Promise(resolve => {
          const id = reqId++;
          const handler = (event) => {
            const data = JSON.parse(event.data);
            if (data.id === id) {
              ws.removeEventListener('message', handler);
              resolve(data.result);
            }
          };
          ws.addEventListener('message', handler);
          ws.send(JSON.stringify({ id, method, params }));
        });
      }

      // Wait until React mounts header (up to 8 seconds)
      console.log('Waiting for React header to mount...');
      for (let i = 0; i < 16; i++) {
        const check = await send('Runtime.evaluate', {
          expression: `!!document.querySelector('header')`,
          returnByValue: true
        });
        if (check.result.value) {
          console.log(`React header mounted after ~${(i + 1) * 500}ms!`);
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }

      // 1. Check Header styling & bounding box
      const headerEval = await send('Runtime.evaluate', {
        expression: `(() => {
          const header = document.querySelector('header');
          const spacer = document.querySelector('header + div');
          const style = header ? window.getComputedStyle(header) : null;
          const rect = header ? header.getBoundingClientRect() : null;
          const spacerRect = spacer ? spacer.getBoundingClientRect() : null;
          return {
            headerFound: !!header,
            position: style ? style.position : null,
            top: style ? style.top : null,
            left: style ? style.left : null,
            right: style ? style.right : null,
            zIndex: style ? style.zIndex : null,
            headerHeight: rect ? Math.round(rect.height) : null,
            spacerHeight: spacerRect ? Math.round(spacerRect.height) : null,
            rowCount: header ? header.children.length : 0
          };
        })()`,
        returnByValue: true
      });
      console.log('1. Header CSS & Spacer Check:', JSON.stringify(headerEval.result.value, null, 2));

      // 2. Check Scroll behavior (scroll 600px down)
      const scrollEval = await send('Runtime.evaluate', {
        expression: `(() => {
          window.scrollTo(0, 600);
          const header = document.querySelector('header');
          const rect = header ? header.getBoundingClientRect() : null;
          return {
            scrollY: window.scrollY,
            headerTopAfterScroll: rect ? rect.top : null,
            isStillFixedAtZero: rect ? rect.top === 0 : false
          };
        })()`,
        returnByValue: true
      });
      console.log('2. Header Scroll Stability Check:', JSON.stringify(scrollEval.result.value, null, 2));

      // 3. Watermark check (Old 'b' removed? Diagonal SmartDeal present?)
      const watermarkEval = await send('Runtime.evaluate', {
        expression: `(() => {
          const cards = document.querySelectorAll('.rounded-3xl');
          let hasOldCardWatermark = false;
          cards.forEach(c => {
            if (c.innerHTML.includes('text-4xl sm:text-6xl') || c.innerHTML.includes('SmartDeal') && c.innerHTML.includes('-right-3')) {
              hasOldCardWatermark = true;
            }
          });

          const watermarks = Array.from(document.querySelectorAll('div')).filter(d => 
            d.className && d.className.includes('fixed inset-0 pointer-events-none')
          );
          const watermarkText = watermarks.map(w => w.textContent.trim()).join(' ');

          return {
            hasOldCardWatermark,
            pageWatermarkFound: watermarks.length > 0,
            watermarkTextSample: watermarkText.slice(0, 50),
            pointerEventsNone: watermarks.every(w => window.getComputedStyle(w).pointerEvents === 'none')
          };
        })()`,
        returnByValue: true
      });
      console.log('3. Watermark Verification:', JSON.stringify(watermarkEval.result.value, null, 2));

      ws.close();
    }
  } catch (err) {
    console.error('CDP Verification Error:', err);
  } finally {
    chrome.kill();
    console.log('--- Chrome Terminated ---');
  }
}

run();
