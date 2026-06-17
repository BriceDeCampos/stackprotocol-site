/* ============================================================
   StackProtocol — Bannière cookies RGPD
   ------------------------------------------------------------
   Doctrine : sobre · anti-dark-pattern · respect du choix utilisateur
   - 3 boutons : Accepter / Refuser / Personnaliser (= mêmes affordances)
   - Pas de cookies tiers tant que pas de "Accepter"
   - Stocke le choix en localStorage (pas de cookie pour gérer les cookies)
   - Réversible : page /legal/rgpd permet de changer d'avis
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'sp_consent_v1';
  var COOKIE_POLICY_URL = '/legal/rgpd';

  // Si choix déjà fait → ne rien afficher
  try {
    var existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
      // Appliquer le consentement existant
      applyConsent(JSON.parse(existing));
      return;
    }
  } catch (e) { /* localStorage indispo, on affiche quand même */ }

  // Injecte le CSS
  var style = document.createElement('style');
  style.textContent =
    '.sp-cookies{position:fixed;bottom:16px;left:16px;right:16px;max-width:520px;margin:0 auto;background:#0f0f0f;color:#e6e6e6;border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:20px 22px;font-family:Inter,system-ui,sans-serif;font-size:14px;line-height:1.55;z-index:9999;box-shadow:0 12px 40px rgba(0,0,0,0.5);animation:spCookiesIn .35s ease-out}' +
    '@keyframes spCookiesIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}' +
    '.sp-cookies-title{font-size:15px;font-weight:600;margin:0 0 8px;color:#fff;display:flex;align-items:center;gap:8px}' +
    '.sp-cookies-title svg{width:18px;height:18px;color:#3CE5A3}' +
    '.sp-cookies-text{margin:0 0 16px;color:#a8b0ba}' +
    '.sp-cookies-text a{color:#3CE5A3;text-decoration:underline;text-underline-offset:2px}' +
    '.sp-cookies-actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center}' +
    '.sp-btn{flex:1;min-width:120px;padding:10px 16px;border:1px solid rgba(255,255,255,0.18);background:transparent;color:#e6e6e6;border-radius:8px;font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit;transition:border-color .15s,background .15s}' +
    '.sp-btn:hover{border-color:rgba(60,229,163,0.5);background:rgba(60,229,163,0.05)}' +
    '.sp-btn:focus-visible{outline:2px solid #3CE5A3;outline-offset:2px}' +
    '.sp-btn-primary{background:#3CE5A3;color:#0a0a0a;border-color:#3CE5A3}' +
    '.sp-btn-primary:hover{background:#4eecaf;border-color:#4eecaf}' +
    '.sp-cookies-detail{margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.08);display:none}' +
    '.sp-cookies-detail.open{display:block}' +
    '.sp-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;font-size:13px}' +
    '.sp-row b{color:#e6e6e6;font-weight:600}' +
    '.sp-row span{color:#a8b0ba;font-size:12px}' +
    '.sp-switch{position:relative;width:36px;height:20px;background:rgba(255,255,255,0.15);border-radius:20px;cursor:pointer;transition:background .15s;flex-shrink:0;margin-left:12px}' +
    '.sp-switch.on{background:#3CE5A3}' +
    '.sp-switch.off-locked{opacity:0.5;cursor:not-allowed}' +
    '.sp-switch::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;background:#0a0a0a;border-radius:50%;transition:transform .15s}' +
    '.sp-switch.on::after{transform:translateX(16px);background:#0a0a0a}' +
    '@media(max-width:520px){.sp-cookies{left:12px;right:12px;bottom:12px;padding:16px 18px}.sp-cookies-actions{flex-direction:column}.sp-btn{width:100%;flex:0 0 auto}}';
  document.head.appendChild(style);

  // Injecte le HTML
  var banner = document.createElement('div');
  banner.className = 'sp-cookies';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Préférences cookies');
  banner.setAttribute('aria-live', 'polite');
  banner.innerHTML =
    '<p class="sp-cookies-title">' +
    '  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 13.5a9 9 0 1 1-7.5-8.6"/><circle cx="9" cy="10" r="1"/><circle cx="14" cy="14" r="1"/><circle cx="16" cy="9" r="1"/></svg>' +
    '  Cookies' +
    '</p>' +
    '<p class="sp-cookies-text">' +
    '  Ce site utilise des cookies techniques nécessaires à son fonctionnement, ' +
    '  et avec votre accord, des cookies de <b>mesure d\'audience anonyme</b>. ' +
    '  Aucune donnée n\'est partagée avec des tiers. ' +
    '  <a href="' + COOKIE_POLICY_URL + '">En savoir plus</a>.' +
    '</p>' +
    '<div class="sp-cookies-actions">' +
    '  <button type="button" class="sp-btn" data-action="refuse">Refuser tout</button>' +
    '  <button type="button" class="sp-btn" data-action="customize">Personnaliser</button>' +
    '  <button type="button" class="sp-btn sp-btn-primary" data-action="accept">Accepter tout</button>' +
    '</div>' +
    '<div class="sp-cookies-detail" id="sp-detail">' +
    '  <div class="sp-row">' +
    '    <div><b>Cookies techniques</b><br><span>Indispensables au fonctionnement du site (préférences, sécurité).</span></div>' +
    '    <div class="sp-switch on off-locked" title="Toujours actifs"></div>' +
    '  </div>' +
    '  <div class="sp-row">' +
    '    <div><b>Mesure d\'audience anonyme</b><br><span>Statistiques de visite sans identifier personne (Plausible, sans cookie tiers).</span></div>' +
    '    <div class="sp-switch" data-toggle="analytics"></div>' +
    '  </div>' +
    '  <div class="sp-cookies-actions" style="margin-top:14px">' +
    '    <button type="button" class="sp-btn sp-btn-primary" data-action="save">Enregistrer mes choix</button>' +
    '  </div>' +
    '</div>';

  document.body.appendChild(banner);

  // Gestion des actions
  banner.addEventListener('click', function (e) {
    var t = e.target;

    // Switches dans le mode personnaliser
    if (t.classList && t.classList.contains('sp-switch') && !t.classList.contains('off-locked')) {
      t.classList.toggle('on');
      return;
    }

    var action = t.getAttribute('data-action');
    if (!action) return;

    if (action === 'accept') {
      saveConsent({ analytics: true });
      removeBanner();
    } else if (action === 'refuse') {
      saveConsent({ analytics: false });
      removeBanner();
    } else if (action === 'customize') {
      document.getElementById('sp-detail').classList.add('open');
      var actions = banner.querySelectorAll('.sp-cookies-actions')[0];
      if (actions) actions.style.display = 'none';
    } else if (action === 'save') {
      var sw = banner.querySelector('.sp-switch[data-toggle="analytics"]');
      saveConsent({ analytics: sw && sw.classList.contains('on') });
      removeBanner();
    }
  });

  function saveConsent(consent) {
    consent.date = new Date().toISOString();
    consent.version = 1;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(consent)); } catch (e) {}
    applyConsent(consent);
  }

  function applyConsent(consent) {
    if (consent && consent.analytics) {
      // Hook pour Plausible / autre analytics futur (sans cookie tiers idéalement)
      window.spConsent = { analytics: true };
      // Exemple Plausible (à activer quand le compte sera créé) :
      // var s = document.createElement('script');
      // s.defer = true;
      // s.dataset.domain = 'stackprotocol.fr';
      // s.src = 'https://plausible.io/js/script.js';
      // document.head.appendChild(s);
    } else {
      window.spConsent = { analytics: false };
    }
  }

  function removeBanner() {
    banner.style.transition = 'opacity .3s, transform .3s';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(20px)';
    setTimeout(function () { banner.remove(); }, 350);
  }
})();
