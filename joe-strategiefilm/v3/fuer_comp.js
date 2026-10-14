/* =====================================================================
   COMP: „FÜR …“ (Partnerfilm) – auf dem jö-Verlauf steht „Für“ fest, daneben laufen die Satzenden
   durch eine Zeilenmaske nach oben durch: mehr Möglichkeiten. → mehr Begeisterung. → jeden Tag.
   ===================================================================== */
const FU_PH=['mehr Möglichkeiten.','mehr Begeisterung.','jeden Tag.'];
const FUL=document.createElement('div');FUL.id='fuerL';FUL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;font-family:var(--font);color:#fff';
FUL.innerHTML=`<div style="position:absolute;inset:0;background:${JG_CSS}"></div>
<div id="fuRow" style="position:absolute;left:0;top:0;font-size:150px;font-weight:900;letter-spacing:-.02em;line-height:1;white-space:nowrap">
 <div style="position:absolute;left:0;top:-30px;height:200px;overflow:hidden"><span id="fuFix" style="display:inline-block;margin-top:30px">Für</span></div>
 <div id="fuMask" style="position:absolute;top:-30px;height:200px;overflow:hidden">${FU_PH.map(p=>`<span class="fuP" style="position:absolute;left:0;top:30px;display:inline-block">${p}</span>`).join('')}</div>
</div>`;
$('stage').appendChild(FUL);
const FUE={row:$('fuRow'),fix:$('fuFix'),mask:$('fuMask'),ph:[...FUL.querySelectorAll('.fuP')]};
const FUER={
  key:'fuer',name:'Für … (Verlauf)',lane:'laneV3',cls:'typo',
  DEF:{beat:13.725/24,inAt:.25,hold:2,move:.4,gap:.28,center:.75,cDur:.5,outAt:7.4},
  params:[
    {k:'inAt',label:'„Für“ steigt auf bei (Schlag)',min:0,max:2,step:.25,fmt:v=>String(v)},
    {k:'hold',label:'Satzende wechselt alle',min:2,max:6,step:.5,fmt:v=>v+' Schläge',sub:'„Für“ bleibt stehen, das Satzende läuft nach oben weiter'},
    {k:'move',label:'Dauer Wechsel',min:.2,max:1,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'gap',label:'Abstand nach „Für“',min:.1,max:.6,step:.01,fmt:v=>Math.round(v*100)+' % Schriftgröße'},
    {k:'center',label:'„Für jeden Tag.“ mittig ab (Schläge nach dem Wechsel)',min:0,max:2,step:.25,fmt:v=>String(v)},
    {k:'cDur',label:'Dauer Gleiten zur Mitte',min:.2,max:1,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'outAt',label:'Ausstieg bei (Schlag)',min:4,max:8,step:.25,fmt:v=>String(v)}],
  model(P){const b=P.beat;return {P,b,key:P.inAt*b,keyName:'Für',total:8*b}},
  show(on){FUL.style.display=on?'':'none'},
  render(M,t){const P=M.P,b=M.b,E=FUE,fs=150;
    if(!E._w){E._wf=E.fix.offsetWidth;E._wp=E.ph.map(p=>p.offsetWidth);if(E._wf)E._w=1}
    const gap=P.gap*fs,tw=E._wf+gap+Math.max(...E._wp),xa=960-tw/2,xc=960-(E._wf+gap+E._wp[E._wp.length-1])/2,
      cs=(P.inAt+(FU_PH.length-1)*P.hold+P.center)*b,x0=xa+(xc-xa)*eIO(seg(t,cs,cs+P.cDur)); // am Ende gleitet „Für jeden Tag.“ in die Mitte
    Object.assign(E.row.style,{left:x0.toFixed(1)+'px',top:(540-fs*.55).toFixed(1)+'px'});
    E.mask.style.left=(E._wf+gap).toFixed(1)+'px';E.mask.style.width=(Math.max(...E._wp)+40)+'px';
    const a=P.inAt*b,o=P.outAt*b,rin=eExpo(seg(t,a,a+.5)),rout=eInCub(seg(t,o,o+.3));
    E.fix.style.transform=`translateY(${((1-rin)*120+rout*120).toFixed(1)}%)`;
    // Position auf der „Walze“: 0 = erstes Satzende, 1 = zweites …; jedes läuft von unten rein und oben raus
    let p=-1+eExpo(seg(t,a+.08,a+.58));for(let k=1;k<FU_PH.length;k++){const s=a+k*P.hold*b;p+=eIO(seg(t,s,s+P.move))}
    p+=eInCub(seg(t,o+.04,o+.34));
    E.ph.forEach((el,i)=>{const d=i-p;el.style.transform=`translateY(${(d*200).toFixed(1)}px)`;el.style.opacity=Math.abs(d)<1.05?'1':'0'});
    E.row.style.transform='none';FUL.querySelector('div').style.transform=`scale(${(1.04-.04*eOut(seg(t,0,M.total))).toFixed(4)})`},
  marks(M){const P=M.P,b=M.b;return [[P.inAt*b,'Für'],...[1,2].map(k=>[(P.inAt+k*P.hold)*b,FU_PH[k].split(' ')[1]||FU_PH[k]]),[P.outAt*b,'raus']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P,b=M.b;return [
    ['„Für mehr Möglichkeiten.“',`${F(P.inAt*b)}–${F((P.inAt+P.hold)*b)}`,'„Für“ und das Satzende steigen aus der Maske'],
    ['„… mehr Begeisterung.“',`${F((P.inAt+P.hold)*b)}–${F((P.inAt+2*P.hold)*b)}`,'nur das Satzende läuft nach oben weiter'],
    ['„… jeden Tag.“',`${F((P.inAt+2*P.hold)*b)}–${F(P.outAt*b)}`,'danach fällt alles aus der Maske'],
    ['Hintergrund','','jö-Verlauf, zieht leicht auf']]},
  note:'Frames bei 24 fps ab Beginn der Subebene. Zwei Takte; „Für“ steht, die Satzenden wechseln alle zwei Schläge, am Ende gleitet „Für jeden Tag.“ in die Bildmitte.'
};
