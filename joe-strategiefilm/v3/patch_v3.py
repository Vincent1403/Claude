"""Baut aus der Kopie des Markenfilms den Partnerfilm (runder Story-Bogen, ca. 91 s).

Liest index_markenfilm.html (unveränderte Kopie von „jö Video · Timeline“) und schreibt index.html
sowie timeline_partnerfilm.json (Stand für die Datenbank der Seite).

Bogen: Intro + Vision → 01 Ganz persönlich → 02 Digitaler Begleiter → 03 Integration der Partner
(mit zwei Unter-Headlines) → Schluss: Logo wird App-Icon, Vision noch einmal (schließt den Kreis).
Jede Kapitel-Tafel steht vor den Szenen, die sie belegen. Blöcke sind um ganze Takte verschoben,
damit Schnitte auf der Musik bleiben.
"""
import pathlib, json, base64, re

here = pathlib.Path(__file__).parent
s = (here / "index_markenfilm.html").read_text(encoding="utf-8")


def rep(a, b, count=1):
    global s
    n = s.count(a)
    assert n == count, f"{n}x gefunden: {a[:90]}"
    s = s.replace(a, b)


BARL = 2.28583                  # Taktlänge
BEAT = 13.725 / 24
bars = lambda t, n: round(t + n * BARL, 4)   # Szene aus dem Markenfilm um n Takte verschieben

# ---------- Zeitplan ----------
OFF = 3                         # alles ab Julian liegt 3 Takte später als in der Kapitel-Fassung („Menschen“ + „Mach dein Jö draus!“)
PEOPLE_LEN = round(12 * BEAT, 4)              # vier Personen à 3 Schläge, beginnt auf dem Drop
WE = 14.95                      # Design-Ende des Story-Abschnitts: zweiter Story-Block (Share, Sammeln & Sparen, Wocheneinkauf) läuft ganz durch
WR0 = round(4.8333 + 13 * BARL, 4)           # Julian beginnt nach „Alles in einer App“ (gleiche Lage im Takt wie im Markenfilm)
RABATT = bars(45.763, -11)      # Kian nach „Mach dein Jö draus!“
WR1 = round(WR0 + 11.2145 / (11.5 - 4.8333) * (WE - 4.8333), 4)  # gleiche Dehnung wie bisher (Stories etwas ruhiger als im Markenfilm)
CLOUD_A = round(RABATT + 3.0427, 4)          # wie im Markenfilm: Wolke startet auf dem letzten Kian-Bild
CLOUD_END = round(CLOUD_A + 8.3843, 4)      # Wolke + Tamara wie im Markenfilm, endet auf der Takt-Eins
BOX = bars(24.5417, 9)          # Sammelpass nach Julian + Stories
PARTNER = bars(27.6013, 8 + OFF)   # Einflug auf einem Akzent der Musik
BRAND = round(PARTNER + 4.482, 4)
BRAND_LEN = round(4.375 + BARL, 4)           # Lockups einen Takt länger (ruhiger)
FULL = round(PARTNER + 8.857 + BARL, 4)
COLORS = bars(16.6281, 22 + OFF)
DEAL = round(COLORS + 3.4313, 4)
PROD = bars(43.49, 14 + OFF)
CITY = bars(57.19, 10 + OFF)
BILL = round(CITY + 3.293, 4)
AU_BASS = 91.4537
AU_CUT = round(AU_BASS - (2 - OFF) * BARL, 4)  # ab OFF = 2 liegt der Punkt hinter dem Bass: der Track läuft ohne Sprung bis zum Ende
LOGO_LAND = 1.33                              # Punkte landen 1,33 s nach Clipstart (Logo-Animation, Standardwerte)
LOGO2 = round(AU_CUT - LOGO_LAND, 4)
END = round(AU_CUT + (96.05 - AU_BASS), 2)   # Rest des Tracks nach dem Sprung

C = lambda st, ln, i=0: dict(start=round(st, 4), len=round(ln, 4), **{"in": i})
CLIPS = {
    "hl1": C(0, 2.35),
    "logo": C(2.35, 2.4833, .475),
    "c2": C(4.8333, 2.5881),                     # Länge = Frame 378 bis Start „Menschen“ (wird unten gesetzt)             # „Das neue Jö.“
    "people": C(9.195, PEOPLE_LEN),              # Lena, Renate, Sarah, Jonas – Drehung auf dem Drop
    "c3": C(9.195 + PEOPLE_LEN, bars(45.763, -12) - 9.195 - PEOPLE_LEN),  # „Mit Möglichkeiten für jeden Einzelnen.“
    "pers": C(bars(45.763, -12), BARL),         # „Persönlich. Relevant. Ganz nach dir.“ (ein Takt, schnell nacheinander)
    # julian, white, story, story2, story4, grad: Design-Zeit wie im Markenfilm (Zeitdehnung WR0…WR1)
    "rabatt": C(RABATT, 3.5997),
    "cloud": C(CLOUD_A, 8.3843),                # Kian zoomt raus in die Profil-Wolke, dann „Mehr für Tamara.“
    "c4": C(CLOUD_END, WR0 - CLOUD_END),        # „Alles in einer App: einfach und bequem.“
    # danach Julian + Stories (Design-Zeit, Zeitdehnung WR0…WR1)
    "box": C(BOX, 3.5),
    "c5": C(BOX + 3.5, PARTNER - BOX - 3.5),
    "partner": C(PARTNER, 4.482),
    "brand": C(BRAND, BRAND_LEN),
    "full": C(FULL, 7.0317),
    "c6": C(FULL + 7.0317, COLORS - FULL - 7.0317),
    "colors": C(COLORS, 3.4313),
    "deal": C(DEAL, PROD - DEAL),
    "prod": C(PROD, 2.273, .634),
    "c7": C(PROD + 2.273, CITY - PROD - 2.273),
    "city": C(CITY, 3.293),
    "bill": C(BILL, 2.146),
    "c8": C(BILL + 2.146, END - BILL - 2.146),
    "logo2": C(LOGO2, END - LOGO2),
}
# Ablage: alles nach der Profil-Wolke liegt hinter dem Ende der Musik, in gleicher Reihenfolge
PARK_AT = 100.0
PARK = round(PARK_AT - CLIPS["c4"]["start"], 4)
PARKED = [k for k, v in CLIPS.items() if v["start"] >= CLIPS["c4"]["start"] - 1e-6]
for k in PARKED:
    CLIPS[k]["start"] = round(CLIPS[k]["start"] + PARK, 4)
