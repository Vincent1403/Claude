/* Partnerfilm: Profil-Wolke nach dem Kian-Video – gleiche Anordnung wie die Wolke um „Für jeden.“ (fuer_comp.js), auf dem jö-Verlauf.
   Die Kamera zieht aus Kian genau dorthin zurück, wo sie hineingezoomt hat („Für jeden.“ steht wieder in der Mitte), dann Zoom in Tamara. */
{const CL2_AV=[[-813, -406, 144], [-510, -412, 131], [-269, -405, 114], [-22, -409, 127], [279, -392, 183], [512, -422, 132], [781, -391, 136], [-686, -242, 122], [-386, -246, 130], [-129, -244, 127], [116, -246, 130], [422, -246, 130], [678, -246, 130], [-868, -2, 0], [-700, 21, 0], [700, 8, 0], [860, 10, 0], [-703, 192, 110], [-385, 246, 130], [-116, 246, 130], [127, 246, 130], [405, 246, 130], [719, 199, 132], [-786, 403, 140], [-508, 431, 183], [-305, 393, 155], [29, 408, 127], [510, 418, 154], [829, 396, 131]]; // eigene Anordnung für die zweite Wolke: Platz für die zweizeilige Headline
 const fs=150,W=document.createElement('div');W.id='clFW';W.style.cssText='position:absolute;left:960px;top:540px;width:0;height:0';
 W.innerHTML=CL2_AV.map((p,i)=>`<img class="clFAv" src="${CLI.av[i%CLI.av.length]}" alt="" style="position:absolute;left:${p[0]-p[2]/2}px;top:${p[1]-p[2]/2}px;width:${p[2]}px;height:${p[2]}px;max-width:none;border-radius:50%;box-shadow:0 18px 40px rgba(60,10,0,.22);${i===FU_TI?'visibility:hidden':''}">`).join('')
  +`<div style="position:absolute;left:0;top:-153px;transform:translateX(-50%);color:#fff;font-size:150px;font-weight:900;letter-spacing:-.02em;line-height:1.02;white-space:nowrap;text-align:center">Mit Möglichkeiten für<br>jeden Einzelnen.</div>`;
 $('clW').after(W);$('clW').style.display='none';CLL.style.background=JG_CSS;
 const AV=[...W.querySelectorAll('.clFAv')],CT=$('clT'),flo=(i,t)=>[9*Math.sin(t*(1+i*.11)+i*1.7),7*Math.cos(t*(.9+i*.13)+i*1.1)];
 const fit=(el,w,h,ty)=>{const iw=Math.max(w,h*16/9),ih=iw*9/16;Object.assign(el.style,{width:iw.toFixed(1)+'px',height:ih.toFixed(1)+'px',left:((w-iw)/2).toFixed(1)+'px',top:((h-ih)*ty).toFixed(1)+'px'})};
 const box=(el,cx,cy,w,h,r)=>Object.assign(el.style,{left:(cx-w/2).toFixed(1)+'px',top:(cy-h/2).toFixed(1)+'px',width:w.toFixed(1)+'px',height:h.toFixed(1)+'px',borderRadius:r.toFixed(1)+'px',transform:'none'});
 const r0=CLOUD.render;
 CLOUD.render=function(M,t){r0.call(this,M,t);const P=M.P,f=eStFlow,[kx,ky,kd]=FU_POS[FU_KI],[tx,ty,td]=CL2_AV[FU_TI];
  // Phase 1: Vollbild Kian → sein Kreis an seinem Platz in der Wolke (genau umgekehrt zum Zoom in „Für jeden.“)
  const u=f(seg(t,P.hold,P.hold+P.dur)),w1=1-u,kw=kd+(1920-kd)*w1,kh=kd+(1080-kd)*w1;
  // Phase 2: Zoom in Tamara (gleiche Kamera-Logik)
  const v=f(seg(t,P.z2At,P.z2At+P.z2Dur)),tw=td+(1920-td)*v,th=td+(1080-td)*v;
  let s,Tx,Ty;if(v>0){s=tw/td;Tx=tx*(1-v)-tx*s;Ty=ty*(1-v)-ty*s}else{s=kw/kd;Tx=kx*u-kx*s;Ty=ky*u-ky*s}
  W.style.transform=`translate(${Tx.toFixed(1)}px,${Ty.toFixed(1)}px) scale(${s.toFixed(4)})`;
  AV.forEach((el,i)=>{const [ox,oy]=flo(i,t);el.style.transform=`translate(${ox.toFixed(1)}px,${oy.toFixed(1)}px)`});
  {const [fx,fy]=flo(FU_KI,t),cx=960+Tx+(kx+fx*u)*s,cy=540+Ty+(ky+fy*u)*s,w=v>0?kd*s:kw,h=v>0?kd*s:kh;
   box(CLE.main,cx,cy,w,h,Math.min(w,h)/2*(1-Math.pow(w1,3)));fit(CLV,w,h,.3);fit(CLE.img,w,h,.3);CLE.main.style.boxShadow=`0 18px 40px rgba(60,10,0,${(.22*u).toFixed(3)})`}
  {const [fx,fy]=flo(FU_TI,t),cx=960+Tx+(tx+fx*(1-v))*s,cy=540+Ty+(ty+fy*(1-v))*s,w=v>0?tw:td*s,h=v>0?th:td*s;
   box(CT,cx,cy,w,h,Math.min(w,h)/2*(1-Math.pow(v,3)));fit(CLV2,w,h,.5);CT.style.boxShadow='0 18px 40px rgba(60,10,0,.22)'}
 };
}
