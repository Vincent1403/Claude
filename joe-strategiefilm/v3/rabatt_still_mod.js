/* Kunde: kein Schwarzbild beim Wechsel Kian-Foto (Zoom) → Kian-Video bei 0:35. Unter dem Video liegt dasselbe Standbild (= erstes Videobild),
   und das Video steht schon während des Zooms auf Anfang, damit beim Start sofort ein Bild dekodiert ist. Sonst ändert sich nichts. */
{const im=document.createElement('img');im.src=$('fuKian').firstChild.src;im.alt='';im.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover';
 RBV.parentNode.insertBefore(im,RBV);
 const r0=FUER.render;FUER.render=function(M,t){r0.call(this,M,t);if(t>M.total-2.5&&RBV.paused&&RBV.currentTime>.01)RBV.currentTime=0}}
/* Kunde: der fertige Haken ploppt kurz vor dem Schnitt in die Wolke weg (statt halb gezeichnet abgeschnitten zu werden) */
{const r1=RABATT.render;RABATT.render=function(M,t){r1.call(this,M,t);const c=S.clips.rabatt,w=view==='main'&&S.clips.cloud;if(!w)return;
  const tc=(S.clips.cloud.start-c.start)*(c.rate||1),e=eInCub(seg(t,tc-.16,tc-.01));if(e<=0)return;
  RBE.pill.style.transform+=` scale(${(1-e).toFixed(4)})`;RBE.pill.style.opacity=(1-e).toFixed(3)}}
