/* ============================================================
   StackProtocol — Configuration des liens externes (v4 — gamme v2 2026-06-17)
   ------------------------------------------------------------
   ⚠ MODE TEST — ne pas mettre en prod sans bascule LIVE Stripe.

   👉 UN SEUL FICHIER À REMPLIR. Colle ici tes 6 Payment Links
      Stripe + les ressources externes ; tout le site se câble seul.

   Gamme canonique v2 — 6 Payment Links (paiement unique) :
     1. Pack Autonomie ............... 197 €
     2. Pack Autonomie Réduit ........  99 €  (étudiants/DE/minima — déclaratif)
     3. [NOM-PALIER-247] ............. 247 €  (à acter — palier intermédiaire)
     4. Pack Accompagné .............. 547 €  ⭐ Recommandé
     5. Coaching séance (1h45) ....... 197 €
     6. Coaching forfait (3 séances) . 497 €
   Hors Stripe : Audit Grand Compte 7790€ HT (devis B2B, virement bancaire).
   ⏸ Pass Série (690 €) + Webinar (47 €) = sas d'attente : pas de lien actif.

   ⚠ Procédure : créer les liens en MODE TEST Stripe d'abord (cf. checklist
     PLANNING-SESSION-2026-06-16-LOGISTIQUE-STRIPE), tester un achat de bout en bout,
     puis basculer LIVE.
   + Sur les 4 produits numériques : activer la case « renonciation au droit de
     rétractation » (contenu numérique livré) dans Stripe.

   URL de succès Stripe à régler sur :
     https://stackprotocol.fr/system/merci.html?product=<clé-produit>

   Tant qu'un lien vaut "" : repli sûr (email de contact), pas de 404.
   ============================================================ */

window.SP_CONFIG = {

  /* ---- 6 Payment Links Stripe (gamme canonique v2) ---- */
  STRIPE_LINK_PACK_AUTONOMIE:        "",  // Pack Autonomie — 197€
  STRIPE_LINK_PACK_AUTONOMIE_REDUIT: "",  // Pack Autonomie Réduit — 99€ (déclaratif)
  STRIPE_LINK_PACK_INTERMEDIAIRE:    "",  // [NOM-PALIER-247] — 247€ (renommer après arbitrage Brice)
  STRIPE_LINK_PACK_ACCOMPAGNE:       "",  // Pack Accompagné — 547€ ⭐
  STRIPE_LINK_COACHING_SEANCE:       "",  // Coaching séance 1h45 — 197€
  STRIPE_LINK_COACHING_FORFAIT:      "",  // Coaching forfait 3 séances — 497€

  /* ---- Alias rétro-compatibilité (anciennes clés HTML → nouvelles) ----
     Permet au HTML encore non refondu de résoudre vers le bon produit
     en attendant la passe de migration complète. À retirer une fois le HTML migré. */
  _ALIAS: {
    /* Anciennes clés → nouvelles clés v2 */
    STRIPE_LINK_PACK_AUTONOMIE_ETUDIANT: "STRIPE_LINK_PACK_AUTONOMIE_REDUIT",
    STRIPE_LINK_PACK_METIER:             "STRIPE_LINK_PACK_INTERMEDIAIRE",
    STRIPE_LINK_PACK_METIER_ACCOMPAGNE:  "STRIPE_LINK_PACK_ACCOMPAGNE",
    /* Anciennes clés héritées de v1 (encore plus vieux) */
    STRIPE_LINK_PACK_ESSENTIEL:  "STRIPE_LINK_PACK_AUTONOMIE",
    STRIPE_LINK_PACK_STANDARD:   "STRIPE_LINK_PACK_INTERMEDIAIRE",
    STRIPE_LINK_PACK_PRO:        "STRIPE_LINK_PACK_ACCOMPAGNE",
    STRIPE_LINK_COACHING_DECLIC: "STRIPE_LINK_COACHING_SEANCE",
    STRIPE_LINK_COACHING_SPRINT: "STRIPE_LINK_COACHING_FORFAIT",
    STRIPE_LINK_PACK:            "STRIPE_LINK_PACK_AUTONOMIE",
    STRIPE_LINK_WEBINAR_DEC:     "STRIPE_LINK_PACK_AUTONOMIE",
    STRIPE_LINK_WEBINAR_STD:     "STRIPE_LINK_PACK_INTERMEDIAIRE",
    STRIPE_LINK_WEBINAR_PRO:     "STRIPE_LINK_PACK_ACCOMPAGNE",
    STRIPE_LINK_COACHING_PRO:    "STRIPE_LINK_COACHING_FORFAIT"
    /* STRIPE_LINK_SERIE / STRIPE_LINK_PASS_SERIE : volontairement non mappés
       (Pass Série en sas) → repli email tant que non commercialisé. */
  },

  /* ---- Ressources externes ---- */
  /* DISCORD_INVITE : à activer post-arbitrage Brice si Pack [247] inclut Discord. */
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
