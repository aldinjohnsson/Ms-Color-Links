/* =============================================================
   LÓGICA DA PÁGINA
   Lê window.SITE_CONFIG (do config.js) e monta tudo.
   Normalmente você não precisa editar este arquivo.
   ============================================================= */
(function () {
  "use strict";

  var CONFIG = window.SITE_CONFIG || {};

  var ICONS = {
    instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    whatsapp:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm5.7 14.2c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.3-.9-2.8-1.2-4.5-4-4.7-4.2-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.2.5-.3.6-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.2 1.6 2 1.1.9 1.9 1.2 2.2 1.3.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.6-.1l1.8.9c.3.1.5.2.5.3.1.2.1.7-.1 1.2z"/></svg>',
    site:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>',
    facebook:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2 0-3.5 1.5-3.5 3.5V11H8v3h2.5v8h3v-8H16l.5-3h-3V9.5C13.5 9.2 13.7 9 14 9z"/></svg>',
    youtube:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 8.2a3 3 0 0 0-2-2C18 5.7 12 5.7 12 5.7s-6 0-8 .5a3 3 0 0 0-2 2C1.7 10 1.7 12 1.7 12s0 2 .3 3.8a3 3 0 0 0 2 2c2 .5 8 .5 8 .5s6 0 8-.5a3 3 0 0 0 2-2c.3-1.8.3-3.8.3-3.8s0-2-.3-3.8zM10 15V9l5 3-5 3z"/></svg>',
    tiktok:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 3c.3 2 1.6 3.6 3.6 4v3c-1.4 0-2.7-.4-3.8-1.1V15a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v3.1a2.5 2.5 0 1 0 1.6 2.3V3H16z"/></svg>',
    email:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 6l10 7 10-7"/></svg>'
  };
  var chevron = '<svg class="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>';

  /* monta um nó da árvore (recursivo) */
  function montaNo(item) {
    var node = document.createElement("div");
    node.className = "node";
    var temFilhos = Array.isArray(item.filhos) && item.filhos.length;
    if (temFilhos) node.classList.add("has-children");
    var sub = item.sub ? '<span class="sublabel">' + item.sub + '</span>' : "";

    if (temFilhos) {
      var btn = document.createElement("button");
      btn.className = "link-btn";
      btn.type = "button";
      btn.setAttribute("aria-expanded", "false");
      btn.innerHTML = '<span class="label-wrap">' + item.titulo + sub + '</span>' + chevron;
      btn.addEventListener("click", function () {
        var aberto = node.classList.toggle("open");
        btn.setAttribute("aria-expanded", aberto ? "true" : "false");
      });
      node.appendChild(btn);

      var children = document.createElement("div");
      children.className = "children";
      var inner = document.createElement("div");
      inner.className = "children-inner";
      item.filhos.forEach(function (f) { inner.appendChild(montaNo(f)); });
      children.appendChild(inner);
      node.appendChild(children);
    } else {
      var a = document.createElement("a");
      a.className = "link-btn";
      a.href = item.url || "#";
      a.target = "_blank";
      a.rel = "noopener";
      a.innerHTML = '<span class="label-wrap">' + item.titulo + sub + '</span>';
      node.appendChild(a);
    }
    return node;
  }

  function init() {
    var c = CONFIG, root = document.documentElement, cores = c.cores || {};

    /* cores */
    var map = { card:"--card", cardOpen:"--card-open", accent:"--accent",
                accentText:"--accent-text", text:"--text", muted:"--muted", line:"--line" };
    Object.keys(map).forEach(function (k) { if (cores[k]) root.style.setProperty(map[k], cores[k]); });

    /* fundo */
    var fundo = c.fundo || { tipo:"cor", cor:"#0c0c0c" };
    if (fundo.tipo === "imagem" && fundo.imagem) {
      document.body.style.background =
        "linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.55)), url('" + fundo.imagem + "') center/cover fixed no-repeat";
    } else {
      document.body.style.background = fundo.cor || "#0c0c0c";
    }

    /* cabeçalho */
    var iniciais = (c.nome || "?").split(" ").slice(0, 2)
      .map(function (p) { return p[0] || ""; }).join("").toUpperCase();
    var header = "";

    if (c.headerEstilo === "cartao") {
      var bg = c.foto ? "url('" + c.foto + "') center/cover"
                      : "linear-gradient(135deg,var(--card),var(--card-open))";
      header = '<div class="hero-card" style="background:' + bg + '">' +
        (c.foto ? "" : '<div class="hero-initials">' + iniciais + '</div>') +
        '<div class="hero-overlay"><h1 class="name">' + c.nome + '</h1>' +
        '<p class="tagline">' + c.descricao + '</p></div></div>';
    } else {
      var avatar = c.foto
        ? '<img class="avatar" src="' + c.foto + '" alt="' + c.nome + '">'
        : '<div class="avatar fallback">' + iniciais + '</div>';
      header = avatar + '<h1 class="name">' + c.nome + '</h1>' +
               '<p class="tagline">' + c.descricao + '</p>';
    }

    /* redes */
    var redes = "", ordem = ["instagram","whatsapp","site","facebook","youtube","tiktok","email"];
    ordem.forEach(function (r) {
      var url = (c.redes || {})[r];
      if (!url) return;
      if (r === "email") url = "mailto:" + url;
      redes += '<a href="' + url + '" target="_blank" rel="noopener" aria-label="' + r + '">' + ICONS[r] + '</a>';
    });
    if (redes) header += '<div class="socials">' + redes + '</div>';

    document.getElementById("header").innerHTML = header;

    /* links */
    var cont = document.getElementById("links");
    (c.links || []).forEach(function (item) { cont.appendChild(montaNo(item)); });

    /* rodapé */
    document.getElementById("ano").textContent = new Date().getFullYear();
    document.getElementById("footer-nome").textContent = c.nome || "";
    if (c.nome) document.title = c.nome + " — " + (c.descricao || "");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();