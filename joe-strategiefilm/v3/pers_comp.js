/* =====================================================================
   COMP: KURZE AUSSAGEN NACHEINANDER (Partnerfilm) – jede steigt mittig aus der Zeilenmaske und schiebt die vorige
   nach oben raus. Beige, Dunkelrot, mit * markierte Wörter im Verlauf.
   PERS: „Persönlich. Relevant. Ganz nach dir.“ · SYSTEM: „Ein System. Unzählige Möglichkeiten.“
   ===================================================================== */
function makeSeq(key,name,PH,beats,def,note){
  const nl=Math.max(...PH.map(p=>p.split('|').length)),MH=270+(nl-1)*165; // „|“ = Zeilenumbruch, die Maske wächst mit
  const L=document.createElement('div');L.id=key+'L';L.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;font-family:var(--font);background:#f4f1ea';
  L.innerHTML=`<div style="position:absolute;left:0;right:0;top:${540-MH/2}px;height:${MH}px;overflow:hidden">${PH.map(p=>`<div class="sqP" style="position:absolute;left:0;right:0;top:50px;text-align:center;color:#670003;font-size:150px;font-weight:900;letter-spacing:-.02em;line-height:${nl>1?1.1:1};white-space:nowrap">${p.replaceAll('|','<br>').split(' ').map(w=>w.startsWith('*')?`<span style="background:${JG_TXT};-webkit-background-clip:text;background-clip:text;color:transparent;display:inline-block;padding-bottom:.22em;margin-bottom:-.22em">${w.slice(1)}</span>`:w).join(' ')}</div>`).join('')}</div>`;
  $('stage').appendChild(L);
  const ph=[...L.querySelectorAll('.sqP')];
  return {
  key,name,lane:'laneV2',cls:'logo',
  DEF:{beat:13.725/24,...def},
  params:[
    {k:'inAt',label:'Erste Aussage bei (Schlag)',min:0,max:1,step:.25,fmt:v=>String(v)},
    {k:'step',label:'Nächste Aussage alle',min:.5,max:4,step:.25,fmt:v=>v+' Schlag',sub:'jede schiebt die vorige nach oben raus'},
    {k:'move',label:'Dauer Wechsel',min:.1,max:.6,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'outAt',label:'Ausstieg bei (Schlag)',min:1,max:beats,step:.25,fmt:v=>String(v)}],
  model(P){const b=P.beat;return {P,b,key:P.inAt*b,keyName:PH[0].replace('*','').replace('|',' '),total:beats*b}},
  show(on){L.style.display=on?'':'none'},
  render(M,t){const P=M.P,b=M.b;
    let p=-1;for(let k=0;k<PH.length;k++){const s=(P.inAt+k*P.step)*b;p+=(k?eIO:eExpo)(seg(t,s,s+P.move+(k?0:.15)))}
    p+=eInCub(seg(t,P.outAt*b,P.outAt*b+.2));
    ph.forEach((el,i)=>{const d=i-p;el.style.transform=`translateY(${(d*MH).toFixed(1)}px)`;el.style.visibility=Math.abs(d)<1.02?'visible':'hidden'})},
  marks(M){const P=M.P,b=M.b;return PH.map((x,k)=>[(P.inAt+k*P.step)*b,x.replace('*','').replace('|',' ')]).concat([[P.outAt*b,'raus']])},
  table(M){const F=s=>Math.round(s*FPS),P=M.P,b=M.b;return PH.map((x,k)=>[x.replace('*','').replace('|',' '),String(F((P.inAt+k*P.step)*b)),'steigt mittig aus der Maske, schiebt die vorige Aussage nach oben']).concat([['Ausstieg',String(F(P.outAt*b)),'fällt nach oben raus']])},
  note};
}
const PERS=makeSeq('pers','Ganz nach dir.',['Ganz nach *dir.'],4,{inAt:0,step:1,move:.22,outAt:3.6},
  'Frames bei 24 fps ab Beginn der Subebene. Ein Takt; ersetzt „Mach dein Jö draus!“.');
const SYSTEM=makeSeq('system','Ein neues Design System. Unzählige Möglichkeiten.',['Ein neues Design System.','Unzählige *Möglichkeiten.'],8,{inAt:0,step:3,move:.3,outAt:7.6},
  'Frames bei 24 fps ab Beginn der Subebene. Zwei Takte, nach den Marken-Lockups; zwei Aussagen nacheinander.');
// „Konsistent über alle Kanäle.“ als Tafel wie die anderen Headlines: Wort für Wort aus der Zeilenmaske
const KANAL=makeHL('kanal','Flexibel im Zusammenspiel.','laneV2',['Flexibel im','*Zusammenspiel.'],
  {size:150,top:354,color:'#670003',bg:'#f4f1ea',hi:JG_TXT,step:.25,inAt:.25,outAt:3.15,len:4,cls:'logo',note:'Tafel des Partnerfilms, ein Takt nach dem Tag-System.'});
const WELT=makeHL('welt','Eine Welt voller Marken.','laneV2',['Eine Welt voller Marken.'],
  {size:150,top:447,color:'#670003',bg:'#f4f1ea',hi:JG_TXT,step:.25,inAt:.25,outAt:3.15,len:4,cls:'logo',note:'Tafel nach den Menschen, vor den Prämien.'});
const FLEX=makeHL('flex','Konsistent über alle Kanäle.','laneV2',['Konsistent über','alle *Kanäle.'],
  {size:150,top:354,color:'#670003',bg:'#f4f1ea',hi:JG_TXT,step:.25,inAt:.25,outAt:3.15,len:4,cls:'logo',note:'Tafel des Partnerfilms, ein Takt nach den Formaten; danach die Anzeigen.'});
