(function () {
  /* Where "← Index" on the contact page leads. */
  var INDEX_URL = "/projects";

  /* Only set the address; Cargo's own navigation handles the click, which
     switches pages without the full-reload loading screen. */
  document.querySelectorAll(".contact-page .contact-nav-link").forEach(function (link) {
    link.setAttribute("href", INDEX_URL);
  });
})();
