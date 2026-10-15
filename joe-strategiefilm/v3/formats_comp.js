/* =====================================================================
   COMP: FORMATE (Partnerfilm) – nach „Konsistent über alle Kanäle.“: dieselbe Kampagne in verschiedenen Formaten
   (Story 9:16, Landscape 16:9, Square 1:1, In-App-Karte, Feed 4:5, Push) mit den Elementen aus den Badges
   (jö-Preis-Pill, Ös-Pill, Etikett, Tag-Formen, Angebotskarte). Rahmen ploppen nacheinander auf, danach die Badges.
   ===================================================================== */
const FM_INK='#5e1708',FM_DK='#3a0a06';
const fmOes=(h,c='#fff')=>oesSvg(c).replace('class="oesg"',`class="oesg" style="height:${h}px;width:auto"`);
const fmOesPill=(n,h)=>`<div class="fmBd" style="display:inline-flex;align-items:center;gap:${h*.18}px;height:${h}px;padding:0 ${h*.1}px 0 ${h*.34}px;border-radius:${h}px;background:#fff;color:${FM_DK};font-size:${h*.5}px;font-weight:700;box-shadow:0 10px 24px rgba(40,10,0,.18);white-space:nowrap">${n}<div style="width:${h*.8}px;height:${h*.8}px;border-radius:50%;background:${FM_INK};display:grid;place-items:center">${fmOes(h*.38)}</div></div>`;
const fmJoPill=(p,h)=>`<div class="fmBd" style="display:inline-flex;align-items:center;gap:${h*.18}px;height:${h}px;padding:0 ${h*.1}px 0 ${h*.34}px;border-radius:${h}px;background:#fff;color:${FM_DK};font-size:${h*.5}px;font-weight:700;box-shadow:0 10px 24px rgba(40,10,0,.18);white-space:nowrap">${p}${s2Jo(Math.round(h*.8))}</div>`;
const fmTag=(sh,txt,bg,fg,h)=>`<div class="fmBd" style="display:inline-flex;align-items:center;gap:${h*.26}px;height:${h}px;padding:0 ${h*.42}px;border-radius:${h*.22}px;background:${bg};color:${fg};font-size:${h*.46}px;font-weight:800;white-space:nowrap">${tgSvg(sh,Math.round(h*.4))}${txt}</div>`;
const FM_S1=[ // x, y, w, h, Hintergrund, Inhalt
 [90,136.0,454,808,ST_RED,`
  <img src="${STI.woman}" alt="" style="position:absolute;left:0;top:0;width:454px;height:454px;object-fit:cover;border-radius:0 0 48px 48px">
  <div style="position:absolute;left:236px;top:376px">${fmOesPill('250',66)}</div>
  <div style="position:absolute;left:38px;top:494px">${fmTag('sq','Neu',ST_OR,'#fff',46)}</div>
  <div style="position:absolute;left:38px;top:566px;color:#fff;font-size:48px;font-weight:800;line-height:1.05;letter-spacing:-.01em">Mehr Sport,<br>doppelte Ös,<br>besserer Preis!</div>`],
 [594,136.0,760,427.5,ST_OR,`
  <div style="position:absolute;left:44px;top:44px">${fmTag('hg','Letzte Chance',S2_INK,'#fff',42)}</div>
  <div style="position:absolute;left:44px;top:112px;color:${S2_INK};font-size:58px;font-weight:800;line-height:1.02;letter-spacing:-.01em">Exklusive<br>Sportdeals<br>entdecken!</div>
  <div style="position:absolute;left:44px;top:322px">${fmJoPill('49&#8239;€',70)}</div>
  <div style="position:absolute;left:440px;top:36px;width:280px;height:392px;border-radius:40px 40px 0 0;background:#f2bf62;overflow:hidden"><img src="${S2I.girl}" alt="" style="position:absolute;left:-14px;top:18px;width:300px;max-width:none"></div>`],
 [594,619.5,324.5,324.5,'#e4e1ea',`
  <img src="${S2I.pad}" alt="" style="position:absolute;left:-18px;top:58px;width:360px;max-width:none">
  <div style="position:absolute;left:22px;top:22px">${fmTag('ci','Games',S2_INK,'#fff',38)}</div>
  <div style="position:absolute;left:46px;top:246px"><div class="fmBd" style="display:inline-flex;align-items:center;gap:12px;height:56px;padding:0 22px 0 5px;border-radius:56px;background:#fff;color:${FM_DK};font-size:25px;font-weight:800;box-shadow:0 10px 24px rgba(40,10,0,.18)">${s2Jo(46)}Jetzt spielen</div></div>`],
 [958.5,619.5,395.5,324.5,'#fff',`
  <img src="${PTA.bipa}" alt="" style="position:absolute;left:18px;top:16px;width:38px;height:38px;border-radius:50%">
  <div style="position:absolute;left:66px;top:24px;color:#6a1006;font-size:20px;font-weight:700">BIPA</div>
  <div style="position:absolute;right:18px;top:29px;color:#6a1006;font-size:11px;font-weight:500">Gültig bis 31.10.2026</div>
  <div class="fmImg" style="position:absolute;left:12px;top:66px;width:371.5px;height:150px;border-radius:6px;background-position:center;background-size:cover"></div>
  <div style="position:absolute;right:24px;top:78px">${fmOesPill('250',40)}</div>
  <div style="position:absolute;left:18px;top:230px;color:#6a1006;font-size:17px;font-weight:600">250 Zusatz Ös auf den Einkauf</div>
  <div style="position:absolute;left:18px;top:264px;width:42px;height:42px;border-radius:50%;border:2px solid #6a1006;box-sizing:border-box;display:grid;place-items:center"><svg viewBox="0 0 24 24" style="width:20px"><path d="M12 20s-7-4.4-7-9.6A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.4C19 15.6 12 20 12 20z" fill="none" stroke="#6a1006" stroke-width="2"/></svg></div>
  <div style="position:absolute;right:18px;top:264px;height:42px;padding:0 26px;border-radius:42px;background:#6a1006;color:#fff;font-size:16px;font-weight:700;display:grid;place-items:center">Scan erforderlich</div>`],
 [1404,136.0,426,532.5,JG_CSS,`
  <div style="position:absolute;left:36px;top:34px;color:#fff;font-size:46px;font-weight:800;line-height:1.05;letter-spacing:-.01em">Dein Bonus<br>beim Einkauf.</div>
  <div class="fmBd" style="position:absolute;left:83px;top:190px;width:260px;height:290px;border-radius:34px;background:${FM_INK};color:#fff;display:flex;flex-direction:column;align-items:center;padding-top:30px;box-sizing:border-box">
   <div style="font-size:24px;font-weight:700">Rabatt</div><div style="font-size:96px;font-weight:800;line-height:1;margin-top:4px">5&#8239;€</div>
   <div style="margin-top:22px">${fmOesPill('250',82).replace('class="fmBd" ','')}</div></div>`],
 [1404,724.5,426,219.5,'#f9ddc3',`
  <div class="fmBd" style="position:absolute;left:20px;top:46px;width:386px;height:128px;border-radius:26px;background:rgba(255,255,255,.92);box-shadow:0 14px 30px rgba(40,10,0,.14);display:flex;align-items:center;gap:16px;padding:0 18px;box-sizing:border-box">
   <div style="flex:none;width:64px;height:64px;border-radius:16px;background:${JG_CSS};display:grid;place-items:center">${s2Jo(64).replace(/background:[^;]+;/,'background:transparent;')}</div>
   <div style="min-width:0"><div style="color:#8a6a60;font-size:15px;font-weight:600">jö · jetzt</div><div style="color:${FM_DK};font-size:21px;font-weight:800;margin-top:3px">250 Zusatz Ös bei BIPA</div><div style="color:${FM_DK};font-size:17px;font-weight:500;margin-top:3px">Nur noch heute aktivieren.</div></div></div>`]];
