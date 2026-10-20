/* =====================================================================
   COMP: LAPTOP (Partnerfilm, Kunde) – Laptop-Mockup mit scrollender Website (Platzhalter-Inhalt).
   Steht vorerst hinter dem Filmende, Position im Film wird später festgelegt.
   ===================================================================== */
const LT_SW=1240,LT_SH=775,LT_X=(1920-LT_SW)/2,LT_Y=110; // Bildschirmfläche (Inhalt) und Lage
const LT_BLK=(w,h,c='#e4e1ea',r=14,ex='')=>`<div style="width:${w};height:${h}px;border-radius:${r}px;background:${c};${ex}"></div>`;
const LT_SITE=`<div id="ltSite" style="position:absolute;left:0;top:0;width:${LT_SW}px;background:#f4f1ea;font-family:var(--font);color:#670003">
 <div style="height:78px;display:flex;align-items:center;gap:34px;padding:0 48px;background:#fff">
  <svg viewBox="0 0 271.15 182.86" style="width:64px;overflow:visible"><path d="${LP.J} ${LP.E}" fill="#ee2a06"/>${[87.99,152.94,207.17].map(x=>`<circle cx="${x}" cy="16.8" r="16.8" fill="#ee2a06"/>`).join('')}</svg>
  ${['Platzhalter','Platzhalter','Platzhalter','Platzhalter'].map(l=>`<div style="font-size:19px;font-weight:700;opacity:.8">${l}</div>`).join('')}
  <div style="margin-left:auto;height:44px;padding:0 24px;border-radius:22px;background:#670003;color:#fff;display:flex;align-items:center;font-size:18px;font-weight:700">Platzhalter</div></div>
 <div style="margin:28px 48px 0;height:430px;border-radius:36px;background:${JG_CSS};position:relative;overflow:hidden">
  <div style="position:absolute;left:56px;top:70px;color:#fff;font-size:64px;font-weight:800;line-height:1.05;letter-spacing:-.01em">Platzhalter<br>Headline.</div>
  <div style="position:absolute;left:56px;top:240px;color:#fff;font-size:22px;font-weight:500;opacity:.9;width:440px;line-height:1.4">Platzhalter Text für die Website. Hier steht später der echte Inhalt.</div>
  <div style="position:absolute;left:56px;top:330px;height:54px;padding:0 30px;border-radius:27px;background:#fff;display:flex;align-items:center;font-size:20px;font-weight:800">Platzhalter</div>
  <div style="position:absolute;right:56px;top:50px;width:440px;height:330px;border-radius:28px;background:rgba(255,255,255,.22)"></div></div>
 <div style="margin:56px 48px 22px;font-size:40px;font-weight:800">Platzhalter Abschnitt</div>
 <div style="margin:0 48px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px">${[0,1,2,3,4,5].map(i=>`<div style="background:#fff;border-radius:26px;overflow:hidden;box-shadow:0 10px 26px rgba(60,20,30,.07)">${LT_BLK('100%',170,['#f2ab6e','#e4e1ea','#e0662e','#aa3836','#e4e1ea','#48254d'][i],0)}<div style="padding:20px 22px 24px">${LT_BLK('70%',20,'#670003',10,'opacity:.85')}<div style="height:12px"></div>${LT_BLK('92%',12,'#e4e1ea',6)}<div style="height:8px"></div>${LT_BLK('60%',12,'#e4e1ea',6)}</div></div>`).join('')}</div>
 <div style="margin:56px 48px 0;display:flex;gap:40px;align-items:center">${LT_BLK('520px',300,'#e0662e',30)}<div style="flex:1">${LT_BLK('80%',34,'#670003',12,'opacity:.9')}<div style="height:22px"></div>${[96,90,94,70].map(w=>LT_BLK(w+'%',14,'#d9d4cc',7,'margin-bottom:12px')).join('')}<div style="height:16px"></div>${LT_BLK('180px',50,'#670003',25)}</div></div>
 <div style="margin:56px 48px 0;display:grid;grid-template-columns:repeat(4,1fr);gap:20px">${[0,1,2,3].map(i=>LT_BLK('100%',120,'#fff',22,'box-shadow:0 10px 26px rgba(60,20,30,.06)')).join('')}</div>
 <div style="margin-top:60px;height:220px;background:#670003;padding:40px 48px;box-sizing:border-box;display:flex;gap:80px">${[0,1,2].map(()=>`<div>${LT_BLK('140px',16,'rgba(255,255,255,.7)',8)}<div style="height:16px"></div>${[0,1,2].map(()=>LT_BLK('110px',12,'rgba(255,255,255,.35)',6,'margin-bottom:10px')).join('')}</div>`).join('')}</div>
</div>`;
const LTL=document.createElement('div');LTL.id='laptopL';LTL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;background:#f4f1ea;font-family:var(--font)';
LTL.innerHTML=`<div id="ltAll" style="position:absolute;inset:0;transform-origin:50% 60%">
 <div style="position:absolute;left:${LT_X-26}px;top:${LT_Y-26}px;width:${LT_SW+52}px;height:${LT_SH+52}px;border-radius:34px 34px 10px 10px;background:linear-gradient(160deg,#3a3d42,#17181b);box-shadow:0 40px 90px rgba(60,20,30,.22)"></div>
 <div style="position:absolute;left:${LT_X+LT_SW/2-6}px;top:${LT_Y-17}px;width:12px;height:12px;border-radius:50%;background:#2c2e33"></div>
 <div style="position:absolute;left:${LT_X}px;top:${LT_Y}px;width:${LT_SW}px;height:${LT_SH}px;border-radius:8px;overflow:hidden;background:#fff">
  <div style="position:absolute;left:0;right:0;top:0;height:44px;background:#ece9e4;display:flex;align-items:center;gap:9px;padding-left:18px;z-index:2">${['#ff5f57','#febc2e','#28c840'].map(c=>`<div style="width:13px;height:13px;border-radius:50%;background:${c}"></div>`).join('')}
   <div style="margin-left:22px;width:440px;height:26px;border-radius:13px;background:#fff;color:#8a7f78;font-size:14px;display:flex;align-items:center;padding-left:16px">joe-club.at</div></div>
  <div style="position:absolute;left:0;right:0;top:44px;bottom:0;overflow:hidden">${LT_SITE}</div></div>
 <div style="position:absolute;left:${LT_X-150}px;top:${LT_Y+LT_SH+26}px;width:${LT_SW+300}px;height:26px;border-radius:0 0 30px 30px;background:linear-gradient(180deg,#d6d9de,#a6abb2);box-shadow:0 26px 40px rgba(60,20,30,.18)"></div>
 <div style="position:absolute;left:${LT_X+LT_SW/2-110}px;top:${LT_Y+LT_SH+26}px;width:220px;height:10px;border-radius:0 0 12px 12px;background:#9ba0a7"></div>
</div>`;
$('stage').appendChild(LTL);
const LTE={all:$('ltAll'),site:$('ltSite')};
const LAPTOP={key:'laptop',name:'Laptop (Platzhalter)',lane:'laneV4',cls:'bento',
  DEF:{len:4.575,inDur:.7,scrollAt:.6,scrollDur:3.4,scroll:1250},
  params:[
    {k:'inDur',label:'Laptop kommt rein über',min:.2,max:1.5,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'scrollAt',label:'Scrollen ab',min:0,max:2,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'scrollDur',label:'Scrollen über',min:.5,max:6,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'scroll',label:'Scrollweite',min:200,max:1800,step:10,fmt:v=>v+' px'}],
  model(P){return {P,key:P.scrollAt,keyName:'Scrollen',total:P.len}},
  show(on){LTL.style.display=on?'':'none'},
  render(M,t){const P=M.P,E=LTE,u=eStFlow(seg(t,0,P.inDur));
    E.all.style.transform=`translateY(${((1-u)*140).toFixed(1)}px) scale(${(.94+.06*u).toFixed(4)})`;E.all.style.opacity=Math.min(1,u*1.6).toFixed(3);
    E.site.style.transform=`translateY(${(-P.scroll*eIO(seg(t,P.scrollAt,P.scrollAt+P.scrollDur))).toFixed(1)}px)`},
  marks(M){const P=M.P;return [[0,'Laptop'],[P.scrollAt,'Scrollen']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P;return [
    ['Laptop kommt rein',`0–${F(P.inDur)}`,'gleitet leicht von unten herein und wächst auf 100 %'],
    ['Website scrollt',`${F(P.scrollAt)}–${F(P.scrollAt+P.scrollDur)}`,`Platzhalter-Website (Navigation, Hero im jö-Verlauf, Karten, Text, Footer), ${P.scroll} px weich gescrollt`]]},
  note:'Platzhalter (Kunde): Laptop-Mockup mit scrollender Website, Position im Film wird später festgelegt.'};
