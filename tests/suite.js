/* Checks the projects, contact and release pages in Chromium on desktop, an iPhone,
   and iPhones held sideways. Run: node tests/suite.js (needs Playwright).
   Real-iPhone behaviour (sound, gestures) still needs a check on a phone. */
const { chromium, devices } = require('playwright');
const os = require('os');
const path = require('path');
const shot = (name) => path.join(os.tmpdir(), 'elliot-' + name + '.png');
const { server, routes } = require('./harness');
const base = 'http://127.0.0.1:8123';
let pass = 0, fail = 0;
function check(name, ok, info) {
  if (ok) { pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (info !== undefined ? '  ' + JSON.stringify(info) : '')); }
}
const wait = (p, ms) => p.waitForTimeout(ms);
const state = (p) => p.evaluate(() => {
  const items = [...document.querySelectorAll('details.project-item')];
  const open = items.findIndex(d => d.open);
  const v = open >= 0 ? items[open].querySelector('video.project-video') : null;
  return {
    open, hash: location.hash,
    playing: v ? !v.paused : false, t: v ? v.currentTime : 0, muted: v ? v.muted : null,
    loaded: [...document.querySelectorAll('video.project-video')].filter(x => x.getAttribute('src')).length,
    overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
  };
});

async function desktop(b) {
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const posters = []; await routes(c, base, posters);
  const p = await c.newPage(); const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.goto(base + '/projects'); await wait(p, 800);

  const head = await p.evaluate(() => {
    const h = document.querySelector('.index-heading');
    return { built: h.classList.contains('is-built'), text: h.innerText.replace(/\s+/g, ' '), contact: h.querySelector('.site-nav a:last-child').getAttribute('href'), vis: getComputedStyle(h).visibility };
  });
  check('desktop: name bar built', head.built && head.vis === 'visible' && /Elliot Holbrow Cinematographer, London Work Contact/.test(head.text), head);
  check('desktop: Contact link keeps Cargo href', head.contact === '/contact', head.contact);

  const rows = await p.evaluate(() => [...document.querySelectorAll('summary')].map(s => [...s.children].map(c => getComputedStyle(c).display !== 'none' ? c.textContent : null)));
  check('desktop: 19 rows', rows.length === 19, rows.length);
  check('desktop: rows show 6 columns', rows.every(r => r.length === 6 && r.every(x => x !== null && x !== '')), rows.filter(r => r.some(x => !x)));
  check('desktop: row 1 reads right', rows[0].join('|') === '01|Polène SS24|Guillaume Lebel|Digital, LF, 35mm Print|Fashion|0:58', rows[0].join('|'));
  check('desktop: Playing House shows total time', rows[6][5] === '0:44', rows[6]);
  check('desktop: no dotted leaders', await p.evaluate(() => !document.querySelector('.project-leader') && [...document.querySelectorAll('summary')].every(s => getComputedStyle(s, '::after').borderBottomStyle !== 'dotted' && getComputedStyle(s, '::before').content === 'none' || getComputedStyle(s, '::before').content === 'normal')));
  check('desktop: columns aligned with headings', await p.evaluate(() => {
    const h = [...document.querySelector('.project-columns').children].map(e => Math.round(e.getBoundingClientRect().left));
    const r = [...document.querySelector('summary').children].map(e => Math.round(e.getBoundingClientRect().left));
    return h.every((x, i) => Math.abs(x - r[i]) <= 1);
  }));
  const intro = await p.evaluate(() => !!document.querySelector('.page-background video'));
  check('desktop: intro reel plays behind list on first visit', intro);
  check('desktop: intro reel added after Cargo\'s own markup (Cargo re-renders by position)', await p.evaluate(() => { const b = document.querySelector('.page-background'); return !!b && b.parentNode.firstElementChild !== b && !!document.querySelector('.page-layout') && b.compareDocumentPosition(document.querySelector('.page-layout')) === Node.DOCUMENT_POSITION_PRECEDING; }));

  // hover full-screen preview
  await p.locator('summary').nth(4).hover(); await wait(p, 500);
  const hov = await p.evaluate(() => {
    const hp = document.querySelector('.project-hover-preview'); const r = hp.getBoundingClientRect();
    const rows = [...document.querySelectorAll('summary')];
    return { vis: hp.classList.contains('is-visible'), src: hp.querySelector('img').src, full: r.width === innerWidth && r.height === innerHeight,
      hovered: getComputedStyle(rows[4].children[1]).color, other: getComputedStyle(rows[2].children[1]).color };
  });
  check('desktop: hover shows full-screen thumbnail', hov.vis && hov.full, hov);
  check('desktop: hover thumbnail is 2560px', /-d_2560/.test(hov.src) && /mw=2560/.test(hov.src), hov.src);
  check('desktop: other rows fade on hover', hov.hovered === 'rgb(255, 255, 255)' && hov.other !== hov.hovered, hov);
  const leaders = await p.evaluate(() => { const s = document.querySelector('summary'); return ['.project-title-text', '.project-director', '.project-format', '.project-category', '.project-time'].map(k => { const a = getComputedStyle(s.querySelector(k), '::after'); return a.borderBottomStyle === 'dotted' && parseFloat(a.width) > 5; }); });
  check('desktop: dotted leaders after title, director, format and type', leaders.join() === 'true,true,true,true,false', leaders);
  await wait(p, 1000);
  check('desktop: intro reel keeps playing under the hover thumbnail', await p.evaluate(() => { const v = document.querySelector('.page-background video'); return !!v && !v.paused; }));
  await p.mouse.move(5, 5); await wait(p, 500);
  check('desktop: leaving the list hides the thumbnail, reel still there', await p.evaluate(() => !document.querySelector('.project-hover-preview').classList.contains('is-visible') && !!document.querySelector('.page-background')));

  // open by click: autoplay with sound
  await p.locator('summary').nth(1).click(); await wait(p, 1500);
  let s = await state(p);
  check('desktop: click opens project', s.open === 1, s);
  check('desktop: opened project autoplays with sound', s.playing && s.muted === false, s);
  check('desktop: hash follows open project', s.hash === '#adidas-return-of-the-15', s.hash);
  await wait(p, 600);
  check('desktop: opening a project ends the intro reel', await p.evaluate(() => !document.querySelector('.page-background')));
  const fit = await p.evaluate(() => { const w = document.querySelector('details[open] .video-wrap').getBoundingClientRect(); const c = document.querySelector('details[open] .video-controls').getBoundingClientRect(); return { h: w.height, ctl: c.bottom - w.top, vh: innerHeight }; });
  check('desktop: video and playbar fit the screen height', fit.ctl <= fit.vh, fit);
  const centre = await p.evaluate(() => { const r = document.querySelector('details[open] .project-carousel').getBoundingClientRect(); const a = document.querySelector('.project-accordion').getBoundingClientRect(); return { video: Math.round(r.left + r.width / 2), list: Math.round(a.left + a.width / 2), w: Math.round(r.width) }; });
  await p.locator('summary').nth(5).hover(); await wait(p, 400);
  check('desktop: no hover thumbnail while a project is open', await p.evaluate(() => !document.querySelector('.project-hover-preview').classList.contains('is-visible')));
  check('desktop: open video is centred', Math.abs(centre.video - centre.list) <= 2, centre);

  // chevrons
  const chev = await p.evaluate(() => [...document.querySelectorAll('.project-navigation-link')].map(b => ({ op: b.style.opacity, x: Math.round(b.getBoundingClientRect().left), w: Math.round(b.getBoundingClientRect().width) })));
  const content = await p.evaluate(() => { const r = document.querySelector('.project-accordion').getBoundingClientRect(); return [r.left, r.right]; });
  const vid = await p.evaluate(() => { const r = document.querySelector('details[open] .project-carousel').getBoundingClientRect(); return [r.left, r.right]; });
  check('desktop: chevrons sit just outside the video', chev.length === 2 && chev.every(c => c.op === '1') && chev[0].x + chev[0].w <= vid[0] + 2 && vid[0] - (chev[0].x + chev[0].w) <= 60 && chev[1].x >= vid[1] - 2 && chev[1].x - vid[1] <= 60, { chev, vid });
  const sizes = await p.evaluate(() => [...new Set([...document.querySelectorAll('.page-content *')].filter(e => e.offsetParent && e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && e.tagName !== 'SUP').map(e => getComputedStyle(e).fontSize))]);
  check('desktop: all text is 11px', sizes.length === 1 && sizes[0] === '11px', sizes);
  await p.locator('.project-navigation-next').click(); await wait(p, 1500);
  s = await state(p);
  check('desktop: next chevron opens next project and plays', s.open === 2 && s.playing, s);
  check('desktop: previous project unloaded', s.loaded === 1, s);

  // keyboard
  await p.keyboard.press('ArrowRight'); await wait(p, 1200);
  s = await state(p);
  check('desktop: → changes project', s.open === 3 && s.playing, s);
  await p.keyboard.press('ArrowLeft'); await wait(p, 1200);
  s = await state(p);
  check('desktop: ← changes project back', s.open === 2 && s.playing, s);

  // double-click skip
  const before = (await state(p)).t;
  const box = await p.locator('details[open] .video-stage').first().boundingBox();
  await p.mouse.dblclick(box.x + box.width * 0.85, box.y + box.height / 2); await wait(p, 600);
  s = await state(p);
  check('desktop: double-click right skips forward ~5s', s.t - before >= 4 && s.playing, { before, after: s.t, playing: s.playing });

  // scrub preview element exists on hover of timeline
  const prog = await p.locator('details[open] .video-progress').boundingBox();
  await p.mouse.move(prog.x + prog.width * 0.5, prog.y + prog.height / 2); await wait(p, 600);
  check('desktop: scrub preview appears over timeline', await p.evaluate(() => [...document.querySelectorAll('details[open] [class*="scrub"], details[open] [class*="preview"]')].some(e => e.offsetParent && getComputedStyle(e).opacity !== '0')));

  // filter
  await p.locator('.project-filter[data-category="Music"]').click(); await wait(p, 600);
  const vis = await p.evaluate(() => [...document.querySelectorAll('details.project-item')].filter(d => d.offsetParent).map(d => d.querySelector('.project-number').textContent));
  check('desktop: Music filter shows 5 music projects, numbers kept', vis.join(',') === '03,08,12,17,18', vis);
  s = await state(p);
  check('desktop: open project stays open when it matches the filter', s.open === 2 && s.playing, s);
  await p.locator('summary').nth(7).click(); await wait(p, 1200);
  await p.locator('.project-navigation-next').click(); await wait(p, 1200);
  s = await state(p);
  check('desktop: chevrons move within the filter', s.open === 11 && s.playing, s);
  for (const _ of [1, 2, 3]) { await p.keyboard.press('ArrowLeft'); await wait(p, 700); }
  s = await state(p);
  check('desktop: arrows wrap within the filter', s.open === 17, s);
  await p.locator('.project-filter[data-category="Short"]').click(); await wait(p, 600);
  s = await state(p);
  check('desktop: filter closes and unloads a hidden open project', s.open === -1 && s.loaded === 0, s);
  await p.locator('.project-filter[data-category="All"]').click(); await wait(p, 400);
  check('desktop: All shows 19 again', await p.evaluate(() => [...document.querySelectorAll('details.project-item')].filter(d => d.offsetParent).length) === 19);

  // contact sheet
  await p.locator('.project-view[data-view="sheet"]').click(); await wait(p, 800);
  const sheet = await p.evaluate(() => ({ frames: [...document.querySelectorAll('.project-frame')].filter(f => f.offsetParent).length, imgs: [...document.querySelectorAll('.project-frame img')].map(i => i.getAttribute('src')), listHidden: !document.querySelector('.project-accordion').offsetParent, open: document.querySelectorAll('details[open]').length }));
  check('desktop: contact sheet shows 19 frames, list hidden', sheet.frames === 19 && sheet.listHidden, sheet);
  check('desktop: every frame has a 960px Vimeo thumbnail', sheet.imgs.length === 19 && sheet.imgs.every(u => /-d_960/.test(u)), sheet.imgs.filter(u => !/-d_960/.test(u)));
  check('desktop: switching to sheet closes the open project', sheet.open === 0);
  const chevHidden = await p.evaluate(() => [...document.querySelectorAll('.project-navigation-link')].every(b => b.style.opacity === '0'));
  check('desktop: chevrons hidden in contact sheet', chevHidden);
  const grid = await p.evaluate(() => { const t = document.querySelector('.project-frame-title'); const e = document.querySelector('.project-frame-edge'); return { label: document.querySelector('.project-view[data-view="sheet"]').textContent, color: getComputedStyle(t).color, hidden: getComputedStyle(e).opacity }; });
  check('desktop: grid view is called Grid, titles grey and tucked away', grid.label === 'Grid' && grid.color === 'rgb(143, 143, 143)' && grid.hidden === '0', grid);
  await p.locator('.project-frame').nth(2).hover(); await wait(p, 600);
  check('desktop: hovering a frame slides its title out', await p.evaluate(() => getComputedStyle(document.querySelectorAll('.project-frame-edge')[2]).opacity === '1' && getComputedStyle(document.querySelectorAll('.project-frame-edge')[0]).opacity === '0'));
  await p.screenshot({ path: shot('sheet') });
  await p.locator('.project-frame').nth(7).click(); await wait(p, 1500);
  s = await state(p);
  check('desktop: clicking a frame opens it in the list and plays', s.open === 7 && s.playing && s.hash === '#bladee-blondie', s);

  // light theme
  await p.locator('details[open] .video-theme-toggle').click(); await wait(p, 400);
  const light = await p.evaluate(() => ({ bg: getComputedStyle(document.body).backgroundColor, row: getComputedStyle(document.querySelector('details[open] summary .project-title-text')).color, dim: getComputedStyle(document.querySelector('.project-columns span')).color, name: getComputedStyle(document.querySelector('.site-name')).color }));
  check('desktop: light theme flips table colours', light.bg === 'rgb(248, 248, 248)' && light.row === 'rgb(0, 0, 0)' && light.name === 'rgb(0, 0, 0)' && light.dim === 'rgba(0, 0, 0, 0.35)', light);
  await p.screenshot({ path: shot('light') });
  check('desktop: no Dir / Type switch, director column stays', await p.evaluate(() => getComputedStyle(document.querySelector('.project-detail-switch')).display === 'none' && getComputedStyle(document.querySelector('summary .project-director')).opacity === '1'));
  check('desktop: no horizontal scroll', !(await state(p)).overflow);
  check('desktop: no script errors', errors.length === 0, errors);
  await c.close();

  // direct link + filter reset
  const c2 = await b.newContext({ viewport: { width: 1440, height: 900 } }); await routes(c2, base);
  const p2 = await c2.newPage();
  await p2.goto(base + '/projects#raf-simons'); await wait(p2, 1800);
  s = await state(p2);
  check('desktop: #raf-simons link opens and plays it', s.open === 15 && s.playing, s);
  await c2.close();

  // short laptop window
  const c3 = await b.newContext({ viewport: { width: 1280, height: 680 } }); await routes(c3, base);
  const p3 = await c3.newPage();
  await p3.goto(base + '/projects#t-magazine'); await wait(p3, 1800);
  const f3 = await p3.evaluate(() => { const w = document.querySelector('details[open] .video-wrap').getBoundingClientRect(); const ctl = document.querySelector('details[open] .video-controls').getBoundingClientRect(); return { top: w.top, bottom: ctl.bottom, vh: innerHeight, phoneRows: getComputedStyle(document.querySelector('.project-director')).display }; });
  check('laptop 1280x680: video+playbar fit, desktop layout', f3.bottom - f3.top <= f3.vh && f3.phoneRows !== 'none', f3);
  const span = await p3.evaluate(() => { const r = document.querySelector('details[open] summary').getBoundingClientRect(); const ctl = document.querySelector('details[open] .video-controls').getBoundingClientRect(); const meta = document.querySelector('details[open] .project-meta').getBoundingClientRect(); return { row: [r.left, r.right], ctl: [ctl.left, ctl.right], meta: [meta.left, meta.right] }; });
  check('laptop 1280x680: playbar and credits span the full row width', ['ctl', 'meta'].every(k => Math.abs(span[k][0] - span.row[0]) < 1 && Math.abs(span[k][1] - span.row[1]) < 1), span);
  await c3.close();
}