WR0_REAL = round(WR0 + PARK, 4)
CLIPS["slot"] = C(CLOUD_END, 2 * BARL)        # „Dein jö“: Namen rollen neben dem App-Icon, direkt nach der Profil-Wolke
CLIPS["badges"] = C(40.078, 17.5 * BEAT)        # je Element 1 Schlag; jö-Kreis und letztes Etikett doppelt, Angebotskarte dreifach
CLIPS["wall"] = C(round(40.078 + 17.5 * BEAT, 4), 16 * BEAT)
_wk = (WR1 - WR0) / (WE - 4.8333)
WALL_END = round(CLIPS["wall"]["start"] + CLIPS["wall"]["len"], 4)
CLIPS["tags"] = C(WALL_END, round(10 * BEAT, 4))     # Tag-System direkt nach der Angebots-Wand, danach harter Schnitt auf die Stories
STORY_AT = round(WALL_END + 10 * BEAT, 4)               # Stories starten mit dem Schnitt
WR0_REAL = round(STORY_AT - (8.196 - 4.8333) * _wk, 4)  # Story-Block (Design-Zeit) so verschoben
CLIPS["showcase"] = C(167.0, 8.47)          # Icon-Showcase: in der Ablage hinter dem Schluss
T_LEN = 190                                    # Timeline länger als der Track (96 s)
# Intro: vier Headlines vor dem Logo. Musik und alles ab dem Logo rücken um INTRO_D nach hinten (Beat-Sync bleibt).
INTRO_HL = [("hl1", 4.2), ("hl1b", 3.8), ("hl1c", 3.5), ("hl1d", 4.6)]   # Länge je Headline in Schlägen
INTRO_D = round(sum(l for _, l in INTRO_HL) * BEAT - 2.35, 4)          # alte Headline lief 0–2,35 s

# Szenen, die im Partnerfilm entfallen (zweite Story-Gruppe, verdeckte Headline 3, Agentur-Endcard)
DROP = ["hl3", "endc"]

# Parameter, die vom Markenfilm abweichen
PARAMS = {
    "julian": {"sStart": 2.0, "pause": .3},   # Hallo Julian / 100 Ös / Einlösen stehen länger, der Slider startet später
    "partner": {"hit": 2.5, "popGap": 99, "end": 12, "spread": 1.15},   # Einflug nach dem Logo-Wechsel, kein Verlauf-Flut
    "white2": {"edge": 1925},   # Flieder-Fläche erst mit dem Slider sichtbar (vorher Kante rechts außerhalb des Bildes)
    "story": {"holdA": 1.4},    # Stories stehen länger, damit die eingeflogenen Tags lesbar bleiben
    "story2": {"hold1": 1.4},
    "brand": {"step": .71},          # jede Partnerfarbe steht länger (füllt genau einen Takt mehr)
}

# ---------- 1. Zeitdehnung frei wählbar ----------
rep("const WA=4.8333,WB=13.769;\nfunction warpK(){const c=S.clips.colors;return c?Math.max(.2,(c.start-WA)/(WB-WA)):1}\n"
    "function wDesign(t){const c=S.clips.colors,B=c?c.start:WB,k=warpK();return t<=WA?t:t<=B?WA+(t-WA)/k:t-(B-WB)} // echte Zeit → Design-Zeit\n"
    "function wReal(x){const c=S.clips.colors,B=c?c.start:WB,k=warpK();return x<=WA?x:x<=WB?WA+(x-WA)*k:x+(B-WB)} // Design-Zeit → echte Zeit\n"
    "const isPre=k=>k==='grad'||(S.clips[k]&&S.clips[k].start<WB-1e-3&&S.clips[k].start+S.clips[k].len>WA+1e-3);",
    f"const WA=4.8333,WB={WE},WSPAN={round(WR1 - WR0, 4)}; // Partnerfilm: Design-Abschnitt WA…WB (Julian + Stories) läuft ab S.warp.r0, als Block verschiebbar\n"
    "function warpK(){return Math.max(.2,WSPAN/(WB-WA))}\n"
    f"const WPD={INTRO_D};\n"
    "function wDesign(t){const k=warpK(),r0=S.warp.r0;return t<=WA+WPD?t*WA/(WA+WPD):t<r0?1e6:t<=r0+WSPAN?WA+(t-r0)/k:t-r0-WSPAN+WB} // echte Zeit → Design-Zeit (vor dem Block: nichts davon sichtbar)\n"
    "function wReal(x){const k=warpK(),r0=S.warp.r0;return x<WA?x*(WA+WPD)/WA:x<=WB?r0+(x-WA)*k:x-WB+r0+WSPAN} // Design-Zeit → echte Zeit\n"
    "const PRE=new Set(['grad','white','story','story2','story4','story3','story5','story6']);\n"
    "const isPre=k=>PRE.has(k);")

