/* Checks that every Vimeo video link on the site still plays.
   Run by .github/workflows/check-videos.yml (weekly, and whenever the
   site's code changes). Locally: node scripts/check-videos.js */

const fs = require("fs");
const path = require("path");

const FILES = ["home.js", "landing.js", "landing.html"];
const PATTERN = new RegExp(
  process.env.VIDEO_URL_PATTERN ||
    "https://player\\.vimeo\\.com/progressive_redirect/[^\"'\\s<>)]+",
  "g"
);

function findLinks() {
  const links = new Map();
  for (const file of FILES) {
    const text = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
    for (const url of text.match(PATTERN) || []) {
      const clean = url.replace(/&amp;/g, "&");
      if (!links.has(clean)) links.set(clean, file);
    }
  }
  return links;
}

/* Ask for the first two bytes only, so no video is downloaded. */
async function check(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { Range: "bytes=0-1" },
        redirect: "follow",
        signal: AbortSignal.timeout(30000),
      });
      const type = response.headers.get("content-type") || "";
      await response.body?.cancel();
      if ((response.status === 200 || response.status === 206) &&
          type.startsWith("video/")) {
        return null;
      }
      if (response.status < 500) {
        return "HTTP " + response.status + (type ? " (" + type + ")" : "");
      }
    } catch (error) {
      if (attempt === 3) return error.message;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
  }
  return "server error after 3 tries";
}

(async () => {
  const links = findLinks();
  const broken = [];

  for (const [url, file] of links) {
    const problem = await check(url);
    const id = (url.match(/playback\/(\d+)/) || [, url])[1];
    console.log((problem ? "BROKEN " : "ok     ") + id + "  " + file +
      (problem ? "  " + problem : ""));
    if (problem) broken.push({ url, file, problem });
  }

  console.log("\n" + (links.size - broken.length) + "/" + links.size +
    " video links working");

  if (process.env.GITHUB_STEP_SUMMARY && broken.length) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      "## Broken video links\n\n" +
      broken.map((b) => "- `" + b.file + "`: " + b.problem + "  \n  " + b.url)
        .join("\n") + "\n");
  }

  if (broken.length) process.exit(1);
})();
