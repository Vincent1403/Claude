/* =====================================================================
   COMP: BADGES (Partnerfilm) – Ös-Pills, Preis-Pills und Etiketten aus dem jö-System. Immer nur eins im Bild;
   jedes verwandelt sich in das nächste: Form, Breite und Farbe gleiten, Texte und Icons blenden über.
   Am Ende wird das Etikett zur Angebotskarte (BIPA, Foto, „250 Zusatz Ös auf den Einkauf“); die Ös-Pill
   landet dabei auf dem Foto.
   ===================================================================== */
const BD_DARK='#5e1708';
const BD_CAT=['#f4f1ea','#e0662e',JG_CSS,'#f4f1ea']; // Hintergrund je Kategorie: Beige (Ös-Pills), Mandarine (Preis-Pills), jö-Verlauf (Etiketten), Beige (Karte)
const BD_LIST=[
 {c:1,k:'jo',p:'',icon:1,hold:2}, // Start: nur das jö-Logo im Kreis, dann fährt die Pille auf
 {c:1,k:'jo',p:'-&#8239;25%'},{c:1,k:'jo',p:'729&#8239;€'},{c:1,k:'jo',p:'1&#8239;€ = 1&#8239;Ö'},{c:1,k:'jo',p:'400&#8239;€ Rabatt'},{c:1,k:'jo',p:'19,99&#8239;€'},
 {c:0,k:'oes',p:'250'},{c:0,k:'oes',p:'500'},{c:0,k:'oes',p:'3fach'},
 {c:2,tag:1,k:'oes',p:'250',t:'<div style="font-size:17px;font-weight:700;margin-bottom:2px">Rabatt</div><div style="font-size:66px;font-weight:800;line-height:1">5&#8239;€</div>'},
 {c:2,tag:1,k:'oes',p:'500',t:'<div style="font-size:74px;font-weight:800;line-height:1;letter-spacing:-.02em">-&#8239;20%</div>'},
 {c:2,tag:1,k:'oes',p:'250',t:'<div style="font-size:34px;font-weight:700;line-height:1.15">Bonusbox</div>'},
 {c:2,tag:1,k:'oes',p:'100',hold:2,t:'<div style="font-size:34px;font-weight:700;line-height:1.15">1 Shira<br>Bonus<br>Produkt</div>'},
 {c:3,card:1,k:'oes',p:'250',hold:4}]; // hold: Anzahl Schläge × „Pro Element“
