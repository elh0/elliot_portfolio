// Local test harness: serves Cargo-like pages built from this repo's
// home.html / contact.html, and routes the Vimeo and GitHub Pages requests
// they make to local files (a short WebM clip stands in for every video,
// since Playwright's Chromium can't play H.264).
const http = require('http');
const fs = require('fs');
const path = require('path');
const REPO = path.join(__dirname, '..');
const T = __dirname;

function page(snippetFile, pageId, cls) {
  const snippet = fs.readFileSync(path.join(REPO, snippetFile), 'utf8');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;background:#fff;font-family:serif;font-size:18px}.page-layout{width:93%;padding:2rem;display:flex}.page-content{width:60%} a{border-bottom:1px solid #ccc}</style></head>
<body><div id="${pageId}" class="page ${cls||''}"><div class="page-layout"><div class="page-content"><bodycopy>${snippet}</bodycopy></div></div></div></body></html>`;
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/projects') { res.writeHead(200, {'content-type': 'text/html'}); return res.end(page('home.html', 'X1134136285')); }
  if (u.pathname === '/contact') { res.writeHead(200, {'content-type': 'text/html'}); return res.end(page('contact.html', 'X999')); }
  if (u.pathname === '/release') { res.writeHead(200, {'content-type': 'text/html'}); return res.end(page('release.html', 'X998')); }
  if (u.pathname === '/clip.mp4') {
    const file = path.join(T, 'clip.webm'); const size = fs.statSync(file).size;
    const range = req.headers.range;
    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range); const start = +m[1] || 0; const end = m[2] ? +m[2] : size - 1;
      res.writeHead(206, {'content-type': 'video/webm', 'accept-ranges': 'bytes', 'content-range': `bytes ${start}-${end}/${size}`, 'content-length': end - start + 1});
      return fs.createReadStream(file, {start, end}).pipe(res);
    }
    res.writeHead(200, {'content-type': 'video/webm', 'accept-ranges': 'bytes', 'content-length': size});
    return fs.createReadStream(file).pipe(res);
  }
  if (u.pathname === '/poster.jpg') { res.writeHead(200, {'content-type': 'image/jpeg'}); return fs.createReadStream(path.join(REPO, 'previews', '486365701.jpg')).pipe(res); }
  if (u.pathname.startsWith('/gh/')) {
    const f = path.join(REPO, u.pathname.slice(4));
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    const type = f.endsWith('.css') ? 'text/css' : f.endsWith('.js') ? 'application/javascript' : f.endsWith('.json') ? 'application/json' : 'image/jpeg';
    res.writeHead(200, {'content-type': type}); return fs.createReadStream(f).pipe(res);
  }
  res.writeHead(404); res.end();
});

async function routes(context, base, log) {
  await context.route(/elh0\.github\.io\/elliot_portfolio\//, async (route) => {
    const u = new URL(route.request().url());
    const r = await route.fetch({url: base + '/gh/' + u.pathname.replace('/elliot_portfolio/', '')});
    await route.fulfill({response: r});
  });
  await context.route(/player\.vimeo\.com/, async (route) => {
    const r = await route.fetch({url: base + '/clip.mp4', headers: route.request().headers()});
    await route.fulfill({response: r});
  });
  await context.route(/i\.vimeocdn\.com/, async (route) => {
    if (log) log.push(route.request().url());
    const r = await route.fetch({url: base + '/poster.jpg'});
    await route.fulfill({response: r});
  });
  await context.route(/vimeo\.com\/api\/oembed/, (route) => route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({thumbnail_url: 'https://i.vimeocdn.com/video/1-abc-d_1280?region=us'})}));
  await context.route(/(fonts|vod-progressive)/, (route) => route.abort());
}

module.exports = { server, routes };
