/* =====================================================================
   COMP: TAG-SYSTEM (Partnerfilm) – sieben Formen ploppen nacheinander auf, dann werden sechs davon zu Tags
   (weiße Pill, Form + Label), das Dreieck tritt ab. Danach fliegen drei Tags an die Stellen, an denen sie in den
   Stories sitzen, nehmen dabei deren Farbe an, und die Stories klappen um sie herum auf (Anwendungsbeispiel).
   ===================================================================== */
const TG_INK='#5e1708';
const TG_ORDER=['sq','ci','tri','hg','x','di','hex'];
const TG_TAGS=[{s:'sq',l:'Neu'},{s:'ci',l:'Aktion'},{s:'hg',l:'Letzte Chance'},{s:'x',l:'Games'},{s:'di',l:'Neu'},{s:'hex',l:'Neu'}];
// Tag-Maße im Bild (Proportionen wie die Pills in den Stories: Höhe 98, Schrift 52, Icon 46)
const TG_H=90,TG_F=48,TG_IC=42,TG_PL=30,TG_GAP=18,TG_PR=30,TG_SP=26,TG_SZ=104,TG_SGAP=58;
// Ziele in den Stories: Tag-Index → Pill (Element-Finder), Farbe der Pill und der Schrift
const TG_FLY=[
 {j:0,el:()=>STE.A[1].firstElementChild,frame:()=>$('stFrame'),bg:ST_OR,fg:'#fff'},
 {j:1,el:()=>$('s4Pill').firstElementChild,wrap:()=>$('s4Pill'),frame:()=>$('s4Frame'),bg:'#fff',fg:'#ea3a10'},
 {j:2,el:()=>$('s2Pill'),frame:()=>$('s2Frame'),bg:S2_INK,fg:'#fff'}];
const TGL=document.createElement('div');TGL.id='tagsL';TGL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;font-family:var(--font);color:'+TG_INK;
TGL.innerHTML=`<div id="tgBg" style="position:absolute;inset:0;background:#f4f1ea"></div>
${TG_TAGS.map(g=>`<div class="tgT" style="position:absolute;left:0;top:0;height:${TG_H}px;border-radius:${TG_H*.22}px;background:#fff;transform-origin:0 0;overflow:hidden;box-sizing:border-box;display:flex;align-items:center;gap:${TG_GAP}px;padding:0 ${TG_PR}px 0 ${TG_PL}px;white-space:nowrap;font-size:${TG_F}px;font-weight:700;letter-spacing:-.01em;line-height:1"><span class="tgI" style="display:block;width:${TG_IC}px;height:${TG_IC}px;flex:none"></span><span class="tgL">${g.l}</span></div>`).join('')}
${TG_ORDER.map(k=>`<div class="tgS" style="position:absolute;left:0;top:0;width:${TG_SZ}px;height:${TG_SZ}px;transform-origin:50% 50%">${tgSvg(k,TG_SZ)}</div>`).join('')}`;
STL.before(TGL); // unter den Stories, über allem davor (Julian, Weiße Fläche)
const TGE={bg:$('tgBg'),sh:[...TGL.querySelectorAll('.tgS')],tg:[...TGL.querySelectorAll('.tgT')],lb:[...TGL.querySelectorAll('.tgL')]};
const tgMix=(a,b,u)=>u<=0?a:u>=1?b:`color-mix(in srgb, ${b} ${(u*100).toFixed(1)}%, ${a})`;
function tgRestore(){TG_FLY.forEach(f=>{const e=f.el(),fr=f.frame();if(e)e.style.opacity='';if(f.wrap)f.wrap().style.opacity='';if(fr)fr.style.clipPath=''})}
function tgLeads(){ // liegt der Tag-Clip über dem Start der Stories? dann stehen die Stories ab Clipbeginn (kein Julian-Einfahren)
  const c=S.clips.tags,st=S.clips.story;if(!c||!st||typeof mT==='undefined')return false;const a=wReal(st.start);return c.start<a&&c.start+c.len>a&&tgRT>=c.start}
