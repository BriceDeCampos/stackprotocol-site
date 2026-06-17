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
