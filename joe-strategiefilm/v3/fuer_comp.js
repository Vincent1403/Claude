/* =====================================================================
   COMP: „FÜR …“ (Partnerfilm) – auf dem jö-Verlauf steht „Für“ fest, daneben laufen die Satzenden
   durch eine Zeilenmaske nach oben durch: mehr Möglichkeiten. → mehr Begeisterung. → jeden.
   ===================================================================== */
const FU_PH=['mehr Möglichkeiten.','mehr Begeisterung.','jeden.'];
// Profil-Wolke um „Für jeden.“: Rasterlage, ohne Überlappung, Schrift frei (x, y relativ zur Bildmitte, Durchmesser); FU_KI = Kian
const FU_POS=[[-826, -356, 194], [-548, -422, 144], [-262, -395, 179], [-29, -403, 125], [256, -381, 198], [570, -432, 169], [830, -362, 168], [-801, 334, 155], [-532, 446, 157], [-269, 379, 143], [10, 395, 148], [285, 367, 220], [528, 392, 139], [832, 358, 124], [-826, -131, 124], [-581, -129, 146], [586, -135, 133], [-820, 128, 200], [-605, 136, 149], [609, 147, 152], [840, 140, 120]],FU_KI=11;
const FUL=document.createElement('div');FUL.id='fuerL';FUL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;font-family:var(--font);color:#fff';
FUL.innerHTML=`<div style="position:absolute;inset:0;background:${JG_CSS}"></div>
<div id="fuCloud" style="position:absolute;left:960px;top:540px;width:0;height:0">${FU_POS.filter((p,i)=>i!==FU_KI).map((p,i)=>`<img class="fuAv" src="${CLI.av[i%CLI.av.length]}" alt="" style="position:absolute;left:0;top:0;max-width:none;border-radius:50%;box-shadow:0 18px 40px rgba(60,10,0,.22);transform-origin:50% 50%">`).join('')}</div>
<div id="fuKian" style="position:absolute;overflow:hidden;box-shadow:0 24px 60px rgba(60,20,0,.22)"><img src="__KIAN0__" alt="" style="position:absolute;max-width:none"></div>
<div id="fuRow" style="position:absolute;left:0;top:0;font-size:150px;font-weight:900;letter-spacing:-.02em;line-height:1;white-space:nowrap">
 <div style="position:absolute;left:0;top:-30px;height:200px;overflow:hidden"><span id="fuFix" style="display:inline-block;margin-top:30px">Für</span></div>
 <div id="fuMask" style="position:absolute;top:-30px;height:200px;overflow:hidden">${FU_PH.map(p=>`<span class="fuP" style="position:absolute;left:0;top:30px;display:inline-block">${p}</span>`).join('')}</div>
</div>`;
$('stage').appendChild(FUL);
const FUE={row:$('fuRow'),fix:$('fuFix'),mask:$('fuMask'),ph:[...FUL.querySelectorAll('.fuP')],cloud:$('fuCloud'),av:[...FUL.querySelectorAll('.fuAv')],kian:$('fuKian')};
const FU_AV=FU_POS.filter((p,i)=>i!==FU_KI),FU_ORD=FU_AV.map((a,i)=>i).sort((x,y)=>Math.hypot(...FU_AV[x].slice(0,2))-Math.hypot(...FU_AV[y].slice(0,2))); // ploppen von innen nach außen
const FUER={
  key:'fuer',name:'Für … (Verlauf)',lane:'laneV3',cls:'typo',
  DEF:{beat:13.725/24,inAt:.25,hold:2,move:.4,gap:.28,center:.75,cDur:.5,cloudAt:5.5,cloudZoom:1.5,outAt:12.25,kianAt:12.6,zoomAt:13.75},
  params:[
    {k:'inAt',label:'„Für“ steigt auf bei (Schlag)',min:0,max:2,step:.25,fmt:v=>String(v)},
    {k:'hold',label:'Satzende wechselt alle',min:2,max:6,step:.5,fmt:v=>v+' Schläge',sub:'„Für“ bleibt stehen, das Satzende läuft nach oben weiter'},
    {k:'move',label:'Dauer Wechsel',min:.2,max:1,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'gap',label:'Abstand nach „Für“',min:.1,max:.6,step:.01,fmt:v=>Math.round(v*100)+' % Schriftgröße'},
    {k:'center',label:'„Für jeden.“ mittig ab (Schläge nach dem Wechsel)',min:0,max:2,step:.25,fmt:v=>String(v)},
    {k:'cDur',label:'Dauer Gleiten zur Mitte',min:.2,max:1,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'cloudAt',label:'Profil-Wolke ab (Schlag)',min:4,max:10,step:.25,fmt:v=>String(v),sub:'die Profile der jö Community ploppen um „Für jeden.“ auf, die Kamera zieht dabei auf'},
    {k:'cloudZoom',label:'Kamera zieht auf über',min:.5,max:3,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'outAt',label:'„Für jeden.“ raus bei (Schlag)',min:6,max:16,step:.25,fmt:v=>String(v)},
    {k:'kianAt',label:'Kamera fährt auf Kian (Schlag)',min:6,max:16,step:.25,fmt:v=>String(v)},
    {k:'zoomAt',label:'Zoom auf Kian ab (Schlag)',min:6,max:16,step:.25,fmt:v=>String(v),sub:'die Kamera fährt in Kians Profilbild, es wird zum Vollbild; harter Anschluss an das Kian-Video'}],
  model(P){const b=P.beat;return {P,b,key:P.inAt*b,keyName:'Für',total:16*b}},
  show(on){FUL.style.display=on?'':'none'},
  render(M,t){const P=M.P,b=M.b,E=FUE,fs=150;
    if(!E._w){E._wf=E.fix.offsetWidth;E._wp=E.ph.map(p=>p.offsetWidth);if(E._wf)E._w=1}
    const gap=P.gap*fs,tw=E._wf+gap+Math.max(...E._wp),xa=960-tw/2,xc=960-(E._wf+gap+E._wp[E._wp.length-1])/2,
      cs=(P.inAt+(FU_PH.length-1)*P.hold+P.center)*b,x0=xa+(xc-xa)*eIO(seg(t,cs,cs+P.cDur)); // am Ende gleitet „Für jeden.“ in die Mitte
    Object.assign(E.row.style,{left:x0.toFixed(1)+'px',top:(540-fs*.55).toFixed(1)+'px'});
    E.mask.style.left=(E._wf+gap).toFixed(1)+'px';E.mask.style.width=(Math.max(...E._wp)+40)+'px';
    const a=P.inAt*b,o=P.outAt*b,rin=eExpo(seg(t,a,a+.5)),rout=eInCub(seg(t,o,o+.3));
    E.fix.style.transform=`translateY(${((1-rin)*120+rout*120).toFixed(1)}%)`;
    // Position auf der „Walze“: 0 = erstes Satzende, 1 = zweites …; jedes läuft von unten rein und oben raus
    let p=-1+eExpo(seg(t,a+.08,a+.58));for(let k=1;k<FU_PH.length;k++){const s=a+k*P.hold*b;p+=eIO(seg(t,s,s+P.move))}
    p+=eInCub(seg(t,o+.04,o+.34));
    E.ph.forEach((el,i)=>{const d=i-p;el.style.transform=`translateY(${(d*240).toFixed(1)}px)`;el.style.opacity=Math.abs(d)<1.05?'1':'0'});
    // Profil-Wolke (Kian gehört von Anfang an dazu). Kamera: Aufziehen beim Aufbau, nach „Für jeden.“ fährt sie auf Kian (Mitte, 380 px),
    // dann wird sein Bild zum Vollbild (Rechteck wächst auf 1920 × 1080, Radius → 0) – Anschluss ans Kian-Video
    const c0=P.cloudAt*b,zu=eIO(seg(t,c0,c0+P.cloudZoom)),[kx,ky,kd]=FU_POS[FU_KI],D=CL_D;
    const pa=P.kianAt*b,v=eIO(seg(t,pa,pa+.6)),za=P.zoomAt*b,u=eStFlow(seg(t,za,M.total-1/24)),sf=Math.hypot(1920,1080)/D*1.02;
    const S=(1.45-.45*zu)*(1+(D/kd-1)*v)*(1+(sf-1)*u),px=kx*v,py=ky*v;
    E.cloud.style.transform=`scale(${S.toFixed(4)}) translate(${(-px).toFixed(1)}px,${(-py).toFixed(1)}px)`;
    const fl=1-v,flo=(i,k)=>[9*fl*Math.sin(t*(1+i*.11)+i*1.7),7*fl*Math.cos(t*(.9+i*.13)+i*1.1)];
    E.av.forEach((el,i)=>{const [x,y,d]=FU_AV[i],k=FU_ORD.indexOf(i),a0=c0+(k+1)*.045,pp=eBack(seg(t,a0,a0+.45)),[ox,oy]=flo(i);
      el.style.width=el.style.height=d+'px';el.style.transform=`translate(${(x+ox-d/2).toFixed(1)}px,${(y+oy-d/2).toFixed(1)}px) scale(${pp.toFixed(4)})`});
    {const kp=eBack(seg(t,c0,c0+.45)),[ox,oy]=flo(99),cx=960+S*(kx+ox-px),cy=540+S*(ky+oy-py);
     const L=(a,c)=>a+(c-a)*u,kw=u>0?L(D,1920):kd*S,kh=u>0?L(D,1080):kd*S,kr=u>0?L(D/2,0):kw/2;
     Object.assign(E.kian.style,{left:(cx-kw/2).toFixed(1)+'px',top:(cy-kh/2).toFixed(1)+'px',width:kw.toFixed(1)+'px',height:kh.toFixed(1)+'px',borderRadius:kr.toFixed(1)+'px',transform:`scale(${(u>0?1:kp).toFixed(4)})`,opacity:t<c0?'0':'1'});
     const im=E.kian.firstChild,iw=Math.max(kw,kh*16/9),ih=iw*9/16;Object.assign(im.style,{width:iw.toFixed(1)+'px',height:ih.toFixed(1)+'px',left:((kw-iw)/2).toFixed(1)+'px',top:((kh-ih)*.3).toFixed(1)+'px'})}
    E.row.style.transform='none';FUL.querySelector('div').style.transform=`scale(${(1.04-.04*eOut(seg(t,0,M.total))).toFixed(4)})`},
  marks(M){const P=M.P,b=M.b;return [[P.inAt*b,'Für'],...[1,2].map(k=>[(P.inAt+k*P.hold)*b,FU_PH[k].split(' ')[1]||FU_PH[k]]),[P.outAt*b,'raus']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P,b=M.b;return [
    ['„Für mehr Möglichkeiten.“',`${F(P.inAt*b)}–${F((P.inAt+P.hold)*b)}`,'„Für“ und das Satzende steigen aus der Maske'],
    ['„… mehr Begeisterung.“',`${F((P.inAt+P.hold)*b)}–${F((P.inAt+2*P.hold)*b)}`,'nur das Satzende läuft nach oben weiter'],
    ['„… jeden.“',`${F((P.inAt+2*P.hold)*b)}–${F(P.outAt*b)}`,'danach fällt alles aus der Maske'],
    ['Hintergrund','','jö-Verlauf, zieht leicht auf']]},
  note:'Frames bei 24 fps ab Beginn der Subebene. Vier Takte; „Für“ steht, die Satzenden wechseln alle zwei Schläge, „Für jeden.“ gleitet in die Bildmitte, dann ploppen die Profile der jö Community darum auf. Danach erscheint Kian in der Mitte und die Kamera fährt in sein Bild (Anschluss: Kian-Video, Profil-Wolke, Zoom in Tamara).'
};