const FM_PILL=(inner,h)=>`<div class="fmBd" style="display:inline-flex;align-items:center;gap:${h*.18}px;height:${h}px;padding:0 ${h*.34}px 0 ${h*.09}px;border-radius:${h}px;background:#fff;color:${FM_DK};font-size:${h*.46}px;font-weight:800;box-shadow:0 10px 24px rgba(40,10,0,.18);white-space:nowrap">${inner}</div>`;
const fmPush=(t1,t2)=>`<div class="fmBd" style="position:absolute;left:20px;top:46px;width:386px;height:128px;border-radius:26px;background:rgba(255,255,255,.92);box-shadow:0 14px 30px rgba(40,10,0,.14);display:flex;align-items:center;gap:16px;padding:0 18px;box-sizing:border-box">
   <div style="flex:none;width:64px;height:64px;border-radius:16px;background:${JG_CSS};display:grid;place-items:center">${s2Jo(64).replace(/background:[^;]+;/,'background:transparent;')}</div>
   <div style="min-width:0"><div style="color:#8a6a60;font-size:15px;font-weight:600">jö · jetzt</div><div style="color:${FM_DK};font-size:21px;font-weight:800;margin-top:3px">${t1}</div><div style="color:${FM_DK};font-size:17px;font-weight:500;margin-top:3px">${t2}</div></div></div>`;
