/* Partnerfilm: Endscreen – bevor die Endcard übernimmt, hält das runde jö-Logo einen Takt länger und alle Partner
   ploppen noch einmal rundherum auf (Anordnung wie in der Partner-Szene); mit dem Schrumpfen des Logos ploppen sie wieder weg. */
{const EP=document.createElement('div');EP.style.cssText='position:absolute;inset:0;pointer-events:none';ECL.appendChild(EP);
 // eigene Anordnung über die ganze Bildfläche (Kunde): oben 5, links/rechts je 2 Reihen à 2, unten 5 – leicht versetzt, damit es nicht wie ein Raster wirkt
 const EPOS=[[210,150],[575,125],[960,140],[1345,120],[1710,155],[135,395],[480,365],[1440,375],[1790,400],[150,690],[490,715],[1430,700],[1785,675],[215,935],[580,960],[960,945],[1340,965],[1705,930]];
 const cs=PT_N2.map((n,i)=>{const d=PT_CLOUD[i][2]*1.12,[x,y]=EPOS[i],im=document.createElement('img');im.src=PTA[n];im.alt='';
  im.style.cssText=`position:absolute;left:${(x-d/2).toFixed(1)}px;top:${(y-d/2).toFixed(1)}px;width:${d}px;height:${d}px;border-radius:50%;box-shadow:0 18px 40px rgba(60,10,0,.25);visibility:hidden`;EP.appendChild(im);return im});
 ENDC.DEF.pre=13.725/24*4;
 ENDC.params.unshift({k:'pre',label:'Partner um das jö-Logo',min:0,max:5,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'so lange steht das runde jö-Logo mit allen Partnern, bevor die Endcard startet'});
 const m0=ENDC.model,r0=ENDC.render;
 ENDC.model=function(P){const M=m0.call(this,P);M.total+=P.pre||0;return M};
 ENDC.render=function(M,t){const P=M.P,pre=P.pre||0;r0.call(this,M,Math.max(0,t-pre));
  const out=pre+P.flyAt-.05;
  cs.forEach((c,i)=>{const a=.05+PT_POP[i]*.035,o=out+PT_POP[i]*.012,k=eBack(seg(t,a,a+.4))*(1-eInCub(seg(t,o,o+.25)));
   const ox=9*Math.sin(t*(1+i*.11)+i*1.7),oy=7*Math.cos(t*(.9+i*.13)+i*1.1); // gleiches Schweben wie die Profilbilder bei „Für jeden.“
   c.style.transform=`translate(${ox.toFixed(1)}px,${oy.toFixed(1)}px) scale(${k.toFixed(4)})`;c.style.visibility=pre&&k>.001?'visible':'hidden'})};
}
