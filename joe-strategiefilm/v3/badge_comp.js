/* =====================================================================
   COMP: BADGES (Partnerfilm) – Ös-Pills, Preis-Pills und Etiketten aus dem jö-System. Immer nur eins im Bild;
   jedes verwandelt sich in das nächste: Form, Breite und Farbe gleiten, Texte und Icons blenden über.
   ===================================================================== */
const BD_DARK='#5e1708';
const BD_LIST=[
 {k:'oes',p:'250'},{k:'oes',p:'500'},{k:'oes',p:'3fach'},
 {k:'jo',p:'-&#8239;25%'},{k:'jo',p:'729&#8239;€'},{k:'jo',p:'1&#8239;€ = 1&#8239;Ö'},{k:'jo',p:'400&#8239;€ Rabatt'},{k:'jo',p:'19,99&#8239;€'},
 {tag:1,k:'oes',p:'250',t:'<div style="font-size:17px;font-weight:700;margin-bottom:2px">Rabatt</div><div style="font-size:66px;font-weight:800;line-height:1">5&#8239;€</div>'},
 {tag:1,k:'oes',p:'500',t:'<div style="font-size:74px;font-weight:800;line-height:1;letter-spacing:-.02em">-&#8239;20%</div>'},
 {tag:1,k:'oes',p:'250',t:'<div style="font-size:34px;font-weight:700;line-height:1.15">Bonusbox</div>'},
 {tag:1,k:'oes',p:'100',t:'<div style="font-size:34px;font-weight:700;line-height:1.15">1 Shira<br>Bonus<br>Produkt</div>'}];
const BDL=document.createElement('div');BDL.id='badgeL';BDL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;font-family:var(--font);background:#f4f1ea';
const bdJo=`<svg viewBox="-6 -6 283.15 194.86" style="width:62%;overflow:visible"><g fill="#fff"><path d="${LP.J} ${LP.E}"/><circle cx="87.99" cy="16.8" r="16.8"/><circle cx="152.94" cy="16.8" r="16.8"/><circle cx="207.17" cy="16.8" r="16.8"/></g></svg>`;
BDL.innerHTML=`
<div id="bdMeasure" style="position:absolute;left:0;top:0;visibility:hidden;white-space:nowrap;text-align:center"></div>
<div id="bdG" style="position:absolute;left:960px;top:540px;width:0;height:0">
 <div id="bdTag" style="position:absolute;background:${BD_DARK}"></div>
 <div id="bdTitA" style="position:absolute;color:#fff;text-align:center;white-space:nowrap"></div><div id="bdTitB" style="position:absolute;color:#fff;text-align:center;white-space:nowrap"></div>
 <div id="bdPill" style="position:absolute;background:#fff;border-radius:999px;box-shadow:0 10px 30px rgba(94,23,8,.08)"></div>
 <div id="bdTxtA" style="position:absolute;color:${BD_DARK};font-size:34px;font-weight:700;letter-spacing:-.01em;white-space:nowrap;line-height:1"></div><div id="bdTxtB" style="position:absolute;color:${BD_DARK};font-size:34px;font-weight:700;letter-spacing:-.01em;white-space:nowrap;line-height:1"></div>
 <div id="bdIcO" style="position:absolute;width:64px;height:64px;border-radius:50%;background:${BD_DARK};display:grid;place-items:center;color:#fff"><span style="display:block;width:68%">${oesSvg('#fff').replace('class="oesg"','class="oesg" style="width:100%;height:auto;display:block"')}</span></div>
 <div id="bdIcJ" style="position:absolute;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#c8263a 0%,#e8481c 50%,#f5913f 100%);display:grid;place-items:center">${bdJo}</div>
</div>`;
$('stage').appendChild(BDL);
const BDE={m:$('bdMeasure'),g:$('bdG'),tag:$('bdTag'),titA:$('bdTitA'),titB:$('bdTitB'),pill:$('bdPill'),txtA:$('bdTxtA'),txtB:$('bdTxtB'),icO:$('bdIcO'),icJ:$('bdIcJ')};
const bdSize={};function bdMeasure(html,css){const k=css+'|'+html;if(bdSize[k])return bdSize[k];BDE.m.style.cssText+=';'+css;BDE.m.innerHTML=html;return bdSize[k]={w:BDE.m.offsetWidth,h:BDE.m.offsetHeight}}
const BD_PH=80,BD_PADL=28,BD_GAP=14,BD_IC=64,BD_PADR=8;
function bdLayout(s){ // Geometrie eines Zustands in Basiseinheiten, Mitte = 0/0
  const tw=bdMeasure(s.p,'font-size:34px;font-weight:700;letter-spacing:-.01em;line-height:1').w,pw=BD_PADL+tw+BD_GAP+BD_IC+BD_PADR;
  if(!s.tag){const x=-pw/2,y=-BD_PH/2;return {tag:{x,y,w:pw,h:BD_PH,rt:BD_PH/2,rb:BD_PH/2,o:0},pill:{x,y,w:pw},title:{y:y+10,o:0},tw}}
  const T=bdMeasure(s.t,'font-size:34px;font-weight:700;line-height:1.15'),w=Math.max(pw+28,T.w+56),h=20+T.h+14+BD_PH+14,x=-w/2,y=-h/2;
  return {tag:{x,y,w,h,rt:6,rb:30,o:1},pill:{x:-pw/2,y:y+h-14-BD_PH,w:pw},title:{y:y+20,o:1},tw}}
