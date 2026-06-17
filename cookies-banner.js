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

  // Injecte le CSS — barre fine pleine largeur en bas du site
  var style = document.createElement('style');
  style.textContent =
    '.sp-cookies{position:fixed;bottom:0;left:0;right:0;background:rgba(15,15,15,0.96);backdrop-filter:blur(12px);color:#e6e6e6;border-top:1px solid rgba(255,255,255,0.1);font-family:Inter,system-ui,sans-serif;font-size:12.5px;line-height:1.5;z-index:9999;box-shadow:0 -8px 32px rgba(0,0,0,0.4);animation:spCookiesIn .3s ease-out}' +
    '@keyframes spCookiesIn{from{transform:translateY(100%)}to{transform:translateY(0)}}' +
    '.sp-cookies-inner{max-width:1200px;margin:0 auto;padding:12px 24px;display:flex;align-items:center;gap:18px;flex-wrap:wrap}' +
    '.sp-cookies-text{flex:1;min-width:260px;margin:0;color:#cfd4dc}' +
    '.sp-cookies-text svg{width:14px;height:14px;color:#3CE5A3;display:inline-block;vertical-align:middle;margin-right:6px}' +
    '.sp-cookies-text b{color:#e6e6e6;font-weight:600}' +
    '.sp-cookies-text a{color:#3CE5A3;text-decoration:underline;text-underline-offset:2px;font-weight:500}' +
    '.sp-cookies-text a:hover{color:#4eecaf}' +
    '.sp-cookies-actions{display:flex;gap:6px;align-items:center;flex-shrink:0}' +
    '.sp-btn{padding:7px 14px;border:1px solid rgba(255,255,255,0.18);background:transparent;color:#e6e6e6;border-radius:6px;font-size:12.5px;font-weight:500;cursor:pointer;font-family:inherit;transition:border-color .15s,background .15s,color .15s;white-space:nowrap}' +
    '.sp-btn:hover{border-color:rgba(60,229,163,0.5);background:rgba(60,229,163,0.06);color:#3CE5A3}' +
    '.sp-btn:focus-visible{outline:2px solid #3CE5A3;outline-offset:2px}' +
    '.sp-btn-primary{background:#3CE5A3;color:#0a0a0a;border-color:#3CE5A3;font-weight:600}' +
    '.sp-btn-primary:hover{background:#4eecaf;border-color:#4eecaf;color:#0a0a0a}' +
    /* Mode détail expandable au-dessus de la barre */
    '.sp-cookies-detail{max-width:1200px;margin:0 auto;padding:14px 24px 4px;border-top:1px solid rgba(255,255,255,0.06);display:none}' +
    '.sp-cookies-detail.open{display:block}' +
    '.sp-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04)}' +
    '.sp-row:last-of-type{border-bottom:none}' +
    '.sp-row-info{flex:1;font-size:12px}' +
    '.sp-row b{color:#e6e6e6;font-weight:600}' +
    '.sp-row span{color:#a8b0ba;font-size:11.5px;display:block;margin-top:2px}' +
    '.sp-switch{position:relative;width:34px;height:20px;background:rgba(255,255,255,0.15);border-radius:20px;cursor:pointer;transition:background .15s;flex-shrink:0;margin-left:14px}' +
    '.sp-switch.on{background:#3CE5A3}' +
    '.sp-switch.off-locked{opacity:0.5;cursor:not-allowed}' +
    '.sp-switch::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;background:#0a0a0a;border-radius:50%;transition:transform .15s}' +
    '.sp-switch.on::after{transform:translateX(14px)}' +
    '@media(max-width:680px){.sp-cookies-inner{padding:10px 14px;gap:10px;flex-direction:column;align-items:stretch}.sp-cookies-text{font-size:12px}.sp-cookies-actions{justify-content:space-between;width:100%}.sp-btn{flex:1;padding:8px 8px;font-size:12px}.sp-cookies-detail{padding:12px 14px 4px}}';
  document.head.appendChild(style);

  // Injecte le HTML — barre compacte
  var banner = document.createElement('div');
  banner.className = 'sp-cookies';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Préférences cookies');
  banner.setAttribute('aria-live', 'polite');
  banner.innerHTML =
    '<div class="sp-cookies-detail" id="sp-detail">' +
    '  <div class="sp-row">' +
    '    <div class="sp-row-info"><b>Cookies techniques</b><span>Indispensables au fonctionnement du site. Toujours actifs.</span></div>' +
    '    <div class="sp-switch on off-locked" title="Toujours actifs"></div>' +
    '  </div>' +
    '  <div class="sp-row">' +
    '    <div class="sp-row-info"><b>Mesure d\'audience anonyme</b><span>Plausible — sans cookie tiers, hébergé en Europe.</span></div>' +
    '    <div class="sp-switch" data-toggle="analytics"></div>' +
    '  </div>' +
    '</div>' +
    '<div class="sp-cookies-inner">' +
    '  <p class="sp-cookies-text">' +
    '    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 13.5a9 9 0 1 1-7.5-8.6"/><circle cx="9" cy="10" r="1"/><circle cx="14" cy="14" r="1"/><circle cx="16" cy="9" r="1"/></svg>' +
    '    <b>Cookies.</b> Nous utilisons des cookies techniques et, avec ton accord, une mesure d\'audience anonyme. ' +
    '    <b>Aucune donnée n\'est revendue à des tiers.</b> ' +
    '    <a href="' + COOKIE_POLICY_URL + '">En savoir plus</a>' +
    '  </p>' +
    '  <div class="sp-cookies-actions">' +
    '    <button type="button" class="sp-btn" data-action="refuse">Tout refuser</button>' +
    '    <button type="button" class="sp-btn" data-action="customize">Paramétrer</button>' +
    '    <button type="button" class="sp-btn sp-btn-primary" data-action="accept">Tout accepter</button>' +
    '    <button type="button" class="sp-btn sp-btn-primary" data-action="save" style="display:none">Enregistrer</button>' +
    '  </div>' +
    '</div>';

  document.body.appendChild(banner);

  // Toggle visibility du bouton Save en mode personnaliser
  function showSaveMode() {
    var saveBtn = banner.querySelector('[data-action="save"]');
    var otherBtns = banner.querySelectorAll('[data-action="refuse"],[data-action="customize"],[data-action="accept"]');
    if (saveBtn) saveBtn.style.display = '';
    otherBtns.forEach(function (b) { b.style.display = 'none'; });
  }

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
      showSaveMode();
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
