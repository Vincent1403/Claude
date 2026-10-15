/* Partnerfilm: Partner-Szene – erst „Viele Marken. / Eine starke Verbindung.“ in der Mitte, die Partner-Logos liegen
   oben und unten drumherum; dann ersetzt das jö-App-Icon die Worte, die Partner fliegen hinein, das Icon verschwindet,
   danach in zwei Schritten „Eine Welt voller Marken.“ → „Ein gemeinsames Markenerlebnis.“ */
{// Logos rahmen den Text: obere Reihe (8) und untere Reihe (7), Platz in der Mitte für zwei Zeilen (Werte vor der 115-%-Ausdehnung)
 const top=[-800,-571,-343,-114,114,343,571,800].map((x,i)=>[x,i%2?-385:-410]),bot=[-780,-520,-260,0,260,520,780].map((x,i)=>[x,i%2?385:405]);
 [...top,...bot].forEach(([x,y],i)=>{PT_CLOUD[i][0]=Math.round(x/1.15);PT_CLOUD[i][1]=Math.round(y/1.15)});}
{const LH=195;
 const blk=(id,lines)=>{const d=document.createElement('div');d.id=id;d.style.cssText=`position:absolute;left:0;right:0;top:${540-lines.length*LH/2}px;text-align:center;color:#670003;font-size:150px;font-weight:900;letter-spacing:-.02em;line-height:${LH}px;white-space:nowrap;pointer-events:none`;
  d.innerHTML=lines.map(l=>`<div style="height:${LH}px;overflow:hidden">${l.split(' ').map(w=>`<span class="ptW" style="display:inline-block${w.startsWith('*')?`;background:${JG_TXT};-webkit-background-clip:text;background-clip:text;color:transparent`:''}">${w.replace('*','')}</span>`).join(' ')}</div>`).join('');
  PT.insertBefore(d,$('ptLogo'));return [...d.querySelectorAll('.ptW')]};
 PTE.w0=blk('ptWords',['Viele Marken.','Eine starke *Verbindung.']);
 PTE.w1=blk('ptSent1',['Eine Welt voller Marken.']);
 PTE.w2=blk('ptSent2',['Ein gemeinsames','*Markenerlebnis.']);
 // jö als App-Icon: weißes, abgerundetes Quadrat hinter dem Verlauf-Logo (skaliert mit dem Logo)
 {const sq=document.createElement('div');sq.style.cssText='position:absolute;left:-20px;top:-88.5px;width:460px;height:460px;border-radius:106px;background:#fff;box-shadow:0 34px 80px rgba(90,30,0,.18)';
  const L=$('ptLogo');L.insertBefore(sq,L.firstChild);L.querySelector('svg').style.transform='translate(-1%,4%) scale(.8)'}
 Object.assign(PARTNER.DEF,{swap:2,lOut:4.25,sent:4.3,sent2:5.3});
 PARTNER.params.unshift(
  {k:'swap',label:'jö-Icon ersetzt „Viele Marken. Eine starke Verbindung.“ bei',min:.5,max:4,step:1/24,fmt:v=>Math.round(v*24)+' F'},
  {k:'lOut',label:'Icon verschwindet bei',min:2,max:7,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'nachdem alle Partner im Icon sind'},
  {k:'sent',label:'„Eine Welt voller Marken.“ ab',min:2,max:7,step:1/24,fmt:v=>Math.round(v*24)+' F'},
  {k:'sent2',label:'„Ein gemeinsames Markenerlebnis.“ ab',min:2,max:7,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'schiebt die erste Zeile nach oben raus'});
 const st=.25*13.725/24;
 // Wort für Wort aus der Zeilenmaske, Ausstieg nach oben; ganz draußen unsichtbar
 const words=(ws,t,a0,o0)=>ws.forEach((w,k)=>{const a=a0+k*st,o=o0+k*.03,pi=eExpo(seg(t,a,a+.45)),po=eInCub(seg(t,o,o+.22));
  w.style.transform=`translateY(${((1-pi)*110-po*110).toFixed(1)}%)`;w.style.visibility=pi>0&&po<1?'visible':'hidden'});
 const r0=PARTNER.render;
 PARTNER.render=function(M,t){r0.call(this,M,t);const P=M.P,E=PTE;
  words(E.w0,t,.05,P.swap-.45);                       // ganz raus, bevor das Icon kommt
  const lin=eBack(seg(t,P.swap,P.swap+.45)),lout=eIO(seg(t,P.lOut,P.lOut+.35));
  E.logo.style.transform+=` scale(${(lin*(1-lout)).toFixed(4)})`;E.logo.style.opacity=t<P.swap?'0':'1';
  E.disc.style.opacity=(lin*(1-lout)).toFixed(3);
  words(E.w1,t,P.sent,P.sent2-.3);
  words(E.w2,t,P.sent2,1e9);
 };
}