const fmEtikett=(x,y,w,h,top,big,oes)=>`<div class="fmBd" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:32px;background:${FM_INK};color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:${h*.1}px 0 ${h*.08}px;box-sizing:border-box">
   <div style="text-align:center">${top?`<div style="font-size:${h*.08}px;font-weight:700">${top}</div>`:''}<div style="font-size:${h*.3}px;font-weight:800;line-height:1;letter-spacing:-.02em">${big}</div></div>${fmOesPill(oes,h*.28).replace('class="fmBd" ','')}</div>`;
// Bildschirm 2: Sport · Games · Deals
const FM_S2=[
 [90,136,760,427.5,ST_OR,`
  <div style="position:absolute;left:44px;top:44px">${fmTag('ci','Games',S2_INK,'#fff',42)}</div>
  <div style="position:absolute;left:44px;top:112px;color:${S2_INK};font-size:64px;font-weight:800;line-height:1.02;letter-spacing:-.01em">Spielen &amp;<br>Gewinnen</div>
  <div style="position:absolute;left:44px;top:300px">${FM_PILL(s2Jo(58)+'Jetzt spielen',70)}</div>
  <div style="position:absolute;left:420px;top:36px;width:300px;height:392px;border-radius:40px 40px 0 0;background:#e4e1ea;overflow:hidden"><img src="${S2I.pad}" alt="" style="position:absolute;left:-60px;top:110px;width:400px;max-width:none"></div>`],
 [90,619.5,324.5,324.5,'#000',`
  <img src="${STI.man}" alt="" style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover">
  <div style="position:absolute;left:146px;top:240px">${fmOesPill('500',58)}</div>`],
 [454.5,619.5,395.5,324.5,'#5e0f0b',`
  <img src="${S2I.beer}" alt="" style="position:absolute;left:26px;top:34px;height:270px;max-width:none">
  <div style="position:absolute;left:214px;top:36px">${fmTag('x','Deal',ST_OR,'#fff',38)}</div>
  <div style="position:absolute;left:214px;top:98px;color:#fff;font-size:30px;font-weight:800;line-height:1.1">Hirter<br>Privat Pils</div>
  <div style="position:absolute;left:206px;top:226px">${fmJoPill('-&#8239;25%',64)}</div>`],
 [900,136,426,532.5,JG_CSS,`
  <div style="position:absolute;left:36px;top:34px;color:#fff;font-size:46px;font-weight:800;line-height:1.05;letter-spacing:-.01em">Deine<br>Sportwoche.</div>
  ${fmEtikett(83,196,260,300,'','-&#8239;20%','500')}`],
 [900,724.5,426,219.5,'#e4e1ea',fmPush('Neuer Deal bei Hirter','-25 % mit deinen Ös.')],
 [1376,136,454,808,'#e4e1ea',`
  <div style="position:absolute;left:0;top:300px;width:454px;height:508px;border-radius:48px 48px 0 0;background:${JG_CSS}"></div>
  <img src="${S4I.girl}" alt="" style="position:absolute;left:-46px;top:36px;width:540px;max-width:none">
  <div style="position:absolute;left:30px;top:30px">${fmTag('ci','Aktion','#fff','#e3301b',40)}</div>
  <div style="position:absolute;left:54px;top:440px">${fmJoPill('Sportdeals',66)}</div>
  <div style="position:absolute;left:34px;top:676px;color:#fff;font-size:44px;font-weight:800;line-height:1.05;letter-spacing:-.01em">Mehr Bewegung,<br>mehr Ös.</div>`]];
