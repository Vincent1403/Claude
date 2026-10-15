/* =====================================================================
   COMP: FORMATE (Partnerfilm) – nach „Konsistent über alle Kanäle.“: dieselbe Kampagne in verschiedenen Formaten
   (Story 9:16, Landscape 16:9, Square 1:1, In-App-Karte, Feed 4:5, Push) mit den Elementen aus den Badges
   (jö-Preis-Pill, Ös-Pill, Etikett, Tag-Formen, Angebotskarte). Rahmen ploppen nacheinander auf, danach die Badges.
   ===================================================================== */
const FM_INK='#5e1708',FM_DK='#3a0a06';
const fmOes=(h,c='#fff')=>oesSvg(c).replace('class="oesg"',`class="oesg" style="height:${h}px;width:auto"`);
const fmOesPill=(n,h)=>`<div class="fmBd fmPl" data-side="r" style="display:inline-flex;align-items:center;gap:${h*.18}px;height:${h}px;padding:0 ${h*.1}px 0 ${h*.34}px;border-radius:${h}px;background:#fff;color:${FM_DK};font-size:${h*.5}px;font-weight:700;box-shadow:0 10px 24px rgba(40,10,0,.18);white-space:nowrap">${n}<div style="width:${h*.8}px;height:${h*.8}px;border-radius:50%;background:${FM_INK};display:grid;place-items:center">${fmOes(h*.38)}</div></div>`;
const fmJoPill=(p,h)=>`<div class="fmBd fmPl" data-side="r" style="display:inline-flex;align-items:center;gap:${h*.18}px;height:${h}px;padding:0 ${h*.1}px 0 ${h*.34}px;border-radius:${h}px;background:#fff;color:${FM_DK};font-size:${h*.5}px;font-weight:700;box-shadow:0 10px 24px rgba(40,10,0,.18);white-space:nowrap">${p}${s2Jo(Math.round(h*.8))}</div>`;
const fmTag=(sh,txt,bg,fg,h)=>`<div class="fmBd" style="display:inline-flex;align-items:center;gap:${h*.26}px;height:${h}px;padding:0 ${h*.42}px;border-radius:${h*.22}px;background:${bg};color:${fg};font-size:${h*.46}px;font-weight:800;white-space:nowrap">${tgSvg(sh,Math.round(h*.4))}${txt}</div>`;
const FM_S1=[ // x, y, w, h, Hintergrund, Inhalt
 [90,136.0,454,808,ST_RED,`
  <img data-z="1" class="fmIm" src="${STI.woman}" alt="" style="position:absolute;left:0;top:0;width:454px;height:454px;object-fit:cover;border-radius:0 0 48px 48px">
  <div style="position:absolute;left:236px;top:376px">${fmOesPill('250',66)}</div>
  <div style="position:absolute;left:38px;top:494px">${fmTag('sq','Neu',ST_OR,'#fff',46)}</div>
  <div style="position:absolute;left:38px;top:566px;color:#fff;font-size:48px;font-weight:800;line-height:1.05;letter-spacing:-.01em"><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">Mehr Sport,</div></div><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">doppelte Ös,</div></div><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">besserer Preis!</div></div></div>`],
 [594,136.0,760,427.5,ST_OR,`
  <div style="position:absolute;left:44px;top:44px">${fmTag('hg','Letzte Chance',S2_INK,'#fff',42)}</div>
  <div style="position:absolute;left:44px;top:112px;color:${S2_INK};font-size:58px;font-weight:800;line-height:1.02;letter-spacing:-.01em"><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">Exklusive</div></div><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">Sportdeals</div></div><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">entdecken!</div></div></div>
  <div style="position:absolute;left:44px;top:322px">${fmJoPill('49&#8239;€',70)}</div>
  <div class="fmIm" style="position:absolute;left:440px;top:36px;width:280px;height:392px;border-radius:40px 40px 0 0;background:#f2bf62;overflow:hidden"><img data-z="1" class="fmIm" src="${S2I.girl}" alt="" style="position:absolute;left:-14px;top:18px;width:300px;max-width:none"></div>`],
 [594,619.5,324.5,324.5,'#e4e1ea',`
  <img data-z="1" class="fmIm" src="${S2I.pad}" alt="" style="position:absolute;left:-18px;top:58px;width:360px;max-width:none">
  <div style="position:absolute;left:22px;top:22px">${fmTag('ci','Games',S2_INK,'#fff',38)}</div>
  <div style="position:absolute;left:46px;top:246px"><div class="fmBd fmPl" data-side="l" style="display:inline-flex;align-items:center;gap:12px;height:56px;padding:0 22px 0 5px;border-radius:56px;background:#fff;color:${FM_DK};font-size:25px;font-weight:800;box-shadow:0 10px 24px rgba(40,10,0,.18)">${s2Jo(46)}Jetzt spielen</div></div>`],
 [958.5,619.5,395.5,324.5,'#fff',`
  <img src="${PTA.bipa}" alt="" style="position:absolute;left:18px;top:16px;width:38px;height:38px;border-radius:50%">
  <div style="position:absolute;left:66px;top:24px;color:#6a1006;font-size:20px;font-weight:700">BIPA</div>
  <div style="position:absolute;right:18px;top:29px;color:#6a1006;font-size:11px;font-weight:500">Gültig bis 31.10.2026</div>
  <div data-z="1" class="fmImg fmIm" style="position:absolute;left:12px;top:66px;width:371.5px;height:150px;border-radius:6px;background-position:center;background-size:cover"></div>
  <div style="position:absolute;right:24px;top:78px">${fmOesPill('250',40)}</div>
  <div style="position:absolute;left:18px;top:230px;color:#6a1006;font-size:17px;font-weight:600">250 Zusatz Ös auf den Einkauf</div>
  <div style="position:absolute;left:18px;top:264px;width:42px;height:42px;border-radius:50%;border:2px solid #6a1006;box-sizing:border-box;display:grid;place-items:center"><svg viewBox="0 0 24 24" style="width:20px"><path d="M12 20s-7-4.4-7-9.6A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.4C19 15.6 12 20 12 20z" fill="none" stroke="#6a1006" stroke-width="2"/></svg></div>
  <div style="position:absolute;right:18px;top:264px;height:42px;padding:0 26px;border-radius:42px;background:#6a1006;color:#fff;font-size:16px;font-weight:700;display:grid;place-items:center">Scan erforderlich</div>`],
 [1404,136.0,426,532.5,JG_CSS,`
  <div style="position:absolute;left:36px;top:34px;color:#fff;font-size:46px;font-weight:800;line-height:1.05;letter-spacing:-.01em"><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">Dein Bonus</div></div><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">beim Einkauf.</div></div></div>
  <div class="fmBd" style="position:absolute;left:83px;top:190px;width:260px;height:290px;border-radius:34px;background:${FM_INK};color:#fff;display:flex;flex-direction:column;align-items:center;padding-top:30px;box-sizing:border-box">
   <div style="font-size:24px;font-weight:700">Rabatt</div><div style="font-size:96px;font-weight:800;line-height:1;margin-top:4px">5&#8239;€</div>
   <div style="margin-top:22px">${fmOesPill('250',82).replace('class="fmBd fmPl" ','class="fmPl" ')}</div></div>`],
 [1404,724.5,426,219.5,'#f9ddc3',`
  <div class="fmBd" style="position:absolute;left:20px;top:46px;width:386px;height:128px;border-radius:26px;background:rgba(255,255,255,.92);box-shadow:0 14px 30px rgba(40,10,0,.14);display:flex;align-items:center;gap:16px;padding:0 18px;box-sizing:border-box">
   <div style="flex:none;width:64px;height:64px;border-radius:16px;background:${JG_CSS};display:grid;place-items:center">${s2Jo(64).replace(/background:[^;]+;/,'background:transparent;')}</div>
   <div style="min-width:0"><div style="color:#8a6a60;font-size:15px;font-weight:600">jö · jetzt</div><div style="color:${FM_DK};font-size:21px;font-weight:800;margin-top:3px">250 Zusatz Ös bei BIPA</div><div style="color:${FM_DK};font-size:17px;font-weight:500;margin-top:3px">Nur noch heute aktivieren.</div></div></div>`]];
