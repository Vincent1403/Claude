/* =====================================================================
   COMP: „FÜR …“ (Partnerfilm) – auf dem jö-Verlauf steht „Für“ fest, daneben laufen die Satzenden
   durch eine Zeilenmaske nach oben durch: mehr Möglichkeiten. → mehr Begeisterung. → schnell Namen mit Profilbild-Pille
   (Für [Bild] Kian. → Lena. → …) → jeden.
   ===================================================================== */
// Namen-Durchlauf: Name + Profilbild (Index in CLI.av, -1 = Kian)
const FU_NM=[['Kian',-1],['Lena',0],['Jonas',7],['Mei',8],['Elif',16],['Walter',4]];
const FU_PH=['So persönlich wie nie zuvor.',...FU_NM.map(n=>n[0]+'.'),'Eine Marke für Millionen.'],FU_N0=1,FU_FS2=150,FU_FS0=150,FU_PW=340,FU_PHH=210;
// Profil-Wolke um „Für jeden.“: Rasterlage, ohne Überlappung, Schrift frei (x, y relativ zur Bildmitte, Durchmesser); FU_KI = Kian
const FU_POS=[[-813, -406, 144], [-510, -412, 131], [-269, -405, 114], [-22, -409, 127], [279, -392, 183], [512, -422, 132], [781, -391, 136], [-686, -232, 122], [-386, -177, 132], [-129, -198, 127], [116, -234, 178], [422, -231, 134], [678, -220, 182], [-868, -2, 0], [-700, 21, 0], [700, 8, 0], [860, 10, 0], [-703, 192, 110], [-385, 235, 155], [-116, 217, 136], [127, 205, 183], [405, 179, 140], [719, 199, 132], [-786, 403, 140], [-508, 431, 183], [-305, 393, 155], [29, 408, 127], [304, 404, 200], [510, 418, 154], [829, 396, 131]],FU_KI=27,FU_TI=12; // FU_TI = Tamara (Index in FU_AV)
const FUL=document.createElement('div');FUL.id='fuerL';FUL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;font-family:var(--font);color:#fff';
FUL.innerHTML=`<div style="position:absolute;inset:0;background:${JG_CSS}"></div>
<div id="fuCloud" style="position:absolute;left:960px;top:540px;width:0;height:0">${FU_POS.filter((p,i)=>i!==FU_KI).map((p,i)=>`<img class="fuAv" src="${i===FU_TI?'__TAM0__':CLI.av[i%CLI.av.length]}" alt="" style="position:absolute;left:0;top:0;max-width:none;border-radius:50%;box-shadow:0 18px 40px rgba(60,10,0,.22);transform-origin:50% 50%">`).join('')}</div>
<div id="fuKian" style="position:absolute;overflow:hidden;box-shadow:0 24px 60px rgba(60,20,0,.22)"><img src="__KIAN0__" alt="" style="position:absolute;max-width:none"></div>
<div id="fuRow" style="position:absolute;left:0;top:0;font-size:150px;font-weight:900;letter-spacing:-.02em;line-height:1;white-space:nowrap">
 <div style="position:absolute;left:0;top:-30px;height:200px;overflow:hidden"><span id="fuFix" style="display:inline-block;margin-top:30px">Für</span></div>
 <div id="fuPill" style="position:absolute;left:0;top:${75-FU_PHH/2-14}px;height:${FU_PHH}px;width:0;overflow:hidden;border-radius:${FU_PHH/2}px;box-shadow:0 18px 40px rgba(60,10,0,.22)">${FU_NM.map(n=>`<img class="fuPi" src="${n[1]<0?'__KIAN0__':CLI.av[n[1]]}" alt="" style="position:absolute;left:0;top:0;width:${FU_PW}px;height:${FU_PHH}px;max-width:none;object-fit:cover;object-position:50% ${n[1]<0?'25%':'45%'}">`).join('')}</div>
 <div id="fuMask" style="position:absolute;top:-80px;height:320px;overflow:hidden">${FU_PH.map((p,i)=>{const z=i?150:FU_FS0;return i?`<span class="fuP" style="position:absolute;left:0;top:${80+(150-z)/2}px;display:inline-block;font-size:${z}px">${p}</span>`:`<span class="fuP" style="position:absolute;left:0;top:12.5px;display:inline-block;font-size:${z}px;text-align:center">${p.replace(' wie','<br>wie')}</span>`}).join('')}</div>
</div>`;
$('stage').appendChild(FUL);
const FUE={row:$('fuRow'),fix:$('fuFix'),mask:$('fuMask'),ph:[...FUL.querySelectorAll('.fuP')],pill:$('fuPill'),pi:[...FUL.querySelectorAll('.fuPi')],cloud:$('fuCloud'),av:[...FUL.querySelectorAll('.fuAv')],kian:$('fuKian')};
const FU_AV=FU_POS.filter((p,i)=>i!==FU_KI),FU_ORD=FU_AV.map((a,i)=>i).sort((x,y)=>Math.hypot(...FU_AV[x].slice(0,2))-Math.hypot(...FU_AV[y].slice(0,2))); // ploppen von innen nach außen
const FUER={
  key:'fuer',name:'Für … (Verlauf)',lane:'laneV3',cls:'typo',
  DEF:{beat:13.725/24,inAt:.25,hold:2,move:.4,nStep:.5,nMove:.2,gap:.28,center:.75,cDur:.5,cloudAt:8.25,cloudZoom:1.5,outAt:16,zoomAt:13.5,zDur:1.4},
  params:[
    {k:'inAt',label:'„Für“ steigt auf bei (Schlag)',min:0,max:2,step:.25,fmt:v=>String(v)},
    {k:'hold',label:'Satzende wechselt alle',min:2,max:6,step:.5,fmt:v=>v+' Schläge',sub:'„Für“ bleibt stehen, das Satzende läuft nach oben weiter'},
    {k:'move',label:'Dauer Wechsel',min:.2,max:1,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'nStep',label:'Namen wechseln alle',min:.25,max:1,step:.25,fmt:v=>v+' Schlag',sub:'Für [Profilbild] Kian. → Lena. → … → jeden.'},
    {k:'nMove',label:'Dauer Namenwechsel',min:.1,max:.4,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'gap',label:'Abstand nach „Für“',min:.1,max:.6,step:.01,fmt:v=>Math.round(v*100)+' % Schriftgröße'},
    {k:'center',label:'„Für jeden.“ mittig ab (Schläge nach dem Wechsel)',min:0,max:2,step:.25,fmt:v=>String(v)},
    {k:'cDur',label:'Dauer Gleiten zur Mitte',min:.2,max:1,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'cloudAt',label:'Profil-Wolke ab (Schlag)',min:4,max:10,step:.25,fmt:v=>String(v),sub:'die Profile der jö Community ploppen um „Für jeden.“ auf, die Kamera zieht dabei auf'},
    {k:'cloudZoom',label:'Kamera zieht auf über',min:.5,max:3,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'outAt',label:'„Für jeden.“ raus bei (Schlag)',min:6,max:16,step:.25,fmt:v=>String(v)},
    {k:'zoomAt',label:'Zoom in Kian ab (Schlag)',min:6,max:16,step:.25,fmt:v=>String(v),sub:'wie der Zoom in Tamara: Kamera fährt in Kians Kreis, die Wolke zoomt mit; Anschluss an das Kian-Video'},
    {k:'zDur',label:'Dauer Zoom in Kian',min:.5,max:3,step:1/24,fmt:v=>Math.round(v*24)+' F'}],
  model(P){const b=P.beat,st=FU_PH.map((x,k)=>P.inAt+Math.min(k,FU_N0)*P.hold+Math.max(0,k-FU_N0)*P.nStep);return {P,b,st,key:P.inAt*b,keyName:'Für',total:(P.len||16)*b}},
  show(on){FUL.style.display=on?'':'none'},
  render(M,t){const P=M.P,b=M.b,E=FUE,fs=150;
    if(!E._w){E._wf=E.fix.offsetWidth;E._wp=E.ph.map(p=>p.offsetWidth);if(E._wf)E._w=1}
    const gap=P.gap*fs,nL=FU_PH.length-2,wM=Math.max(...E._wp.slice(FU_N0,nL+1)),ML=E._wf+gap+FU_PW+gap,R=960-(ML+wM)/2; // Zeile steht fest (zentriert auf „Für [Bild] längster Name“) – keine seitlichen Bewegungen, nur nach oben
    Object.assign(E.row.style,{top:(540-fs*.55).toFixed(1)+'px'});
    // Profilbild-Pille zwischen „Für“ und Namen: öffnet beim ersten Namen, schließt zu „jeden.“
    const ns=M.st[FU_N0]*b,ne=M.st[FU_PH.length-1]*b,ow=eIO(seg(t,ns-.05,ns+P.move)),pk=eInCub(seg(t,ne,ne+.3)),pw=FU_PW*ow;
    Object.assign(E.pill.style,{left:(E._wf+gap).toFixed(1)+'px',width:pw.toFixed(1)+'px',visibility:ow>.002&&pk<1?'visible':'hidden',transform:`translateY(${(-pk*230).toFixed(1)}px)`,opacity:(1-pk).toFixed(3)}); // Pille fährt am Ende mit „Für“ nach oben raus
    E.mask.style.left=(-R).toFixed(1)+'px';E.mask.style.width='1920px';
    const a=P.inAt*b,o=P.outAt*b,rin=eExpo(seg(t,a,a+.5)),rout=eInCub(seg(t,o,o+.3));
    {const fi=eExpo(seg(t,ns+.18,ns+.6)),fo=eInCub(seg(t,ne,ne+.3));E.fix.style.transform=`translateY(${((1-fi)*120-fo*120+rout*120).toFixed(1)}%)`} // „Für“ nur zu den Namen
    // Position auf der „Walze“: 0 = erstes Satzende, 1 = zweites …; jedes läuft von unten rein und oben raus
    let p=-1+eExpo(seg(t,a+.08,a+.58));for(let k=1;k<FU_PH.length;k++){const s=M.st[k]*b;p+=k>FU_N0?.5-.5*Math.cos(Math.PI*seg(t,s,s+P.nMove)):eIO(seg(t,s,s+P.move)) /* Namen: weiche Sinus-Kurve */}
    p+=eInCub(seg(t,o+.04,o+.34));
    // ab dem ersten Namen steht die Kombi „Für [Bild] Name.“ mittig (Breite folgt dem laufenden Namen), endet als „Für jeden.“ in der Mitte
    E.row.style.left=R.toFixed(1)+'px';
    {const k=Math.max(0,Math.min(1,p));E.mask.style.clipPath=`inset(${(50*k).toFixed(1)}px 0 ${(70*k).toFixed(1)}px 0)`} // Maske nur für den zweizeiligen ersten Satz größer
    E.ph.forEach((el,i)=>{const d=i-p;el.style.left=(i===0||i===FU_PH.length-1?960-E._wp[i]/2:R+ML).toFixed(1)+'px';el.style.transform=`translateY(${(d*(i===0&&d<0?340:240)).toFixed(1)}px)`; /* erster Satz ist zweizeilig: läuft weiter nach oben raus */el.style.opacity=Math.abs(d)<1.05?'1':'0'});
    E.pi.forEach((el,i)=>{const d=i+FU_N0-Math.min(p,FU_PH.length-2);el.style.transform=`translate(${((pw-FU_PW)/2).toFixed(1)}px,${(d*FU_PHH).toFixed(1)}px)`;el.style.visibility=Math.abs(d)<1.02?'visible':'hidden'});
    // Profil-Wolke (Kian gehört von Anfang an dazu), Kamera zieht beim Aufbau auf
    const c0=P.cloudAt*b,zu=eIO(seg(t,c0,c0+P.cloudZoom)),[kx,ky,kd]=FU_POS[FU_KI],D=CL_D;
    // nach „Für jeden.“ zoomt die Kamera in Kians Kreis – wie der Zoom in Tamara: die ganze Wolke skaliert mit, Kians Kreis wandert
    // in die Mitte und wird zum Vollbild (Rechteck 1920 × 1080, Ecken runden sich erst am Ende aus), die anderen fliegen aus dem Bild
    const za=P.zoomAt*b,u=eStFlow(seg(t,za,Math.min(za+P.zDur,M.total-1/24))),S=1.45-.45*zu;
    const flo=i=>[9*Math.sin(t*(1+i*.11)+i*1.7),7*Math.cos(t*(.9+i*.13)+i*1.1)];
    E.av.forEach((el,i)=>{const [x,y,d]=FU_AV[i],k=FU_ORD.indexOf(i),a0=c0+(k+1)*.045,pp=eBack(seg(t,a0,a0+.45)),[ox,oy]=flo(i);
      el.style.width=el.style.height=d+'px';el.style.transform=`translate(${(x+ox-d/2).toFixed(1)}px,${(y+oy-d/2).toFixed(1)}px) scale(${pp.toFixed(4)})`});
    {const kp=eBack(seg(t,c0,c0+.45)),[fx,fy]=flo(FU_KI),ox=fx*(1-u),oy=fy*(1-u),d0=kd*S;
     const kw=d0+(1920-d0)*u,kh=d0+(1080-d0)*u,s2=kw/kd,Tx=kx*S*(1-u)-kx*s2,Ty=ky*S*(1-u)-ky*s2,cx=960+Tx+(kx+ox)*s2,cy=540+Ty+(ky+oy)*s2,kr=Math.min(kw,kh)/2*(1-Math.pow(u,3));
     const cam=`translate(${Tx.toFixed(1)}px,${Ty.toFixed(1)}px) scale(${s2.toFixed(4)})`;E.cloud.style.transform=cam;
     // „Für jeden.“ bleibt stehen und gehört zur Szene: beim Zoom in Kian fliegt es mit der Wolke aus dem Bild
     E.row.style.transformOrigin=`${(960-parseFloat(E.row.style.left)).toFixed(1)}px ${(540-parseFloat(E.row.style.top)).toFixed(1)}px`;E.row.style.transform=u>0?cam:'none';
     Object.assign(E.kian.style,{left:(cx-kw/2).toFixed(1)+'px',top:(cy-kh/2).toFixed(1)+'px',width:kw.toFixed(1)+'px',height:kh.toFixed(1)+'px',borderRadius:kr.toFixed(1)+'px',transform:`scale(${(u>0?1:kp).toFixed(4)})`,opacity:t<c0?'0':'1'});
     const im=E.kian.firstChild,iw=Math.max(kw,kh*16/9),ih=iw*9/16;Object.assign(im.style,{width:iw.toFixed(1)+'px',height:ih.toFixed(1)+'px',left:((kw-iw)/2).toFixed(1)+'px',top:((kh-ih)*.3).toFixed(1)+'px'})}
    FUL.querySelector('div').style.transform=`scale(${(1.04-.04*eOut(seg(t,0,M.total))).toFixed(4)})`},
  marks(M){const P=M.P,b=M.b;return [[P.inAt*b,'Für'],...FU_PH.slice(1).map((x,k)=>[M.st[k+1]*b,x.split(' ').pop()]),[P.outAt*b,'raus']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P,b=M.b;return [
    ['„Für mehr Möglichkeiten.“',`${F(P.inAt*b)}–${F((P.inAt+P.hold)*b)}`,'„Für“ und das Satzende steigen aus der Maske'],
    ['„… mehr Begeisterung.“',`${F(M.st[1]*b)}–${F(M.st[2]*b)}`,'nur das Satzende läuft nach oben weiter'],
    ['Namen',`${F(M.st[FU_N0]*b)}–${F(M.st[FU_PH.length-1]*b)}`,FU_NM.map(n=>n[0]).join(', ')+' – mit Profilbild-Pille'],
    ['„… jeden.“',`${F(M.st[FU_PH.length-1]*b)}–${F(P.outAt*b)}`,'Pille schließt, „Für jeden.“ gleitet in die Mitte, die Profil-Wolke ploppt auf'],
    ['Hintergrund','','jö-Verlauf, zieht leicht auf']]},
  note:'Frames bei 24 fps ab Beginn der Subebene. Vier Takte; „Für“ steht, die Satzenden wechseln alle zwei Schläge, dann laufen schnell Namen mit Profilbild durch, „Für jeden.“ gleitet in die Bildmitte, dann ploppen die Profile der jö Community darum auf. Danach zoomt die Kamera in Kians Kreis (wie der Zoom in Tamara) (Anschluss: Kian-Video, Profil-Wolke, Zoom in Tamara).'
};
