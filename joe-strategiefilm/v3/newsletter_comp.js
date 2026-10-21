/* =====================================================================
   COMP: NEWSLETTER (Partnerfilm, Kunde) – nach dem Tablet: Handy gleitet von rechts rein (Sperrbildschirm im jö-Verlauf),
   die Push-Benachrichtigung „Neuer Newsletter verfügbar“ fällt groß von oben ins Bild, wird angetippt und
   zieht sich ins Handy zurück; dort öffnet sich der Newsletter und scrollt durch. Am Ende gleitet das Handy nach links raus.
   ===================================================================== */
const NL_SW=LT_SW,NL_SH=LT_SH,NL_B=LT_B,NL_R=LT_R,NL_W=NL_SW+2*NL_B,NL_H=NL_SH+2*NL_B,NL_EW=NL_SW,NL_IH=NL_EW*9039/2480,NL_PW=900,NL_PH=NL_PW*549/1807; // Tablet wie in „Tablet“; Newsletter im Original-Seitenverhältnis (nicht verzerrt)
const NLL=document.createElement('div');NLL.id='newslL';NLL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;background:#f4f1ea;font-family:var(--font)';
NLL.innerHTML=`<div style="position:absolute;left:${(1920-NL_W)/2}px;top:${(1080-NL_H)/2}px;width:${NL_W}px;height:${NL_H}px;perspective:3200px">
 <div id="nlPhone" style="position:absolute;inset:0;transform-origin:50% 55%;transform-style:preserve-3d">
  ${[34,28,22,16,10,5].map(z=>`<div style="position:absolute;inset:0;border-radius:${NL_R+8}px;transform:translateZ(-${z}px);background:linear-gradient(135deg,#9aa0a7,#5b6168 45%,#a9aeb4 60%,#4d5359)"></div>`).join('')}
  <div style="position:absolute;inset:0;border-radius:${NL_R+8}px;background:linear-gradient(135deg,#d9dde2,#8a9098 40%,#cfd3d8 60%,#6d737b);box-shadow:0 50px 100px rgba(60,10,20,.28)"></div>
  <div style="position:absolute;inset:7px;border-radius:${NL_R+2}px;background:#111"></div>
  <div style="position:absolute;left:${NL_B}px;top:${NL_B}px;width:${NL_SW}px;height:${NL_SH}px;border-radius:${NL_R-22}px;overflow:hidden;background:#f4f1ea">
   <div style="position:absolute;left:0;right:0;top:40px;bottom:0;overflow:hidden"><img src="ooh/tablet_web.webp" alt="" style="position:absolute;left:0;top:0;width:${NL_SW}px;height:${(NL_SW*7812/2480).toFixed(1)}px;max-width:none;transform:translateY(-${Math.round(LT_SW*7812/2480-(LT_SH-40))}px)"></div>
   <div style="position:absolute;left:0;right:0;top:0;height:40px;background:#fff;display:flex;align-items:center;justify-content:center"><div style="width:360px;height:24px;border-radius:12px;background:#f0ede8;color:#8a7f78;font-size:14px;display:flex;align-items:center;justify-content:center">joe-club.at</div></div>
   <div id="nlMail" style="position:absolute;inset:0;overflow:hidden;background:#f4f1ea"><img id="nlImg" src="__NLIMG__" alt="" style="position:absolute;left:${(NL_SW-NL_EW)/2}px;top:0;width:${NL_EW}px;box-shadow:0 0 40px rgba(60,20,30,.08);height:${NL_IH.toFixed(1)}px;max-width:none;max-height:none"></div></div>
  <div style="position:absolute;left:50%;top:${NL_B/2-6}px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:#2a2c30"></div></div></div>
 <img id="nlPop" src="__NLPOP__" alt="" style="position:absolute;left:${(1920-NL_PW)/2}px;top:0;width:${NL_PW}px;height:${NL_PH.toFixed(1)}px;transform-origin:50% 50%;filter:drop-shadow(0 30px 50px rgba(60,20,30,.25))">`;
