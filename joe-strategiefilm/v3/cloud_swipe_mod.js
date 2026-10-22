/* Kunde (Kürzung): kein Zoom raus in die Wolke und wieder hinein – Kian bleibt Vollbild, Tamara schiebt ihn als Swipe nach links raus.
   Der übersprungene Teil (J Sekunden Clip-Zeit) entspricht genau einem Takt, der auch in der Musik fehlt. */
{const J=__CJ__,SW=.55,r0=CLOUD.render,m0=CLOUD.model;
 // Standbild des Tamara-Videos an der Swipe-Stelle unter dem Video – falls das Video beim Abspielen noch nicht dekodiert ist, blitzt kein Verlauf durch
 {const ct=$('clT'),im=document.createElement('img');im.src='ooh/tamara_f.webp';im.alt='';im.id='clT2';im.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0';ct.insertBefore(im,ct.firstChild);CLV2.style.zIndex=1}
 // Kunde: Standbild des Kian-Videos unter dem Video in der Wolke – ist das Video beim Abspielen/Springen noch nicht dekodiert, scheint kein Verlauf durch
 {const im=document.createElement('img');im.src='ooh/kian_mid.webp';im.alt='';im.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover';CLE.main.insertBefore(im,CLE.main.firstChild)}
 CLOUD.model=function(P){const M=m0.call(this,P);M.total-=J;return M};
 CLOUD.render=function(M,t){const P=M.P,E=CLE,T2=P.z2At+P.z2Dur,S=T2-J-SW,ct=$('clT'),W=$('clFW');
  if(t<S){window.__noCLV=1;try{r0.call(this,M,0)}finally{window.__noCLV=0} /* Video steuert nur dieser Teil – sonst setzen zwei Stellen es abwechselnd auf verschiedene Zeiten (Ruckeln) */
   const vt=Math.min(4.98,P.vStart+t),pl=(view==='main'?mPlaying:cPlaying);if(!pl||Math.abs(CLV.currentTime-vt)>.12){if(!CLV.paused&&!pl)CLV.pause();CLV.currentTime=vt}if(pl&&CLV.paused)CLV.play().catch(()=>{});
   const po=eStFlow(seg(t,P.hold,P.hold+P.pillOut));E.pill.style.opacity=(1-po).toFixed(3);
   Object.assign(ct.style,{display:'',transform:'translateX(2400px)'});return} /* außerhalb des Bildes schon da (Bild/Video geladen) */
  window.__noCLV=1;try{r0.call(this,M,Math.max(t+J,T2))}finally{window.__noCLV=0}
  const e=eIO(seg(t,S,S+SW));if(e>=1){E.main.style.display='none';return}
  // Swipe: Kian (Vollbild) nach links raus, Tamara (Vollbild) schiebt von rechts nach
  E.main.style.display='';Object.assign(E.main.style,{left:'0px',top:'0px',width:'1920px',height:'1080px',borderRadius:'0px',boxShadow:'none',transformOrigin:'50% 50%',transform:`translateX(${(-1920*e).toFixed(1)}px)`,zIndex:2});
  const iw=1920,ih=1080;Object.assign(CLV.style,{width:iw+'px',height:ih+'px',left:'0px',top:'0px'});CLV.style.display='';E.img.style.display='none';
  const vt=Math.min(4.98,P.vStart+t);if(Math.abs(CLV.currentTime-vt)>.12)CLV.currentTime=vt;
  E.pill.style.opacity='0';
  Object.assign(ct.style,{display:'',left:'0px',top:'0px',width:'1920px',height:'1080px',borderRadius:'0px',zIndex:3,transform:`translateX(${(1920*(1-e)).toFixed(1)}px)`});
  if(W)W.style.visibility='hidden';E.w.style.visibility='hidden'};
 const s0=CLOUD.show;CLOUD.show=function(on){s0.call(this,on);const W=$('clFW');if(W)W.style.visibility='';CLE.w.style.visibility='';const ct=$('clT');if(ct)ct.style.transform=''};
}
