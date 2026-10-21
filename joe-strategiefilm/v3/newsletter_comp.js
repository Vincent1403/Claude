/* =====================================================================
   COMP: NEWSLETTER (Partnerfilm, Kunde) – nach dem Tablet: Handy gleitet von rechts rein (Sperrbildschirm im jö-Verlauf),
   die Push-Benachrichtigung „Neuer Newsletter verfügbar“ fällt groß von oben ins Bild, wird angetippt und
   zieht sich ins Handy zurück; dort öffnet sich der Newsletter und scrollt durch. Am Ende gleitet das Handy nach links raus.
   ===================================================================== */
const NL_K=1000/866,NL_W=420*NL_K,NL_H=1000,NL_IN=18*NL_K,NL_SW=NL_W-2*NL_IN,NL_SH=NL_H-2*NL_IN,NL_IH=NL_SW*3279/900,NL_PW=900,NL_PH=NL_PW*549/1807;
const NLL=document.createElement('div');NLL.id='newslL';NLL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;background:#f4f1ea;font-family:var(--font)';
NLL.innerHTML=`<div style="position:absolute;left:${(1920-NL_W)/2}px;top:${(1080-NL_H)/2}px;width:${NL_W}px;height:${NL_H}px;perspective:2600px">
 <div id="nlPhone" style="position:absolute;inset:0;transform-origin:50% 55%;transform-style:preserve-3d">
  ${[22,18,14,10,6,3].map(z=>`<div style="position:absolute;inset:0;border-radius:${70*NL_K}px;transform:translateZ(-${z}px);background:linear-gradient(135deg,#9aa0a7,#5b6168 45%,#a9aeb4 60%,#4d5359)"></div>`).join('')}
  <div style="position:absolute;inset:0;border-radius:${70*NL_K}px;background:linear-gradient(135deg,#d9dde2,#8a9098 40%,#cfd3d8 60%,#6d737b);box-shadow:0 40px 80px rgba(60,10,20,.28)"></div>
  <div style="position:absolute;inset:${6*NL_K}px;border-radius:${64*NL_K}px;background:#111"></div>
  <div style="position:absolute;inset:${NL_IN}px;border-radius:${54*NL_K}px;overflow:hidden;background:${JG_CSS}">
   <div style="position:absolute;left:0;right:0;top:120px;text-align:center;color:#fff"><div style="font-size:22px;font-weight:600;opacity:.9">Dienstag, 21. Oktober</div><div style="font-size:104px;font-weight:700;letter-spacing:-.02em;line-height:1.05">12:30</div></div>
   <div id="nlMail" style="position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;background:#f4f1ea"><img id="nlImg" src="__NLIMG__" alt="" style="position:absolute;left:0;top:0;width:${NL_SW}px;height:${NL_IH.toFixed(1)}px;max-width:none"></div></div>
  <div style="position:absolute;left:50%;top:${30*NL_K}px;width:${108*NL_K}px;height:${30*NL_K}px;margin-left:-${54*NL_K}px;border-radius:${15*NL_K}px;background:#111"></div></div></div>
 <img id="nlPop" src="__NLPOP__" alt="" style="position:absolute;left:${(1920-NL_PW)/2}px;top:0;width:${NL_PW}px;height:${NL_PH.toFixed(1)}px;transform-origin:50% 50%;filter:drop-shadow(0 30px 50px rgba(60,20,30,.25))">`;
