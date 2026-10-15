/* =====================================================================
   COMP: U-BAHN-PLAKAT (Partnerfilm, ersetzt „Sichtbar, wo eure Kund:innen sind.“) – Mockup U1 Reumannplatz,
   Plakatfläche frontal; darin eine jö × BILLA-Anzeige im Querformat, die sich aufbaut. Kamera fährt leicht heran.
   ===================================================================== */
const UB_K=887/1652; // Anzeige 1652 × 1000 → Leuchtfläche 887 × 537 px (Bühne), Bildschirm frontal
const UBL=document.createElement('div');UBL.id='ubahnL';UBL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;background:#000;font-family:var(--font)';
UBL.innerHTML=`<div id="ubCam" style="position:absolute;inset:0;transform-origin:50% 44%">
 <img src="__UBAHN__" alt="" style="position:absolute;left:0;top:0;width:1920px;height:1081px;max-width:none">
 <div style="position:absolute;left:524px;top:208px;width:887px;height:537px;overflow:hidden;background:#fff">
  <div id="ubAd" style="position:absolute;left:0;top:0;width:1652px;height:1000px;transform:scale(${UB_K});transform-origin:0 0;background:${JG_CSS};overflow:hidden;color:#fff">
   <div style="position:absolute;left:96px;top:120px;font-size:124px;font-weight:900;letter-spacing:-.02em;line-height:1.08">${['Frische Deals','bei BILLA.'].map(l=>`<div style="overflow:hidden;padding-bottom:.12em;margin-bottom:-.12em"><div class="ubLn">${l}</div></div>`).join('')}</div>
   <div id="ubPill" style="position:absolute;left:96px;top:470px;height:150px;border-radius:75px;background:#fff;display:flex;align-items:center;gap:26px;padding:0 14px 0 54px;color:#3a0a06;font-size:84px;font-weight:800;white-space:nowrap;overflow:hidden">-10&#8239;%${s2Jo(122)}</div>
   <div id="ubLogos" style="position:absolute;left:96px;top:776px;display:flex;gap:22px">${['jo','billa'].map(n=>`<div class="ubLg" style="width:132px;height:132px;border-radius:50%;overflow:hidden;box-shadow:0 12px 30px rgba(60,10,0,.25)">${n==='jo'?s2Jo(132):`<img src="${PTA.billa}" alt="" style="width:132px;height:132px;display:block">`}</div>`).join('')}</div>
   <div id="ubCard" style="position:absolute;left:1010px;top:90px;width:550px;height:910px;border-radius:90px 90px 0 0;overflow:hidden;background:#ffe600">
    <img id="ubImg" src="__WL:supermarkt__" alt="" style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;object-position:35% 50%;transform-origin:50% 40%"></div>
   <div id="ubTag" style="position:absolute;right:120px;top:150px;width:250px;padding:26px 0 22px;border-radius:10px 10px 46px 46px;background:#ffe600;color:#1a1a1a;text-align:center;font-size:96px;font-weight:800;letter-spacing:-.02em;line-height:1">-10%<div style="margin:18px auto 0;width:200px;height:84px;border-radius:42px;background:#fff;display:flex;align-items:center;justify-content:center;gap:12px;font-size:44px;color:#5e1708">500<div style="width:64px;height:64px;border-radius:50%;background:#5e1708;display:grid;place-items:center">${oesSvg('#fff').replace('class="oesg"','class="oesg" style="height:30px;width:auto"')}</div></div></div>
  </div></div></div>`;
$('stage').appendChild(UBL);
{const st=document.createElement('style');st.textContent='#ubahnL .oesw{display:inline-flex;align-items:flex-end;line-height:1}#ubahnL .oesg{display:inline-block;overflow:visible}';document.head.appendChild(st)}
const UBE={cam:$('ubCam'),ln:[...UBL.querySelectorAll('.ubLn')],pill:$('ubPill'),lg:[...UBL.querySelectorAll('.ubLg')],card:$('ubCard'),img:$('ubImg'),tag:$('ubTag')};
const UBAHN={
  key:'ubahn',name:'U-Bahn-Plakat (BILLA)',lane:'laneV4',cls:'bento',
  DEF:{push:.05,inAt:.15,dur:.9},
  params:[
    {k:'push',label:'Kamera fährt heran',min:0,max:.15,step:.005,fmt:v=>num(v*100,1)+' %'},
    {k:'inAt',label:'Anzeige baut sich auf ab',min:0,max:1.5,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'dur',label:'Dauer Aufbau je Element',min:.4,max:1.6,step:1/24,fmt:v=>Math.round(v*24)+' F'}],
  model(P){return {P,key:P.inAt,keyName:'Aufbau',total:4.0}},
  show(on){UBL.style.display=on?'':'none'},
  render(M,t){const P=M.P,E=UBE,ef=u=>eStFlow(clamp(u)),a=P.inAt,D=P.dur;
    E.cam.style.transform=`scale(${(1+P.push*eIO(seg(t,0,M.total))).toFixed(4)})`;
    {const u=ef((t-a)/D);E.card.style.transform=`translateY(${(1000*(1-u)).toFixed(1)}px)`;E.img.style.transform=`scale(${(1+.25*(1-eOut(clamp((t-a-.3*D)/2)))).toFixed(4)})`}
    E.ln.forEach((el,k)=>{const u=ef((t-a-.2-k*.08)/(.7*D));el.style.transform=`translateY(${(112*(1-u)).toFixed(1)}%)`});
    {if(!E._pw&&E.pill.offsetWidth){E._pw=E.pill.offsetWidth;E._ph=E.pill.offsetHeight}const v=ef((t-a-.55)/(.6*D)),pw=E._pw||600,ph=E._ph||150,d=(pw-ph)*(1-v);
     E.pill.style.clipPath=`inset(0 0 0 ${d.toFixed(1)}px round ${ph/2}px)`;E.pill.style.transform=`translateX(${(-d).toFixed(1)}px) scale(${eBack(seg(t,a+.45,a+.8)).toFixed(4)})`;E.pill.style.transformOrigin=`${(pw-ph/2).toFixed(0)}px 50%`}
    E.lg.forEach((el,k)=>{const q=eBack(seg(t,a+.75+k*.1,a+1.15+k*.1));el.style.transform=`scale(${q.toFixed(4)})`});
    {const u=ef((t-a-.5)/(.55*D));E.tag.style.transform=`translateY(${(40*(1-u)).toFixed(1)}px)`;E.tag.style.opacity=u.toFixed(3)}},
  marks(M){return [[M.P.inAt,'Anzeige']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P;return [['Mockup','0','U1 Reumannplatz, Plakat frontal; Kamera fährt leicht heran'],['Anzeige',`${F(P.inAt)}–${F(P.inAt+1.6)}`,'jö-Verlauf, „Frische Deals bei BILLA.“, Bildkarte mit Supermarkt-Foto und BILLA-Etikett, jö-Pill „-10 %“, Logos jö + BILLA']]},
  note:'Ersetzt die Tafel „Sichtbar, wo eure Kund:innen sind.“ (gleiche Stelle auf der Timeline).'
};
