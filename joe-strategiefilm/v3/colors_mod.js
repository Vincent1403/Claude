/* Partnerfilm (Kunde): „Farben“ – der Verlauf kommt von oben und drückt die Farbspalten nur in die untere Bildhälfte,
   die Hex-Erklärung läuft in der oberen Hälfte (alle Markenfarben bleiben sichtbar); zum Schluss wird der Verlauf Vollbild. */
{const box=FCE.box,wrap=document.createElement('div');wrap.style.cssText='position:absolute;inset:0;filter:drop-shadow(0 24px 40px rgba(60,20,30,.18))';
 box.parentNode.insertBefore(wrap,box);wrap.appendChild(box);box.style.boxShadow='none';box.style.borderRadius='0';
 const HALF=540,PY=[455,362,269,176,83]; // Pills auf der Diagonale, nur obere Hälfte
 FCE.ps.forEach((d,k)=>{const x=173+k*346,y=PY[k],c=typeof jgAt==='function'?jgAt(x,y):JG_PILLS[k][2];d.style.top=(y-40)+'px';
  d.firstElementChild.style.background=c;d.lastElementChild.textContent=c.toUpperCase()});
 const r0=COLORS.render;
 COLORS.render=function(M,t){r0.call(this,M,t);const P=M.P,T=M.T,E=FCE,f=eStFlow,lt3=t-T[2],D3=T[3]-T[2];
  wrap.style.display=lt3>=0?'':'none';if(lt3<0)return;
  const EX=Math.max(P.expDur,.55),X=D3-EX,sl=f(seg(lt3,0,P.slideDur)),e=f(seg(lt3,X,D3-.02)),uo=1-f(seg(lt3,X-.2,X+.12));
  const Bh=HALF*sl+(1080-HALF)*e,R=90*(1-e);   // Unterkante des Verlaufs: 0 → Bildmitte → unten
  box.style.transform='none';box.style.clipPath=`inset(0 0 ${(1080-Bh).toFixed(1)}px 0 round 0 0 ${R.toFixed(1)}px ${R.toFixed(1)}px)`;
  // Farbspalten: zusammengedrückt in den Bereich unter dem Verlauf, Name und Hex mittig im sichtbaren Teil
  const top=Math.max(0,Bh-FC_R-10),H=1080-top,mid=(Math.max(Bh,0)+1080)/2;
  E.cards.forEach((c,i)=>{c.style.transform='none';c.style.top=top.toFixed(1)+'px';c.style.height=H.toFixed(1)+'px';
   const k=H/FC_H;['.fdark','.flight'].forEach(s=>{const el=c.querySelector(s);el.style.height=(FC_H*P.tones*k).toFixed(1)+'px'});
   const pl=c.querySelector('.fpill'),hx=c.querySelector('.fhex');pl.style.top=(mid-top-40).toFixed(1)+'px';hx.style.top=(mid-top+12).toFixed(1)+'px'});
  // Hex-Pills: ploppen in der oberen Hälfte auf, ziehen sich zur Pill auf, verschwinden bevor der Verlauf Vollbild wird
  E.ps.forEach((d,k)=>{const a=P.slideDur*.55+k*P.stag*1.3,p=eBack(seg(lt3,a,a+.3)),x=f(seg(lt3,a+.15,a+.45));
   d.style.width=(80+(P.pillW-80)*x*uo).toFixed(1)+'px';d.style.transform=`scale(${(p*(.85+.15*uo)).toFixed(4)})`;d.style.opacity=(Math.min(1,seg(lt3,a,a+.08))*uo).toFixed(3)});
 };
 // Karten vor Phase 3 wieder in Ausgangslage (falls zurückgespult)
 const r1=COLORS.render;COLORS.render=function(M,t){if(t<M.T[2])FCE.cards.forEach(c=>{c.style.top='0px';c.style.height=FC_H+'px';c.querySelector('.fpill').style.top='478px';c.querySelector('.fhex').style.top='530px'});r1.call(this,M,t)};
}
