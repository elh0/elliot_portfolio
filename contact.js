(function () {

  /* Load the contact.css this script was written for, in case GitHub Pages
     still has an older copy cached (as home.js does). Bump with changes. */
  var STYLE_VERSION = "2026-10-01-table";
  (function loadMatchingStyles() {
    var script = document.currentScript;
    if (!script || !script.src) return;
    var href = script.src.replace(/[^\/]*$/, "") + "contact.css?v=" + STYLE_VERSION;
    var current = null;
    var ready = false;
    function stylesheets() {
      return Array.prototype.slice.call(
        document.querySelectorAll('link[rel="stylesheet"][href*="contact.css"]')
      );
    }
    /* Cargo re-inserts its plain link each time the page is shown, so keep
       removing it once the matching stylesheet has loaded. */
    function dropStale() {
      if (!ready) return;
      stylesheets().forEach(function (link) {
        if (link !== current && link.href.indexOf("?v=") < 0) link.remove();
      });
    }
    stylesheets().forEach(function (link) {
      if (!current && link.href === href) current = link;
    });
    if (current) {
      ready = true;
    } else {
      current = document.createElement("link");
      current.rel = "stylesheet";
      current.href = href;
      current.addEventListener("load", function () {
        ready = true;
        dropStale();
      });
      document.head.appendChild(current);
    }
    dropStale();
    if (!window["_elliotStyleWatch_contact.css"] && window.MutationObserver) {
      window["_elliotStyleWatch_contact.css"] = true;
      new MutationObserver(function () {
        current = stylesheets().filter(function (link) { return link.href === href; })[0] || current;
        dropStale();
      }).observe(document.documentElement, { childList: true, subtree: true });
    }
  })();

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

  /* Name bar along the top, matching the projects page. */
  document.querySelectorAll(".contact-page .index-heading").forEach(function (heading) {
    if (heading.classList.contains("is-built")) return;
    function el(tag, className, text) {
      var node = document.createElement(tag);
      if (className) node.className = className;
      node.textContent = text;
      return node;
    }
    heading.innerHTML = "";
    heading.appendChild(el("span", "site-name", "Elliot Holbrow"));
    heading.appendChild(el("span", "site-role", "Cinematographer, London"));
    var nav = el("nav", "site-nav", "");
    nav.setAttribute("aria-label", "Site");
    var work = el("a", "", "Work");
    work.href = INDEX_URL;
    var contact = el("a", "is-current", "Contact");
    contact.href = "/contact";
    contact.setAttribute("aria-current", "page");
    nav.appendChild(work);
    nav.appendChild(contact);
    heading.appendChild(nav);
    heading.classList.add("is-built");
  });
})();
