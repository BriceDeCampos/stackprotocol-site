/*!
 * auth-guard.js — Mock authentification front (Phase 0.5)
 * StackProtocol · 2026-06-17
 *
 * Comportement (DÉMO, à remplacer par vraie auth Phase 0.6+) :
 *  - Stocke un "user" dans localStorage à la soumission du formulaire login/inscription
 *  - Vérifie la présence du token sur les pages protégées
 *  - Redirige vers /login.html?next=<page> si pas connecté
 *
 * ⚠️ AUCUNE SÉCURITÉ RÉELLE. Mock client-only pour développement.
 *    En prod : remplacer par backend magic-link + JWT cookie.
 */
(function(){
  'use strict';

  var KEY = 'sp_demo_user';
  var TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

  // ---------- API publique ----------
  window.SPAuth = {

    // Persiste un user fictif (appelé après submit form login/inscription)
    signIn: function(email){
      if(!email || email.indexOf('@') < 1) return false;
      var session = {
        email: email,
        signedAt: Date.now(),
        expiresAt: Date.now() + TTL_MS,
        version: 'demo-1.0'
      };
      try { localStorage.setItem(KEY, JSON.stringify(session)); } catch(e){ return false; }
      return true;
    },

    // Retourne la session actuelle (ou null)
    getUser: function(){
      try {
        var raw = localStorage.getItem(KEY);
        if(!raw) return null;
        var s = JSON.parse(raw);
        if(!s || !s.expiresAt || s.expiresAt < Date.now()){
          localStorage.removeItem(KEY);
          return null;
        }
        return s;
      } catch(e){ return null; }
    },

    // Déconnexion
    signOut: function(){
      try { localStorage.removeItem(KEY); } catch(e){}
      window.location.href = '/login.html';
    },

    // Guard : redirige vers login si pas connecté
    guard: function(loginPath){
      var u = this.getUser();
      if(u) return u; // OK, retourne user
      var next = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = (loginPath || '/login.html') + '?next=' + next;
      return null;
    },

    // Helper : redirige vers next ou /account/dashboard.html après login
    redirectAfterLogin: function(){
      var qs = new URLSearchParams(window.location.search);
      var next = qs.get('next');
      if(next && next.indexOf('http') !== 0){
        window.location.href = decodeURIComponent(next);
      } else {
        window.location.href = '/account/welcome.html';
      }
    },

    // Injecte le nom/email de l'user dans les éléments [data-sp-user-*]
    hydrate: function(){
      var u = this.getUser();
      if(!u) return;
      document.querySelectorAll('[data-sp-user-email]').forEach(function(el){
        el.textContent = u.email;
      });
      document.querySelectorAll('[data-sp-user-initial]').forEach(function(el){
        el.textContent = (u.email[0] || 'U').toUpperCase();
      });
    }
  };

  // ---------- Auto-guard sur pages protégées ----------
  // Une page peut écrire <body data-sp-protect="true"> pour activer le guard automatique
  document.addEventListener('DOMContentLoaded', function(){
    var body = document.body;
    if(body && body.dataset && body.dataset.spProtect === 'true'){
      window.SPAuth.guard();
      window.SPAuth.hydrate();
    }
  });

})();
