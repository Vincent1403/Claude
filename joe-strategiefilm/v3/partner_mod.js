/* Partnerfilm: Partner-Szene neu erzählt – erst „Viele Marken.“ in der Mitte, die Partner kreisen darum;
   dann ersetzt das jö-Logo die Worte, die Partner fliegen hinein, das Logo verschwindet und
   „Eine starke Verbindung.“ steigt auf. */
{const mk=(id,html,size)=>{const d=document.createElement('div');d.id=id;d.style.cssText=`position:absolute;left:0;right:0;top:${540-size*.62}px;height:${Math.round(size*1.3)}px;overflow:hidden;text-align:center;color:#670003;font-size:${size}px;font-weight:900;letter-spacing:-.02em;line-height:${Math.round(size*1.3)}px;white-space:nowrap;pointer-events:none`;d.innerHTML=`<div style="display:inline-block">${html}</div>`;PT.insertBefore(d,$('ptLogo'));return d.firstChild};
 const wd=(t,hi)=>t.split(' ').map(w=>`<span class="ptW" style="display:inline-block${hi&&w.startsWith('*')?`;background:${JG_TXT};-webkit-background-clip:text;background-clip:text;color:transparent`:''}">${w.replace('*','')}</span>`).join(' '); // Wort für Wort wie die anderen Headlines
 PTE.words=mk('ptWords',wd('Viele Marken.'),150);PTE.wW=[...PTE.words.querySelectorAll('.ptW')];
 PTE.sent=mk('ptSent',wd('Eine starke *Verbindung.',1),150);PTE.sW=[...PTE.sent.querySelectorAll('.ptW')];
 // jö als App-Icon: weißes, abgerundetes Quadrat hinter dem Verlauf-Logo (skaliert mit dem Logo)
 {const sq=document.createElement('div');sq.style.cssText='position:absolute;left:-20px;top:-88.5px;width:460px;height:460px;border-radius:106px;background:#fff;box-shadow:0 34px 80px rgba(90,30,0,.18)';
  const L=$('ptLogo');L.insertBefore(sq,L.firstChild);L.querySelector('svg').style.transform='translate(-1%,4%) scale(.8)'}
 Object.assign(PARTNER.DEF,{swap:2,lOut:4.25,sent:4.4});
 PARTNER.params.unshift(
  {k:'swap',label:'jö-Logo ersetzt „Viele Marken.“ bei',min:.5,max:4,step:1/24,fmt:v=>Math.round(v*24)+' F'},
  {k:'lOut',label:'Logo verschwindet bei',min:2,max:7,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'nachdem alle Partner im Logo sind'},
  {k:'sent',label:'„Eine starke Verbindung.“ ab',min:2,max:7,step:1/24,fmt:v=>Math.round(v*24)+' F'});
 const r0=PARTNER.render;
 PARTNER.render=function(M,t){r0.call(this,M,t);const P=M.P,E=PTE;
  // „Viele Marken.“: steigt auf, fällt beim Logo-Wechsel nach unten raus
  const st=.25*13.725/24,wo=eInCub(seg(t,P.swap-.3,P.swap-.04)); // Wörter steigen im Sechzehntel-Abstand auf; ganz raus, bevor das Logo kommt
  E.words.style.transform=`translateY(${(wo*110).toFixed(1)}%)`;
  E.wW.forEach((w,k)=>{const a=.05+k*st;w.style.transform=`translateY(${((1-eExpo(seg(t,a,a+.45)))*110).toFixed(1)}%)`});
  // jö-Logo: poppt an Stelle der Worte auf, wächst mit jedem ankommenden Partner, schrumpft am Ende weg
  const lin=eBack(seg(t,P.swap,P.swap+.45)),lout=eIO(seg(t,P.lOut,P.lOut+.35));
  E.logo.style.transform+=` scale(${(lin*(1-lout)).toFixed(4)})`;E.logo.style.opacity=t<P.swap?'0':'1';E.words.parentNode.style.visibility=t<P.swap?'visible':'hidden';
  E.disc.style.opacity=(lin*(1-lout)).toFixed(3);
  // „Eine starke Verbindung.“
  E.sW.forEach((w,k)=>{const a=P.sent+k*st;w.style.transform=`translateY(${((1-eExpo(seg(t,a,a+.45)))*110).toFixed(1)}%)`});
 };
}
