/* =====================================================================
   COMP: SLOT „Dein jö“ (Partnerfilm) – App-Icon rechts, links rollen Namen wie in einem Spielautomaten
   (Tamaras, Sarahs, Renates …) und bleiben auf „Dein“ stehen: gelesen „Dein [jö]“.
   ===================================================================== */
const SL_SPIN=['Kians','Lenas','Jonas’','Mias','Tamaras','Sarahs','Renates','Lenas','Kians','Jonas’','Mias','Tamaras','Sarahs','Renates','Dein'];
const SL_STEP=3; // die letzten drei Namen vor „Dein“ rasten einzeln auf den Schlägen ein
const SLL=document.createElement('div');SLL.id='slotL';SLL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;font-family:var(--font)';
SLL.innerHTML=`
<div style="position:absolute;inset:0;background:${JG_CSS}"></div>
<div id="slGroup" style="position:absolute;left:0;top:0;width:1920px;height:1080px">
 <div id="slMask" style="position:absolute;top:438px;height:204px;overflow:hidden;text-align:right">
  <div id="slCol" style="will-change:transform">${SL_SPIN.map(n=>`<div class="slN" style="height:204px;line-height:204px;color:#fff;font-size:172px;font-weight:900;letter-spacing:-.025em;white-space:nowrap"><span style="display:inline-block">${n}</span></div>`).join('')}</div>
 </div>
 <div id="slIcon" style="position:absolute;top:390px;width:300px;height:300px;border-radius:68px;background:#fff;box-shadow:0 30px 70px rgba(90,20,0,.22);transform-origin:50% 60%">
  <svg viewBox="-6 -6 283.15 194.86" style="position:absolute;left:28px;top:70px;width:244px;overflow:visible"><defs><linearGradient id="slRg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#c0233a"/><stop offset=".5" stop-color="#ee2a06"/><stop offset="1" stop-color="#ff7024"/></linearGradient></defs>
   <g fill="url(#slRg)"><path d="${LP.J} ${LP.E}"/><circle cx="87.99" cy="16.8" r="16.8"/><circle cx="152.94" cy="16.8" r="16.8"/><circle cx="207.17" cy="16.8" r="16.8"/></g></svg>
 </div>
</div>`;
$('stage').appendChild(SLL);
const SLE={group:$('slGroup'),mask:$('slMask'),col:$('slCol'),icon:$('slIcon'),names:[...SLL.querySelectorAll('.slN')]};
const SLOT={
  key:'slot',name:'Slot „Dein jö“',lane:'laneV3',cls:'typo',
  DEF:{beat:13.725/24,spinFrom:.35,spinBeats:2,stepDur:.3,gap:44,size:172,center:1},
  params:[
    {k:'spinFrom',label:'Spin startet bei',min:0,max:1.5,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'App-Icon ploppt zuerst auf, dann laufen die Namen schnell durch'},
    {k:'spinBeats',label:'Schneller Spin (Schläge)',min:1,max:4,step:1,fmt:v=>String(v),sub:'danach rasten Tamaras, Sarahs, Renates auf den Schlägen ein und „Dein“ auf dem nächsten'},
    {k:'stepDur',label:'Dauer pro Einrasten',min:.12,max:.5,step:1/48,fmt:v=>Math.round(v*24)+' F',sub:'Name rollt hoch und federt leicht nach'},
    {k:'size',label:'Schriftgröße',min:110,max:220,step:2,fmt:v=>v+' px'},
    {k:'gap',label:'Abstand Name ↔ Icon',min:10,max:120,step:2,fmt:v=>v+' px'},
    {k:'center',label:'„Dein jö“ zentrieren',min:0,max:1,step:1,fmt:v=>v?'an':'aus',sub:'nach dem Landen gleitet die Gruppe in die Bildmitte'}],
  model(P){const b=P.beat,n=SL_SPIN.length,fastEnd=P.spinFrom+P.spinBeats*b; // nach dem schnellen Spin steht der erste der drei Namen
    const land=[...Array(SL_STEP+1)].map((_,i)=>fastEnd+i*b); // Ankunftszeiten: Tamaras, Sarahs, Renates, Dein
    return {P,b,n,fastEnd,land,key:land[SL_STEP],keyName:'„Dein“ steht',total:land[SL_STEP]+2*b}},
  show(on){SLL.style.display=on?'':'none'},
  render(M,t){const P=M.P,E=SLE,n=M.n,last=n-1,first=last-SL_STEP; // Index von Tamaras (erster langsamer Name)
    const H=Math.round(P.size*1.19);E.mask.style.height=H+'px';E.mask.style.top=(540-H/2)+'px';
    E.names.forEach(el=>{el.style.height=el.style.lineHeight=H+'px';el.style.fontSize=P.size+'px'});
    // Position in der Namensliste (Index, gebrochen)
    let pos,vel=0;
    if(t<P.spinFrom)pos=0;
    else if(t<M.fastEnd){const u=seg(t,P.spinFrom,M.fastEnd),e=1-Math.pow(1-u,3);pos=e*first;vel=3*Math.pow(1-u,2)*first/(M.fastEnd-P.spinFrom)}
    else{pos=first;for(let i=1;i<=SL_STEP;i++){const a=M.land[i]-P.stepDur;if(t>=a){const u=seg(t,a,M.land[i]);pos=first+i-1+eBack(u);if(u<1)vel=Math.max(vel,1.2/P.stepDur*(1-u))}}}
    E.col.style.transform=`translateY(${(-pos*H).toFixed(1)}px)`;
    E.col.style.filter=vel>2?`blur(${Math.min(14,(vel-2)*1.4).toFixed(1)}px)`:'none';
    // Breite des aktuellen Namens → Gruppe zentrieren
    const tw=el=>el.firstChild.offsetWidth,cur=E.names[Math.min(last,Math.round(pos))],wN=tw(cur),wI=300,wMax=Math.max(...E.names.map(tw));
    const landed=eIO(seg(t,M.land[SL_STEP]+.15,M.land[SL_STEP]+.85))*(P.center?1:0);
    const wUse=wMax+(wN-wMax)*landed,total=wUse+P.gap+wI,left=960-total/2;
    E.mask.style.left=left+'px';E.mask.style.width=wUse+'px';
    E.icon.style.left=(left+wUse+P.gap)+'px';
    // Icon: ploppt am Anfang, federt beim Landen von „Dein“
    const pin=eBack(seg(t,0,.45)),hit=t-M.land[SL_STEP],bump=hit>0&&hit<.5?.08*Math.sin(hit/.5*Math.PI)*Math.exp(-hit*4):0;
    E.icon.style.transform=`scale(${(pin*(1+bump)).toFixed(4)})`;E.icon.style.opacity=Math.min(1,seg(t,0,.12)).toFixed(3);
    E.mask.style.opacity=seg(t,P.spinFrom-.1,P.spinFrom+.1).toFixed(3);
  },
  marks(M){return [[M.P.spinFrom,'Spin'],...M.land.map((x,i)=>[x,i<SL_STEP?SL_SPIN[M.n-1-SL_STEP+i]:'Dein'])]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P;return [
    ['App-Icon ploppt auf','0–'+F(.45),'weiß, jö im Verlauf, 300 px'],
    ['Schneller Spin',`${F(P.spinFrom)}–${F(M.fastEnd)}`,'Namen laufen mit Bewegungsunschärfe durch und bremsen ab'],
    ...M.land.map((x,i)=>[i<SL_STEP?SL_SPIN[M.n-1-SL_STEP+i]:'„Dein“ landet',String(F(x)),'auf dem Schlag, leichter Overshoot']),
    ['Gruppe zentriert',`${F(M.land[SL_STEP]+.15)}–${F(M.land[SL_STEP]+.85)}`,'„Dein [jö]“ steht in der Bildmitte']]},
  note:'Frames bei 24 fps ab Beginn der Subebene. Gelesen wird „Tamaras jö“, „Sarahs jö“, „Renates jö“ und am Ende „Dein jö“ – das App-Icon ist das Wort jö.'
};
