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
  var STYLE_VERSION = "2026-10-06-a";
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
          { name: "name", label: "Full name", auto: "name", required: true },
          { name: "address", label: "Address", auto: "street-address", required: true },
          { name: "email", label: "Email", type: "email", auto: "email", required: true },
          { name: "age", label: "Age", choices: ["18 or over", "Under 18"], required: true },
          { name: "guardian_name", label: "Parent or guardian", guardian: true },
          { name: "guardian_relationship", label: "Relationship", guardian: true }]]
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
          { name: "name", label: "Full name", auto: "name", required: true },
          { name: "role", label: "Role", placeholder: "Owner, manager…", required: true },
          { name: "email", label: "Email", type: "email", auto: "email", required: true }]]
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
    var explainLink = make("a", "", "Where your footage goes");
    explainLink.href = "#footage";
    tools.appendChild(explainLink);
    form.appendChild(tools);
    form.appendChild(make("p", "release-intro", spec.intro));

    /* Numbered rows: label, leader, field, leader, action */
    var number = 0;
    var fields = [];
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

        if (field.choices) {
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
    fileInput.name = "signature";
    fileInput.hidden = true;
    form.appendChild(fileInput);

    holder.appendChild(form);

    /* The explainer, swapped in for the form */
    var explainer = make("div", "release-explainer");
    explainer.hidden = true;
    var explainTools = make("div", "release-tools");
    explainTools.appendChild(make("span", "", "Where your footage goes"));
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
      var dataUrl = out.toDataURL("image/png");
      out.toBlob(function (blob) {
        try {
          var transfer = new DataTransfer();
          transfer.items.add(new File([blob], "signature.png", { type: "image/png" }));
          fileInput.files = transfer.files;
        } catch (error) {
          /* older browsers: send the picture as text instead */
          fileInput.remove();
          extraInputs.signature_png.value = dataUrl;
        }
        sending = true;
        HTMLFormElement.prototype.submit.call(form);
      }, "image/png");
    });
  });
})();
