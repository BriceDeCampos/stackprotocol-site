/* Cortex Octans — constellation neuronale animee (module transfert) */
(function(){
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var NS = 'http://www.w3.org/2000/svg';
    var host = document.getElementById('cortex');
    var paths = [];
    if (host) {
      // silhouette cortex abstraite (vue de profil) — 30 nœuds experts
      var nodes = [
        [120,120],[160,86],[210,68],[262,64],[308,78],[344,108],[362,148],[364,192],[350,232],[322,264],
        [284,286],[240,296],[196,292],[156,276],[128,248],[112,212],[110,170],
        [170,140],[210,120],[255,110],[300,140],[322,190],[300,236],[255,256],[205,250],[165,220],
        [150,180],[252,182],[282,158],[230,148]
      ];
      var C = [218,196]; // nœud central Claude
      var svg = document.createElementNS(NS,'svg');
      svg.setAttribute('viewBox','0 0 440 360');
      var defs = document.createElementNS(NS,'defs');
      defs.innerHTML = '<linearGradient id="cxgrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3CE5A3"/><stop offset="100%" stop-color="#18B4CC"/></linearGradient>';
      svg.appendChild(defs);
      var g = document.createElementNS(NS,'g');
      if (!reduced) g.setAttribute('class','cx-rot');
      // toile de fond : liens blancs très légers entre neurones voisins
      var web = document.createElementNS(NS,'g');
      var webPaths = [];
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var dx = nodes[a][0]-nodes[b][0], dy = nodes[a][1]-nodes[b][1];
          var d2 = dx*dx + dy*dy;
          if (d2 < 4900) { // voisins < 70px
            var wmx = (nodes[a][0]+nodes[b][0])/2 + dy*0.10;
            var wmy = (nodes[a][1]+nodes[b][1])/2 - dx*0.10;
            var wp = document.createElementNS(NS,'path');
            wp.setAttribute('d','M'+nodes[a][0]+' '+nodes[a][1]+' Q'+wmx.toFixed(1)+' '+wmy.toFixed(1)+' '+nodes[b][0]+' '+nodes[b][1]);
            wp.setAttribute('class','cx-web');
            // hiérarchie organique : quelques liens privilégiés, la plupart ténus
            var r = Math.random();
            if (r < 0.16) { wp.style.setProperty('--wo', (0.20 + Math.random()*0.10).toFixed(2)); wp.classList.add('w-strong'); }
            else if (r < 0.45) { wp.style.setProperty('--wo', (0.08 + Math.random()*0.05).toFixed(2)); }
            else { wp.style.setProperty('--wo', (0.025 + Math.random()*0.03).toFixed(3)); }
            web.appendChild(wp);
            webPaths.push(wp);
          }
        }
      }
      g.appendChild(web);
      // paires (synapse + nœud) indépendantes : rétraction/repousse aléatoire douce
      nodes.forEach(function(p,i){
        var mx = (C[0]+p[0])/2 + (p[1]-C[1])*0.12;
        var my = (C[1]+p[1])/2 - (p[0]-C[0])*0.12;
        var pair = document.createElementNS(NS,'g');
        if (!reduced) {
          pair.setAttribute('class','pair-ind');
          pair.style.setProperty('--pd', (9 + Math.random()*9).toFixed(2)+'s');
          pair.style.setProperty('--pdl', (-Math.random()*14).toFixed(2)+'s');
          pair.style.setProperty('--ps', (0.82 + Math.random()*0.1).toFixed(2));
        }
        var path = document.createElementNS(NS,'path');
        path.setAttribute('d','M'+C[0]+' '+C[1]+' Q'+mx.toFixed(1)+' '+my.toFixed(1)+' '+p[0]+' '+p[1]);
        path.setAttribute('class','cx-syn');
        path.setAttribute('pathLength','100');
        pair.appendChild(path);
        paths.push(path);
        var c = document.createElementNS(NS,'circle');
        c.setAttribute('cx',p[0]); c.setAttribute('cy',p[1]);
        c.setAttribute('r', i%5===0 ? 4.6 : 3.4);
        c.setAttribute('class','cx-node' + (reduced ? '' : ' p'));
        if (!reduced) c.style.animationDelay = ((i*0.37)%5).toFixed(2)+'s';
        pair.appendChild(c);
        g.appendChild(pair);
      });
      // halo + nœud Claude (centre réduit)
      var halo = document.createElementNS(NS,'circle');
      halo.setAttribute('cx',C[0]); halo.setAttribute('cy',C[1]); halo.setAttribute('r',13);
      halo.setAttribute('class','cx-claude-halo');
      g.appendChild(halo);
      var cn = document.createElementNS(NS,'circle');
      cn.setAttribute('cx',C[0]); cn.setAttribute('cy',C[1]); cn.setAttribute('r',7.5);
      cn.setAttribute('class','cx-claude');
      g.appendChild(cn);
      svg.appendChild(g);
      host.appendChild(svg);
    }

    var paused = false;
    var fireTimer = null;

    // influx : 1 synapse à la fois, rythme calme
    function fireOnce(){
      if (paused || reduced || !paths.length) return;
      var p = paths[Math.floor(Math.random()*paths.length)];
      p.classList.remove('fire','fire-orange'); void p.getBoundingClientRect();
      p.classList.add('fire');
      if (Math.random() < 0.25) p.classList.add('fire-orange');
      setTimeout(function(){ p.classList.remove('fire','fire-orange'); }, 1700);
      // petits points lumineux voyageant sur la toile transversale (plus nombreux)
      sparkOnce(); sparkOnce();
      var extra = 2 + Math.floor(Math.random()*3); // 2 à 4 sparks additionnels échelonnés
      for (var s = 0; s < extra; s++) setTimeout(sparkOnce, 250 + Math.random()*1200);
    }
    var webG = host ? host.querySelector('svg g g') : null;
    function sparkOnce(){
      if (paused || reduced || !webG || !webG.children.length) return;
      var wp = webG.children[Math.floor(Math.random()*webG.children.length)];
      var d = wp.getAttribute('d');
      var dot = document.createElementNS(NS,'circle');
      dot.setAttribute('r','1.3');
      dot.setAttribute('class','cx-spark');
      var mo = document.createElementNS(NS,'animateMotion');
      mo.setAttribute('dur', (1.8 + Math.random()*1.4).toFixed(2)+'s');
      mo.setAttribute('path', d);
      mo.setAttribute('fill','freeze');
      if (Math.random() < 0.5) { mo.setAttribute('keyPoints','1;0'); mo.setAttribute('keyTimes','0;1'); mo.setAttribute('calcMode','linear'); }
      dot.appendChild(mo);
      webG.parentNode.appendChild(dot);
      mo.beginElement && mo.beginElement();
      setTimeout(function(){ dot.remove(); }, 3400);
    }
    if (!reduced && paths.length) fireTimer = setInterval(function(){
      fireOnce();
      if (Math.random() < 0.5) setTimeout(fireOnce, 380 + Math.random()*520);
    }, 1300);
  })();
