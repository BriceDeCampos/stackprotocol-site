/*!
 * auth-guard.js — Authentification front StackProtocol (Phase 0.6)
 * StackProtocol · 2026-06-19
 *
 * Backend-first :
 *  - Pages protégées (<body data-sp-protect="true">) : vérifie la session réelle
 *    via GET {API}/api/account/me (cookie httpOnly). 401 → redirige vers /login.html.
 *  - Hydrate [data-sp-user-email] / [data-sp-user-initial] / [data-account="email"|"tier"].
 *  - Bascule [data-when="can-download"] / [data-when="no-download"].
 *  - Câble les boutons [data-download="octans"] vers le téléchargement authentifié.
 *  - Connexion : SPAuth.requestMagicLink(email) → POST {API}/api/auth/request.
 *  - Déconnexion : POST {API}/api/auth/logout.
 *
 * Dégradé DEV : si le backend est injoignable, on retombe sur un mock localStorage
 * (Phase 0.5) pour ne pas bloquer le développement sans backend.
 */
(function () {
  "use strict";

  var KEY = "sp_demo_user";
  var TTL_MS = 7 * 24 * 60 * 60 * 1000;
  var LOGIN = "/login.html";

  function apiBase() {
    if (window.SP_API_BASE) return window.SP_API_BASE;
    var h = location.hostname;
    return (h === "localhost" || h === "127.0.0.1" || h === "")
      ? "http://localhost:8000"
      : "https://api.stackprotocol.fr";
  }
  function api(path) { return apiBase() + path; }

  // ---------- Mock localStorage (fallback dev uniquement) ----------
  function mockGet() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (!s || !s.expiresAt || s.expiresAt < Date.now()) { localStorage.removeItem(KEY); return null; }
      return s;
    } catch (e) { return null; }
  }

  // ---------- API publique ----------
  window.SPAuth = {
    // Demande un magic link réel (flux de connexion passwordless).
    requestMagicLink: function (email) {
      return fetch(api("/api/auth/request"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email }),
      });
    },

    // Mock dev (conservé pour rétro-compat ; sans effet en prod côté backend).
    signIn: function (email) {
      if (!email || email.indexOf("@") < 1) return false;
      try {
        localStorage.setItem(KEY, JSON.stringify({
          email: email, signedAt: Date.now(), expiresAt: Date.now() + TTL_MS, version: "mock-0.6",
        }));
      } catch (e) { return false; }
      return true;
    },
    getUser: mockGet,

    signOut: function () {
      fetch(api("/api/auth/logout"), { method: "POST", credentials: "include" })
        .catch(function () {})
        .finally(function () {
          try { localStorage.removeItem(KEY); localStorage.removeItem(LOGIN_AT_KEY); } catch (e) {}
          location.href = LOGIN;
        });
    },

    redirectAfterLogin: function () {
      var qs = new URLSearchParams(location.search);
      var next = qs.get("next");
      location.href = (next && next.indexOf("http") !== 0)
        ? decodeURIComponent(next)
        : "/account/welcome.html";
    },

    hydrate: function (data) { hydrate(data); },
  };

  // ---------- Session réelle ----------
  function fetchSession() {
    return fetch(api("/api/account/me"), { credentials: "include" }).then(function (r) {
      if (r.status === 401) return { auth: false };
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json().then(function (d) { return { auth: true, data: d }; });
    });
  }

  function setText(sel, value) {
    document.querySelectorAll(sel).forEach(function (el) { el.textContent = value; });
  }
  function toggle(sel, show) {
    document.querySelectorAll(sel).forEach(function (el) { el.hidden = !show; });
  }

  // ---------- Date / heure de connexion (affichée partout) ----------
  var LOGIN_AT_KEY = "sp_login_at";
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function formatLoginAt(ts) {
    var d = new Date(ts);
    return pad2(d.getDate()) + "/" + pad2(d.getMonth() + 1) + "/" + d.getFullYear() +
      " à " + pad2(d.getHours()) + "h" + pad2(d.getMinutes());
  }
  function renderLoginTime() {
    var ts = null;
    try { ts = localStorage.getItem(LOGIN_AT_KEY); } catch (e) {}
    // La page d'accueil post-connexion (welcome) fixe l'heure de connexion.
    var isWelcome = /welcome/.test(location.pathname);
    if (isWelcome || !ts) {
      ts = String(Date.now());
      try { localStorage.setItem(LOGIN_AT_KEY, ts); } catch (e) {}
    }
    var label = "Connecté · " + formatLoginAt(Number(ts));
    var filled = false;
    document.querySelectorAll("[data-sp-login]").forEach(function (el) {
      el.textContent = label; filled = true;
    });
    // Auto-injection sous le bloc utilisateur si pas de hook explicite.
    document.querySelectorAll("[data-sp-user-email]").forEach(function (em) {
      var box = em.parentElement;
      if (box && !box.querySelector(".sp-login-at")) {
        var div = document.createElement("div");
        div.className = "sp-login-at";
        div.setAttribute("data-sp-login", "");
        div.style.cssText = "font-size:11px;color:var(--muted-2,#8a8f8f);margin-top:3px;";
        div.textContent = label;
        box.appendChild(div);
      }
    });
  }

  function hydrate(d) {
    if (!d) return;
    var email = d.email || "";
    setText('[data-sp-user-email]', email);
    setText('[data-account="email"]', email);
    setText('[data-sp-user-initial]', (email[0] || "U").toUpperCase());
    var tier = (d.orders && d.orders.length) ? d.orders[0].product_key : "—";
    setText('[data-account="tier"]', tier);
    toggle('[data-when="can-download"]', !!d.can_download_octans);
    toggle('[data-when="no-download"]', !d.can_download_octans);
    renderLoginTime();
  }

  function redirectLogin() {
    location.href = LOGIN + "?next=" + encodeURIComponent(location.pathname + location.search);
  }

  // ---------- Téléchargement authentifié du bundle Octans ----------
  function wireDownloads() {
    document.querySelectorAll('[data-download="octans"]').forEach(function (el) {
      if (el.dataset.spWired) return;
      el.dataset.spWired = "1";
      el.addEventListener("click", function (e) {
        e.preventDefault();
        downloadOctans();
      });
    });
  }

  // Câble les liens « Se déconnecter » (.logout / [data-sp-logout]) vers la vraie
  // déconnexion (POST /api/auth/logout + purge locale), partout, sans éditer les pages.
  function wireLogout() {
    document.querySelectorAll('.logout, [data-sp-logout]').forEach(function (el) {
      if (el.dataset.spLogoutWired) return;
      el.dataset.spLogoutWired = "1";
      el.addEventListener("click", function (e) {
        e.preventDefault();
        if (window.SPAuth && window.SPAuth.signOut) window.SPAuth.signOut();
      });
    });
  }

  function downloadOctans() {
    fetch(api("/api/account/download/octans"), { credentials: "include" })
      .then(function (r) {
        if (r.status === 401) { redirectLogin(); return null; }
        if (r.status === 403) { alert("Cet accès n'est pas inclus dans ta commande."); return null; }
        if (r.status === 404) { alert("Bundle momentanément indisponible — réessaie dans un instant."); return null; }
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.blob();
      })
      .then(function (blob) {
        if (!blob) return;
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url; a.download = "octans.zip";
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
      })
      .catch(function (err) {
        console.error("[auth-guard] download:", err);
        alert("Téléchargement impossible pour le moment.");
      });
  }

  // ---------- Auto-guard ----------
  // Anti-flash : la page protégée est cachée par CSS (body[data-sp-protect]) ;
  // on ne RÉVÈLE (.sp-ready) qu'une fois la session confirmée. Sur 401 → redirect
  // (la page reste cachée, pas de flash du contenu protégé).
  function reveal() { document.body.classList.add("sp-ready"); }

  document.addEventListener("DOMContentLoaded", function () {
    var protectedPage = document.body && document.body.dataset && document.body.dataset.spProtect === "true";
    if (!protectedPage) { wireDownloads(); return; }

    wireLogout();

    fetchSession()
      .then(function (res) {
        if (!res.auth) { redirectLogin(); return; }
        hydrate(res.data);
        wireDownloads();
        wireLogout();
        reveal();
      })
      .catch(function () {
        // Backend injoignable → fallback dev mock
        var u = mockGet();
        if (u) {
          hydrate({ email: u.email, orders: [], can_download_octans: false });
          wireDownloads();
          wireLogout();
          reveal();
        } else {
          redirectLogin();
        }
      });
  });
})();

/* ============================================================
   Sidebar espace perso — marque l'onglet de la page courante (.on)
   ============================================================ */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var here = (location.pathname.split("/").pop() || "index.html");
    if (here === "") here = "index.html";
    document.querySelectorAll(".side .navg a.it").forEach(function (a) {
      var target = (a.getAttribute("href") || "").split("#")[0].split("/").pop();
      if (target && target === here) {
        a.classList.add("on");
        a.setAttribute("aria-current", "page");
      }
    });
  });
})();
