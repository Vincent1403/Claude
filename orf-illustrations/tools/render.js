// usage: node render.js in.svg out.png scale
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const [,,inp,out,sc]=process.argv;const t=fs.readFileSync(inp,'utf8');
const vb=t.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);const s=+sc;
const W=Math.ceil(vb[2]*s),H=Math.ceil(vb[3]*s);
const b=await chromium.launch();const p=await b.newPage({viewport:{width:W,height:H}});
await p.setContent(`<style>html,body{margin:0;background:transparent}</style><img style="display:block;width:${vb[2]*s}px;height:${vb[3]*s}px" src="data:image/svg+xml;base64,${Buffer.from(t).toString('base64')}">`);
await p.screenshot({path:out,omitBackground:true,clip:{x:0,y:0,width:W,height:H}});await b.close();})();
