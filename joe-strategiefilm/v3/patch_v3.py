"""Baut aus der Kopie des Markenfilms den Partnerfilm (runder Story-Bogen, ca. 91 s).

Liest index_markenfilm.html (unveränderte Kopie von „jö Video · Timeline“) und schreibt index.html
sowie timeline_partnerfilm.json (Stand für die Datenbank der Seite).

Bogen: Intro + Vision → 01 Ganz persönlich → 02 Digitaler Begleiter → 03 Integration der Partner
(mit zwei Unter-Headlines) → Schluss: Logo wird App-Icon, Vision noch einmal (schließt den Kreis).
Jede Kapitel-Tafel steht vor den Szenen, die sie belegen. Blöcke sind um ganze Takte verschoben,
damit Schnitte auf der Musik bleiben.
"""
import pathlib, json

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
WE = 11.5                       # Design-Zeitpunkt, an dem auf Kian geschnitten wird (kurz bevor die Stories rausfahren)
WR0 = round(4.8333 + 13 * BARL, 4)           # Julian beginnt nach „Alles in einer App“ (gleiche Lage im Takt wie im Markenfilm)
RABATT = bars(45.763, -11)      # Kian nach „Mach dein Jö draus!“
WR1 = round(WR0 + 11.2145, 4)  # gleiche Dehnung wie bisher (Julian + Stories etwas ruhiger als im Markenfilm)
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
    "c2": C(4.8333, 9.195 - 4.8333),             # „Wie für dich gemacht.“
    "people": C(9.195, PEOPLE_LEN),              # Lena, Renate, Sarah, Jonas – Drehung auf dem Drop
    "c3": C(9.195 + PEOPLE_LEN, bars(45.763, -12) - 9.195 - PEOPLE_LEN),  # „Angebote, die zu dir passen.“
    "c9": C(bars(45.763, -12), BARL),           # „Mach dein Jö draus!“ (ein Takt)
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
CLIPS["slot"] = C(CLOUD_END, 2 * BARL)        # „Dein jö“: Namen rollen neben dem App-Icon, direkt nach der Profil-Wolke                # Julian + Stories liegen ebenfalls in der Ablage
T_LEN = 170                                    # Timeline länger als der Track (96 s)

# Szenen, die im Partnerfilm entfallen (zweite Story-Gruppe, verdeckte Headline 3, Agentur-Endcard)
DROP = ["story3", "story5", "story6", "hl3", "endc"]

# Parameter, die vom Markenfilm abweichen
PARAMS = {
    "brand": {"step": .71},          # jede Partnerfarbe steht länger (füllt genau einen Takt mehr)
}