const FM_PILL=(inner,h)=>`<div class="fmBd fmPl" data-side="l" style="display:inline-flex;align-items:center;gap:${h*.18}px;height:${h}px;padding:0 ${h*.34}px 0 ${h*.09}px;border-radius:${h}px;background:#fff;color:${FM_DK};font-size:${h*.46}px;font-weight:800;box-shadow:0 10px 24px rgba(40,10,0,.18);white-space:nowrap">${inner}</div>`;
const fmPush=(t1,t2)=>`<div class="fmBd" style="position:absolute;left:20px;top:46px;width:386px;height:128px;border-radius:26px;background:rgba(255,255,255,.92);box-shadow:0 14px 30px rgba(40,10,0,.14);display:flex;align-items:center;gap:16px;padding:0 18px;box-sizing:border-box">
   <div style="flex:none;width:64px;height:64px;border-radius:16px;background:${JG_CSS};display:grid;place-items:center">${s2Jo(64).replace(/background:[^;]+;/,'background:transparent;')}</div>
   <div style="min-width:0"><div style="color:#8a6a60;font-size:15px;font-weight:600">jö · jetzt</div><div style="color:${FM_DK};font-size:21px;font-weight:800;margin-top:3px">${t1}</div><div style="color:${FM_DK};font-size:17px;font-weight:500;margin-top:3px">${t2}</div></div></div>`;
