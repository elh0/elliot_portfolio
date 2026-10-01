/* Makes the scrub-preview thumbnails: for each project video in home.js,
   one JPEG grid of small frames (previews/<vimeo id>.jpg) plus an entry in
   previews/previews.json saying how to read it. Only videos without a
   preview yet are processed. Run by .github/workflows/make-previews.yml,
   or locally: node scripts/make-previews.js (needs ffmpeg). */

const fs = require("fs");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const HOME_JS = process.env.HOME_JS || path.join(ROOT, "home.js");
const OUT = process.env.PREVIEWS_DIR || path.join(ROOT, "previews");
const FFMPEG = process.env.FFMPEG || "ffmpeg";
const MANIFEST = path.join(OUT, "previews.json");

const MAX_FRAMES = 100; /* at most one frame a second, 100 per video */
const COLUMNS = 10;
const FRAME_WIDTH = 240;

function projectVideos() {
  const text = fs.readFileSync(HOME_JS, "utf8");
  const videos = new Map();
  const pattern = /src:\s*"([^"]+\/playback\/(\d+)\/[^"]+)"/g;
  let match;
  while ((match = pattern.exec(text))) {
    if (!videos.has(match[2])) videos.set(match[2], match[1]);
  }
  return videos;
}

/* ffmpeg prints "Duration: 00:01:23.45" and "1920x1080" for its input. */
function probe(input) {
  const result = spawnSync(FFMPEG, ["-hide_banner", "-i", input], {
    encoding: "utf8",
  });
  const text = result.stderr || "";
  const duration = text.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  const size = text.match(/Video:.*?\s(\d{2,5})x(\d{2,5})[\s,]/);
  return {
    duration: duration
      ? Number(duration[1]) * 3600 + Number(duration[2]) * 60 + Number(duration[3])
      : 0,
    width: size ? Number(size[1]) : 0,
    height: size ? Number(size[2]) : 0,
  };
}

function makePreview(id, url) {
  const { duration } = probe(url);
  if (!duration) throw new Error("couldn't read the video's length");

  const count = Math.max(1, Math.min(MAX_FRAMES, Math.ceil(duration)));
  const interval = duration / count;
  const rows = Math.ceil(count / COLUMNS);
  const file = path.join(OUT, id + ".jpg");

  /* Keyframes only, so it doesn't decode every frame of the film. */
  execFileSync(FFMPEG, [
    "-v", "error", "-y",
    "-skip_frame", "nokey",
    "-i", url,
    "-vf",
    "fps=1/" + interval.toFixed(4) +
      ",scale=" + FRAME_WIDTH + ":-2,tile=" + COLUMNS + "x" + rows,
    "-frames:v", "1",
    "-q:v", "5",
    file,
  ], { stdio: ["ignore", "inherit", "inherit"] });

  const sheet = probe(file);
  if (!sheet.width) throw new Error("no preview image was made");

  return {
    count,
    interval: Number(interval.toFixed(4)),
    columns: COLUMNS,
    width: FRAME_WIDTH,
    height: Math.round(sheet.height / rows),
    version: Date.now().toString(36),
  };
}

const videos = projectVideos();
const manifest = fs.existsSync(MANIFEST)
  ? JSON.parse(fs.readFileSync(MANIFEST, "utf8"))
  : {};
fs.mkdirSync(OUT, { recursive: true });

let made = 0;
let failed = 0;
for (const [id, url] of videos) {
  if (manifest[id] && fs.existsSync(path.join(OUT, id + ".jpg"))) continue;
  try {
    console.log("making preview for " + id + " …");
    manifest[id] = makePreview(id, url);
    made++;
  } catch (error) {
    console.log("FAILED " + id + ": " + error.message);
    failed++;
  }
}

/* Drop previews for videos no longer on the site. */
for (const id of Object.keys(manifest)) {
  if (videos.has(id)) continue;
  delete manifest[id];
  fs.rmSync(path.join(OUT, id + ".jpg"), { force: true });
}

const sorted = {};
for (const id of Object.keys(manifest).sort()) sorted[id] = manifest[id];
fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, 1) + "\n");

console.log(made + " made, " + failed + " failed, " +
  Object.keys(sorted).length + "/" + videos.size + " videos have previews");
if (failed) process.exitCode = 1;
