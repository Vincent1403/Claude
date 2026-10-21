/* =====================================================================
   COMP: MENSCHEN (Partnerfilm) – Drehung wie „Partner Vollbild“, aber mit Fokus auf die einzelne Person:
   großer Name in Dunkelrot hinter der Person, zwei persönliche HUD-Karten, jede Folie zeigt eine Person und ihre
   Lieblingsmarke: Hintergrund in der Markenfarbe, HUD-Karten zur Marke.
   ===================================================================== */
// je Folie eine Person und ihre Lieblingsmarke: Hintergrund in der Markenfarbe (wie „Partner Vollbild“), HUD-Karten zur Marke
const PF_SCENES=[ // Person, Name, Partner, Markenfarbe, [HUD A], [HUD B]
 {p:'girl',name:'Lena',n:'adeg',bg:'#23872d',A:fsCard(250,170,580,170,`<div style="display:flex;align-items:center;gap:22px;padding:0 26px;height:100%">${fsCircle('adeg',112)}<div><div style="font-size:34px;font-weight:700">Hallo Lena</div><div style="font-size:22px;font-weight:500;margin-top:6px;opacity:.85">3 neue Gutscheine bei ADEG</div></div><svg viewBox="0 0 24 24" style="width:34px;margin-left:auto"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="${FS_BG}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`),
   B:fsCard(1190,690,520,200,`<div style="padding:34px 40px 40px;text-align:right"><div style="font-size:30px;font-weight:500">Meine Ersparnis bei ADEG</div><div style="font-size:84px;font-weight:700;letter-spacing:-.02em;line-height:1.1"><span class="fsNum" data-to="48.20" data-dec="2">0</span> €</div></div>`)},
 {p:'woman',name:'Renate',n:'bipa',bg:'#ec008c',A:fsCard(1170,140,560,300,`<div style="padding:32px 34px 36px"><div style="display:flex;align-items:center;gap:18px">${fsCircle('bipa',84)}<div><div style="font-size:34px;font-weight:700">Renates Coupon</div><div style="font-size:22px;font-weight:500;margin-top:4px;opacity:.85">exklusiv bei BIPA</div></div></div><div style="display:flex;align-items:flex-end;justify-content:space-between;margin-top:26px;padding-top:22px;border-top:3px dashed rgba(103,0,3,.18)"><div><div style="font-size:84px;font-weight:900;letter-spacing:-.02em;line-height:.9">−<span class="fsNum" data-to="20" data-dec="0">0</span> %</div><div style="font-size:22px;font-weight:500;margin-top:10px">auf ihre Lieblingspflege</div></div><span style="display:inline-flex;align-items:center;gap:8px;background:#ec008c;color:#fff;font-weight:800;font-size:22px;padding:12px 22px;border-radius:99px;white-space:nowrap"><svg viewBox="0 0 24 24" style="width:22px"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>Aktiviert</span></div></div>`),
   B:fsCard(220,680,640,150,`<div style="display:flex;align-items:center;gap:26px;padding:0 28px;height:100%">${fsRing('pa',100,12,1)}<div><div style="font-size:40px;font-weight:700;display:flex;align-items:center;gap:8px"><span class="fsNum" data-to="100" data-dec="0">0</span> ${fsOes(36,26)}</div><div style="font-size:22px;font-weight:500;margin-top:4px">gesammelt bei BIPA</div></div><div style="margin-left:auto">${fsBtn('Einlösen')}</div></div>`)},
 {p:'sport',name:'Sarah',n:'omv',bg:'#132656',A:fsCard(250,170,470,470,`<div style="padding:32px 32px 38px;display:flex;flex-direction:column;align-items:center"><div style="display:flex;align-items:center;gap:16px;align-self:stretch">${fsCircle('omv',72)}<div style="font-size:30px;font-weight:700">OMV Tankrabatt 10%</div></div><div style="position:relative;margin-top:24px">${fsRing('pb',260,26,.72)}<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:8px;font-size:58px;font-weight:700"><span class="fsNum" data-to="83" data-dec="0">0</span> ${fsOes(52,36)}</div></div></div>`),
   B:fsCard(1140,730,620,160,`<div style="display:flex;align-items:center;gap:24px;padding:0 28px;height:100%"><div style="flex:none;width:112px;height:112px;border-radius:50%;background:${FS_BG};color:#fff;display:grid;place-items:center;font-size:44px;font-weight:900">2×</div><div><div style="font-size:36px;font-weight:700;display:flex;align-items:center;gap:8px">Doppelte ${fsOes(34,24)}</div><div style="font-size:22px;font-weight:500;margin-top:4px">bei jedem Tankstopp</div></div></div>`)},
 {p:'student',name:'Jonas',n:'pagro',bg:'#e2001a',A:fsCard(1180,150,540,190,`<div style="padding:34px 36px 40px"><div style="display:flex;align-items:center;gap:16px">${fsCircle('pagro',64)}<div style="font-size:30px;font-weight:700">Schulstart bei PAGRO</div></div><div style="display:flex;align-items:center;justify-content:space-between;margin-top:22px"><div style="font-size:60px;font-weight:900;letter-spacing:-.02em;line-height:1">−15 %</div>${fsBtn('Aktivieren')}</div></div>`),
   B:fsCard(230,680,620,160,`<div style="display:flex;align-items:center;gap:24px;padding:0 28px;height:100%"><div style="position:relative">${fsRing('pc',112,13,.86)}<div style="position:absolute;inset:0;display:grid;place-items:center;font-size:30px;font-weight:700"><span class="fsNum" data-to="594" data-dec="0">0</span></div></div><div><div style="font-size:36px;font-weight:700;display:flex;align-items:center;gap:8px">Jonas’ ${fsOes(34,24)}</div><div style="font-size:22px;font-weight:500;margin-top:4px">gesammelt bei PAGRO</div></div></div>`)}];
