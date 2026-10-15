/* =====================================================================
   COMP: SCHLUSS-TEXT (Partnerfilm, nach dem Billboard) auf dem jö-Verlauf, weiß:
   1) „Gemeinsam mehr / erreichen.“ Wort für Wort  →  2) „Mehr“ steht, Satzenden laufen durch: Sichtbarkeit. → Relevanz. → Verbindung.
   →  3) „Österreichs größte / tägliche Markenbühne.“ Wort für Wort; danach das jö-Logo (eigener Clip).
   ===================================================================== */
const ET_A=['Gemeinsam mehr','erreichen.'],ET_PH=['Sichtbarkeit.','Relevanz.','Verbindung.'],ET_C=['Österreichs größte','tägliche Markenbühne.'];
const ETL=document.createElement('div');ETL.id='endTxtL';ETL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;font-family:var(--font);color:#fff';
const etBlock=(id,lines)=>`<div id="${id}" style="position:absolute;left:0;right:0;top:${540-lines.length*93}px;text-align:center;font-size:150px;font-weight:900;letter-spacing:-.02em;line-height:1">${lines.map(l=>`<div style="height:186px;overflow:hidden;padding-top:10px;box-sizing:border-box">${l.split(' ').map(w=>`<span class="etW" style="display:inline-block">${w}</span>`).join(' ')}</div>`).join('')}</div>`;
ETL.innerHTML=`<div id="etBg" style="position:absolute;inset:0;background:${JG_CSS}"></div>${etBlock('etA',ET_A)}${etBlock('etC',ET_C)}
<div id="etRow" style="position:absolute;left:0;top:${540-82}px;font-size:150px;font-weight:900;letter-spacing:-.02em;line-height:1;white-space:nowrap">
 <div style="position:absolute;left:0;top:-30px;height:200px;overflow:hidden"><span id="etFix" style="display:inline-block;margin-top:30px">Mehr</span></div>
 <div id="etMask" style="position:absolute;top:-30px;height:200px;overflow:hidden">${ET_PH.map(p=>`<span class="etP" style="position:absolute;left:0;top:30px;display:inline-block">${p}</span>`).join('')}</div></div>`;