// Angebotskarte in Basiseinheiten (Vorlage 1068 × 1018 px × 0,8, Mitte = 0/0)
const BD_CW=854,BD_CH=814,BD_CX=-BD_CW/2,BD_CY=-BD_CH/2,bdc=v=>v*.8;
const BDL=document.createElement('div');BDL.id='badgeL';BDL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;font-family:var(--font)';
const bdJo=`<svg viewBox="-6 -6 283.15 194.86" style="width:62%;overflow:visible"><g fill="#fff"><path d="${LP.J} ${LP.E}"/><circle cx="87.99" cy="16.8" r="16.8"/><circle cx="152.94" cy="16.8" r="16.8"/><circle cx="207.17" cy="16.8" r="16.8"/></g></svg>`;
BDL.innerHTML=`
<div id="bdBg" style="position:absolute;inset:0;background:${BD_CAT[0]}"></div>
<div id="bdCirc" style="position:absolute;inset:0"></div>
<div id="bdMeasure" style="position:absolute;left:0;top:0;visibility:hidden;white-space:nowrap;text-align:center"></div>
<div id="bdG" style="position:absolute;left:960px;top:540px;width:0;height:0">
 <div id="bdTag" style="position:absolute;background:${BD_DARK}"></div>
 <div id="bdCard" style="position:absolute;left:${BD_CX}px;top:${BD_CY}px;width:${BD_CW}px;height:${BD_CH}px;color:#6a1006;opacity:0">
  <img src="${PTA.bipa}" alt="" style="position:absolute;left:${bdc(82)}px;top:${bdc(70)}px;width:${bdc(92)}px;height:${bdc(92)}px;border-radius:50%">
  <div style="position:absolute;left:${bdc(200)}px;top:${bdc(116)}px;transform:translateY(-50%);font-size:${bdc(46)}px;font-weight:800">BIPA</div>
  <div style="position:absolute;right:${bdc(95)}px;top:${bdc(118)}px;transform:translateY(-50%);font-size:${bdc(27)}px;font-weight:700">Gültig bis 31.10.2026</div>
  <div class="bdImg" style="position:absolute;left:${bdc(36)}px;top:${bdc(208)}px;width:${bdc(992)}px;height:${bdc(468)}px;background:url(__BD_IMG__) center/100% auto no-repeat"></div>
  <div style="position:absolute;left:${bdc(83)}px;top:${bdc(750)}px;transform:translateY(-50%);font-size:${bdc(42)}px;font-weight:700;white-space:nowrap">250 Zusatz Ös auf den Einkauf</div>
  <div style="position:absolute;left:${bdc(82)}px;top:${bdc(822)}px;width:${bdc(124)}px;height:${bdc(124)}px;border-radius:50%;border:2px solid #6a1006;display:grid;place-items:center"><svg viewBox="0 0 24 24" style="width:46%"><path d="M12 20.5s-7.5-4.6-9.2-9.3C1.7 8 3.8 4.8 7.1 4.8c2 0 3.4 1.1 4.9 2.9 1.5-1.8 2.9-2.9 4.9-2.9 3.3 0 5.4 3.2 4.3 6.4-1.7 4.7-9.2 9.3-9.2 9.3z" fill="none" stroke="#6a1006" stroke-width="1.4" stroke-linejoin="round"/></svg></div>
  <div style="position:absolute;left:${bdc(458)}px;top:${bdc(822)}px;width:${bdc(517)}px;height:${bdc(124)}px;border-radius:999px;background:#6a1006;color:#fff;display:grid;place-items:center;font-size:${bdc(42)}px;font-weight:700">Scan erforderlich</div>
 </div>
 <div id="bdTitA" style="position:absolute;color:#fff;text-align:center;white-space:nowrap"></div><div id="bdTitB" style="position:absolute;color:#fff;text-align:center;white-space:nowrap"></div>
 <div id="bdPill" style="position:absolute;background:#fff;border-radius:999px;box-shadow:0 10px 30px rgba(94,23,8,.08)"></div>
 <div id="bdTxtA" style="position:absolute;color:${BD_DARK};font-size:34px;font-weight:700;letter-spacing:-.01em;white-space:nowrap;line-height:1"></div><div id="bdTxtB" style="position:absolute;color:${BD_DARK};font-size:34px;font-weight:700;letter-spacing:-.01em;white-space:nowrap;line-height:1"></div>
 <div id="bdIcO" style="position:absolute;width:64px;height:64px;border-radius:50%;background:${BD_DARK};display:grid;place-items:center;color:#fff"><span style="display:block;width:68%">${oesSvg('#fff').replace('class="oesg"','class="oesg" style="width:100%;height:auto;display:block"')}</span></div>
 <div id="bdIcJ" style="position:absolute;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#c8263a 0%,#e8481c 50%,#f5913f 100%);display:grid;place-items:center">${bdJo}</div>
</div>`;
$('stage').appendChild(BDL);
const BDE={bg:$('bdBg'),circ:$('bdCirc'),m:$('bdMeasure'),g:$('bdG'),tag:$('bdTag'),card:$('bdCard'),img:BDL.querySelector('.bdImg'),titA:$('bdTitA'),titB:$('bdTitB'),pill:$('bdPill'),txtA:$('bdTxtA'),txtB:$('bdTxtB'),icO:$('bdIcO'),icJ:$('bdIcJ')};
const bdSize={};function bdMeasure(html,css){const k=css+'|'+html;if(bdSize[k])return bdSize[k];BDE.m.style.cssText+=';'+css;BDE.m.innerHTML=html;return bdSize[k]={w:BDE.m.offsetWidth,h:BDE.m.offsetHeight}}
const BD_PH=80,BD_PADL=28,BD_GAP=14,BD_IC=64,BD_PADR=8;
function bdLayout(s,P){ // Geometrie eines Zustands in Basiseinheiten, Mitte = 0/0
  const tw=bdMeasure(s.p,'font-size:34px;font-weight:700;letter-spacing:-.01em;line-height:1').w,pw=BD_PADL+tw+BD_GAP+BD_IC+BD_PADR;
  if(s.card){const px=BD_CX+bdc(983)-pw,py=BD_CY+bdc(306)-BD_PH/2; // Pill rechts oben auf dem Foto
    return {tag:{x:BD_CX,y:BD_CY,w:BD_CW,h:BD_CH,rt:24,rb:24,o:1},pill:{x:px,y:py,w:pw},title:{y:BD_CY+20,o:0},card:1,sc:P.cardScale,tw}}
  if(s.icon){const w=BD_IC+2*BD_PADR,x=-w/2,y=-BD_PH/2;return {tag:{x,y,w,h:BD_PH,rt:BD_PH/2,rb:BD_PH/2,o:0},pill:{x,y,w,o:0},title:{y:y+10,o:0},card:0,sc:P.scale,tw:0}}
  if(!s.tag){const x=-pw/2,y=-BD_PH/2;return {tag:{x,y,w:pw,h:BD_PH,rt:BD_PH/2,rb:BD_PH/2,o:0},pill:{x,y,w:pw},title:{y:y+10,o:0},card:0,sc:P.scale,tw}}
  const T=bdMeasure(s.t,'font-size:34px;font-weight:700;line-height:1.15'),w=Math.max(pw+28,T.w+56),h=20+T.h+14+BD_PH+14,x=-w/2,y=-h/2;
  return {tag:{x,y,w,h,rt:6,rb:30,o:1},pill:{x:-pw/2,y:y+h-14-BD_PH,w:pw},title:{y:y+20,o:1},card:0,sc:P.scale,tw}}
