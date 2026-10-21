/* Partnerfilm (Kunde): POS-System 1–3 – statt der schwarzen Platzhalter die drei POS-Motive
   (Pearle Türfolie, OMV Hängeschild, BIPA Kassa), Vollbild mit leichtem Push-in wie Citylight. */
[[POS,'__POS1__','Pearle Türfolie'],[POS2,'__POS2__','OMV Hängeschild'],[POS3,'__POS3__','BIPA Kassa']].forEach(([C,src,nm],i)=>{
 const L=document.createElement('div');L.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;background:#000';
 L.innerHTML=`<img src="${src}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform-origin:50% 50%">`;$('stage').appendChild(L);const im=L.firstChild;
 const s0=C.show;Object.assign(C,{name:'POS-System '+(i+1)+': '+nm,
  show(on){s0.call(this,false);L.style.display=on?'':'none'},
  render(M,t){const T=M.total||4;im.style.transform=`scale(${(1+.05*eIO(seg(t,0,T))).toFixed(4)})`},
  table(M){return [['Motiv','0',nm+', Vollbild, Push-in 5 %']]},note:'POS-Motiv '+(i+1)+' (Kunde).'});
});