# ---------- 2. Abhängigkeiten, die die alte Reihenfolge voraussetzen ----------
old_tb = "const tb=(view==='main'&&S.clips.box&&FM.box)?mT-S.clips.box.start:-1"
rep(old_tb, "const tb=(view==='main'&&S.clips.box&&FM.box&&S.clips.deal&&S.clips.box.start>S.clips.deal.start)?mT-S.clips.box.start:-1", count=2)
rep("BXL.style.background=(view==='main'&&((S.clips.deal&&mT<S.clips.deal.start+S.clips.deal.len)||(S.clips.partner&&mT>=S.clips.partner.start)))?'transparent':'#f4f1ea';",
    "{const bc=S.clips.box,dc=S.clips.deal,pc=S.clips.partner;BXL.style.background=(view==='main'&&bc&&((dc&&dc.start<bc.start&&mT<dc.start+dc.len)||(pc&&pc.start>bc.start&&pc.start<bc.start+bc.len&&mT>=pc.start)))?'transparent':'#f4f1ea'};")

# ---------- 3. Eine Szene darf zweimal auf der Timeline liegen (gleiche Ebene, eigener Clip) ----------
rep("  for(const k in COMPS){const pre=isPre(k),t=pre?tD:tR,c=S.clips[k],on=clipOn(c,t);COMPS[k].show(on);if(!on)continue;",
    "  const ON={};for(const k in COMPS){const pre=isPre(k);ON[k]=clipOn(S.clips[k],pre?tD:tR)}\n"
    "  for(const k in COMPS)if(!ON[k])COMPS[k].show(false); // erst alles aus, dann ein: Doppel-Clips teilen sich eine Ebene\n"
    "  for(const k in COMPS){const pre=isPre(k),t=pre?tD:tR,c=S.clips[k],on=ON[k];if(!on)continue;COMPS[k].show(true);")

# ---------- 4. Musik und Länge ----------
rep("const AU_BASS=91.4537,AU_CUT=64.0237,AU_XF=.004;", f"const AU_BASS=91.4537,AU_CUT={AU_CUT},AU_XF=.004;")
rep("const T_MAIN=95, FPS=24;", f"const T_MAIN={T_LEN}, FPS=24, TRACK_LEN=187.48;")  # Track mit Schleife (s. AU_LA/AU_LB)
# Beat- und Taktraster laufen hinter dem Track weiter, damit in der Ablage gesnappt und synchronisiert werden kann
rep("const MUSIC_SNAPS=[0,2.35,5.32,8.64,...BEATS];",
    "const AU_LA=45.732,AU_LB=91.4456,AU_LN=2,AU_LL=AU_LB-AU_LA; // Musik-Schleife: ab dem Bass-Einsatz (Takt 37) springt der Track zurück auf den Break (Takt 17) – Break + zweite Hälfte laufen zweimal extra, ~187 s\n"
    "{const bt=(BEATS[BEATS.length-1]-BEATS[BEATS.length-41])/40;while(BEATS[BEATS.length-1]+bt<AU_LB-.05)BEATS.push(+(BEATS[BEATS.length-1]+bt).toFixed(3));"
    "const mid=BEATS.filter(v=>v>=AU_LA-.01&&v<AU_LB-.05);for(let k=1;k<=AU_LN;k++)BEATS.push(...mid.map(v=>+(v+k*AU_LL).toFixed(3)));"
    "BAR.length=0;for(let i=0;i*4<BEATS.length;i++)BAR.push(+BEATS[i*4].toFixed(2));"
    "const per=96.0522/PEAKS.length,ia=Math.round(AU_LA/per),ib=Math.round(AU_LB/per),seg=PEAKS.slice(ia,ib),tail=PEAKS.splice(ib);for(let k=0;k<AU_LN;k++)PEAKS.push(...seg);PEAKS.push(...tail)}\n"
    "const AU_OFF=0; // Musik startet bei Frame 0; das Intro dauert genau 3 Takte länger, das Logo liegt auf dem Drop (alles danach bleibt im Takt)\n"
    "{const bt=(BEATS[BEATS.length-1]-BEATS[BEATS.length-41])/40;while(BEATS[BEATS.length-1]+bt<T_MAIN)BEATS.push(+(BEATS[BEATS.length-1]+bt).toFixed(3));"
    "const br=bt*4;while(BAR[BAR.length-1]+br<T_MAIN)BAR.push(+(BAR[BAR.length-1]+br).toFixed(2))} // Raster über das Ende der Musik hinaus (Ablage)\n"
    "const MUSIC_SNAPS=[0,...[2.35,5.32,8.64].map(v=>v+AU_OFF),...BEATS];")
# Verlauf-Clip: Intro und Julian-Block als zwei Balken zeichnen, wenn dazwischen eine Lücke ist
rep("ge.style.left=wReal(g.start)*pps+'px';ge.style.width=Math.max(12,(wReal(g.start+g.len)-wReal(g.start))*pps)+'px';ge.classList.toggle('sel',sel==='grad');",
    "{const a=wReal(g.start),gap=S.warp.r0>WA+.01,e1=gap?WA:wReal(g.start+g.len);ge.style.left=a*pps+'px';ge.style.width=Math.max(12,(e1-a)*pps)+'px';"
    "let g2=$('clip_grad2');if(!g2){g2=document.createElement('div');g2.id='clip_grad2';g2.className='clip grad';g2.style.pointerEvents='none';g2.innerHTML='<span>Verlauf (Julian)</span>';$('laneV1').appendChild(g2)}"
    "g2.style.display=gap?'':'none';if(gap){const b0=S.warp.r0,b1=wReal(g.start+g.len);g2.style.left=b0*pps+'px';g2.style.width=Math.max(12,(b1-b0)*pps)+'px'}}"
    "ge.classList.toggle('sel',sel==='grad');")