const BADGES={
  key:'badges',name:'Badges',lane:'laneV5',cls:'bento',
  DEF:{beat:13.725/24,per:.5,morph:.15,scale:3,cardMorph:.6,cardScale:1.08,bounce:.1,bgDur:.45,bgLead:.6},
  params:[
    {k:'per',label:'Pro Element (Schläge)',min:.5,max:4,step:.5,fmt:v=>num(v,1),sub:'jedes Element landet auf einem Schlag und steht bis zum nächsten Wechsel; das letzte Etikett steht doppelt, die Angebotskarte viermal so lang'},
    {k:'morph',label:'Dauer Verwandlung',min:.1,max:.9,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'Form, Breite und Farbe gleiten; Texte und Icons blenden über (Slow In / Slow Out)'},
    {k:'cardMorph',label:'Dauer Verwandlung zur Karte',min:.3,max:1.5,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'Etikett wird zur weißen Angebotskarte, die Pill wandert aufs Foto, das Bild zoomt zurück'},
    {k:'scale',label:'Größe',min:1.4,max:3.2,step:.05,fmt:v=>Math.round(v*100)+' %',sub:'bezogen auf die Vorlage'},
    {k:'cardScale',label:'Größe Angebotskarte',min:.7,max:1.3,step:.01,fmt:v=>Math.round(v*100)+' %'},
    {k:'bgDur',label:'Farbwechsel über',min:.2,max:2.5,step:1/24,fmt:v=>num(v,2)+' s',sub:'neue Hintergrundfarbe schiebt sich von unten ins Bild (Slow In / Slow Out)'},
    {k:'bgLead',label:'Farbwechsel beginnt vorher',min:0,max:1,step:.05,fmt:v=>Math.round(v*100)+' %',sub:'Anteil des Farbwechsels vor der Ankunft der neuen Kategorie'},
    {k:'bounce',label:'Federn beim Landen',min:0,max:.2,step:.005,fmt:v=>Math.round(v*100)+' %',sub:'jedes Element federt beim Ankommen ganz leicht nach'}],
  model(P){const b=P.beat,n=BD_LIST.length,d=BD_LIST.map(s=>P.per*b*(s.hold||1));
    const st=[];let acc=0;d.forEach(x=>{st.push(acc);acc+=x});return {P,n,d,st,key:st[1],keyName:'erster Wechsel',total:acc}},
  show(on){BDL.style.display=on?'':'none'},
  render(M,t){const P=M.P,E=BDE,n=M.n;
    // aktueller Zustand A, nächster B, Fortschritt u (Ankunft genau auf dem Schlag)
    let a=0;for(let i=0;i<n;i++)if(t>=M.st[i])a=i;
    const b=Math.min(n-1,a+1),A=BD_LIST[a],B=BD_LIST[b],md=Math.min(B.card?P.cardMorph:P.morph,M.d[a]*.9),tEnd=M.st[a]+M.d[a];
    const u=a<n-1&&t>tEnd-md?eIO(seg(t,tEnd-md,tEnd)):0;
    const LA=bdLayout(A,P),LB=bdLayout(B,P),L=(p,q)=>p+(q-p)*u;
    // Hintergrund: neue Kategorie wächst als Kreis hinter dem Element aus der Mitte
    // Hintergrund: eigener Übergang je Kategoriewechsel – neue Farbe fährt von unten rein, beginnt vor der Ankunft, endet danach
    let bgA=BD_CAT[A.c],bgB=null,v=0;
    for(let j=1;j<n;j++){if(BD_LIST[j].c===BD_LIST[j-1].c)continue;const T=M.st[j],w0=T-P.bgDur*P.bgLead,w1=T+P.bgDur*(1-P.bgLead);
      if(t>=w0&&t<w1){bgA=BD_CAT[BD_LIST[j-1].c];bgB=BD_CAT[BD_LIST[j].c];v=eIO(seg(t,w0,w1))}else if(t>=w1&&j<=a+1&&BD_LIST[j].c===B.c&&t<M.st[j])bgA=BD_CAT[BD_LIST[j].c]}
    E.bg.style.background=bgA;
    if(bgB){ // neue Fläche schiebt sich von unten ins Bild
      Object.assign(E.circ.style,{display:'',background:bgB,transform:`translateY(${((1-v)*100).toFixed(3)}%)`})}
    else E.circ.style.display='none';
    // leichtes Federn bei jeder Ankunft
    const hit=t-M.st[a],bump=a>0&&hit>=0&&hit<.45?P.bounce*Math.sin(hit/.45*Math.PI*1.5)*Math.exp(-hit*6):0;
    const pop=eBack(seg(t,0,.45));E.g.style.transform=`scale(${(L(LA.sc,LB.sc)*pop*(1+bump)).toFixed(4)})`;E.g.style.opacity=Math.min(1,seg(t,0,.15)).toFixed(3);
    const cd=L(LA.card,LB.card),mix=(c1,c2,f)=>{const p1=[1,3,5].map(o=>parseInt(c1.substr(o,2),16)),p2=[1,3,5].map(o=>parseInt(c2.substr(o,2),16));return `rgb(${p1.map((v,q)=>Math.round(v+(p2[q]-v)*f)).join(',')})`};
    const tg={x:L(LA.tag.x,LB.tag.x),y:L(LA.tag.y,LB.tag.y),w:L(LA.tag.w,LB.tag.w),h:L(LA.tag.h,LB.tag.h),rt:L(LA.tag.rt,LB.tag.rt),rb:L(LA.tag.rb,LB.tag.rb),o:L(LA.tag.o,LB.tag.o)};
    Object.assign(E.tag.style,{left:tg.x+'px',top:tg.y+'px',width:tg.w+'px',height:tg.h+'px',borderRadius:`${tg.rt}px ${tg.rt}px ${tg.rb}px ${tg.rb}px`,opacity:tg.o.toFixed(3),
      background:mix(BD_DARK,'#ffffff',seg(cd,0,.6)),boxShadow:cd>0?`0 ${(30*cd).toFixed(0)}px ${(70*cd).toFixed(0)}px rgba(94,23,8,${(.12*cd).toFixed(3)})`:'none'});
    // Karteninhalt kommt mit der Verwandlung; das Foto zoomt zurück
    const ci=seg(cd,.35,.9);E.card.style.opacity=ci.toFixed(3);
    {const ct=Math.max(0,tg.y-BD_CY),cl=Math.max(0,tg.x-BD_CX),cr=Math.max(0,BD_CX+BD_CW-tg.x-tg.w),cb=Math.max(0,BD_CY+BD_CH-tg.y-tg.h); // Inhalt nur innerhalb der wachsenden Karte
     E.card.style.clipPath=cd>0&&cd<1?`inset(${ct}px ${cr}px ${cb}px ${cl}px round ${tg.rt}px ${tg.rt}px ${tg.rb}px ${tg.rb}px)`:''}
    E.img.style.backgroundSize=(100*(1+.1*(1-eOut(seg(t,M.st[n-1]-.3,M.st[n-1]+1.8))))).toFixed(2)+'% auto'; // Foto zoomt im eigenen Rahmen zurück
    const pl={x:L(LA.pill.x,LB.pill.x),y:L(LA.pill.y,LB.pill.y),w:L(LA.pill.w,LB.pill.w)};
    Object.assign(E.pill.style,{left:pl.x+'px',top:pl.y+'px',width:pl.w+'px',height:BD_PH+'px',opacity:L(LA.pill.o??1,LB.pill.o??1).toFixed(3)});
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
  marks(M){return BD_LIST.map((s,i)=>[M.st[i],s.card?'Angebotskarte':(s.tag?'Etikett ':'')+s.p.replace(/&#8239;/g,' ')])},
  table(M){const F=s=>Math.round(s*FPS);return BD_LIST.map((s,i)=>[`${i+1}. ${s.card?'Angebotskarte BIPA':s.tag?'Etikett':'Pill'} ${s.p.replace(/&#8239;/g,' ')}${s.tag?' · '+s.t.replace(/<[^>]+>/g,' ').replace(/&#8239;/g,' ').replace(/\s+/g,' ').trim():''}`,`${F(M.st[i])}–${F(M.st[i]+M.d[i])}`,s.card?'Pill landet auf dem Foto, Karte steht':s.k==='oes'?'Ös-Icon':'jö-Icon im Verlauf'])},
  note:'Frames bei 24 fps ab Beginn der Subebene. Elemente nach der gelieferten Übersicht (Ös-Pills, Preis-Pills, Etiketten); das doppelte Shira-Etikett ist einmal enthalten. Am Ende die Angebotskarte nach der BIPA-Vorlage mit dem gelieferten Foto.'
};
