(function () {
 var page = document.querySelector('[id="X1134136285"]');
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

  /* Intro showreel: plays full-screen behind the project list on the first
     load of a visit. The first time someone hovers a project title (desktop)
     or opens a project, it fades out for good and the hover thumbnails take
     over. */
  var BACKGROUND_VIDEO = "https://player.vimeo.com/progressive_redirect/playback/1071786882/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=bb427ec363ba3c6895452e43799399e366b81c94201c7b7d02769f76461fe59d";
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
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    var background = document.createElement("div");
    background.className = "page-background";
    background.setAttribute("aria-hidden", "true");

    backgroundVideo = document.createElement("video");
    backgroundVideo.src = BACKGROUND_VIDEO;
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
     var title = document.createElement("span");
     var isPrevious = direction === "previous";

     button.type = "button";
     button.className = "project-navigation-link project-navigation-" + direction;
     button.setAttribute("aria-label", (isPrevious ? "Previous project, " : "Next project, ") + projectTitle(target));
     directionLine.className = "project-navigation-direction";
     arrow.className = "project-navigation-arrow";
     arrow.textContent = isPrevious ? "←" : "→";
     label.className = "project-navigation-label";
     label.textContent = isPrevious ? "Previous Project" : "Next Project";
     title.className = "project-navigation-title";
     title.textContent = projectTitle(target);

     if (isPrevious) {
       directionLine.appendChild(arrow);
       directionLine.appendChild(label);
     } else {
       directionLine.appendChild(label);
       directionLine.appendChild(arrow);
     }

     button.appendChild(directionLine);
     button.appendChild(title);
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
