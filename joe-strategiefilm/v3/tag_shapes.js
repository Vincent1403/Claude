/* Tag-System: Formen (Partnerfilm), auch von den Story-Pills genutzt */
const TG_SH={ // Formen im 24er-Raster, Füllung = currentColor
 sq:'<rect x="2" y="2" width="20" height="20"/>',
 ci:'<circle cx="12" cy="12" r="10.5"/>',
 tri:'<path d="M12 1.5L23 22H1z"/>',
 hg:'<path d="M2 2H22A10 10 0 0 1 2 2ZM2 22H22A10 10 0 0 0 2 22Z"/>',
 x:'<path d="M1.5 1.5Q12 8.5 22.5 1.5Q15.5 12 22.5 22.5Q12 15.5 1.5 22.5Q8.5 12 1.5 1.5Z"/>',
 di:'<path d="M12 .8L23.2 12L12 23.2L.8 12Z"/>',
 hex:'<path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5Z"/>'};
const tgSvg=(k,sz)=>`<svg viewBox="0 0 24 24" style="width:${sz}px;height:${sz}px;display:block;flex:none;fill:currentColor">${TG_SH[k]}</svg>`;
