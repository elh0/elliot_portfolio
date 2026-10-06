(function () {

  /* Where signed releases are emailed (through FormSubmit, which emails a
     confirmation link the first time), and this page's own address, which
     the signer is sent back to afterwards. */
  var EMAIL = "elliotholbrow@gmail.com";
  var PAGE = "https://www.elliot.onl/release";

  /* Bump when the wording of a release changes, so each signed copy says
     which version was agreed to. */
  var TERMS_VERSION = {
    person: "person-release v1.1 (2026-10-06, elliot.onl)",
    location: "location-release v1.1 (2026-10-06, elliot.onl)"
  };

  /* Load the release.css this script was written for, in case GitHub Pages
     still has an older copy cached (as contact.js does). Bump with changes. */
  var STYLE_VERSION = "2026-10-06-c";
  (function loadMatchingStyles() {
    var script = document.currentScript;
    if (!script || !script.src) return;
    var href = script.src.replace(/[^\/]*$/, "") + "release.css?v=" + STYLE_VERSION;
    var links = document.querySelectorAll('link[rel="stylesheet"][href*="release.css"]');
    for (var i = 0; i < links.length; i++) {
      if (links[i].href === href) return;
    }
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.addEventListener("load", function () {
      Array.prototype.forEach.call(links, function (old) { old.remove(); });
    });
    document.head.appendChild(link);
  })();

  /* Stop left/right arrow keys triggering Cargo's page-to-page navigation
     (typing in a field is left alone). */
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

  var INDEX_URL = "/projects";
  var PHONE_QUERY =
    "(max-width: 767px), (hover: none) and (pointer: coarse) and (max-height: 500px)";

  /* ---------------------------------------------------------------------
     The two releases. Shoot details come pre-filled from the link, e.g.
     /release?type=person&date=10 Oct 2026&place=Brecon Beacons&what=...
     --------------------------------------------------------------------- */
  var FORMS = {
    person: {
      title: "Person release",
      intro: "Permission to film you and sell the footage as stock. Please read it all, and ask anything before you sign.",
      sections: [
        ["The shoot", [
          { name: "shoot_date", label: "Date", query: "date" },
          { name: "shoot_place", label: "Place", query: "place" },
          { name: "shoot_what", label: "What we filmed", query: "what" }]],
        ["You", [
          { name: "name", label: "Full name", auto: "name", placeholder: "Your full name", required: true },
          { name: "address", label: "Address", auto: "street-address", placeholder: "Street, town, postcode", required: true },
          { name: "email", label: "Email", type: "email", auto: "email", placeholder: "you@example.com", required: true },
          { name: "age", label: "Age", choices: ["18 or over", "Under 18"], required: true },
          { name: "photo", label: "Photo", photo: true, note: "Optional: a photo of you, to match this release to the footage" },
          { name: "guardian_name", label: "Parent or guardian", placeholder: "Their full name", guardian: true },
          { name: "guardian_relationship", label: "Relationship", placeholder: "Mother, father\u2026", guardian: true }]]
      ],
      inReturn: "A copy of the clips you're in, for your own use.",
      terms: [
        ["Permission", "You let Elliot Holbrow (“we”) film, photograph and record you on the shoot above. We call what we make “the footage”."],
        ["Stock use", "We can license the footage through stock agencies, including Film Supply, and they can license it to their customers. All of them can use, copy, edit and combine it with other pictures, words and sound, in any media, worldwide, with no end date, including in adverts and other commercial work."],
        ["Any subject", "The footage may be used to illustrate any subject or product, and you may be shown as a character. You won't be named unless you agree in writing. We won't license it for any use that is pornographic, defamatory or unlawful."],
        ["No approval", "You won't approve each use, and no payment is due."],
        ["No claims", "You won't bring a claim against us, the agencies or their customers for any use this form allows, including claims about privacy or the use of your image."],
        ["Ownership", "We own the copyright in the footage."],
        ["Changing your mind", "Buyers rely on this permission, so it can't be withdrawn once a clip is licensed. If you change your mind before we upload, tell us and we'll leave you out where we can."],
        ["Your details", "We keep this form privately, as proof of permission, and only share it with an agency or customer who needs to check it. Ask us at " + EMAIL + " to see what we hold."],
        ["Free to agree", "You've read this, you're 18 or over (or a parent or guardian is signing), and no agency or union contract stops you agreeing."],
        ["Law", "The law of England and Wales applies."]
      ]
    },
    location: {
      title: "Location release",
      intro: "Permission to film a property and sell the footage as stock. Please read it all, and ask anything before you sign.",
      sections: [
        ["The place", [
          { name: "place_name", label: "Name of place", query: "place" },
          { name: "place_address", label: "Address", query: "address" },
          { name: "place_what", label: "What we can film", query: "what" },
          { name: "place_dates", label: "Dates and times", query: "date" }]],
        ["You", [
          { name: "name", label: "Full name", auto: "name", placeholder: "Your full name", required: true },
          { name: "role", label: "Role", placeholder: "Owner, manager…", required: true },
          { name: "email", label: "Email", type: "email", auto: "email", placeholder: "you@example.com", required: true },
          { name: "photo", label: "Photo of the place", photo: true, note: "Optional: e.g. the entrance or a sign" }]]
      ],
      inReturn: "A copy of the clips filmed there, for your own use.",
      terms: [
        ["Permission", "You let Elliot Holbrow (“we”) come onto the place with our kit and anyone we bring, and film, photograph and record it. We call what we make “the footage”."],
        ["Stock use", "We can license the footage through stock agencies, including Film Supply, and they can license it to their customers, to use, edit and combine in any media, worldwide, with no end date, including in adverts."],
        ["Not named", "We won't name the place or you unless you agree. Buyers may use it to stand in for somewhere else."],
        ["Care", "We'll follow your reasonable rules, leave it as we found it, keep signs, logos and artwork out of shot, and put right any damage we cause."],
        ["No approval, no claims", "You won't approve each use, no payment is due, and you won't bring a claim for any use this form allows."],
        ["Authority", "You own or manage the place and can give this permission."],
        ["Law", "The law of England and Wales applies."]
      ]
    }
  };

  var EXPLAINER = [
    ["What it is", "Short clips that other filmmakers license when they need a shot they can't film themselves."],
    ["Where it goes", "Film Supply, a curated library of cinematic footage. It's the only place these clips are sold."],
    ["Who buys it", "Directors, editors, ad agencies, production companies and brands."],
    ["What it's used for", "Adverts, films, documentaries, TV, music videos, websites and social media. It can illustrate any subject or product, so you could turn up in an advert for something we've never heard of. Only agree if you're comfortable with that."],
    ["What it isn't", "You won't be named. We won't license footage for anything pornographic, defamatory or unlawful."],
    ["How long", "Worldwide, with no end date. Once a clip is licensed it can't be recalled."],
    ["Saying no", "Completely fine. We can keep you small in frame, film you from behind, or leave you out."],
    ["Questions", EMAIL]
  ];

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function pad(number) {
    return (number < 10 ? "0" : "") + number;
  }

  function labelCell(text) {
    var label = make("span", "release-label");
    label.appendChild(make("span", "release-label-text", text));
    return label;
  }

  /* Lettered rows of words: the terms, and the explainer */
  function wordRows(parent, rows) {
    rows.forEach(function (row, index) {
      var line = make("div", "release-row release-term");
      line.appendChild(make("span", "release-number", String.fromCharCode(65 + index)));
      line.appendChild(labelCell(row[0]));
      line.appendChild(make("span", "release-term-text", row[1]));
      parent.appendChild(line);
    });
  }

  function columns(parent, first, second) {
    var heads = make("div", "release-columns");
    heads.setAttribute("aria-hidden", "true");
    [first, second, ""].forEach(function (label) {
      heads.appendChild(make("span", "", label));
    });
    parent.appendChild(heads);
  }

  /* ---------------------------------------------------------------------
     The signed copy: a plain A4 PDF made here in the browser (Courier, the
     full wording, the details, the photo and the signature), attached to
     the email and offered to the signer to save.
     --------------------------------------------------------------------- */
  var WIN_ANSI = { 8216: 145, 8217: 146, 8220: 147, 8221: 148, 8226: 149, 8211: 150, 8212: 151, 8230: 133, 8364: 128 };

  /* PDF string bytes (Windows-1252), with ( ) \ escaped */
  function pdfString(text) {
    var out = "";
    for (var i = 0; i < text.length; i++) {
      var code = text.charCodeAt(i);
      var ch = code < 256 ? text.charAt(i) : WIN_ANSI[code] ? String.fromCharCode(WIN_ANSI[code]) : "?";
      if (ch === "(" || ch === ")" || ch === "\\") ch = "\\" + ch;
      out += ch;
    }
    return "(" + out + ")";
  }

  function wrapText(text, width) {
    var lines = [];
    String(text).split("\n").forEach(function (paragraph) {
      var line = "";
      paragraph.split(" ").forEach(function (word) {
        while (word.length > width) {
          if (line) { lines.push(line); line = ""; }
          lines.push(word.slice(0, width));
          word = word.slice(width);
        }
        if (!line) line = word;
        else if (line.length + 1 + word.length <= width) line += " " + word;
        else { lines.push(line); line = word; }
      });
      lines.push(line);
    });
    return lines;
  }

  function dataUrlBytes(dataUrl) {
    var binary = atob(dataUrl.split(",")[1]);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  /* doc: { title, subtitle, sections: [[heading, [[label, value]], photo?]],
     paragraphs: [[heading, text]], terms: [[name, text]], signature,
     signedLines: [[label, value]], footer }. Images are { bytes, width, height } JPEGs. */
  function makePdf(doc) {
    var W = 595.28, H = 841.89, M = 42, SIZE = 8.5, LEAD = 11.2, CHAR = SIZE * 0.6;
    var COLS = Math.floor((W - 2 * M) / CHAR);
    var KEY = 22;
    var pages = [];
    var ops, y;
    function newPage() { ops = []; pages.push(ops); y = H - M; }
    function need(height) { if (y - height < M + 20) newPage(); }
    function put(x, text, bold, grey, size) {
      ops.push((grey ? "0.45 g" : "0 g") + " BT /" + (bold ? "F2 " : "F1 ") + (size || SIZE) +
        " Tf " + x.toFixed(2) + " " + y.toFixed(2) + " Td " + pdfString(text) + " Tj ET");
    }
    function line(x, text, bold, grey, size) { need(LEAD); y -= LEAD; put(x, text, bold, grey, size); }
    function gap(lines) { y -= LEAD * (lines || 1); }
    function heading(text) { gap(); need(LEAD * 3); line(M, text.toUpperCase(), true); gap(0.3); }
    function pairs(rows, cols) {
      rows.forEach(function (row) {
        var lines = wrapText(row[1] || "-", cols - KEY);
        need(LEAD * lines.length);
        lines.forEach(function (text, i) {
          y -= LEAD;
          if (!i) put(M, row[0], false, true);
          put(M + KEY * CHAR, text);
        });
      });
    }
    var images = [];
    function image(img, x, width) {
      var height = width * img.height / img.width;
      images.push(img);
      ops.push("q " + width.toFixed(2) + " 0 0 " + height.toFixed(2) + " " + x.toFixed(2) + " " +
        (y - height).toFixed(2) + " cm /Im" + images.length + " Do Q");
      return height;
    }

    newPage();
    line(M, doc.title.toUpperCase(), true, false, 12);
    gap(0.4);
    wrapText(doc.subtitle, COLS).forEach(function (text) { line(M, text, false, true); });
    doc.sections.forEach(function (section) {
      heading(section[0]);
      var cols = COLS;
      var photoBottom = null;
      if (section[2]) {
        var photoWidth = Math.min(120, 100 * section[2].width / section[2].height);
        need(110);
        photoBottom = y - image(section[2], W - M - photoWidth, photoWidth);
        cols = COLS - Math.ceil(132 / CHAR);
      }
      pairs(section[1], cols);
      if (photoBottom !== null && photoBottom < y) y = photoBottom;
    });
    doc.paragraphs.forEach(function (paragraph) {
      heading(paragraph[0]);
      wrapText(paragraph[1], COLS).forEach(function (text) { line(M, text); });
    });
    heading("What you agree to");
    doc.terms.forEach(function (term, i) {
      var lines = wrapText(term[0] + ". " + term[1], COLS - 4);
      need(LEAD * lines.length + 4);
      lines.forEach(function (text, n) {
        y -= LEAD;
        if (!n) put(M, String.fromCharCode(65 + i), false, true);
        put(M + 4 * CHAR, text);
      });
      y -= 3;
    });
    var sigWidth = 170;
    var sigHeight = sigWidth * doc.signature.height / doc.signature.width;
    need(sigHeight + LEAD * 8);  /* keep the signing block together */
    heading("Signed");
    pairs(doc.signedLines.slice(0, 1), COLS);
    gap(0.2);
    y -= image(doc.signature, M + KEY * CHAR, sigWidth);
    ops.push("0.6 G 0.5 w " + (M + KEY * CHAR).toFixed(2) + " " + y.toFixed(2) + " m " +
      (M + KEY * CHAR + sigWidth).toFixed(2) + " " + y.toFixed(2) + " l S");
    put(M, "Signature", false, true);
    gap(0.2);
    pairs(doc.signedLines.slice(1), COLS);

    /* footer on every page */
    pages.forEach(function (pageOps, i) {
      ops = pageOps;
      y = M - 6;
      put(M, doc.footer, false, true, 7.5);
      var count = "Page " + (i + 1) + " of " + pages.length;
      put(W - M - count.length * 7.5 * 0.6, count, false, true, 7.5);
    });

    /* objects: 1 catalog, 2 pages, 3-4 fonts, images, then each page and its content */
    var chunks = [];
    var length = 0;
    var offsets = [];
    function add(part) {
      if (typeof part === "string") {
        var bytes = new Uint8Array(part.length);
        for (var i = 0; i < part.length; i++) bytes[i] = part.charCodeAt(i) & 255;
        part = bytes;
      }
      chunks.push(part);
      length += part.length;
    }
    function object(number, body, stream) {
      offsets[number] = length;
      add(number + " 0 obj\n" + body);
      if (stream) {
        add("\nstream\n");
        add(stream);
        add("\nendstream");
      }
      add("\nendobj\n");
    }
    var firstPage = 5 + images.length;
    add("%PDF-1.4\n%âãÏÓ\n");
    object(1, "<< /Type /Catalog /Pages 2 0 R >>");
    object(2, "<< /Type /Pages /Count " + pages.length + " /Kids [" + pages.map(function (p, i) {
      return (firstPage + i * 2) + " 0 R";
    }).join(" ") + "] >>");
    object(3, "<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>");
    object(4, "<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold /Encoding /WinAnsiEncoding >>");
    var xobjects = images.map(function (img, i) {
      object(5 + i, "<< /Type /XObject /Subtype /Image /Width " + img.width + " /Height " + img.height +
        " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + img.bytes.length + " >>", img.bytes);
      return "/Im" + (i + 1) + " " + (5 + i) + " 0 R";
    }).join(" ");
    pages.forEach(function (pageOps, i) {
      var content = pageOps.join("\n");
      object(firstPage + i * 2, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + W + " " + H + "]" +
        " /Resources << /Font << /F1 3 0 R /F2 4 0 R >> /XObject << " + xobjects + " >> >>" +
        " /Contents " + (firstPage + i * 2 + 1) + " 0 R >>");
      object(firstPage + i * 2 + 1, "<< /Length " + content.length + " >>", content);
    });
    var total = firstPage + pages.length * 2;
    var xref = length;
    var table = "xref\n0 " + total + "\n0000000000 65535 f \n";
    for (var n = 1; n < total; n++) table += ("000000000" + offsets[n]).slice(-10) + " 00000 n \n";
    add(table + "trailer\n<< /Size " + total + " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF\n");
    var pdf = new Uint8Array(length);
    var at = 0;
    chunks.forEach(function (part) { pdf.set(part, at); at += part.length; });
    return pdf;
  }

  /* Phone photos come in big; shrink to a JPEG that emails easily */
  function shrinkPhoto(file, done) {
    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () {
      var scale = Math.min(1, 1200 / Math.max(img.naturalWidth, img.naturalHeight));
      var c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * scale);
      c.height = Math.round(img.naturalHeight * scale);
      var g = c.getContext("2d");
      g.fillStyle = "#ffffff";
      g.fillRect(0, 0, c.width, c.height);
      g.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      var dataUrl = c.toDataURL("image/jpeg", 0.85);
      done({ dataUrl: dataUrl, bytes: dataUrlBytes(dataUrl), width: c.width, height: c.height });
    };
    img.onerror = function () { URL.revokeObjectURL(url); done(null); };
    img.src = url;
  }

  /* Name bar, as on the contact page */
  document.querySelectorAll(".release-page .index-heading").forEach(function (heading) {
    if (heading.classList.contains("is-built")) return;
    heading.innerHTML = "";
    heading.appendChild(make("span", "site-name", "Elliot Holbrow"));
    heading.appendChild(make("span", "site-role", "Cinematographer, London"));
    var nav = make("nav", "site-nav");
    nav.setAttribute("aria-label", "Site");
    var work = make("a", "", "Work");
    work.href = INDEX_URL;
    var contact = make("a", "is-contact", "Contact");
    contact.href = "/contact";
    nav.appendChild(work);
    nav.appendChild(contact);
    heading.appendChild(nav);
    heading.classList.add("is-built");
  });

  document.querySelectorAll(".release-page").forEach(function (page) {
    var holder = page.querySelector(".release-form");
    if (!holder || holder.classList.contains("is-built")) return;
    holder.classList.add("is-built");

    var phoneQuery = window.matchMedia(PHONE_QUERY);
    function phoneCheck() {
      page.classList.toggle("is-phone",
        phoneQuery.matches || !!document.querySelector(".mobile"));
    }
    phoneCheck();
    /* Typed fields sit on their own writing lines (option B, picked 6 Oct 2026) */
    page.classList.add("is-lines");
    if (phoneQuery.addEventListener) phoneQuery.addEventListener("change", phoneCheck);

    /* iPhones zoom into any field set under 16px when it's tapped; this
       page keeps the site's 11px, so stop the zoom instead. */
    var viewport = document.querySelector('meta[name="viewport"]');
    if (viewport && !/maximum-scale/.test(viewport.content)) {
      viewport.content += ", maximum-scale=1";
    }

    var params = new URLSearchParams(window.location.search);
    var type = params.get("type") === "location" ? "location" : "person";
    var spec = FORMS[type];

    function footer() {
      var foot = make("div", "release-footer");
      foot.appendChild(make("span", "", "Questions: " + EMAIL));
      foot.appendChild(make("span", "", "© " + new Date().getFullYear() + " Elliot Holbrow"));
      return foot;
    }

    /* Back from FormSubmit after signing */
    if (params.get("signed") === "1") {
      var done = make("div", "release-tools");
      done.appendChild(make("span", "", "Signed"));
      holder.appendChild(done);
      holder.appendChild(make("p", "release-intro",
        "Thank you. A copy has come to me, and I'll send you the clips you're in. Any questions, email " + EMAIL + "."));
      var saved = null;
      try { saved = JSON.parse(window.sessionStorage.getItem("elliotRelease")); } catch (error) { saved = null; }
      if (saved && saved.pdf) {
        var binary = atob(saved.pdf);
        var bytes = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        var copy = make("a", "release-row release-copy");
        copy.href = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
        copy.download = saved.name;
        copy.appendChild(make("span", "release-number", ""));
        copy.appendChild(labelCell("Your signed copy (PDF)"));
        copy.appendChild(make("span", "release-action", "Save"));
        holder.appendChild(copy);
      }
      holder.appendChild(footer());
      return;
    }

    var form = make("form", "release-fields");
    form.method = "POST";
    form.enctype = "multipart/form-data";
    form.action = "https://formsubmit.co/" + EMAIL;
    form.noValidate = true;

    var tools = make("div", "release-tools");
    tools.appendChild(make("span", "", spec.title));
    form.appendChild(tools);
    form.appendChild(make("p", "release-intro", spec.intro));
    /* the explainer link sits under the intro, where people read it */
    var explainLink = make("a", "release-explain-link", "Where does my footage go?");
    explainLink.href = "#footage";
    form.appendChild(explainLink);

    /* Numbered rows: label, leader, field, leader, action */
    var number = 0;
    var fields = [];
    var photo = null;
    var guardianRows = [];
    spec.sections.forEach(function (section, s) {
      var block = make("div", "release-section");
      columns(block, s ? "" : "No.", section[0]);
      section[1].forEach(function (field) {
        number += 1;
        var row = make("div", "release-row release-field");
        row.appendChild(make("span", "release-number", pad(number)));
        row.appendChild(labelCell(field.label));
        var action = make("span", "release-action", field.required ? "Required" : "");
        field.row = row;
        field.action = action;

        if (field.photo) {
          var photoCell = make("span", "release-value release-photo");
          var photoNote = make("span", "release-photo-note", field.note);
          var thumb = make("img", "release-photo-thumb");
          thumb.alt = field.label;
          thumb.hidden = true;
          var picker = make("input");
          picker.type = "file";
          picker.accept = "image/*";
          picker.hidden = true;
          photoCell.appendChild(photoNote);
          photoCell.appendChild(thumb);
          photoCell.appendChild(picker);
          row.appendChild(photoCell);
          action = make("button", "release-action", "Add photo");
          action.type = "button";
          field.action = action;
          field.input = { value: "" };
          var choose = function () { picker.click(); };
          action.addEventListener("click", choose);
          photoNote.addEventListener("click", choose);
          thumb.addEventListener("click", choose);
          picker.addEventListener("change", function () {
            if (!picker.files || !picker.files[0]) return;
            action.textContent = "Loading";
            shrinkPhoto(picker.files[0], function (shot) {
              picker.value = "";
              if (!shot) { action.textContent = "Add photo"; errorText.textContent = "That photo couldn't be opened. Please try another."; return; }
              photo = shot;
              thumb.src = shot.dataUrl;
              thumb.hidden = false;
              photoNote.hidden = true;
              action.textContent = "Change";
            });
          });
        } else if (field.choices) {
          var choices = make("span", "release-choices");
          var hiddenInput = make("input");
          hiddenInput.type = "hidden";
          hiddenInput.name = field.name;
          field.input = hiddenInput;
          field.choices.forEach(function (choice) {
            var button = make("button", "release-choice", choice);
            button.type = "button";
            button.addEventListener("click", function () {
              hiddenInput.value = choice.toLowerCase();
              choices.querySelectorAll(".release-choice").forEach(function (b) {
                b.classList.toggle("is-on", b === button);
              });
              action.textContent = "";
              if (row.classList.contains("is-missing")) errorText.textContent = "";
              row.classList.remove("is-missing");
              if (field.name === "age") setMinor(choice === "Under 18");
            });
            choices.appendChild(button);
          });
          choices.appendChild(hiddenInput);
          row.appendChild(choices);
        } else {
          var value = make("span", "release-value");
          var input = make("input");
          input.type = field.type || "text";
          input.name = field.name;
          if (field.auto) input.autocomplete = field.auto;
          input.placeholder = field.placeholder || "Type here";
          if (field.query && params.get(field.query)) input.value = params.get(field.query);
          var fit = function () {
            var length = Math.max(input.value.length, input.placeholder.length) + 1;
            input.style.width = length + "ch";
          };
          input.addEventListener("input", function () {
            fit();
            if (input.value.trim()) {
              if (row.classList.contains("is-missing")) errorText.textContent = "";
              row.classList.remove("is-missing");
              if (field.required) action.textContent = "";
            } else if (field.required) {
              action.textContent = "Required";
            }
          });
          input.addEventListener("focus", function () { row.classList.add("is-focus"); });
          input.addEventListener("blur", function () { row.classList.remove("is-focus"); });
          fit();
          field.input = input;
          value.appendChild(input);
          row.appendChild(value);
          /* the label is a tap target for the field too */
          row.querySelector(".release-label").addEventListener("click", function () { input.focus(); });
        }
        row.appendChild(action);
        if (field.guardian) {
          row.hidden = true;
          guardianRows.push(field);
        }
        fields.push(field);
        block.appendChild(row);
      });
      form.appendChild(block);
    });

    /* Under 18: a parent or guardian fills in their details and signs */
    var agreeText;
    var sigLabel;
    function setMinor(minor) {
      guardianRows.forEach(function (field) {
        field.row.hidden = !minor;
        field.required = minor;
        field.action.textContent = minor && !field.input.value.trim() ? "Required" : "";
      });
      agreeText.textContent = minor
        ? "I'm their parent or guardian, I've read this and I agree on their behalf."
        : "I've read this and I agree.";
      sigLabel.textContent = minor ? "Guardian signs" : "Signature";
    }

    var returnBlock = make("div", "release-section");
    columns(returnBlock, "", "In return");
    var returnRow = make("div", "release-row release-term");
    returnRow.appendChild(make("span", "release-number", ""));
    returnRow.appendChild(labelCell("No fee"));
    returnRow.appendChild(make("span", "release-term-text", spec.inReturn));
    returnBlock.appendChild(returnRow);
    form.appendChild(returnBlock);

    var termsBlock = make("div", "release-section");
    columns(termsBlock, "", "What you agree to");
    wordRows(termsBlock, spec.terms);
    form.appendChild(termsBlock);

    /* Agree, sign, date, send */
    var signBlock = make("div", "release-section");
    columns(signBlock, "", "Sign");

    var agreeRow = make("div", "release-row release-field");
    agreeRow.appendChild(make("span", "release-number", ""));
    agreeRow.appendChild(labelCell("Agree"));
    var agreeChoices = make("span", "release-choices");
    var agreeButton = make("button", "release-choice");
    agreeButton.type = "button";
    agreeText = make("span", "", "I've read this and I agree.");
    agreeButton.appendChild(agreeText);
    agreeChoices.appendChild(agreeButton);
    agreeRow.appendChild(agreeChoices);
    var agreeAction = make("span", "release-action", "Tap to agree");
    agreeRow.appendChild(agreeAction);
    var agreed = false;
    function toggleAgree() {
      agreed = !agreed;
      agreeButton.classList.toggle("is-on", agreed);
      agreeButton.setAttribute("aria-pressed", agreed ? "true" : "false");
      agreeAction.textContent = agreed ? "Agreed" : "Tap to agree";
      agreeRow.classList.remove("is-missing");
      errorText.textContent = "";
    }
    agreeButton.setAttribute("aria-pressed", "false");
    agreeButton.addEventListener("click", toggleAgree);
    agreeRow.querySelector(".release-label").addEventListener("click", toggleAgree);
    signBlock.appendChild(agreeRow);

    var signRow = make("div", "release-row release-sign");
    signRow.appendChild(make("span", "release-number", ""));
    var signLabel = labelCell("Signature");
    sigLabel = signLabel.firstChild;
    signRow.appendChild(signLabel);
    var padBox = make("span", "release-pad");
    var canvas = make("canvas");
    var hint = make("span", "release-pad-hint", "Sign here with your finger or mouse");
    padBox.appendChild(canvas);
    padBox.appendChild(hint);
    signRow.appendChild(padBox);
    var clear = make("button", "release-action", "Clear");
    clear.type = "button";
    signRow.appendChild(clear);
    signBlock.appendChild(signRow);

    var dateRow = make("div", "release-row release-field");
    dateRow.appendChild(make("span", "release-number", ""));
    dateRow.appendChild(labelCell("Date"));
    var today = make("span", "release-value");
    today.appendChild(make("span", "", new Date().toLocaleDateString("en-GB",
      { day: "numeric", month: "long", year: "numeric" })));
    dateRow.appendChild(today);
    signBlock.appendChild(dateRow);

    var send = make("button", "release-send");
    send.type = "submit";
    send.appendChild(labelCell("Sign and send"));
    var sendArrow = make("span", "release-action", "→");
    send.appendChild(sendArrow);
    signBlock.appendChild(send);
    var error = make("div", "release-row");
    var errorText = make("span", "release-error");
    error.appendChild(errorText);
    signBlock.appendChild(error);
    form.appendChild(signBlock);

    /* What FormSubmit needs, plus what was agreed to and when */
    var extra = {
      _next: PAGE + "?signed=1",
      _captcha: "false",
      _template: "table",
      _subject: "Signed " + type + " release",
      _autoresponse: "Thanks for signing. I've got your release, and I'll send you a copy of the clips you're in. Any questions, reply to this email. Elliot Holbrow",
      form_name: type + "-release",
      agree: "",
      signed_at: "",
      terms_version: "",
      device: "",
      signature_png: ""
    };
    var extraInputs = {};
    Object.keys(extra).forEach(function (key) {
      var input = make("input");
      input.type = "hidden";
      input.name = key;
      input.value = extra[key];
      extraInputs[key] = input;
      form.appendChild(input);
    });
    var fileInput = make("input");
    fileInput.type = "file";
    fileInput.name = "attachment";
    fileInput.hidden = true;
    form.appendChild(fileInput);

    holder.appendChild(form);

    /* The explainer, swapped in for the form */
    var explainer = make("div", "release-explainer");
    explainer.hidden = true;
    var explainTools = make("div", "release-tools");
    explainTools.appendChild(make("span", "", "Where does my footage go?"));
    var back = make("a", "", "← Back to the form");
    back.href = "#";
    explainTools.appendChild(back);
    explainer.appendChild(explainTools);
    explainer.appendChild(make("p", "release-intro", "What happens to the clips you're in."));
    var explainBlock = make("div", "release-section");
    wordRows(explainBlock, EXPLAINER);
    explainer.appendChild(explainBlock);
    holder.appendChild(explainer);
    holder.appendChild(footer());

    function showExplainer(show) {
      explainer.hidden = !show;
      form.hidden = show;
      page.scrollIntoView();
      if (!show) sizeCanvas();
    }
    explainLink.addEventListener("click", function (event) {
      event.preventDefault();
      showExplainer(true);
    });
    back.addEventListener("click", function (event) {
      event.preventDefault();
      showExplainer(false);
    });

    /* Signature pad: white ink on the page; sent as black on white */
    var context = canvas.getContext("2d");
    var drawn = false;
    var drawing = false;
    var last = null;
    function sizeCanvas() {
      var box = canvas.getBoundingClientRect();
      var ratio = window.devicePixelRatio || 1;
      if (!box.width) return;
      if (canvas.width === Math.round(box.width * ratio) &&
          canvas.height === Math.round(box.height * ratio)) return;
      var keep = drawn ? canvas.toDataURL() : null;
      canvas.width = Math.round(box.width * ratio);
      canvas.height = Math.round(box.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.lineWidth = 1.6;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = "#ffffff";
      if (keep) {
        var image = new Image();
        image.onload = function () { context.drawImage(image, 0, 0, box.width, box.height); };
        image.src = keep;
      }
    }
    function point(event) {
      var box = canvas.getBoundingClientRect();
      return { x: event.clientX - box.left, y: event.clientY - box.top };
    }
    canvas.addEventListener("pointerdown", function (event) {
      drawing = true;
      last = point(event);
      if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    canvas.addEventListener("pointermove", function (event) {
      if (!drawing) return;
      var p = point(event);
      context.beginPath();
      context.moveTo(last.x, last.y);
      context.lineTo(p.x, p.y);
      context.stroke();
      last = p;
      if (!drawn) {
        drawn = true;
        hint.hidden = true;
        signRow.classList.remove("is-missing");
        errorText.textContent = "";
      }
    });
    ["pointerup", "pointercancel"].forEach(function (name) {
      canvas.addEventListener(name, function () { drawing = false; });
    });
    clear.addEventListener("click", function () {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawn = false;
      hint.hidden = false;
    });
    /* Re-measure whenever the pad changes size, including when the
       stylesheet arrives after this script has run. */
    if (window.ResizeObserver) {
      new ResizeObserver(sizeCanvas).observe(canvas);
    } else {
      window.addEventListener("resize", sizeCanvas);
    }
    sizeCanvas();

    /* The emailed copy: black ink on white, so it shows in any mail app */
    function exportCanvas() {
      var out = document.createElement("canvas");
      out.width = canvas.width;
      out.height = canvas.height;
      var outContext = out.getContext("2d");
      var pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      var data = pixels.data;
      for (var i = 0; i < data.length; i += 4) {
        var ink = data[i + 3];
        data[i] = data[i + 1] = data[i + 2] = 255 - ink;
        data[i + 3] = 255;
      }
      outContext.putImageData(pixels, 0, 0);
      return out;
    }

    /* Everything on the signed PDF, in the order it reads on the page */
    function releaseDocument(signature) {
      var value = function (n) {
        var input = form.querySelector('input[name="' + n + '"]');
        return input ? input.value.trim() : "";
      };
      var signedAt = new Date(extraInputs.signed_at.value);
      var london = signedAt.toLocaleString("en-GB", { timeZone: "Europe/London", day: "numeric",
        month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" });
      return {
        title: spec.title,
        subtitle: spec.intro.replace("Please read it all, and ask anything before you sign.", "") +
          "Between Elliot Holbrow (" + EMAIL + ") and the person signing below. Terms: " + TERMS_VERSION[type] + ".",
        sections: spec.sections.map(function (section) {
          var rows = [];
          var sectionPhoto = null;
          section[1].forEach(function (field) {
            if (field.row.hidden) return;
            if (field.photo) { sectionPhoto = photo; return; }
            rows.push([field.label, value(field.name)]);
          });
          return [section[0], rows, sectionPhoto];
        }),
        paragraphs: [["In return", spec.inReturn + " No fee is paid."]],
        terms: spec.terms,
        signature: signature,
        signedLines: [
          ["Agreed", agreeText.textContent],
          ["Signed by", value("guardian_name") && !form.querySelector('input[name="guardian_name"]').closest(".release-row").hidden
            ? value("guardian_name") + " (" + (value("guardian_relationship") || "parent or guardian") + "), for " + value("name")
            : value("name")],
          ["Date and time", london + " (" + extraInputs.signed_at.value + ")"],
          ["Signed on", "elliot.onl/release, " + navigator.userAgent]
        ],
        footer: spec.title + " \u00b7 Elliot Holbrow \u00b7 elliot.onl"
      };
    }

    /* Check, then send */
    var sending = false;
    function fail(message, row) {
      errorText.textContent = message;
      if (row) {
        row.classList.add("is-missing");
        row.scrollIntoView({ block: "center" });
      }
    }
    form.addEventListener("submit", function (event) {
      if (sending) return;
      event.preventDefault();
      errorText.textContent = "";
      var missing = null;
      fields.forEach(function (field) {
        if (!field.required || field.row.hidden) return;
        if (field.input.value.trim()) return;
        field.row.classList.add("is-missing");
        if (!missing) missing = field;
      });
      if (missing) {
        fail("Please fill in " + missing.label.toLowerCase() + ".", missing.row);
        return;
      }
      var email = form.querySelector('input[name="email"]');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        fail("Please check your email address.", email.closest(".release-row"));
        return;
      }
      if (!agreed) { fail("Please tap to agree.", agreeRow); return; }
      if (!drawn) { fail("Please sign on the line first.", signRow); return; }

      extraInputs.agree.value = "yes";
      extraInputs.signed_at.value = new Date().toISOString();
      extraInputs.terms_version.value = TERMS_VERSION[type];
      extraInputs.device.value = navigator.userAgent;
      send.disabled = true;
      send.querySelector(".release-label-text").textContent = "Sending";
      sendArrow.textContent = "…";
      var out = exportCanvas();
      var sigUrl = out.toDataURL("image/jpeg", 0.92);
      var pdf = makePdf(releaseDocument({ dataUrl: sigUrl, bytes: dataUrlBytes(sigUrl), width: out.width, height: out.height }));
      var name = form.querySelector('input[name="name"]').value.trim();
      var filename = "release_" + type + "_" + (name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "signed") +
        "_" + extraInputs.signed_at.value.slice(0, 10) + ".pdf";
      /* keep a copy for the "Save your copy" link on the page they come back to */
      try {
        var binary = "";
        for (var b = 0; b < pdf.length; b += 32768) {
          binary += String.fromCharCode.apply(null, pdf.subarray(b, b + 32768));
        }
        window.sessionStorage.setItem("elliotRelease", JSON.stringify({ name: filename, pdf: btoa(binary) }));
      } catch (error) { /* private browsing: no copy to offer, the email still goes */ }
      try {
        var transfer = new DataTransfer();
        transfer.items.add(new File([pdf], filename, { type: "application/pdf" }));
        fileInput.files = transfer.files;
      } catch (error) {
        /* older browsers can't attach a file: send the signature as text instead */
        fileInput.remove();
        extraInputs.signature_png.value = out.toDataURL("image/png");
      }
      /* leave blank fields (guardian, the text fallback) out of the email */
      Array.prototype.forEach.call(form.elements, function (el) {
        if (el.name && el.type !== "file" && !el.value) el.disabled = true;
      });
      sending = true;
      if (window._releaseSent) { window._releaseSent(form, pdf, filename); return; }
      HTMLFormElement.prototype.submit.call(form);
    });
  });
})();
