/* Partnerfilm: Bento-Box gleitet nach „Alles in einer App“ von unten ins Bild (Parallaxe wie in den Stories/Formaten):
   jede Kachel und die Navigation folgen leicht versetzt, Slow In / Slow Out. Danach wie bisher (Rausfliegen nach links). */
{Object.assign(BOX.DEF,{upDist:1250,upDur:1.1,upLag:.09});
 BOX.params.unshift({k:'upDist',label:'Von unten: Strecke',min:800,max:1800,step:10,fmt:v=>v+' px',sub:'Kacheln und Navigation gleiten von unten rein (Parallaxe), statt von rechts'},
  {k:'upDur',label:'Von unten: Dauer',min:.5,max:2,step:1/24,fmt:v=>Math.round(v*24)+' F'},
  {k:'upLag',label:'Von unten: Versatz je Kachel',min:0,max:.25,step:.01,fmt:v=>Math.round(v*1000)+' ms'});
 const r0=BOX.render;
 BOX.render=function(M,t){r0.call(this,M,t);const P=M.P,E=BXE,po=M.pout(t),W=[0,.5,1,.75];
  const up=k=>P.upDist*(1-eStFlow(seg(t,k*P.upLag,k*P.upLag+P.upDur))),ox=i=>-P.outDist*po*(1+(1-W[i])*P.spread);
  E.t.forEach((el,i)=>{el.style.transform=`translate(${ox(i).toFixed(1)}px,${up(i).toFixed(1)}px)`});
  E.navMove.style.transform=`translate(${ox(3).toFixed(1)}px,${up(1.5).toFixed(1)}px)`};
}
