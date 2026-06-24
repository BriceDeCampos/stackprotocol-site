/* StackProtocol — menu gauche intra-page (auto, accessible)
   Active si la page contient ≥2 éléments [data-ln="Label"].
   IntersectionObserver pour l'état actif · smooth scroll offset 80px · drawer mobile. */
(function () {
  function init() {
    var sections = [].slice.call(document.querySelectorAll('[data-ln]'));
    if (sections.length < 2) return;
    document.body.classList.add('has-leftnav');

    var nav = document.createElement('nav');
    nav.className = 'left-nav';
    nav.setAttribute('aria-label', 'Sommaire de la page');
    var head = document.createElement('div');
    head.className = 'ln-head';
    var collapseBtn = document.createElement('button');
    collapseBtn.className = 'ln-collapse';
    collapseBtn.setAttribute('aria-label', 'Rétracter le sommaire');
    collapseBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="1.9" fill="none" stroke-linecap="round"/></svg>';
    var title = document.createElement('div');
    title.className = 'ln-title'; title.textContent = 'Sur cette page';
    head.appendChild(title); head.appendChild(collapseBtn);
    nav.appendChild(head);
    var list = document.createElement('div');
    list.className = 'ln-list'; nav.appendChild(list);


    var overlay = document.createElement('div'); overlay.className = 'ln-overlay';
    function close() { nav.classList.remove('open'); overlay.classList.remove('show'); }

    var byId = {};
    sections.forEach(function (s, i) {
      if (!s.id) s.id = 'ln-sec-' + i;
      var a = document.createElement('a');
      a.href = '#' + s.id;
      var lbl = document.createElement('span');
      lbl.className = 'ln-label';
      lbl.textContent = s.getAttribute('data-ln');
      a.appendChild(lbl);
      var cnt = s.getAttribute('data-ln-count');
      if (cnt) {
        var c = document.createElement('span');
        c.className = 'ln-count';
        c.textContent = cnt;
        a.appendChild(c);
      }
      a.setAttribute('data-target', s.id);
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var y = s.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
        history.replaceState(null, '', '#' + s.id);
        close();
      });
      list.appendChild(a);
      byId[s.id] = a;
    });

    document.body.appendChild(nav);

    var toggleWrap = document.createElement('div');
    toggleWrap.className = 'ln-toggle-wrap';
    toggleWrap.innerHTML = '<span class="ln-toggle-label">Sur cette page</span>';

    var btn = document.createElement('button');
    btn.className = 'ln-toggle';
    btn.setAttribute('aria-label', 'Ouvrir le sommaire de la page');
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="1.9" fill="none" stroke-linecap="round"/></svg>';
    toggleWrap.appendChild(btn);

    function isDesktop() { return window.matchMedia('(min-width: 1024px)').matches; }
    function setCollapsed(on) {
      document.body.classList.toggle('ln-collapsed', on);
      try { localStorage.setItem('sp_leftnav_collapsed', on ? '1' : '0'); } catch (e) {}
    }
    // restaure l'état (desktop)
    try { if (localStorage.getItem('sp_leftnav_collapsed') === '1') document.body.classList.add('ln-collapsed'); } catch (e) {}

    collapseBtn.addEventListener('click', function () {
      if (isDesktop()) setCollapsed(true);   // desktop : rétracte le rail
      else close();                          // mobile : ferme le drawer
    });
    btn.addEventListener('click', function () {
      if (isDesktop()) {                     // desktop : bascule rétracter / déployer
        setCollapsed(!document.body.classList.contains('ln-collapsed'));
      } else {                               // mobile : ouvre/ferme le drawer
        if (nav.classList.contains('open')) close();
        else { nav.classList.add('open'); overlay.classList.add('show'); }
      }
    });
    overlay.addEventListener('click', close);
    document.body.appendChild(overlay);
    document.body.appendChild(toggleWrap);

    // active state au scroll (déterministe : section dont le haut a dépassé la ligne des 90px)
    var order = sections.slice();
    function scrollY() { return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0; }
    function absTop(el) { return el.getBoundingClientRect().top + scrollY(); }
    function updateActive() {
      var pos = scrollY() + 100;
      var current = order[0];
      for (var i = 0; i < order.length; i++) {
        if (absTop(order[i]) <= pos) current = order[i];
      }
      Object.keys(byId).forEach(function (id) {
        var on = (id === current.id);
        byId[id].classList.toggle('active', on);
        if (on) byId[id].setAttribute('aria-current', 'location');
        else byId[id].removeAttribute('aria-current');
      });
    }
    var ticking = false;
    function onScroll() {
      if (ticking) return; ticking = true;
      window.requestAnimationFrame(function () { updateActive(); ticking = false; });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateActive();
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
