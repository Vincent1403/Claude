/* Partnerfilm: Citylight und Billboard mit Partnerbezug.
   Citylight: Headline „Profitiere jetzt bei BIPA.“, unten jö × BIPA (wie die Marken-Lockups).
   Billboard: unter dem Claim alle Partner-Logos (zwei Reihen), die nacheinander aufploppen; Store-Buttons rücken nach unten. */
{const hl=CTE.hl;if(hl[0])hl[0].textContent='Werde jetzt';if(hl[1])hl[1].textContent='jö Mitglied.'; // Kunde: „Werde jetzt jö Mitglied“, Layout mit Handy und App-Download
 {// Bildfläche: jö Beige mit gekipptem Handy (wie Billboard), darin der App-Screen; jö-Logo nach rechts oben; Store-Buttons + CTA in weißer Pille
  const card=$('ctCard');card.style.background='#f4f1ea';$('ctImg').style.display='none';
  const k=600/420,ph=document.createElement('div');ph.style.cssText=`position:absolute;left:${(CT_W-600)/2}px;top:120px;width:600px;height:${866*k}px;perspective:3000px`;
  ph.innerHTML=`<div id="ctPhone" style="position:absolute;inset:0;transform-origin:50% 55%;transform-style:preserve-3d;transform:rotateY(-16deg) rotateX(6deg) rotateZ(-7deg)">
   ${[30,25,20,14,9,4].map(z=>`<div style="position:absolute;inset:0;border-radius:${70*k}px;transform:translateZ(-${z}px);background:linear-gradient(135deg,#9aa0a7,#5b6168 45%,#a9aeb4 60%,#4d5359)"></div>`).join('')}
   <div style="position:absolute;inset:0;border-radius:${70*k}px;background:linear-gradient(135deg,#d9dde2,#8a9098 40%,#cfd3d8 60%,#6d737b);box-shadow:0 50px 90px rgba(60,10,20,.32)"></div>
   <div style="position:absolute;inset:${6*k}px;border-radius:${64*k}px;background:#111"></div>
   <div style="position:absolute;inset:${18*k}px;border-radius:${54*k}px;overflow:hidden;background:#f4f1ea"><img src="__CTSCREEN__" alt="" style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;object-position:50% 0;max-width:none"></div>
   <div style="position:absolute;left:50%;top:${30*k}px;width:${108*k}px;height:${30*k}px;margin-left:-${54*k}px;border-radius:${15*k}px;background:#111"></div></div>`;
  card.appendChild(ph);
  const lg=$('ctLogo');lg.style.left=(CT_W-84-152)+'px';lg.style.top='100px';
  const pill=document.createElement('div');pill.id='ctPill';pill.style.cssText='position:absolute;left:50%;top:1730px;height:170px;padding:0 64px 0 25px;border-radius:85px;background:#fff;display:flex;align-items:center;gap:22px;box-shadow:0 30px 70px rgba(60,10,0,.28);white-space:nowrap;transform-origin:50% 50%';
  const st=$('ctStore'),ct=$('ctCta');Object.assign(st.style,{position:'static',display:'flex',gap:'18px'});Object.assign(ct.style,{position:'static',color:'#670003',textShadow:'none',fontSize:'50px',marginLeft:'14px'});
  st.querySelectorAll('.ctBtn').forEach(b=>{b.style.background='#f4f1ea';b.style.boxShadow='none'});pill.append(st,ct);CTE.ad.appendChild(pill);
  const rp=CITY.render;CITY.render=function(M,t){rp.call(this,M,t);const A=M.at,q=eBack(seg(t,A(1.6),A(2.05)));pill.style.transform=`translateX(-50%) scale(${q.toFixed(4)})`;
   const u=seg(t,0,M.total);$('ctPhone').style.transform=`rotateY(${(-16+6*u).toFixed(2)}deg) rotateX(6deg) rotateZ(${(-7+2*u).toFixed(2)}deg)`}}
 const L=CTE.logo,x=document.createElement('div');x.style.cssText='position:absolute;left:258px;top:1790px;color:#fff;font-size:64px;font-weight:700;line-height:1';x.textContent='';x.style.display='none'; // kein „ד: die zwei Logos stehen direkt nebeneinander
 const b=document.createElement('img');b.src=PTA.bipa;b.alt='';b.style.cssText='position:absolute;left:258px;top:1750px;width:152px;height:152px;border-radius:50%;box-shadow:0 10px 26px rgba(60,10,0,.25)';
 b.style.display='none';L.after(x,b);const r0=CITY.render;
 CITY.render=function(M,t){r0.call(this,M,t);[CTE.disc,CTE.pts,CTE.oes].forEach(e=>e.style.visibility='hidden'); /* Kunde: kein -25 %, kein Punktestand, keine Ös */{const z=1+.05*eIO(seg(t,0,M.total)),s0=1080/887;CTE.cam.style.transform=`translate(${(960+z*(-120-960)).toFixed(1)}px,${(540+z*(0-540)).toFixed(1)}px) scale(${(z*s0).toFixed(5)})`} /* leichter Push-in wie U-Bahn und Billboard */const cs=getComputedStyle(L);[x,b].forEach(e=>{e.style.opacity=cs.opacity;e.style.transform=L.style.transform;e.style.transformOrigin='50% 50%'})};}
{const PN=PT_N2,D=86,G=12; // alle 15 Partner, in zwei Reihen
 const row=document.createElement('div');row.style.cssText=`position:absolute;left:1180px;top:521px;width:${8*D+7*G}px;display:flex;flex-wrap:wrap;gap:${G}px`;
 row.innerHTML=PN.map(n=>`<img class="bbPt" src="${PTA[n]}" alt="" style="width:${D}px;height:${D}px;border-radius:50%;box-shadow:0 8px 20px rgba(60,10,0,.22)">`).join('');
 $('bbStore').before(row);BBL.querySelector('.bbLine').parentNode.parentNode.style.top='178px'; // Claim nach oben: gleicher Abstand oben wie die Store-Buttons unten (48), Logos und Buttons gleichmäßig dazwischen
 row.style.top=(798-(2*D+G))+'px'; // Claim oben und Logos unten bündig mit dem jö-Logo (205–798)
 // Store-Buttons + „App jetzt herunterladen“ in einer weißen Pille unten über dem Handy
 {const pill=document.createElement('div');pill.id='bbPill';pill.style.cssText='position:absolute;left:2395px;top:800px;height:144px;padding:0 44px 0 12px;border-radius:72px;background:#fff;display:flex;align-items:center;gap:16px;box-shadow:0 24px 60px rgba(60,10,0,.28);white-space:nowrap';
  const st=$('bbStore'),ct=$('bbCta');Object.assign(st.style,{position:'static',display:'flex',gap:'16px'});Object.assign(ct.style,{position:'static',color:'#670003',fontWeight:'700',marginLeft:'12px'});
  st.querySelectorAll('.bbBtn').forEach(b=>b.style.background='#f4f1ea');pill.append(st,ct);$('bbPhoneWrap').after(pill);
  const r1=BILL.render;BILL.render=function(M,t){r1.call(this,M,t);const q=eBack(seg(t,M.P.storeAt-.1,M.P.storeAt+.35));pill.style.transform=`scale(${q.toFixed(4)})`;pill.style.transformOrigin='50% 50%'}}
 const pts=[...row.querySelectorAll('.bbPt')],r0=BILL.render;
 BILL.render=function(M,t){r0.call(this,M,t);const P=M.P;pts.forEach((p,i)=>{const a=P.lineAt+.3+i*.035,q=eBack(seg(t,a,a+.4));p.style.transform=`scale(${q.toFixed(4)})`})};}
