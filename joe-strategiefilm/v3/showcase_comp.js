/* =====================================================================
   COMP: ICON-SHOWCASE (Partnerfilm) – fünf jö-Icons (Palme, Ball, Tasche, Herz, Geschenk) auf einer Walze:
   sie drehen von rechts ins Bild, dann rückt auf jedem zweiten Schlag das nächste Icon in die Mitte
   (groß, vorne), die Nachbarn kippen leicht weg und werden kleiner. Am Ende stellen sich alle fünf in eine Reihe.
   ===================================================================== */
const SC_ICONS=['__ICON:palmtree__','__ICON:soccerball__','__ICON:shoppingbag__','__ICON:heart__','__ICON:presents__'];
const SCL=document.createElement('div');SCL.id='showcaseL';SCL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;background:#f4f1ea;perspective:1600px';
SCL.innerHTML=SC_ICONS.map(s=>`<div class="scI" style="position:absolute;left:0;top:0;width:200px;height:200px;transform-origin:50% 50%;will-change:transform,opacity">${s}<div class="scSh" style="position:absolute;left:20%;right:20%;bottom:-14%;height:10%;border-radius:50%;background:radial-gradient(closest-side,rgba(94,23,8,.18),rgba(94,23,8,0))"></div></div>`).join('');
$('stage').appendChild(SCL);
const SCE={it:[...SCL.querySelectorAll('.scI')],sh:[...SCL.querySelectorAll('.scSh')]};
const SHOWCASE={
  key:'showcase',name:'Icon-Showcase',lane:'laneV3',cls:'icons',
  DEF:{beat:13.725/24,intro:1.2,step:2,move:.75,gap:420,big:460,small:.5,tilt:28,rowSize:230,rowGap:70,hold:1.4,float:8},
  params:[
    {k:'intro',label:'Walze dreht rein über',min:.5,max:2.5,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'alle fünf kommen von rechts, die Palme bleibt in der Mitte stehen'},
    {k:'step',label:'Nächstes Icon alle',min:1,max:4,step:.5,fmt:v=>v+' Schläge'},
    {k:'move',label:'Weiterrücken über',min:.3,max:1.2,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'Slow In / Slow Out'},
    {k:'gap',label:'Abstand auf der Walze',min:250,max:600,step:10,fmt:v=>v+' px'},
    {k:'big',label:'Größe in der Mitte',min:280,max:640,step:10,fmt:v=>v+' px'},
    {k:'small',label:'Größe der Nachbarn',min:.3,max:.9,step:.05,fmt:v=>Math.round(v*100)+' %'},
    {k:'tilt',label:'Neigung der Nachbarn',min:0,max:60,step:1,fmt:v=>v+'°',sub:'drehen sich zur Mitte hin weg (3D)'},
    {k:'rowSize',label:'Größe in der Schlussreihe',min:150,max:320,step:5,fmt:v=>v+' px'},
    {k:'hold',label:'Schlussreihe steht',min:.3,max:3,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'float',label:'Schweben',min:0,max:20,step:1,fmt:v=>v+' px',sub:'leichtes Auf und Ab, jedes Icon im eigenen Takt'}],
  model(P){const b=P.beat,n=SC_ICONS.length,st=[...Array(n-1)].map((_,k)=>P.intro+(k+1)*P.step*b-P.move),out=st[n-2]+P.move+P.step*b-P.move;
    return {P,b,n,st,out,key:out,keyName:'Reihe',total:out+.9+P.hold}},
  show(on){SCL.style.display=on?'':'none'},
  render(M,t){const P=M.P,E=SCE,n=M.n;
    let p=-2.6*(1-eOut(seg(t,0,P.intro)));M.st.forEach(a=>{p+=eIO(seg(t,a,a+P.move))}); // Position der Walze (Index in der Mitte)
    const r=eIO(seg(t,M.out,M.out+.9)),rw=n*P.rowSize+(n-1)*P.rowGap;
    E.it.forEach((el,i)=>{const d=i-p,ad=Math.abs(d),near=Math.exp(-d*d*1.6);
      const cs=(P.small+(1-P.small)*near)*P.big/200,cx=960+d*P.gap*(1-.12*Math.min(ad,2)),cy=540+Math.min(ad,2.5)*28,
        rot=Math.max(-1,Math.min(1,d))*-P.tilt,op=Math.max(0,Math.min(1,1.35-.5*ad)),
        fl=Math.sin(t*2.2+i*1.3)*P.float*(.4+.6*near);
      const rs=P.rowSize/200,rx=960-rw/2+i*(P.rowSize+P.rowGap)+P.rowSize/2,ry=540;
      const s=cs+(rs-cs)*r,x=cx+(rx-cx)*r,y=cy+(ry-cy)*r+fl*(1-r)+Math.sin(t*2.2+i*1.3)*P.float*.5*r,ro=rot*(1-r),o=op+(1-op)*r;
      el.style.transform=`translate(${(x-100).toFixed(1)}px,${(y-100).toFixed(1)}px) rotateY(${ro.toFixed(2)}deg) scale(${s.toFixed(4)})`;
      el.style.opacity=o.toFixed(3);el.style.zIndex=String(100-Math.round(ad*10));
      E.sh[i].style.opacity=(.4+.6*near*(1-r)+.6*r).toFixed(3)});
  },
  marks(M){return [[0,'rein'],...M.st.map((a,k)=>[a,['Ball','Tasche','Herz','Geschenk'][k]]),[M.out,'Reihe']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P;return [
    ['Walze dreht rein',`0–${F(P.intro)}`,'alle fünf kommen von rechts, Palme landet in der Mitte'],
    ...M.st.map((a,k)=>[['Ball','Tasche','Herz','Geschenk'][k]+' rückt in die Mitte',`${F(a)}–${F(a+P.move)}`,`auf jedem ${P.step}. Schlag, Nachbarn ${Math.round(P.small*100)} %, ${P.tilt}° geneigt`]),
    ['Schlussreihe',`${F(M.out)}–${F(M.total)}`,`alle fünf nebeneinander, je ${P.rowSize} px`]]},
  note:'Frames bei 24 fps ab Beginn der Subebene. Icons: Palme, Fußball, Einkaufstasche, Herz, Geschenk (Verlauf aus dem jö-System).'
};
