/* =====================================================================
   COMP: GUTSCHEINE IN DER APP (Partnerfilm, Kunde) – Zwischenschritt vor der Angebotswand:
   Handy steigt auf, Gutscheine-Screen mit Liste, scrollt zur BIPA-Karte, Kamera taucht in die Karte ein,
   bis sie exakt so groß und so liegt wie am Start der Angebotswand (nahtloser Schnitt).
   ===================================================================== */
const GS_K=960/866,GS_W=420*GS_K,GS_H=960,GS_L=(1920-GS_W)/2,GS_T=60,GS_IN=18*GS_K,GS_SW=GS_W-2*GS_IN,GS_PAD=18,GS_CW=GS_SW-2*GS_PAD,GS_GAP=16,GS_Y0=175;
const GS_LIST=[['__WLC:penny__',686/670],['__WLC:adeg__',686/670],['__WLC:bipa_bubble__',922/879],['__WLC:billa__',686/670],['__WLC:omv__',686/670],['__WLC:pearle__',686/670]];
const GS_BI=2,GS_TGT=[499,100,922]; // BIPA-Karte; Ziel = Karte am Start der Angebotswand (x, y, Breite)
const GSL=document.createElement('div');GSL.id='gutschL';GSL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;background:#f4f1ea;font-family:var(--font)';
{let y=GS_Y0;const items=GS_LIST.map(([src,ar],i)=>{const h=GS_CW/ar,s=`<img class="gsItem" data-i="${i}" src="${src}" alt="" style="position:absolute;left:${GS_PAD}px;top:${y.toFixed(1)}px;width:${GS_CW.toFixed(1)}px;height:${h.toFixed(1)}px;border-radius:22px;box-shadow:0 8px 22px rgba(60,20,30,.10)">`;y+=h+GS_GAP;return s});
 GSL.innerHTML=`<div id="gsPhone" style="position:absolute;left:${GS_L.toFixed(1)}px;top:${GS_T}px;width:${GS_W.toFixed(1)}px;height:${GS_H}px;transform-origin:0 0">
  <div class="gsFrame" style="position:absolute;inset:0;border-radius:${70*GS_K}px;background:linear-gradient(135deg,#d9dde2,#8a9098 40%,#cfd3d8 60%,#6d737b);box-shadow:0 40px 80px rgba(60,10,20,.28)"></div>
  <div class="gsFrame" style="position:absolute;inset:${6*GS_K}px;border-radius:${64*GS_K}px;background:#111"></div>
  <div style="position:absolute;inset:${GS_IN}px;border-radius:${54*GS_K}px;overflow:hidden;background:#f4f1ea">
   <div id="gsList" style="position:absolute;inset:0">${items.join('')}</div>
   <div class="gsUi" style="position:absolute;left:0;right:0;top:0;height:${GS_Y0-8}px;background:#f4f1ea"></div>
   <div class="gsUi" style="position:absolute;left:30px;top:20px;color:#1d1d1b;font-size:17px;font-weight:700">12:30</div>
   <div class="gsUi" style="position:absolute;left:${GS_PAD}px;top:62px;color:#670003;font-size:36px;font-weight:800;letter-spacing:-.01em">Gutscheine</div>
   <div class="gsUi" style="position:absolute;left:${GS_PAD}px;top:118px;display:flex;gap:10px">${['Alle','Favoriten','Aktiviert'].map((l,i)=>`<div style="height:38px;padding:0 18px;border-radius:19px;display:flex;align-items:center;font-size:17px;font-weight:700;${i?'background:#fff;color:#670003':'background:#670003;color:#fff'}">${l}</div>`).join('')}</div></div>
  <div class="gsFrame" style="position:absolute;left:50%;top:${30*GS_K}px;width:${108*GS_K}px;height:${30*GS_K}px;margin-left:-${54*GS_K}px;border-radius:${15*GS_K}px;background:#111"></div>
 </div>`;}
$('stage').appendChild(GSL);
const GSE={phone:$('gsPhone'),list:$('gsList'),items:[...GSL.querySelectorAll('.gsItem')],frame:[...GSL.querySelectorAll('.gsFrame')],ui:[...GSL.querySelectorAll('.gsUi')]};
const GUTSCH={key:'gutsch',name:'Gutscheine in der App',lane:'laneV4',cls:'bento',
  DEF:{len:2.2875,inDur:.55,scrollAt:.35,scrollDur:1,zoomAt:1.45},
  params:[
    {k:'inDur',label:'Handy steigt auf über',min:.2,max:1.2,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'scrollAt',label:'Liste scrollt ab',min:0,max:1.5,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'scrollDur',label:'Scrollen über',min:.3,max:1.5,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'bis die BIPA-Karte oben steht'},
    {k:'zoomAt',label:'Eintauchen in die Karte ab',min:.8,max:2,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'endet exakt auf der Karte am Start der Angebotswand'}],
  model(P){return {P,key:P.zoomAt,keyName:'Eintauchen',total:P.len}},
  show(on){GSL.style.display=on?'':'none'},
  render(M,t){const P=M.P,E=GSE,f=eStFlow;
    const its=E.items,y=[];let acc=GS_Y0;its.forEach(im=>{y.push(acc);acc+=parseFloat(im.style.height)+GS_GAP});
    const scr=(y[GS_BI]-GS_Y0)*eIO(seg(t,P.scrollAt,P.scrollAt+P.scrollDur));E.list.style.transform=`translateY(${(-scr).toFixed(1)}px)`;
    const z=eIO(seg(t,P.zoomAt,P.len-1/24)),S=1+(GS_TGT[2]/GS_CW-1)*z,ox=GS_IN+GS_PAD,oy=GS_IN+GS_Y0;
    const tx=(GS_TGT[0]-GS_L-(GS_TGT[2]/GS_CW)*ox)*z,ty=(GS_TGT[1]-GS_T-(GS_TGT[2]/GS_CW)*oy)*z,up=(1-f(seg(t,0,P.inDur)))*1100;
    E.phone.style.transform=`translate(${tx.toFixed(2)}px,${(ty+up).toFixed(2)}px) scale(${S.toFixed(5)})`;
    const fo=(1-seg(z,.25,.85)).toFixed(3);E.frame.forEach(e=>e.style.opacity=fo);E.ui.forEach(e=>e.style.opacity=fo);
    its.forEach((im,i)=>{if(i!==GS_BI)im.style.opacity=fo;else im.style.boxShadow=`0 8px 22px rgba(60,20,30,${(.10*(1-z)).toFixed(3)})`})},
  marks(M){const P=M.P;return [[0,'Handy'],[P.scrollAt,'Scrollen'],[P.zoomAt,'Eintauchen']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P;return [
    ['Handy steigt auf',`0–${F(P.inDur)}`,'Gutscheine-Screen der jö App, Liste mit Partner-Gutscheinen'],
    ['Liste scrollt',`${F(P.scrollAt)}–${F(P.scrollAt+P.scrollDur)}`,'bis die BIPA-Karte oben steht'],
    ['Eintauchen',`${F(P.zoomAt)}–${F(P.len)}`,'Kamera fährt in die BIPA-Karte, Rahmen und andere Gutscheine blenden aus; endet exakt auf der Karte am Start der Angebotswand']]},
  note:'Zwischenschritt vor der Angebotswand (Kunde): Gutscheine in der App auf dem Handy.'};
