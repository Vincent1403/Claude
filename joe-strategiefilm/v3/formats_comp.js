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
const FM_FR=[ // Format, x, y, w, h, Inhalt
 ['Story 9:16',90,150,454,808,ST_RED,`
  <img src="${STI.woman}" alt="" style="position:absolute;left:0;top:0;width:454px;height:454px;object-fit:cover;border-radius:0 0 48px 48px">
  <div style="position:absolute;left:236px;top:376px">${fmOesPill('250',66)}</div>
  <div style="position:absolute;left:38px;top:494px">${fmTag('sq','Neu',ST_OR,'#fff',46)}</div>
  <div style="position:absolute;left:38px;top:566px;color:#fff;font-size:48px;font-weight:800;line-height:1.05;letter-spacing:-.01em">Mehr Sport,<br>doppelte Ös,<br>besserer Preis!</div>`],
 ['Landscape 16:9',594,150,760,427.5,ST_OR,`
  <div style="position:absolute;left:44px;top:44px">${fmTag('hg','Letzte Chance',S2_INK,'#fff',42)}</div>
  <div style="position:absolute;left:44px;top:112px;color:${S2_INK};font-size:58px;font-weight:800;line-height:1.02;letter-spacing:-.01em">Exklusive<br>Sportdeals<br>entdecken!</div>
  <div style="position:absolute;left:44px;top:322px">${fmJoPill('49&#8239;€',70)}</div>
  <div style="position:absolute;left:440px;top:36px;width:280px;height:392px;border-radius:40px 40px 0 0;background:#f2bf62;overflow:hidden"><img src="${S2I.girl}" alt="" style="position:absolute;left:-14px;top:18px;width:300px;max-width:none"></div>`],
 ['Square 1:1',594,633.5,324.5,324.5,'#e4e1ea',`
  <img src="${S2I.pad}" alt="" style="position:absolute;left:-18px;top:58px;width:360px;max-width:none">
  <div style="position:absolute;left:22px;top:22px">${fmTag('ci','Games',S2_INK,'#fff',38)}</div>
  <div style="position:absolute;left:46px;top:246px"><div class="fmBd" style="display:inline-flex;align-items:center;gap:12px;height:56px;padding:0 22px 0 5px;border-radius:56px;background:#fff;color:${FM_DK};font-size:25px;font-weight:800;box-shadow:0 10px 24px rgba(40,10,0,.18)">${s2Jo(46)}Jetzt spielen</div></div>`],
 ['In-App',958.5,633.5,395.5,324.5,'#fff',`
  <img src="${PTA.bipa}" alt="" style="position:absolute;left:18px;top:16px;width:38px;height:38px;border-radius:50%">
  <div style="position:absolute;left:66px;top:24px;color:#6a1006;font-size:20px;font-weight:700">BIPA</div>
  <div style="position:absolute;right:18px;top:29px;color:#6a1006;font-size:11px;font-weight:500">Gültig bis 31.10.2026</div>
  <div class="fmImg" style="position:absolute;left:12px;top:66px;width:371.5px;height:150px;border-radius:6px;background-position:center;background-size:cover"></div>
  <div style="position:absolute;right:24px;top:78px">${fmOesPill('250',40)}</div>
  <div style="position:absolute;left:18px;top:230px;color:#6a1006;font-size:17px;font-weight:600">250 Zusatz Ös auf den Einkauf</div>
  <div style="position:absolute;left:18px;top:264px;width:42px;height:42px;border-radius:50%;border:2px solid #6a1006;box-sizing:border-box;display:grid;place-items:center"><svg viewBox="0 0 24 24" style="width:20px"><path d="M12 20s-7-4.4-7-9.6A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.4C19 15.6 12 20 12 20z" fill="none" stroke="#6a1006" stroke-width="2"/></svg></div>
  <div style="position:absolute;right:18px;top:264px;height:42px;padding:0 26px;border-radius:42px;background:#6a1006;color:#fff;font-size:16px;font-weight:700;display:grid;place-items:center">Scan erforderlich</div>`],
 ['Feed 4:5',1404,150,426,532.5,JG_CSS,`
  <div style="position:absolute;left:36px;top:34px;color:#fff;font-size:46px;font-weight:800;line-height:1.05;letter-spacing:-.01em">Dein Bonus<br>beim Einkauf.</div>
  <div class="fmBd" style="position:absolute;left:83px;top:190px;width:260px;height:290px;border-radius:34px;background:${FM_INK};color:#fff;display:flex;flex-direction:column;align-items:center;padding-top:30px;box-sizing:border-box">
   <div style="font-size:24px;font-weight:700">Rabatt</div><div style="font-size:96px;font-weight:800;line-height:1;margin-top:4px">5&#8239;€</div>
   <div style="margin-top:22px">${fmOesPill('250',82).replace('class="fmBd" ','')}</div></div>`],
 ['Push',1404,738.5,426,219.5,'#f9ddc3',`
  <div class="fmBd" style="position:absolute;left:20px;top:46px;width:386px;height:128px;border-radius:26px;background:rgba(255,255,255,.92);box-shadow:0 14px 30px rgba(40,10,0,.14);display:flex;align-items:center;gap:16px;padding:0 18px;box-sizing:border-box">
   <div style="flex:none;width:64px;height:64px;border-radius:16px;background:${JG_CSS};display:grid;place-items:center">${s2Jo(64).replace(/background:[^;]+;/,'background:transparent;')}</div>
   <div style="min-width:0"><div style="color:#8a6a60;font-size:15px;font-weight:600">jö · jetzt</div><div style="color:${FM_DK};font-size:21px;font-weight:800;margin-top:3px">250 Zusatz Ös bei BIPA</div><div style="color:${FM_DK};font-size:17px;font-weight:500;margin-top:3px">Nur noch heute aktivieren.</div></div></div>`]];
