/* ============================================================
   brand.js — Couleurs de marque StackProtocol
   « Octans » toujours en VERT (--green), « Claude » toujours en ORANGE (--orange).
   Parcourt le texte visible et enveloppe les mots dans <span class="octans-mark">
   / <span class="claude-mark"> (styles dans styles.css).
   Garde-fous : ignore script/style/code, liens de nav déjà stylés, et tout
   texte déjà à l'intérieur d'un mot de marque (anti double-enveloppe).
   ============================================================ */
(function () {
  'use strict';
  if (!document.body) return;

  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1, PRE: 1, OPTION: 1 };
  var RX = /\b(Octans|Claude)\b/g;

  // Le nœud texte est-il dans une zone à ignorer (ou déjà marquée) ?
  function skip(node) {
    for (var p = node.parentNode; p && p !== document.body; p = p.parentNode) {
      if (p.nodeType !== 1) continue;
      if (SKIP_TAGS[p.tagName]) return true;
      if (p.classList && (p.classList.contains('octans-mark') || p.classList.contains('claude-mark'))) return true;
    }
    return false;
  }

  // Récolte d'abord (ne pas muter pendant le parcours)
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  var targets = [], n;
  while ((n = walker.nextNode())) {
    RX.lastIndex = 0;
    if (RX.test(n.nodeValue) && !skip(n)) targets.push(n);
  }

  targets.forEach(function (node) {
    var s = node.nodeValue, frag = document.createDocumentFragment(), last = 0, m;
    RX.lastIndex = 0;
    while ((m = RX.exec(s))) {
      if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
      var span = document.createElement('span');
      span.className = (m[1] === 'Octans') ? 'octans-mark' : 'claude-mark';
      span.textContent = m[1];
      frag.appendChild(span);
      last = m.index + m[1].length;
    }
    if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
    node.parentNode.replaceChild(frag, node);
  });
})();

/* ============================================================
   Nav active — marque la page courante (mot blanc + trait dégradé).
   Détecte le fichier courant et l'associe au lien du menu principal.
   ============================================================ */
(function () {
  try {
    var here = (location.pathname.split('/').pop() || 'index.html');
    if (here === '') here = 'index.html';
    document.querySelectorAll('header .links a').forEach(function (a) {
      var target = (a.getAttribute('href') || '').split('#')[0].split('/').pop();
      if (target && target === here) {
        a.classList.add('on');
        a.setAttribute('aria-current', 'page');
      }
    });
  } catch (e) {}
})();

/* ============================================================
   Nav top dropdown — Offres ▾ (Phase 0.8 — 2026-06-19)
   Click pour ouvrir/fermer · Escape pour fermer · click extérieur ferme
   ============================================================ */
(function () {
  var dropdowns = document.querySelectorAll('[data-nav-dd]');
  if (!dropdowns.length) return;

  function closeAll(exceptFor) {
    dropdowns.forEach(function (dd) {
      if (dd !== exceptFor) {
        dd.classList.remove('is-open');
        var btn = dd.querySelector('.nav-trigger');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  dropdowns.forEach(function (dd) {
    var btn = dd.querySelector('.nav-trigger');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dd.classList.contains('is-open');
      closeAll(dd);
      if (isOpen) {
        dd.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        dd.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    /* Hover desktop : ouvre au survol (UX standard) */
    if (window.matchMedia('(min-width: 881px)').matches) {
      var hoverTimer;
      dd.addEventListener('mouseenter', function () {
        clearTimeout(hoverTimer);
        closeAll(dd);
        dd.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      });
      dd.addEventListener('mouseleave', function () {
        hoverTimer = setTimeout(function () {
          dd.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
        }, 180);
      });
    }
  });

  /* Fermeture sur click extérieur */
  document.addEventListener('click', function (e) {
    var inside = e.target.closest('[data-nav-dd]');
    if (!inside) closeAll();
  });

  /* Fermeture sur Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });
})();

/* ============================================================
   Header public — état connecté. Si une session est active (cookie
   .stackprotocol.fr), remplace « Se connecter » par « Mon espace ».
   N'affecte que les pages publiques (les pages /account n'ont pas de a.login).
   ============================================================ */
(function () {
  function apiBase() {
    if (window.SP_API_BASE) return window.SP_API_BASE;
    var h = location.hostname;
    return (h === 'localhost' || h === '127.0.0.1' || h === '')
      ? 'http://localhost:8000'
      : 'https://api.stackprotocol.fr';
  }
  var loginLinks = document.querySelectorAll('a.login, a[href$="login.html"]');
  if (!loginLinks.length) return;
  fetch(apiBase() + '/api/account/me', { credentials: 'include' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || !d.email) return;
      loginLinks.forEach(function (a) {
        a.textContent = 'Mon espace';
        a.setAttribute('href', '/account/dashboard.html');
        a.setAttribute('aria-label', 'Accéder à mon espace perso');
      });
    })
    .catch(function () { /* hors-ligne / non connecté → on garde « Se connecter » */ });
})();
