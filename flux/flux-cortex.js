/* Cortex Octans — module complet (toile + influx + points blancs + halo) */
(function(){
  var NS='http://www.w3.org/2000/svg', host=document.getElementById('cortex');
  if(!host) return;
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nodes=[[120,120],[160,86],[210,68],[262,64],[308,78],[344,108],[362,148],[364,192],[350,232],[322,264],[284,286],[240,296],[196,292],[156,276],[128,248],[112,212],[110,170],[170,140],[210,120],[255,110],[300,140],[322,190],[300,236],[255,256],[205,250],[165,220],[150,180],[252,182],[282,158],[230,148]];
  var C=[218,196];
  var svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 440 360');
  var defs=document.createElementNS(NS,'defs');
  defs.innerHTML='<linearGradient id="cxg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3CE5A3"/><stop offset="100%" stop-color="#18B4CC"/></linearGradient>';
  svg.appendChild(defs);
  var st=document.createElement('style');
  st.textContent='@keyframes cxspin2{to{transform:rotate(360deg)}}@keyframes cxpl2{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.35)}}@keyframes cxsf{0%{opacity:0}15%{opacity:.95}75%{opacity:.85}100%{opacity:0}}';
  document.head.appendChild(st);
  var g=document.createElementNS(NS,'g');
  if(!reduced){g.style.transformOrigin='218px 196px';g.style.animation='cxspin2 90s linear infinite';}
  // toile de fond : liens blancs très légers entre neurones voisins
  var web=document.createElementNS(NS,'g');
  for(var a=0;a<nodes.length;a++){for(var b=a+1;b<nodes.length;b++){
    var dx=nodes[a][0]-nodes[b][0],dy=nodes[a][1]-nodes[b][1],d2=dx*dx+dy*dy;
    if(d2<4900){
      var wmx=(nodes[a][0]+nodes[b][0])/2+dy*0.10,wmy=(nodes[a][1]+nodes[b][1])/2-dx*0.10;
      var wp=document.createElementNS(NS,'path');
      wp.setAttribute('d','M'+nodes[a][0]+' '+nodes[a][1]+' Q'+wmx.toFixed(1)+' '+wmy.toFixed(1)+' '+nodes[b][0]+' '+nodes[b][1]);
      wp.setAttribute('stroke','#FFFFFF');wp.setAttribute('fill','none');
      var r=Math.random(),wo;
      if(r<0.16){wo=(0.20+Math.random()*0.10);wp.setAttribute('stroke-width','1');}
      else if(r<0.45){wo=(0.08+Math.random()*0.05);wp.setAttribute('stroke-width','0.6');}
      else{wo=(0.025+Math.random()*0.03);wp.setAttribute('stroke-width','0.6');}
      wp.setAttribute('opacity',wo.toFixed(3));
      web.appendChild(wp);
    }
  }}
  g.appendChild(web);
  var paths=[];
  nodes.forEach(function(p,i){
    var mx=(C[0]+p[0])/2+(p[1]-C[1])*0.12,my=(C[1]+p[1])/2-(p[0]-C[0])*0.12;
    var path=document.createElementNS(NS,'path');
    path.setAttribute('d','M'+C[0]+' '+C[1]+' Q'+mx.toFixed(1)+' '+my.toFixed(1)+' '+p[0]+' '+p[1]);
    path.setAttribute('stroke','url(#cxg2)');path.setAttribute('stroke-width','1');path.setAttribute('fill','none');path.setAttribute('opacity','.22');
    g.appendChild(path);paths.push(path);
    var c=document.createElementNS(NS,'circle');c.setAttribute('cx',p[0]);c.setAttribute('cy',p[1]);c.setAttribute('r',i%5===0?5:3.6);c.setAttribute('fill','url(#cxg2)');
    if(!reduced){c.style.transformOrigin='center';c.style.transformBox='fill-box';c.style.animation='cxpl2 5s ease-in-out infinite';c.style.animationDelay=((i*0.37)%5).toFixed(2)+'s';}
    g.appendChild(c);
  });
  var halo=document.createElementNS(NS,'circle');halo.setAttribute('cx',C[0]);halo.setAttribute('cy',C[1]);halo.setAttribute('r',9);halo.setAttribute('fill','#E0915A');halo.style.filter='drop-shadow(0 0 10px rgba(224,145,90,.7))';
  svg.appendChild(g);svg.appendChild(halo);host.appendChild(svg);

  if(reduced) return;
  // points blancs qui parcourent la toile
  function sparkOnce(){
    if(!web.children.length) return;
    var wp=web.children[Math.floor(Math.random()*web.children.length)];
    var dot=document.createElementNS(NS,'circle');
    dot.setAttribute('r','1.3');dot.setAttribute('fill','#FFFFFF');dot.setAttribute('opacity','0');
    dot.style.filter='drop-shadow(0 0 3px rgba(255,255,255,.9)) drop-shadow(0 0 6px rgba(60,229,163,.5))';
    dot.style.animation='cxsf 2.6s ease-in-out forwards';
    var mo=document.createElementNS(NS,'animateMotion');
    mo.setAttribute('dur',(1.8+Math.random()*1.4).toFixed(2)+'s');
    mo.setAttribute('path',wp.getAttribute('d'));mo.setAttribute('fill','freeze');
    if(Math.random()<0.5){mo.setAttribute('keyPoints','1;0');mo.setAttribute('keyTimes','0;1');mo.setAttribute('calcMode','linear');}
    dot.appendChild(mo);g.appendChild(dot);mo.beginElement&&mo.beginElement();
    setTimeout(function(){dot.remove();},3400);
  }
  // influx vert / orange sur les synapses
  setInterval(function(){
    var p=paths[Math.floor(Math.random()*paths.length)];
    var orange=Math.random()<0.25;
    p.setAttribute('stroke',orange?'#F2A878':'#5FFFC0');p.setAttribute('stroke-width','2');p.setAttribute('opacity','1');
    p.style.filter='drop-shadow(0 0 7px '+(orange?'rgba(224,145,90,1)':'rgba(60,229,163,1)')+')';
    setTimeout(function(){p.setAttribute('stroke','url(#cxg2)');p.setAttribute('stroke-width','1');p.setAttribute('opacity','.22');p.style.filter='';},1500);
    sparkOnce();sparkOnce();
    var extra=2+Math.floor(Math.random()*3);
    for(var s=0;s<extra;s++) setTimeout(sparkOnce,250+Math.random()*1200);
  },1200);
})();
