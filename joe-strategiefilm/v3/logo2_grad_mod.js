/* Kunde: im Schluss-Logo (jö → App-Icon vor der Endseite) zeigt das jö in der weißen Kachel schon den Farbverlauf des neuen Icons –
   so muss auf der Endseite nicht von Orange auf Verlauf übergeblendet werden. Nur logo2, das Logo am Anfang bleibt wie es ist. */
{const GJ='__GRADJO__',BX=[115,221,765,977,978]; // jö im Bild: links, oben, Breite; Bildbreite, -höhe
 const r0=renderGradLogo;renderGradLogo=function(size,on,force){r0(size,on,force);
  if(on&&window.__GRADJO){const lw=size*.81,lh=lw*182.86/271.15,x=960-lw/2,y=540+size*.004-lh/2,s=lw/BX[2];
   GLin.className='';GLin.style.transform='';
   Object.assign(GLin.style,{backgroundImage:`url(${GJ})`,backgroundRepeat:'no-repeat',backgroundColor:'#fff',backgroundSize:`${(BX[3]*s).toFixed(1)}px ${(BX[4]*s).toFixed(1)}px`,
    backgroundPosition:`${(x-BX[0]*s+115.2).toFixed(1)}px ${(y-BX[1]*s+64.8).toFixed(1)}px`})}
  else Object.assign(GLin.style,{backgroundImage:'',backgroundColor:''})};
 LOGO2.render=function(M,t){window.__GRADJO=1;try{LOGO.render.call(this,M,t)}finally{window.__GRADJO=0}}}
