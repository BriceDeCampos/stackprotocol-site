/* Rendu du flux + interactions — version zones (en ligne / local) */
(function(){
  var F=window.FLUX;
  var board=document.getElementById('board');
  var wires=document.getElementById('wires');
  var NS='http://www.w3.org/2000/svg';

  function ico(c, svg, nm){
    var d=document.createElement('span'); d.className='ico';
    d.innerHTML = svg || ('<span class="mono" style="color:'+(c||'#EEF1F1')+'">'+nm.slice(0,2)+'</span>');
    return d;
  }
  function chip(opts){
    var el=document.createElement('button');
    el.className='chip'+(opts.cls?(' '+opts.cls):'');
    el.dataset.id=opts.id; el.dataset.kind=opts.kind;
    el.appendChild(ico(opts.c, opts.svg, opts.nm));
    var tx=document.createElement('span'); tx.className='tx';
    tx.innerHTML='<span class="nm">'+opts.nm+'</span>'+(opts.sub?'<span class="sub">'+opts.sub+'</span>':'');
    el.appendChild(tx);
    return el;
  }

  // remplissage des colonnes
  var sLlm=document.getElementById('stack-llm');
  F.llm.forEach(function(n){ sLlm.appendChild(chip({id:n.id,kind:'llm',nm:n.nm,c:n.c,svg:n.svg})); });

  var sMcp=document.getElementById('stack-mcp');
  F.mcp.forEach(function(n){ sMcp.appendChild(chip({id:n.id,kind:'mcp',nm:n.nm,sub:n.tools.length+' outils'})); });
  // automatisation cloud (NON connectée à Octans) — zone En ligne
  var sAuto=document.getElementById('stack-auto');
  F.auto.forEach(function(n){ sAuto.appendChild(chip({id:n.id,kind:'auto',nm:n.nm,sub:n.sub,c:n.c,svg:n.svg,cls:'auto'})); });

  var sAg=document.getElementById('stack-agents');
  F.agents.forEach(function(n){ sAg.appendChild(chip({id:n.id,kind:'agents',nm:n.nm,sub:n.sub,c:n.c,svg:n.svg})); });

  var sEd=document.getElementById('stack-editors');
  F.editors.forEach(function(n){ sEd.appendChild(chip({id:n.id,kind:'editors',nm:n.nm,sub:n.sub,c:n.c,svg:n.svg})); });

  // automatisation locale (self-hosted) — après les agents d'Octans
  var sLa=document.getElementById('stack-localauto');
  (F.localauto||[]).forEach(function(n){ sLa.appendChild(chip({id:n.id,kind:'localauto',nm:n.nm,sub:n.sub,c:n.c,svg:n.svg,cls:'auto'})); });

  // ---- géométrie ----
  function rectOf(el){
    var b=el.getBoundingClientRect(), bb=board.getBoundingClientRect();
    return {
      cx:(b.left+b.width/2 - bb.left)/bb.width*1500,
      cy:(b.top+b.height/2 - bb.top)/bb.height*730,
      left:(b.left - bb.left)/bb.width*1500,
      right:(b.right - bb.left)/bb.width*1500
    };
  }
  function wire(a,b,opts){
    opts=opts||{};
    var p=document.createElementNS(NS,'path');
    var midx=(a.x+b.x)/2;
    p.setAttribute('d','M'+a.x+' '+a.y+' C'+midx+' '+a.y+' '+midx+' '+b.y+' '+b.x+' '+b.y);
    p.setAttribute('stroke','url(#wg)');p.setAttribute('fill','none');
    p.setAttribute('stroke-width',opts.w||1.2);p.setAttribute('opacity',opts.o||.30);
    if(opts.dash) p.setAttribute('stroke-dasharray','4 5');
    wires.appendChild(p);
    return p;
  }

  function buildWires(){
    while(wires.querySelectorAll('path').length) wires.querySelector('path').remove();
    var octBox=document.getElementById('octansBox');
    var ob=rectOf(octBox);
    var llmEls=[].slice.call(document.querySelectorAll('#stack-llm .chip'));
    var mcpEls=[].slice.call(document.querySelectorAll('#stack-mcp .chip'));
    var autoEls=[].slice.call(document.querySelectorAll('#stack-auto .chip'));
    var laEls=[].slice.call(document.querySelectorAll('#stack-localauto .chip'));

    var mcpColR = mcpEls.length ? rectOf(mcpEls[0]).right : 0;
    var mcpColL = mcpEls.length ? rectOf(mcpEls[0]).left : 0;

    // LLM -> MCP (fan, en ligne)
    llmEls.forEach(function(el){ var c=rectOf(el); wire({x:c.right,y:c.cy},{x:mcpColL,y:c.cy},{o:.2,w:1}); });
    // (lien Local -> MCP retiré — remplacé par une flèche double-sens dans le DOM)
    // auto cloud (make/zapier/n8n) : online, reliés aux LLMs — JAMAIS à Octans
    autoEls.forEach(function(el){ var c=rectOf(el); wire({x:c.left,y:c.cy},{x:c.left-40,y:c.cy},{o:.18,w:1,dash:true}); });
    // (lien n8n retiré — remplacé par une flèche double-sens dans le DOM)
  }

  // ---- panneau ----
  var panel=document.getElementById('panel');
  var pIco=document.getElementById('pIco'), pKind=document.getElementById('pKind'), pName=document.getElementById('pName'),
      pDesc=document.getElementById('pDesc'), pListWrap=document.getElementById('pListWrap'),
      pItems=document.getElementById('pItems'), pListTitle=document.getElementById('pListTitle');
  var kindLabel={llm:'LLM en ligne',mcp:'Connecteur MCP',auto:'Automatisation cloud',localauto:'Automatisation locale',agents:'Exécution locale',editors:'Atelier local',octans:'Le cœur · local'};

  function openPanel(kind,id){
    document.querySelectorAll('.chip.active').forEach(function(c){c.classList.remove('active');});
    var name, svg, color, tools=null, desc=F.desc[kind]||'';
    if(kind==='octans'){ name='Octans'; desc=F.desc.octans; }
    else {
      var arr=F[kind]||[]; var data=arr.filter(function(x){return x.id===id;})[0];
      if(!data) return;
      name=data.nm; svg=data.svg; color=data.c;
      if(kind==='mcp'){ tools=data.tools; }
      desc=F.desc[kind];
      var act=document.querySelector('.chip[data-kind="'+kind+'"][data-id="'+id+'"]');
      if(act) act.classList.add('active');
    }
    pKind.textContent=kindLabel[kind]||'';
    pName.textContent=name;
    pIco.innerHTML = svg || ('<span style="font-family:var(--fd);font-weight:700;font-size:18px;color:'+(color||'#3CE5A3')+'">'+name.slice(0,2)+'</span>');
    pDesc.textContent=desc;
    if(tools){ pListWrap.hidden=false; pListTitle.textContent='Outils connectés ('+tools.length+')';
      pItems.innerHTML=tools.map(function(t){return '<span>'+t+'</span>';}).join('');
    } else pListWrap.hidden=true;
    panel.classList.add('open'); panel.setAttribute('aria-hidden','false');
  }
  function closePanel(){
    panel.classList.remove('open'); panel.setAttribute('aria-hidden','true');
    document.querySelectorAll('.chip.active').forEach(function(c){c.classList.remove('active');});
  }
  document.getElementById('pClose').addEventListener('click',closePanel);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') closePanel(); });

  board.addEventListener('click',function(e){
    var c=e.target.closest('.chip');
    if(c){ e.stopPropagation(); openPanel(c.dataset.kind,c.dataset.id); return; }
    if(e.target.closest('.octans-box')){ openPanel('octans'); }
  });

  // ---- scaling ----
  var scaler=document.getElementById('scaler');
  function fit(){
    var bw=board.offsetWidth||1400, bh=board.offsetHeight||730;
    var sw=(window.innerWidth-70)/bw, sh=(window.innerHeight-110)/bh;
    var s=Math.min(sw,sh,1); if(!isFinite(s)||s<=0) s=1;
    scaler.style.transform='translate(-50%,-50%) scale('+s.toFixed(4)+')';
  }
  function refresh(){ fit(); buildWires(); }
  window.addEventListener('resize',refresh);
  window.addEventListener('load',refresh);
  fit();
  requestAnimationFrame(function(){ fit(); requestAnimationFrame(buildWires); });
  setTimeout(refresh,200); setTimeout(refresh,600);
})();
