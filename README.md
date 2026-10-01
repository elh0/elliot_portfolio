# elliot.onl

Code for Elliot Holbrow's portfolio at [www.elliot.onl](https://www.elliot.onl), hosted on Cargo.

Cargo holds only a few lines of HTML per page. The styling, the video player and the project list live in this repo and are served from GitHub Pages at `https://elh0.github.io/elliot_portfolio/`. Pushing to `main` updates the live site within about 10 minutes, with nothing to paste into Cargo.

## Pages

| Cargo page | Address | Paste into its HTML tab | Loads from GitHub |
| --- | --- | --- | --- |
| Landing (homepage) | `/` | `landing.html` | `landing.js` (styles are inside it) |
| Projects | `/projects` | `home.html` | `home.css`, `home.js` |
| Contact | `/contact` | `contact.html` | `contact.css`, `contact.js` |

`landing.css` is an empty placeholder kept so the existing `<link>` in Cargo doesn't 404.

## Common changes

**Add, remove or reorder a project:** edit the `PROJECTS` list near the top of `home.js`. Each project has a title, category, director, format and one or more videos. Each video needs its Vimeo file link (`src`), thumbnail (`poster`), aspect ratio, and running time. Numbering, the Previous/Next chevrons and the hover previews update automatically.

**Swap the landing / intro reel:** change `video` (desktop, 1080p) at the top of `landing.js` and `BACKGROUND_VIDEO` in `home.js`. The `<source>` in `landing.html` also holds the 1080p link, so that one line needs re-pasting into Cargo.

**Change where "Index" links go:** `indexUrl` in `landing.js` and `INDEX_URL` in `contact.js`.

**Contact details:** these live in `contact.html`, so edit it and re-paste it into Cargo.

## How it behaves

- **Landing (desktop):** full-screen muted reel, name top-left, "Index →" bottom-left; clicking anywhere goes to `/projects`. Phones skip it and go straight to `/projects`.
- **Projects:** on desktop, the reel plays once per visit behind the list until the first hover or opened project. Project videos load only when their project is opened, and the first one starts playing straight away (with sound).
- **Player:** tap/click plays and pauses; double-tap/double-click the left or right side skips 5s; F is fullscreen. A video plays round twice the first time, then shows its thumbnail and Replay. Hovering or dragging the timeline shows a preview frame.
- **Moving between projects:** on desktop, the chevrons either side of the screen or the ← → keys; on phones, swipe sideways on the video (in multi-video projects, swipes go through its videos first).
- **Contact:** dotted-leader rows lined up with the project list, "← Index" back to `/projects`.

## Project links

Each project has its own link, which opens it and starts it playing: `elliot.onl/projects#` plus the project's name in lower case with dashes, e.g. `elliot.onl/projects#bladee-blondie`. The address bar shows it whenever a project is open, so the easiest way to get a link is to open the project and copy the address. Renaming a project changes its link; to keep an old link working, give the project a `slug` in `PROJECTS`.

## Automatic jobs (GitHub Actions)

- **Check video links** runs every Monday and whenever the site's code changes. If a Vimeo link stops working it opens a GitHub issue, which emails you.
- **Make scrub previews** runs when `home.js` changes. It makes the small thumbnails shown above the timeline while scrubbing (`previews/`) for any new video. Without them the player still works and shows just the time.

Both can be run by hand from the repo's Actions tab.

## Things that must stay true

- **The repo must stay public, and GitHub Pages must serve `main`.** If either changes, the site loses its styling, video player and project list.
- **Vimeo:** videos use Vimeo direct file links (`player.vimeo.com/progressive_redirect/...`), which only work while the Vimeo plan includes them.
- **Cargo's editor:** it doesn't always run these scripts, so check changes on the live site, ideally in a private window.