async function phone(b, name, opts, sideways) {
  const c = await b.newContext(opts); await routes(c, base);
  const p = await c.newPage(); const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.goto(base + '/projects'); await wait(p, 800);
  const look = await p.evaluate(() => {
    const s = document.querySelector('summary');
    return { shown: [...s.children].filter(c => getComputedStyle(c).display !== 'none' && getComputedStyle(c).opacity !== '0').map(c => c.textContent), cols: getComputedStyle(document.querySelector('.project-columns')).display, intro: !!document.querySelector('.page-background') };
  });
  check(name + ': rows show number, title, director', look.shown.join('|') === '01|Polène SS24|Guillaume Lebel' && look.cols === 'none', look);
  check(name + ': no intro reel', !look.intro);
  check(name + ': no horizontal scroll', !(await state(p)).overflow);
  const bar = await p.evaluate(() => {
    const links = [...document.querySelectorAll('.site-nav a')].filter(a => getComputedStyle(a).display !== 'none');
    const filters = [...document.querySelectorAll('.project-filter')].map(f => Math.round(f.getBoundingClientRect().top));
    const nameBox = document.querySelector('.site-name').getBoundingClientRect();
    return { links: links.map(a => a.textContent), underline: links.map(a => getComputedStyle(a).borderBottomColor), sameLine: links.length && Math.abs(links[0].getBoundingClientRect().top - nameBox.top) < 2, filterRows: new Set(filters).size, left: Math.round(nameBox.left) };
  });
  check(name + ': name bar shows only Contact, on the name line, no underline', bar.links.join() === 'Contact' && bar.sameLine && bar.underline.every(c => c === 'rgba(0, 0, 0, 0)'), bar);
  check(name + ': filters on one line', bar.filterRows === 1, bar);
  const pl = await p.evaluate(() => { const s = document.querySelector('summary'); const a = (k) => getComputedStyle(s.querySelector(k), '::after'); return { title: a('.project-title-text').borderBottomStyle === 'dotted' && parseFloat(a('.project-title-text').width) > 5, director: a('.project-director').display }; });
  check(name + ': dotted leader from title to director', pl.title && pl.director === 'none', pl);
  if (!sideways) check(name + ': same 20px margin as the contact page', bar.left === 20, bar);
  const leaderGap = (k) => p.evaluate((k) => [...document.querySelectorAll('summary')].filter(s => s.offsetParent).slice(0, 8).map(s => { const t = s.querySelector('.project-title-text'); const cs = getComputedStyle(t, '::after'); const textEnd = s.getBoundingClientRect().right - parseFloat(cs.marginRight); const shown = s.querySelector(k).querySelector('.cell-text').getBoundingClientRect(); return Math.round(shown.left - textEnd); }), k);
  const gDir = await leaderGap('.project-director');
  check(name + ': leader stops just short of the director', gDir.every(g => g >= 3 && g <= 12), gDir);
  // Dir / Type switch scrambles the right-hand column between director and type
  await p.locator('.project-detail[data-detail="type"]').tap(); await wait(p, 300);
  const mid = await p.evaluate(() => document.querySelector('summary .project-category .cell-text').textContent);
  check(name + ': Type switch scrambles the text on the way', mid !== 'Fashion', mid);
  await wait(p, 1300);
  const shown = await p.evaluate(() => { const s = document.querySelectorAll('summary')[2]; return { dir: getComputedStyle(s.querySelector('.project-director')).opacity, type: getComputedStyle(s.querySelector('.project-category')).opacity, text: s.querySelector('.project-category').textContent }; });
  check(name + ': Type switch settles on the type', shown.dir === '0' && shown.type === '1' && shown.text === 'Music', shown);
  const gType = await leaderGap('.project-category');
  check(name + ': leader stops just short of the type, no sliding', gType.every(g => g >= 3 && g <= 12) && await p.evaluate(() => getComputedStyle(document.querySelector('summary .project-category')).transform === 'none'), gType);
  await p.reload(); await wait(p, 800);
  const kept = await p.evaluate(() => document.querySelector('[id="X1134136285"]').classList.contains('shows-type'));
  check(name + ': Dir / Type choice is remembered', kept);
  await p.locator('.project-detail[data-detail="director"]').tap(); await wait(p, 800);
  await p.screenshot({ path: shot(name.replace(/\W+/g, '-') + '-list') });

  await p.locator('summary').nth(0).tap(); await wait(p, 1500);
  let s = await state(p);
  check(name + ': tap opens and autoplays', s.open === 0 && s.playing, s);
  check(name + ': no chevrons', await p.evaluate(() => [...document.querySelectorAll('.project-navigation-link')].every(b => b.style.opacity === '0')));
  const fit = await p.evaluate(() => { const w = document.querySelector('details[open] .video-wrap').getBoundingClientRect(); const c = document.querySelector('details[open] .video-controls').getBoundingClientRect(); return { w: w.width, h: c.bottom - w.top, vw: innerWidth, vh: innerHeight }; });
  if (sideways) check(name + ': video and playbar fit the screen height', fit.h <= fit.vh, fit);
  else check(name + ': video runs full width', fit.w >= fit.vw - 2 * 21, fit);

  // drag along the timeline: the thumbnail preview follows the finger
  const cdpScrub = await c.newCDPSession(p);
  await p.evaluate(() => document.querySelector('details[open] .video-controls').scrollIntoView({ block: 'end' })); await wait(p, 300);
  const pbar = await p.locator('details[open] .video-progress').boundingBox();
  const py = pbar.y + pbar.height / 2;
  await cdpScrub.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: pbar.x + 10, y: py }] });
  for (let i = 1; i <= 6; i++) { await cdpScrub.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: pbar.x + 10 + i * pbar.width / 10, y: py }] }); await wait(p, 60); }
  const scrub = await p.evaluate(() => { const s = document.querySelector('details[open] .video-scrub-preview'); const f = s && s.firstChild; return { shown: !!s && s.style.opacity === '1', frame: !!f && f.style.display === 'block' && /previews\//.test(f.style.backgroundImage) }; });
  await cdpScrub.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await wait(p, 200);
  const scrubGone = await p.evaluate(() => document.querySelector('details[open] .video-scrub-preview').style.opacity === '0');
  check(name + ': dragging the timeline shows the thumbnail preview, gone on release', scrub.shown && scrub.frame && scrubGone, { scrub, scrubGone });
  await p.evaluate(() => { const v = document.querySelector('details[open] video'); v.currentTime = 0; if (v.paused) v.play(); });
  await p.evaluate(() => document.querySelector('details[open]').scrollIntoView({ block: 'start' })); await wait(p, 400);

  // double tap right half
  const box = await p.locator('details[open] .video-stage').first().boundingBox();
  const before = (await state(p)).t;
  const cdp = await c.newCDPSession(p);
  async function tapAt(x, y) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
  await tapAt(box.x + box.width * 0.85, box.y + box.height / 2); await wait(p, 80);
  await tapAt(box.x + box.width * 0.85, box.y + box.height / 2); await wait(p, 700);
  s = await state(p);
  check(name + ': double-tap right skips ~5s and keeps playing', s.t - before >= 4 && s.playing, { before, after: s.t, playing: s.playing });

  // swipe left on video → next project
  async function swipe(dx) {
    const b2 = await p.locator('details[open] .video-stage').first().boundingBox();
    const y = b2.y + b2.height / 2, x0 = b2.x + b2.width / 2;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y }] });
    for (let i = 1; i <= 6; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + dx * i / 6, y }] }); await wait(p, 16); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
  await swipe(-160); await wait(p, 1500);
  s = await state(p);
  check(name + ': swipe left goes to next project and plays', s.open === 1 && s.playing, s);
  await swipe(160); await wait(p, 1500);
  s = await state(p);
  check(name + ': swipe right goes back', s.open === 0 && s.playing, s);

  if (!sideways) {
    // multi-video slideshow: Playing House swipes through its videos first
    await p.locator('summary').nth(6).tap(); await wait(p, 1500);
    // CDP touches don't drive native scrolling, so scroll the carousel as a swipe would
    await p.evaluate(() => { const c = document.querySelector('details[open] .project-carousel'); c.scrollTo({ left: c.children[1].offsetLeft - c.children[0].offsetLeft, behavior: 'instant' }); });
    await wait(p, 1200);
    const slide = await p.evaluate(() => [...document.querySelectorAll('details[open] video')].findIndex(v => !v.paused));
    s = await state(p);
    check(name + ': Playing House slides to its second video and plays it', s.open === 6 && slide === 1, { s, slide });
    await p.screenshot({ path: shot(name.replace(/\W+/g, '-') + '-open') });
  }

  await p.evaluate(() => window.scrollTo(0, 0));
  await p.locator('.project-view[data-view="sheet"]').tap(); await wait(p, 800);
  const sheet = await p.evaluate(() => { const f = [...document.querySelectorAll('.project-frame')].filter(x => x.offsetParent); return { n: f.length, cols: new Set(f.slice(0, 4).map(x => Math.round(x.getBoundingClientRect().left))).size, overflow: document.documentElement.scrollWidth > innerWidth + 1 }; });
  check(name + ': contact sheet in two columns, no sideways scroll', sheet.n === 19 && sheet.cols === 2 && !sheet.overflow, sheet);
  await p.screenshot({ path: shot(name.replace(/\W+/g, '-') + '-sheet') });
  await p.locator('.project-frame').nth(4).tap(); await wait(p, 1500);
  s = await state(p);
  check(name + ': tapping a frame opens and plays it', s.open === 4 && s.playing, s);
  check(name + ': no script errors', errors.length === 0, errors);
  await c.close();
}