# Tamara: ohne „Digitale Rechnung“ und „Gesammelte Ös“, nur „+25 Ös“ bleibt
rep("$('stage').appendChild(VDL);", "$('stage').appendChild(VDL);\n{const st=document.createElement('style');st.textContent='#vdPay,#vdSum{display:none!important}';document.head.appendChild(st)} // Partnerfilm: nur „+25 Ös“")
# Wellenform nur so lang wie der Track
rep("const per=c.width/PEAKS.length;PEAKS.forEach((p,i)=>{const h=Math.max(1,p*H*.95);x.fillRect(i*per,", "const per=c.width*Math.min(1,TRACK_LEN/T_MAIN)/PEAKS.length,o0=c.width*AU_OFF/T_MAIN;PEAKS.forEach((p,i)=>{const h=Math.max(1,p*H*.95);x.fillRect(o0+i*per,")
rep("if(!abuf||mT>=abuf.duration)return;", "if(!abuf||mT-AU_OFF>=abuf.duration)return;")
rep("asrc.start(0,mT)}", "asrc.start(mT<AU_OFF?actx.currentTime+AU_OFF-mT:0,Math.max(0,mT-AU_OFF))}")
# Julian + Stories als Block ziehen (verschiebt S.warp.r0), Stand wird mit gespeichert
rep("const trim=e.target.dataset.trim||'',x0=e.clientX,c0={...S.clips[key]};",
    "const trim=e.target.dataset.trim||'',x0=e.clientX,c0={...S.clips[key]},r00=S.warp.r0,blk=PRE.has(key)&&key!=='grad';")
rep("      else{const offs=COMPS[key]?[0,FM[key].key-c0.in]:[0];",
    "      else if(blk){S.warp.r0=+Math.max(WA,snapTime(r00+dt,[0],ev.shiftKey,key)).toFixed(4)} // Julian + Stories wandern gemeinsam\n"
    "      else{const offs=COMPS[key]?[0,FM[key].key-c0.in]:[0];")
rep("const c=S.clips[key];if(c0.start!==c.start||c0.len!==c.len||c0.in!==c.in)saveTl();info()};",
    "const c=S.clips[key];if(c0.start!==c.start||c0.len!==c.len||c0.in!==c.in||r00!==S.warp.r0)saveTl();info()};")
rep("const d={clips:cl,grad:S.grad};", "const d={clips:cl,grad:S.grad,warp:S.warp};")
rep("function applyTl(d){if(!d||!d.clips)return;", "function applyTl(d){if(!d||!d.clips)return;if(d.warp&&typeof d.warp.r0==='number')S.warp={...S.warp,...d.warp};")
chap = [(0, "Intro"), (4.8333, "01 Ganz persönlich"), (PARK_AT, "Ablage: 02 Digitaler Begleiter"),
        (CLIPS["c5"]["start"], "03 Partner"), (CLIPS["c8"]["start"], "Schluss")]
rep("const CHAPTERS=[[0,'Logo'],[BAR[1],'Neuausrichtung'],[BAR[4],'Menschen'],[BAR[16],'Bento-Box'],[BAR[21],'Partner'],[BAR[32],'Endcard']];",
    "const CHAPTERS=" + json.dumps([[round(a, 3), b] for a, b in chap], ensure_ascii=False) + ";")

# ---------- 5. Tafeln: kleine Zeile darüber (Kapitel), frei positionierbar ----------
rep("  $('stage').appendChild(L);const W=[...L.querySelectorAll('.hlw')],box=L.querySelector('.hlBox'),scr=L.querySelector('.hlScrim');",
    "  if(o.kicker)L.insertAdjacentHTML('beforeend',`<div class=\"hlKick\" style=\"position:absolute;left:0;right:0;top:${o.top-86}px;text-align:center;color:${o.kc||o.color};font-size:42px;font-weight:700;letter-spacing:-.005em;opacity:0\">${o.kicker}</div>`);\n"
    "  $('stage').appendChild(L);const W=[...L.querySelectorAll('.hlw')],box=L.querySelector('.hlBox'),scr=L.querySelector('.hlScrim'),kk=L.querySelector('.hlKick');")
rep("      if(scr)scr.style.opacity=(eOut(seg(t,0,P.inAt*b+.25))*(1-eIO(seg(t,P.outAt*b,P.outAt*b+.45)))).toFixed(3)},",
    "      if(scr)scr.style.opacity=(eOut(seg(t,0,P.inAt*b+.25))*(1-eIO(seg(t,P.outAt*b,P.outAt*b+.45)))).toFixed(3);\n"
    "      if(kk){const p=eExpo(seg(t,Math.max(0,P.inAt*b-.35),P.inAt*b+.25)),q=eInCub(seg(t,P.outAt*b,P.outAt*b+.3));kk.style.opacity=(p*(1-q)).toFixed(3);kk.style.transform=`translateY(${((1-p)*24).toFixed(1)}px)`}},")

BEIGE, BURG, MUTED = "'#f4f1ea'", "#670003", "#9a4a40"
GRAD = ("'radial-gradient(45% 70% at 0% 100%,#b23336 0%,rgba(178,51,54,0) 100%),linear-gradient(95deg,#c4382b 0%,#cf3a25 18%,"
        "#db3e22 36%,#de4626 52%,#e05530 68%,#e86a37 84%,#ee793c 96%,#ee793c 100%)'")


def card(key, name, lines, size, bg, color, kicker=None, kc=None, step=.5, inAt=.5, hi="JG_TXT", top=None, out=True):
    n, dur = len(lines), CLIPS[key]["len"]
    lh = round(size * 1.12) + round(size * .12)
    top = top if top is not None else round(540 - n * lh / 2 + (30 if kicker else 0))
    lenb = round(dur / BEAT, 3)
    outb = round(lenb - .85, 3) if out else round(lenb + 4, 3)
    o = f"{{size:{size},top:{top},color:'{color}',bg:{bg},hi:{hi},step:{step},inAt:{inAt},outAt:{outb},len:{lenb},cls:'logo'"
    if kicker:
        o += f",kicker:'{kicker}',kc:'{kc or color}'"
    o += f",note:'Tafel des Partnerfilms ({name}).'}}"
    return f"const {key.upper()}=makeHL('{key}','{name}','laneV2',{json.dumps(lines, ensure_ascii=False)},\n  {o});\n"


