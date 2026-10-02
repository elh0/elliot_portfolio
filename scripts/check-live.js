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
              " accordion=" + !!e.querySelector(".project-accordion") + " html=" + e.innerHTML.replace(/\s+/g, " ").slice(0, 700);
          }),
          homeScripts: [].map.call(document.querySelectorAll("script[src*=home]"), function (e) { return e.src; }),
          text: document.body.innerText.slice(0, 300).replace(/\s+/g, " ")
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
