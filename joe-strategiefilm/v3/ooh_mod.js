/* Partnerfilm: Citylight und Billboard mit Partnerbezug.
   Citylight: Headline „Profitiere jetzt bei BIPA.“, unten jö × BIPA (wie die Marken-Lockups).
   Billboard: unter dem Claim alle Partner-Logos (zwei Reihen), die nacheinander aufploppen; Store-Buttons rücken nach unten. */
{const hl=CTE.hl;if(hl[0])hl[0].textContent='Profitiere jetzt';if(hl[1])hl[1].textContent='bei BIPA.';
 const L=CTE.logo,x=document.createElement('div');x.style.cssText='position:absolute;left:258px;top:1790px;color:#fff;font-size:64px;font-weight:700;line-height:1';x.textContent='×';
 const b=document.createElement('img');b.src=PTA.bipa;b.alt='';b.style.cssText='position:absolute;left:330px;top:1750px;width:152px;height:152px;border-radius:50%;box-shadow:0 10px 26px rgba(60,10,0,.25)';
 L.after(x,b);const r0=CITY.render;
 CITY.render=function(M,t){r0.call(this,M,t);const cs=getComputedStyle(L);[x,b].forEach(e=>{e.style.opacity=cs.opacity;e.style.transform=L.style.transform;e.style.transformOrigin='50% 50%'})};}
{const PN=PT_N2,D=86,G=12; // alle 15 Partner, in zwei Reihen
 const row=document.createElement('div');row.style.cssText=`position:absolute;left:1180px;top:612px;width:${8*D+7*G}px;display:flex;flex-wrap:wrap;gap:${G}px`;
 row.innerHTML=PN.map(n=>`<img class="bbPt" src="${PTA[n]}" alt="" style="width:${D}px;height:${D}px;border-radius:50%;box-shadow:0 8px 20px rgba(60,10,0,.22)">`).join('');
 $('bbStore').before(row);$('bbStore').style.top='832px';$('bbCta').style.top='868px';
 const pts=[...row.querySelectorAll('.bbPt')],r0=BILL.render;
 BILL.render=function(M,t){r0.call(this,M,t);const P=M.P;pts.forEach((p,i)=>{const a=P.lineAt+.3+i*.035,q=eBack(seg(t,a,a+.4));p.style.transform=`scale(${q.toFixed(4)})`})};}