PF_SCENES.splice(PF_SCENES.findIndex(s=>s.name==='Jonas'),1); // Kunde (Kürzung): Jonas raus
const PFL=document.createElement('div');PFL.id='peopleL';PFL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;font-family:var(--font);perspective:2400px;perspective-origin:50% 50%';
PFL.innerHTML=`
<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="pfRg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#c0233a"/><stop offset=".5" stop-color="#ee2a06"/><stop offset="1" stop-color="#ff7024"/></linearGradient></defs></svg>
<div id="pfBg" style="position:absolute;inset:0;background:${PF_SCENES[0].bg}"></div>
<div id="pfRig" style="position:absolute;inset:0;transform-style:preserve-3d;transform-origin:50% 50%">
 <div class="pfLy" style="position:absolute;inset:0;transform-origin:50% 50%"><div id="pfName" style="position:absolute;left:0;right:0;top:0;height:1080px;text-align:center;color:#fff;font-size:440px;font-weight:900;letter-spacing:-.04em;line-height:1;white-space:nowrap;transform-origin:50% 50%"></div></div>
 <div class="pfLy" style="position:absolute;inset:0;transform-origin:50% 50%"><img id="pfPerson" alt="" style="position:absolute;transform-origin:50% 100%;display:none"></div>
 <div class="pfLy" style="position:absolute;inset:0;transform-origin:50% 50%">${PF_SCENES.map((s,i)=>`<div class="pfHud" data-i="${i}" style="position:absolute;inset:0;display:none">${s.A.replace('class="fsc ','class="fsc fsA ')}${s.B.replace('class="fsc ','class="fsc fsB ')}</div>`).join('').replaceAll('url(#fsRg)','url(#pfRg)')}</div>
</div>`;
$('stage').appendChild(PFL);
{const st=document.createElement('style');st.textContent=`#peopleL .fsc{position:absolute;border-radius:28px;color:${FS_BG};background:linear-gradient(120deg,rgba(255,255,255,.96),rgba(255,255,255,.84));-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);box-shadow:0 24px 50px rgba(30,10,0,.16);overflow:hidden}#peopleL .oesw{display:inline-flex;align-items:flex-end;line-height:1}#peopleL .oesg{width:auto;display:inline-block;overflow:visible}#peopleL .oess{font-weight:900;margin-left:1px;line-height:.8}`;document.head.appendChild(st)}
const PFE={bg:$('pfBg'),rig:$('pfRig'),L:[...PFL.querySelectorAll('.pfLy')],name:$('pfName'),person:$('pfPerson'),huds:[...PFL.querySelectorAll('.pfHud')]};
PFE.huds.forEach(h=>{h._A=h.querySelector('.fsA');h._B=h.querySelector('.fsB');h._nums=[...h.querySelectorAll('.fsNum')];h._arcs=[...h.querySelectorAll('.fsArc')]});
const PEOPLE={
  key:'people',name:'Menschen',lane:'laneV4',cls:'bento',
  DEF:{beat:13.725/24,sb:3,flip:20/24,personH:980,zName:-260,zPerson:120,zHud:380,nameSize:440},
  params:[
    {k:'sb',label:'Pro Person (Schläge)',min:2,max:8,step:1,fmt:v=>String(v),sub:'die Kante jeder Drehung liegt auf einem Schlag; Clip beginnt auf dem Drop'},
    {k:'flip',label:'Dauer Drehung',min:6/24,max:24/24,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'ganzes Bild dreht sich um die Hochachse; Hintergrund wechselt dabei in die nächste Markenfarbe'},
    {k:'nameSize',label:'Größe Name',min:240,max:560,step:10,fmt:v=>v+' px'},
    {k:'personH',label:'Größe Person',min:700,max:1080,step:10,fmt:v=>v+' px'},
    {k:'zName',label:'Tiefe Name',min:-600,max:0,step:10,fmt:v=>v+' px'},
    {k:'zHud',label:'Tiefe HUD-Karten',min:0,max:700,step:10,fmt:v=>v+' px'}],
  model(P){const b=P.beat,per=P.sb*b,n=PF_SCENES.length;const starts=PF_SCENES.map((_,i)=>i*per);
    return {P,b,per,starts,key:per,keyName:'erste Drehung',total:n*per}},
  show(on){PFL.style.display=on?'':'none'},
  render(M,t){const P=M.P,E=PFE,n=PF_SCENES.length,fl=P.flip;
    let idx=0,rot=0,blend=0,from=0,to=0;
    for(let i=0;i<n;i++){const d=t-M.starts[i];if(d>=0)idx=i;
      if(i>0&&d>=-FL_C*fl&&d<(1-FL_C)*fl){const u=d/fl+FL_C,e=eFlip(u);rot=e<.5?-e*180:180-e*180;blend=eIO(seg(e,.2,.8));from=i-1;to=i;idx=e<.5?i-1:i}}
    if(!rot&&!blend){from=to=idx}
    const mix=(a,c,f)=>{const pa=[1,3,5].map(o=>parseInt(a.substr(o,2),16)),pc=[1,3,5].map(o=>parseInt(c.substr(o,2),16));return `rgb(${pa.map((v,q)=>Math.round(v+(pc[q]-v)*f)).join(',')})`};
    E.bg.style.background=mix(PF_SCENES[from].bg,PF_SCENES[to].bg,blend);
    const sc=PF_SCENES[idx],lt=t-M.starts[idx],dr=seg(lt,0,M.per);
    const zc=z=>(2400-z)/2400,zs=[P.zName,P.zPerson,P.zHud];
    E.rig.style.transform=`rotateY(${rot.toFixed(2)}deg)`;
    E.L.forEach((el,k)=>el.style.transform=`translateZ(${zs[k]}px) scale(${zc(zs[k]).toFixed(5)})`);
    // Name: steigt beim ersten Bild auf, wächst danach ganz langsam
    if(!E.name._jo){E.name._jo=1;E.name.innerHTML=`<svg viewBox="0 0 271.15 182.86" style="position:absolute;left:360px;top:135px;width:1200px;overflow:visible"><path d="${LP.J} ${LP.E}" fill="#fff"/><circle cx="87.99" cy="16.8" r="16.8" fill="#fff"/><circle cx="152.94" cy="16.8" r="16.8" fill="#fff"/><circle cx="207.17" cy="16.8" r="16.8" fill="#fff"/></svg>`} // Kundenfeedback: jö-Logo statt Name im Hintergrund
    const ni=idx===0?eExpo(seg(lt,.05,.6)):1;
    E.name.style.fontSize=P.nameSize+'px';
    E.name.style.transform=`translateY(${((1-ni)*160).toFixed(1)}px) scale(${(1+.04*dr).toFixed(4)})`;E.name.style.opacity=ni.toFixed(3);
    // Person
    const src=POA[sc.p];if(E.person._s!==src){E.person._s=src;E.person.src=src}
    const ar={girl:709/1000,woman:425/1000,sport:623/1000,student:735/1000}[sc.p],ph=P.personH,pw=ph*ar,pin=idx===0?eOut(seg(lt,.12,.55)):1;
    E.person.style.display='';
    Object.assign(E.person.style,{height:ph+'px',width:pw+'px',left:(960-pw/2+(sc.p==='woman'?20:0))+'px',top:(1080-ph+10)+'px',opacity:pin.toFixed(3),
      transform:`translateY(${((-16*eOut(dr))+(1-pin)*120).toFixed(1)}px) scale(${(1+.035*dr).toFixed(4)})`});
    // HUD-Karten poppen nach der Drehung auf, Zahlen zählen hoch
    E.huds.forEach((h,i)=>{h.style.display=i===idx?'':'none';if(i!==idx)return;
      const a0=idx===0?.45:fl*(1-FL_C)*.55;
      [[h._A,0],[h._B,.18]].forEach(([c,o])=>{const p=seg(lt,a0+o,a0+o+.5),e=eBack(p);c.style.opacity=Math.min(1,p*3).toFixed(3);
        c.style.transform=`translateY(${((1-eExpo(p))*40+Math.sin((t+o*9)*1.6)*5*seg(lt,a0+.6,a0+1.2)).toFixed(1)}px) scale(${(.86+.14*e).toFixed(4)})`});
      const cnt=eIO(seg(lt,a0+.1,a0+.9));
      h._nums.forEach(nm=>{const v=+nm.dataset.to,dec=+nm.dataset.dec;nm.textContent=(v*cnt).toFixed(dec).replace('.',',')});
      h._arcs.forEach(a=>{const c=+a.dataset.c,v=+a.dataset.v;a.setAttribute('stroke-dashoffset',(c*(1-v*cnt)).toFixed(1))})});
  },
  marks(M){return PF_SCENES.map((s,i)=>[M.starts[i],s.name])},
  table(M){const F=s=>Math.round(s*FPS),P=M.P;return [
    ...PF_SCENES.map((s,i)=>[`${s.name} (${s.p})`,`${F(M.starts[i])}–${F(M.starts[i]+M.per)}`,`${s.n.toUpperCase()}: Hintergrund ${s.bg}, Name ${P.nameSize} px weiß, zwei HUD-Karten zur Marke`]),
    ['Drehung',`${F(P.flip)} F`,'Kante auf dem Schlag, Farbe wechselt während der Drehung']]},
  note:'Frames bei 24 fps ab Beginn der Subebene. Gleiche Freisteller und Drehung wie „Partner Vollbild“, aber mit Namen statt jö-Logo und persönlichen Karten. Namen sind Vorschläge.'
};
