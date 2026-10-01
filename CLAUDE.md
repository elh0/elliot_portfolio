# Working on elliot.onl

Elliot Holbrow's cinematography portfolio. Read README.md first for how the site is put together; this file is the extra context for making changes.

## Shipping

- Push to `main`. GitHub Pages serves this repo and the live site picks changes up in about 10 minutes. There is no build step.
- Cargo holds only the small HTML snippets (`home.html`, `contact.html`, `landing.html`). If one of those changes, Elliot has to re-paste it into Cargo, so avoid HTML changes where JS/CSS can do the job, and say so clearly when he must re-paste.
- Two Actions workflows push to `main` on their own (`Update scrub previews` commits), so pull before pushing.

## Code conventions

- Plain ES5-style JS (`var`, `function`), one IIFE per file, no dependencies, no build.
- All project-page styles are scoped under `[id="X1134136285"]` (the Cargo Projects page ID).
- GitHub Pages caching can serve a new `home.js` with an old `home.css` for a while. Anything a new feature relies on visually (player chrome, preview, chevrons, playbar layout) gets its essential styles inline from JS.
- Cargo: its own arrow-key page navigation is blocked by `window._elliotArrowKeys` (window, capture phase). Cargo's default `.page-layout` padding and link borders need `!important` overrides.
- Phones are matched by `PHONE_QUERY` in `home.js` (narrow screens or short touch screens, so a phone held sideways is still a phone). The same query is used in `landing.js`, `home.css` and `contact.css`; keep them in sync.
- iOS WebKit (every iPhone browser) limits simultaneous video decoders (closed projects are unloaded with `releaseVideo`), merges quick double-taps (raw touch events are used), only plays with sound after a tap (videos are unlocked on taps; muted fallback otherwise), and does native fullscreen only on the video element.

## Decisions Elliot has made (don't undo without asking)

- Type: 11px monospace everywhere, white on black (light mode via the theme toggle). Minimal: no borders, no rounded corners.
- Player: click/tap plays and pauses; double-click/double-tap left or right skips 5s; ← → change project (desktop); F is fullscreen. A video plays round twice the first time, then shows its thumbnail and Replay.
- Opening a project autoplays its first video. Closing a project unloads its video, so it restarts next time.
- Desktop: thin tall chevrons, fixed in the side margins at mid-screen, change project. Phones: no chevrons; swipe on the video instead. Multi-video projects (Playing House) swipe through their videos like a slideshow first.
- Scrub preview: like YouTube, but with square corners and no border, time in white below.
- Landing reel is desktop only; phones go straight to `/projects`.

## Testing

There is no test suite in the repo yet. Changes have been checked with Playwright (Chromium at `/opt/pw-browsers`, or the globally installed `playwright`) against a local page built from `home.html` + `home.css` + `home.js`, with Vimeo requests routed to a local test clip (Range responses needed for seeking). Cover desktop, an iPhone profile, and an iPhone held sideways. Real-iPhone behaviour (autoplay with sound, gestures) can't be fully reproduced in Chromium, so tell Elliot what to check on his phone.
