const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const n of ['Store1','Store2']){const p=await b.newPage({viewport:{width:1600,height:1200}});
 await p.goto('file:///home/user/Claude/joe-store-ads/'+n+'-ads.svg');
 const h=await p.evaluate(()=>{const s=document.documentElement;const H=Math.round(1600*s.viewBox.baseVal.height/s.viewBox.baseVal.width);s.setAttribute('width','1600');s.setAttribute('height',H);s.style.background='#d9d6d2';return H});
 await p.setViewportSize({width:1600,height:h});await p.waitForTimeout(500);
 await p.screenshot({path:'/home/user/Claude/joe-store-ads/previews/'+n+'.png'});await p.close()}
await b.close()})();
