/* Partnerfilm (Kunde): POS-System 1–3 – die drei POS-Motive (BILLA Türfolie, OMV Hängeschild, BIPA Kassa)
   als abgerundete Karten auf jö Beige in einer Reihe; zu Beginn jedes Clips gleitet die Reihe eine Karte weiter. */
{const CW=1440,CH=802,GAP=64,STEP=CW+GAP,SRC=['__POS1__','__POS2__','__POS3__'],NM=['BILLA Türfolie','OMV Hängeschild','BIPA Kassa'];
 const L=document.createElement('div');L.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;background:#f4f1ea';
 L.innerHTML=SRC.map(s=>`<div class="posCard" style="position:absolute;left:0;top:${(1080-CH)/2}px;width:${CW}px;height:${CH}px;border-radius:56px;overflow:hidden;box-shadow:0 40px 90px rgba(60,20,30,.18);will-change:transform"><img src="${s}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform-origin:50% 50%"></div>`).join('');
 $('stage').appendChild(L);const cards=[...L.querySelectorAll('.posCard')];
 [POS,POS2,POS3].forEach((C,i)=>{const s0=C.show;Object.assign(C,{name:'POS-System '+(i+1)+': '+NM[i],
  show(on){s0.call(this,false);if(on)L.style.display='';else if(![POS,POS2,POS3].some(x=>x._on))L.style.display='none';this._on=on},
  render(M,t){const T=M.total||2.3,e=eIO(seg(t,0,.6)),c=i?i-1+e:-1+eOut(seg(t,0,.75));/* erste Karte gleitet über das rausgleitende Tablet herein */ /* erste Karte: steht schon halb im Bild und übernimmt den Schwung des rausgleitenden Tablets */ /* Reihe gleitet eine Karte weiter, dann ruht sie */
   cards.forEach((el,k)=>{const x=960+(k-c)*STEP-CW/2,d=Math.abs(k-c);el.style.transform=`translateX(${x.toFixed(1)}px) scale(${(1-.06*Math.min(1,d)).toFixed(4)})`;
    el.firstChild.style.transform=`scale(${(1.06-.04*(k===i?seg(t,0,T):0)).toFixed(4)})`})},
  table(M){return [['Karten-Slide','0–'+Math.round(.6*FPS),NM[i]+' gleitet in die Mitte, Nachbarkarten angeschnitten']]},note:'POS-Motiv '+(i+1)+' (Kunde), Karten-Slider.'})});}
