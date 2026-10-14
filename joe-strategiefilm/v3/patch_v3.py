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
WE = 11.5                       # Design-Zeitpunkt, an dem auf Kian geschnitten wird (kurz bevor die Stories rausfahren)
WR0 = 13.976                    # Julian beginnt nach der ersten Kapitel-Tafel
RABATT = bars(45.763, -9)       # 25,19 s
WR1 = RABATT
CLOUD_A = round(RABATT + 3.0427, 4)          # wie im Markenfilm: Wolke startet auf dem letzten Kian-Bild
C4_END = 34.34
BOX = bars(24.5417, 6)          # 38,257 s
PARTNER = bars(27.6013, 8)      # 45,888 s, Einflug auf dem Höhepunkt der Musik
BRAND = round(PARTNER + 4.482, 4)
BRAND_LEN = round(4.375 + BARL, 4)           # Lockups einen Takt länger (ruhiger)
FULL = round(PARTNER + 8.857 + BARL, 4)
COLORS = bars(16.6281, 22)
DEAL = round(COLORS + 3.4313, 4)
PROD = bars(43.49, 14)
CITY = bars(57.19, 10)
BILL = round(CITY + 3.293, 4)
AU_BASS = 91.4537
AU_CUT = round(AU_BASS - 2 * BARL, 4)        # Sprung auf den großen Bass am Ende des Tracks
LOGO_LAND = 1.33                              # Punkte landen 1,33 s nach Clipstart (Logo-Animation, Standardwerte)
LOGO2 = round(AU_CUT - LOGO_LAND, 4)
END = round(AU_CUT + (96.05 - AU_BASS), 2)   # Rest des Tracks nach dem Sprung

