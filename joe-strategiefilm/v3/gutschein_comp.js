/* =====================================================================
   COMP: GUTSCHEINE IN DER APP (Partnerfilm, Kunde) – Zwischenschritt vor der Angebotswand:
   startet auf der BIPA-Karte (groß im Bild), Kamera zoomt heraus ins Handy mit dem Gutscheine-Screen,
   die Liste scrollt weiter; danach Schnitt auf die Angebotswand in der Gesamtansicht.
   ===================================================================== */
const GS_K=960/866,GS_W=420*GS_K,GS_H=960,GS_L=(1920-GS_W)/2,GS_T=60,GS_IN=18*GS_K,GS_SW=GS_W-2*GS_IN,GS_PAD=18,GS_CW=GS_SW-2*GS_PAD,GS_GAP=16,GS_Y0=175;
const GS_WA=854/814; // Seitenverhältnis der Karten in der Angebotswand (Bild füllt die Karte)
const GS_LIST=[['__WLC:penny__',GS_WA],['__WLC:adeg__',GS_WA],['__WLC:bipa_bubble__',922/879],['__WLC:bipa_bonusbox__',GS_WA],['__WLC:billa__',GS_WA],['__WLC:omv__',GS_WA],['__WLC:pearle__',GS_WA]];
const GS_BI=2,GS_TGT=[499,100,922],GS_MI=3,GS_MT=[678,216,564]; // Start: BIPA-Karte groß; Match-Cut: Bonusbox-Karte liegt exakt auf der Bonusbox in der Wand (x, y, Breite)
const GSL=document.createElement('div');GSL.id='gutschL';GSL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;background:#f4f1ea;font-family:var(--font)';
{let y=GS_Y0;const items=GS_LIST.map(([src,ar],i)=>{const h=GS_CW/ar,s=`<img class="gsItem" data-i="${i}" src="${src}" alt="" style="position:absolute;left:${GS_PAD}px;top:${y.toFixed(1)}px;width:${GS_CW.toFixed(1)}px;height:${h.toFixed(1)}px;border-radius:${i===GS_BI?22:11}px;object-fit:cover;box-shadow:0 8px 22px rgba(60,20,30,.10)">`;y+=h+GS_GAP;return s});
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
  DEF:{len:4.5717,hold:.25,zoomDur:1,scrollAt:1.5,scrollDur:1.7,matchAt:3.4},
  params:[
    {k:'hold',label:'BIPA-Karte steht',min:0,max:1,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'zoomDur',label:'Zoom raus ins Handy über',min:.4,max:1.6,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'scrollAt',label:'Liste scrollt ab',min:.5,max:3,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'scrollDur',label:'Scrollen über',min:.3,max:2.5,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'bis die Bonusbox-Karte oben steht'},
    {k:'matchAt',label:'Match-Cut: Heranfahren ab',min:2,max:4.3,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'Handy fährt heran, bis die Bonusbox-Karte exakt auf der Bonusbox der Angebotswand liegt; dann Schnitt'}],
  model(P){return {P,key:P.matchAt,keyName:'Match-Cut',total:P.len}},
  show(on){GSL.style.display=on?'':'none'},
  render(M,t){const P=M.P,E=GSE;
    const its=E.items,y=[];let acc=GS_Y0;its.forEach(im=>{y.push(acc);acc+=parseFloat(im.style.height)+GS_GAP});
    const scr=(y[GS_BI]-GS_Y0)+(y[GS_MI]-y[GS_BI])*eIO(seg(t,P.scrollAt,P.scrollAt+P.scrollDur));E.list.style.transform=`translateY(${(-scr).toFixed(1)}px)`;
    // Handy so verschieben/skalieren, dass Listeneintrag i exakt auf Zielrechteck [x,y,w] liegt
    const fit=(i,T)=>{const S=T[2]/GS_CW,lx=GS_IN+GS_PAD,ly=GS_IN+y[i]-scr;return [T[0]-GS_L-S*lx,T[1]-GS_T-S*ly,S]};
    const z=1-eIO(seg(t,P.hold,P.hold+P.zoomDur)),m=eIO(seg(t,P.matchAt,P.len-1/24)),A=fit(GS_BI,GS_TGT),B=fit(GS_MI,GS_MT);
    const tx=A[0]*z+B[0]*m,ty=A[1]*z+B[1]*m,S=1+(A[2]-1)*z+(B[2]-1)*m;
    E.phone.style.transform=`translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${S.toFixed(5)})`;
    const fo=(1-seg(z,.25,.85)).toFixed(3);E.frame.forEach(e=>e.style.opacity=fo);E.ui.forEach(e=>e.style.opacity=fo);
    its.forEach((im,i)=>{if(i!==GS_BI)im.style.opacity=fo;else im.style.boxShadow=`0 8px 22px rgba(60,20,30,${(.10*(1-z)).toFixed(3)})`})},
  marks(M){const P=M.P;return [[0,'BIPA-Karte'],[P.hold,'Zoom raus'],[P.scrollAt,'Scrollen'],[P.matchAt,'Match-Cut']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P;return [
    ['BIPA-Karte',`0–${F(P.hold)}`,'groß im Bild wie am Start der Angebotswand'],
    ['Zoom raus',`${F(P.hold)}–${F(P.hold+P.zoomDur)}`,'Kamera fährt heraus: die Karte ist ein Gutschein im Gutscheine-Screen der jö App, Rahmen und weitere Gutscheine blenden ein'],
    ['Liste scrollt',`${F(P.scrollAt)}–${F(P.scrollAt+P.scrollDur)}`,'bis die Bonusbox-Karte oben steht'],
    ['Match-Cut',`${F(P.matchAt)}–${F(P.len)}`,'Handy fährt heran, die Bonusbox-Karte landet exakt auf der Bonusbox der Angebotswand; harter Schnitt']]},
  note:'Zwischenschritt vor der Angebotswand (Kunde): Gutscheine in der App auf dem Handy.'};
