/* =====================================================================
   COMP: U-BAHN-PLAKAT (Partnerfilm, ersetzt „Sichtbar, wo eure Kund:innen sind.“) – Mockup U1 Reumannplatz,
   Plakatfläche frontal; darin die jö-Mitglieder-Anzeige („Profitiere jetzt als Mitglied“), die sich aufbaut. Kamera fährt leicht heran.
   ===================================================================== */
const UB_K=887/1652; // Anzeige 1652 × 1000 → Leuchtfläche 887 × 537 px (Bühne), Bildschirm frontal
const UBL=document.createElement('div');UBL.id='ubahnL';UBL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;background:#000;font-family:var(--font)';
UBL.innerHTML=`<div id="ubCam" style="position:absolute;inset:0;transform-origin:50% 44%">
 <img src="__UBAHN__" alt="" style="position:absolute;left:0;top:0;width:1920px;height:1081px;max-width:none">
 <div style="position:absolute;left:524px;top:208px;width:887px;height:537px;overflow:hidden;background:#fff">
  <div id="ubAd" style="position:absolute;left:0;top:0;width:1652px;height:1000px;transform:scale(${UB_K});transform-origin:0 0;background:${JG_CSS};overflow:hidden;color:#fff">
   <div style="position:absolute;left:56px;top:70px;font-size:120px;font-weight:800;letter-spacing:-.015em;line-height:1.14">${['Profitiere','jetzt als','Mitglied'].map(l=>`<div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="ubLn">${l}</div></div>`).join('')}</div>
   <div class="ubLg" style="position:absolute;left:50px;top:733px;width:210px;height:210px;border-radius:50%;background:#fff;display:grid;place-items:center">${s2Jo(210).replace(/background:[^;]+;/,'background:transparent;').replace('fill="#fff"','fill="url(#ubJg)"').replaceAll('fill="#fff"','fill="url(#ubJg)"').replace('<svg ','<svg ').replace('overflow:visible">','overflow:visible"><defs><linearGradient id="ubJg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#c0233a"/><stop offset=".5" stop-color="#ee2a06"/><stop offset="1" stop-color="#ff7024"/></linearGradient></defs>')}</div>
   <div id="ubCard" style="position:absolute;left:788px;top:0;width:900px;height:1000px;border-radius:150px 0 0 0;background:#e3e0ea;overflow:hidden"></div>
   <div id="ubPts" style="position:absolute;left:620px;top:246px;width:338px;height:338px;border-radius:24px;background:#fff;color:#5e1708">
    <div style="position:absolute;left:0;right:0;top:34px;text-align:center;font-size:26px;font-weight:600">Punktestand</div>
    <svg viewBox="0 0 300 300" style="position:absolute;left:54px;top:80px;width:230px;height:230px"><defs><linearGradient id="ubRg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#c8202f"/><stop offset=".5" stop-color="#ee2a0a"/><stop offset="1" stop-color="#ff7a2a"/></linearGradient></defs>
     <circle cx="150" cy="150" r="120" fill="none" stroke="#f4f0ea" stroke-width="40"/>
     <circle id="ubArc" cx="150" cy="150" r="120" fill="none" stroke="url(#ubRg)" stroke-width="40" stroke-linecap="round" stroke-dasharray="0 1000" transform="rotate(90 150 150)"/></svg>
    <div id="ubN" style="position:absolute;left:0;right:0;top:170px;text-align:center;font-size:58px;font-weight:700;font-variant-numeric:tabular-nums">0</div></div>
   <div id="ubTag" style="position:absolute;left:1204px;top:48px;width:404px;height:252px;border-radius:126px;background:#ffb655;color:#6b1206;display:grid;place-items:center;font-size:150px;font-weight:900;letter-spacing:-.03em">-25%</div>
   <div id="ubFr" style="position:absolute;left:788px;top:0;width:900px;height:1000px;border-radius:150px 0 0 0;overflow:hidden;pointer-events:none"><img id="ubImg" src="__UBFRAU__" alt="" style="position:absolute;left:40px;top:4px;width:780px;height:1170px;max-width:none;transform-origin:50% 100%"></div>
   <div id="ubPill" style="position:absolute;left:1250px;top:766px;height:170px;border-radius:85px;background:#fff;display:flex;align-items:center;gap:30px;padding:0 12px 0 52px;color:#3a0a06;font-size:84px;font-weight:800;white-space:nowrap;overflow:hidden">250<div style="width:146px;height:146px;border-radius:50%;background:#6b1206;display:grid;place-items:center">${oesSvg('#fff').replace('class="oesg"','class="oesg" style="height:70px;width:auto"')}</div></div>
  </div></div></div>`;
