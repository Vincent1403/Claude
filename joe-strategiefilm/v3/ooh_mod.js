/* Partnerfilm: Citylight und Billboard mit Partnerbezug.
   Citylight: Headline „Profitiere jetzt bei BIPA.“, unten jö × BIPA (wie die Marken-Lockups).
   Billboard: unter dem Claim alle Partner-Logos (zwei Reihen), die nacheinander aufploppen; Store-Buttons rücken nach unten. */
{const hl=CTE.hl;if(hl[0])hl[0].textContent='Profitiere jetzt';if(hl[1])hl[1].textContent='bei BIPA.';
 const L=CTE.logo,x=document.createElement('div');x.style.cssText='position:absolute;left:258px;top:1790px;color:#fff;font-size:64px;font-weight:700;line-height:1';x.textContent='×';
 const b=document.createElement('img');b.src=PTA.bipa;b.alt='';b.style.cssText='position:absolute;left:330px;top:1750px;width:152px;height:152px;border-radius:50%;box-shadow:0 10px 26px rgba(60,10,0,.25)';
 L.after(x,b);const r0=CITY.render;
 CITY.render=function(M,t){r0.call(this,M,t);const cs=getComputedStyle(L);[x,b].forEach(e=>{e.style.opacity=cs.opacity;e.style.transform=L.style.transform;e.style.transformOrigin='50% 50%'})};}
{const PN=PT_N2,D=86,G=12; // alle 15 Partner, in zwei Reihen
 const row=document.createElement('div');row.style.cssText=`position:absolute;left:1180px;top:521px;width:${8*D+7*G}px;display:flex;flex-wrap:wrap;gap:${G}px`;
 row.innerHTML=PN.map(n=>`<img class="bbPt" src="${PTA[n]}" alt="" style="width:${D}px;height:${D}px;border-radius:50%;box-shadow:0 8px 20px rgba(60,10,0,.22)">`).join('');
 $('bbStore').before(row);BBL.querySelector('.bbLine').parentNode.parentNode.style.top='48px'; // Claim nach oben: gleicher Abstand oben wie die Store-Buttons unten (48), Logos und Buttons gleichmäßig dazwischen
 row.style.top=(952-(2*D+G))+'px'; // Logos unten mit gleichem Rand wie der Claim oben
 // Store-Buttons + „App jetzt herunterladen“ in einer weißen Pille unten über dem Handy
 {const pill=document.createElement('div');pill.id='bbPill';pill.style.cssText='position:absolute;left:2395px;top:800px;height:144px;padding:0 44px 0 12px;border-radius:72px;background:#fff;display:flex;align-items:center;gap:16px;box-shadow:0 24px 60px rgba(60,10,0,.28);white-space:nowrap';
  const st=$('bbStore'),ct=$('bbCta');Object.assign(st.style,{position:'static',display:'flex',gap:'16px'});Object.assign(ct.style,{position:'static',color:'#670003',fontWeight:'700',marginLeft:'12px'});
  st.querySelectorAll('.bbBtn').forEach(b=>b.style.background='#f4f1ea');pill.append(st,ct);$('bbPhoneWrap').after(pill);
  const r1=BILL.render;BILL.render=function(M,t){r1.call(this,M,t);const q=eBack(seg(t,M.P.storeAt-.1,M.P.storeAt+.35));pill.style.transform=`scale(${q.toFixed(4)})`;pill.style.transformOrigin='50% 50%'}}
 const pts=[...row.querySelectorAll('.bbPt')],r0=BILL.render;
 BILL.render=function(M,t){r0.call(this,M,t);const P=M.P;pts.forEach((p,i)=>{const a=P.lineAt+.3+i*.035,q=eBack(seg(t,a,a+.4));p.style.transform=`scale(${q.toFixed(4)})`})};}
