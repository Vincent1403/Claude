const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:900}});
for(const f of (process.argv[2]||'ORF-02,ORF-03,ORF-04').split(',')){
 const t=fs.readFileSync(f+'-stroke.svg','utf8');
 await p.setContent(`<body style="margin:0;background:#fff">${t.replace('<svg ','<svg width="880" ')}</body>`);
 await p.evaluate(()=>{const svg=document.querySelector('svg');const ps=[...svg.querySelectorAll('#fills path')];
  const hs=[0,40,80,130,180,220,270,310,340,20,60,100,150,200,250,290,330,10,50];
  ps.forEach((q,i)=>{q.setAttribute('fill',`hsl(${hs[i%hs.length]} 75% ${i%2?72:60}%)`);});
  ps.forEach((q,i)=>{const bb=q.getBBox();const t=document.createElementNS('http://www.w3.org/2000/svg','text');
   t.setAttribute('x',bb.x+bb.width/2);t.setAttribute('y',bb.y+bb.height/2);t.setAttribute('font-size','7');t.setAttribute('font-weight','bold');t.setAttribute('text-anchor','middle');
   t.setAttribute('stroke','#fff');t.setAttribute('stroke-width','2');t.setAttribute('paint-order','stroke');t.textContent=i;svg.appendChild(t);});});
 const el=await p.$('svg');await el.screenshot({path:f+'-labels.png'});}
await b.close();})();
