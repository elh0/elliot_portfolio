(function () {
  /* Change these to swap the landing video or where its links lead. */
  var LANDING = {
    video: "https://player.vimeo.com/progressive_redirect/playback/1071786882/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=bb427ec363ba3c6895452e43799399e366b81c94201c7b7d02769f76461fe59d",
    poster: "",
    indexUrl: "/projects"
  };

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

    var video = document.createElement("video");
    video.className = "landing-video";
    video.src = LANDING.video;
    if (LANDING.poster) video.poster = LANDING.poster;
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

    /* Clicking anywhere on the footage goes through to the index. */
    stage.addEventListener("click", function () {
      goTo(LANDING.indexUrl);
    });

    var overlay = document.createElement("div");
    overlay.className = "landing-overlay";
    overlay.innerHTML =
      '<nav class="landing-nav" aria-label="Site navigation">' +
        '<div class="landing-name">Elliot Holbrow, Cinematographer<br>London, UK</div>' +
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
    var match = !LANDING.poster && LANDING.video.match(/playback\/(\d+)\//);
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