const fmEtikett=(x,y,w,h,top,big,oes)=>`<div class="fmBd" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:32px;background:${FM_INK};color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:${h*.1}px 0 ${h*.08}px;box-sizing:border-box">
   <div style="text-align:center">${top?`<div style="font-size:${h*.08}px;font-weight:700">${top}</div>`:''}<div style="font-size:${h*.3}px;font-weight:800;line-height:1;letter-spacing:-.02em">${big}</div></div>${fmOesPill(oes,h*.28).replace('class="fmBd fmPl" ','class="fmPl" ')}</div>`;
// Bildschirm 2: Sport · Games · Deals
const FM_S2=[
 [90,136,760,427.5,ST_OR,`
  <div style="position:absolute;left:44px;top:44px">${fmTag('ci','Games',S2_INK,'#fff',42)}</div>
  <div style="position:absolute;left:44px;top:112px;color:${S2_INK};font-size:64px;font-weight:800;line-height:1.02;letter-spacing:-.01em"><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">Spielen &amp;</div></div><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">Gewinnen</div></div></div>
  <div style="position:absolute;left:44px;top:300px">${FM_PILL(s2Jo(58)+'Jetzt spielen',70)}</div>
  <div class="fmIm" style="position:absolute;left:420px;top:36px;width:300px;height:392px;border-radius:40px 40px 0 0;background:#e4e1ea;overflow:hidden"><img data-z="1" class="fmIm" src="${S2I.pad}" alt="" style="position:absolute;left:-60px;top:110px;width:400px;max-width:none"></div>`],
 [90,619.5,324.5,324.5,'#000',`
  <img data-z="1" class="fmIm" src="${STI.man}" alt="" style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover">
  <div style="position:absolute;left:146px;top:240px">${fmOesPill('500',58)}</div>`],
 [454.5,619.5,395.5,324.5,'#5e0f0b',`
  <img data-z="1" class="fmIm" src="${S2I.beer}" alt="" style="position:absolute;left:26px;top:34px;height:270px;max-width:none">
  <div style="position:absolute;left:214px;top:36px">${fmTag('x','Deal',ST_OR,'#fff',38)}</div>
  <div style="position:absolute;left:214px;top:98px;color:#fff;font-size:30px;font-weight:800;line-height:1.1"><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">Hirter</div></div><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">Privat Pils</div></div></div>
  <div style="position:absolute;left:206px;top:226px">${fmJoPill('-&#8239;25%',64)}</div>`],
 [900,136,426,532.5,JG_CSS,`
  <div style="position:absolute;left:36px;top:34px;color:#fff;font-size:46px;font-weight:800;line-height:1.05;letter-spacing:-.01em"><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">Deine</div></div><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">Sportwoche.</div></div></div>
  ${fmEtikett(83,196,260,300,'','-&#8239;20%','500').replace('font-size:90px','font-size:68px')}`],
 [900,724.5,426,219.5,'#e4e1ea',fmPush('Neuer Deal bei Hirter','-25 % mit deinen Ös.')],
 [1376,136,454,808,'#e4e1ea',`
  <div class="fmIm" style="position:absolute;left:0;top:300px;width:454px;height:508px;border-radius:48px 48px 0 0;background:${JG_CSS}"></div>
  <img data-z="1" class="fmIm" src="${S4I.girl}" alt="" style="position:absolute;left:-46px;top:36px;width:540px;max-width:none">
  <div style="position:absolute;left:30px;top:30px">${fmTag('ci','Aktion','#fff','#e3301b',40)}</div>
  <div style="position:absolute;left:54px;top:440px">${fmJoPill('Sportdeals',66)}</div>
  <div style="position:absolute;left:34px;top:676px;color:#fff;font-size:44px;font-weight:800;line-height:1.05;letter-spacing:-.01em"><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">Mehr Bewegung,</div></div><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">mehr Ös.</div></div></div>`]];