# ---------- 1. Zeitdehnung frei wählbar ----------
rep("const WA=4.8333,WB=13.769;\nfunction warpK(){const c=S.clips.colors;return c?Math.max(.2,(c.start-WA)/(WB-WA)):1}\n"
    "function wDesign(t){const c=S.clips.colors,B=c?c.start:WB,k=warpK();return t<=WA?t:t<=B?WA+(t-WA)/k:t-(B-WB)} // echte Zeit → Design-Zeit\n"
    "function wReal(x){const c=S.clips.colors,B=c?c.start:WB,k=warpK();return x<=WA?x:x<=WB?WA+(x-WA)*k:x+(B-WB)} // Design-Zeit → echte Zeit\n"
    "const isPre=k=>k==='grad'||(S.clips[k]&&S.clips[k].start<WB-1e-3&&S.clips[k].start+S.clips[k].len>WA+1e-3);",
    f"const WA=4.8333,WB={WE},WSPAN={round(WR1 - WR0, 4)}; // Partnerfilm: Design-Abschnitt WA…WB (Julian + Stories) läuft ab S.warp.r0, als Block verschiebbar\n"
    "function warpK(){return Math.max(.2,WSPAN/(WB-WA))}\n"
    "function wDesign(t){const k=warpK(),r0=S.warp.r0;return t<=WA?t:t<r0?1e6:t<=r0+WSPAN?WA+(t-r0)/k:t-r0-WSPAN+WB} // echte Zeit → Design-Zeit (vor dem Block: nichts davon sichtbar)\n"
    "function wReal(x){const k=warpK(),r0=S.warp.r0;return x<WA?x:x<=WB?r0+(x-WA)*k:x-WB+r0+WSPAN} // Design-Zeit → echte Zeit\n"
    "const PRE=new Set(['grad','julian','white','story','story2','story4']);\n"
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
rep("const T_MAIN=95, FPS=24;", f"const T_MAIN={T_LEN}, FPS=24, TRACK_LEN=96.05;")
# Beat- und Taktraster laufen hinter dem Track weiter, damit in der Ablage gesnappt und synchronisiert werden kann
rep("const MUSIC_SNAPS=[0,2.35,5.32,8.64,...BEATS];",
    "{const bt=(BEATS[BEATS.length-1]-BEATS[BEATS.length-41])/40;while(BEATS[BEATS.length-1]+bt<T_MAIN)BEATS.push(+(BEATS[BEATS.length-1]+bt).toFixed(3));"
    "const br=bt*4;while(BAR[BAR.length-1]+br<T_MAIN)BAR.push(+(BAR[BAR.length-1]+br).toFixed(2))} // Raster über das Ende der Musik hinaus (Ablage)\n"
    "const MUSIC_SNAPS=[0,2.35,5.32,8.64,...BEATS];")
# Verlauf-Clip: Intro und Julian-Block als zwei Balken zeichnen, wenn dazwischen eine Lücke ist
rep("ge.style.left=wReal(g.start)*pps+'px';ge.style.width=Math.max(12,(wReal(g.start+g.len)-wReal(g.start))*pps)+'px';ge.classList.toggle('sel',sel==='grad');",
    "{const a=wReal(g.start),gap=S.warp.r0>WA+.01,e1=gap?WA:wReal(g.start+g.len);ge.style.left=a*pps+'px';ge.style.width=Math.max(12,(e1-a)*pps)+'px';"
    "let g2=$('clip_grad2');if(!g2){g2=document.createElement('div');g2.id='clip_grad2';g2.className='clip grad';g2.style.pointerEvents='none';g2.innerHTML='<span>Verlauf (Julian)</span>';$('laneV1').appendChild(g2)}"
    "g2.style.display=gap?'':'none';if(gap){const b0=S.warp.r0,b1=wReal(g.start+g.len);g2.style.left=b0*pps+'px';g2.style.width=Math.max(12,(b1-b0)*pps)+'px'}}"
    "ge.classList.toggle('sel',sel==='grad');")
# Wellenform nur so lang wie der Track
rep("const per=c.width/PEAKS.length;PEAKS.forEach", "const per=c.width*Math.min(1,TRACK_LEN/T_MAIN)/PEAKS.length;PEAKS.forEach")
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


CARDS = ["c2", "c3", "c9", "c4", "c5", "c6", "c7", "c8"]
cards = (
    card("c2", "Wie für dich gemacht", ["Wie für *dich gemacht."], 150, BEIGE, BURG, step=.75, inAt=.75)
    + card("c9", "Mach dein Jö draus", ["Mach *dein Jö draus!"], 150, BEIGE, BURG, step=.25, inAt=.25)
    + card("c3", "Angebote, die zu dir passen", ["Angebote, die", "zu *dir passen."], 140, BEIGE, BURG, step=.25, inAt=.25)
    + card("c4", "02 Digitaler Begleiter", ["Alles in einer App:", "*einfach und *bequem."], 118, BEIGE, BURG, step=.25, inAt=.25)
    + card("c5", "03 Integration der Partner", ["Wir bringen eure Marke", "dorthin, wo sie *wirkt."], 118, BEIGE, BURG, step=.375, inAt=.5)
    + card("c6", "03 Unter-Headline Look", ["Eure Angebote", "im neuen jö *Look."], 118, BEIGE, BURG, step=.25, inAt=.25)
    + card("c7", "03 Unter-Headline Sichtbarkeit", ["Sichtbar, wo eure", "*Kund:innen sind."], 118, BEIGE, BURG, step=.25, inAt=.25)
    + card("c8", "Schluss Vision", ["Begeisterung. Täglich. Für alle."], 76, GRAD, "#fff", step=.5,
           inAt=round((LOGO2 - CLIPS['c8']['start'] + 3.1) / BEAT, 2), hi="'#fff'", top=880, out=False)
)
anchor = "const HL3=makeHL('hl3'"
rep(anchor, cards + anchor)

# ---------- 5b. Neue Szene „Menschen“ (people_comp.js) nach „Partner Vollbild“ ----------
rep("/* =====================================================================\n   COMP: APP-VIDEO", (here / "people_comp.js").read_text(encoding="utf-8") + "\n" + (here / "slot_comp.js").read_text(encoding="utf-8") + "\n/* =====================================================================\n   COMP: APP-VIDEO")

# ---------- 6. Doppel-Clip: Logo am Schluss ----------
aliases = ("const LOGO2=Object.assign(Object.create(LOGO),{key:'logo2',name:'Logo (Schluss)'});\n")
old_comps = s[s.index("const COMPS={"):s.index("};", s.index("const COMPS={")) + 2]
keys = [kv.split(":")[0] for kv in old_comps[len("const COMPS={"):-2].split(",")]
assert all(k in keys for k in DROP), keys
body = ",".join(kv for kv in old_comps[len("const COMPS={"):-2].split(",") if kv.split(":")[0] not in DROP)
new_comps = ("const COMPS={" + ",".join(f"{k}:{k.upper()}" for k in CARDS) + "," + body + ",people:PEOPLE,slot:SLOT,logo2:LOGO2};")
layers = (json.dumps(CARDS) + ".forEach(k=>$('stage').appendChild($('hl_'+k))); // Tafeln über allen Szenen\n"
          "[$('logo'),LBOX,GL].forEach(el=>$('stage').appendChild(el)); // Logo am Schluss liegt über der Verlaufs-Tafel\n")
rep(old_comps, aliases + layers + new_comps)

# ---------- 7. Ausgangs-Timeline und Parameter im Code ----------
block = f"S.warp={{r0:{WR0_REAL}}};\n" + "\n".join(f"S.clips.{k}={{start:{v['start']},len:{v['len']},in:{v['in']}}};" for k, v in CLIPS.items()) + "\n"
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
