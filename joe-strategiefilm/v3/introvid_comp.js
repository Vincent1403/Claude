/* =====================================================================
   COMP: INTRO-VIDEOS (Partnerfilm) – Hintergrundvideos unter den Intro-Headlines, eins je Clip.
   Liegen direkt über dem Verlauf und unter allen Szenen; eine leichte Abdunklung hält die weiße Schrift lesbar.
   ===================================================================== */
function makeIV(key,name,src,dur,def={}){
  const L=document.createElement('div');L.id='iv_'+key;L.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;background:#000';
  const still=src.startsWith('data:image'); // Standbild statt Video (Kunde): nur Push-in
  L.innerHTML=`<${still?'img':'video'} src="${src}" ${still?'alt=""':'muted playsinline preload="auto"'} style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform-origin:50% 50%">${still?'':'</video>'}<div class="ivDim" style="position:absolute;inset:0"></div>`;
  $('bg').after(L);const V=L.querySelector(still?'img':'video'),DM=L.querySelector('.ivDim');
  return {key,name,lane:'laneV1',cls:'bento',
    DEF:{speed:1,zoom:.04,dim:.35,fade:.25,...def},
    params:[
      {k:'speed',label:'Tempo',min:.5,max:1.5,step:.05,fmt:fmtX},
      {k:'zoom',label:'Leichter Push-in',min:0,max:.1,step:.005,fmt:v=>num(v*100,1)+' %'},
      {k:'dim',label:'Abdunklung',min:0,max:.7,step:.05,fmt:v=>Math.round(v*100)+' %',sub:'damit die weiße Headline lesbar bleibt'},
      {k:'fade',label:'Einblenden',min:0,max:1,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'aus dem Verlauf heraus'}],
    model(P){return {P,key:0,keyName:'Videostart',total:dur/P.speed}},
    show(on){L.style.display=on?'':'none';if(!still&&!on&&!V.paused)V.pause()},
    render(M,t){const P=M.P,vt=Math.min(dur-.02,t*P.speed),playing=(view==='main'?mPlaying:cPlaying);
      if(!still){V.playbackRate=P.speed;
      if(playing){if(V.paused)V.play().catch(()=>{});if(Math.abs(V.currentTime-vt)>.12)V.currentTime=vt}
      else{if(!V.paused)V.pause();if(Math.abs(V.currentTime-vt)>.01)V.currentTime=vt}}
      V.style.transform=`scale(${(1+P.zoom*seg(t,0,M.total)).toFixed(4)})`;
      L.style.opacity=(P.fade>0?eOut(seg(t,0,P.fade)):1).toFixed(3);
      DM.style.background=`linear-gradient(180deg,rgba(60,14,4,${(P.dim*.8).toFixed(3)}) 0%,rgba(60,14,4,${P.dim}) 55%,rgba(60,14,4,${(P.dim*.9).toFixed(3)}) 100%)`},
    marks(M){return [[0,'Video']]},
    table(M){const F=s=>Math.round(s*FPS),P=M.P;return [['Video',`0–${F(M.total)}`,`${name}, ${Math.round(P.dim*100)} % abgedunkelt, Push-in ${num(P.zoom*100,1)} %`]]},
    note:'Hintergrundvideo der Intro-Headlines. Länge des Videos: '+num(dur,2)+' s.'};
}
const IV_KOCHEN=makeIV('ivKochen','Video Mutter mit Kind','iv_mutter.webm',3,{fade:0}); // Film beginnt direkt mit dem Video (Kunde: Mutter mit Kind im Supermarkt, Ende wird abgeschnitten)
const IV_TANKEN=makeIV('ivTanken','Video Tanken','iv_kochen.webm',5.042,{fade:0}); // harter Schnitt vom ersten Video
const IV_BRILLE=makeIV('ivBrille','Video Brille','iv_brille.webm',5.042,{fade:0});
