# Working on elliot.onl

Elliot Holbrow's cinematography portfolio. Read README.md first for how the site is put together; this file is the extra context for making changes.

## Shipping

- Push to `main`. GitHub Pages serves this repo and the live site picks changes up in about 10 minutes. There is no build step.
- Cargo holds only the small HTML snippets (`home.html`, `contact.html`, `landing.html`). If one of those changes, Elliot has to re-paste it into Cargo, so avoid HTML changes where JS/CSS can do the job, and say so clearly when he must re-paste.
- Two Actions workflows push to `main` on their own (`Update scrub previews` commits), so pull before pushing.

## Code conventions

- Plain ES5-style JS (`var`, `function`), one IIFE per file, no dependencies, no build.
- All project-page styles are scoped under `[id="X1134136285"]` (the Cargo Projects page ID).
- GitHub Pages caching can serve a new `home.js` with an old `home.css` for a while. `home.js` and `contact.js` load their stylesheet as `?v=STYLE_VERSION`, so bump `STYLE_VERSION` in the script whenever a CSS change and a JS change depend on each other. Chevrons and the playbar layout also keep their essential styles inline from JS.
- Cargo: its own arrow-key page navigation is blocked by `window._elliotArrowKeys` (window, capture phase). Cargo's default `.page-layout` padding and link borders need `!important` overrides.
- Phones are matched by `PHONE_QUERY` in `home.js` (narrow screens or short touch screens, so a phone held sideways is still a phone). The same query is used in `landing.js`, `home.css` and `contact.css`; keep them in sync.
- iOS WebKit (every iPhone browser) limits simultaneous video decoders (closed projects are unloaded with `releaseVideo`), merges quick double-taps (raw touch events are used), only plays with sound after a tap (videos are unlocked on taps; muted fallback otherwise), and does native fullscreen only on the video element.

## Decisions Elliot has made (don't undo without asking)

- Type: 11px monospace everywhere, white on black (light mode via the theme toggle). Minimal: no borders, no rounded corners.
- Layout (Oct 2026 redesign, to move away from George Powers' site): name bar across the top (name, "Cinematographer, London", Work / Contact), built by JS from Cargo's heading; full-width table rows (No., Title, Director, Format, Type, Time) with dotted leaders running from each column to the next (Oct 2 2026, Elliot asked for them back); type filters and a Grid view (renamed from Contact sheet) whose grey titles slide out from behind the thumbnail on desktop hover. Hover fills the screen with the project's Vimeo thumbnail at 2560px. Keep all the player and navigation behaviour below when restyling.
- Player: click/tap plays and pauses; double-click/double-tap left or right skips 5s; ← → change project (desktop); F is fullscreen. A video plays round twice the first time, then shows its thumbnail and Replay.
- Opening a project autoplays its first video. Closing a project unloads its video, so it restarts next time.
- Desktop side margins (Oct 8 2026, option A, like georgedommpower.com): about a sixth of the screen black on each side (`--page-gutter` in home.css, same value in contact.css). Phones keep their narrow margins.
- Open project on desktop (Oct 8 2026): playbar and credits span the full row width, and every film fills that width at its own shape, with no black bars either side (even 4:3).
- Desktop: thin tall chevrons, fixed in the side margins at mid-screen, change project. Phones: no chevrons; swipe on the video instead. Multi-video projects (Playing House) swipe through their videos like a slideshow first.
- Scrub preview: like YouTube, but with square corners and no border, time in white below.
- Phone rows: number, title and director. A Dir / Type switch above the list scrambles the right-hand column into the type and back like a departures board, row by row, with the dotted leader following the length (Oct 2 2026: Elliot picked scramble over fade, slide and typewriter); the choice is remembered on the device.
- Phones: the name bar shows only the link to the other page (Contact on the projects page, Work on the contact page), with no underline; filters stay on one line.
- Contact page (Oct 2 2026, option A of two mockups): laid out like the project list. "Contact" with a live London clock, numbered rows with dotted leaders and an action (desktop: Copy for email and phone; phones: Email / Call; Open for links), then the directors list with project numbers that open the project, and the same footer. Oct 8 2026: each project title in the directors list is its own link, and a list too long for its row moves to a line underneath and wraps (scrolling sideways felt buggy). Pointing at a title greys the row's other titles. On phones the titles always sit on a line under the director's name. All built by contact.js; its DIRECTORS list must match PROJECTS in home.js (the suite checks).
- Landing reel is desktop only; phones go straight to `/projects`.

## Testing

Run `node tests/suite.js` before pushing (see README). It uses Playwright (Chromium at `/opt/pw-browsers`, or the globally installed `playwright`) against local pages built from `home.html` / `contact.html`, with Vimeo requests routed to `tests/clip.webm` (Range responses needed for seeking). It covers desktop, an iPhone, and iPhones held sideways; add checks for new behaviour. Real-iPhone behaviour (autoplay with sound, gestures) can't be fully reproduced in Chromium, so tell Elliot what to check on his phone.
