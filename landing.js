(function () {

  /* Stop left/right arrow keys triggering Cargo's page-to-page navigation.
     Shares one handler slot with the project list, which swaps in its own
     (video skipping) when it loads. */
  if (window._elliotArrowKeys) {
    window.removeEventListener("keydown", window._elliotArrowKeys, true);
  }
  window._elliotArrowKeys = function (event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    var target = event.target;
    if (target && (target.isContentEditable ||
        /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  window.addEventListener("keydown", window._elliotArrowKeys, true);
  /* The homepage is now the project list itself, with the reel playing
     behind it on desktop, so everyone goes straight to /projects (once
     Projects is set as the homepage in Cargo, this page isn't shown at
     all). replace() keeps the back button from bouncing back here.
     Everything below is the old full-screen landing, kept in case it's
     wanted again: delete this block to bring it back. */
  window.location.replace("/projects");
  return;

  /* Change these to swap the landing video or where its links lead. */
  var LANDING = {
    video: "https://player.vimeo.com/progressive_redirect/playback/1071786882/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=bb427ec363ba3c6895452e43799399e366b81c94201c7b7d02769f76461fe59d",
    /* Smaller file for phones: starts much sooner on mobile data. */
    mobileVideo: "https://player.vimeo.com/progressive_redirect/playback/1071786882/rendition/720p/file.mp4%20%28720p%29.mp4?loc=external&log_user=0&signature=0c0894255b1ccc728a1be1eeb017060c52311c6a5133eceda6ad94aa42e9bd59",
    poster: "",
    indexUrl: "/projects"
  };

  /* Styles ship inside this script so a cached stylesheet can never be out
     of step with it. */
  var STYLES = "/* Landing page: full-screen muted video with the name top-left and an\n   Index link bottom-left, pinned to the screen edges. */\n\nbody:has(.landing-root) {\n  background: #000000 !important;\n  overflow: hidden;\n}\n\n.landing-root .landing-stage {\n  position: fixed;\n  z-index: 10;\n  inset: 0;\n  background: #000000;\n  cursor: pointer;\n}\n\n.landing-root .landing-video {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  pointer-events: none;\n}\n\n/* Dim so the white type stays legible over bright footage */\n.landing-root .landing-stage::after {\n  position: absolute;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.4);\n  content: \"\";\n  pointer-events: none;\n}\n\n.landing-root .landing-overlay {\n  position: fixed;\n  z-index: 11;\n  inset: 0;\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  padding: 1.5rem 2rem;\n  pointer-events: none;\n}\n\n.landing-root .landing-overlay,\n.landing-root .landing-overlay * {\n  color: #ffffff !important;\n  font-family: ui-monospace, \"SFMono-Regular\", Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace !important;\n  font-size: 11px !important;\n  font-weight: 400 !important;\n  line-height: 1.65 !important;\n  letter-spacing: 0 !important;\n}\n\n.landing-root .landing-nav {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 2rem;\n}\n\n/* Links: strip Cargo's underline, fade to grey on hover like the index */\n.landing-root .landing-overlay a,\n.landing-root .landing-overlay a:hover,\n.landing-root .landing-overlay a:active {\n  border: 0 !important;\n  opacity: 1 !important;\n  text-decoration: none !important;\n  pointer-events: auto;\n  transition: color 500ms ease;\n}\n\n.landing-root .landing-overlay a:hover,\n.landing-root .landing-overlay a:hover * {\n  color: #8f8f8f !important;\n}\n\n.landing-root .landing-enter {\n  display: inline-flex;\n  gap: 0.6ch;\n  align-self: flex-start;\n}\n\n@media (max-width: 767px) {\n  .landing-root .landing-overlay {\n    padding: 1.25rem;\n  }\n}\n\n.mobile .landing-root .landing-overlay {\n  padding: 1.25rem;\n}\n\n/* Backup: never draw caption text over the reel */\n.landing-root .landing-video::cue {\n  visibility: hidden;\n  color: transparent;\n  background: transparent;\n}\n\n.landing-root .landing-video::-webkit-media-text-track-container {\n  display: none !important;\n}\n";

  var style = document.getElementById("landing-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "landing-styles";
    document.head.appendChild(style);
  }
  style.textContent = STYLES;

  /* Fetch the project list's styling and script in the background so
     clicking through doesn't wait on them. */
  ["https://elh0.github.io/elliot_portfolio/home.css",
   "https://elh0.github.io/elliot_portfolio/home.js"].forEach(function (href) {
    if (document.querySelector('link[rel="prefetch"][href="' + href + '"]')) return;
    var hint = document.createElement("link");
    hint.rel = "prefetch";
    hint.href = href;
    document.head.appendChild(hint);
  });

  /* The index plays the same reel as an intro; skip it after the landing page. */
  try {
    window.sessionStorage.setItem("elliotIntroSeen", "1");
  } catch (error) {}

  /* Cargo wraps page content in containers that stop position: fixed from
     covering the screen, so the landing layer lives directly on <body>. */
  document.querySelectorAll(".landing-root").forEach(function (old) {
    old.remove();
  });

  function goTo(url) {
    /* Full page load, so Cargo's in-page navigation can't leave the
       landing layer sitting over the next page. */
    window.location.href = url;
  }

  document.querySelectorAll(".landing").forEach(function (landing) {
    var root = document.createElement("div");
    root.className = "landing-root";

    var stage = document.createElement("div");
    stage.className = "landing-stage";
    stage.setAttribute("aria-hidden", "true");

    /* Use the <video> already in the Cargo HTML if there is one: the browser
       starts downloading it as soon as the page renders, before this script
       arrives. Otherwise create it. */
    var video = landing.querySelector("video.landing-video");
    if (!video) {
      video = document.createElement("video");
      video.className = "landing-video";
      video.src = window.matchMedia("(max-width: 767px), (hover: none) and (pointer: coarse) and (max-height: 500px)").matches && LANDING.mobileVideo
        ? LANDING.mobileVideo
        : LANDING.video;
    }
    if (LANDING.poster && !video.getAttribute("poster")) video.poster = LANDING.poster;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    stage.appendChild(video);

    /* The reel is footage only: switch off any caption track embedded in the
       file, which Safari/iOS otherwise shows when device captions are on. */
    function hideCaptions() {
      for (var i = 0; i < video.textTracks.length; i++) {
        video.textTracks[i].mode = "disabled";
      }
    }
    if (video.textTracks) {
      video.textTracks.addEventListener("addtrack", hideCaptions);
      video.addEventListener("loadedmetadata", hideCaptions);
      hideCaptions();
    }

    /* Clicking anywhere on the footage goes through to the index. */
    stage.addEventListener("click", function () {
      goTo(LANDING.indexUrl);
    });

    var overlay = document.createElement("div");
    overlay.className = "landing-overlay";
    overlay.innerHTML =
      '<nav class="landing-nav" aria-label="Site navigation">' +
        '<div class="landing-name"><div>Elliot Holbrow, Cinematographer</div><div>London, UK</div></div>' +
      '</nav>' +
      '<a class="landing-enter" href="' + LANDING.indexUrl + '">' +
        '<span>Index</span><span class="landing-arrow">→</span>' +
      '</a>';

    overlay.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        goTo(link.getAttribute("href"));
      });
    });

    root.appendChild(stage);
    root.appendChild(overlay);
    document.body.appendChild(root);

    /* If Cargo swaps the page out without a reload, take the layer with it. */
    var observer = new MutationObserver(function () {
      if (!document.body.contains(landing)) {
        video.pause();
        root.remove();
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    /* With no poster set, borrow Vimeo's thumbnail so there's a frame
       on screen before the video starts. */
    var match = !LANDING.poster && !video.getAttribute("poster") &&
      LANDING.video.match(/playback\/(\d+)\//);
    if (match) {
      fetch("https://vimeo.com/api/oembed.json?url=" +
        encodeURIComponent("https://vimeo.com/" + match[1]) + "&maxwidth=1920")
        .then(function (response) {
          if (!response.ok) throw new Error("No thumbnail");
          return response.json();
        })
        .then(function (data) {
          if (!data.thumbnail_url || video.getAttribute("poster")) return;
          var thumbnail = new URL(data.thumbnail_url);
          thumbnail.searchParams.set("mw", "1920");
          thumbnail.searchParams.set("q", "90");
          video.setAttribute("poster", thumbnail.toString());
        })
        .catch(function () {});
    }

    var playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(function () {
        /* Autoplay blocked (e.g. Low Power Mode): the poster still shows. */
      });
    }
  });
})();