$('bg').after(ETL); // unter allen Szenen: der Verlauf bleibt hinter dem jö-Logo stehen
const ETE={bg:$('etBg'),a:[...$('etA').querySelectorAll('.etW')],c:[...$('etC').querySelectorAll('.etW')],row:$('etRow'),fix:$('etFix'),mask:$('etMask'),ph:[...ETL.querySelectorAll('.etP')]};
const ENDTXT={
  key:'endtxt',name:'Schluss-Text (Gemeinsam · Mehr … · Markenbühne)',lane:'laneV3',cls:'typo',
  DEF:{beat:13.725/24,aIn:.25,aOut:7,bIn:8.25,hold:2.5,move:.4,bOut:15.5,cIn:16.25,cOut:23.25,step:.25,gap:.28},
  params:[
    {k:'aIn',label:'„Gemeinsam mehr erreichen.“ ab (Schlag)',min:0,max:2,step:.25,fmt:v=>String(v)},
    {k:'aOut',label:'… raus bei (Schlag)',min:3,max:8,step:.25,fmt:v=>String(v)},
    {k:'bIn',label:'„Mehr …“ ab (Schlag)',min:6,max:10,step:.25,fmt:v=>String(v),sub:'„Mehr“ steht, die Satzenden laufen nach oben durch'},
    {k:'hold',label:'Satzende wechselt alle',min:1,max:4,step:.25,fmt:v=>v+' Schläge'},
    {k:'move',label:'Dauer Wechsel',min:.2,max:1,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'bOut',label:'„Mehr …“ raus bei (Schlag)',min:12,max:16,step:.25,fmt:v=>String(v)},
    {k:'cIn',label:'„Österreichs größte tägliche Markenbühne.“ ab (Schlag)',min:14,max:18,step:.25,fmt:v=>String(v)},
    {k:'cOut',label:'… raus bei (Schlag)',min:18,max:24,step:.25,fmt:v=>String(v),sub:'danach das jö-Logo'},
    {k:'step',label:'Wort-Abstand',min:.125,max:.5,step:.125,fmt:v=>v+' Schlag'}],
  model(P){const b=P.beat;return {P,b,key:P.bIn*b,keyName:'Mehr …',total:24*b}},
  show(on){ETL.style.display=on?'':'none'},
  render(M,t){const P=M.P,b=M.b,E=ETE;
    E.bg.style.transform=`scale(${(1.04-.04*eOut(seg(t,0,M.total))).toFixed(4)})`;
    // Wort für Wort aus der Maske, Ausstieg nach oben
    const words=(ws,i0,o0)=>ws.forEach((w,k)=>{const a=(i0+k*P.step)*b,o=o0*b+k*.03,pi=eExpo(seg(t,a,a+.45)),po=eInCub(seg(t,o,o+.22));w.style.transform=`translateY(${((1-pi)*110-po*110).toFixed(1)}%)`;w.style.visibility=pi>0&&po<1?'visible':'hidden'}); // ganz draußen unsichtbar (sonst blitzen Umlaut-Punkte am Maskenrand)
    words(E.a,P.aIn,P.aOut);words(E.c,P.cIn,P.cOut);
    // „Mehr“ + Walze
    if(!E._w){E._wf=E.fix.offsetWidth;E._wp=E.ph.map(p=>p.offsetWidth);if(E._wf)E._w=1}
    const gap=P.gap*150,tw=E._wf+gap+Math.max(...E._wp);E.row.style.left=(960-tw/2).toFixed(1)+'px';
    E.mask.style.left=(E._wf+gap).toFixed(1)+'px';E.mask.style.width=(Math.max(...E._wp)+40)+'px';
    const a=P.bIn*b,o=P.bOut*b,rin=eExpo(seg(t,a,a+.5)),rout=eInCub(seg(t,o,o+.3));
    E.fix.style.transform=`translateY(${((1-rin)*120-rout*120).toFixed(1)}%)`;E.fix.style.visibility=rin>0&&rout<1?'visible':'hidden';
    let p=-1+eExpo(seg(t,a+.08,a+.58));for(let k=1;k<ET_PH.length;k++){const s=(P.bIn+k*P.hold)*b;p+=eIO(seg(t,s,s+P.move))}
    p+=eInCub(seg(t,o+.04,o+.34));
    E.ph.forEach((el,i)=>{const d=i-p;el.style.transform=`translateY(${(d*240).toFixed(1)}px)`;el.style.opacity=Math.abs(d)<1.05?'1':'0'})},
  marks(M){const P=M.P,b=M.b;return [[P.aIn*b,'Gemeinsam'],[P.bIn*b,'Mehr Sichtbarkeit'],[(P.bIn+P.hold)*b,'Relevanz'],[(P.bIn+2*P.hold)*b,'Verbindung'],[P.cIn*b,'Markenbühne']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P,b=M.b;return [
    ['„Gemeinsam mehr erreichen.“',`${F(P.aIn*b)}–${F(P.aOut*b+.4)}`,'Wort für Wort aus der Maske, raus nach oben'],
    ['„Mehr Sichtbarkeit. / Relevanz. / Verbindung.“',`${F(P.bIn*b)}–${F(P.bOut*b+.35)}`,'„Mehr“ steht, die Satzenden laufen durch'],
    ['„Österreichs größte tägliche Markenbühne.“',`${F(P.cIn*b)}–${F(M.total)}`,'Wort für Wort, raus nach oben; danach das jö-Logo']]},
  note:'Frames bei 24 fps ab Beginn der Subebene. Sechs Takte nach dem Billboard, auf dem jö-Verlauf; danach „Logo (Schluss)“.'
};