CARDS = ["c2", "c3", "c4", "c5", "c6", "c7", "c8"]
cards = (
    card("c2", "Das neue Jö", ["Das *neue Jö."], 150, BEIGE, BURG, step=.75, inAt=0)
    + card("c3", "Mit Möglichkeiten für jeden Einzelnen", ["Mit Möglichkeiten", "für jeden *Einzelnen."], 150, BEIGE, BURG, step=.25, inAt=.25)
    + card("c4", "02 Digitaler Begleiter", ["Alles in einer App:", "*einfach und *bequem."], 150, BEIGE, BURG, step=.25, inAt=.25)
    + card("c5", "03 Integration der Partner", ["Wir bringen eure Marke", "dorthin, wo sie *wirkt."], 150, BEIGE, BURG, step=.375, inAt=.5)
    + card("c6", "03 Unter-Headline Look", ["Eure Angebote", "im neuen jö *Look."], 150, BEIGE, BURG, step=.25, inAt=.25)
    + card("c7", "03 Unter-Headline Sichtbarkeit", ["Sichtbar, wo eure", "*Kund:innen sind."], 150, BEIGE, BURG, step=.25, inAt=.25)
    + card("c8", "Schluss Vision", ["Begeisterung. Täglich. Für alle."], 76, GRAD, "#fff", step=.5,
           inAt=round((LOGO2 - CLIPS['c8']['start'] + 3.1) / BEAT, 2), hi="'#fff'", top=880, out=False)
)
anchor = "const HL3=makeHL('hl3'"
rep(anchor, cards + anchor)

# ---------- 5b. Neue Szene „Menschen“ (people_comp.js) nach „Partner Vollbild“ ----------
def wl_imgs(txt):  # Fotos der Angebots-Wand: __WL:name__ -> wall_img/web/name.webp
    return re.sub(r"__WL:(\w+)__", lambda m: "data:image/webp;base64," + base64.b64encode((here / "wall_img" / "web" / (m.group(1) + ".webp")).read_bytes()).decode(), txt)
rep("/* =====================================================================\n   COMP: APP-VIDEO", (here / "people_comp.js").read_text(encoding="utf-8") + "\n" + (here / "slot_comp.js").read_text(encoding="utf-8") + "\n" + ((here / "badge_comp.js").read_text(encoding="utf-8") + "\n" + wl_imgs((here / "wall_comp.js").read_text(encoding="utf-8"))).replace("__BD_IMG__", "data:image/webp;base64," + base64.b64encode((here / "angebot_bild.webp").read_bytes()).decode()) + "\n/* =====================================================================\n   COMP: APP-VIDEO")

# ---------- 5c. Tag-System → Stories (tags_comp.js); Story-Pills nutzen die Tag-Formen ----------
rep("const stStar=", (here / "tag_shapes.js").read_text(encoding="utf-8") + "const stStar=")
rep("const stPill=(bg,fg)=>`<div style=\"position:absolute;left:0;top:0;width:268px;height:98px;border-radius:20px;background:${bg};display:flex;align-items:center;gap:44px;padding-left:44px;box-sizing:border-box;color:${fg};font-size:44px;font-weight:800\">${stStar(fg)}<span>Neu</span></div>`;",
    "const stPill=(bg,fg,sh='sq',lab='Neu')=>`<div style=\"position:absolute;left:0;top:0;height:98px;border-radius:21.6px;background:${bg};display:flex;align-items:center;gap:20px;padding:0 33px;box-sizing:border-box;white-space:nowrap;color:${fg};font-size:52px;font-weight:700;letter-spacing:-.01em;line-height:1\">${tgSvg(sh,46)}<span>${lab}</span></div>`; // Pill im Tag-System: Form + Label")
rep("${stPill(ST_RED,'#fff')}", "${stPill(ST_RED,'#fff','di','Neu')}")
rep("<div id=\"s4Pill\" style=\"position:absolute;left:95px;top:95px;width:268px;height:98px\">${stPill('#fff','#ea3a10')}", "<div id=\"s4Pill\" style=\"position:absolute;left:95px;top:95px;width:268px;height:98px\">${stPill('#fff','#ea3a10','ci','Aktion')}")
i = s.index("const S2_ST=[{n:'Sport',ico:'sport',w:272,"); j = s.index("];", i) + 2
s = s[:i] + "const S2_ST=[{n:'Letzte Chance',ico:'hg',w:420,lines:['Exklusive','Sportdeals','entdecken!']},{n:'Games',ico:'x',w:300,lines:['Spielen &','Gewinnen']},{n:'Neu',ico:'hex',w:240,lines:['Neu Angebote','entdecken!']}]; // Pills im Tag-System; Breiten werden gemessen" + s[j:]
rep('<div class="s2PillIn" style="position:absolute;left:0;top:0;height:98px;display:flex;align-items:center;gap:22px;padding-left:40px;color:#fff;font-size:44px;font-weight:700;white-space:nowrap">',
    '<div class="s2PillIn" style="position:absolute;left:0;top:0;height:98px;display:flex;align-items:center;gap:20px;padding-left:33px;color:#fff;font-size:52px;font-weight:700;letter-spacing:-.01em;line-height:1;white-space:nowrap">')
rep("<div id=\"s3Pill\" style=\"position:absolute;left:95px;top:95px;width:268px;height:98px\">${stPill(ST_OR,'#fff')}", "<div id=\"s3Pill\" style=\"position:absolute;left:95px;top:95px;width:268px;height:98px\">${stPill(ST_OR,'#fff','hex','Neu')}")
rep("<div id=\"s6Neu\" style=\"position:absolute;left:95px;top:95px;width:268px;height:98px\">${stPill('#fff','#ea3a10')}", "<div id=\"s6Neu\" style=\"position:absolute;left:95px;top:95px;width:268px;height:98px\">${stPill('#fff','#ea3a10','hg','Letzte Chance')}")
rep('<div id="s5Pill" style="position:absolute;left:79px;top:95px;height:98px;width:302px;border-radius:20px;background:${ST_OR};display:flex;align-items:center;gap:30px;padding-left:44px;box-sizing:border-box;color:#fff;font-size:44px;font-weight:800"><svg viewBox="0 0 24 24" style="width:48px;height:48px"><circle cx="12" cy="12" r="7.6" fill="none" stroke="#fff" stroke-width="4.4"/></svg>Deals',
    '<div id="s5Pill" style="position:absolute;left:79px;top:95px;height:98px;border-radius:21.6px;background:${ST_OR};display:flex;align-items:center;gap:20px;padding:0 33px;box-sizing:border-box;white-space:nowrap;color:#fff;font-size:52px;font-weight:700;letter-spacing:-.01em;line-height:1">${tgSvg(\'ci\',46)}Aktion')
