(function () {
  /* Change these to swap the landing video or where it leads. */
  var LANDING = {
    video: "https://player.vimeo.com/progressive_redirect/playback/1071786882/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=bb427ec363ba3c6895452e43799399e366b81c94201c7b7d02769f76461fe59d",
    poster: "",
    indexUrl: "/home"
  };

  document.querySelectorAll(".landing").forEach(function (landing) {
    /* Cargo can re-run page scripts; rebuild from scratch each time. */
    landing.innerHTML = "";

    var link = document.createElement("a");
    link.className = "landing-link";
    link.href = LANDING.indexUrl;
    link.setAttribute("aria-label", "Enter the index");

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
    video.setAttribute("aria-hidden", "true");

    var overlay = document.createElement("div");
    overlay.className = "landing-overlay";
    overlay.innerHTML =
      '<div class="landing-heading">Elliot Holbrow, Cinematographer<br>London, UK</div>' +
      '<div class="landing-enter"><span>Index</span><span class="landing-arrow">→</span></div>';

    link.appendChild(video);
    link.appendChild(overlay);
    landing.appendChild(link);

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
