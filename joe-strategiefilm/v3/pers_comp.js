/* =====================================================================
   COMP: „PERSÖNLICH. RELEVANT. GANZ NACH DIR.“ (Partnerfilm) – drei kurze Aussagen, schnell nacheinander,
   jede steigt mittig aus der Zeilenmaske und schiebt die vorige nach oben raus. Beige, Dunkelrot, „dir“ im Verlauf.
   ===================================================================== */
const PS_PH=['Persönlich.','Relevant.','Ganz nach *dir.'];
const PSL=document.createElement('div');PSL.id='persL';PSL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;font-family:var(--font);background:#f4f1ea';
PSL.innerHTML=`<div id="psMask" style="position:absolute;left:0;right:0;top:${540-110}px;height:220px;overflow:hidden">${PS_PH.map(p=>`<div class="psP" style="position:absolute;left:0;right:0;top:35px;text-align:center;color:#670003;font-size:150px;font-weight:900;letter-spacing:-.02em;line-height:1;white-space:nowrap">${p.split(' ').map(w=>w.startsWith('*')?`<span style="background:${JG_TXT};-webkit-background-clip:text;background-clip:text;color:transparent">${w.slice(1)}</span>`:w).join(' ')}</div>`).join('')}</div>`;
$('stage').appendChild(PSL);
const PSE={ph:[...PSL.querySelectorAll('.psP')]};
const PERS={
  key:'pers',name:'Persönlich. Relevant. Ganz nach dir.',lane:'laneV2',cls:'logo',
  DEF:{beat:13.725/24,inAt:0,step:1,move:.22,outAt:3.6},
  params:[
    {k:'inAt',label:'Erste Aussage bei (Schlag)',min:0,max:1,step:.25,fmt:v=>String(v)},
    {k:'step',label:'Nächste Aussage alle',min:.5,max:2,step:.25,fmt:v=>v+' Schlag',sub:'schnell nacheinander, jede schiebt die vorige nach oben raus'},
    {k:'move',label:'Dauer Wechsel',min:.1,max:.6,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'outAt',label:'Ausstieg bei (Schlag)',min:2,max:4,step:.25,fmt:v=>String(v)}],
  model(P){const b=P.beat;return {P,b,key:P.inAt*b,keyName:'Persönlich.',total:4*b}},
  show(on){PSL.style.display=on?'':'none'},
  render(M,t){const P=M.P,b=M.b;
    let p=-1;for(let k=0;k<PS_PH.length;k++){const s=(P.inAt+k*P.step)*b;p+=(k?eIO:eExpo)(seg(t,s,s+P.move+(k?0:.15)))}
    p+=eInCub(seg(t,P.outAt*b,P.outAt*b+.2));
    PSE.ph.forEach((el,i)=>{const d=i-p;el.style.transform=`translateY(${(d*220).toFixed(1)}px)`;el.style.visibility=Math.abs(d)<1.02?'visible':'hidden'})},
  marks(M){const P=M.P,b=M.b;return PS_PH.map((x,k)=>[(P.inAt+k*P.step)*b,x.replace('*','')]).concat([[P.outAt*b,'raus']])},
  table(M){const F=s=>Math.round(s*FPS),P=M.P,b=M.b;return PS_PH.map((x,k)=>[x.replace('*',''),String(F((P.inAt+k*P.step)*b)),'steigt mittig aus der Maske, schiebt die vorige Aussage nach oben']).concat([['Ausstieg',String(F(P.outAt*b)),'fällt nach oben raus']])},
  note:'Frames bei 24 fps ab Beginn der Subebene. Ein Takt; ersetzt „Mach dein Jö draus!“.'
};
