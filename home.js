(function () {
 var page = document.querySelector('[id="X1134136285"]');

 /* GitHub Pages can serve this script fresh with an older cached home.css
    for a few minutes after a change. Load the stylesheet this script was
    written for, then drop the plain link. Bump with every home.css change
    the script relies on. */
 var STYLE_VERSION = "2026-10-01-table";
 (function loadMatchingStyles() {
   var script = document.currentScript;
   if (!script || !script.src) return;
   var href = script.src.replace(/[^\/]*$/, "") + "home.css?v=" + STYLE_VERSION;
   var links = Array.prototype.slice.call(
     document.querySelectorAll('link[rel="stylesheet"][href*="home.css"]')
   );
   if (links.some(function (link) { return link.href === href; })) return;
   var link = document.createElement("link");
   link.rel = "stylesheet";
   link.href = href;
   link.addEventListener("load", function () {
     links.forEach(function (old) { old.remove(); });
   });
   document.head.appendChild(link);
 })();
 var lastActiveVideo = null;

 /* Phones in either orientation: narrow screens, plus touch screens that
    are short (a phone held sideways is wider than many laptops' 768px
    breakpoint). Matches the phone @media rules in home.css. */
 var PHONE_QUERY =
   "(max-width: 767px), (hover: none) and (pointer: coarse) and (max-height: 500px)";

 /* Scrub previews (thumbnail strips made by scripts/make-previews.js) live
    next to this script on GitHub Pages. The list is fetched only the
    first time someone hovers or drags a timeline. */
 var PREVIEW_BASE = (function () {
   var script = document.currentScript;
   return script && script.src
     ? script.src.replace(/[^\/]*$/, "") + "previews/"
     : "https://elh0.github.io/elliot_portfolio/previews/";
 })();
 var previewManifest = null;

 /* iPhones only let a video play with sound if that video was started or
    loaded during a tap. A swipe doesn't count as a tap, so on each real
    tap, "unlock" every project video that isn't loaded yet by calling
    load() on it (harmless: it has no source until its project opens).
    Then swiping can start the next video with sound. */
 function unlockVideosForSound() {
   document.querySelectorAll('[id="X1134136285"] video.project-video')
     .forEach(function (video) {
       if (video._elliotUnlocked || video.getAttribute("src")) return;
       video._elliotUnlocked = true;
       video.load();
     });
 }
 /* iOS sends "click" only for taps, never after a scroll or swipe. */
 document.addEventListener("click", unlockVideosForSound, true);

 function loadPreviewManifest() {
   if (!previewManifest) {
     previewManifest = window.fetch(PREVIEW_BASE + "previews.json", { cache: "no-cache" })
       .then(function (response) { return response.ok ? response.json() : {}; })
       .catch(function () { return {}; });
   }
   return previewManifest;
 }

 /* Shown in place of the time once a video has finished. */
 var REPLAY_HTML =
   '<span class="video-replay"><svg viewBox="0 0 12 12" width="11" height="11" ' +
   'aria-hidden="true" focusable="false"><path d="M2.2 6a3.8 3.8 0 1 0 1.1-2.7"/>' +
   '<path d="M3.1 1.2v2.3h2.3"/></svg>Replay</span>';

 /* Speaker icons: with sound waves while playing sound, crossed when muted. */
 var SOUND_ON_ICON =
   '<svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true" focusable="false">' +
   '<path class="icon-fill" d="M1 4.25h2L6 1.75v8.5L3 7.75H1z"/>' +
   '<path d="M8 4.25a2.5 2.5 0 0 1 0 3.5M9.5 2.75a4.6 4.6 0 0 1 0 6.5"/></svg>';
 var SOUND_OFF_ICON =
   '<svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true" focusable="false">' +
   '<path class="icon-fill" d="M1 4.25h2L6 1.75v8.5L3 7.75H1z"/>' +
   '<path d="M8 4.5l3 3M11 4.5l-3 3"/></svg>';

 function setMuteIcon(button, muted) {
   var state = muted ? "off" : "on";
   if (button.getAttribute("data-sound") === state) return;
   button.setAttribute("data-sound", state);
   button.innerHTML = muted ? SOUND_OFF_ICON : SOUND_ON_ICON;
   button.setAttribute("aria-label", muted ? "Unmute" : "Mute");
 }


 /* The project list. Edit here to add, remove or reorder projects; the page
    markup is built from this, so nothing needs pasting into Cargo. */
 var PROJECTS = [
    {
      title: "Polène SS24",
      category: "Fashion",
      director: "Guillaume Lebel",
      format: "Digital, LF, 35mm Print",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/1040453005/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=d7bb8e0abc51de4abec416624d4363cbd1383cc82939a29cbba1f42927e5d7e6",
        poster: "https://i.vimeocdn.com/video/1963352200-b51179485e9c29a3f35948459b6d7d0589ed682ca53c598383f2cd018546414f-d_1280?region=us&mw=1920&q=90",
        ratio: "1440 / 1080", time: "0:58", duration: 58.58 }
      ]
    },
    {
      title: "Adidas ‘Return of the 15’",
      category: "Commercial",
      director: "Hannan Hussain",
      format: "S35, Digital",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/1227015224/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=4a6ce9d029807f6f15b3f12ec99c2714483f99121606b2722de4b12d908812e1",
        poster: "https://i.vimeocdn.com/video/2201141803-8e1793107c9d95a9ed69fe5e9fd4a005b6a5b1eebd37986610f51696b1a570a3-d_1280?region=us&mw=1920&q=90",
        ratio: "1440 / 1080", time: "0:55", duration: 55.743333 }
      ]
    },
    {
      title: "Joe James - Papercuts",
      category: "Music",
      director: "Uncanny",
      format: "S35, Digital",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/1231798890/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=c617a62fc6f2ab5a215be8a055a2ebd0437f25e361183ad1d8eb425047de42ac",
        poster: "https://i.vimeocdn.com/video/2207048883-a2602d1d5d84f0ea6ef7913a029e02ef6b0fac76463b33c47ef696ef02c4e184-d_1280?region=us&mw=1920&q=90",
        ratio: "1620 / 1080", time: "3:12", duration: 192.04 }
      ]
    },
    {
      title: "T Magazine",
      category: "Fashion",
      director: "Jess Madavo",
      format: "Standard 16",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/1072485630/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=3d6f0558a02ab26a2d519977c1b10534bb5674d5fe3aa03c702a0a02c3071862",
        poster: "https://i.vimeocdn.com/video/2001413250-9cc6946f4c4bb871925c710dd5dfdbdefc3d410e04ae130a6ac21c0c5baae0f8-d_1280?region=us&mw=1920&q=90",
        ratio: "1620 / 1080", time: "0:43", duration: 43.711667 }
      ]
    },
    {
      title: "Pléi",
      category: "Fashion",
      director: "Guillaume Lebel",
      format: "LF, Digital, 35mm Print",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/948314452/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=3826045616c5697e66ff31a37f3c0125aa7efe3fee1f400713b97e2e911169c0",
        poster: "https://i.vimeocdn.com/video/1855463606-98fab6c5cbc0fd9d58918481eccb24f53f7113ea27e3caf0a3e798eaa5fe092f-d_1280?region=us&mw=1920&q=90",
        ratio: "1920 / 1080", time: "0:54", duration: 54.57 }
      ]
    },
    {
      title: "Helinox ‘Zero’ S/S26",
      category: "Fashion",
      director: "Tom Silvester",
      format: "S35, Digital",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/1231792538/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=f124268d3884f75c86dfb18bdedcf41661dd78dea1b5bdae7c04890dd2f6252d",
        poster: "https://i.vimeocdn.com/video/2207037900-5a31ea12d2693ffd169e6d2d3b93b67419ade5ab16e8c1d97a5c5ac0a404da94-d_1280?region=us&mw=1920&q=90",
        ratio: "1920 / 1080", time: "0:39", duration: 39.492 }
      ]
    },
    {
      title: "Playing House",
      category: "Fashion",
      director: "Lydia Garnett",
      format: "Standard 16 to 16:9",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/1229248245/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=ed86d3e4fff4e6a7a0ffc719b293e43be38f553a65b8d953eb6e5a4010ca0edd",
        poster: "https://i.vimeocdn.com/video/2203862107-cedc1cf330e12155e0ab81cbd9d052412d652eb1da77cd0ca7954be225e375a7-d_1280?region=us&mw=1920&q=90",
        ratio: "1920 / 1080", time: "0:09", duration: 9.876667 },
      { src: "https://player.vimeo.com/progressive_redirect/playback/1229247950/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=0defd985e0204e0513b4ca142a7d20e39e0eea3b9a050335b9416105fa0e4b06",
        poster: "https://i.vimeocdn.com/video/2203861862-e1352a80a9579666276fe3ce48e6c39d712061d5ee46deea70119b60fce9e64a-d_1280?region=us&mw=1920&q=90",
        ratio: "1920 / 1080", time: "0:08", duration: 8.255 },
      { src: "https://player.vimeo.com/progressive_redirect/playback/1229248244/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=4f92587d2d106926c18f87271cd8624dd94e5e4d341eebf3318b033f9be5ed07",
        poster: "https://i.vimeocdn.com/video/2203862133-d0fa428e9fd4f6e4dddc1290c1d04c91163962a3fa0e83c5a192478666fc6daf-d_1280?region=us&mw=1920&q=90",
        ratio: "1920 / 1080", time: "0:12", duration: 12.671667 },
      { src: "https://player.vimeo.com/progressive_redirect/playback/1229248243/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=b09dfc59219db1d65a9ab83f5716e9d9daf2838efd64096e950f47de7784f9cc",
        poster: "https://i.vimeocdn.com/video/2203862153-c4319ae5f382573f42da1d7a49a75947756ec07ca10399da317bd70b24866be3-d_1280?region=us&mw=1920&q=90",
        ratio: "1920 / 1080", time: "0:13", duration: 13.418333 }
      ]
    },
    {
      title: "Bladee - Blondie",
      category: "Music",
      director: "Joe Ward",
      format: "Anamorphic, S35, Digital",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/1231805582/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=5a08487628cc392908949636cd0e3784e1490ffb5678b91af9426da75584cc1a",
        poster: "https://i.vimeocdn.com/video/2207059436-bc9e4934c45eeb13d524897b57fc1c849646e6bd5358ce1a31059cd9961cc346-d_1280?region=us&mw=1920&q=90",
        ratio: "2560 / 1089", time: "3:31", duration: 211.93 }
      ]
    },
    {
      title: "Art of Movement",
      category: "Short",
      director: "Tayler Prince-Fraser",
      format: "S35, LF, Digital",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/1142188732/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=71dbe0db74b962ea3ec5aefc9bc3537a4d7579cec775b6d08dda02b68dcfd01d",
        poster: "https://i.vimeocdn.com/video/2089855194-62ecd2e45e1f8ecbe66c98420c80ad28f2f0a95e14dfbffd61156297af49930b-d_1280?region=us&mw=1920&q=90",
        ratio: "2048 / 1152", time: "2:06", duration: 126.506667 }
      ]
    },
    {
      title: "Oasis x Spotify",
      category: "Commercial",
      director: "Uncanny",
      format: "Standard 16, S16",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/1099008622/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=dc129afeac280bf6b7c5cb2785b02cb0b5b24bb6655523356f50d6da700ea6e6",
        poster: "https://i.vimeocdn.com/video/2033812422-93ef9e77c85f1b57fd5890f27ac72922934251ccc0c3a0d4d288fa942277d80f-d_1280?region=us&mw=1920&q=90",
        ratio: "1572 / 1080", time: "1:11", duration: 71.125 }
      ]
    },
    {
      title: "Corteiz ‘Lundun’",
      category: "Commercial",
      director: "Uncanny",
      format: "Standard 16",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/1072932139/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=99567ab965f52a6c9f252508113be239e021c05992530790e03b20ad3010af06",
        poster: "https://i.vimeocdn.com/video/2006470127-41dc28a06889dec234c7ca2a3c6e7c2154fe49ae11aa0c50b81eb97a235e40c0-d_1280?region=us&mw=1920&q=90",
        ratio: "1620 / 1080", time: "0:10", duration: 10.41 }
      ]
    },
    {
      title: "Xiaoqiao - Lethe",
      category: "Music",
      director: "Erika Kamano",
      format: "S35, Digital",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/1071457554/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=302eac755a08f76de9fb55e865caabf20c2617fb7955cfad21c77c66e80575ca",
        poster: "https://i.vimeocdn.com/video/2000183801-d5097b7141d6c7715065e5e3b162de9c763437d50cd7d050ed7940c0064d20b7-d_1280?region=us&mw=1920&q=90",
        ratio: "1920 / 1080", time: "0:25", duration: 25.001667 }
      ]
    },
    {
      title: "Adidas ‘Tug of War’",
      category: "Commercial",
      director: "Dominic Chew",
      format: "S35, Digital",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/1227034781/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=4a0bc10300ec0d73e06d94a76aa2e29606ab7a962a6613a9bc0a39e77bb392cc",
        poster: "https://i.vimeocdn.com/video/2206436103-df8a7a46b7f8b7c756821cb8f516c78c96cefb36d67806b0e15f85ff08515292-d_1280?region=us&mw=1920&q=90",
        ratio: "1440 / 1080", time: "0:47", duration: 47.806667 }
      ]
    },
    {
      title: "CP x Barbour",
      category: "Fashion",
      director: "Theo Cottle",
      format: "S16",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/875187596/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=7feda85be6dce794fc49e477986d856960673e4cac5827704ae6e019f247d9ac",
        poster: "https://i.vimeocdn.com/video/1739627020-3fe56cc00ed2d14ebd5afc390b1f4de6955e858b25e839bd90482c4bb3a289dc-d_1280?region=us&mw=1920&q=90",
        ratio: "1920 / 1080", time: "0:29", duration: 29.93 }
      ]
    },
    {
      title: "The North Face",
      category: "Fashion",
      director: "Tayler Prince-Fraser",
      format: "Standard 16",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/808697355/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=a569704a71b810409671edff0c916535bce5762bf8db809984564dcdd062e888",
        poster: "https://i.vimeocdn.com/video/2206436844-155cd6eac648929c0cf40f79212f93dc639e38ad27a6e6d32bd53ca50f4a4221-d_1280?region=us&mw=1920&q=90",
        ratio: "1440 / 1080", time: "1:06", duration: 66.9 }
      ]
    },
    {
      title: "Raf Simons",
      category: "Fashion",
      director: "Elliot Holbrow",
      format: "S35, Digital",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/486365701/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=1643d8e00fd6239bb01c18f962f78be2a4f3cc03dc754b515e280d3c8acec277",
        poster: "https://i.vimeocdn.com/video/1006781815-55d0d3b118c5764babf019a3a1e1940fefcc4569463e392bf4f5dd02fc3cc483-d_1280?region=us&mw=1920&q=90",
        ratio: "1920 / 1080", time: "0:41", duration: 41.258333 }
      ]
    },
    {
      title: "Swank Mami - MC69",
      category: "Music",
      director: "Claryn Chong",
      format: "S35, Digital",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/1132515614/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=cbe53569d3db381d73c4c486235f404e6465ffbad36985de7279251973ee7d3b",
        poster: "https://i.vimeocdn.com/video/2076827688-215e537ce1299d74233874078dfde5b678932b17b1cc3ebb2782dfc0292e7d94-d_1280?region=us&mw=1920&q=90",
        ratio: "1620 / 1080", time: "2:33", duration: 153.45 }
      ]
    },
    {
      title: "Unflirt - Seasong",
      category: "Music",
      director: "Claryn Chong",
      format: "DV, Beta, Digital",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/1113705769/rendition/540p/file.mp4%20%28540p%29.mp4?loc=external&log_user=0&signature=96f1fab2ff41a3675a60bad71284fda6014143e03ff94810af49733e2f6ed202",
        poster: "https://i.vimeocdn.com/video/2052938166-6f07389d7ecf100967d152a91839ef9dbe09802cb9e748b4d567841a312806e8-d_640?region=us&mw=1920&q=90",
        ratio: "886 / 540", time: "3:41", duration: 221.46 }
      ]
    },
    {
      title: "Rotator",
      category: "Short",
      director: "Uncanny",
      format: "Digital, Standard 16",
      videos: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/1113672737/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=5c6db461969362b269e6cc545745cab6e4cd701e3f4008cf622bd2973768e132",
        poster: "https://i.vimeocdn.com/video/2052937277-8597d16a4732b82b3d1b60e9cb3ba545d5f184ebf4e8bb19a335453ed0620e1c-d_1280?region=us&mw=1920&q=90",
        ratio: "1440 / 1080", time: "3:51", duration: 231.806667 }
      ]
    }
  ];

 /* Build the project list into the empty .project-accordion. If the Cargo
    markup already contains projects, leave it alone. */
 /* Project link name: "Bladee - Blondie" → "bladee-blondie", used for
    elliot.onl/projects#bladee-blondie. A project can set its own "slug". */
 function slugify(text) {
   return String(text)
     .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
     .toLowerCase()
     .replace(/[^a-z0-9]+/g, "-")
     .replace(/^-+|-+$/g, "");
 }

 /* Total running time of a project's videos, e.g. "0:44" for four clips. */
 function projectRunningTime(project) {
   var total = 0;
   for (var i = 0; i < project.videos.length; i++) {
     if (!project.videos[i].duration) return project.videos[0].time || "";
     total += project.videos[i].duration;
   }
   var seconds = Math.floor(total);
   return Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
 }

 /* Vimeo thumbnail at a given width. Vimeo serves at most the size named
    in the path ("-d_1280"), whatever "mw" asks for, so change both. */
 function posterAtWidth(source, width) {
   try {
     var url = new URL(source.replace(/-d_\d+(x\d+)?/, "-d_" + width), window.location.href);
     url.searchParams.set("mw", String(width));
     url.searchParams.set("q", "90");
     return url.toString();
   } catch (error) {
     return source;
   }
 }

 function renderProjects() {
   var accordion = page && page.querySelector(".project-accordion");
   if (!accordion || accordion.querySelector("details.project-item")) return;

   function el(tag, className, text) {
     var node = document.createElement(tag);
     if (className) node.className = className;
     if (text != null) node.textContent = text;
     return node;
   }

   PROJECTS.forEach(function (project, index) {
     var details = el("details", "project-item");
     details.setAttribute("name", "elliot-projects");
     details.setAttribute("data-slug", project.slug || slugify(project.title));

     details.setAttribute("data-category", project.category);

     /* One table row: number, title, director, format, type, running time.
        Phones show only the number, title and type (home.css). */
     var summary = el("summary");
     summary.appendChild(el("span", "project-number", String(index + 1).padStart(2, "0")));
     summary.appendChild(el("span", "project-title-text", project.title));
     summary.appendChild(el("span", "project-director", project.director));
     summary.appendChild(el("span", "project-format", project.format));
     summary.appendChild(el("span", "project-category", project.category));
     summary.appendChild(el("span", "project-time", projectRunningTime(project)));
     details.appendChild(summary);

     var content = el("div", "project-content");
     /* The open video is capped to the screen's height (home.css). */
     content.style.setProperty("--project-ratio", project.videos[0].ratio || "16 / 9");
     var carousel = el("div", "project-carousel");

     project.videos.forEach(function (clip) {
       var slide = el("div", "project-slide");
       var wrap = el("div", "video-wrap");
       var stage = el("div", "video-stage is-paused");
       /* On the wrap so the stage (aspect ratio) and the wrap (sized to fit
          a sideways phone's height, in home.css) can both use it. */
       wrap.style.setProperty("--video-ratio", clip.ratio || "16 / 9");

       var video = el("video", "project-video");
       video.setAttribute("playsinline", "");
       video.setAttribute("preload", "none");
       video.setAttribute("data-deferred-src", clip.src);
       /* With no poster given, the player looks the thumbnail up on Vimeo. */
       if (clip.poster) video.setAttribute("data-deferred-poster", clip.poster);
       stage.appendChild(video);

       var controls = el("div", "video-controls");
       /* Running time and ratio are optional: they fill in from the video
          itself once its project is opened. */
       controls.appendChild(el("span", "video-time", clip.time || ""));
       var progress = el("input", "video-progress");
       progress.type = "range";
       progress.min = "0";
       progress.max = String(clip.duration || 100);
       progress.step = "0.01";
       progress.value = "0";
       progress.setAttribute("aria-label", "Video progress");
       progress.style.setProperty("--progress", "0%");
       controls.appendChild(progress);
       var mute = el("button", "video-mute-toggle");
       setMuteIcon(mute, false);
       mute.type = "button";
       controls.appendChild(mute);

       wrap.appendChild(stage);
       wrap.appendChild(controls);
       slide.appendChild(wrap);
       carousel.appendChild(slide);
     });

     var meta = el("div", "project-meta");
     [["Director:", project.director, "project-meta-item"],
      ["Format:", project.format, "project-meta-item project-meta-right"]
     ].forEach(function (row) {
       var item = el("span", row[2]);
       item.appendChild(el("span", "project-meta-label", row[0]));
       item.appendChild(document.createTextNode(" " + row[1]));
       meta.appendChild(item);
     });

     content.appendChild(carousel);
     content.appendChild(meta);
     details.appendChild(content);
     accordion.appendChild(details);
   });
 }

 /* Page layout around the list: the name bar along the top, the type
    filters and List / Contact sheet switch, the column headings, and the
    contact sheet itself. All built here, so nothing needs pasting into
    Cargo. */
 var currentFilter = "All";

 function setProjectFilter(category) {
   if (!page) return;
   currentFilter = category;
   page.querySelectorAll("details.project-item").forEach(function (project) {
     var show = category === "All" ||
       project.getAttribute("data-category") === category;
     if (!show && project.open) project.open = false;
     project.hidden = !show;
   });
   page.querySelectorAll(".project-frame").forEach(function (frame) {
     frame.hidden = !(category === "All" ||
       frame.getAttribute("data-category") === category);
   });
   page.querySelectorAll(".project-filter").forEach(function (button) {
     button.setAttribute("aria-pressed",
       String(button.getAttribute("data-category") === category));
   });
 }

 function setProjectView(view) {
   if (!page) return;
   var sheet = view === "sheet";
   if (sheet) {
     page.querySelectorAll("details.project-item[open]").forEach(function (project) {
       project.open = false;
     });
   }
   page.classList.toggle("is-sheet-view", sheet);
   var accordion = page.querySelector(".project-accordion");
   var columns = page.querySelector(".project-columns");
   var frames = page.querySelector(".project-sheet");
   if (accordion) accordion.hidden = sheet;
   if (columns) columns.hidden = sheet;
   if (frames) frames.hidden = !sheet;
   page.querySelectorAll(".project-view").forEach(function (button) {
     button.setAttribute("aria-pressed",
       String(button.getAttribute("data-view") === view));
   });
 }

 function buildPageLayout() {
   var accordion = page && page.querySelector(".project-accordion");
   if (!accordion) return;

   function el(tag, className, text) {
     var node = document.createElement(tag);
     if (className) node.className = className;
     if (text != null) node.textContent = text;
     return node;
   }

   /* Name bar: replaces the stacked heading pasted into Cargo. */
   var heading = page.querySelector(".index-heading");
   if (heading && !heading.classList.contains("is-built")) {
     var contactLink = heading.querySelector("a");
     var contactHref = contactLink ? contactLink.getAttribute("href") : "/contact";
     heading.innerHTML = "";
     heading.appendChild(el("span", "site-name", "Elliot Holbrow"));
     heading.appendChild(el("span", "site-role", "Cinematographer, London"));
     var nav = el("nav", "site-nav");
     nav.setAttribute("aria-label", "Site");
     var work = el("a", "is-current", "Work");
     work.href = "/projects";
     work.setAttribute("aria-current", "page");
     var contact = el("a", "", "Contact");
     contact.href = contactHref;
     nav.appendChild(work);
     nav.appendChild(contact);
     heading.appendChild(nav);
     heading.classList.add("is-built");
   }

   /* Cargo can keep generated markup between visits: start fresh. */
   page.querySelectorAll(".project-tools, .project-columns, .project-sheet")
     .forEach(function (node) { node.remove(); });

   var categories = [];
   var counts = { All: PROJECTS.length };
   PROJECTS.forEach(function (project) {
     if (!counts[project.category]) {
       counts[project.category] = 0;
       categories.push(project.category);
     }
     counts[project.category] += 1;
   });

   var tools = el("div", "project-tools");
   var filters = el("div", "project-filters");
   filters.setAttribute("role", "group");
   filters.setAttribute("aria-label", "Show projects by type");
   ["All"].concat(categories).forEach(function (category) {
     var button = el("button", "project-filter", category);
     button.type = "button";
     button.setAttribute("data-category", category);
     button.appendChild(el("sup", "", String(counts[category])));
     button.addEventListener("click", function () {
       setProjectFilter(category);
     });
     filters.appendChild(button);
   });

   var views = el("div", "project-views");
   views.setAttribute("role", "group");
   views.setAttribute("aria-label", "View");
   [["list", "List"], ["sheet", "Contact sheet"]].forEach(function (view) {
     var button = el("button", "project-view", view[1]);
     button.type = "button";
     button.setAttribute("data-view", view[0]);
     button.addEventListener("click", function () {
       setProjectView(view[0]);
     });
     views.appendChild(button);
   });
   tools.appendChild(filters);
   tools.appendChild(views);

   var columns = el("div", "project-columns");
   columns.setAttribute("aria-hidden", "true");
   ["No.", "Title", "Director", "Format", "Type", "Time"].forEach(function (label) {
     columns.appendChild(el("span", "", label));
   });

   /* Contact sheet: each project's Vimeo thumbnail; a click opens it. */
   var sheet = el("div", "project-sheet");
   var items = accordion.querySelectorAll("details.project-item");
   PROJECTS.forEach(function (project, index) {
     var details = items[index];
     var frame = el("button", "project-frame");
     frame.type = "button";
     frame.setAttribute("data-category", project.category);
     frame.setAttribute("aria-label", "Open " + project.title);
     var image = el("span", "project-frame-image");
     var poster = project.videos[0].poster;
     if (poster) {
       var img = el("img");
       img.alt = "";
       img.loading = "lazy";
       img.decoding = "async";
       img.src = posterAtWidth(poster, 960);
       image.appendChild(img);
     }
     var edge = el("span", "project-frame-edge");
     edge.appendChild(el("span", "project-frame-title", project.title));
     edge.appendChild(el("span", "project-frame-number", String(index + 1).padStart(2, "0")));
     frame.appendChild(image);
     frame.appendChild(edge);
     frame.addEventListener("click", function () {
       if (!details) return;
       setProjectView("list");
       goToProject(details, true);
     });
     sheet.appendChild(frame);
   });

   accordion.parentNode.insertBefore(tools, accordion);
   accordion.parentNode.insertBefore(columns, accordion);
   accordion.parentNode.insertBefore(sheet, accordion.nextSibling);

   setProjectFilter("All");
   setProjectView("list");
 }

 renderProjects();
 buildPageLayout();
 var hoverPreview = null;
  var hoverPreviewImage = null;

 /* Light/dark toggle icon: a half-filled circle. */
 var THEME_ICON =
   '<svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true" focusable="false">' +
   '<circle cx="6" cy="6" r="4.75"/><path d="M6 1.25a4.75 4.75 0 0 1 0 9.5z"/></svg>';

 /* Keep the playbar on one row even if the browser holds an older cached
    stylesheet: set the essential layout inline. */
 function lockControlsLayout(controls) {
   controls.style.display = "flex";
   controls.style.flexWrap = "nowrap";
   controls.style.alignItems = "center";
   Array.prototype.forEach.call(controls.children, function (child) {
     if (child.classList.contains("video-progress")) {
       child.style.flex = "1 1 auto";
       child.style.minWidth = "0";
     } else {
       child.style.flex = "0 0 auto";
     }
   });
 }

 function rebuildProjectThemeControls() {
   if (!page) return;

   /* Remove any legacy switch above the project list. */
   page.querySelectorAll(
     ".theme-toggle, .portfolio-theme-controls"
   ).forEach(function (control) {
     control.remove();
   });

   /* Cargo can preserve an initialized video while replacing its markup.
      Rebuild this control independently so it always appears beside Mute. */
   page.querySelectorAll(".video-controls").forEach(function (controls) {
     controls.querySelectorAll(
       ".video-theme-toggle, .video-theme-controls"
     ).forEach(function (oldControl) {
       oldControl.remove();
     });

    var button = document.createElement("button");
    button.className = "video-theme-toggle";
    button.type = "button";
    button.innerHTML = THEME_ICON;
    button.setAttribute("aria-label", "Switch to light mode");
     button.setAttribute("aria-pressed", "false");
     button.addEventListener("click", function (event) {
       event.preventDefault();
       event.stopPropagation();
       setPortfolioTheme(
         page.classList.contains("is-light-theme") ? "dark" : "light"
       );
     });
     controls.appendChild(button);
     lockControlsLayout(controls);
   });
 }

 function setPortfolioTheme(theme) {
   if (!page) return;

   var isLight = theme === "light";

   page.setAttribute(
     "data-portfolio-theme",
     isLight ? "light" : "dark"
   );
   page.classList.toggle("is-light-theme", isLight);

   page.querySelectorAll(".video-theme-toggle").forEach(function (button) {
     button.innerHTML = THEME_ICON;
     button.setAttribute("aria-pressed", String(isLight));
     button.setAttribute(
       "aria-label",
       isLight ? "Switch to dark mode" : "Switch to light mode"
     );
   });

   updateBackgroundVideo();
 }

 rebuildProjectThemeControls();
 setPortfolioTheme("dark");

  function supportsProjectPreview() {
    return window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 768px)"
    ).matches;
  }

 function hideProjectPreview() {
   if (hoverPreview) hoverPreview.classList.remove("is-visible");
   if (!page) return;

   page.classList.remove("is-previewing");

   if (page.classList.contains("restore-light-after-preview")) {
     page.classList.remove("restore-light-after-preview");
     setPortfolioTheme("light");
   }
 }

 function highQualityPoster(source) {
   return posterAtWidth(source, 2560);
 }

 if (page) {
   /* Remove previews left behind by an earlier Cargo script run. */
   page.querySelectorAll(".project-hover-preview").forEach(function (preview) {
     preview.remove();
   });

   hoverPreview = document.createElement("div");
   hoverPreview.className = "project-hover-preview";
    hoverPreview.setAttribute("aria-hidden", "true");

    hoverPreviewImage = document.createElement("img");
    hoverPreviewImage.alt = "";
    hoverPreviewImage.decoding = "async";
   hoverPreview.appendChild(hoverPreviewImage);
   page.appendChild(hoverPreview);

    page.querySelectorAll(".project-item > summary").forEach(function (summary) {
      summary.addEventListener("mouseenter", function (event) {
        if (!supportsProjectPreview()) return;

        var project = summary.closest(".project-item");
        var video = project && project.querySelector("video.project-video");

        var poster = video &&
          (video.getAttribute("poster") || video.getAttribute("data-deferred-poster"));

        if (!poster) return;

     hoverPreviewImage.src = highQualityPoster(poster);

     if (page.classList.contains("is-light-theme")) {
       page.classList.add("restore-light-after-preview");
       page.classList.remove("is-light-theme");
     }

     hoverPreview.classList.add("is-visible");
     page.classList.add("is-previewing");
   });

      summary.addEventListener("mouseleave", hideProjectPreview);
      summary.addEventListener("click", hideProjectPreview);
    });

    window.addEventListener("scroll", hideProjectPreview, { passive: true });
    window.addEventListener("blur", hideProjectPreview);
  }

  /* Intro showreel (desktop only): plays full-screen behind the project list
     on the first load of a visit. The first time someone hovers a project title (desktop)
     or opens a project, it fades out for good and the hover thumbnails take
     over. */
  var BACKGROUND_VIDEO = "https://player.vimeo.com/progressive_redirect/playback/1071786882/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=bb427ec363ba3c6895452e43799399e366b81c94201c7b7d02769f76461fe59d";
  var BACKGROUND_VIDEO_MOBILE = "https://player.vimeo.com/progressive_redirect/playback/1071786882/rendition/720p/file.mp4%20%28720p%29.mp4?loc=external&log_user=0&signature=0c0894255b1ccc728a1be1eeb017060c52311c6a5133eceda6ad94aa42e9bd59";
  var INTRO_SEEN_KEY = "elliotIntroSeen";
  var backgroundVideo = null;

  function introAlreadySeen() {
    try {
      return window.sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
    } catch (error) {
      return false;
    }
  }

  function dismissIntro() {
    if (!page || !backgroundVideo) return;

    var background = backgroundVideo.parentNode;
    var video = backgroundVideo;
    backgroundVideo = null;

    try {
      window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch (error) {}

    page.classList.add("intro-dismissed");
    window.setTimeout(function () {
      video.pause();
      video.removeAttribute("src");
      video.load();
      if (background) background.remove();
    }, 900);
  }

  /* Pause while light mode is on, in case it's switched before the intro ends. */
  function updateBackgroundVideo() {
    if (!page || !backgroundVideo) return;

    if (page.classList.contains("is-light-theme")) {
      backgroundVideo.pause();
    } else if (backgroundVideo.paused) {
      var playAttempt = backgroundVideo.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(function () {
          /* Autoplay blocked (e.g. Low Power Mode): the poster still shows. */
        });
      }
    }
  }

  if (page) {
    page.querySelectorAll(".page-background").forEach(function (old) {
      old.remove();
    });
    page.classList.remove("intro-dismissed");
  }

  if (
    page &&
    !introAlreadySeen() &&
    !window.matchMedia(PHONE_QUERY).matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    var background = document.createElement("div");
    background.className = "page-background";
    background.setAttribute("aria-hidden", "true");

    backgroundVideo = document.createElement("video");
    backgroundVideo.src = window.matchMedia(PHONE_QUERY).matches
      ? BACKGROUND_VIDEO_MOBILE
      : BACKGROUND_VIDEO;
    backgroundVideo.muted = true;
    backgroundVideo.defaultMuted = true;
    backgroundVideo.loop = true;
    backgroundVideo.playsInline = true;
    backgroundVideo.preload = "auto";
    backgroundVideo.setAttribute("muted", "");
    backgroundVideo.setAttribute("playsinline", "");
    backgroundVideo.setAttribute("webkit-playsinline", "");

    var backgroundMatch = BACKGROUND_VIDEO.match(/playback\/(\d+)\//);
    if (backgroundMatch) {
      fetch(
        "https://vimeo.com/api/oembed.json?url=" +
        encodeURIComponent("https://vimeo.com/" + backgroundMatch[1]) +
        "&maxwidth=1920"
      )
        .then(function (response) {
          if (!response.ok) throw new Error("Vimeo thumbnail unavailable");
          return response.json();
        })
        .then(function (data) {
          if (!data.thumbnail_url || !backgroundVideo) return;
          var thumbnail = new URL(data.thumbnail_url);
          thumbnail.searchParams.set("mw", "1920");
          thumbnail.searchParams.set("q", "90");
          backgroundVideo.setAttribute("poster", thumbnail.toString());
        })
        .catch(function () {});
    }

    /* The reel is footage only: switch off any caption track embedded in the
       file, which Safari/iOS otherwise shows when device captions are on. */
    var introVideo = backgroundVideo;
    function hideIntroCaptions() {
      for (var i = 0; i < introVideo.textTracks.length; i++) {
        introVideo.textTracks[i].mode = "disabled";
      }
    }
    if (introVideo.textTracks) {
      introVideo.textTracks.addEventListener("addtrack", hideIntroCaptions);
      introVideo.addEventListener("loadedmetadata", hideIntroCaptions);
      hideIntroCaptions();
    }

    background.appendChild(backgroundVideo);
    page.insertBefore(background, page.firstChild);

    page.querySelectorAll(".project-item > summary").forEach(function (summary) {
      summary.addEventListener("mouseenter", function () {
        if (supportsProjectPreview()) dismissIntro();
      });
    });

    page.querySelectorAll("details.project-item").forEach(function (project) {
      project.addEventListener("toggle", function () {
        if (project.open) dismissIntro();
      });
    });

    updateBackgroundVideo();
  }

  /* Restore a deferred video's source so it can load and play. */
  /* Fully unload a video whose project has closed, so it starts from the
     beginning next time. iPhones (all iOS browsers) also limit how many
     videos can hold decoders at once; a merely paused video in a closed
     project could stop the next one playing. */
  function releaseVideo(video) {
    var src = video.getAttribute("src");
    if (!src) return;

    video.pause();
    video.setAttribute("data-deferred-src", src);
    video.removeAttribute("src");
    video.load();
  }

  function activateVideo(video) {
    var deferred = video.getAttribute("data-deferred-src");
    if (!deferred) return;


    var deferredPoster = video.getAttribute("data-deferred-poster");
    if (deferredPoster) {
      video.setAttribute("poster", deferredPoster);
      video.removeAttribute("data-deferred-poster");
    }

    video.removeAttribute("data-deferred-src");
    video.preload = "metadata";
    video.src = deferred;
    video._elliotLoopsLeft = 1;
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    return minutes + ":" + String(remainingSeconds).padStart(2, "0");
  }

  document.querySelectorAll(
    '[id="X1134136285"] video.project-video'
  ).forEach(function (video) {
    if (video._elliotPlayerReady) return;
    video._elliotPlayerReady = true;

   video.controls = false;
   video.setAttribute("playsinline", "");
   video.setAttribute("webkit-playsinline", "");

   /* Don't fetch videos for closed projects: 19 videos requesting metadata
      at once clog mobile Safari's connections and slow every page change.
      The source is restored when the project opens (activateVideo). */
   var parentProject = video.closest("details.project-item");
   if (video.getAttribute("src") && parentProject && !parentProject.open) {
     video.setAttribute("data-deferred-src", video.getAttribute("src"));
     video.removeAttribute("src");
     if (video.getAttribute("poster")) {
       video.setAttribute("data-deferred-poster", video.getAttribute("poster"));
       video.removeAttribute("poster");
     }
     video.preload = "none";
     video.load();
   }

    var wrap = video.closest(".video-wrap");
    var stage = video.closest(".video-stage");
    var controls;
    var time;
    var progress;
   var muteButton;
    var animationFrame = null;
    var isScrubbing = false;

    if (!stage) {
      stage = document.createElement("div");
      stage.className = "video-stage is-paused";
      wrap.insertBefore(stage, video);
      stage.appendChild(video);
    }

   function setVideoRatio() {
     if (video.videoWidth > 0 && video.videoHeight > 0) {
       stage.style.removeProperty("--video-ratio");
       wrap.style.setProperty(
         "--video-ratio",
         video.videoWidth + " / " + video.videoHeight
       );
     }
   }

   /* Safari can play audio from a video initialized inside closed details
      without painting its moving frame until the page scrolls. Nudging the
      composited layer forces that frame to appear without reloading media. */
   function refreshVideoFrame() {
     stage.style.webkitTransform = "translate3d(0, 0, 0)";
     stage.style.transform = "translate3d(0, 0, 0)";
     video.style.webkitTransform = "translate3d(0, 0, 0)";
     video.style.transform = "translate3d(0, 0, 0)";
     video.style.opacity = "0.999";
     void video.offsetWidth;

     window.requestAnimationFrame(function () {
       video.style.opacity = "1";
     });
   }

   video._refreshElliotFrame = refreshVideoFrame;

    function loadVimeoPoster() {
      /* The poster is already in the page markup; only look it up if not. */
      if (video.getAttribute("poster") ||
          video.getAttribute("data-deferred-poster")) return;

      var source = video.getAttribute("data-deferred-src") ||
        video.currentSrc || video.src || "";
      var match = source.match(/playback\/(\d+)\//);

      if (!match) return;

      fetch(
        "https://vimeo.com/api/oembed.json?url=" +
        encodeURIComponent("https://vimeo.com/" + match[1]) +
        "&maxwidth=1920&maxheight=1080"
      )
        .then(function (response) {
          if (!response.ok) throw new Error("Vimeo thumbnail unavailable");
          return response.json();
        })
        .then(function (data) {
          if (data.thumbnail_url && !video.getAttribute("poster")) {
            var thumbnail = new URL(data.thumbnail_url);

            /* Ask Vimeo's image CDN for a full-size, high-quality poster. */
            thumbnail.searchParams.set("mw", "1920");
            thumbnail.searchParams.set("q", "90");

            video.setAttribute("poster", thumbnail.toString());
          }
        })
        .catch(function () {
          /* The video itself remains the fallback preview. */
        });
    }

    loadVimeoPoster();

    stage.querySelectorAll(".video-center-toggle").forEach(function (button) {
      button.remove();
    });

    controls = wrap.querySelector(".video-controls");

    if (!controls) {
      controls = document.createElement("div");
      controls.className = "video-controls";
      wrap.appendChild(controls);
    }

    time = controls.querySelector(".video-time");

    if (!time) {
      time = document.createElement("span");
      time.className = "video-time";
      controls.insertBefore(time, controls.firstChild);
    }

    progress = controls.querySelector(".video-progress");

    if (!progress) {
      progress = document.createElement("input");
      progress.className = "video-progress";
      progress.type = "range";
      progress.min = "0";
      progress.max = "100";
      progress.step = "0.01";
      progress.value = "0";
      progress.setAttribute("aria-label", "Video progress");
      controls.appendChild(progress);
    }

    muteButton = controls.querySelector(".video-mute-toggle");

   if (!muteButton) {
      muteButton = document.createElement("button");
      muteButton.className = "video-mute-toggle";
      muteButton.type = "button";
      setMuteIcon(muteButton, false);
      controls.appendChild(muteButton);
   }

   setPortfolioTheme(
     page.classList.contains("is-light-theme") ? "light" : "dark"
   );

    function updateControls() {
      var duration = video.duration || 0;
      var hasStarted = !video.paused || video.currentTime > 0;

      if (duration) video._elliotDurationText = formatTime(duration);

      if (video.ended && !video._elliotLoopsLeft) {
        /* Finished: the time becomes a Replay button. */
        if (time.getAttribute("data-replay") !== "1") {
          time.setAttribute("data-replay", "1");
          time.setAttribute("role", "button");
          time.setAttribute("tabindex", "0");
          time.setAttribute("aria-label", "Replay");
          time.innerHTML = REPLAY_HTML;
        }
      } else {
        if (time.getAttribute("data-replay") === "1") {
          time.removeAttribute("data-replay");
          time.removeAttribute("role");
          time.removeAttribute("tabindex");
          time.removeAttribute("aria-label");
        }

        /* Before metadata loads, keep the duration already shown. */
        if (hasStarted || duration) {
          time.textContent = formatTime(
            hasStarted ? video.currentTime : duration
          );
        } else if (video._elliotDurationText) {
          time.textContent = video._elliotDurationText;
        }
      }

      progress.max = duration || 100;
      if (!isScrubbing) {
        progress.value = video.currentTime || 0;
      }
      progress.style.setProperty(
        "--progress",
        duration
          ? ((isScrubbing ? Number(progress.value) : video.currentTime) /
              duration) * 100 + "%"
          : "0%"
      );

      stage.classList.toggle("is-paused", video.paused);
      setMuteIcon(muteButton, video.muted);
      updateEndPoster();
    }

    /* When a video finishes, fade its thumbnail back in over the last
       frame. Styled inline so it works even with an older cached home.css;
       it ignores clicks, so tapping still replays and skipping back still
       works (seeking away from the end hides it). */
    var endPoster = null;

    function updateEndPoster() {
      var posterSrc = video.getAttribute("poster");
      var show = video.ended && !video._elliotLoopsLeft && !!posterSrc;

      if (!endPoster) {
        if (!show) return;
        endPoster = document.createElement("img");
        endPoster.className = "video-end-poster";
        endPoster.alt = "";
        endPoster.setAttribute("aria-hidden", "true");
        endPoster.draggable = false;
        endPoster.style.cssText =
          "position:absolute;inset:0;z-index:1;display:block;width:100%;" +
          "height:100%;margin:0;padding:0;border:0;max-width:none;" +
          "pointer-events:none;opacity:0;transition:opacity 400ms ease;";
        stage.insertBefore(endPoster, video.nextSibling);
      }

      if (show && endPoster.getAttribute("src") !== posterSrc) {
        endPoster.setAttribute("src", posterSrc);
      }
      /* Match the video's framing (cover inline, contain in fullscreen). */
      endPoster.style.objectFit =
        window.getComputedStyle(video).objectFit || "cover";
      endPoster.style.opacity = show ? "1" : "0";
    }

    function animateProgress() {
      updateControls();

      if (!video.paused && !video.ended) {
        animationFrame = requestAnimationFrame(animateProgress);
      } else {
        animationFrame = null;
      }
    }

    function togglePlayback() {
      activateVideo(video);

      if (video.paused) {
        var playAttempt = video.play();

        if (playAttempt && typeof playAttempt.catch === "function") {
          playAttempt.catch(function (error) {
            /* A blocked play (no user gesture) can't be retried; any other
               failure gets one fresh load and another try. */
            if (error && error.name === "NotAllowedError") {
              stage.classList.add("is-paused");
              return;
            }
            /* Project closed (video released) while it was starting. */
            if (!video.getAttribute("src")) return;
            video.load();
            var retry = video.play();
            if (retry && typeof retry.catch === "function") {
              retry.catch(function () {
                stage.classList.add("is-paused");
              });
            }
          });
        }
      } else {
        video.pause();
      }
    }

    /* Start playing when the project is opened (see autoplayProject). */
    /* allowMuted: when opened by a link rather than a click, browsers
       won't play sound without a tap, so start muted instead. */
    video._elliotAutoplay = function (allowMuted) {
      if (!video.paused) return;
      if (!allowMuted) {
        togglePlayback();
        return;
      }

      activateVideo(video);
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function (error) {
          if (!error || error.name !== "NotAllowedError" ||
              !video.getAttribute("src")) return;
          video.muted = true;
          var muted = video.play();
          if (muted && typeof muted.catch === "function") {
            muted.catch(function () {
              stage.classList.add("is-paused");
            });
          }
        });
      }
    };

    /* Listen on the stage rather than the video: iOS browsers do not
       reliably dispatch taps to a <video> element without native controls.
       Tap or click plays/pauses; double-tap or double-click the right/left
       half to skip forward/back (like YouTube on phones), and further quick
       taps keep skipping. */
    var singleTapTimer = null;
    var lastTapAt = 0;
    var skipChainUntil = 0;
    var singleTapFiredAt = 0;

    function showSkipHint(direction) {
      var hint = document.createElement("span");
      hint.className = "video-skip-hint " +
        (direction > 0 ? "video-skip-hint-forward" : "video-skip-hint-back");
      hint.textContent = (direction > 0 ? "+" : "\u2212") + TAP_SEEK_STEP + "s";
      hint.setAttribute("aria-hidden", "true");
      stage.appendChild(hint);
      window.setTimeout(function () { hint.remove(); }, 650);
    }

    function skipBy(direction) {
      if (!Number.isFinite(video.duration)) return;
      video.currentTime = Math.min(
        Math.max(0, video.currentTime + direction * TAP_SEEK_STEP),
        Math.max(0, video.duration - 0.05)
      );
      showSkipHint(direction);
      updateControls();
    }

    function handleTap(clientX) {
      var bounds = stage.getBoundingClientRect();
      var direction = clientX - bounds.left < bounds.width / 2 ? -1 : 1;
      var now = Date.now();
      var isDoubleTap = now - lastTapAt < 450;

      if (now < skipChainUntil || isDoubleTap) {
        if (singleTapTimer) {
          window.clearTimeout(singleTapTimer);
          singleTapTimer = null;
        } else if (singleTapFiredAt && now - singleTapFiredAt < 450) {
          /* The first tap already played/paused: undo that, so a slower
             double-tap never leaves the video paused. */
          togglePlayback();
        }
        singleTapFiredAt = 0;
        lastTapAt = 0;
        skipBy(direction);
        skipChainUntil = now + 700;
        return;
      }

      lastTapAt = now;
      singleTapTimer = window.setTimeout(function () {
        singleTapTimer = null;
        singleTapFiredAt = Date.now();
        togglePlayback();
      }, 300);
    }

    /* Touch: read raw touches. iPhones often merge a quick double-tap into
       a single "click", so click events alone miss the second tap. */
    /* Single-video projects: sideways drags are swipes to the next or
       previous project, never panning or zooming. Projects with several
       videos (e.g. Playing House) keep sideways scrolling between them. */
    var stageProject = stage.closest("details.project-item");
    if (stageProject &&
        stageProject.querySelectorAll("video.project-video").length === 1) {
      stage.style.touchAction = "pan-y";
    }

    var touchStartX = 0;
    var touchStartY = 0;
    var touchStartAt = 0;
    var touchStartAtFirst = true;
    var touchStartAtLast = true;
    var touchMoved = false;
    var lastTouchEndAt = 0;

    stage.addEventListener("touchstart", function (event) {
      var touch = event.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartAt = Date.now();
      touchMoved = event.touches.length > 1;

      /* Multi-video projects: remember if the slideshow was already on
         its first or last video when this swipe began. */
      var carousel = stage.closest(".project-carousel");
      var maxScroll = carousel ? carousel.scrollWidth - carousel.clientWidth : 0;
      touchStartAtFirst = !carousel || carousel.scrollLeft <= 2;
      touchStartAtLast = !carousel || carousel.scrollLeft >= maxScroll - 2;
    }, { passive: true });

    stage.addEventListener("touchmove", function (event) {
      var touch = event.touches[0];
      if (Math.abs(touch.clientX - touchStartX) > 10 ||
          Math.abs(touch.clientY - touchStartY) > 10) {
        touchMoved = true;
      }
    }, { passive: true });

    stage.addEventListener("touchend", function (event) {
      if (touchMoved) {
        /* A quick sideways swipe moves to the next/previous project
           (left = next). In projects with several videos a swipe first
           moves through them like a slideshow; only a swipe past the
           last (or back past the first) changes project. Not in
           fullscreen. */
        var touch = event.changedTouches[0];
        var dx = touch.clientX - touchStartX;
        var dy = touch.clientY - touchStartY;
        var leavesProject = dx < 0 ? touchStartAtLast : touchStartAtFirst;
        if (event.touches.length === 0 &&
            Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 2 &&
            Date.now() - touchStartAt < 700 && leavesProject &&
            !document.fullscreenElement && !document.webkitFullscreenElement) {
          stepProject(dx < 0 ? 1 : -1, true);
        }
        return; /* otherwise a scroll or pinch, not a tap */
      }
      /* Stop the browser's own click (and double-tap handling) for this tap. */
      event.preventDefault();
      lastTouchEndAt = Date.now();
      unlockVideosForSound(); /* a real tap, though its click is cancelled */
      handleTap(event.changedTouches[0].clientX);
    }, { passive: false });

    /* Mouse/trackpad: the same as touch. Click plays/pauses; double-click
       the right/left half to skip forward/back. */
    stage.addEventListener("click", function (event) {
      if (Date.now() - lastTouchEndAt < 800) return; /* already handled as touch */
      handleTap(event.clientX);
    });

    /* Double-clicks shouldn't select text or trigger anything else. */
    stage.addEventListener("dblclick", function (event) {
      event.preventDefault();
    });

    function replay(event) {
      if (time.getAttribute("data-replay") !== "1") return;
      event.preventDefault();
      event.stopPropagation();
      video.currentTime = 0;
      togglePlayback();
    }

    time.addEventListener("click", replay);
    time.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") replay(event);
    });

    /* Fullscreen: the whole player (picture + playbar) where the browser
       allows it; iPhone Safari only allows the native video player. */
    var fullscreenButton = controls.querySelector(".video-fullscreen-toggle");

    /* Diagonal-arrow icons: pointing out to enter, in to exit. */
    var ENTER_FULLSCREEN_ICON =
      '<svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true" focusable="false">' +
      '<path d="M7 1h4v4M11 1L7 5M5 11H1V7M1 11l4-4"/></svg>';
    var EXIT_FULLSCREEN_ICON =
      '<svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true" focusable="false">' +
      '<path d="M10.5 5H7V1.5M11 1L7 5M1.5 7H5v3.5M1 11l4-4"/></svg>';

    if (!fullscreenButton) {
      fullscreenButton = document.createElement("button");
      fullscreenButton.className = "video-fullscreen-toggle";
      fullscreenButton.type = "button";
      fullscreenButton.innerHTML = ENTER_FULLSCREEN_ICON;
      fullscreenButton.setAttribute("aria-label", "Enter fullscreen");
      controls.insertBefore(
        fullscreenButton,
        controls.querySelector(".video-theme-toggle")
      );
    }

    function fullscreenElement() {
      return document.fullscreenElement || document.webkitFullscreenElement;
    }

    fullscreenButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (fullscreenElement() === wrap) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        return;
      }

      /* Going fullscreen also starts the video (inside the same tap, so
         phones allow it to play). */
      activateVideo(video);
      if (video.paused) {
        var fullscreenPlay = video.play();
        if (fullscreenPlay && typeof fullscreenPlay.catch === "function") {
          fullscreenPlay.catch(function () {});
        }
      }

      var enter = wrap.requestFullscreen || wrap.webkitRequestFullscreen;
      if (enter) {
        enter.call(wrap);
      } else if (typeof video.webkitEnterFullscreen === "function") {
        video.webkitEnterFullscreen();
      }
    });

    function syncFullscreenButton() {
      var isFull = fullscreenElement() === wrap;
      fullscreenButton.innerHTML = isFull ? EXIT_FULLSCREEN_ICON : ENTER_FULLSCREEN_ICON;
      fullscreenButton.setAttribute(
        "aria-label",
        isFull ? "Exit fullscreen" : "Enter fullscreen"
      );
    }

    document.addEventListener("fullscreenchange", syncFullscreenButton);
    document.addEventListener("webkitfullscreenchange", syncFullscreenButton);
    document.addEventListener("fullscreenchange", updateEndPoster);
    document.addEventListener("webkitfullscreenchange", updateEndPoster);

    lockControlsLayout(controls);

    muteButton.addEventListener("click", function () {
      video.muted = !video.muted;
      updateControls();
    });

    function seekFromPointer(event) {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;

      var bounds = progress.getBoundingClientRect();
      var position = Math.min(
        1,
        Math.max(0, (event.clientX - bounds.left) / bounds.width)
      );
      var seekTime = position * video.duration;

      progress.value = seekTime;
      video.currentTime = seekTime;
      updateControls();
    }

    progress.addEventListener("pointerdown", function (event) {
      isScrubbing = true;
      progress.setPointerCapture(event.pointerId);
      seekFromPointer(event);
      event.preventDefault();
    });

    progress.addEventListener("pointermove", function (event) {
      if (!isScrubbing) return;
      seekFromPointer(event);
      event.preventDefault();
    });

    function finishScrubbing(event) {
      if (!isScrubbing) return;
      seekFromPointer(event);
      isScrubbing = false;
      updateControls();
    }

    progress.addEventListener("pointerup", finishScrubbing);
    progress.addEventListener("pointercancel", function () {
      isScrubbing = false;
      updateControls();
    });

    /* Scrub preview, like YouTube: a small frame and the time above the
       timeline while hovering (desktop) or dragging (desktop and phones).
       Without a thumbnail strip for this video, just the time shows.
       Styled inline so an older cached home.css can't break it. */
    var scrubPreview = null;
    var scrubFrame = null;
    var scrubLabel = null;
    var previewInfo = null;

    function previewVideoId() {
      var source = video.getAttribute("src") ||
        video.getAttribute("data-deferred-src") || "";
      var match = source.match(/\/playback\/(\d+)\//);
      return match ? match[1] : null;
    }

    function prepareScrubPreview() {
      loadPreviewManifest().then(function (manifest) {
        var id = previewVideoId();
        previewInfo = id && manifest && manifest[id]
          ? { id: id, sheet: manifest[id] }
          : null;
        if (previewInfo) {
          /* Start fetching the strip now, so it's there by the first move. */
          new Image().src = previewSheetUrl();
        }
      });
    }

    function previewSheetUrl() {
      return PREVIEW_BASE + previewInfo.id + ".jpg?v=" +
        encodeURIComponent(previewInfo.sheet.version || "");
    }

    function showScrubPreview(clientX) {
      var duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;

      if (!scrubPreview) {
        scrubPreview = document.createElement("div");
        scrubPreview.className = "video-scrub-preview";
        scrubPreview.setAttribute("aria-hidden", "true");
        scrubPreview.style.cssText =
          "position:absolute;z-index:4;left:0;bottom:0;display:flex;" +
          "flex-direction:column;align-items:center;gap:4px;margin:0;" +
          "padding:0;pointer-events:none;opacity:0;" +
          "transition:opacity 120ms ease;";
        scrubFrame = document.createElement("div");
        scrubFrame.style.cssText =
          "display:none;background-repeat:no-repeat;background-color:#000;" +
          "border-radius:0;";
        scrubLabel = document.createElement("span");
        scrubLabel.style.cssText =
          "display:block;padding:0;color:#fff;white-space:nowrap;" +
          "text-shadow:0 0 2px rgba(0,0,0,0.9),0 0 6px rgba(0,0,0,0.6);" +
          "font-family:ui-monospace," +
          "\"SFMono-Regular\",Menlo,Monaco,Consolas,\"Liberation Mono\"," +
          "\"Courier New\",monospace;font-size:11px;line-height:1.5;";
        scrubPreview.appendChild(scrubFrame);
        scrubPreview.appendChild(scrubLabel);
        if (window.getComputedStyle(wrap).position === "static") {
          wrap.style.position = "relative";
        }
        wrap.appendChild(scrubPreview);
      }

      var bar = progress.getBoundingClientRect();
      var box = wrap.getBoundingClientRect();
      var position = Math.min(1, Math.max(0, (clientX - bar.left) / bar.width));
      var time = position * duration;

      scrubLabel.textContent = formatTime(time);

      if (previewInfo) {
        var sheet = previewInfo.sheet;
        var fullscreen = !!(document.fullscreenElement ||
          document.webkitFullscreenElement);
        var width = box.width < 600 ? 128 : (fullscreen ? 240 : 180);
        var scale = width / sheet.width;
        var height = sheet.height * scale;
        var frame = Math.min(sheet.count - 1, Math.floor(time / sheet.interval));
        var column = frame % sheet.columns;
        var row = Math.floor(frame / sheet.columns);

        scrubFrame.style.display = "block";
        scrubFrame.style.width = width + "px";
        scrubFrame.style.height = height + "px";
        scrubFrame.style.backgroundImage = 'url("' + previewSheetUrl() + '")';
        scrubFrame.style.backgroundSize =
          sheet.columns * width + "px auto";
        scrubFrame.style.backgroundPosition =
          -column * width + "px " + -row * height + "px";
      } else {
        scrubFrame.style.display = "none";
      }

      var previewWidth = scrubPreview.offsetWidth;
      var left = clientX - box.left - previewWidth / 2;
      left = Math.max(0, Math.min(box.width - previewWidth, left));
      scrubPreview.style.left = left + "px";
      scrubPreview.style.bottom = box.bottom - bar.top + 8 + "px";
      scrubPreview.style.opacity = "1";
    }

    function hideScrubPreview() {
      if (scrubPreview) scrubPreview.style.opacity = "0";
    }

    progress.addEventListener("pointerenter", prepareScrubPreview);
    progress.addEventListener("pointerdown", function (event) {
      prepareScrubPreview();
      showScrubPreview(event.clientX);
    });
    progress.addEventListener("pointermove", function (event) {
      if (isScrubbing || event.pointerType === "mouse") {
        showScrubPreview(event.clientX);
      }
    });
    progress.addEventListener("pointerup", function (event) {
      if (event.pointerType !== "mouse") hideScrubPreview();
    });
    progress.addEventListener("pointercancel", hideScrubPreview);
    progress.addEventListener("pointerleave", function () {
      if (!isScrubbing) hideScrubPreview();
    });

    /* Preserve keyboard seeking for the native range control. */
    progress.addEventListener("input", function () {
      if (isScrubbing) return;
      if (Number.isFinite(video.duration)) {
        video.currentTime = Number(progress.value);
      }
      updateControls();
    });

    video.addEventListener("loadedmetadata", function () {
      setVideoRatio();
      updateControls();
    });
    video.addEventListener("timeupdate", updateControls);
    video.addEventListener("durationchange", updateControls);
    video.addEventListener("volumechange", updateControls);
    video.addEventListener("pause", updateControls);
    /* The first time a project is watched, its video plays round once
       more by itself; after that it stops on Replay rather than looping
       for ever. Opening the project again resets this. */
    if (video._elliotLoopsLeft === undefined) video._elliotLoopsLeft = 1;
    video.addEventListener("ended", function () {
      if (!video._elliotLoopsLeft) return;
      video._elliotLoopsLeft -= 1;
      video.currentTime = 0;
      var again = video.play();
      if (again && typeof again.catch === "function") {
        again.catch(function () {
          video._elliotLoopsLeft = 0;
          updateControls();
        });
      }
    });
    video.addEventListener("ended", updateControls);

   /* Remember the video last played or touched, for keyboard seeking. */
   wrap.addEventListener("pointerdown", function () {
     lastActiveVideo = video;
   });

   video.addEventListener("play", function () {
     lastActiveVideo = video;
 document.querySelectorAll(
        '[id="X1134136285"] video.project-video'
      ).forEach(function (otherVideo) {
        if (otherVideo !== video) otherVideo.pause();
      });
     if (animationFrame === null) {
       animateProgress();
     }
     refreshVideoFrame();
   });
   video.addEventListener("playing", refreshVideoFrame);
   video.addEventListener("playing", function () {
     if (typeof video.requestVideoFrameCallback === "function") {
       video.requestVideoFrameCallback(function () {
         refreshVideoFrame();
       });
     } else {
       window.setTimeout(refreshVideoFrame, 80);
     }
   });

    setVideoRatio();
    updateControls();
  });

  /* Autoplay the first video of a project as it opens. Called straight
     from the click/tap that opens it, because browsers (iPhones especially)
     only allow playback with sound inside a user gesture; the details
     "toggle" event fires too late to count. If the browser still blocks
     it, the video just waits paused for a tap, as before. */
  function autoplayProject(project, allowMuted) {
    var video = project.querySelector("video.project-video");
    if (video && typeof video._elliotAutoplay === "function") {
      video._elliotAutoplay(allowMuted);
    }
  }

  /* The projects currently listed (the type filter hides the others). */
  function allProjects() {
    return Array.prototype.slice.call(
      document.querySelectorAll('[id="X1134136285"] details.project-item')
    ).filter(function (project) { return !project.hidden; });
  }

  /* Open a project (closing the others), start it and scroll to it. */
  function goToProject(target, allowMuted) {
    if (target.hidden) setProjectFilter("All");
    if (page && page.classList.contains("is-sheet-view")) setProjectView("list");
    allProjects().forEach(function (project) {
      if (project !== target) project.open = false;
    });
    target.open = true;
    autoplayProject(target, allowMuted);

    window.requestAnimationFrame(function () {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* Move to the next (1) or previous (-1) project from the open one.
     allowMuted: start muted if the browser won't allow sound (iPhones
     don't count a swipe as a tap). */
  function stepProject(step, allowMuted) {
    var projects = allProjects();
    var current = -1;
    for (var i = 0; i < projects.length; i++) {
      if (projects[i].open) current = i;
    }
    if (current < 0 || projects.length < 2) return null;
    var target = projects[(current + step + projects.length) % projects.length];
    goToProject(target, allowMuted);
    return target;
  }

  /* Multi-video projects: when a swipe settles on another video, play it
     (and the play handler pauses the one before), like a slideshow. */
  document.querySelectorAll('[id="X1134136285"] .project-carousel')
    .forEach(function (carousel) {
      var slides = carousel.querySelectorAll(".project-slide");
      if (slides.length < 2) return;

      var settleTimer = null;
      var currentSlide = 0;

      function slideInView() {
        var best = 0;
        var bestDistance = Infinity;
        var left = carousel.getBoundingClientRect().left;
        for (var i = 0; i < slides.length; i++) {
          var distance = Math.abs(slides[i].getBoundingClientRect().left - left);
          if (distance < bestDistance) {
            best = i;
            bestDistance = distance;
          }
        }
        return best;
      }

      carousel.addEventListener("scroll", function () {
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(function () {
          var project = carousel.closest("details.project-item");
          var index = slideInView();
          if (!project || !project.open || index === currentSlide) return;
          currentSlide = index;
          var video = slides[index].querySelector("video.project-video");
          if (video && typeof video._elliotAutoplay === "function") {
            video._elliotAutoplay(true);
          }
        }, 160);
      }, { passive: true });

      /* Reopening the project starts again from the first video. */
      carousel.closest("details.project-item").addEventListener("toggle", function () {
        if (!this.open) {
          currentSlide = 0;
          carousel.scrollLeft = 0;
        }
      });
    });

  document.querySelectorAll(
    '[id="X1134136285"] details.project-item'
  ).forEach(function (project) {
   var summary = project.querySelector(":scope > summary");
   if (summary) {
     summary.addEventListener("click", function () {
       /* Clicked while closed = opening. */
       if (!project.open) autoplayProject(project);
     });
   }

   project.addEventListener("toggle", function () {
     hideProjectPreview();

     if (project.open) {
       project.querySelectorAll("video.project-video").forEach(activateVideo);

       window.requestAnimationFrame(function () {
         window.requestAnimationFrame(function () {
           project.querySelectorAll("video.project-video").forEach(function (video) {
             if (typeof video._refreshElliotFrame === "function") {
               video._refreshElliotFrame();
             }
           });
         });
       });
     } else {
       project.querySelectorAll("video").forEach(function (video) {
         video.pause();
         if (video.classList.contains("project-video")) releaseVideo(video);
       });
      }

   });
 });

 /* Keyboard: ← / → go to the previous / next project; F toggles
    fullscreen. Skipping within a video is double-click / double-tap. */
 /* Double-tap / double-click skip. */
 var TAP_SEEK_STEP = 5;

 function keyboardVideo() {
   if (!page) return null;
   if (lastActiveVideo && page.contains(lastActiveVideo) &&
       lastActiveVideo.getAttribute("src")) {
     var project = lastActiveVideo.closest("details.project-item");
     if (!project || project.open) return lastActiveVideo;
   }
   var open = page.querySelector("details.project-item[open] video.project-video[src]");
   return open || null;
 }

 /* Listen on window in the capture phase so this runs before Cargo's own
    arrow-key page navigation, then stop the key reaching it: left/right
    only ever change project here, never change page. */
 if (window._elliotArrowKeys) {
   window.removeEventListener("keydown", window._elliotArrowKeys, true);
 }
 window._elliotArrowKeys = function (event) {
   var isFullscreenKey = event.key === "f" || event.key === "F";
   if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && !isFullscreenKey) return;
   if (event.altKey || event.ctrlKey || event.metaKey) return;
   if (!isFullscreenKey && event.shiftKey) return;

   /* Leave typing fields alone; the progress bar is ours to handle. */
   var target = event.target;
   if (target && target !== document.body) {
     var isProgress = target.classList && target.classList.contains("video-progress");
     if (!isProgress && (target.isContentEditable ||
         /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
   }

   /* F: toggle fullscreen on the current (or open project's) video. */
   if (isFullscreenKey) {
     var fullscreenTarget = keyboardVideo() ||
       (page && page.querySelector("details.project-item[open] video.project-video"));
     var fullscreenWrap = fullscreenTarget && fullscreenTarget.closest(".video-wrap");
     var fullscreenButton = fullscreenWrap &&
       fullscreenWrap.querySelector(".video-fullscreen-toggle");
     if (!fullscreenButton) return;
     event.preventDefault();
     event.stopImmediatePropagation();
     fullscreenButton.click();
     return;
   }

   event.preventDefault();
   event.stopImmediatePropagation();
   if (event.repeat) return; /* holding the key down shouldn't race through */

   var wasFullscreen = !!(document.fullscreenElement ||
     document.webkitFullscreenElement);
   var target = stepProject(event.key === "ArrowRight" ? 1 : -1);

   /* In fullscreen, move fullscreen to the new project's video: leave
      it first (otherwise fullscreens stack up and F only undoes one). */
   var wrap = target && wasFullscreen && target.querySelector(".video-wrap");
   if (wrap) {
     var enter = function () {
       var request = wrap.requestFullscreen || wrap.webkitRequestFullscreen;
       if (!request) return;
       var entering = request.call(wrap);
       if (entering && typeof entering.catch === "function") {
         entering.catch(function () {});
       }
     };
     var exit = document.exitFullscreen || document.webkitExitFullscreen;
     var leaving = exit && exit.call(document);
     if (leaving && typeof leaving.then === "function") {
       leaving.then(enter, enter);
     } else {
       window.setTimeout(enter, 100);
     }
   }
 };
 window.addEventListener("keydown", window._elliotArrowKeys, true);

 /* Desktop-only previous/next navigation: a thin chevron either side of
    the page, fixed to the screen while a project is open, so it can be
    clicked from anywhere on the page. Phones don't get it (too busy).
    Styled inline so an older cached home.css can't change it. */
 if (page) {
   var projects = Array.prototype.slice.call(
     page.querySelectorAll("details.project-item")
   );

   /* Cargo can retain generated markup while discarding its listeners.
      Always rebuild navigation so every button receives a live handler. */
   document.querySelectorAll(".project-navigation").forEach(function (navigation) {
     navigation.remove();
   });

   function projectTitle(project) {
     var title = project.querySelector(".project-title-text");
     return title ? title.textContent.trim() : "Project";
   }

   function openProject() {
     for (var i = 0; i < projects.length; i++) {
       if (projects[i].open) return i;
     }
     return -1;
   }

   function isPhone() {
     return !!page.closest(".mobile") ||
       window.matchMedia(PHONE_QUERY).matches;
   }

   var CHEVRON_PATHS = {
     previous: "M16 2 2 18l14 16",
     next: "M2 2l14 16L2 34"
   };

   function makeProjectLink(direction) {
     var button = document.createElement("button");
     var isPrevious = direction === "previous";

     button.type = "button";
     button.className = "project-navigation-link project-navigation-" + direction;
     button.innerHTML =
       '<svg width="18" height="36" viewBox="0 0 18 36" fill="none" ' +
       'stroke="currentColor" stroke-width="1.25" aria-hidden="true" ' +
       'style="display:block"><path d="' + CHEVRON_PATHS[direction] +
       '"/></svg>';
     button.style.cssText =
       "position:fixed;top:50%;z-index:20;display:block;margin:0;" +
       "padding:14px;border:0;border-radius:0;background:transparent;" +
       "line-height:0;cursor:pointer;opacity:0;pointer-events:none;" +
       "transition:opacity 300ms ease, color 500ms ease;" +
       "-webkit-tap-highlight-color:transparent;" +
       (isPrevious ? "transform:translate(-50%,-50%);"
                   : "transform:translate(50%,-50%);");

     button.addEventListener("mouseenter", function () {
       button._elliotHover = true;
       updateNavigation();
     });
     button.addEventListener("mouseleave", function () {
       button._elliotHover = false;
       updateNavigation();
     });

     button.addEventListener("click", function (event) {
       event.preventDefault();
       event.stopPropagation();

       stepProject(isPrevious ? -1 : 1);
     });

     return button;
   }

   var navigation = document.createElement("nav");
   navigation.className = "project-navigation";
   navigation.setAttribute("aria-label", "Project navigation");
   navigation.style.cssText = "display:contents;";
   var previousButton = makeProjectLink("previous");
   var nextButton = makeProjectLink("next");
   navigation.appendChild(previousButton);
   navigation.appendChild(nextButton);

   /* Centre each chevron in the empty space beside the project column,
      and show them only while a project is open. */
   function updateNavigation() {
     var listed = allProjects();
     var current = -1;
     for (var i = 0; listed.length > 1 && i < listed.length; i++) {
       if (listed[i].open) current = i;
     }
     var show = current >= 0 && !isPhone();
     var accordion = page.querySelector(".project-accordion") || page;
     var rect = accordion.getBoundingClientRect();
     var viewportWidth = document.documentElement.clientWidth;
     var light = page.classList.contains("is-light-theme");

     previousButton.style.left = rect.left / 2 + "px";
     nextButton.style.right = (viewportWidth - rect.right) / 2 + "px";

     [previousButton, nextButton].forEach(function (button) {
       button.style.opacity = show ? "1" : "0";
       button.style.pointerEvents = show ? "auto" : "none";
       button.tabIndex = show ? 0 : -1;
       button.style.color = button._elliotHover
         ? "#8f8f8f"
         : (light ? "#000000" : "#ffffff");
     });

     if (current >= 0) {
       var count = listed.length;
       previousButton.setAttribute("aria-label", "Previous project, " +
         projectTitle(listed[(current - 1 + count) % count]));
       nextButton.setAttribute("aria-label", "Next project, " +
         projectTitle(listed[(current + 1) % count]));
     }
   }

   /* Links to a project: elliot.onl/projects#bladee-blondie opens it.
      The address bar follows the open project, so it can be copied. */
   function projectForHash() {
     var slug = decodeURIComponent(window.location.hash.slice(1));
     if (!slug) return null;
     for (var i = 0; i < projects.length; i++) {
       if (projects[i].getAttribute("data-slug") === slug) return projects[i];
     }
     return null;
   }

   function syncHash() {
     if (!window.history || !window.history.replaceState) return;
     var current = openProject();
     var hash = current >= 0
       ? "#" + projects[current].getAttribute("data-slug")
       : "";
     if (window.location.hash === hash) return;
     if (!hash && !projectForHash()) return; /* leave other hashes alone */
     window.history.replaceState(
       window.history.state, "",
       window.location.pathname + window.location.search + hash
     );
   }

   function openFromHash() {
     var target = projectForHash();
     if (target && !target.open) goToProject(target, true);
   }

   projects.forEach(function (project) {
     project.addEventListener("toggle", syncHash);
   });
   window.addEventListener("hashchange", openFromHash);
   openFromHash();

   if (projects.length > 1) {
     document.body.appendChild(navigation);
     projects.forEach(function (project) {
       project.addEventListener("toggle", updateNavigation);
     });
     window.addEventListener("resize", updateNavigation);
     new MutationObserver(updateNavigation)
       .observe(page, { attributes: true, attributeFilter: ["class"] });
     updateNavigation();

     /* The chevrons live on <body> (so nothing on the page can stop them
        staying fixed); take them away if Cargo swaps this page out. */
     var pageWatch = new MutationObserver(function () {
       if (document.contains(page)) return;
       navigation.remove();
       pageWatch.disconnect();
     });
     pageWatch.observe(document.body, { childList: true, subtree: true });
   }
 }
})();
