/* =====================================================================
   COMP: ANGEBOTS-WAND (Partnerfilm) – schließt an die Angebotskarte der Badges an: die Kamera zieht auf,
   die BIPA-Karte wird zur Karte in der Mitte einer Wand aus drei Spalten. Danach laufen die linke und rechte
   Spalte nach unten, die mittlere nach oben. Bilder sind Platzhalter, bis die echten Motive da sind.
   ===================================================================== */
const WL_CARDS={ // Partner, Name, Pill, Icon, Text, Button
 bipa:{l:'bipa',n:'BIPA',p:'250',k:'oes',t:'250 Zusatz Ös auf den Einkauf',b:'Scan erforderlich',img:'__BD_IMG__'},
 adeg:{l:'adeg',n:'ADEG',p:'-&#8239;30%',k:'jo',t:'-30 % auf das teuerste Produkt',b:'Aktivieren'},
 billa:{l:'billa',n:'BILLA',p:'+500',k:'oes',t:'500 Ös pro Einkauf',b:'Aktivieren'},
 penny:{l:'penny',n:'PENNY',p:'3fach',k:'oes',t:'3fach Ös auf den Wocheneinkauf',b:'Scan erforderlich'},
 allianz:{l:'allianz',n:'ALLIANZ',p:'+3000',k:'oes',t:'3000 Ös bei Abschluss',b:'Mehr erfahren'},
 pagro:{l:'pagro',n:'PAGRO',p:'-&#8239;15%',k:'jo',t:'-15 % auf Schulartikel',b:'Aktivieren'},
 omv:{l:'omv',n:'OMV',p:'2fach',k:'oes',t:'Doppelte Ös bei jedem Tankstopp',b:'Aktivieren'},
 universal:{l:'universal',n:'UNIVERSAL',p:'400&#8239;€',k:'jo',t:'400 € Rabatt auf Möbel',b:'Einlösen'}};
const WL_COLS=[['billa','allianz','omv','penny','universal','adeg','pagro'],['pagro','adeg','bipa','billa','penny','allianz','omv'],['omv','universal','adeg','pagro','billa','penny','bipa_ph']];
WL_CARDS.bipa_ph={...WL_CARDS.bipa,img:null};
const WL_CENTER=2,WL_GX=64,WL_GY=64; // BIPA-Karte = Zeile 2 der mittleren Spalte
const wlPill=(p,k)=>`<div style="position:absolute;right:${BD_CW-bdc(983)}px;top:${bdc(306)-BD_PH/2}px;height:${BD_PH}px;display:flex;align-items:center;gap:${BD_GAP}px;padding:0 ${BD_PADR}px 0 ${BD_PADL}px;background:#fff;border-radius:999px;box-shadow:0 10px 30px rgba(94,23,8,.08);color:${BD_DARK};font-size:34px;font-weight:700;letter-spacing:-.01em;white-space:nowrap;line-height:1">${p}${k==='oes'
  ?`<div style="width:64px;height:64px;border-radius:50%;background:${BD_DARK};display:grid;place-items:center"><span style="display:block;width:68%">${oesSvg('#fff').replace('class="oesg"','class="oesg" style="width:100%;height:auto;display:block"')}</span></div>`
  :`<div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#c8263a 0%,#e8481c 50%,#f5913f 100%);display:grid;place-items:center">${bdJo}</div>`}</div>`;
const wlCard=(c,x,y)=>`<div class="wlCard" style="position:absolute;left:${x}px;top:${y}px;width:${BD_CW}px;height:${BD_CH}px;background:#fff;border-radius:24px;box-shadow:0 30px 70px rgba(94,23,8,.12);color:#6a1006;overflow:hidden">
  <img src="${PTA[c.l]}" alt="" style="position:absolute;left:${bdc(82)}px;top:${bdc(70)}px;width:${bdc(92)}px;height:${bdc(92)}px;border-radius:50%">
  <div style="position:absolute;left:${bdc(200)}px;top:${bdc(116)}px;transform:translateY(-50%);font-size:${bdc(46)}px;font-weight:800">${c.n}</div>
  <div style="position:absolute;right:${bdc(95)}px;top:${bdc(118)}px;transform:translateY(-50%);font-size:${bdc(27)}px;font-weight:700">Gültig bis 31.10.2026</div>
  <div style="position:absolute;left:${bdc(36)}px;top:${bdc(208)}px;width:${bdc(992)}px;height:${bdc(468)}px;${c.img?`background:url(${c.img}) center/100% auto no-repeat`:'background:linear-gradient(135deg,#ead9c6,#f2c9a3);display:grid;place-items:center'}">${c.img?'':`<span style="font-size:30px;font-weight:600;color:rgba(106,16,6,.45)">Bild folgt</span>`}</div>
  ${wlPill(c.p,c.k)}
  <div style="position:absolute;left:${bdc(83)}px;top:${bdc(750)}px;transform:translateY(-50%);font-size:${bdc(42)}px;font-weight:700;white-space:nowrap">${c.t}</div>
  <div style="position:absolute;left:${bdc(82)}px;top:${bdc(822)}px;width:${bdc(124)}px;height:${bdc(124)}px;border-radius:50%;border:2px solid #6a1006;display:grid;place-items:center"><svg viewBox="0 0 24 24" style="width:46%"><path d="M12 20.5s-7.5-4.6-9.2-9.3C1.7 8 3.8 4.8 7.1 4.8c2 0 3.4 1.1 4.9 2.9 1.5-1.8 2.9-2.9 4.9-2.9 3.3 0 5.4 3.2 4.3 6.4-1.7 4.7-9.2 9.3-9.2 9.3z" fill="none" stroke="#6a1006" stroke-width="1.4" stroke-linejoin="round"/></svg></div>
  <div style="position:absolute;left:${bdc(458)}px;top:${bdc(822)}px;width:${bdc(517)}px;height:${bdc(124)}px;border-radius:999px;background:#6a1006;color:#fff;display:grid;place-items:center;font-size:${bdc(42)}px;font-weight:700">${c.b}</div>
 </div>`;
