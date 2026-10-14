/* =====================================================================
   COMP: SLOT „Dein jö“ (Partnerfilm) – App-Icon rechts, links dreht sich eine Namensrolle wie in einem
   Spielautomaten (… Tamaras, Sarahs, Renates) und bleibt auf „Dein“ stehen: gelesen „Dein [jö]“.
   Die Namen sitzen auf einer 3D-Walze, kippen oben und unten nach hinten weg und blenden dabei aus.
   Eine einzige, durchgehende Verzögerung vom Start bis zur Landung, mit leichtem Überschwingen.
   ===================================================================== */
const SL_SPIN=['Kians','Lenas','Jonas’','Mias','Tamaras','Sarahs','Renates','Lenas','Kians','Jonas’','Mias','Tamaras','Sarahs','Renates','Dein'];
const SLL=document.createElement('div');SLL.id='slotL';SLL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;font-family:var(--font)';
SLL.innerHTML=`
<div style="position:absolute;inset:0;background:${JG_CSS}"></div>
<div id="slGroup" style="position:absolute;left:0;top:0;width:1920px;height:1080px">
 <div id="slWheel" style="position:absolute;top:0;height:1080px;perspective:1700px;transform-style:preserve-3d">
  ${SL_SPIN.map(n=>`<div class="slN" style="position:absolute;right:0;color:#fff;font-weight:900;letter-spacing:-.025em;white-space:nowrap;backface-visibility:hidden;will-change:transform,opacity"><span style="display:inline-block">${n}</span></div>`).join('')}
 </div>
 <div id="slIcon" style="position:absolute;top:390px;width:300px;height:300px;border-radius:68px;background:#fff;box-shadow:0 30px 70px rgba(90,20,0,.22);transform-origin:50% 60%">
  <svg viewBox="-6 -6 283.15 194.86" style="position:absolute;left:28px;top:70px;width:244px;overflow:visible"><defs><linearGradient id="slRg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#c0233a"/><stop offset=".5" stop-color="#ee2a06"/><stop offset="1" stop-color="#ff7024"/></linearGradient></defs>
   <g fill="url(#slRg)"><path d="${LP.J} ${LP.E}"/><circle cx="87.99" cy="16.8" r="16.8"/><circle cx="152.94" cy="16.8" r="16.8"/><circle cx="207.17" cy="16.8" r="16.8"/></g></svg>
 </div>
</div>`;
$('stage').appendChild(SLL);
const SLE={wheel:$('slWheel'),icon:$('slIcon'),names:[...SLL.querySelectorAll('.slN')]};
const slPos=(u,last,p,k)=>last*(1-Math.pow(1-u,p))+k*Math.sin(Math.PI*u)*Math.pow(u,8); // schnell los, durchgehend langsamer; k = kurz über „Dein“ hinaus und zurück (in Namen)
const SLOT={
  key:'slot',name:'Slot „Dein jö“',lane:'laneV3',cls:'typo',
  DEF:{beat:13.725/24,spinFrom:.35,landBeat:5,pow:2.2,kick:.35,angle:30,size:172,gap:44,center:1},
  params:[
    {k:'spinFrom',label:'Walze startet bei',min:0,max:1.5,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'App-Icon ploppt zuerst auf, dann dreht sich die Walze los'},
    {k:'landBeat',label:'„Dein“ landet auf Schlag',min:3,max:7,step:1,fmt:v=>String(v),sub:'gezählt ab Clipbeginn; dazwischen bremst die Walze in einer einzigen Bewegung ab'},
    {k:'pow',label:'Abbremsen',min:1.5,max:4,step:.1,fmt:v=>num(v,1),sub:'kleiner = gleichmäßiger bis zur Landung, größer = früher langsam'},
    {k:'kick',label:'Überschwingen',min:0,max:1,step:.05,fmt:v=>Math.round(v*100)+' % eines Namens',sub:'wie weit die Walze beim Landen kurz über „Dein“ hinausdreht und zurückfedert'},
    {k:'angle',label:'Krümmung der Walze',min:12,max:40,step:1,fmt:v=>v+'° pro Name',sub:'größer = stärker gebogen, weniger Namen sichtbar'},
    {k:'size',label:'Schriftgröße',min:110,max:220,step:2,fmt:v=>v+' px'},
    {k:'gap',label:'Abstand Name ↔ Icon',min:10,max:120,step:2,fmt:v=>v+' px'},
    {k:'center',label:'„Dein jö“ zentrieren',min:0,max:1,step:1,fmt:v=>v?'an':'aus',sub:'nach dem Landen gleitet die Gruppe in die Bildmitte'}],
  model(P){const b=P.beat,n=SL_SPIN.length,land=P.landBeat*b;
    return {P,b,n,land,key:land,keyName:'„Dein“ steht',total:land+3*b}},
  show(on){SLL.style.display=on?'':'none'},
  render(M,t){const P=M.P,E=SLE,last=M.n-1,H=Math.round(P.size*1.19),th=P.angle*Math.PI/180,R=H/2/Math.tan(th/2);
    // Position auf der Walze (Index, gebrochen): eine durchgehende Abbremsung bis „Dein“
    const u=seg(t,P.spinFrom,M.land),pos=t<P.spinFrom?0:slPos(u,last,P.pow,P.kick);
    const du=1e-3,vel=t<P.spinFrom||u>=1?0:Math.abs(slPos(Math.min(1,u+du),last,P.pow,P.kick)-slPos(u,last,P.pow,P.kick))/du/(M.land-P.spinFrom); // Namen pro Sekunde
    // Breite → Gruppe zentrieren
    const tw=el=>el.firstChild.offsetWidth,wMax=Math.max(...E.names.map(tw)),wN=tw(E.names[last]);
    const landed=eIO(seg(t,M.land+.15,M.land+.85))*(P.center?1:0),wUse=wMax+(wN-wMax)*landed,left=960-(wUse+P.gap+300)/2;
    Object.assign(E.wheel.style,{left:left+'px',width:wUse+'px',perspectiveOrigin:`50% 540px`,opacity:seg(t,P.spinFrom-.1,P.spinFrom+.12).toFixed(3),
      filter:vel>4?`blur(${Math.min(8,(vel-4)*.35).toFixed(2)}px)`:'none'});
    const dim=1-eIO(seg(t,M.land+.05,M.land+.6)); // nach dem Landen bleibt nur „Dein“
    E.names.forEach((el,i)=>{const a=(i-pos)*th; // 0 = vorne in der Mitte, positiv = unten
      if(Math.abs(a)>Math.PI*.48){el.style.visibility='hidden';return}
      el.style.visibility='';el.style.fontSize=P.size+'px';el.style.height=el.style.lineHeight=H+'px';el.style.top=(540-H/2)+'px';
      el.style.transform=`translateZ(${(-R).toFixed(1)}px) rotateX(${(-a*180/Math.PI).toFixed(2)}deg) translateZ(${R.toFixed(1)}px)`;
      el.style.opacity=(Math.pow(Math.max(0,Math.cos(a)),2.2)*(i===last?1:dim)).toFixed(3)});
    E.icon.style.left=(left+wUse+P.gap)+'px';
    // Icon: ploppt am Anfang, federt beim Landen von „Dein“
    const pin=eBack(seg(t,0,.45)),hit=t-M.land,bump=hit>0&&hit<.5?.08*Math.sin(hit/.5*Math.PI)*Math.exp(-hit*4):0;
    E.icon.style.transform=`scale(${(pin*(1+bump)).toFixed(4)})`;E.icon.style.opacity=Math.min(1,seg(t,0,.12)).toFixed(3);
  },
  marks(M){return [[M.P.spinFrom,'Walze'],[M.land,'Dein']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P;return [
    ['App-Icon ploppt auf','0–'+F(.45),'weiß, jö im Verlauf, 300 px'],
    ['Walze dreht',`${F(P.spinFrom)}–${F(M.land)}`,`${M.n} Namen, eine durchgehende Abbremsung, ${P.angle}° pro Name, oben und unten kippen die Namen nach hinten und blenden aus`],
    ['„Dein“ landet',String(F(M.land)),`Schlag ${P.landBeat}, Überschwingen ${Math.round(P.kick*100)} % eines Namens, Icon federt, die anderen Namen blenden aus`],
    ['Gruppe zentriert',`${F(M.land+.15)}–${F(M.land+.85)}`,'„Dein [jö]“ steht in der Bildmitte']]},
  note:'Frames bei 24 fps ab Beginn der Subebene. Gelesen wird „Tamaras jö“, „Sarahs jö“, „Renates jö“ und am Ende „Dein jö“ – das App-Icon ist das Wort jö.'
};
