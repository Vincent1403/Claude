import numpy as np, sys
from PIL import Image, ImageFilter
from scipy import ndimage
SRC='/tmp/claude-0/-home-user-Claude/353e2518-1505-59d0-a6d4-5600e797f943/scratchpad/logos_new/'
OUT='/tmp/claude-0/-home-user-Claude/353e2518-1505-59d0-a6d4-5600e797f943/scratchpad/flat/'
M={'adeg':'ADEG_Logo_Frisbee_RGB.png','biogena':'BIOGENA_Logo_Frisbee_RGB.png','bipa':'BIPA_Logo_Frisbee_RGB.jpg','billa':'Frisbee.png',
 'josport':'Group 6171.png','joreisen':'Group 6172.png','forstinger':'Image.png','omv':'OMV_Logo_Frisbee_RGB.png','pagro':'PAGRO_Logo_Frisbee_RGB_klein.png',
 'pearle':'PEARLE_Logo_Frisbee_RGB.png','penny':'PENNY_Logo_Frisbee_RGB.png','raiffeisen':'Raiffeisen_X_Logo_Frisbee_RGB_2000x2000px.png',
 'sutterluety':'Sutterluety_Logo_Frisbee_RGB_501x501px.png','universal':'UNIVERSAL_Logo_Frisbee_RGB.jpg','zgonc':'ZGONC_Logo_Frisbee_RGB.jpg',
 'billareisen':'billareisen.png','libro':'libro.png'}
N=800
def lab(a):
    a=np.where(a>.04045,((a+.055)/1.055)**2.4,a/12.92)
    X=a@np.array([[.4124,.2126,.0193],[.3576,.7152,.1192],[.1805,.0722,.9505]])
    X=X/np.array([.95047,1.,1.08883]);f=np.where(X>.008856,np.cbrt(X),7.787*X+16/116)
    return np.stack([116*f[...,1]-16,500*(f[...,0]-f[...,1]),200*(f[...,1]-f[...,2])],-1)
for k,f in M.items():
    im=Image.open(SRC+f).convert('RGBA')
    if im.getpixel((2,2))[3]==0: im=im.crop(im.getbbox())
    im=im.resize((N,N),Image.LANCZOS)
    a=np.asarray(im).astype(np.float64)/255;rgb=a[...,:3]
    yy,xx=np.mgrid[0:N,0:N];r=np.hypot(xx-N/2+.5,yy-N/2+.5)/(N/2)
    L=lab(rgb)
    # background reference: median Lab in annulus 0.62–0.9 among dominant cluster
    ann=(r>.6)&(r<.92)
    ab=L[...,1:][ann];med_ab=np.median(ab,axis=0)
    # pixels with chroma close to median → background (lightness free within tolerance)
    dab=np.hypot(L[...,1]-med_ab[0],L[...,2]-med_ab[1])
    medL=np.median(L[...,0][ann&(dab<12)])
    bg=(dab<14)&(np.abs(L[...,0]-medL)<28)&(r<.995)
    # reference flat colour: rgb median of bg pixels in mid annulus (least shading ~ around r .5-.7 left/right)
    ref=np.median(rgb[bg&(r>.35)&(r<.7)],axis=0)
    # nur den Hintergrund (inkl. Glanz/Schatten) auf die flache Markenfarbe setzen, Logo-Pixel bleiben unverändert
    dL=np.abs(L[...,0]-medL)
    d=dab+np.maximum(dL-40,0)*1.5
    sw=np.clip((18-d)/8,0,1)
    sw=np.maximum(sw,np.clip((r-.86)/.05,0,1)) # äußerer Ring: immer flache Farbe (dort liegt kein Logo, nur Glanz/Rand)
    sw=ndimage.gaussian_filter(sw,.6)[...,None]
    out=rgb*(1-sw)+ref*sw
    if k in ('josport','joreisen'): # Hintergrund = jö-Verlauf (wie JG_CSS), nur das Weiße bleibt
        G=[[0,'#5c3048'],[2,'#663047'],[8,'#8c3044'],[14,'#a83041'],[20,'#b93040'],[24,'#c02031'],[55,'#ef2700'],[74,'#f23e10'],[90,'#fb6321'],[96,'#ff7024']]
        u=(xx+.5)/N;v=(yy+.5)/N;tt=np.hypot((u+.184)/1.286,(v-1.236)/1.911)*100
        ps=np.array([g[0] for g in G],float);cs=np.array([[int(g[1][i:i+2],16)/255 for i in (1,3,5)] for g in G])
        grad=np.stack([np.interp(tt,ps,cs[:,c]) for c in range(3)],-1)
        chroma=np.hypot(L[...,1],L[...,2]);wl=np.clip((30-chroma)/12,0,1)*np.clip((L[...,0]-60)/15,0,1)
        wl=ndimage.gaussian_filter(wl,.6)[...,None];out=rgb*wl+grad*(1-wl)
    alpha=np.clip((1-r)*N/2+.5,0,1)  # crisp circle
    o=np.dstack([out,alpha]);Image.fromarray((o*255).astype(np.uint8)).resize((400,400),Image.LANCZOS).save(OUT+k+'.png')
    print(k,np.round(ref*255).astype(int),round(bg.mean(),2))
