/* ============================================================
   StackProtocol — Configuration des liens externes (v3 — modèle Octans)
   ------------------------------------------------------------
   👉 UN SEUL FICHIER À REMPLIR. Colle ici tes 6 Payment Links
      Stripe + les ressources externes ; tout le site se câble seul.

   Modèle Octans 2026-06-13 — 6 Payment Links (paiement unique) :
     1. Pack Autonomie ............... 97 €
     2. Pack Autonomie Étudiant ...... 47 €  (email scolaire au checkout)
     3. Pack Métier .................. 297 €
     4. Pack Métier Accompagné ....... 697 €
     5. Coaching séance (1h45) ....... 197 €
     6. Coaching forfait (3 séances) . 497 €
   ⏸ Pass Série (690 €) = SAS D'ATTENTE : pas de lien de paiement.

   ⚠ Procédure : créer les liens en MODE TEST Stripe d'abord (cf. checklist
     MISE-EN-PROD-VSCODE), tester un achat de bout en bout, puis basculer LIVE.
   + Sur les 4 packs : activer la case « renonciation au droit de
     rétractation » (contenu numérique livré) dans Stripe.

   URL de succès Stripe à régler sur :
     https://stackprotocol.fr/system/merci.html?product=<clé-produit>

   Tant qu'un lien vaut "" : repli sûr (email de contact), pas de 404.
   ============================================================ */

window.SP_CONFIG = {

  /* ---- 6 Payment Links Stripe (modèle Octans) ---- */
  STRIPE_LINK_PACK_AUTONOMIE:          "",  // Pack Autonomie — 97€
  STRIPE_LINK_PACK_AUTONOMIE_ETUDIANT: "",  // Pack Autonomie Étudiant — 47€
  STRIPE_LINK_PACK_METIER:             "",  // Pack Métier — 297€
  STRIPE_LINK_PACK_METIER_ACCOMPAGNE:  "",  // Pack Métier Accompagné — 697€
  STRIPE_LINK_COACHING_SEANCE:         "",  // Coaching séance 1h45 — 197€
  STRIPE_LINK_COACHING_FORFAIT:        "",  // Coaching forfait 3 séances — 497€

  /* ---- Alias rétro-compatibilité (anciennes clés HTML → nouvelles) ----
     Permet au HTML encore non refondu de résoudre vers le bon produit
     en attendant la passe Claude Design. À retirer une fois le HTML migré. */
  _ALIAS: {
    STRIPE_LINK_PACK_ESSENTIEL:  "STRIPE_LINK_PACK_AUTONOMIE",
    STRIPE_LINK_PACK_STANDARD:   "STRIPE_LINK_PACK_METIER",
    STRIPE_LINK_PACK_PRO:        "STRIPE_LINK_PACK_METIER_ACCOMPAGNE",
    STRIPE_LINK_COACHING_DECLIC: "STRIPE_LINK_COACHING_SEANCE",
    STRIPE_LINK_COACHING_SPRINT: "STRIPE_LINK_COACHING_FORFAIT",
    STRIPE_LINK_PACK:            "STRIPE_LINK_PACK_AUTONOMIE",
    STRIPE_LINK_WEBINAR_DEC:     "STRIPE_LINK_PACK_AUTONOMIE",
    STRIPE_LINK_WEBINAR_STD:     "STRIPE_LINK_PACK_METIER",
    STRIPE_LINK_WEBINAR_PRO:     "STRIPE_LINK_PACK_METIER_ACCOMPAGNE",
    STRIPE_LINK_COACHING_PRO:    "STRIPE_LINK_COACHING_FORFAIT"
    /* STRIPE_LINK_SERIE / STRIPE_LINK_PASS_SERIE : volontairement non mappés
       (Pass Série en sas) → repli email tant que non commercialisé. */
  },

  /* ---- Ressources externes ---- */
  /* DISCORD_INVITE : conservé inerte — le modèle Octans ne livre plus via
     Discord. Laisser vide ; à retirer du HTML lors de la passe Claude Design. */
  DISCORD_INVITE:   "",
  CALCOM_BOOKING:   "",  // ex: https://cal.com/stackprotocol/coaching (RDV visios + coaching)
  STRIPE_PORTAL:    "",  // Portail client Stripe (optionnel)
  SUPPORT_EMAIL:    "contact@stackprotocol.fr",

  /* ---- Repli quand un lien n'est pas (encore) renseigné ---- */
  FALLBACK: "mailto:contact@stackprotocol.fr?subject=Demande%20StackProtocol"
};

(function () {
  function resolve(key) {
    var cfg = window.SP_CONFIG || {};
    if (cfg._ALIAS && cfg._ALIAS[key]) key = cfg._ALIAS[key];
    var v = cfg[key] || "";
    if (key === "SUPPORT_EMAIL" && v) return "mailto:" + v;
    return v;
  }
  function wire() {
    var cfg = window.SP_CONFIG || {};
    var fb = cfg.FALLBACK || "#";
    document.querySelectorAll("[data-checkout]").forEach(function (a) {
      var url = resolve(a.getAttribute("data-checkout"));
      if (url) {
        a.setAttribute("href", url);
        a.setAttribute("rel", "nofollow");
        a.removeAttribute("data-pending");
      } else {
        a.setAttribute("href", fb);
        a.setAttribute("data-pending", "1");
        a.setAttribute("title", "Paiement bientôt disponible — écris-nous en attendant.");
      }
    });
    document.querySelectorAll("[data-link]").forEach(function (a) {
      var url = resolve(a.getAttribute("data-link"));
      if (url) {
        a.setAttribute("href", url);
        if (url.indexOf("http") === 0) { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener noreferrer"); }
        a.removeAttribute("data-pending");
      } else {
        a.setAttribute("href", fb);
        a.setAttribute("data-pending", "1");
        a.setAttribute("title", "Lien bientôt disponible.");
      }
    });
  }
  if (document.readyState !== "loading") wire();
  else document.addEventListener("DOMContentLoaded", wire);
})();