const FML=document.createElement('div');FML.id='fmtL';FML.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;font-family:var(--font);background:#f4f1ea';
FML.innerHTML=`<div id="fmG" style="position:absolute;inset:0;transform-origin:50% 50%">${FM_FR.map(([n,x,y,w,h,bg,html])=>`
 <div class="fmLb" style="position:absolute;left:${x}px;top:${y-34}px;color:#670003;font-size:20px;font-weight:700;letter-spacing:.02em">${n}</div>
 <div class="fmFr" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:24px;overflow:hidden;background:${bg};box-shadow:0 26px 60px rgba(60,20,0,.16);transform-origin:50% 60%">${html}</div>`).join('')}</div>`;
$('stage').appendChild(FML);
{const st=document.createElement('style');st.textContent='#fmtL .oesw{display:inline-flex;align-items:flex-end;line-height:1}#fmtL .oesg{display:inline-block;overflow:visible}';document.head.appendChild(st)}
{const bi=document.querySelector('#badgeL .bdImg');if(bi)FML.querySelector('.fmImg').style.backgroundImage=bi.style.backgroundImage}
const FME={g:$('fmG'),fr:[...FML.querySelectorAll('.fmFr')],lb:[...FML.querySelectorAll('.fmLb')]};
FME.bd=FME.fr.map(f=>[...f.querySelectorAll('.fmBd')]);
const FORMATS={
  key:'formats',name:'Formate (Story · Landscape · Square …)',lane:'laneV3',cls:'bento',
  DEF:{beat:13.725/24,stag:.25,pop:.45,bdAt:.75},
  params:[
    {k:'stag',label:'Formate ploppen alle',min:.125,max:1,step:.125,fmt:v=>v+' Schlag',sub:'Story, Landscape, Square, In-App, Feed, Push nacheinander'},
    {k:'pop',label:'Dauer Aufploppen',min:.2,max:1,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'bdAt',label:'Badges ploppen nach (Schlag)',min:0,max:2,step:.25,fmt:v=>String(v),sub:'Ös-Pill, jö-Preis-Pill, Tags und Etikett setzen sich in ihre Formate'}],
  model(P){const b=P.beat;return {P,b,key:0,keyName:'Story',total:8*b}},
  show(on){FML.style.display=on?'':'none'},
  render(M,t){const P=M.P,b=M.b,E=FME;
    E.g.style.transform=`scale(${(1+.02*eOut(seg(t,0,M.total))).toFixed(4)})`;
    E.fr.forEach((f,i)=>{const a=i*P.stag*b,u=seg(t,a,a+P.pop),e=eBack(u);
      f.style.opacity=Math.min(1,u*2.5).toFixed(3);f.style.transform=`translateY(${((1-eExpo(u))*40).toFixed(1)}px) scale(${(.88+.12*e).toFixed(4)})`;
      E.lb[i].style.opacity=eOut(seg(t,a+.15,a+.5)).toFixed(3);
      E.bd[i].forEach((d,k)=>{const a2=a+P.bdAt*b+k*.08,v=seg(t,a2,a2+.4);d.style.transform=`scale(${eBack(v).toFixed(4)})`;d.style.transformOrigin='50% 50%'})})},
  marks(M){const P=M.P,b=M.b;return FM_FR.map((f,i)=>[i*P.stag*b,f[0]])},
  table(M){const F=s=>Math.round(s*FPS),P=M.P,b=M.b;return FM_FR.map((f,i)=>[f[0],String(F(i*P.stag*b)),`${Math.round(f[3])} × ${Math.round(f[4])} px, Badges ploppen ${F((i*P.stag+P.bdAt)*b)}`])},
  note:'Frames bei 24 fps ab Beginn der Subebene. Zwei Takte nach „Konsistent über alle Kanäle.“, danach harter Schnitt auf die Stories.'
};
