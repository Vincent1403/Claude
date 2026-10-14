/* =====================================================================
   COMP: TAG-SYSTEM (Partnerfilm) – sieben Formen ploppen nacheinander auf, dann werden sechs davon zu Tags
   (weiße Pill, Form + Label), das Dreieck tritt ab. Am Ende harter Schnitt auf die Stories, die die Tags nutzen.
   ===================================================================== */
const TG_INK='#5e1708';
const TG_ORDER=['sq','ci','tri','hg','x','di','hex'];
const TG_TAGS=[{s:'sq',l:'Neu'},{s:'ci',l:'Aktion'},{s:'hg',l:'Letzte Chance'},{s:'x',l:'Games'},{s:'di',l:'Neu'},{s:'hex',l:'Neu'}];
// Tag-Maße im Bild (Proportionen wie die Pills in den Stories: Höhe 98, Schrift 52, Icon 46)
const TG_H=90,TG_F=48,TG_IC=42,TG_PL=30,TG_GAP=18,TG_PR=30,TG_SP=26,TG_SZ=104,TG_SGAP=58;
const TGL=document.createElement('div');TGL.id='tagsL';TGL.style.cssText='position:absolute;inset:0;display:none;overflow:hidden;font-family:var(--font);color:'+TG_INK;
TGL.innerHTML=`<div id="tgBg" style="position:absolute;inset:0;background:#f4f1ea"></div>
${TG_TAGS.map(g=>`<div class="tgT" style="position:absolute;left:0;top:0;height:${TG_H}px;border-radius:${TG_H*.22}px;background:#fff;transform-origin:0 0;overflow:hidden;box-sizing:border-box;display:flex;align-items:center;gap:${TG_GAP}px;padding:0 ${TG_PR}px 0 ${TG_PL}px;white-space:nowrap;font-size:${TG_F}px;font-weight:700;letter-spacing:-.01em;line-height:1"><span class="tgI" style="display:block;width:${TG_IC}px;height:${TG_IC}px;flex:none"></span><span class="tgL">${g.l}</span></div>`).join('')}
${TG_ORDER.map(k=>`<div class="tgS" style="position:absolute;left:0;top:0;width:${TG_SZ}px;height:${TG_SZ}px;transform-origin:50% 50%">${tgSvg(k,TG_SZ)}</div>`).join('')}`;
STL.before(TGL);
const TGE={bg:$('tgBg'),sh:[...TGL.querySelectorAll('.tgS')],tg:[...TGL.querySelectorAll('.tgT')],lb:[...TGL.querySelectorAll('.tgL')]};
const TAGS={
  key:'tags',name:'Tag-System',lane:'laneV2',cls:'typo',
  DEF:{beat:13.725/24,popStep:.5,tagAt:4.5,tagStep:.5,len:10},
  params:[
    {k:'popStep',label:'Formen im Abstand von',min:.25,max:1,step:.25,fmt:v=>v+' Schlag',sub:'Quadrat, Kreis, Dreieck, Sanduhr, Stern, Raute, Sechseck ploppen nacheinander auf'},
    {k:'tagAt',label:'Tags ab Schlag',min:3,max:8,step:.5,fmt:v=>String(v),sub:'die Formen rücken zur Tag-Reihe zusammen, das Dreieck tritt ab'},
    {k:'tagStep',label:'Tags im Abstand von',min:.25,max:1,step:.25,fmt:v=>v+' Schlag',sub:'je Tag fährt die weiße Pill mit Label auf'},
    {k:'len',label:'Schnitt auf die Stories bei Schlag',min:6,max:16,step:.5,fmt:v=>String(v)}],
  model(P){const b=P.beat;return {P,b,key:P.tagAt*b,keyName:'Tags',total:P.len*b}},
  show(on){TGL.style.display=on?'':'none'},
  render(M,t){const P=M.P,b=M.b,E=TGE;
    // Tag-Breiten (gemessen) und Reihen
    const W=E.tg.map((el,j)=>{if(!el._w){el.style.width='auto';el._w=el.offsetWidth}return el._w});
    const tw=W.reduce((a,w)=>a+w,0)+TG_SP*(W.length-1);let x=960-tw/2;const TX=W.map(w=>{const v=x;x+=w+TG_SP;return v}),TY=540-TG_H/2;
    const sw=7*TG_SZ+6*TG_SGAP,SX=TG_ORDER.map((k,i)=>960-sw/2+i*(TG_SZ+TG_SGAP)),SY=540-TG_SZ/2;
    const t0=P.tagAt*b,ug=eIO(seg(t,t0,t0+.6));
    // 1) Formen ploppen auf, 2) rücken als Icons in die Tags
    let ti=0;E.sh.forEach((el,i)=>{const pop=eBack(seg(t,i*P.popStep*b,i*P.popStep*b+.4));
      if(TG_ORDER[i]==='tri'){const out=1-eIO(seg(t,t0-.05,t0+.35));el.style.transform=`translate(${SX[i]}px,${SY}px) scale(${(pop*out).toFixed(4)})`;el.style.opacity=out.toFixed(3);return}
      const j=ti++,s=1+(TG_IC/TG_SZ-1)*ug,c0=SX[i]+TG_SZ/2,c1=TX[j]+TG_PL+TG_IC/2,cx=c0+(c1-c0)*ug-TG_SZ/2; // Mitte gleitet auf das Icon im Tag
      el.style.transform=`translate(${cx.toFixed(1)}px,${SY}px) scale(${(pop*s).toFixed(4)})`});
    // 3) Tags: Pill fährt auf, Label blendet ein
    E.tg.forEach((el,j)=>{const a=t0+.25+j*P.tagStep*b,u=eIO(seg(t,a,a+.45)),wMin=TG_PL+TG_IC+TG_PR,w=wMin+(W[j]-wMin)*u;
      E.lb[j].style.opacity=u.toFixed(3);E.lb[j].style.transform=`translateX(${(-16*(1-u)).toFixed(1)}px)`;
      Object.assign(el.style,{width:w.toFixed(1)+'px',opacity:u>0?'1':'0',transform:`translate(${TX[j].toFixed(1)}px,${TY}px)`})});
  },
  marks(M){const b=M.b,P=M.P;return [[0,'Formen'],[P.tagAt*b,'Tags'],[M.total,'Schnitt']]},
  table(M){const F=s=>Math.round(s*FPS),P=M.P,b=M.b;return [
    ['Formen ploppen auf',`0–${F(6*P.popStep*b+.4)}`,'Quadrat, Kreis, Dreieck, Sanduhr, Stern, Raute, Sechseck, Dunkelrot auf Beige'],
    ['Formen werden Tags',`${F(P.tagAt*b)}–${F(P.tagAt*b+.7+5*P.tagStep*b)}`,'Formen rücken als Icons in die Reihe, weiße Pills mit Label fahren auf, Dreieck tritt ab'],
    ['Tag-Reihe steht',`bis ${F(M.total)}`,'danach harter Schnitt auf die Stories']]},
  note:'Frames bei 24 fps ab Beginn der Subebene. Die Stories zeigen die Tags im Einsatz (Neu, Aktion, Letzte Chance, Games).'
};