let tgRT=0; // echte Zeit (mT ist beim Rendern der Julian/Story-Ebenen auf Design-Zeit umgestellt)
const TAGS={
  key:'tags',name:'Tag-System → Stories',lane:'laneV2',cls:'typo',
  DEF:{beat:13.725/24,popStep:.5,tagAt:4.5,tagStep:.5,flyAt:9.5,flyDur:1,lag:.08,reveal:.8},
  params:[
    {k:'popStep',label:'Formen im Abstand von',min:.25,max:1,step:.25,fmt:v=>v+' Schlag',sub:'Quadrat, Kreis, Dreieck, Sanduhr, Stern, Raute, Sechseck ploppen nacheinander auf'},
    {k:'tagAt',label:'Tags ab Schlag',min:3,max:8,step:.5,fmt:v=>String(v),sub:'die Formen rücken zur Tag-Reihe zusammen, das Dreieck tritt ab'},
    {k:'tagStep',label:'Tags im Abstand von',min:.25,max:1,step:.25,fmt:v=>v+' Schlag',sub:'je Tag fährt die weiße Pill mit Label auf'},
    {k:'flyAt',label:'Flug in die Stories ab Schlag',min:6,max:14,step:.5,fmt:v=>String(v),sub:'liegt auf dem Start der Stories; „Neu“, „Aktion“ und „Letzte Chance“ fliegen an ihre Plätze, die übrigen Tags treten ab'},
    {k:'flyDur',label:'Flugdauer',min:.5,max:2,step:1/24,fmt:v=>Math.round(v*24)+' F'},
    {k:'lag',label:'Versatz je Tag',min:0,max:.25,step:.01,fmt:v=>Math.round(v*1000)+' ms'},
    {k:'reveal',label:'Story klappt auf über',min:.3,max:1.5,step:1/24,fmt:v=>Math.round(v*24)+' F',sub:'die Story wächst aus ihrem Tag heraus auf volle Größe'}],
  model(P){const b=P.beat,fly=P.flyAt*b;return {P,b,fly,key:fly,keyName:'Flug in die Stories',total:fly+P.flyDur+2*P.lag+P.reveal+.3}},
  show(on){TGL.style.display=on?'':'none';if(!on)tgRestore()},
  render(M,t){const P=M.P,b=M.b,E=TGE;
    // Tag-Breiten (gemessen) und Reihen
    const W=E.tg.map((el,j)=>{if(!el._w){el.style.width='auto';el._w=el.offsetWidth}return el._w});
    const tw=W.reduce((a,w)=>a+w,0)+TG_SP*(W.length-1);let x=960-tw/2;const TX=W.map(w=>{const v=x;x+=w+TG_SP;return v}),TY=540-TG_H/2;
    const sw=7*TG_SZ+6*TG_SGAP,SX=TG_ORDER.map((k,i)=>960-sw/2+i*(TG_SZ+TG_SGAP)),SY=540-TG_SZ/2;
    const t0=P.tagAt*b,ug=eIO(seg(t,t0,t0+.6));
    // 1) Formen ploppen auf, 2) rücken als Icons in die Tags
    let ti=0;E.sh.forEach((el,i)=>{const pop=eBack(seg(t,i*P.popStep*b,i*P.popStep*b+.4));
      if(TG_ORDER[i]==='tri'){const out=1-eIO(seg(t,t0-.05,t0+.35));el.style.transform=`translate(${SX[i]}px,${SY}px) scale(${(pop*out).toFixed(4)})`;el.style.opacity=out.toFixed(3);return}
      const j=ti++,s=1+(TG_IC/TG_SZ-1)*ug,c0=SX[i]+TG_SZ/2,c1=TX[j]+TG_PL+TG_IC/2,cx=c0+(c1-c0)*ug-TG_SZ/2,cy=SY; // Mitte gleitet auf das Icon im Tag
      el.style.transform=`translate(${cx.toFixed(1)}px,${cy.toFixed(1)}px) scale(${(pop*s).toFixed(4)})`;
      el.style.opacity=t>=M.fly?'0':'1'}); // ab dem Flug übernimmt das Icon im Tag
    if(t<M.fly)tgRestore();
    // 3) Tags: Pill fährt auf, Label blendet ein
    E.tg.forEach((el,j)=>{const a=t0+.25+j*P.tagStep*b,u=eIO(seg(t,a,a+.45)),wMin=TG_PL+TG_IC+TG_PR,w=wMin+(W[j]-wMin)*u;
      const ic=el.firstElementChild;if(!ic._s){ic.innerHTML=tgSvg(TG_TAGS[j].s,TG_IC);ic._s=1}ic.style.opacity=t>=M.fly?'1':'0';
      E.lb[j].style.opacity=u.toFixed(3);E.lb[j].style.transform=`translateX(${(-16*(1-u)).toFixed(1)}px)`;
      let X=TX[j],Y=TY,sc=1,bg='#fff',fg=TG_INK,op=u>0?1:0;
      const f=TG_FLY.find(f=>f.j===j);
      if(t>=M.fly){const k=f?TG_FLY.indexOf(f):0,fs=M.fly+(f?k*P.lag:0);
        if(!f){const o=eIO(seg(t,M.fly,M.fly+.35));sc=1-.3*o;op=1-o;X+=W[j]*.15*o;Y+=TG_H*.15*o}
        else{const tgt=f.el(),st=$('stage').getBoundingClientRect(),k0=st.width/1920;
          const u2=eIO(seg(t,fs,fs+P.flyDur));
          if(tgt&&tgt.offsetParent){const r=tgt.getBoundingClientRect(),rx=(r.left-st.left)/k0,ry=(r.top-st.top)/k0,rh=r.height/k0;
            X+=(rx-X)*u2;Y+=(ry-Y)*u2;sc=1+(rh/TG_H-1)*u2;bg=tgMix('#fff',f.bg,u2);fg=tgMix(TG_INK,f.fg,u2);
            const land=t>=fs+P.flyDur;tgt.style.opacity=land?'':'0';if(f.wrap)f.wrap().style.opacity=land?'1':''; // die Pill der Story blendet sonst erst später einop=land?0:1;
            // 4) Story wächst aus ihrem Tag heraus
            const fr=f.frame();if(fr){const v=eIO(seg(t,fs+P.flyDur-.05,fs+P.flyDur+P.reveal)),R=fr.getBoundingClientRect(),q=R.width/1080;
              if(v<=0)fr.style.clipPath='inset(50%)';else{
                const px=(r.left-R.left)/q,py=(r.top-R.top)/q,pw=r.width/q,ph=r.height/q,i=1-v;
                fr.style.clipPath=v>=1?'':`inset(${(py*i).toFixed(1)}px ${((1080-px-pw)*i).toFixed(1)}px ${((1920-py-ph)*i).toFixed(1)}px ${(px*i).toFixed(1)}px round ${(20+20*v).toFixed(1)}px)`}}}
          else{const o=eIO(seg(t,fs,fs+.35));op=1-o}}}
      Object.assign(el.style,{width:w.toFixed(1)+'px',background:bg,color:fg,opacity:String(op),transform:`translate(${X.toFixed(1)}px,${Y.toFixed(1)}px) scale(${sc.toFixed(4)})`})});
    E.bg.style.opacity='1';
    if(typeof GL!=='undefined')GL.style.display='none'; // das jö-App-Icon aus Julian liegt sonst über dem Tag-System
  },
  marks(M){const b=M.b,P=M.P;return [[0,'Formen'],[P.tagAt*b,'Tags'],[M.fly,'Flug'],[M.fly+P.flyDur,'Stories']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P,b=M.b;return [
    ['Formen ploppen auf',`0–${F(6*P.popStep*b+.4)}`,'Quadrat, Kreis, Dreieck, Sanduhr, Stern, Raute, Sechseck, Dunkelrot auf Beige'],
    ['Formen werden Tags',`${F(P.tagAt*b)}–${F(P.tagAt*b+.7+5*P.tagStep*b)}`,'Formen rücken als Icons in die Reihe, weiße Pills mit Label fahren auf, Dreieck tritt ab'],
    ['Flug in die Stories',`${F(M.fly)}–${F(M.fly+P.flyDur+2*P.lag)}`,'„Neu“ → Story links, „Aktion“ → Story Mitte, „Letzte Chance“ → Story rechts; Farbe wechselt zur Pill der Story'],
    ['Stories klappen auf',`${F(M.fly+P.flyDur)}–${F(M.total)}`,'jede Story wächst aus ihrem Tag auf volle Größe']]},
  note:'Frames bei 24 fps ab Beginn der Subebene. Der Flug richtet sich nach der aktuellen Lage der Pills in den Stories; der Clip sollte so liegen, dass „Flug“ auf dem Start der Stories liegt. Solange der Clip läuft, fahren die Stories nicht mit dem Julian-Scroll ein, sondern stehen.'
};
