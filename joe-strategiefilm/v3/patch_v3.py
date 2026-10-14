"""Baut aus der Kopie des Markenfilms den Partnerfilm: neue Reihenfolge nach Themen, Kapitel-Tafeln, ~92 s.

Liest index_markenfilm.html (unveränderte Kopie von „jö Video · Timeline“) und schreibt index.html.
Alle Blöcke sind um ganze Takte verschoben, damit Schnitte auf der Musik bleiben.
"""
import pathlib, re, json

p = pathlib.Path(__file__).with_name("index.html")
s = pathlib.Path(__file__).with_name("index_markenfilm.html").read_text(encoding="utf-8")  # immer von der unveränderten Kopie aus


def rep(a, b, count=1):
    global s
    n = s.count(a)
    assert n == count, f"{n}x gefunden: {a[:80]}"
    s = s.replace(a, b)


# ---------- Zeitplan (Sekunden auf der Hauptebene) ----------
BARL = 2.28583                       # Taktlänge der Musik
WR0, WR1 = 13.976, 27.476            # Julian + Stories (Design-Zeit 4,83…13,77) laufen hier, etwas langsamer als im Markenfilm
AU_BASS = 91.4537
AU_CUT = round(AU_BASS - 2 * BARL, 4)        # Bass-Schnitt 2 Takte vor dem Original-Bass
ENDC = round(AU_CUT - 1.3947, 4)             # H·A-Aufbau der Endcard liegt wie im Markenfilm auf dem Bass
CITY = round(ENDC - 5.439, 4)
CLIPS = {
    "hl1": dict(start=0, len=2.35, **{"in": 0}),
    "logo": dict(start=2.35, len=2.4833, **{"in": 0.475}),
    "c1": dict(start=4.8333, len=round(9.195 - 4.8333, 4), **{"in": 0}),
    "c2": dict(start=9.195, len=round(WR0 - 9.195, 4), **{"in": 0}),
    # Julian, Stories, Weiße Fläche: Design-Zeit wie im Markenfilm (Zeitdehnung WR0…WR1)
    "rabatt": dict(start=WR1, len=round(32.07 - WR1, 4), **{"in": 0}),
    "c4": dict(start=32.07, len=round(35.091 - 32.07, 4), **{"in": 0}),
    "cloud": dict(start=35.091, len=round(45.114 - 35.091, 4), **{"in": 0}),
    "box": dict(start=45.114, len=3.5, **{"in": 0}),
    "c5": dict(start=48.614, len=round(52.751 - 48.614, 4), **{"in": 0}),
    "partner": dict(start=52.751, len=4.482, **{"in": 0}),
    "brand": dict(start=57.233, len=4.375, **{"in": 0}),
    "full": dict(start=61.608, len=round(69.201 - 61.608, 4), **{"in": 0}),
    "colors": dict(start=69.201, len=3.4313, **{"in": 0}),
    "deal": dict(start=72.6323, len=round(77.76 - 72.6323, 4), **{"in": 0}),
    "prod": dict(start=77.76, len=2.273, **{"in": 0.634}),
    "hl3": dict(start=77.76, len=2.43, **{"in": 0}),
    "city": dict(start=CITY, len=3.293, **{"in": 0}),
    "bill": dict(start=round(CITY + 3.293, 4), len=2.146, **{"in": 0}),
    "endc": dict(start=ENDC, len=7.0, **{"in": 0}),
}
END = round(ENDC + 7.0, 3)

