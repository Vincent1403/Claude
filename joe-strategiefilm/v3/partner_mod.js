/* Partnerfilm: Partner-Szene – erst „Viele Marken. / Eine starke Verbindung.“ in der Mitte, die Partner-Logos liegen
   oben und unten drumherum; dann ersetzt das jö-App-Icon die Worte, die Partner fliegen hinein, das Icon verschwindet,
   danach in zwei Schritten „Eine Welt voller Marken.“ → „Ein gemeinsames Markenerlebnis.“ */
{// Zwei Anordnungen (Bildpixel relativ zur Mitte, werden durch die 115-%-Ausdehnung geteilt):
 // A um „Viele Marken. / Eine starke Verbindung.“ – oben 6, links/rechts neben der kürzeren ersten Zeile je 2, unten 5;
 // B um das jö-App-Icon – oben 5, links/rechts je 3, unten 4. Beim Wechsel zum Icon wandern die Logos in die frei werdenden Flächen.
 // 18 Partner um das runde jö-Logo: oben 6, links/rechts je 3, unten 6 (die Logos erscheinen direkt in dieser Anordnung)
 const B=[[-700,-395],[-420,-405],[-140,-390],[140,-405],[420,-390],[700,-400],[-480,-150],[-780,10],[-480,170],[480,-150],[780,-10],[480,170],[-700,395],[-420,410],[-140,395],[140,410],[420,395],[700,405]],A=B;
 // jedes Logo bekommt den nächstgelegenen freien Platz in B (gierig), damit die Wege kurz bleiben
 const used=new Set(),mapB=A.map(()=>null),pairs=[];A.forEach((a,i)=>B.forEach((b,j)=>pairs.push([Math.hypot(a[0]-b[0],a[1]-b[1]),i,j])));pairs.sort((x,y)=>x[0]-y[0]);
 const doneA=new Set();for(const [,i,j] of pairs){if(doneA.has(i)||used.has(j))continue;mapB[i]=B[j];doneA.add(i);used.add(j)}
 window.PT_LA=A.map(v=>v.map(x=>x/1.15));window.PT_LB=mapB.map(v=>v.map(x=>x/1.15));
 PT_LA.forEach((v,i)=>{PT_CLOUD[i][0]=v[0];PT_CLOUD[i][1]=v[1]});}
{const LH=195;
 const blk=(id,lines)=>{const d=document.createElement('div');d.id=id;d.style.cssText=`position:absolute;left:0;right:0;top:${540-lines.length*LH/2}px;text-align:center;color:#670003;font-size:150px;font-weight:900;letter-spacing:-.02em;line-height:${LH}px;white-space:nowrap;pointer-events:none`;
  d.innerHTML=lines.map(l=>`<div style="height:${LH+34}px;margin-bottom:-34px;overflow:hidden">${l.split(' ').map(w=>`<span class="ptW" style="display:inline-block${w.startsWith('*')?`;background:${JG_TXT};-webkit-background-clip:text;background-clip:text;color:transparent;padding-bottom:.22em;margin-bottom:-.22em`:''}">${w.replace('*','')}</span>`).join(' ')}</div>`).join('');
  PT.insertBefore(d,$('ptLogo'));return [...d.querySelectorAll('.ptW')]};
 PTE.w0=blk('ptWords',['Eine Welt voller','*starker Marken.']);
 PTE.w1=blk('ptSent1',['Eine Welt voller Marken.']);
 PTE.w2=blk('ptSent2',['Ein *gemeinsames','Markenerlebnis.']);
 // jö als rundes Logo: weißer Kreis hinter dem Verlauf-Logo (Kunde: rundes jö-Logo) (skaliert mit dem Logo)
 {const sq=document.createElement('div');sq.style.cssText='position:absolute;left:-20px;top:-88.5px;width:460px;height:460px;border-radius:50%;background:#fff;box-shadow:0 34px 80px rgba(90,30,0,.18)';
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
  w.style.transform=`translateY(${((1-pi)*130-po*130).toFixed(1)}%)`;w.style.visibility=pi>0&&po<1?'visible':'hidden'});
 const r0=PARTNER.render;
 PARTNER.render=function(M,t){{const u=1; // Logos erscheinen erst mit dem jö-Icon, direkt in der Anordnung um das Icon
 PT_LA.forEach((v,i)=>{PT_CLOUD[i][0]=v[0]+(PT_LB[i][0]-v[0])*u;PT_CLOUD[i][1]=v[1]+(PT_LB[i][1]-v[1])*u})}
  r0.call(this,M,t);const P=M.P,E=PTE;
  E.cs.forEach((c,i)=>{const a=P.swap+.05+PT_POP[i]*.035,q=eBack(seg(t,a,a+.4));c.style.transform+=` scale(${q.toFixed(4)})`;c.style.visibility=q>0?'visible':'hidden'});
  words(E.w0,t,.05,P.swap-.45);                       // ganz raus, bevor das Icon kommt
  const lin=eBack(seg(t,P.swap,P.swap+.45)),lout=eIO(seg(t,P.lOut,P.lOut+.35));
  E.logo.style.transform+=` scale(${(lin*(1-lout)).toFixed(4)})`;E.logo.style.opacity=t<P.swap?'0':'1';
  E.disc.style.opacity=(lin*(1-lout)).toFixed(3);
  words(E.w1,t,P.sent,P.sent2-.3);
  words(E.w2,t,P.sent2,1e9);
 };
}
