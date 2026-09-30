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
  /* Where "← Index" on the contact page leads. */
  var INDEX_URL = "/projects";

  /* Only set the address; Cargo's own navigation handles the click, which
     switches pages without the full-reload loading screen. */
  document.querySelectorAll(".contact-page .contact-nav-link").forEach(function (link) {
    link.setAttribute("href", INDEX_URL);
  });
})();