const BADGES={
  key:'badges',name:'Badges',lane:'laneV5',cls:'bento',
  DEF:{beat:13.725/24,per:2,morph:.42,scale:3},
  params:[
    {k:'per',label:'Pro Element (Schläge)',min:1,max:4,step:.5,fmt:v=>num(v,1),sub:'jedes Element landet auf einem Schlag und steht bis zum nächsten Wechsel'},
    {k:'morph',label:'Dauer Verwandlung',min:.2,max:.9,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'Form, Breite und Farbe gleiten; Texte und Icons blenden über (Slow In / Slow Out)'},
    {k:'scale',label:'Größe',min:1.4,max:3.2,step:.05,fmt:v=>Math.round(v*100)+' %',sub:'bezogen auf die Vorlage'}],
  model(P){const per=P.per*P.beat,n=BD_LIST.length;return {P,per,n,key:per,keyName:'erster Wechsel',total:n*per}},
  show(on){BDL.style.display=on?'':'none'},
  render(M,t){const P=M.P,E=BDE,n=M.n,md=Math.min(P.morph,M.per*.9);
    // aktueller Zustand A, nächster B, Fortschritt u (Ankunft genau auf dem Schlag)
    let a=Math.min(n-1,Math.max(0,Math.floor(t/M.per))),u=0;const tEnd=(a+1)*M.per;
    if(a<n-1&&t>tEnd-md){u=eIO(seg(t,tEnd-md,tEnd))}
    const b=Math.min(n-1,a+1),A=BD_LIST[a],B=BD_LIST[b],LA=bdLayout(A),LB=bdLayout(B),L=(p,q)=>p+(q-p)*u;
    const pop=eBack(seg(t,0,.45));E.g.style.transform=`scale(${(P.scale*pop).toFixed(4)})`;E.g.style.opacity=Math.min(1,seg(t,0,.15)).toFixed(3);
    const tg={x:L(LA.tag.x,LB.tag.x),y:L(LA.tag.y,LB.tag.y),w:L(LA.tag.w,LB.tag.w),h:L(LA.tag.h,LB.tag.h),rt:L(LA.tag.rt,LB.tag.rt),rb:L(LA.tag.rb,LB.tag.rb),o:L(LA.tag.o,LB.tag.o)};
    Object.assign(E.tag.style,{left:tg.x+'px',top:tg.y+'px',width:tg.w+'px',height:tg.h+'px',borderRadius:`${tg.rt}px ${tg.rt}px ${tg.rb}px ${tg.rb}px`,opacity:tg.o.toFixed(3)});
    const pl={x:L(LA.pill.x,LB.pill.x),y:L(LA.pill.y,LB.pill.y),w:L(LA.pill.w,LB.pill.w)};
    Object.assign(E.pill.style,{left:pl.x+'px',top:pl.y+'px',width:pl.w+'px',height:BD_PH+'px'});
    // Pill-Text: alter raus nach oben, neuer kommt von unten
    if(E.txtA._s!==A.p){E.txtA._s=A.p;E.txtA.innerHTML=A.p}if(E.txtB._s!==B.p){E.txtB._s=B.p;E.txtB.innerHTML=B.p}
    const same=A.p===B.p,oa=same?1:1-seg(u,0,.5),ob=same?0:seg(u,.45,1);
    Object.assign(E.txtA.style,{left:(pl.x+BD_PADL)+'px',top:(pl.y+BD_PH/2-17)+'px',opacity:oa.toFixed(3),transform:`translateY(${(same?0:-14*u).toFixed(1)}px)`});
    Object.assign(E.txtB.style,{left:(pl.x+BD_PADL)+'px',top:(pl.y+BD_PH/2-17)+'px',opacity:ob.toFixed(3),transform:`translateY(${(14*(1-u)).toFixed(1)}px)`});
    // Icon rechts in der Pill: Ös dunkel oder jö im Verlauf
    const ix=pl.x+pl.w-BD_PADR-BD_IC,iy=pl.y+(BD_PH-BD_IC)/2,oO=L(A.k==='oes'?1:0,B.k==='oes'?1:0);
    [[E.icO,oO],[E.icJ,1-oO]].forEach(([el,o])=>Object.assign(el.style,{left:ix+'px',top:iy+'px',opacity:o.toFixed(3),transform:`scale(${(.85+.15*o).toFixed(3)})`}));
    // Etikett-Titel
    const ta=A.tag?A.t:'',tb=B.tag?B.t:'';if(E.titA._s!==ta){E.titA._s=ta;E.titA.innerHTML=ta}if(E.titB._s!==tb){E.titB._s=tb;E.titB.innerHTML=tb}
    const sameT=ta===tb,ty=L(LA.title.y,LB.title.y);
    Object.assign(E.titA.style,{left:'-300px',width:'600px',top:ty+'px',opacity:(sameT?LA.title.o:LA.title.o*(1-seg(u,0,.5))).toFixed(3),transform:`translateY(${(sameT?0:-12*u).toFixed(1)}px)`});
    Object.assign(E.titB.style,{left:'-300px',width:'600px',top:ty+'px',opacity:(sameT?0:LB.title.o*seg(u,.45,1)).toFixed(3),transform:`translateY(${(12*(1-u)).toFixed(1)}px)`});
  },
  marks(M){return BD_LIST.map((s,i)=>[i*M.per,(s.tag?'Etikett ':'')+s.p.replace(/&#8239;/g,' ')])},
  table(M){const F=s=>Math.round(s*FPS),P=M.P;return BD_LIST.map((s,i)=>[`${i+1}. ${s.tag?'Etikett':'Pill'} ${s.p.replace(/&#8239;/g,' ')}${s.tag?' · '+s.t.replace(/<[^>]+>/g,' ').replace(/&#8239;/g,' ').replace(/\s+/g,' ').trim():''}`,`${F(i*M.per)}–${F((i+1)*M.per)}`,s.k==='oes'?'Ös-Icon':'jö-Icon im Verlauf'])},
  note:'Frames bei 24 fps ab Beginn der Subebene. Elemente nach der gelieferten Übersicht (Ös-Pills, Preis-Pills, Etiketten); das doppelte Shira-Etikett ist einmal enthalten. Jedes Element landet auf einem Schlag.'
};
