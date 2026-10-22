/* Kunde: kein Schwarzbild beim Wechsel Kian-Foto (Zoom) → Kian-Video bei 0:35. Unter dem Video liegt dasselbe Standbild (= erstes Videobild),
   und das Video steht schon während des Zooms auf Anfang, damit beim Start sofort ein Bild dekodiert ist. Sonst ändert sich nichts. */
{const im=document.createElement('img');im.src=$('fuKian').firstChild.src;im.alt='';im.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover';
 RBV.parentNode.insertBefore(im,RBV);
 const r0=FUER.render;FUER.render=function(M,t){r0.call(this,M,t);if(t>M.total-2.5&&RBV.paused&&RBV.currentTime>.01)RBV.currentTime=0}}