# ---------- 1. Zeitdehnung: Fenster frei wählbar, nicht mehr an „Farben“ gebunden ----------
rep("const WA=4.8333,WB=13.769;\nfunction warpK(){const c=S.clips.colors;return c?Math.max(.2,(c.start-WA)/(WB-WA)):1}\n"
    "function wDesign(t){const c=S.clips.colors,B=c?c.start:WB,k=warpK();return t<=WA?t:t<=B?WA+(t-WA)/k:t-(B-WB)} // echte Zeit → Design-Zeit\n"
    "function wReal(x){const c=S.clips.colors,B=c?c.start:WB,k=warpK();return x<=WA?x:x<=WB?WA+(x-WA)*k:x+(B-WB)} // Design-Zeit → echte Zeit\n"
    "const isPre=k=>k==='grad'||(S.clips[k]&&S.clips[k].start<WB-1e-3&&S.clips[k].start+S.clips[k].len>WA+1e-3);",
    f"const WA=4.8333,WB=13.769,WR0={WR0},WR1={WR1}; // Partnerfilm: Design-Abschnitt WA…WB läuft auf der Hauptebene von WR0 bis WR1\n"
    "function warpK(){return Math.max(.2,(WR1-WR0)/(WB-WA))}\n"
    "function wDesign(t){const k=warpK();return t<=WA?t:t<WR0?WA-1e-4:t<=WR1?WA+(t-WR0)/k:t-WR1+WB} // echte Zeit → Design-Zeit\n"
    "function wReal(x){const k=warpK();return x<WA?x:x<=WB?WR0+(x-WA)*k:x-WB+WR1} // Design-Zeit → echte Zeit\n"
    "const PRE=new Set(['grad','julian','white','story','story2','story3','story4','story5','story6']);\n"
    "const isPre=k=>PRE.has(k);")

# ---------- 2. Abhängigkeiten, die die alte Reihenfolge voraussetzen ----------
# Anzeigen gleiten nur mit der Bento-Parallaxe, wenn die Bento-Box direkt danach kommt
old_tb = "const tb=(view==='main'&&S.clips.box&&FM.box)?mT-S.clips.box.start:-1"
new_tb = "const tb=(view==='main'&&S.clips.box&&FM.box&&S.clips.deal&&S.clips.box.start>S.clips.deal.start)?mT-S.clips.box.start:-1"
rep(old_tb, new_tb, count=2)
# Bento-Box ist nur transparent, wenn sie wirklich über Anzeigen bzw. Partner liegt
rep("BXL.style.background=(view==='main'&&((S.clips.deal&&mT<S.clips.deal.start+S.clips.deal.len)||(S.clips.partner&&mT>=S.clips.partner.start)))?'transparent':'#f4f1ea';",
    "{const bc=S.clips.box,dc=S.clips.deal,pc=S.clips.partner;BXL.style.background=(view==='main'&&bc&&((dc&&dc.start<bc.start&&mT<dc.start+dc.len)||(pc&&pc.start>bc.start&&pc.start<bc.start+bc.len&&mT>=pc.start)))?'transparent':'#f4f1ea'};")

# ---------- 3. Musik: Bass-Schnitt für die längere Fassung ----------
rep("const AU_BASS=91.4537,AU_CUT=64.0237,AU_XF=.004;", f"const AU_BASS=91.4537,AU_CUT={AU_CUT},AU_XF=.004;")
rep("const T_MAIN=95, FPS=24;", f"const T_MAIN={END}, FPS=24;")
rep("const CHAPTERS=[[0,'Logo'],[BAR[1],'Neuausrichtung'],[BAR[4],'Menschen'],[BAR[16],'Bento-Box'],[BAR[21],'Partner'],[BAR[32],'Endcard']];",
    "const CHAPTERS=[[0,'Intro'],[9.195,'Wie für dich gemacht'],[32.07,'Digitaler Begleiter'],[48.614,'Integration der Partner'],"
    f"[{ENDC},'Endcard']];")

# ---------- 4. Kapitel-Tafeln: makeHL bekommt eine kleine Zeile darüber (Kapitelname) ----------
rep("  $('stage').appendChild(L);const W=[...L.querySelectorAll('.hlw')],box=L.querySelector('.hlBox'),scr=L.querySelector('.hlScrim');",
    "  if(o.kicker)L.insertAdjacentHTML('beforeend',`<div class=\"hlKick\" style=\"position:absolute;left:0;right:0;top:${o.top-86}px;text-align:center;color:${o.kc||o.color};font-size:42px;font-weight:700;letter-spacing:-.005em;opacity:0\">${o.kicker}</div>`);\n"
    "  $('stage').appendChild(L);const W=[...L.querySelectorAll('.hlw')],box=L.querySelector('.hlBox'),scr=L.querySelector('.hlScrim'),kk=L.querySelector('.hlKick');")
