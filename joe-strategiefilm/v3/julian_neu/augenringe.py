import sys, numpy as np
from PIL import Image, ImageFilter
def lift(src, dst, ells, k, prev):
    im=Image.open(src).convert('RGBA'); A=np.asarray(im).astype(float)
    rgb=A[...,:3]; H,W=rgb.shape[:2]; yy,xx=np.mgrid[0:H,0:W]
    m=np.zeros((H,W))
    for cx,cy,rx,ry in ells: m=np.maximum(m,np.clip(1-((xx-cx)/rx)**2-((yy-cy)/ry)**2,0,1))
    m=np.asarray(Image.fromarray((m*255).astype('uint8')).filter(ImageFilter.GaussianBlur(max(2,ells[0][3]*.5))),float)/255
    # Referenz: stark weichgezeichnete Haut (dunkle Details verschwinden), etwas aufgehellt
    ref=np.asarray(Image.fromarray(rgb.astype('uint8')).filter(ImageFilter.GaussianBlur(ells[0][2]*.9)),float)*1.06
    L=lambda c: c@[.299,.587,.114]
    d=np.clip(L(ref)-L(rgb),0,None)[...,None]          # nur aufhellen, wo es dunkler als die Umgebung ist
    out=rgb+m[...,None]*k*np.minimum(d,60)*np.array([1.0,.97,.93])
    A[...,:3]=np.clip(out,0,255); r=Image.fromarray(A.astype('uint8'),'RGBA')
    r.save(dst,quality=90,method=6)
    x0=int(min(e[0]-e[2]*2 for e in ells)); x1=int(max(e[0]+e[2]*2 for e in ells)); y0=int(min(e[1]-e[3]*5 for e in ells)); y1=int(max(e[1]+e[3]*4 for e in ells))
    a=Image.open(src).convert('RGB').crop((x0,y0,x1,y1)); b=Image.open(dst).convert('RGB').crop((x0,y0,x1,y1))
    f=600/a.size[0]; a=a.resize((600,int(a.size[1]*f))); b=b.resize(a.size)
    c=Image.new('RGB',(600,a.size[1]*2+6),(255,255,255)); c.paste(a,(0,0)); c.paste(b,(0,a.size[1]+6)); c.save(prev)
lift('julian_neu/julian_frei_vorher.webp','julian_neu/julian_frei.webp',[(410,263,30,9),(501,260,30,9)],float(sys.argv[1]),sys.argv[3]+'/eyes_j.png')
lift('julian_neu/julian_avatar_vorher.webp','julian_neu/julian_avatar.webp',[(131,145,19,6),(187,143,19,6)],float(sys.argv[2]),sys.argv[3]+'/eyes_a.png')