// Bildschirm 3: Share · Sammeln & Sparen · Wocheneinkauf
const FM_S3=[
 [90,136,426,532.5,'#e4e1ea',`
  <div class="fmIm" style="position:absolute;left:0;top:170px;width:426px;height:362.5px;border-radius:48px 48px 0 0;background:${JG_CSS}"></div>
  <img data-z="1" class="fmIm" src="${S3I.man}" alt="" style="position:absolute;left:150px;top:34px;height:500px;max-width:none">
  <div style="position:absolute;left:30px;top:30px">${fmTag('sq','Neu','#fff','#e3301b',40)}</div>
  <div style="position:absolute;left:30px;top:330px">${FM_PILL(`<span style="padding-left:${64*.25}px">Share</span><span style="display:inline-flex">${['av1','av2','av3'].map((a,k)=>`<img src="${S3I[a]}" alt="" style="width:46px;height:46px;border-radius:50%;border:3px solid #fff;margin-left:${k?-14:0}px">`).join('')}</span>`,64)}</div>`],
 [90,724.5,426,219.5,'#f9ddc3',fmPush('Lena teilt 100 Ös mit dir','Jetzt in der jö App ansehen.')],
 [566,136,454,808,'#e4e1ea',`
  <div class="fmIm" style="position:absolute;left:0;top:560px;width:454px;height:248px;border-radius:48px 48px 0 0;background:${JG_CSS}"></div>
  <svg class="fmIm" viewBox="0 0 454 600" style="position:absolute;left:0;top:0;width:454px;height:600px"><circle class="fmRing" cx="227" cy="320" r="180" fill="none" stroke="#e3301b" stroke-width="46" stroke-dasharray="0 1200" stroke-linecap="round" transform="rotate(120 227 320)"/></svg>
  <img data-z="1" class="fmIm" src="${S5I.girl}" alt="" style="position:absolute;left:-8px;top:40px;height:560px;max-width:none">
  <div style="position:absolute;left:30px;top:30px">${fmTag('ci','Aktion','#fff','#e3301b',40)}</div>
  <div style="position:absolute;left:150px;top:470px">${fmJoPill('1&#8239;€ = 1&#8239;Ö',60)}</div>
  <div style="position:absolute;left:34px;top:620px;color:#fff;font-size:56px;font-weight:800;line-height:1.02;letter-spacing:-.01em"><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">Sammeln &amp;</div></div><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">Sparen</div></div></div>`],
 [1070,136,760,427.5,ST_OR,`
  <div style="position:absolute;left:44px;top:44px">${fmTag('hg','Letzte Chance',S2_INK,'#fff',42)}</div>
  <div style="position:absolute;left:44px;top:112px;color:${S2_INK};font-size:54px;font-weight:800;line-height:1.04;letter-spacing:-.01em"><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">Clever sparen</div></div><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">bei deinem</div></div><div style="overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em"><div class="fmLn">Wocheneinkauf.</div></div></div>
  <img data-z="1" class="fmIm" src="${S6I.bag}" alt="" style="position:absolute;left:452px;top:70px;width:300px;max-width:none">
  <div style="position:absolute;left:520px;top:40px">${fmJoPill('-&#8239;25%',70)}</div>`],
 [1070,619.5,324.5,324.5,JG_CSS,fmEtikett(52,34,220,256,'','Bonus-<br>box','250').replace('font-size:76.8px','font-size:52px')],
 [1434.5,619.5,395.5,324.5,'#fff',`
  <img src="${PTA.adeg}" alt="" style="position:absolute;left:18px;top:16px;width:38px;height:38px;border-radius:50%">
  <div style="position:absolute;left:66px;top:24px;color:#6a1006;font-size:20px;font-weight:700">ADEG</div>
  <div style="position:absolute;right:18px;top:29px;color:#6a1006;font-size:11px;font-weight:500">Gültig bis 31.10.2026</div>
  <div style="position:absolute;left:12px;top:66px;width:371.5px;height:150px;border-radius:6px;background:#23872d;overflow:hidden"><img data-z="1" class="fmIm" src="${S6I.bag}" alt="" style="position:absolute;left:30px;top:-20px;width:170px;max-width:none"></div>
  <div style="position:absolute;right:24px;top:78px">${fmOesPill('3fach',40)}</div>
  <div style="position:absolute;left:18px;top:230px;color:#6a1006;font-size:17px;font-weight:600">3fach Ös auf deinen Wocheneinkauf</div>
  <div style="position:absolute;left:18px;top:264px;width:42px;height:42px;border-radius:50%;border:2px solid #6a1006;box-sizing:border-box;display:grid;place-items:center"><svg viewBox="0 0 24 24" style="width:20px"><path d="M12 20s-7-4.4-7-9.6A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.4C19 15.6 12 20 12 20z" fill="none" stroke="#6a1006" stroke-width="2"/></svg></div>
  <div style="position:absolute;right:18px;top:264px;height:42px;padding:0 26px;border-radius:42px;background:#6a1006;color:#fff;font-size:16px;font-weight:700;display:grid;place-items:center">Aktivieren</div>`]];
