/* Kunde: das jö-Logo (nach „Das neue jö.“) steht einen Takt länger – Musik wiederholt dort einen Takt */
{const H=__LH__,L=__LL__,r0=LOGO3.render,m0=LOGO3.model;
 LOGO3.model=function(P){const M=m0.call(this,P);M.total+=L;return M};
 LOGO3.render=function(M,t){r0.call(this,M,t<H?t:t<H+L?H:t-L)};}