const WLL=document.createElement('div');WLL.id='wallL';WLL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;font-family:var(--font);background:#f4f1ea';
WLL.innerHTML=`<div id="wlG" style="position:absolute;left:960px;top:540px;width:0;height:0">${WL_COLS.map((col,ci)=>`<div class="wlCol" style="position:absolute;left:0;top:0">${col.map((k,ri)=>wlCard(WL_CARDS[k],(ci-1)*(BD_CW+WL_GX)-BD_CW/2,(ri-WL_CENTER)*(BD_CH+WL_GY)-BD_CH/2)).join('')}</div>`).join('')}</div>`;
$('stage').appendChild(WLL);
const WLE={g:$('wlG'),cols:[...WLL.querySelectorAll('.wlCol')]};
WLE.others=[...WLL.querySelectorAll('.wlCard')].filter((el,i)=>!(i===WL_COLS[0].length+WL_CENTER)); // alle außer der BIPA-Karte in der Mitte
const WALL={
  key:'wall',name:'Angebots-Wand',lane:'laneV5',cls:'bento',
  DEF:{zoomDur:1.1,wallScale:.66,speed:150,side:.5,ramp:.8},
  params:[
    {k:'zoomDur',label:'Aufziehen über',min:.4,max:2.5,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'von der einzelnen Angebotskarte (Größe wie am Ende der Badges) auf die Wand mit drei Spalten'},
    {k:'wallScale',label:'Größe der Wand',min:.45,max:.9,step:.01,fmt:v=>Math.round(v*100)+' %'},
    {k:'speed',label:'Tempo der Spalten',min:0,max:400,step:5,fmt:v=>v+' px/s',sub:'links und rechts nach unten, Mitte nach oben'},
    {k:'side',label:'Versatz der Seitenspalten',min:0,max:1,step:.05,fmt:v=>Math.round(v*100)+' % Kartenhöhe',sub:'Seitenspalten sitzen versetzt zur Mitte'},
    {k:'ramp',label:'Anlaufen über',min:0,max:2,step:.05,fmt:v=>num(v,2)+' s',sub:'die Spalten setzen sich weich in Bewegung, schon während die Kamera aufzieht'}],
  model(P){return {P,key:P.zoomDur,keyName:'Wand steht',total:12}},
  show(on){WLL.style.display=on?'':'none'},
  render(M,t){const P=M.P,E=WLE,s0=(typeof S!=='undefined'&&S.comps.badges)?S.comps.badges.params.cardScale:1.08;
    const z=eIO(seg(t,0,P.zoomDur)),sc=s0+(P.wallScale-s0)*z;E.g.style.transform=`scale(${sc.toFixed(5)})`;
    // weich anlaufen, dann gleichmäßig: Weg in Bildschirm-Pixeln → in Wandeinheiten umrechnen
    const tau=Math.max(0,t-P.zoomDur*.35),run=P.ramp>0?tau-P.ramp*(1-Math.exp(-tau/P.ramp)):tau,d=P.speed*run/sc;
    const off=P.side*(BD_CH+WL_GY)*z,fo=eOut(seg(t,.05,P.zoomDur*.7)).toFixed(3); // Nachbarkarten blenden beim Aufziehen ein
    WLE.others.forEach(el=>el.style.opacity=fo);
    E.cols.forEach((c,i)=>{const dir=i===1?-1:1,y=dir*d+(i===1?0:-off);c.style.transform=`translateY(${y.toFixed(1)}px)`});
  },
  marks(M){return [[0,'Karte'],[M.P.zoomDur,'Wand']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P;return [
    ['Aufziehen',`0–${F(P.zoomDur)}`,`Angebotskarte → Wand, ${Math.round(P.wallScale*100)} %`],
    ['Spalten laufen',`ab ${F(P.zoomDur*.35)}`,`${P.speed} px/s, links und rechts nach unten, Mitte nach oben`]]},
  note:'Frames bei 24 fps ab Beginn der Subebene. Schließt nahtlos an das Ende der Badges an (gleiche Karte, gleiche Größe). Bilder außer BIPA sind Platzhalter.'
};
