/* Partnerfilm: Endscreen – bevor die Endcard übernimmt, hält das runde jö-Logo einen Takt länger und alle Partner
   ploppen noch einmal rundherum auf (Anordnung wie in der Partner-Szene); mit dem Schrumpfen des Logos ploppen sie wieder weg. */
{const EP=document.createElement('div');EP.style.cssText='position:absolute;inset:0;pointer-events:none';ECL.appendChild(EP);
 const cs=PT_N2.map((n,i)=>{const d=PT_CLOUD[i][2],[x,y]=PT_LB[i],im=document.createElement('img');im.src=PTA[n];im.alt='';
  im.style.cssText=`position:absolute;left:${(960+x-d/2).toFixed(1)}px;top:${(540+y-d/2).toFixed(1)}px;width:${d}px;height:${d}px;border-radius:50%;box-shadow:0 18px 40px rgba(60,10,0,.25);visibility:hidden`;EP.appendChild(im);return im});
 ENDC.DEF.pre=13.725/24*4;
 ENDC.params.unshift({k:'pre',label:'Partner um das jö-Logo',min:0,max:5,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'so lange steht das runde jö-Logo mit allen Partnern, bevor die Endcard startet'});
 const m0=ENDC.model,r0=ENDC.render;
 ENDC.model=function(P){const M=m0.call(this,P);M.total+=P.pre||0;return M};
 ENDC.render=function(M,t){const P=M.P,pre=P.pre||0;r0.call(this,M,Math.max(0,t-pre));
  const out=pre+P.flyAt-.05;
  cs.forEach((c,i)=>{const a=.05+PT_POP[i]*.035,o=out+PT_POP[i]*.012,k=eBack(seg(t,a,a+.4))*(1-eInCub(seg(t,o,o+.25)));
   c.style.transform=`scale(${k.toFixed(4)})`;c.style.visibility=pre&&k>.001?'visible':'hidden'})};
}