rep("${s2Ico[s.ico]}", "${tgSvg(s.ico,46)}")
rep("    let pw=S2_ST[0].w;", "    if(!S2_ST._m&&E.pin[0].offsetWidth){S2_ST.forEach((s,i)=>s.w=E.pin[i].offsetWidth+33);S2_ST._m=1}\n    let pw=S2_ST[0].w;")
rep("const WHL=document.createElement('div');WHL.id='whiteL'", (here / "tags_comp.js").read_text(encoding="utf-8") + "\nconst WHL=document.createElement('div');WHL.id='whiteL'")

# ---------- 5d. Icon-Showcase (showcase_comp.js), Icons als Inline-SVG ----------
def sc_icons(txt):
    return re.sub(r"__ICON:(\w+)__", lambda m: (here / "icons" / (m.group(1) + ".svg")).read_text(encoding="utf-8").replace('width="200" height="200" ', 'width="100%" height="100%" style="display:block;overflow:visible" ').replace("\n", "").replace("'", "&#39;"), txt)
rep("const WHL=document.createElement('div');WHL.id='whiteL'", sc_icons((here / "showcase_comp.js").read_text(encoding="utf-8")) + "\nconst WHL=document.createElement('div');WHL.id='whiteL'")
rep("let xb=1920;if(view==='main'&&S.clips.julian&&FM.julian)", "let xb=WH_J?1920:0;if(view==='main'&&WH_J&&S.clips.julian&&FM.julian)")  # Stories: Beige sofort; Julian: Kante folgt dem Scroll
rep("if(view==='main'&&S.clips.julian&&FM.julian){const J=FM.julian,c=S.clips.julian,u=mT", "if(view==='main'&&WH_J&&S.clips.julian&&FM.julian){const J=FM.julian,c=S.clips.julian,u=mT")
rep("const WHITE={", "let WH_J=false; // true, solange die Weiße Fläche für Julian rendert (zweiter Clip „white2“)\nconst WHITE={")
rep("function stEntry(){", "function stEntry(){return 0; // Partnerfilm: Julian liegt nach dem Logo, die Stories fahren nicht mehr mit seinem Scroll ein\n  ")
rep("let sel='julian';", "let sel='tags';")
rep("const gOn=clipOn(g,tD);$('bg').style.display=gOn?'':'none';", "const jOn=S.clips.julian&&clipOn(S.clips.julian,tR),gOn=clipOn(g,tD)||jOn;$('bg').style.display=gOn?'':'none';$('bg').style.background=(tR<WA+WPD||jOn)?JG_CSS:''; // Intro (Headline + Logo) im jö-Verlauf wie „Dein jö“")
# ---------- 5e. Intro: vier Headlines statt „Eine Marke mitten im Leben.“ ----------
rep("const HL1=makeHL('hl1','Headline 1','laneV3',['Eine Marke mitten im Leben.'],\n  {size:120,top:470,color:'#fff',step:.4,inAt:.25,outAt:3.4,len:4.1,",
    "const HL1=makeHL('hl1','Headline 1a','laneV3',['Eine Marke für das','alltägliche Leben.'],\n  {size:150,top:354,color:'#fff',step:.3,inAt:.25,outAt:3.6,len:4.2,")
rep("const HL2=makeHL('hl2',",
    "const HL1B=makeHL('hl1b','Headline 1b','laneV2',['Das Leben ist','voller Möglichkeiten.'],{size:150,top:354,color:'#fff',step:.3,inAt:.25,outAt:3.2,len:3.8,shadow:1,note:'Intro, zweite Zeile.'});\n"
    "const HL1C=makeHL('hl1c','Headline 1c','laneV3',['Und jeden Tag anders.'],{size:150,top:447,color:'#fff',step:.35,inAt:.25,outAt:2.9,len:3.5,shadow:1,note:'Intro, dritte Zeile.'});\n"
    "const HL1D=makeHL('hl1d','Headline 1d','laneV2',['Zeit für eine Marke,','die all das verbindet.'],{size:150,top:354,color:'#fff',step:.3,inAt:.25,outAt:4.0,len:4.6,shadow:1,note:'Intro, vierte Zeile; danach baut sich das Logo auf.'});\n"
    "const HL2=makeHL('hl2',")
