const {chromium}=require('playwright');
const areas={Store1:{'area-01':[3806,4952,6646,6585],'area-02':[7217,3647,10655,6588],'area-03':[13775,6162,14725,7356]},
Store2:{'area-01':[5092,5077,11254,8763],'area-02':[12449,3515,14399,9738]}};
(async()=>{const b=await chromium.launch();
for(const n in areas){const p=await b.newPage({viewport:{width:1000,height:1000}});
 await p.goto('file:///home/user/Claude/joe-store-ads/'+n+'-ads.svg');
 for(const a in areas[n]){const [x0,y0,x1,y1]=areas[n][a];const W=x1-x0,H=y1-y0;const k=1400/Math.max(W,H);
  const w=Math.round(W*k),h=Math.round(H*k);
  await p.evaluate(([x0,y0,W,H,w,h])=>{const s=document.documentElement;s.setAttribute('viewBox',`${x0} ${y0} ${W} ${H}`);s.setAttribute('width',w);s.setAttribute('height',h)},[x0,y0,W,H,w,h]);
  await p.setViewportSize({width:w,height:h});await p.waitForTimeout(300);
  await p.screenshot({path:`/home/user/Claude/joe-store-ads/previews/${n}_${a}.png`,omitBackground:true});}
 await p.close()}
await b.close()})();
