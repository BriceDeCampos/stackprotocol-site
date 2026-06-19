/* ============================================================
   StackProtocol — Configuration des liens externes (v5 — gamme v3 2026-06-18)
   ------------------------------------------------------------
   ⚠ MODE TEST — ne pas mettre en prod sans bascule LIVE Stripe.

   👉 UN SEUL FICHIER À REMPLIR. Colle ici tes 5 Payment Links
      Stripe + les ressources externes ; tout le site se câble seul.

   Gamme canonique v3 — 3 offres / 5 Payment Links :
     1. Pack CDC Méthode ............ 197 €   (paiement unique)
     2. Pack CDC Méthode Réduit .....  99 €   (étudiants/DE/minima — déclaratif)
     3. Accompagnement individuel ... 147 €   (à l'heure · 1h visio Cal.com)
     4. Mises à jour — Abonnement ..   7,70 €/mois  (mineures + majeures)
     5. Mises à jour — One-shot ..... 197 €   (achat ponctuel version majeure)

   Hors Stripe : Audit Grand Compte 7 790 € HT (en pause — devis B2B au cas par cas).

   ⛔ Périmés bannis (gamme v2 — 2026-06-15) : Pack Autonomie · Pack Accompagné ·
      NOM-PALIER-247 · Coaching séance · Coaching forfait. Voir CLAUDE.md §3.
      Le bloc _ALIAS ci-dessous reroute automatiquement les anciennes clés HTML.

   ⚠ Procédure :
     1. Créer les 5 liens en MODE TEST Stripe (buy.stripe.com/test_…)
     2. Tester un achat bout-en-bout (webhook → email → zip client)
     3. Activer la case « renonciation droit de rétractation » sur les 4 produits
        numériques (Pack CDC, Réduit, MAJ abo, MAJ one-shot)
     4. Bascule LIVE

   URL de succès Stripe à régler sur :
     https://stackprotocol.fr/system/merci.html?product=<clé-produit>

   Tant qu'un lien vaut "" : repli sûr (email de contact), pas de 404.
   ============================================================ */

window.SP_CONFIG = {

  /* ---- 5 Payment Links Stripe (gamme canonique v3 — 2026-06-18) ----
     ⚠ MODE TEST (livemode:false) — remplacer par les URLs LIVE avant bascule prod. */
  STRIPE_LINK_PACK_CDC:           "https://buy.stripe.com/test_9B64gy60q4YjboD2y3dQQ00",  // Pack CDC Méthode — 197€
  STRIPE_LINK_PACK_CDC_REDUIT:    "https://buy.stripe.com/test_5kQ7sKfB0gH178negLdQQ01",  // Pack CDC Méthode Réduit — 99€ (étudiants/DE/minima)
  STRIPE_LINK_ACCOMPAGNEMENT:     "https://buy.stripe.com/test_28EcN4coOcqL8cr8WrdQQ02",  // Accompagnement individuel — 147€ / 1h (Cal.com)
  STRIPE_LINK_MAJ_ABO:            "https://buy.stripe.com/test_3cIfZgewWduP50ffkPdQQ03",  // Mises à jour — Abonnement 7,70€/mois
  STRIPE_LINK_MAJ_ONESHOT:        "https://buy.stripe.com/test_bJe6oGcoObmH1O3b4zdQQ04",  // Mises à jour — One-shot 197€ (version majeure)

  /* ---- Alias rétro-compatibilité (anciennes clés HTML → nouvelles) ----
     Permet au HTML encore non refondu de résoudre vers le bon produit
     en attendant la passe de migration complète. À retirer une fois le HTML migré. */
  _ALIAS: {
    /* Anciennes clés v2 (2026-06-15) → nouvelles clés v3 (2026-06-17) */
    STRIPE_LINK_PACK_AUTONOMIE:          "STRIPE_LINK_PACK_CDC",
    STRIPE_LINK_PACK_AUTONOMIE_REDUIT:   "STRIPE_LINK_PACK_CDC_REDUIT",
    STRIPE_LINK_PACK_AUTONOMIE_ETUDIANT: "STRIPE_LINK_PACK_CDC_REDUIT",
    STRIPE_LINK_PACK_INTERMEDIAIRE:      "STRIPE_LINK_PACK_CDC",  // [periméV2] NOM-PALIER-247 → Pack CDC
    STRIPE_LINK_PACK_ACCOMPAGNE:         "STRIPE_LINK_ACCOMPAGNEMENT",  // [periméV2] Pack Accompagné → Accompagnement individuel
    STRIPE_LINK_PACK_METIER:             "STRIPE_LINK_PACK_CDC",
    STRIPE_LINK_PACK_METIER_ACCOMPAGNE:  "STRIPE_LINK_ACCOMPAGNEMENT",
    STRIPE_LINK_COACHING_SEANCE:         "STRIPE_LINK_ACCOMPAGNEMENT",
    STRIPE_LINK_COACHING_FORFAIT:        "STRIPE_LINK_ACCOMPAGNEMENT",
    /* Anciennes clés héritées de v1 */
    STRIPE_LINK_PACK_ESSENTIEL:  "STRIPE_LINK_PACK_CDC",
    STRIPE_LINK_PACK_STANDARD:   "STRIPE_LINK_PACK_CDC",
    STRIPE_LINK_PACK_PRO:        "STRIPE_LINK_ACCOMPAGNEMENT",
    STRIPE_LINK_COACHING_DECLIC: "STRIPE_LINK_ACCOMPAGNEMENT",
    STRIPE_LINK_COACHING_SPRINT: "STRIPE_LINK_ACCOMPAGNEMENT",
    STRIPE_LINK_PACK:            "STRIPE_LINK_PACK_CDC",
    STRIPE_LINK_WEBINAR_DEC:     "STRIPE_LINK_PACK_CDC",
    STRIPE_LINK_WEBINAR_STD:     "STRIPE_LINK_PACK_CDC",
    STRIPE_LINK_WEBINAR_PRO:     "STRIPE_LINK_ACCOMPAGNEMENT",
    STRIPE_LINK_COACHING_PRO:    "STRIPE_LINK_ACCOMPAGNEMENT",
    STRIPE_LINK_PACK_AUTONOMIE_PRO: "STRIPE_LINK_PACK_CDC"
  },

  /* ---- Ressources externes ---- */
  /* DISCORD_INVITE : suspendu Phase 0.5/0.6 (cf. CLAUDE.md §3). Décision Phase 1.0. */
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