# ---------- 5f. Hintergrundvideos der Intro-Headlines (introvid_comp.js) ----------
rep("const WHL=document.createElement('div');WHL.id='whiteL'", (here / "introvid_comp.js").read_text(encoding="utf-8") + "\n" + (here / "fuer_comp.js").read_text(encoding="utf-8").replace("__KIAN0__", "data:image/webp;base64," + base64.b64encode((here / "kian0.webp").read_bytes()).decode()).replace("__TAM0__", "data:image/webp;base64," + base64.b64encode((here / "tamara0.webp").read_bytes()).decode()) + "\n" + (here / "pers_comp.js").read_text(encoding="utf-8") + "\nconst WHL=document.createElement('div');WHL.id='whiteL'")
i0 = s.index("function spliceAudio(){"); i1 = s.index("abufAt=T;return out}", i0) + len("abufAt=T;return out}")
s = s[:i0] + ("function spliceAudio(){if(!abuf0)return null;if(abufAt==='loop'&&abuf)return abuf; // Track mit Schleife: [0,LB) + LN × [LA,LB) + [LB,Ende)\n"
  "  const sr=abuf0.sampleRate,a=Math.round(AU_LA*sr),b=Math.round(AU_LB*sr),L=b-a,n=abuf0.length+AU_LN*L,xf=Math.round(.006*sr);\n"
  "  const out=actx.createBuffer(abuf0.numberOfChannels,n,sr);\n"
  "  for(let ch=0;ch<abuf0.numberOfChannels;ch++){const src=abuf0.getChannelData(ch),dst=out.getChannelData(ch);dst.set(src.subarray(0,b));\n"
  "    for(let k=0;k<=AU_LN;k++){const o=b+k*L;if(k<AU_LN)dst.set(src.subarray(a,b),o);else dst.set(src.subarray(b),o);\n"
  "      for(let i=0;i<xf;i++){const w=i/xf,from=src[b+i]??0,to=k<AU_LN?src[a+i]:src[b+i];dst[o+i]=to*w+from*(1-w)}}} // kurzer Crossfade an jeder Naht\n"
  "  abufAt='loop';return out}") + s[i1:]
rep("window.__t={mSeek,", "window.__t={BEATS,BAR,PEAKS,ensureAudio,spliceAudio:()=>spliceAudio(),mSeek,")
# ---------- 6. Doppel-Clip: Logo am Schluss ----------
aliases = ("const LOGO2=Object.assign(Object.create(LOGO),{key:'logo2',name:'Logo (Schluss)'});\n"
           + (here / "partner_mod.js").read_text(encoding="utf-8") + "\n"
           + (here / "cloud_mod.js").read_text(encoding="utf-8") + "\n"
           "const WHITE2=Object.assign(Object.create(WHITE),{key:'white2',name:'Weiße Fläche (Julian)',render(M,t){WH_J=true;try{WHITE.render.call(this,M,t)}finally{WH_J=false}}});\n")
old_comps = s[s.index("const COMPS={"):s.index("};", s.index("const COMPS={")) + 2]
keys = [kv.split(":")[0] for kv in old_comps[len("const COMPS={"):-2].split(",")]
assert all(k in keys for k in DROP), keys
body = ",".join(kv for kv in old_comps[len("const COMPS={"):-2].split(",") if kv.split(":")[0] not in DROP)
new_comps = ("const COMPS={" + ",".join(f"{k}:{k.upper()}" for k in CARDS) + "," + body + ",people:PEOPLE,slot:SLOT,badges:BADGES,wall:WALL,tags:TAGS,showcase:SHOWCASE,hl1b:HL1B,hl1c:HL1C,hl1d:HL1D,ivKochen:IV_KOCHEN,ivTanken:IV_TANKEN,ivBrille:IV_BRILLE,fuer:FUER,pers:PERS,system:SYSTEM,kanal:KANAL,white2:WHITE2,logo2:LOGO2};")
layers = (json.dumps(CARDS) + ".forEach(k=>$('stage').appendChild($('hl_'+k))); // Tafeln über allen Szenen\n"
          "[$('logo'),LBOX,GL].forEach(el=>$('stage').appendChild(el)); // Logo am Schluss liegt über der Verlaufs-Tafel\n")
rep(old_comps, aliases + layers + new_comps)

# ---------- 7. Ausgangs-Timeline und Parameter im Code ----------
# Intro verlängern: alles ab dem Logo um INTRO_D nach hinten, die vier Headlines davor
for k in CLIPS:
    if k != "hl1":
        CLIPS[k]["start"] = round(CLIPS[k]["start"] + INTRO_D, 4)
WR0_REAL = round(WR0_REAL + INTRO_D, 4)
_t = 0.0
for k, l in INTRO_HL:
    CLIPS[k] = C(_t, l * BEAT)
    _t += l * BEAT
# Julian (App-Icon → Karte → App-Elemente-Slider) direkt nach dem Logo; alles danach rückt 2 Takte nach hinten
JUL_AT = round(CLIPS["logo"]["start"] + CLIPS["logo"]["len"], 4)
JUL_LEN = round(2 * BARL, 4)
for k in CLIPS:
    if CLIPS[k]["start"] >= JUL_AT - 1e-3:
        CLIPS[k]["start"] = round(CLIPS[k]["start"] + JUL_LEN, 4)
WR0_REAL = round(WR0_REAL + JUL_LEN, 4)
CLIPS["julian"] = C(JUL_AT, JUL_LEN)
CLIPS["white2"] = C(JUL_AT, JUL_LEN)
_e = CLIPS["people"]["start"]                    # bisheriges Ende von „Das neue Jö.“ = Start „Menschen“
for k in CLIPS:                                    # „Das neue Jö.“ endet einen Takt früher (Frame 440): alles danach rückt 1 Takt vor
    if CLIPS[k]["start"] >= _e - 1e-3:
        CLIPS[k]["start"] = round(CLIPS[k]["start"] - BARL, 4)
WR0_REAL = round(WR0_REAL - BARL, 4)
CLIPS["c2"] = C(378 / 24, _e - BARL - 378 / 24)   # „Das neue Jö.“ Frame 378–440
FU_AT = round(_e - BARL, 4)                         # danach „Für …“ auf dem Verlauf (2 Takte), alles Weitere rückt nach hinten
for k in CLIPS:
    if k != "c2" and CLIPS[k]["start"] >= FU_AT - 1e-3:
        CLIPS[k]["start"] = round(CLIPS[k]["start"] + 4 * BARL, 4)
WR0_REAL = round(WR0_REAL + 4 * BARL, 4)
CLIPS["fuer"] = C(FU_AT, 4 * BARL)   # „Für …“ + Profil-Wolke um „Für jeden.“
PT_AT = round(CLIPS["pers"]["start"] + CLIPS["pers"]["len"], 4)   # Partner: „Viele Marken.“ → jö → „Eine starke Verbindung.“ (3 Takte)
for k in CLIPS:
    if k != "partner" and CLIPS[k]["start"] >= PT_AT - 1e-3:
        CLIPS[k]["start"] = round(CLIPS[k]["start"] + 3 * BARL, 4)
