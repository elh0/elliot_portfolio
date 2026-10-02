/* Measures how heavy and how quick to start each project's video is, from
   a GitHub runner: file size, bitrate, time to first byte and time to the
   first 2 MB, plus the size of each hover thumbnail. Run by hand from
   Actions → Measure videos; results show as a notice on the run. */

const fs = require("fs");
const path = require("path");

const source = fs.readFileSync(path.join(__dirname, "..", "home.js"), "utf8");
const start = source.indexOf("var PROJECTS = [") + "var PROJECTS = ".length;
let depth = 0, end = start;
for (; end < source.length; end++) {
  if (source[end] === "[") depth++;
  if (source[end] === "]" && --depth === 0) break;
}
const PROJECTS = eval(source.slice(start, end + 1));

async function timeVideo(url) {
  const t0 = Date.now();
  const response = await fetch(url, { headers: { Range: "bytes=0-2097151" }, redirect: "follow" });
  const ttfb = Date.now() - t0;
  const range = response.headers.get("content-range") || "";
  const total = Number(range.split("/")[1]) || Number(response.headers.get("content-length")) || 0;
  const head = Buffer.from(await response.arrayBuffer()).toString("latin1");
  /* "moov" before "mdat" means the player can start before the whole file arrives */
  const moov = head.indexOf("moov"), mdat = head.indexOf("mdat");
  const faststart = moov >= 0 && (mdat < 0 || moov < mdat);
  return { ttfb, first2mb: Date.now() - t0, total, faststart, host: new URL(response.url).host };
}

async function imageSize(url) {
  const response = await fetch(url);
  return (await response.arrayBuffer()).byteLength;
}

(async () => {
  const lines = [];
  for (const [n, project] of PROJECTS.entries()) {
    for (const [k, video] of project.videos.entries()) {
      try {
        const r = await timeVideo(video.src);
        const mbps = video.duration ? (r.total * 8 / video.duration / 1e6).toFixed(1) : "?";
        let thumbs = "";
        if (video.poster) {
          const big = await imageSize(video.poster.replace(/-d_\d+/, "-d_2560").replace(/mw=\d+/, "mw=2560"));
          const mid = await imageSize(video.poster.replace(/-d_\d+/, "-d_1280").replace(/mw=\d+/, "mw=1280"));
          thumbs = " thumb2560=" + Math.round(big / 1024) + "KB thumb1280=" + Math.round(mid / 1024) + "KB";
        }
        lines.push(String(n + 1).padStart(2, "0") + (project.videos.length > 1 ? "." + (k + 1) : "") +
          " " + project.title + ": " + (r.total / 1e6).toFixed(0) + "MB " + mbps + "Mbit/s ttfb=" +
          r.ttfb + "ms first2MB=" + r.first2mb + "ms" + (r.faststart ? "" : " NOT-FASTSTART") + thumbs);
      } catch (error) {
        lines.push(String(n + 1).padStart(2, "0") + " " + project.title + ": ERROR " + error.message);
      }
    }
  }
  console.log(lines.join("\n"));
  console.log("::notice title=Video measurements::" + lines.join("%0A"));
})();
