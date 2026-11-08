// Solaya Uluwatu - interaksi halaman.
// Gambar diatur di js/config.js, terjemahan di js/translations.js.
(function () {
  "use strict";

  /* ---------- 1. Gambar dari config.js ---------- */
  function applyImages() {
    var map = window.IMAGES || {};
    document.querySelectorAll("[data-img]").forEach(function (el) {
      var url = (map[el.getAttribute("data-img")] || "").trim();
      if (!url) return; // kosong: biarkan gradasi cadangan
      var probe = new Image();
      probe.onload = function () { el.style.backgroundImage = 'url("' + url.replace(/"/g, "%22") + '")'; };
      probe.onerror = function () { console.warn("Gambar tidak ditemukan:", url, "(slot: " + el.getAttribute("data-img") + ")"); };
      probe.src = url;
    });
  }

  /* ---------- 2. Menu mobile ---------- */
  function initMenu() {
    var btn = document.getElementById("menu-btn");
    var panel = document.getElementById("mobile-nav");
    var icon = document.getElementById("menu-icon");
    if (!btn || !panel) return;
    function setOpen(open) {
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      icon.textContent = open ? "close" : "menu";
    }
    btn.addEventListener("click", function () { setOpen(panel.hidden); });
    panel.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
  }

  /* ---------- 3. Formulir newsletter (pratinjau) ---------- */
  function initForm() {
    var form = document.getElementById("dispatch-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      document.getElementById("dispatch-status").hidden = false;
      document.getElementById("dispatch-email").value = "";
    });
  }

  /* ---------- 4. Bahasa EN / ID ---------- */
  var originals = new WeakMap();

  function textNodes() {
    var out = [];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) {
      var tag = n.parentNode && n.parentNode.nodeName;
      if (!tag || tag === "SCRIPT" || tag === "STYLE") continue;
      if (n.nodeValue.trim()) out.push(n);
    }
    return out;
  }

  function setLang(lang) {
    var dict = window.TRANSLATIONS_ID || {};
    textNodes().forEach(function (n) {
      if (!originals.has(n)) originals.set(n, n.nodeValue);
      var orig = originals.get(n);
      if (lang === "en") { n.nodeValue = orig; return; }
      var key = orig.replace(/\s+/g, " ").trim();
      var quoted = /^["“](.*)["”]$/.exec(key);
      var val = dict[quoted ? quoted[1] : key];
      if (!val) { n.nodeValue = orig; return; }
      var lead = orig.match(/^\s*/)[0];
      var trail = orig.match(/\s*$/)[0];
      n.nodeValue = lead + (quoted ? '"' + val + '"' : val) + trail;
    });
    var email = document.getElementById("dispatch-email");
    if (email && window.PLACEHOLDERS) email.placeholder = window.PLACEHOLDERS[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    try { localStorage.setItem("solaya-lang", lang); } catch (e) {}
  }

  function initLang() {
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
    });
    var saved = null;
    try { saved = localStorage.getItem("solaya-lang"); } catch (e) {}
    if (saved === "id") setLang("id");
  }

  applyImages();
  initMenu();
  initForm();
  initLang();
})();