WR0_REAL = round(WR0_REAL + 3 * BARL, 4)
CLIPS["partner"] = C(PT_AT, 3 * BARL)
# „Menschen“ kommt nach „Persönlich. Relevant. Ganz nach dir.“: Reihenfolge Für … → Möglichkeiten → Persönlich → Menschen → Partner
_p0 = CLIPS["people"]["start"]
CLIPS["c3"]["start"] = _p0
CLIPS["pers"]["start"] = round(_p0 + CLIPS["c3"]["len"], 4)
CLIPS["people"]["start"] = round(CLIPS["pers"]["start"] + CLIPS["pers"]["len"], 4)
# Kian-Video + Profil-Wolke (Zoom raus aus Kian, Zoom rein in Tamara) direkt nach „Für jeden.“; Möglichkeiten … Partner rücken dahinter
_q0, _r0 = CLIPS["c3"]["start"], CLIPS["rabatt"]["start"]
_blk = round(CLIPS["cloud"]["start"] + CLIPS["cloud"]["len"] - _r0, 4)
for k in ("c3", "pers", "people", "partner"):
    CLIPS[k]["start"] = round(CLIPS[k]["start"] + _blk, 4)
CLIPS["cloud"]["start"] = round(_q0 + CLIPS["cloud"]["start"] - _r0, 4)
CLIPS["rabatt"]["start"] = _q0        # Flieder/Beige-Fläche, deren Kante dem Julian-Scroll folgt
# „Dein jö“-Slot ist durch „Für [Bild] Name.“ abgedeckt: kommt als Reserve in die Ablage; Badges, Wand, Tags und Stories rücken
# um 14 Schläge vor (schließt auch die Lücke danach), Partner läuft bis zum Start der Badges
SL_D = round(14 * BEAT, 4)
_b0 = CLIPS["badges"]["start"]
for k in CLIPS:
    if _b0 - 1e-3 <= CLIPS[k]["start"] < 100:
        CLIPS[k]["start"] = round(CLIPS[k]["start"] - SL_D, 4)
WR0_REAL = round(WR0_REAL - SL_D, 4)
CLIPS["partner"]["len"] = round(CLIPS["badges"]["start"] - CLIPS["partner"]["start"], 4)
CLIPS["slot"]["start"] = 202.0
# Marken-Lockups (jö × Partner auf Markenfarben) direkt nach „Eine starke Verbindung.“; alles danach rückt 3 Takte nach hinten
BR_AT, BR_D = CLIPS["badges"]["start"], round(12 * BEAT, 4)
for k in CLIPS:
    if BR_AT - 1e-3 <= CLIPS[k]["start"] < 100:
        CLIPS[k]["start"] = round(CLIPS[k]["start"] + BR_D, 4)
WR0_REAL = round(WR0_REAL + BR_D, 4)
CLIPS["brand"] = C(BR_AT, BR_D)
# „Ein System. Unzählige Möglichkeiten.“ nach den Lockups (2 Takte), alles danach rückt nach hinten
SY_AT = round(BR_AT + BR_D, 4)
for k in CLIPS:
    if k != "brand" and SY_AT - 1e-3 <= CLIPS[k]["start"] < 100:
        CLIPS[k]["start"] = round(CLIPS[k]["start"] + 2 * BARL, 4)
WR0_REAL = round(WR0_REAL + 2 * BARL, 4)
CLIPS["system"] = C(SY_AT, 2 * BARL)
# „Konsistent über alle Kanäle.“ nach dem Tag-System (1 Takt), danach die Stories
KA_AT = round(CLIPS["tags"]["start"] + CLIPS["tags"]["len"], 4)
for k in CLIPS:
    if KA_AT - 1e-3 <= CLIPS[k]["start"] < 100:
        CLIPS[k]["start"] = round(CLIPS[k]["start"] + BARL, 4)
WR0_REAL = round(WR0_REAL + BARL, 4)
CLIPS["kanal"] = C(KA_AT, BARL)
CLIPS["ivKochen"] = C(0, CLIPS["hl1"]["len"])   # Video „Kochen“ unter der ersten Headline
CLIPS["ivTanken"] = C(CLIPS["hl1b"]["start"], CLIPS["hl1b"]["len"])   # Video „Tanken“ unter der zweiten
CLIPS["ivBrille"] = C(CLIPS["hl1c"]["start"], CLIPS["hl1c"]["len"])   # Video „Brille“ unter der dritten
block = f"S.warp={{r0:{WR0_REAL}}};S.clips.white.len=8.7;\n" + "\n".join(f"S.clips.{k}={{start:{v['start']},len:{v['len']},in:{v['in']}}};" for k, v in CLIPS.items()) + "\n"
block += "".join(f"Object.assign(S.comps.{k}.params,{json.dumps(v)});FM.{k}=COMPS.{k}.model(S.comps.{k}.params);\n" for k, v in PARAMS.items())
rep("let db=null;const DOC_TL='jo/timeline'", block + "let db=null;const DOC_TL='jo/timeline'")

(here / "index.html").write_text(s, encoding="utf-8")

tl = json.loads((here / "timeline_markenfilm.json").read_text())
for k in DROP:
    tl["clips"].pop(k, None)
tl["clips"].update(CLIPS)
tl["warp"] = {"r0": WR0_REAL}
(here / "timeline_partnerfilm.json").write_text(json.dumps(tl, indent=1), encoding="utf-8")
print("Ende", END, "AU_CUT", AU_CUT, "Logo2", LOGO2)
for k, v in sorted(CLIPS.items(), key=lambda kv: kv[1]["start"]):
    print(f"  {k:8s} {v['start']:7.3f} – {v['start'] + v['len']:7.3f}")
