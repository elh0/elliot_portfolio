(function () {

  /* Load the contact.css this script was written for, in case GitHub Pages
     still has an older copy cached (as home.js does). Bump with changes. */
  var STYLE_VERSION = "2026-10-08-a";
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
    /* Older copies of these styles can also live in Cargo's own CSS (from
       before they moved to GitHub), where removing a link can't reach them.
       Delete just those rules, leaving the rest of Cargo's CSS alone. */
    function dropLegacyRules(rules, owner) {
      for (var r = rules.length - 1; r >= 0; r--) {
        var rule = rules[r];
        if (rule.cssRules && !rule.selectorText) {
          dropLegacyRules(rule.cssRules, rule);
        } else if (rule.selectorText &&
            rule.selectorText.indexOf(".contact-page") >= 0) {
          owner.deleteRule(r);
        }
      }
    }
    function dropStale() {
      if (!ready) return;
      stylesheets().forEach(function (link) {
        if (link !== current && link.href.indexOf("?v=") < 0) link.remove();
      });
      Array.prototype.forEach.call(document.styleSheets, function (sheet) {
        if (sheet.ownerNode === current) return;
        if (sheet.href && sheet.href.indexOf("?v=") >= 0) return;
        var rules;
        try { rules = sheet.cssRules; } catch (error) { return; }
        if (rules) dropLegacyRules(rules, sheet);
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
      new MutationObserver(function (mutations) {
        var styled = mutations.some(function (mutation) {
          return Array.prototype.some.call(mutation.addedNodes, function (node) {
            return node.nodeName === "LINK" || node.nodeName === "STYLE" ||
              mutation.target.nodeName === "STYLE";
          });
        });
        if (!styled) return;
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
  /* ---------------------------------------------------------------------
     The page itself, laid out like the project list: a line with "Contact"
     and the time in London, column headings, numbered rows with dotted
     leaders and an action on the right, then the directors Elliot has
     worked with and their project numbers. Built here from the rows pasted
     into Cargo, so nothing needs re-pasting.
     --------------------------------------------------------------------- */
  var PHONE_QUERY =
    "(max-width: 767px), (hover: none) and (pointer: coarse) and (max-height: 500px)";

  /* Directors and their projects, as numbered on the projects page. Keep in
     step with PROJECTS in home.js (tests/suite.js checks it). */
  var DIRECTORS = [
    ["Claryn Chong", [
      [17, "Swank Mami - MC69", "swank-mami-mc69"],
      [18, "Unflirt - Seasong", "unflirt-seasong"]]],
    ["Dominic Chew", [
      [13, "Adidas ‘Tug of War’", "adidas-tug-of-war"]]],
    ["Erika Kamano", [
      [12, "Xiaoqiao - Lethe", "xiaoqiao-lethe"]]],
    ["Guillaume Lebel", [
      [1, "Polène SS24", "polene-ss24"],
      [5, "Pléi", "plei"]]],
    ["Hannan Hussain", [
      [2, "Adidas ‘Return of the 15’", "adidas-return-of-the-15"]]],
    ["Jess Madavo", [
      [4, "T Magazine", "t-magazine"]]],
    ["Joe Ward", [
      [8, "Bladee - Blondie", "bladee-blondie"]]],
    ["Lydia Garnett", [
      [7, "Playing House", "playing-house"]]],
    ["Tayler Prince-Fraser", [
      [9, "Art of Movement", "art-of-movement"],
      [15, "The North Face", "the-north-face"]]],
    ["Theo Cottle", [
      [14, "CP x Barbour", "cp-x-barbour"]]],
    ["Tom Silvester", [
      [6, "Helinox ‘Zero’ S/S26", "helinox-zero-s-s26"]]],
    ["Uncanny", [
      [3, "Joe James - Papercuts", "joe-james-papercuts"],
      [10, "Oasis x Spotify", "oasis-x-spotify"],
      [11, "Corteiz ‘Lundun’", "corteiz-lundun"],
      [19, "Rotator", "rotator"]]]
  ];

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function pad(number) {
    return String(number).padStart(2, "0");
  }

  /* "14:26 BST", in London whatever the visitor's own time zone. */
  function londonTime() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London", hour: "2-digit", minute: "2-digit",
        hour12: false, timeZoneName: "short"
      }).formatToParts(new Date());
      var get = function (type) {
        for (var i = 0; i < parts.length; i++) {
          if (parts[i].type === type) return parts[i].value;
        }
        return "";
      };
      return { time: get("hour") + ":" + get("minute"), zone: get("timeZoneName") };
    } catch (error) {
      return null;
    }
  }

  document.querySelectorAll(".contact-page").forEach(function (contactPage) {
    var list = contactPage.querySelector(".contact-list");
    if (!list || list.classList.contains("is-built")) return;
    list.classList.add("is-built");
    var phone = window.matchMedia(PHONE_QUERY).matches;

    /* "Contact" on the left, London time on the right */
    var tools = make("div", "contact-tools");
    tools.appendChild(make("span", "contact-tools-title", "Contact"));
    var clock = make("span", "contact-clock");
    tools.appendChild(clock);
    function tick() {
      var now = londonTime();
      if (!now) { clock.textContent = ""; return; }
      clock.innerHTML = "";
      clock.appendChild(document.createTextNode("London "));
      clock.appendChild(make("span", "contact-clock-time", now.time));
      clock.appendChild(document.createTextNode(" " + now.zone));
    }
    tick();
    window.setInterval(tick, 20000);
    list.parentNode.insertBefore(tools, list);

    var heads = make("div", "contact-columns");
    heads.setAttribute("aria-hidden", "true");
    ["No.", "Contact", "Details", ""].forEach(function (label) {
      heads.appendChild(make("span", "", label));
    });
    list.parentNode.insertBefore(heads, list);

    /* Each pasted row gets a number, leaders and its action. */
    list.querySelectorAll(".contact-row").forEach(function (row, index) {
      var label = row.querySelector(".contact-label");
      var value = row.querySelector(".contact-value");
      if (!label || !value) return;
      [label, value].forEach(function (cell) {
        var text = make("span", "cell-text", cell.textContent);
        cell.textContent = "";
        cell.appendChild(text);
      });
      row.insertBefore(make("span", "contact-number", pad(index + 1)), row.firstChild);

      var href = row.getAttribute("href") || "";
      var copyable = !phone && !!navigator.clipboard && /^(mailto|tel):/.test(href) &&
        label.textContent !== "Representation";
      var action = make("span", "contact-action",
        copyable ? "Copy" :
        /^tel:/.test(href) ? "Call" :
        /^mailto:/.test(href) ? "Email" : "Open \u2197");
      row.appendChild(action);

      /* Desktop: email and phone copy to the clipboard instead of opening
         an app, and say so. */
      if (copyable) {
        row.addEventListener("click", function (event) {
          event.preventDefault();
          navigator.clipboard.writeText(value.textContent.trim()).then(function () {
            action.textContent = "Copied";
            row.classList.add("is-copied");
            window.clearTimeout(row._copiedTimer);
            row._copiedTimer = window.setTimeout(function () {
              action.textContent = "Copy";
              row.classList.remove("is-copied");
            }, 1800);
          });
        });
      }
    });

    /* Directors, each running to the numbers of their projects */
    var section = make("div", "contact-directors");
    var dirHeads = make("div", "contact-columns");
    dirHeads.setAttribute("aria-hidden", "true");
    ["", "Directors", "Projects", "No."].forEach(function (label) {
      dirHeads.appendChild(make("span", "", label));
    });
    section.appendChild(dirHeads);
    DIRECTORS.forEach(function (director, index) {
      var row = make("div", "contact-row contact-director");
      row.appendChild(make("span", "contact-number", String.fromCharCode(65 + index)));
      var name = make("span", "contact-label");
      name.appendChild(make("span", "cell-text", director[0]));
      row.appendChild(name);
      var titles = make("span", "contact-value");
      titles.appendChild(make("span", "cell-text", director[1].map(function (project) {
        return project[1];
      }).join(", ")));
      row.appendChild(titles);
      var numbers = make("span", "contact-action");
      director[1].forEach(function (project, i) {
        if (i) numbers.appendChild(document.createTextNode(" "));
        var link = make("a", "contact-project", pad(project[0]));
        link.href = INDEX_URL + "#" + project[2];
        link.setAttribute("aria-label", "Open " + project[1]);
        numbers.appendChild(link);
      });
      row.appendChild(numbers);
      section.appendChild(row);
    });
    list.parentNode.insertBefore(section, list.nextSibling);

    /* Footer, as on the projects page */
    var footer = make("div", "contact-footer");
    var represented = make("span", "");
    represented.appendChild(make("span", "contact-footer-label", "Represented by "));
    var agent = make("a", "", "Polly Hartley, UTA");
    agent.href = "mailto:polly.hartley@unitedtalent.com";
    represented.appendChild(agent);
    footer.appendChild(represented);
    footer.appendChild(make("span", "", "\u00a9 " + new Date().getFullYear() + " Elliot Holbrow"));
    section.parentNode.insertBefore(footer, section.nextSibling);
  });
})();