// Bildschirm 3: Share · Sammeln & Sparen · Wocheneinkauf
const FM_S3=[
 [90,136,426,532.5,'#e4e1ea',`
  <div style="position:absolute;left:0;top:170px;width:426px;height:362.5px;border-radius:48px 48px 0 0;background:${JG_CSS}"></div>
  <img src="${S3I.man}" alt="" style="position:absolute;left:150px;top:34px;height:500px;max-width:none">
  <div style="position:absolute;left:30px;top:30px">${fmTag('sq','Neu','#fff','#e3301b',40)}</div>
  <div style="position:absolute;left:30px;top:330px">${FM_PILL(`<span style="padding-left:${64*.25}px">Share</span><span style="display:inline-flex">${['av1','av2','av3'].map((a,k)=>`<img src="${S3I[a]}" alt="" style="width:46px;height:46px;border-radius:50%;border:3px solid #fff;margin-left:${k?-14:0}px">`).join('')}</span>`,64)}</div>`],
 [90,724.5,426,219.5,'#f9ddc3',fmPush('Lena teilt 100 Ös mit dir','Jetzt in der jö App ansehen.')],
 [566,136,454,808,'#e4e1ea',`
  <div style="position:absolute;left:0;top:560px;width:454px;height:248px;border-radius:48px 48px 0 0;background:${JG_CSS}"></div>
  <svg viewBox="0 0 454 600" style="position:absolute;left:0;top:0;width:454px;height:600px"><circle cx="227" cy="320" r="180" fill="none" stroke="#e3301b" stroke-width="46" stroke-dasharray="820 1200" stroke-linecap="round" transform="rotate(120 227 320)"/></svg>
  <img src="${S5I.girl}" alt="" style="position:absolute;left:-8px;top:40px;height:560px;max-width:none">
  <div style="position:absolute;left:30px;top:30px">${fmTag('ci','Aktion','#fff','#e3301b',40)}</div>
  <div style="position:absolute;left:150px;top:470px">${fmJoPill('1&#8239;€ = 1&#8239;Ö',60)}</div>
  <div style="position:absolute;left:34px;top:620px;color:#fff;font-size:56px;font-weight:800;line-height:1.02;letter-spacing:-.01em">Sammeln &amp;<br>Sparen</div>`],
 [1070,136,760,427.5,ST_OR,`
  <div style="position:absolute;left:44px;top:44px">${fmTag('hg','Letzte Chance',S2_INK,'#fff',42)}</div>
  <div style="position:absolute;left:44px;top:112px;color:${S2_INK};font-size:54px;font-weight:800;line-height:1.04;letter-spacing:-.01em">Clever sparen<br>bei deinem<br>Wocheneinkauf.</div>
  <img src="${S6I.bag}" alt="" style="position:absolute;left:452px;top:70px;width:300px;max-width:none">
  <div style="position:absolute;left:520px;top:40px">${fmJoPill('-&#8239;25%',70)}</div>`],
 [1070,619.5,324.5,324.5,JG_CSS,fmEtikett(52,34,220,256,'','Bonus-<br>box','250').replace('font-size:76.8px','font-size:52px')],
 [1434.5,619.5,395.5,324.5,'#fff',`
  <img src="${PTA.adeg}" alt="" style="position:absolute;left:18px;top:16px;width:38px;height:38px;border-radius:50%">
  <div style="position:absolute;left:66px;top:24px;color:#6a1006;font-size:20px;font-weight:700">ADEG</div>
  <div style="position:absolute;right:18px;top:29px;color:#6a1006;font-size:11px;font-weight:500">Gültig bis 31.10.2026</div>
  <div style="position:absolute;left:12px;top:66px;width:371.5px;height:150px;border-radius:6px;background:#23872d;overflow:hidden"><img src="${S6I.bag}" alt="" style="position:absolute;left:30px;top:-20px;width:170px;max-width:none"></div>
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
FME.bd=FME.fr.map(f=>[...f.querySelectorAll('.fmBd')]);
const FORMATS={
  key:'formats',name:'Formate (drei Bildschirme)',lane:'laneV3',cls:'bento',
  DEF:{beat:13.725/24,stag:.25,pop:.45,bdAt:.75,hold:8,slide:.8,lag:0},
  params:[
    {k:'stag',label:'Formate ploppen alle',min:.125,max:1,step:.125,fmt:v=>v+' Schlag',sub:'erster Bildschirm: Story, Landscape, Square, In-App, Feed, Push nacheinander'},
    {k:'pop',label:'Dauer Aufploppen',min:.2,max:1,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'bdAt',label:'Badges ploppen nach (Schlag)',min:0,max:2,step:.25,fmt:v=>String(v),sub:'Ös-Pill, jö-Preis-Pill, Tags und Etikett setzen sich in ihre Formate'},
    {k:'hold',label:'Bildschirm steht',min:4,max:12,step:1,fmt:v=>v+' Schläge',sub:'danach gleitet der nächste Bildschirm von rechts rein'},
    {k:'slide',label:'Dauer Wechsel',min:.4,max:1.6,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'lag',label:'Versatz pro Spalte',min:0,max:.25,step:.01,fmt:v=>Math.round(v*1000)+' ms',sub:'Rahmen weiter rechts starten etwas später: das Raster zieht sich beim Wechsel leicht auseinander'}],
  model(P){const b=P.beat,T=[0,P.hold*b,2*P.hold*b];return {P,b,T,key:T[1],keyName:'Wechsel 2',total:3*P.hold*b}},
  show(on){FML.style.display=on?'':'none'},
  render(M,t){const P=M.P,b=M.b,E=FME,T=M.T;
    E.g.style.transform=`scale(${(1+.015*eOut(seg(t,0,M.total))).toFixed(4)})`;
    E.fr.forEach((f,i)=>{const si=+f.dataset.s,x=+f.dataset.x,lg=(x/1920)*P.lag*3;
      // Position: Bildschirm si liegt bei si × 1920; jeder Wechsel schiebt alles um eine Bildbreite nach links
      let pos=0;for(let k=1;k<3;k++)pos+=eStFlow(seg(t,T[k]+lg,T[k]+lg+P.slide));
      const dx=(si-pos)*1920;f.style.visibility=Math.abs(si-pos)<1?'visible':'hidden';
      let sc=1,op=1,ty=0,ba;
      if(si===0){const k=E.fr.slice(0,i).filter(g=>g.dataset.s==='0').length,a=k*P.stag*b,u=seg(t,a,a+P.pop);op=Math.min(1,u*2.5);ty=(1-eExpo(u))*40;sc=.88+.12*eBack(u);ba=a+P.bdAt*b}
      else ba=T[si]+P.slide+.1;
      f.style.opacity=op.toFixed(3);f.style.transform=`translate(${dx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${sc.toFixed(4)})`;
      E.bd[i].forEach((d,k)=>{const a2=ba+k*.08,v=seg(t,a2,a2+.4);d.style.transform=`scale(${eBack(v).toFixed(4)})`;d.style.transformOrigin='50% 50%'})})},
  marks(M){return [[0,'Bildschirm 1'],[M.T[1],'Bildschirm 2'],[M.T[2],'Bildschirm 3']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P;return [
    ['Bildschirm 1',`0–${F(M.T[1])}`,'Story 9:16, Landscape 16:9, Square 1:1, In-App, Feed 4:5, Push: Sport-Kampagne, Rahmen ploppen nacheinander, dann die Badges'],
    ['Bildschirm 2',`${F(M.T[1])}–${F(M.T[2])}`,'gleitet von rechts rein: Games, Deal (Hirter), Feed „Deine Sportwoche.“, Push, Story „Sportdeals“'],
    ['Bildschirm 3',`${F(M.T[2])}–${F(M.total)}`,'Share, Push, Story „Sammeln & Sparen“, Landscape „Wocheneinkauf“, Bonusbox, In-App ADEG'],
    ['Wechsel',`${F(P.slide)} F`,'Slow In / Slow Out, Spalten leicht versetzt']]},
  note:'Frames bei 24 fps ab Beginn der Subebene. Ersetzt die Stories: dieselben Inhalte in verschiedenen Formaten, drei Bildschirme.'
};
