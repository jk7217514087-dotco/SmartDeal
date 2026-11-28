import https from 'https';

https.get('https://smart-deal-m4ca.vercel.app/', (res) => {
  let body = '';
  res.on('data', (c) => body += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const m = body.match(/\/assets\/index-[a-zA-Z0-9_\-]+\.js/g);
    console.log('Script matches:', m);
    if (m && m[0]) {
      https.get('https://smart-deal-m4ca.vercel.app' + m[0], (res2) => {
        let js = '';
        res2.on('data', (c) => js += c);
        res2.on('end', () => {
          console.log('JS Bundle length:', js.length);
          console.log('Includes text-[14vw]:', js.includes('text-[14vw]'));
          console.log('Includes Top Laptops:', js.includes('Top Laptops'));
          console.log('Includes fixed header spacer:', js.includes('Fixed Header Height Spacer') || js.includes('h-[112px]'));
          console.log('Includes AuthModal:', js.includes('AuthModal') || js.includes('Create Account'));
        });
      });
    }
  });
}).on('error', (e) => console.error(e));
