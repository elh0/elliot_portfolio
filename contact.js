(function () {
  /* Where "← Index" on the contact page leads. */
  var INDEX_URL = "/projects";

  document.querySelectorAll(".contact-page .contact-nav-link").forEach(function (link) {
    link.setAttribute("href", INDEX_URL);

    /* Full page load, so Cargo's in-page navigation can't swallow the click. */
    link.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      window.location.href = INDEX_URL;
    });
  });
})();
