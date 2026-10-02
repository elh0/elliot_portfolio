/* Loads the live site on desktop and an iPhone and reports what a visitor
   gets: final URL, script errors, whether the project rows are there and
   clickable. Screenshots go to live-check/. Run by Actions → Check live site. */
var playwright = require("playwright");
var fs = require("fs");

var PAGES = ["https://elliot.onl/", "https://elliot.onl/projects", "https://elliot.onl/contact"];

(async function () {
  fs.mkdirSync("live-check", { recursive: true });
  var browser = await playwright.chromium.launch();
  var devices = [
    ["desktop", { viewport: { width: 1440, height: 900 } }],
    ["iphone", playwright.devices["iPhone 13"]]
  ];
  for (var d = 0; d < devices.length; d++) {
    for (var i = 0; i < PAGES.length; i++) {
      var context = await browser.newContext(devices[d][1]);
      var page = await context.newPage();
      await page.addInitScript(function () {
        window._liveLog = [];
        var t0 = Date.now();
        function log(m) { window._liveLog.push((Date.now() - t0) + "ms " + m); }
        document.addEventListener("DOMContentLoaded", function () {
          log("DOMContentLoaded layout=" + !!document.querySelector('[id="X1134136285"] .page-layout'));
          new MutationObserver(function (ms) {
            ms.forEach(function (m) {
              [].forEach.call(m.removedNodes, function (n) {
                if (n.nodeType === 1 && (n.matches(".page-layout, .page-content, bodycopy, .project-accordion, .page") || n.querySelector && n.querySelector(".project-accordion, .page-layout")))
                  log("removed " + n.tagName + "." + n.className + " from " + m.target.tagName + "." + String(m.target.className).slice(0, 40));
              });
              [].forEach.call(m.addedNodes, function (n) {
                if (n.nodeType === 1 && (n.matches(".page-layout, .page, .project-accordion") || n.querySelector && n.querySelector(".project-accordion")))
                  log("added " + n.tagName + "." + n.className + " to " + m.target.tagName + "." + String(m.target.className).slice(0, 40));
              });
            });
          }).observe(document.documentElement, { childList: true, subtree: true });
        });
        var ival = setInterval(function () {
          var s = document.querySelector('script[src*="home.js"]');
          if (s && !s._seen) { s._seen = 1; log("home.js tag present, layout=" + !!document.querySelector('[id="X1134136285"] .page-layout')); }
        }, 20);
        setTimeout(function () { clearInterval(ival); }, 8000);
      });
      var errors = [];
      var scripts = [];
      page.on("pageerror", function (e) { errors.push("pageerror: " + e.message); });
      page.on("console", function (m) { if (m.type() === "error") errors.push("console: " + m.text()); });
      page.on("response", function (r) { if (/github\.io/.test(r.url())) scripts.push(r.status() + " " + r.url()); });
      try {
        await page.goto(PAGES[i], { waitUntil: "load", timeout: 45000 });
      } catch (e) { errors.push("goto: " + e.message); }
      await page.waitForTimeout(6000);
      var info = await page.evaluate(function () {
        var row = document.querySelector("details.project-item summary");
        var hit = null;
        if (row) {
          var r = row.getBoundingClientRect();
          var el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          hit = el ? el.tagName + "." + String(el.className).slice(0, 60) : null;
        }
        return {
          url: location.href,
          rows: document.querySelectorAll("details.project-item").length,
          landing: !!document.querySelector(".landing, .landing-root"),
          rowHit: hit,
          bodyClasses: document.body.className.slice(0, 120),
          pageIds: [].map.call(document.querySelectorAll("[id^=X]"), function (e) { return e.id; }).slice(0, 6),
          pages: [].map.call(document.querySelectorAll('[id="X1134136285"]'), function (e) {
            return e.tagName + "." + String(e.className).slice(0, 80) + " children=" + e.children.length +
              " accordion=" + !!e.querySelector(".project-accordion") + " reel=" + !!e.querySelector(".page-background video") +
              (e.querySelector(".project-accordion") ? "" : " html=" + e.innerHTML.replace(/<style[^>]*>[\s\S]*?<\/style>/g, function (m) { return "<style " + m.length + " chars: " + m.slice(7, 120) + ">"; }).replace(/<video[\s\S]*?<\/video>/g, "<video/>").replace(/\s+/g, " ").slice(0, 2500));
          }),
          homeScripts: [].map.call(document.querySelectorAll("script[src*=home]"), function (e) { return e.src; }),
          log: window._liveLog,
          text: document.body.innerText.slice(0, 160).replace(/\s+/g, " ")
        };
      });
      if (info.rows) {
        try {
          await page.click("details.project-item summary", { timeout: 5000 });
          await page.waitForTimeout(1500);
          info.openedAfterClick = await page.evaluate(function () { return !!document.querySelector("details.project-item[open]"); });
        } catch (e) { info.openedAfterClick = "click failed: " + e.message.split("\n")[0]; }
      }
      var name = devices[d][0] + "-" + (PAGES[i].split("/")[3] || "home");
      await page.screenshot({ path: "live-check/" + name + ".png" });
      console.log("::notice title=" + name + "::" + JSON.stringify(info) + " | errors: " + JSON.stringify(errors) + " | scripts: " + JSON.stringify(scripts));
      await context.close();
    }
  }
  await browser.close();
})();
