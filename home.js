(function () {
 var page = document.querySelector('[id="X1134136285"]');

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
 function renderProjects() {
   var accordion = page && page.querySelector(".project-accordion");
   if (!accordion || accordion.querySelector("details.project-item")) return;

   function el(tag, className, text) {
     var node = document.createElement(tag);
     if (className) node.className = className;
     if (text != null) node.textContent = text;
     return node;
   }

   PROJECTS.forEach(function (project) {
     var details = el("details", "project-item");
     details.setAttribute("name", "elliot-projects");

     var summary = el("summary");
     var title = el("span", "project-title-text", project.title);
     title.setAttribute("data-mobile-category", project.category);
     var leader = el("span", "project-leader");
     leader.setAttribute("aria-hidden", "true");
     summary.appendChild(title);
     summary.appendChild(leader);
     summary.appendChild(el("span", "project-category", project.category));
     details.appendChild(summary);

     var content = el("div", "project-content");
     var carousel = el("div", "project-carousel");

     project.videos.forEach(function (clip) {
       var slide = el("div", "project-slide");
       var wrap = el("div", "video-wrap");
       var stage = el("div", "video-stage is-paused");
       stage.style.setProperty("--video-ratio", clip.ratio);

       var video = el("video", "project-video");
       video.setAttribute("playsinline", "");
       video.setAttribute("preload", "none");
       video.setAttribute("data-deferred-src", clip.src);
       video.setAttribute("data-deferred-poster", clip.poster);
       stage.appendChild(video);

       var controls = el("div", "video-controls");
       controls.appendChild(el("span", "video-time", clip.time));
       var progress = el("input", "video-progress");
       progress.type = "range";
       progress.min = "0";
       progress.max = String(clip.duration);
       progress.step = "0.01";
       progress.value = "0";
       progress.setAttribute("aria-label", "Video progress");
       progress.style.setProperty("--progress", "0%");
       controls.appendChild(progress);
       var mute = el("button", "video-mute-toggle", "Mute");
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

 renderProjects();
 var hoverPreview = null;
  var hoverPreviewImage = null;

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
    button.textContent = "Light";
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
     button.textContent = isLight ? "Dark" : "Light";
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
   try {
     var posterUrl = new URL(source, window.location.href);
     posterUrl.searchParams.set("mw", "2560");
     posterUrl.searchParams.set("q", "100");
     return posterUrl.toString();
   } catch (error) {
     return source;
   }
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
    !window.matchMedia("(max-width: 767px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    var background = document.createElement("div");
    background.className = "page-background";
    background.setAttribute("aria-hidden", "true");

    backgroundVideo = document.createElement("video");
    backgroundVideo.src = window.matchMedia("(max-width: 767px)").matches
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
       stage.style.setProperty(
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
      muteButton.textContent = "Mute";
      controls.appendChild(muteButton);
   }

   setPortfolioTheme(
     page.classList.contains("is-light-theme") ? "light" : "dark"
   );

    function updateControls() {
      var duration = video.duration || 0;
      var hasStarted = !video.paused || video.currentTime > 0;

      /* Before metadata loads, keep the duration written in the markup. */
      if (hasStarted || duration) {
        time.textContent = formatTime(
          hasStarted ? video.currentTime : duration
        );
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
      muteButton.textContent = video.muted ? "Unmute" : "Mute";
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
          playAttempt.catch(function () {
            stage.classList.add("is-paused");
          });
        }
      } else {
        video.pause();
      }
    }

    /* Listen on the stage rather than the video: iOS browsers do not
       reliably dispatch taps to a <video> element without native controls. */
    stage.addEventListener("click", togglePlayback);

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
    video.addEventListener("ended", updateControls);

   video.addEventListener("play", function () {
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

  document.querySelectorAll(
    '[id="X1134136285"] details.project-item'
  ).forEach(function (project) {
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
       });
      }

   });
 });

 /* Desktop-only previous/next navigation. */
 if (page) {
   var projects = Array.prototype.slice.call(
     page.querySelectorAll("details.project-item")
   );

   /* Cargo can retain generated markup while discarding its listeners.
      Always rebuild navigation so every button receives a live handler. */
   page.querySelectorAll(".project-navigation").forEach(function (navigation) {
     navigation.remove();
   });

   function projectTitle(project) {
     var title = project.querySelector(".project-title-text");
     return title ? title.textContent.trim() : "Project";
   }

   function makeProjectLink(direction, target) {
     var button = document.createElement("button");
     var directionLine = document.createElement("span");
     var arrow = document.createElement("span");
     var label = document.createElement("span");
     var isPrevious = direction === "previous";

     button.type = "button";
     button.className = "project-navigation-link project-navigation-" + direction;
     button.setAttribute("aria-label", (isPrevious ? "Previous project, " : "Next project, ") + projectTitle(target));
     directionLine.className = "project-navigation-direction";
     arrow.className = "project-navigation-arrow";
     arrow.textContent = isPrevious ? "←" : "→";
     label.className = "project-navigation-label";
     label.textContent = isPrevious ? "Previous" : "Next";

     if (isPrevious) {
       directionLine.appendChild(arrow);
       directionLine.appendChild(label);
     } else {
       directionLine.appendChild(label);
       directionLine.appendChild(arrow);
     }

     button.appendChild(directionLine);
     button.addEventListener("click", function (event) {
       event.preventDefault();
       event.stopPropagation();

       projects.forEach(function (project) {
         if (project !== target) project.open = false;
       });
       target.open = true;

       window.requestAnimationFrame(function () {
         target.scrollIntoView({ behavior: "smooth", block: "start" });
       });
     });

     return button;
   }

   projects.forEach(function (project, index) {
     var content = project.querySelector(".project-content");
     if (!content || projects.length < 2) return;

     var previous = projects[(index - 1 + projects.length) % projects.length];
     var next = projects[(index + 1) % projects.length];
     var navigation = document.createElement("nav");
     navigation.className = "project-navigation";
     navigation.setAttribute("aria-label", "Project navigation");
     navigation.appendChild(makeProjectLink("previous", previous));
     navigation.appendChild(makeProjectLink("next", next));
     content.appendChild(navigation);
   });
 }
})();