C = lambda st, ln, i=0: dict(start=round(st, 4), len=round(ln, 4), **{"in": i})
CLIPS = {
    "hl1": C(0, 2.35),
    "logo": C(2.35, 2.4833, .475),
    "c1": C(4.8333, 9.195 - 4.8333),
    "c2": C(9.195, WR0 - 9.195),
    # julian, white, story, story2, story4, grad: Design-Zeit wie im Markenfilm (Zeitdehnung WR0…WR1)
    "rabatt": C(RABATT, 3.5997),
    "cloud": C(CLOUD_A, 2.75),                  # Kian zoomt raus in die Profil-Wolke
    "c4": C(CLOUD_A + 2.75, C4_END - CLOUD_A - 2.75),
    "cloudB": C(C4_END, BOX + .66 - C4_END, 3.4),  # Zoom in Tamaras Video, digitale Rechnung
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
# Szenen, die im Partnerfilm entfallen (zweite Story-Gruppe, verdeckte Headline 3, Agentur-Endcard)
DROP = ["story3", "story5", "story6", "hl3", "endc"]

# Parameter, die vom Markenfilm abweichen
PARAMS = {
    "brand": {"step": .71},          # jede Partnerfarbe steht länger (füllt genau einen Takt mehr)
    "cloudB": {"banner": 0},         # Tamara: nur Video und digitale Rechnung, kein Banner
}

# ---------- 1. Zeitdehnung frei wählbar ----------
rep("const WA=4.8333,WB=13.769;\nfunction warpK(){const c=S.clips.colors;return c?Math.max(.2,(c.start-WA)/(WB-WA)):1}\n"
    "function wDesign(t){const c=S.clips.colors,B=c?c.start:WB,k=warpK();return t<=WA?t:t<=B?WA+(t-WA)/k:t-(B-WB)} // echte Zeit → Design-Zeit\n"
    "function wReal(x){const c=S.clips.colors,B=c?c.start:WB,k=warpK();return x<=WA?x:x<=WB?WA+(x-WA)*k:x+(B-WB)} // Design-Zeit → echte Zeit\n"
    "const isPre=k=>k==='grad'||(S.clips[k]&&S.clips[k].start<WB-1e-3&&S.clips[k].start+S.clips[k].len>WA+1e-3);",
    f"const WA=4.8333,WB={WE},WR0={WR0},WR1={WR1}; // Partnerfilm: Design-Abschnitt WA…WB (Julian + erste Stories) läuft auf der Hauptebene von WR0 bis WR1\n"
    "function warpK(){return Math.max(.2,(WR1-WR0)/(WB-WA))}\n"
    "function wDesign(t){const k=warpK();return t<=WA?t:t<WR0?WA-1e-4:t<=WR1?WA+(t-WR0)/k:t-WR1+WB} // echte Zeit → Design-Zeit\n"
    "function wReal(x){const k=warpK();return x<WA?x:x<=WB?WR0+(x-WA)*k:x-WB+WR1} // Design-Zeit → echte Zeit\n"
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
rep("const T_MAIN=95, FPS=24;", f"const T_MAIN={END}, FPS=24;")
chap = [(0, "Intro"), (9.195, "01 Ganz persönlich"), (CLIPS["c4"]["start"], "02 Digitaler Begleiter"),
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


CARDS = ["c1", "c2", "c4", "c5", "c6", "c7", "c8"]
cards = (
    card("c1", "Vision", ["Begeisterung.", "Täglich. Für alle."], 140, GRAD, "#fff", kicker="Unsere Vision", kc="rgba(255,255,255,.8)", step=1.2, inAt=.6, hi="'#fff'")
    + card("c2", "01 Ganz persönlich", ["Wie für *dich gemacht:", "Angebote, die zu dir passen."], 112, BEIGE, BURG, kicker="01 · Ganz persönlich", kc=MUTED, step=.5, inAt=.25)
    + card("c4", "02 Digitaler Begleiter", ["Alles in einer App:", "*einfach und *bequem."], 118, BEIGE, BURG, kicker="02 · Digitaler Begleiter", kc=MUTED, step=.25, inAt=.25)
    + card("c5", "03 Integration der Partner", ["Wir bringen eure Marke", "dorthin, wo sie *wirkt."], 118, BEIGE, BURG, kicker="03 · Integration der Partner", kc=MUTED, step=.375, inAt=.5)
    + card("c6", "03 Unter-Headline Look", ["Eure Angebote", "im neuen jö *Look."], 118, BEIGE, BURG, kicker="03 · Integration der Partner", kc=MUTED, step=.25, inAt=.25)
    + card("c7", "03 Unter-Headline Sichtbarkeit", ["Sichtbar, wo eure", "*Kund:innen sind."], 118, BEIGE, BURG, kicker="03 · Integration der Partner", kc=MUTED, step=.25, inAt=.25)
    + card("c8", "Schluss Vision", ["Begeisterung. Täglich. Für alle."], 76, GRAD, "#fff", step=.5,
           inAt=round((LOGO2 - CLIPS['c8']['start'] + 3.1) / BEAT, 2), hi="'#fff'", top=880, out=False)
)
anchor = "const HL3=makeHL('hl3'"
rep(anchor, cards + anchor)

# ---------- 6. Doppel-Clips: Profil-Wolke (Tamara) und Logo am Schluss ----------
aliases = ("const CLOUDB=Object.assign(Object.create(CLOUD),{key:'cloudB',name:'Profil-Wolke (Tamara)'});\n"
           "const LOGO2=Object.assign(Object.create(LOGO),{key:'logo2',name:'Logo (Schluss)'});\n")
old_comps = s[s.index("const COMPS={"):s.index("};", s.index("const COMPS={")) + 2]
keys = [kv.split(":")[0] for kv in old_comps[len("const COMPS={"):-2].split(",")]
assert all(k in keys for k in DROP), keys
body = ",".join(kv for kv in old_comps[len("const COMPS={"):-2].split(",") if kv.split(":")[0] not in DROP)
new_comps = ("const COMPS={" + ",".join(f"{k}:{k.upper()}" for k in CARDS) + "," + body + ",cloudB:CLOUDB,logo2:LOGO2};")
layers = (json.dumps(CARDS) + ".forEach(k=>$('stage').appendChild($('hl_'+k))); // Tafeln über allen Szenen\n"
          "[$('logo'),LBOX,GL].forEach(el=>$('stage').appendChild(el)); // Logo am Schluss liegt über der Verlaufs-Tafel\n")
rep(old_comps, aliases + layers + new_comps)

# ---------- 7. Ausgangs-Timeline und Parameter im Code ----------
block = "\n".join(f"S.clips.{k}={{start:{v['start']},len:{v['len']},in:{v['in']}}};" for k, v in CLIPS.items()) + "\n"
block += "".join(f"Object.assign(S.comps.{k}.params,{json.dumps(v)});FM.{k}=COMPS.{k}.model(S.comps.{k}.params);\n" for k, v in PARAMS.items())
rep("let db=null;const DOC_TL='jo/timeline'", block + "let db=null;const DOC_TL='jo/timeline'")

(here / "index.html").write_text(s, encoding="utf-8")

tl = json.loads((here / "timeline_markenfilm.json").read_text())
for k in DROP:
    tl["clips"].pop(k, None)
tl["clips"].update(CLIPS)
(here / "timeline_partnerfilm.json").write_text(json.dumps(tl, indent=1), encoding="utf-8")
print("Ende", END, "AU_CUT", AU_CUT, "Logo2", LOGO2)
for k, v in sorted(CLIPS.items(), key=lambda kv: kv[1]["start"]):
    print(f"  {k:8s} {v['start']:7.3f} – {v['start'] + v['len']:7.3f}")