$('stage').appendChild(NLL);
const NLE={phone:$('nlPhone'),mail:$('nlMail'),img:$('nlImg'),pop:$('nlPop')};
const NEWSL={key:'newsl',name:'Newsletter',lane:'laneV4',cls:'bento',
  DEF:{len:4.925,inDur:.75,popAt:.7,tapAt:1.65,openDur:.55,outDur:.6},
  params:[
    {k:'inDur',label:'Handy gleitet rein über',min:.3,max:1.5,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'popAt',label:'Benachrichtigung fällt rein ab',min:0,max:2,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'tapAt',label:'Benachrichtigung wird angetippt ab',min:.8,max:3,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'zieht sich ins Handy, der Newsletter öffnet sich'},
    {k:'openDur',label:'Öffnen über',min:.2,max:1.2,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'outDur',label:'Handy gleitet raus über',min:.3,max:1.2,step:1/24,fmt:v=>Math.round(v*24)+' F'}],
  model(P){return {P,key:P.tapAt,keyName:'Antippen',total:P.len}},
  show(on){NLL.style.display=on?'':'none'},
  render(M,t){const P=M.P,E=NLE,T=M.total,f=eStFlow;
    // Handy: von rechts rein (übernimmt den Schwung des Tablets), setzt sich mit weicher Drehung; am Ende nach links raus
    const u=f(seg(t,0,P.inDur)),k=1-u,ox=1150*k-2100*eIO(seg(t,T-P.outDur,T+.05)),dr=seg(t,0,T);
    E.phone.style.transform=`translateX(${ox.toFixed(1)}px) rotateY(${(-14+18*k+4*dr).toFixed(2)}deg) rotateZ(${(3+5*k-1.5*dr).toFixed(2)}deg)`;
    NLL.style.background=t>T-.36||t<.4?'transparent':'#f4f1ea'; /* an den Übergängen sieht man Tablet bzw. POS-Karten darunter */
    // Benachrichtigung: fällt mit Federn von oben, Antippen (kurz eindrücken), dann zieht sie sich ins Handy oben zurück
    const pin=eBack(seg(t,P.popAt,P.popAt+.5)),tap=seg(t,P.tapAt,P.tapAt+.14),pr=1-.05*Math.sin(Math.PI*tap),o=eIO(seg(t,P.tapAt+.12,P.tapAt+.12+P.openDur));
    const y0=-NL_PH-60,y1=150,y2=(1080-NL_H)/2+NL_IN+40,sc=(1-o)+o*(NL_SW-30)/NL_PW;
    E.pop.style.transform=`translate(${(ox*o).toFixed(1)}px,${(y0+(y1-y0)*pin+(y2-y1)*o).toFixed(1)}px) scale(${(sc*pr).toFixed(4)})`;
    E.pop.style.opacity=(1-seg(o,.7,1)).toFixed(3);E.pop.style.visibility=t<P.popAt?'hidden':'visible';
    // Newsletter: schiebt sich im Handy von unten auf, dann weich bis zum Ende scrollen
    const op=eIO(seg(t,P.tapAt+.2,P.tapAt+.2+P.openDur)),s0=P.tapAt+.2+P.openDur+.15;
    E.mail.style.transform=`translateY(${((1-op)*NL_SH).toFixed(1)}px)`;
    E.img.style.transform=`translateY(${(-(NL_IH-NL_SH)*eIO(seg(t,s0,T-P.outDur-.1))).toFixed(1)}px)`},
  marks(M){const P=M.P;return [[0,'Handy'],[P.popAt,'Benachrichtigung'],[P.tapAt,'Antippen'],[P.tapAt+.2+P.openDur,'Newsletter scrollt']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P,T=M.total;return [
    ['Handy gleitet rein',`0–${F(P.inDur)}`,'von rechts, Sperrbildschirm im jö-Verlauf, setzt sich mit weicher Drehung'],
    ['Benachrichtigung',`${F(P.popAt)}–${F(P.popAt+.5)}`,'„jö · jetzt – Neuer Newsletter verfügbar“ fällt groß von oben ins Bild (Federn)'],
    ['Antippen + Öffnen',`${F(P.tapAt)}–${F(P.tapAt+.2+P.openDur)}`,'drückt kurz ein, zieht sich ins Handy zurück; der Newsletter schiebt sich von unten auf'],
    ['Scrollen',`${F(P.tapAt+.2+P.openDur+.15)}–${F(T-P.outDur)}`,'Newsletter weich bis zum Footer'],
    ['Raus',`${F(T-P.outDur)}–${F(T)}`,'Handy gleitet nach links raus, die POS-Karten schieben nach']]},
  note:'Newsletter (Kunde): Push-Benachrichtigung → Newsletter im Handy.'};