async function contact(b) {
  // the directors list in contact.js must match the projects in home.js
  const fs = require('fs');
  const homeSrc = fs.readFileSync(path.join(__dirname, '..', 'home.js'), 'utf8');
  const k = 'var PROJECTS = '; const s0 = homeSrc.indexOf(k + '[') + k.length; let d = 0, e = s0;
  for (; e < homeSrc.length; e++) { if (homeSrc[e] === '[') d++; if (homeSrc[e] === ']' && !--d) break; }
  const projects = eval(homeSrc.slice(s0, e + 1));
  const slug = t => String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const expected = {}; projects.forEach((pr, n) => { if (pr.director === 'Elliot Holbrow') return; (expected[pr.director] = expected[pr.director] || []).push([n + 1, pr.title, pr.slug || slug(pr.title)]); });
  const cSrc = fs.readFileSync(path.join(__dirname, '..', 'contact.js'), 'utf8');
  const c0 = cSrc.indexOf('var DIRECTORS = ') + 'var DIRECTORS = '.length; d = 0; e = c0;
  for (; e < cSrc.length; e++) { if (cSrc[e] === '[') d++; if (cSrc[e] === ']' && !--d) break; }
  const listed = eval(cSrc.slice(c0, e + 1));
  check('contact: directors list matches the projects', JSON.stringify(listed) === JSON.stringify(Object.keys(expected).sort().map(n => [n, expected[n]])));

  for (const [name, opts] of [['contact desktop', { viewport: { width: 1440, height: 900 } }], ['contact iPhone', devices['iPhone 13']]]) {
    const desktop = name.includes('desktop');
    const c = await b.newContext(opts); await routes(c, base);
    if (desktop) await c.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: base });
    const p = await c.newPage(); const errors = []; p.on('pageerror', e => errors.push(e.message));
    await p.goto(base + '/contact'); await wait(p, 800);
    const r = await p.evaluate(() => {
      const h = document.querySelector('.contact-page .index-heading');
      const after = el => getComputedStyle(el, '::after');
      const firstShown = row => [...row.querySelectorAll('.contact-label, .contact-value')].find(x => getComputedStyle(x).display !== 'none');
      return { built: h.classList.contains('is-built'), text: h.innerText.replace(/\s+/g, ' '),
        rows: document.querySelectorAll('.contact-list .contact-row').length, directors: document.querySelectorAll('.contact-director').length,
        dotted: [...document.querySelectorAll('.contact-row')].every(row => after(firstShown(row)).borderBottomStyle === 'dotted'),
        actions: [...document.querySelectorAll('.contact-list .contact-action')].map(a => a.textContent),
        clock: document.querySelector('.contact-clock').textContent,
        link: document.querySelector('.contact-project').getAttribute('href'),
        overflow: document.documentElement.scrollWidth > innerWidth + 1 };
    });
    check(name + ': same name bar as projects' + (desktop ? '' : ', Work link only'), r.built && (desktop ? /Elliot Holbrow Cinematographer, London Work Contact/ : /^Elliot Holbrow Work Cinematographer, London$|^Elliot Holbrow Cinematographer, London Work$/).test(r.text.trim()), r);
    check(name + ': 5 numbered contact rows and 12 directors, all with dotted leaders, no sideways scroll', r.rows === 5 && r.directors === 12 && r.dotted && !r.overflow, r);
    check(name + ': actions on the right', r.actions.join('|') === (desktop ? 'Copy|Copy|Email|Open \u2197|Open \u2197' : 'Email|Call|Email|Open \u2197|Open \u2197'), r.actions);
    check(name + ': London clock', /^London \d\d:\d\d (BST|GMT)$/.test(r.clock), r.clock);
    check(name + ': project numbers link to the project', r.link === '/projects#swank-mami-mc69', r.link);
    const lineup = await p.evaluate(() => ({ name: Math.round(document.querySelector('.site-name').getBoundingClientRect().left), number: Math.round(document.querySelector('.contact-number').getBoundingClientRect().left), title: Math.round(document.querySelector('.contact-tools').getBoundingClientRect().left), sizes: [...new Set([...document.querySelectorAll('.contact-page *')].filter(e => e.offsetParent).map(e => getComputedStyle(e).fontSize))] }));
    check(name + ': rows line up with the name', lineup.number === lineup.name && lineup.title === lineup.name, lineup);
    check(name + ': all text is 11px', lineup.sizes.length === 1 && lineup.sizes[0] === '11px', lineup.sizes);
    if (desktop) {
      await p.locator('.contact-list .contact-row').first().click(); await wait(p, 300);
      const copied = await p.evaluate(async () => ({ label: document.querySelector('.contact-action').textContent, clip: await navigator.clipboard.readText(), url: location.pathname }));
      check(name + ': clicking the email copies it', copied.label === 'Copied' && copied.clip === 'elliotholbrow@gmail.com' && copied.url === '/contact', copied);
    }
    await p.screenshot({ path: shot(name.replace(/\W+/g, '-') + ''), fullPage: true });
    check(name + ': no script errors', errors.length === 0, errors);
    await c.close();
  }
}

