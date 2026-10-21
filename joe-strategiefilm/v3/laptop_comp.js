/* =====================================================================
   COMP: TABLET (Partnerfilm, Kunde) – Tablet-Mockup im Stil des Handy-Mockups (Metallrahmen mit Tiefe,
   schwarzer Rand), kommt gedreht rein und setzt sich mit weicher Drehung; darin scrollt eine Website (Platzhalter).
   ===================================================================== */
const LT_SW=1240,LT_SH=830,LT_B=34,LT_R=58; // Bildschirmfläche (Inhalt), Rand, Radius
const LT_BLK=(w,h,c='#e4e1ea',r=14,ex='')=>`<div style="width:${w};height:${h}px;border-radius:${r}px;background:${c};${ex}"></div>`;
const LT_SITE=`<img id="ltSite" src="__TABWEB__" alt="" style="position:absolute;left:0;top:0;width:${LT_SW}px;height:${(LT_SW*7812/2480).toFixed(1)}px;max-width:none">`; // Kunde: echte Website (Web.pdf)
const LTL=document.createElement('div');LTL.id='laptopL';LTL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;background:#f4f1ea;font-family:var(--font)';
{const W=LT_SW+2*LT_B,H=LT_SH+2*LT_B;
 LTL.innerHTML=`<div style="position:absolute;left:${(1920-W)/2}px;top:${(1080-H)/2}px;width:${W}px;height:${H}px;perspective:3200px">
 <div id="ltTab" style="position:absolute;inset:0;transform-origin:50% 55%;transform-style:preserve-3d">
  ${[34,28,22,16,10,5].map(z=>`<div style="position:absolute;inset:0;border-radius:${LT_R+8}px;transform:translateZ(-${z}px);background:linear-gradient(135deg,#9aa0a7,#5b6168 45%,#a9aeb4 60%,#4d5359)"></div>`).join('')}
  <div style="position:absolute;inset:0;border-radius:${LT_R+8}px;background:linear-gradient(135deg,#d9dde2,#8a9098 40%,#cfd3d8 60%,#6d737b);box-shadow:0 50px 100px rgba(60,10,20,.28)"></div>
  <div style="position:absolute;inset:7px;border-radius:${LT_R+2}px;background:#111"></div>
  <div style="position:absolute;left:${LT_B}px;top:${LT_B}px;width:${LT_SW}px;height:${LT_SH}px;border-radius:${LT_R-22}px;overflow:hidden;background:#f4f1ea">
   <div style="position:absolute;left:0;right:0;top:0;height:40px;background:#fff;display:flex;align-items:center;justify-content:center;z-index:2"><div style="width:360px;height:24px;border-radius:12px;background:#f0ede8;color:#8a7f78;font-size:14px;display:flex;align-items:center;justify-content:center">joe-club.at</div></div>
   <div style="position:absolute;left:0;right:0;top:40px;bottom:0;overflow:hidden">${LT_SITE}</div></div>
  <div style="position:absolute;left:50%;top:${LT_B/2-6}px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:#2a2c30"></div></div></div>`;}
$('stage').appendChild(LTL);
const LTE={tab:$('ltTab'),site:$('ltSite')};
const LAPTOP={key:'laptop',name:'Tablet (Platzhalter)',lane:'laneV4',cls:'bento',
  DEF:{len:4.575,inDur:1.1,scrollAt:.7,scrollDur:3.75,scroll:Math.round(LT_SW*7812/2480-(LT_SH-40))},
  params:[
    {k:'inDur',label:'Tablet kommt rein und setzt sich über',min:.2,max:1.5,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'scrollAt',label:'Scrollen ab',min:0,max:2,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'scrollDur',label:'Scrollen über',min:.5,max:6,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'scroll',label:'Scrollweite',min:200,max:3200,step:10,fmt:v=>v+' px'}],
  model(P){return {P,key:P.scrollAt,keyName:'Scrollen',total:P.len}},
  show(on){LTL.style.display=on?'':'none'},
  render(M,t){const P=M.P,E=LTE,u=eStFlow(seg(t,0,P.inDur)),k=1-u,dr=seg(t,0,M.total); /* kommt gedreht und tiefer rein, setzt sich weich in leichte Schräglage, driftet danach minimal */
    const ox=-2100*eIO(seg(t,M.total-.6,M.total+.05));LTL.style.background=t>M.total-.36?'transparent':'#f4f1ea'; /* darunter gleiten schon die POS-Karten rein */ /* Kunde: gleitet am Ende nach links raus, POS-Karten schieben von rechts nach */
    E.tab.style.transform=`translateX(${ox.toFixed(1)}px) translateY(${(k*620-22).toFixed(1)}px) rotateX(${(5+22*k).toFixed(2)}deg) rotateY(${(-9-20*k+3*dr).toFixed(2)}deg) rotateZ(${(-3-9*k+1*dr).toFixed(2)}deg) scale(${(.92+.08*u).toFixed(4)})`;
    E.site.style.transform=`translateY(${(-P.scroll*eIO(seg(t,P.scrollAt,P.scrollAt+P.scrollDur))).toFixed(1)}px)`},
  marks(M){const P=M.P;return [[0,'Tablet'],[P.scrollAt,'Scrollen']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P;return [
    ['Tablet kommt rein',`0–${F(P.inDur)}`,'kommt gedreht von unten, setzt sich mit weicher Drehung in leichte Schräglage (wie das Handy)'],
    ['Website scrollt',`${F(P.scrollAt)}–${F(P.scrollAt+P.scrollDur)}`,`Platzhalter-Website (Navigation, Hero im jö-Verlauf, Karten, Text, Footer), ${P.scroll} px weich gescrollt`]]},
  note:'Platzhalter (Kunde): Tablet-Mockup im Stil des Handys mit scrollender Website.'};