rep("      if(scr)scr.style.opacity=(eOut(seg(t,0,P.inAt*b+.25))*(1-eIO(seg(t,P.outAt*b,P.outAt*b+.45)))).toFixed(3)},",
    "      if(scr)scr.style.opacity=(eOut(seg(t,0,P.inAt*b+.25))*(1-eIO(seg(t,P.outAt*b,P.outAt*b+.45)))).toFixed(3);\n"
    "      if(kk){const p=eExpo(seg(t,Math.max(0,P.inAt*b-.35),P.inAt*b+.25)),q=eInCub(seg(t,P.outAt*b,P.outAt*b+.3));kk.style.opacity=(p*(1-q)).toFixed(3);kk.style.transform=`translateY(${((1-p)*24).toFixed(1)}px)`}},")

B = 13.725 / 24
def card(key, name, lines, size, dur, bg, color, kicker=None, kc=None, step=.5, inAt=.5, hi="JG_TXT"):
    n = len(lines)
    lh = round(size * 1.12) + round(size * .12)
    top = round(540 - n * lh / 2 + (30 if kicker else 0))
    lenb = round(dur / B, 3)
    out = round(lenb - .85, 3)
    o = f"{{size:{size},top:{top},color:'{color}',bg:{bg},hi:{hi},step:{step},inAt:{inAt},outAt:{out},len:{lenb},cls:'logo'"
    if kicker:
        o += f",kicker:'{kicker}',kc:'{kc or color}'"
    o += f",note:'Kapitel-Tafel des Partnerfilms ({name}).'}}"
    return f"const {key.upper()}=makeHL('{key}','{name}','laneV2',{json.dumps(lines, ensure_ascii=False)},\n  {o});\n"

BEIGE, BURG, GRAD = "'#f4f1ea'", "#670003", "'radial-gradient(45% 70% at 0% 100%,#b23336 0%,rgba(178,51,54,0) 100%),linear-gradient(95deg,#c4382b 0%,#cf3a25 18%,#db3e22 36%,#de4626 52%,#e05530 68%,#e86a37 84%,#ee793c 96%,#ee793c 100%)'"
d = {k: v["len"] for k, v in CLIPS.items()}
cards = (
    card("c1", "Tafel Vision", ["Begeisterung.", "Täglich. Für alle."], 140, d["c1"], GRAD, "#fff", kicker="Unsere Vision", kc="rgba(255,255,255,.8)", step=1.2, inAt=.6, hi="'#fff'")
    + card("c2", "Kapitel Wie für dich gemacht", ["Wie für *dich gemacht:", "Angebote, die zu dir passen."], 112, d["c2"], BEIGE, BURG, kicker="Ganz persönlich", kc="#9a4a40", step=.5, inAt=.25)
    + card("c4", "Kapitel Digitaler Begleiter", ["Alles in einer App:", "*einfach und *bequem."], 118, d["c4"], BEIGE, BURG, kicker="Digitaler Begleiter", kc="#9a4a40", step=.25, inAt=.25)
    + card("c5", "Kapitel Partner", ["Wir bringen eure Marke", "dorthin, wo sie *wirkt."], 118, d["c5"], BEIGE, BURG, kicker="Integration der Partner", kc="#9a4a40", step=.375, inAt=.5)
)
anchor = "const HL3=makeHL('hl3'"
rep(anchor, cards + anchor)

# Tafeln liegen über allen anderen Ebenen
rep("const COMPS={box:BOX,", "['c1','c2','c4','c5'].forEach(k=>$('stage').appendChild($('hl_'+k)));\nconst COMPS={c1:C1,c2:C2,c4:C4,c5:C5,box:BOX,")

# ---------- 5. Ausgangs-Timeline im Code (die Datenbank überschreibt sie mit demselben Stand) ----------
lines = []
for k, v in CLIPS.items():
    lines.append(f"S.clips.{k}={{start:{v['start']},len:{v['len']},in:{v['in']}}};")
block = "\n".join(lines) + "\n"
rep("let db=null;const DOC_TL='jo/timeline'", block + "let db=null;const DOC_TL='jo/timeline'")

p.write_text(s, encoding="utf-8")

# Datenbank-Dokument mit demselben Stand (Julian, Stories, Weiße Fläche, Verlauf bleiben in Design-Zeit)
tl = json.loads(pathlib.Path(__file__).with_name("timeline_markenfilm.json").read_text())
for k, v in CLIPS.items():
    tl["clips"][k] = v
pathlib.Path(__file__).with_name("timeline_partnerfilm.json").write_text(json.dumps(tl, indent=1), encoding="utf-8")
print("Ende", END, "AU_CUT", AU_CUT, "Endcard", ENDC, "City", CITY)
