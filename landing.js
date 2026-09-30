(function () {
  /* Change these to swap the landing video or where it leads. */
  var LANDING = {
    video: "https://player.vimeo.com/progressive_redirect/playback/1040453005/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=d7bb8e0abc51de4abec416624d4363cbd1383cc82939a29cbba1f42927e5d7e6",
    poster: "https://i.vimeocdn.com/video/1963352200-b51179485e9c29a3f35948459b6d7d0589ed682ca53c598383f2cd018546414f-d_1280?region=us&mw=1920&q=90",
    indexUrl: "/index"
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
    video.poster = LANDING.poster;
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

    var playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(function () {
        /* Autoplay blocked (e.g. Low Power Mode): the poster still shows. */
      });
    }
  });
})();
