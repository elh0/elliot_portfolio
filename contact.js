(function () {
  /* Where "← Index" on the contact page leads. */
  var INDEX_URL = "/";

  document.querySelectorAll(".contact-page .contact-nav-link").forEach(function (link) {
    link.setAttribute("href", INDEX_URL);
  });
})();