$('stage').appendChild(UBL);
{const st=document.createElement('style');st.textContent='#ubahnL .oesw{display:inline-flex;align-items:flex-end;line-height:1}#ubahnL .oesg{display:inline-block;overflow:visible}';document.head.appendChild(st)}
const UBE={cam:$('ubCam'),ln:[...UBL.querySelectorAll('.ubLn')],pill:$('ubPill'),lg:[...UBL.querySelectorAll('.ubLg')],card:$('ubCard'),fr:$('ubFr'),img:$('ubImg'),tag:$('ubTag'),pts:$('ubPts'),arc:$('ubArc'),n:$('ubN')};
const UBAHN={
  key:'ubahn',name:'U-Bahn-Plakat (Mitglied)',lane:'laneV4',cls:'bento',
  DEF:{push:.05,inAt:.15,dur:.9},
  params:[
    {k:'push',label:'Kamera fährt heran',min:0,max:.15,step:.005,fmt:v=>num(v*100,1)+' %'},
    {k:'inAt',label:'Anzeige baut sich auf ab',min:0,max:1.5,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'dur',label:'Dauer Aufbau je Element',min:.4,max:1.6,step:1/24,fmt:v=>Math.round(v*24)+' F'}],
  model(P){return {P,key:P.inAt,keyName:'Aufbau',total:4.0}},
  show(on){UBL.style.display=on?'':'none'},
  render(M,t){const P=M.P,E=UBE,ef=u=>eStFlow(clamp(u)),a=P.inAt,D=P.dur;
    E.cam.style.transform=`scale(${(1+P.push*eIO(seg(t,0,M.total))).toFixed(4)})`;
    {const u=ef((t-a)/D);E.card.style.transform=E.fr.style.transform=`translateX(${(900*(1-u)).toFixed(1)}px)`;const w=ef((t-a-.15)/D);E.img.style.transform=`translateY(${(260*(1-w)).toFixed(1)}px) scale(${(1+.08*(1-eOut(clamp((t-a)/2.2)))).toFixed(4)})`}
    {const p=eBack(seg(t,a+.55,a+.95)),c=eIO(seg(t,a+.7,a+1.7)),L=2*Math.PI*120;E.pts.style.transform=`scale(${p.toFixed(4)})`;E.arc.setAttribute('stroke-dasharray',`${(L*.75*c).toFixed(1)} 1000`);E.arc.style.opacity=c>0?'1':'0';E.n.textContent=Math.round(198*c)}
    E.ln.forEach((el,k)=>{const u=ef((t-a-.2-k*.08)/(.7*D));el.style.transform=`translateY(${(112*(1-u)).toFixed(1)}%)`});
    {if(!E._pw&&E.pill.offsetWidth){E._pw=E.pill.offsetWidth;E._ph=E.pill.offsetHeight}const v=ef((t-a-.55)/(.6*D)),pw=E._pw||600,ph=E._ph||150,d=(pw-ph)*(1-v);
     E.pill.style.clipPath=`inset(0 0 0 ${d.toFixed(1)}px round ${ph/2}px)`;E.pill.style.transform=`translateX(${(-d).toFixed(1)}px) scale(${eBack(seg(t,a+.45,a+.8)).toFixed(4)})`;E.pill.style.transformOrigin=`${(pw-ph/2).toFixed(0)}px 50%`}
    E.lg.forEach((el,k)=>{const q=eBack(seg(t,a+.75+k*.1,a+1.15+k*.1));el.style.transform=`scale(${q.toFixed(4)})`});
    {const q=eBack(seg(t,a+.45,a+.85));E.tag.style.transform=`scale(${q.toFixed(4)})`}},
  marks(M){return [[M.P.inAt,'Anzeige']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P;return [['Mockup','0','U1 Reumannplatz, Plakat frontal; Kamera fährt leicht heran'],['Anzeige',`${F(P.inAt)}–${F(P.inAt+1.6)}`,'„Profitiere jetzt als Mitglied“ auf jö-Verlauf, Fliederfläche mit Frau (Freisteller), Punktestand 198, „-25%“, „250 Ös“, jö-Logo']]},
  note:'Ersetzt die Tafel „Sichtbar, wo eure Kund:innen sind.“ (gleiche Stelle auf der Timeline).'
};