$('stage').appendChild(NLL);
const NLE={phone:$('nlPhone'),mail:$('nlMail'),img:$('nlImg'),pop:$('nlPop')};
const NEWSL={key:'newsl',name:'Newsletter',lane:'laneV4',cls:'bento',
  DEF:{len:4.5717,turn:1,popAt:.2,tapAt:.9,openDur:.45,outDur:.55,scroll:1950},
  params:[
    {k:'turn',label:'Tablet dreht sich (neuer Inhalt) über',min:.3,max:2,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'gleiches Tablet wie die Website, wechselt beim Pop-up weich den Winkel'},
    {k:'popAt',label:'Benachrichtigung fällt rein ab',min:0,max:2,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'tapAt',label:'Benachrichtigung wird angetippt ab',min:.8,max:3,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'zieht sich ins Handy, der Newsletter öffnet sich'},
    {k:'openDur',label:'Öffnen über',min:.2,max:1.2,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'scroll',label:'Scrollweite Newsletter',min:500,max:3700,step:10,fmt:v=>v+' px',sub:'ruhiger Scroll bis zum jö-Reisen-Block; höher = weiter, aber schneller'},
    {k:'outDur',label:'Tablet gleitet raus über',min:.3,max:1.2,step:1/24,fmt:v=>Math.round(v*24)+' F'}],
  model(P){return {P,key:P.tapAt,keyName:'Antippen',total:P.len}},
  show(on){NLL.style.display=on?'':'none'},
  render(M,t){const P=M.P,E=NLE,T=M.total,f=eStFlow;
    // Handy: von rechts rein (übernimmt den Schwung des Tablets), setzt sich mit weicher Drehung; am Ende nach links raus
    const w=eIO(seg(t,P.popAt-.1,P.popAt-.1+P.turn)),ox=-2300*eIO(seg(t,T-P.outDur,T+.05)),dr=seg(t,P.popAt+P.turn,T); /* startet exakt in der Endpose des Website-Tablets, dreht beim Pop-up weich in eine neue Schräglage */
    E.phone.style.transform=`translateX(${ox.toFixed(1)}px) translateY(-22px) rotateX(${(5-1*w).toFixed(2)}deg) rotateY(${(-6+14*w+2*dr).toFixed(2)}deg) rotateZ(${(-2+4.5*w+.8*dr).toFixed(2)}deg)`;
    NLL.style.background=t>T-.36?'transparent':'#f4f1ea'; /* an den Übergängen sieht man Tablet bzw. POS-Karten darunter */
    // Benachrichtigung: fällt mit Federn von oben, Antippen (kurz eindrücken), dann zieht sie sich ins Handy oben zurück
    const pin=eBack(seg(t,P.popAt,P.popAt+.5)),tap=seg(t,P.tapAt,P.tapAt+.14),pr=1-.05*Math.sin(Math.PI*tap),o=eIO(seg(t,P.tapAt+.12,P.tapAt+.12+P.openDur));
    const y0=-NL_PH-60,y1=110,y2=(1080-NL_H)/2+NL_B+30,sc=1+o*.08;
    E.pop.style.transform=`translate(${(ox*o).toFixed(1)}px,${(y0+(y1-y0)*pin+(y2-y1)*o).toFixed(1)}px) scale(${(sc*pr).toFixed(4)})`;
    E.pop.style.opacity=(1-seg(o,.7,1)).toFixed(3);E.pop.style.visibility=t<P.popAt?'hidden':'visible';
    // Newsletter: schiebt sich im Handy von unten auf, dann weich bis zum Ende scrollen
    const op=eIO(seg(t,P.tapAt+.2,P.tapAt+.2+P.openDur)),s0=P.tapAt+.2+P.openDur+.15;
    E.mail.style.transform=`translateY(${((1-op)*NL_SH).toFixed(1)}px)`;
    E.img.style.transform=`translateY(${(-Math.min(P.scroll,NL_IH-NL_SH)*eIO(seg(t,s0-.3,T-P.outDur+.1))).toFixed(1)}px)`},
  marks(M){const P=M.P;return [[0,'Tablet'],[P.popAt,'Benachrichtigung'],[P.tapAt,'Antippen'],[P.tapAt+.2+P.openDur,'Newsletter scrollt']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P,T=M.total;return [
    ['Tablet dreht sich',`${F(P.popAt-.1)}–${F(P.popAt-.1+P.turn)}`,'dasselbe Tablet wie die Website wechselt weich den Winkel, während das Pop-up kommt'],
    ['Benachrichtigung',`${F(P.popAt)}–${F(P.popAt+.5)}`,'„jö · jetzt – Neuer Newsletter verfügbar“ fällt groß von oben ins Bild (Federn)'],
    ['Antippen + Öffnen',`${F(P.tapAt)}–${F(P.tapAt+.2+P.openDur)}`,'drückt kurz ein, zieht sich ins Handy zurück; der Newsletter schiebt sich von unten auf'],
    ['Scrollen',`${F(P.tapAt+.2+P.openDur+.15)}–${F(T-P.outDur)}`,'Newsletter weich bis zum Footer'],
    ['Raus',`${F(T-P.outDur)}–${F(T)}`,'Tablet gleitet nach links raus, die POS-Karten schieben nach']]},
  note:'Newsletter (Kunde): Push-Benachrichtigung → Newsletter im Handy.'};