async function release(b) {
  const q = '/release?type=person&date=10 Oct 2026&place=Brecon Beacons&what=Walking a ridge at dawn';
  for (const [name, opts] of [['release desktop', { viewport: { width: 1440, height: 900 } }], ['release iPhone', devices['iPhone 13']], ['release iPhone sideways', devices['iPhone 13 landscape']]]) {
    const c = await b.newContext(opts); await routes(c, base);
    let posted = null;
    await c.route(/formsubmit\.co/, async (route) => { posted = { url: route.request().url(), body: route.request().postDataBuffer() }; await route.fulfill({ status: 302, headers: { location: base + '/release?signed=1' } }); });
    const p = await c.newPage(); const errors = []; p.on('pageerror', e => errors.push(e.message));
    await p.goto(base + q); await wait(p, 800);
    const r = await p.evaluate(() => ({
      phone: document.querySelector('.release-page').classList.contains('is-phone'),
      fields: document.querySelectorAll('.release-field .release-number').length, // 9 numbered (2 for under-18s only), agree, date
      prefilled: ['shoot_date', 'shoot_place', 'shoot_what'].map(n => document.querySelector('input[name="' + n + '"]').value),
      terms: document.querySelectorAll('.release-term-text').length, // in return, 10 terms, 8 explainer rows
      sizes: [...new Set([...document.querySelectorAll('.release-page *')].filter(e => e.offsetParent).map(e => getComputedStyle(e).fontSize))],
      dotted: getComputedStyle(document.querySelector('.release-label'), '::after').borderBottomStyle,
      overflow: document.documentElement.scrollWidth > innerWidth + 1 }));
    check(name + ': numbered fields, shoot details from the link, terms, dotted leaders', r.fields === 11 && r.prefilled.join('|') === '10 Oct 2026|Brecon Beacons|Walking a ridge at dawn' && r.terms === 19 && r.dotted === 'dotted', r);
    check(name + ': phone layout only on phones, no sideways scroll, all 11px', r.phone === !name.includes('desktop') && !r.overflow && r.sizes.join() === '11px', r);
    await p.locator('.release-send').click(); await wait(p, 200);
    const e1 = await p.textContent('.release-error');
    await p.fill('input[name=name]', 'Test Person'); await p.fill('input[name=address]', '1 Street'); await p.fill('input[name=email]', 'test@example.com');
    await p.locator('.release-choice', { hasText: 'Under 18' }).click();
    const guardian = await p.locator('input[name=guardian_name]').isVisible();
    await p.locator('.release-choice', { hasText: '18 or over' }).click();
    await p.locator('.release-send').click(); await wait(p, 200);
    const e2 = await p.textContent('.release-error');
    await p.locator('.release-choice', { hasText: "I've read" }).click();
    await p.locator('.release-pad').scrollIntoViewIfNeeded();
    const box = await p.locator('.release-pad canvas').boundingBox();
    await p.mouse.move(box.x + 20, box.y + box.height * 0.6); await p.mouse.down();
    await p.mouse.move(box.x + 120, box.y + box.height * 0.3, { steps: 10 }); await p.mouse.up();
    await p.locator('.release-send').click(); await wait(p, 1500);
    check(name + ': asks for missing details, agreement and shows the guardian rows for under-18s', e1 === 'Please fill in full name.' && e2 === 'Please tap to agree.' && guardian, { e1, e2, guardian });
    const body = posted ? posted.body.toString('latin1') : '';
    check(name + ': sends to FormSubmit with the signature attached, then says thanks', !!posted && posted.url === 'https://formsubmit.co/elliotholbrow@gmail.com' && body.includes('Test Person') && body.includes('filename="signature.png"') && body.includes('person-release v1.1') && /\/release\?signed=1$/.test(p.url()) && (await p.textContent('.release-form')).startsWith('Signed'), posted && posted.url);
    check(name + ': no script errors', errors.length === 0, errors);
    await c.close();
  }
}

server.listen(8123, async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    await desktop(b);
    await phone(b, 'iPhone 13', devices['iPhone 13']);
    await phone(b, 'iPhone 13 sideways', devices['iPhone 13 landscape'], true);
    await phone(b, 'iPhone Pro Max sideways', devices['iPhone 14 Pro Max landscape'], true);
    await contact(b);
    await release(b);
  } catch (e) { fail++; console.log('FAIL crashed: ' + e.stack); }
  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close(); server.close();
  if (fail) process.exitCode = 1;
});