const FM_SC=[FM_S1,FM_S2,FM_S3];
const FML=document.createElement('div');FML.id='fmtL';FML.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;font-family:var(--font);background:#f4f1ea';
FML.innerHTML=`<div id="fmG" style="position:absolute;inset:0;transform-origin:50% 50%">${FM_SC.map((sc,si)=>sc.map(([x,y,w,h,bg,html])=>`
 <div class="fmFr" data-s="${si}" data-x="${x}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:24px;overflow:hidden;background:${bg};box-shadow:0 26px 60px rgba(60,20,0,.16);transform-origin:50% 60%">${html}</div>`).join('')).join('')}</div>`;
$('stage').appendChild(FML);
{const st=document.createElement('style');st.textContent='#fmtL .oesw{display:inline-flex;align-items:flex-end;line-height:1}#fmtL .oesg{display:inline-block;overflow:visible}';document.head.appendChild(st)}
{const bi=document.querySelector('#badgeL .bdImg');if(bi)FML.querySelector('.fmImg').style.backgroundImage=bi.style.backgroundImage}
const FME={g:$('fmG'),fr:[...FML.querySelectorAll('.fmFr')]};
FME.el=FME.fr.map(f=>({im:[...f.querySelectorAll('.fmIm')],ln:[...f.querySelectorAll('.fmLn')],bd:[...f.querySelectorAll('.fmBd')],pl:[...f.querySelectorAll('.fmPl')],rg:[...f.querySelectorAll('.fmRing')]}));
const FORMATS={
  key:'formats',name:'Formate (drei Bildschirme)',lane:'laneV3',cls:'bento',
  DEF:{beat:13.725/24,hold:8,dur:1.1,lag:.16,inLag:.38,travel:1240},
  params:[
    {k:'hold',label:'Bildschirm steht',min:4,max:12,step:1,fmt:v=>v+' Schläge',sub:'danach gleitet der Bildschirm nach oben raus, der nächste kommt von unten'},
    {k:'dur',label:'Dauer Bewegung',min:.5,max:2,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'Slow In / Slow Out wie der Story-Übergang'},
    {k:'lag',label:'Versatz Rahmen (Wechsel)',min:0,max:.3,step:.01,fmt:v=>Math.round(v*1000)+' ms',sub:'Rahmen weiter rechts/unten folgen etwas später: Parallaxe'},
    {k:'inLag',label:'Versatz Rahmen (erster Aufbau)',min:0,max:.8,step:.01,fmt:v=>Math.round(v*1000)+' ms'},
    {k:'travel',label:'Weg nach oben',min:1100,max:1600,step:10,fmt:v=>v+' px'}],
  model(P){const b=P.beat,T=[0,P.hold*b,2*P.hold*b];return {P,b,T,key:T[1],keyName:'Wechsel 2',total:3*P.hold*b}},
  show(on){FML.style.display=on?'':'none'},
  render(M,t){const P=M.P,E=FME,T=M.T,D=P.dur,ef=u=>eStFlow(clamp(u));
    E.g.style.transform='none';
    E.fr.forEach((f,i)=>{const si=+f.dataset.s,x=+f.dataset.x,y=parseFloat(f.style.top),o=(x/1740+(y>500?.35:0)); // Reihenfolge: links → rechts, oben → unten
      const inA=si===0?o*P.inLag:T[si]+o*P.lag+.06,outA=si<2?T[si+1]+o*P.lag:1e9;
      const yi=P.travel*(1-ef((t-inA)/D)),yo=-P.travel*ef((t-outA)/D),dy=yi+yo;
      f.style.visibility=dy>-1150&&dy<1150?'visible':'hidden';f.style.opacity='1';
      f.style.transform=`translateY(${dy.toFixed(1)}px)`;
      // Elemente im Rahmen: Bildflächen gleiten nach, Zeilen rollen aus ihren Masken, Badges setzen sich (wie in den Stories)
      const r=inA+.28*D,EL=E.el[i];
      EL.im.forEach((el,k)=>{if(el.dataset.z){const z=eOut(clamp((t-inA-.45*D)/2.2));el.style.transform=`scale(${(1+.28*(1-z)).toFixed(4)})`}else{const u=ef((t-r-k*.05)/(.8*D));el.style.transform=`translateY(${(160*(1-u)).toFixed(1)}px)`}}); // Bilder: deutlicher Zoom (128 % → 100 %), der erst nach dem Landen des Rahmens ausläuft // Vollflächige Fotos setzen sich per Zoom, freigestellte Bilder und Farbkarten gleiten von unten nach
      EL.ln.forEach((el,k)=>{const u=ef((t-r-.12-k*.06)/(.62*D));el.style.transform=`translateY(${(112*(1-u)).toFixed(1)}%)`});
      EL.bd.forEach((el,k)=>{const u=ef((t-r-.3-k*.08)/(.55*D));el.style.transform=`translateY(${(40*(1-u)).toFixed(1)}px)`;el.style.opacity=u.toFixed(3)});
      // Fortschrittsring baut sich auf (wie in der Sammeln-&-Sparen-Story)
      EL.rg.forEach(el=>{const v=ef((t-r-.2)/(1.4*D));el.setAttribute('stroke-dasharray',`${(820*v).toFixed(1)} 1200`);el.style.opacity=v>0?'1':'0'});
      // Pills fahren auf: zuerst nur der Kreis (jö / Ös), dann gleitet die Pille zur vollen Breite auf
      EL.pl.forEach((el,k)=>{if(!el._w&&el.offsetWidth){el._w=el.offsetWidth;el._h=el.offsetHeight}if(!el._w)return;
        const v=ef((t-r-.5-k*.08)/(.6*D)),d=(el._w-el._h)*(1-v),R2=el._h/2,base=el.classList.contains('fmBd')?el.style.transform:'';
        if(el.dataset.side==='r'){el.style.clipPath=`inset(0 0 0 ${d.toFixed(1)}px round ${R2}px)`;el.style.transform=`${base} translateX(${(-d).toFixed(1)}px)`}
        else el.style.clipPath=`inset(0 ${d.toFixed(1)}px 0 0 round ${R2}px)`})})},
  marks(M){return [[0,'Bildschirm 1'],[M.T[1],'Bildschirm 2'],[M.T[2],'Bildschirm 3']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P;return [
    ['Bildschirm 1',`0–${F(M.T[1])}`,'Story 9:16, Landscape 16:9, Square 1:1, In-App, Feed 4:5, Push: Sport-Kampagne, Rahmen gleiten von unten rein, Zeilen rollen aus Masken, Badges setzen sich'],
    ['Bildschirm 2',`${F(M.T[1])}–${F(M.T[2])}`,'kommt von unten: Games, Deal (Hirter), Feed „Deine Sportwoche.“, Push, Story „Sportdeals“'],
    ['Bildschirm 3',`${F(M.T[2])}–${F(M.total)}`,'Share, Push, Story „Sammeln & Sparen“, Landscape „Wocheneinkauf“, Bonusbox, In-App ADEG'],
    ['Wechsel',`${F(P.dur)} F`,'wie der Story-Übergang: Rahmen gleiten nach oben raus, die neuen kommen von unten, leicht versetzt (Parallaxe); Bilder, Zeilen und Badges folgen']]},
  note:'Frames bei 24 fps ab Beginn der Subebene. Ersetzt die Stories: dieselben Inhalte in verschiedenen Formaten, drei Bildschirme.'
};
