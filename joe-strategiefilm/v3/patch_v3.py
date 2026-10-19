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
CLIPS["showcase"] = C(121.2994, 8.47)   # Ablage; wird unten noch um die Intro-/Einschub-Verschiebungen versetzt (Editor: 146,443)          # Icon-Showcase: in der Ablage hinter dem Schluss
T_LEN = 192                                    # Timeline länger als der Track (96 s)
# Intro: vier Headlines vor dem Logo. Musik und alles ab dem Logo rücken um INTRO_D nach hinten (Beat-Sync bleibt).
INTRO_HL = [("hl1", 4.2), ("hl1b", 3.8), ("hl1c", 3.5), ("hl1d", 4.6)]   # Länge je Headline in Schlägen
INTRO_D = round(sum(l for _, l in INTRO_HL) * BEAT - 2.35, 4)          # alte Headline lief 0–2,35 s

# Szenen, die im Partnerfilm entfallen (zweite Story-Gruppe, verdeckte Headline 3, Agentur-Endcard)
DROP = ["hl3"]

# Parameter, die vom Markenfilm abweichen
PARAMS = {
    "julian": {"sStart": 2.0, "pause": .3},   # Hallo Julian / 100 Ös / Einlösen stehen länger, der Slider startet später
    "partner": {"hit": 4.8, "lOut": 6.4, "sent": 6.45, "sent2": 7.4, "popGap": 99, "end": 15, "spread": 1.15},   # Einflug nach dem Logo-Wechsel, kein Verlauf-Flut
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
    + card("c3", "So persönlich wie nie zuvor", ["So *persönlich", "wie nie zuvor."], 150, BEIGE, BURG, step=.25, inAt=.25)
    + card("c4", "02 Digitaler Begleiter", ["Alles in einer App:", "*einfach und *bequem."], 150, BEIGE, BURG, step=.25, inAt=.25)
    + card("c5", "03 Eigenständig im Auftritt", ["*Eigenständig", "im Auftritt."], 150, BEIGE, BURG, step=.375, inAt=.5)
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
    "const HL1=makeHL('hl1','Headline 1a','laneV3',['Das Leben ist','voller Vielfalt.'],\n  {size:150,top:354,color:'#fff',step:.3,inAt:.25,outAt:3.6,len:4.2,")
rep("const HL2=makeHL('hl2',",
    "const HL1B=makeHL('hl1b','Headline 1b','laneV2',['Das Leben ist vielfältig.'],{size:150,top:447,color:'#fff',step:.3,inAt:.25,outAt:3.2,len:3.8,shadow:1,note:'Intro, zweite Zeile.'});\n"
    "const HL1C=makeHL('hl1c','Headline 1c','laneV3',['Und voller','Möglichkeiten.'],{size:150,top:354,color:'#fff',step:.35,inAt:.25,outAt:2.9,len:3.5,shadow:1,note:'Intro, dritte Zeile.'});\n"
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
aliases = ("const LOGO2=Object.assign(Object.create(LOGO),{key:'logo2',name:'Logo (Schluss)',}); // Schluss: jö wird auf dem Hit (F4279) zum App-Icon wie nach „Das neue Jö.“\nconst LG3BG=document.createElement('div');LG3BG.style.cssText=`position:absolute;inset:0;display:none;background:${JG_CSS}`;$('bg').after(LG3BG);\nconst LOGO4=Object.assign(Object.create(LOGO),{key:'logo4',name:'Logo (Schluss, vor „Markenbühne“)',render(M,t){LOGO.render.call(this,M,Math.min(t,M.P.outAt-1/24))}}); // jö baut sich auf und bleibt stehen, kein App-Icon\nconst LOGO3=Object.assign(Object.create(LOGO),{key:'logo3',name:'Logo (nach „Das neue Jö.“)',show(on){LOGO.show.call(this,on);LG3BG.style.display=on?'':'none'}}); // jö baut sich auf dem Verlauf auf und wird zum App-Icon, Julian übernimmt\n"
           + (here / "partner_mod.js").read_text(encoding="utf-8") + "\n"
           + (here / "cloud_mod.js").read_text(encoding="utf-8") + "\n"
           + (here / "formats_comp.js").read_text(encoding="utf-8") + "\n"
           + (here / "box_mod.js").read_text(encoding="utf-8") + "\n"
           + (here / "ooh_mod.js").read_text(encoding="utf-8") + "\n"
           + wl_imgs((here / "ubahn_comp.js").read_text(encoding="utf-8")).replace("__UBAHN__", "data:image/webp;base64," + base64.b64encode((here / "ooh" / "ubahn_mock.webp").read_bytes()).decode()).replace("__UBFRAU__", "data:image/webp;base64," + base64.b64encode((here / "ooh" / "ubahn_frau.webp").read_bytes()).decode()) + "\n"
           + (here / "endtext_comp.js").read_text(encoding="utf-8") + "\n"
           "const WHITE2=Object.assign(Object.create(WHITE),{key:'white2',name:'Weiße Fläche (Julian)',render(M,t){WH_J=true;try{WHITE.render.call(this,M,t)}finally{WH_J=false}}});\n")
old_comps = s[s.index("const COMPS={"):s.index("};", s.index("const COMPS={")) + 2]
keys = [kv.split(":")[0] for kv in old_comps[len("const COMPS={"):-2].split(",")]
assert all(k in keys for k in DROP), keys
body = ",".join(kv for kv in old_comps[len("const COMPS={"):-2].split(",") if kv.split(":")[0] not in DROP)
new_comps = ("const COMPS={" + ",".join(f"{k}:{k.upper()}" for k in CARDS) + "," + body + ",people:PEOPLE,slot:SLOT,badges:BADGES,wall:WALL,tags:TAGS,showcase:SHOWCASE,hl1b:HL1B,hl1c:HL1C,hl1d:HL1D,ivKochen:IV_KOCHEN,ivTanken:IV_TANKEN,ivBrille:IV_BRILLE,fuer:FUER,pers:PERS,system:SYSTEM,kanal:KANAL,welt:WELT,pos:POS,formats:FORMATS,flex:FLEX,ubahn:UBAHN,endtxt:ENDTXT,white2:WHITE2,logo2:LOGO2,logo3:LOGO3,logo4:LOGO4};")
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
CLIPS["slot"]["start"] = 170.9286   # Ablage (Position wie im Editor gesetzt)
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
# Formate nach der Headline: drei Bildschirme (je 2 Takte) mit allen Story-Inhalten in verschiedenen Formaten.
# Die bisherigen Stories (Design-Block) kommen als Reserve in die Ablage hinter den Slot.
FM_AT = round(KA_AT + BARL, 4)
CLIPS["formats"] = C(FM_AT, 6 * BARL)
# „Flexibel im Zusammenspiel.“ (1 Takt), danach die Anzeigen (aus der Ablage, Länge wie im Markenfilm)
FX_AT = round(FM_AT + 6 * BARL, 4)
CLIPS["flex"] = C(FX_AT, BARL)
CLIPS["deal"]["start"] = round(FX_AT + BARL, 4)
# „Alles in einer App: einfach und bequem.“ (1 Takt) und danach die Bento-Box, beide aus der Ablage
C4_AT = round(CLIPS["deal"]["start"] + CLIPS["deal"]["len"], 4)
CLIPS["c4"] = C(C4_AT, BARL)
CLIPS["box"]["start"] = round(C4_AT + BARL, 4)
PARAMS["c4"] = {"len": 4, "outAt": 3.3, "outDir": -1}   # Wörter gehen nach oben raus, dann kommt die Bento-Box von unten
WR0_REAL = 215.0
CLIPS["ivKochen"] = C(0, CLIPS["hl1"]["len"])   # Video „Kochen“ unter der ersten Headline
CLIPS["ivTanken"] = C(CLIPS["hl1b"]["start"], CLIPS["hl1b"]["len"])   # Video „Tanken“ unter der zweiten
CLIPS["ivBrille"] = C(CLIPS["hl1c"]["start"], CLIPS["hl1c"]["len"])   # Video „Brille“ unter der dritten
# „Farben“ direkt nach „Das neue Jö.“ (2 Takte, endet auf dem Verlauf → nahtlos in „Für …“); alles danach rückt 2 Takte nach hinten
CO_AT = round(CLIPS["c2"]["start"] + CLIPS["c2"]["len"], 4)
for k in CLIPS:
    if k not in ("c2", "colors") and CO_AT - 1e-3 <= CLIPS[k]["start"] < 124:
        CLIPS[k]["start"] = round(CLIPS[k]["start"] + 2 * BARL, 4)
CLIPS["colors"] = C(CO_AT, 2 * BARL)
PARAMS["colors"] = {"beatsB": 2.75, "beatsC": 3.0}
# im Editor angelegt: nach der Bento-Box „Wir bringen eure Marke dorthin, wo sie wirkt.“, Citylight und Billboard; Stories-Ablage bei 189,79
CLIPS["c5"] = C(127.0736, 4.1312)
CLIPS["city"] = C(130.609, 4.317)
CLIPS["bill"] = C(136.297, 3.0611)
CLIPS["c7"] = C(134.345, 2.2837)
WR0_REAL = 189.79   # Farb-Pills auf dem Verlauf stehen 2 Schläge länger (8 Schläge gesamt)
# „Prämien“ (drei Partner-Prämienkarten) direkt nach den Markenfarben-Lockups, 1 Takt; alles danach (bis zum Billboard) rückt 1 Takt nach hinten
PR_AT = round(CLIPS["brand"]["start"] + CLIPS["brand"]["len"], 4)
for k in CLIPS:
    if k not in ("brand", "prod") and PR_AT - 1e-3 <= CLIPS[k]["start"] < 145:
        CLIPS[k]["start"] = round(CLIPS[k]["start"] + BARL, 4)
CLIPS["prod"] = C(PR_AT, BARL, .634)
# Schluss nach dem Billboard: Schluss-Text (6 Takte) auf dem Verlauf, danach das jö-Logo (Logo-Animation, Länge wie bisher)
ET_AT = round(CLIPS["bill"]["start"] + CLIPS["bill"]["len"], 4)
CLIPS["logo2"] = C(round(ET_AT + 6 * BARL, 4), BARL, CLIPS["logo2"]["in"])   # 1 Takt: endet als jö auf dem Verlauf (vor dem App-Icon), dort übernimmt die H·A-Endcard
CLIPS["endtxt"] = C(ET_AT, round(6 * BARL + CLIPS["logo2"]["len"], 4))   # läuft unter dem Logo weiter (Verlauf als Hintergrund)
# Ablage hinter dem Filmende neu sortiert, damit nichts in den Schluss ragt
CLIPS["showcase"] = C(208.0, 8.47)
CLIPS["full"] = C(218.0, CLIPS["full"]["len"])
CLIPS["c6"] = C(227.0, CLIPS["c6"]["len"])
# Nach dem Schluss: Hammer-Albrecht-Endcard (jö-Punkte → H·A) direkt nach dem jö-Logo. Alles, was bisher in der Ablage lag, ist raus
# aus der Timeline (weit hinter das Ende geschoben, Code bleibt); die Stories ebenso.
CLIPS["endc"] = C(round(CLIPS["logo2"]["start"] + CLIPS["logo2"]["len"], 4), 7.0)
for k in ("slot", "c8", "showcase", "full", "c6"):
    CLIPS[k]["start"] = 9000.0
WR0_REAL = 9000.0
# ===== 190-s-Fassung: ab „Farben“ alles neu auf das Taktraster gelegt (jede Szene ganze Takte, Schnitte auf der Eins).
# Langsamer werden die Szenen über die Länge: Tafeln halten länger (Wörter bleiben auf den Schlägen), Animationen laufen mit rate < 1.
# Badges, Angebots-Wand, „Ein System.“, Formate, Anzeigen und der Schluss-Text behalten ihr Tempo.
# „hammeralbrecht.design“ (Link der H·A-Endcard, 4,35 s nach Start) landet auf dem letzten langen Bass (182,86 s); Film endet bei 190 s.
BASS = 182.86
CLIPS["logo3"] = C(0, BARL)
LAYOUT = [  # (Clip, Takte, rate) – rate None = Tempo bleibt
    ("logo3", 1, None), ("colors", 3, 2 / 3), ("fuer", 5, None), ("rcblock", 5, None), ("c3", 2, None), ("pers", 1, None), ("people", 4, None),
    ("partner", 5, .75), ("brand", 4, .75), ("prod", 2, round(2.273 / (2 * BARL), 4)), ("system", 1, None), ("badges", 4.375, None), ("wall", 4, None),
    ("tags", 3.125, .8), ("kanal", 1, None), ("formats", 6, None), ("flex", 1, None), ("deal", 2.25, None), 
    ("c5", 1, None), ("city", 2.5, round(4.317 / (2.5 * BARL), 4)), ("c7", 2.25, None),
    ("bill", 2.5, round(3.0611 / (2.5 * BARL), 4)), ("endtxt", 6, None)]
NATIVE_CO = CLIPS["colors"]["len"]
_t = CLIPS["c2"]["start"] + CLIPS["c2"]["len"]
for k, bars, rate in LAYOUT:
    ln = round(bars * BARL, 4)
    if k == "rcblock":   # Kian-Video + Profil-Wolke: Abstand wie bisher
        _d = CLIPS["cloud"]["start"] - CLIPS["rabatt"]["start"]
        CLIPS["rabatt"]["start"] = round(_t, 4); CLIPS["cloud"]["start"] = round(_t + _d, 4)
    else:
        CLIPS[k]["start"], CLIPS[k]["len"] = round(_t, 4), ln
        if rate: CLIPS[k]["rate"] = rate
    _t += ln
CLIPS["endc"] = C(round(BASS - 4.35, 4), round(190 - (BASS - 4.35), 4))
CLIPS["logo2"] = C(CLIPS["endtxt"]["start"] + 6 * BARL, round(CLIPS["endc"]["start"] - CLIPS["endtxt"]["start"] - 6 * BARL, 4), CLIPS["logo2"]["in"])
CLIPS["logo2"]["start"] = round(CLIPS["logo2"]["start"], 4)
CLIPS["endtxt"]["len"] = round(CLIPS["endc"]["start"] - CLIPS["endtxt"]["start"], 4)
PARAMS["people"] = {"sb": 4}                              # 4 Schläge pro Person (4 Takte)
PARAMS["c3"] = {"len": 8, "outAt": 7.15}                  # Tafeln halten länger
PARAMS["c4"] = {"len": 7, "outAt": 6.3, "outDir": -1}
PARAMS["c5"] = {"len": 4, "outAt": 3.15}
PARAMS["system"] = {"len": 4, "step": 1.75, "outAt": 3.6}   # „Ein System. Unzählige Möglichkeiten.“ nur noch 1 Takt
PARAMS["fuer"] = {**PARAMS.get("fuer", {}), "len": 20, "hold": 4, "nStep": 1.0, "nMove": .45, "cloudAt": 12.25, "zoomAt": 17.5, "outAt": 20}   # Namen laufen langsamer durch (1 Takt mehr)
PARAMS["c7"] = {"len": 7, "outAt": 6.15}
# „Alles in einer App“ und Bento-Box entfallen (Zeit geht an „Wir bringen …“, Citylight, „Sichtbar …“ und Billboard)
for k in ("c4", "box"):
    CLIPS[k]["start"] = 9000.0
# Logo auf dem Drop entfällt: Julian beginnt direkt auf dem Drop (ohne App-Icon, gleich mit der Karte) und endet wie bisher
_je = CLIPS["julian"]["start"] + CLIPS["julian"]["len"]
for k in ("julian", "white2"):
    CLIPS[k] = C(CLIPS["logo"]["start"], round(_je - CLIPS["logo"]["start"], 4), .45)
    CLIPS[k]["rate"] = round((JUL_LEN - .45) / CLIPS[k]["len"], 5)
CLIPS["logo"]["start"] = 9000.0
# Reihenfolge nach dem Drop: „Das neue Jö.“ → jö-Logo (wird zum App-Icon) → Julian (startet aus dem App-Icon) → Farben
_d0, _co = CLIPS["julian"]["start"], CLIPS["colors"]["start"]
CLIPS["c2"]["start"] = _d0
CLIPS["logo3"] = C(round(_d0 + CLIPS["c2"]["len"], 4), 2.4833, .475)
_js = round(CLIPS["logo3"]["start"] + CLIPS["logo3"]["len"], 4)
for k in ("julian", "white2"):
    CLIPS[k] = C(_js, round(_co - _js, 4), 0)
    CLIPS[k]["rate"] = round(JUL_LEN / CLIPS[k]["len"], 5)
# Lücke vor „Farben“ schließen: Julian endet, sobald der Slider raus ist (Schlag 19,482), Farben steigt später in seine Animation ein
_cut, _ce = 19.482, CLIPS["colors"]["start"] + CLIPS["colors"]["len"]
for k in ("julian", "white2"):
    CLIPS[k]["len"] = round(_cut - CLIPS[k]["start"], 4); CLIPS[k]["rate"] = round(4.0 / CLIPS[k]["len"], 5)
_co0 = round(_cut - .6, 4)   # Farben beginnt schon über dem Ende von Julian: Karten gleiten über die letzten Slider-Elemente
CLIPS["colors"] = C(_co0, round(_ce - _co0, 4), .2); CLIPS["colors"]["rate"] = round((NATIVE_CO - .2) / CLIPS["colors"]["len"], 5)
rep("const q=f(seg(t,T[1]+i*P.stag,T[1]+i*P.stag+.55)),", "const q=f(seg(t,T[1]-.55+i*P.stag*.6,T[1]-.55+i*P.stag*.6+.3)),")  # Abstufungen: früher und schneller
rep("${hi?`background:${o.hi};-webkit-background-clip:text;background-clip:text;color:transparent;`:''}", "${hi?`background:${o.hi};-webkit-background-clip:text;background-clip:text;color:transparent;padding-bottom:.22em;margin-bottom:-.22em;`:''}")  # Verlaufswörter: Unterlängen (g, p) nicht abschneiden
rep('<circle id="j100Arc" cx="40" cy="40" r="30" fill="none" stroke="url(#rg1)" stroke-width="9" ', '<circle id="j100Arc" cx="40" cy="40" r="30" fill="none" stroke="url(#rg1)" stroke-width="9" stroke-linecap="round" ')  # Julian: Fortschrittsring mit runden Enden
# „Sichtbar, wo eure Kund:innen sind.“ → U-Bahn-Plakat (gleiche Stelle)
CLIPS["ubahn"] = C(CLIPS["c7"]["start"], CLIPS["c7"]["len"]); CLIPS["c7"]["start"] = 9000.0
PARAMS["ubahn"] = {"len": CLIPS["ubahn"]["len"]}
rep("const g=f(seg(t,A(0),A(.7)));E.bg.style.clipPath=g>=1?'none':`circle(${(g*2500).toFixed(1)}px at 0px ${CT_H}px)`;", "E.bg.style.clipPath='none'; // Citylight: Verlauf steht von Anfang an")
# Schluss nach Frames: Schluss-Text trifft F 3945, „… Relevanz.“ F 4062, jö-Logo sichtbar ab F 4230, Endcard F 4336,
# Pill um „hammeralbrecht.design“ fährt auf dem letzten großen Bass (182,86 s) auf
_et = round(3945 / 24 - .25 * BEAT, 4)
CLIPS["bill"]["len"] = round(_et - CLIPS["bill"]["start"], 4)          # Billboard steht bis zum Schluss-Text (Tempo bleibt, letztes Bild hält)
_ec = round(4336 / 24, 4)
CLIPS["endtxt"] = C(_et, round(_ec - _et, 4))
_rel = (4062 / 24 - _et) / BEAT                                       # Schlag, an dem „Relevanz.“ einläuft
PARAMS["endtxt"] = {"len": round((_ec - _et) / BEAT + .5, 2), "aIn": .25, "aOut": 4.25, "bIn": 5.25, "hold": round(_rel - 5.25, 3),
                    "bOut": round(5.25 + 2 * (_rel - 5.25) + 2.2, 2), "cOut": round((4230 / 24 - .65 - _et) / BEAT, 2)}
PARAMS["endtxt"]["cIn"] = round(PARAMS["endtxt"]["bOut"] + .75, 2)
CLIPS["logo2"] = C(round(4230 / 24 - .48, 4), 0, CLIPS["logo2"]["in"]); CLIPS["logo2"]["len"] = round(_ec - CLIPS["logo2"]["start"], 4)
CLIPS["endc"] = C(_ec, round(190 - _ec, 4))
_pa = round(BASS - _ec, 3)                                             # Pill-Start auf dem Bass
PARAMS["endc"] = {"flyAt": .35, "txAt": .95, "wmAt": 1.0, "outAt": round(_pa - .5, 3), "linkAt": round(_pa - .3, 3), "pillAt": _pa}
rep("    const drift=0;\n    E.cards.forEach((c,i)=>{const a=i*fl,", "    const drift=0;FC.style.background=t<.85?'transparent':'#f4f1ea'; // durchsichtig, solange Julian darunter ausläuft\n    E.cards.forEach((c,i)=>{const a=i*fl,")
# Prämien: die 3 Posts gleiten schneller rein (Faktor ppIn auf die Einflug-Phasen, Zählen bleibt)
rep("PPE.forEach((q,k)=>{const a=O+k*P.ppStag,p=f(seg(t,a,a+.5));", "PPE.forEach((q,k)=>{const a=O+k*P.ppStag,g=P.ppIn||1,p=f(seg(t,a,a+.5*g));")
rep("const b=f(seg(t,a+.18,a+.6));q.bg", "const b=f(seg(t,a+.18*g,a+.6*g));q.bg")
rep("const v=f(seg(t,a+.2,a+.62));q.v", "const v=f(seg(t,a+.2*g,a+.62*g));q.v")
rep("const l=f(seg(t,a+.28,a+.6));q.lock", "const l=f(seg(t,a+.28*g,a+.6*g));q.lock")
rep("pi=f(seg(t,a+.5,a+.8))", "pi=f(seg(t,a+.5*g,a+.8*g))")
# Endcard startet aus dem App-Icon (Endzustand des Schluss-Logos), nicht mehr aus dem weißen jö
rep("""fill="#fff"/>`).join('')}</svg>\n<div style="position:absolute;left:0;right:0;top:412px""", """fill="#fff"/>`).join('')}</svg>\n<img id="ecIcon" src="__ECICON__" style="position:absolute;left:710px;top:290px;width:500px;height:500px;border-radius:112.5px;box-shadow:0 30px 60px rgba(90,30,0,.18);transform-origin:50% 50%">\n<div style="position:absolute;left:0;right:0;top:412px""")
rep("E.jo.style.transform=`scale(${js.toFixed(4)})`;E.jo.style.opacity=js>0.02?1:0;", "E.jo.style.opacity=0;{const ic=$('ecIcon');ic.style.transform=`scale(${js.toFixed(4)})`;ic.style.opacity=js>0.02?1:0} /* App-Icon schrumpft statt des weißen jö */")
rep("c.setAttribute('fill','#fff');c.style.opacity=js>0.02?1:0})}", "c.setAttribute('fill','#fff');c.style.opacity=0})} /* die Punkte gehören zum weißen jö – mit App-Icon unsichtbar */")
# Kundenfeedback: jö-Logo statt „Mehr für euch!“ auf der Julian-Karte
rep("""<div style="position:absolute;left:24px;top:20px;color:${INK};font-size:72px;font-weight:800;letter-spacing:-.015em;line-height:.95">Mehr für<br>euch!</div>""",
    """<svg viewBox="0 0 271.15 182.86" style="position:absolute;left:30px;top:52px;width:250px;overflow:visible"><path d="${LP.J} ${LP.E}" fill="${INK}"/><circle cx="87.99" cy="16.8" r="16.8" fill="${INK}"/><circle cx="152.94" cy="16.8" r="16.8" fill="${INK}"/><circle cx="207.17" cy="16.8" r="16.8" fill="${INK}"/></svg>""")
# Kundenfeedback Julian-Start: „Meine Lieblingsmarken“ statt 100 Ös, „Meine Gesamtersparnis“ statt Einlösen, neu „Letzte Einkäufe“
_a = s.index('<div class="jg" id="j100"'); _b = s.index('<div class="jui" id="ui_fav">')
rep(s[_a:_b],
    """<div class="jg" id="j100" style="left:1250px;top:226px;width:440px;height:150px;padding:20px 26px;box-sizing:border-box">
  <div style="font-size:24px;font-weight:700;color:${BG}">Meine Lieblingsmarken</div>
  <div id="j100Row" style="display:flex;gap:14px;margin-top:14px"></div></div>
<div class="jg" id="j83" style="left:1290px;top:585px;width:340px;height:170px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:6px;padding:0 30px;box-sizing:border-box">
  <div style="font-size:24px;font-weight:700;color:${BG}">Meine Gesamtersparnis</div>
  <div style="display:flex;align-items:baseline;gap:8px;color:${BG}"><span class="bnum" id="j83n" style="font-size:64px;font-weight:800;letter-spacing:-.02em">0,00</span><span style="font-size:44px;font-weight:800">€</span></div></div>
<div class="jg" id="jLast" style="left:228px;top:560px;width:437px;height:226px;padding:20px 26px;box-sizing:border-box">
  <div style="font-size:24px;font-weight:700;color:${BG}">Letzte Einkäufe</div>
  <div id="jLastRows" style="margin-top:12px;display:flex;flex-direction:column;gap:12px"></div></div>
""")
rep("const fsCircle=(n,d)=>`<img src=\"${PTA[n]}\" alt=\"\" style=\"width:${d}px;height:${d}px;border-radius:50%;flex:none\">`;",
    "const fsCircle=(n,d)=>`<img src=\"${PTA[n]}\" alt=\"\" style=\"width:${d}px;height:${d}px;border-radius:50%;flex:none\">`;\n"
    "$('j100Row').innerHTML=['adeg','bipa','omv','penny'].map(n=>fsCircle(n,72)).join('');\n"
    "$('jLastRows').innerHTML=[['bipa','BIPA','Heute','24,90 €'],['adeg','ADEG','Gestern','61,35 €']].map(([n,b,d,v])=>`<div style=\"display:flex;align-items:center;gap:16px\">${fsCircle(n,60)}<div style=\"flex:1\"><div style=\"font-size:22px;font-weight:700;color:#79211b\">${b}</div><div style=\"font-size:17px;font-weight:500;color:#79211b;opacity:.75\">${d}</div></div><div style=\"font-size:22px;font-weight:700;color:#79211b\">${v}</div></div>`).join('');")
rep("model(P){const c=[P.firstCard,P.firstCard+P.cardGap,P.firstCard+2*P.cardGap];", "model(P){const c=[P.firstCard,P.firstCard+P.cardGap,P.firstCard+2*P.cardGap,P.firstCard+3*P.cardGap];")
rep("[['jHallo',0,-40,1.2],['j100',1,40,1.12],['j83',2,40,1.28]].forEach(", "[['jHallo',0,-40,1.2],['j100',1,40,1.12],['j83',2,40,1.28],['jLast',3,-40,1.16]].forEach(")
rep("e.style.transformOrigin=['100% 50%','100% 50%','0 30%'][i]});", "e.style.transformOrigin=['100% 50%','100% 50%','0 30%','100% 50%'][i]});")
rep("const cc=eIO(seg(t,M.c[1]+.15,M.c[1]+1));$('j100Arc').setAttribute('stroke-dashoffset',(188.5*(1-Math.min(1,P.oes/100)*cc)).toFixed(1));\n", "")
rep("$('j83n').textContent=Math.round(P.oes*eIO(seg(t,M.c[2]+.1,M.c[2]+.9)));", "$('j83n').textContent=(327.65*eIO(seg(t,M.c[2]+.1,M.c[2]+.9))).toFixed(2).replace('.',',');")
rep("E.plus.style.transform=`translateY(${(-40*fl).toFixed(1)}px) scale(${(.5+.5*e).toFixed(4)})", "E.plus.style.transform=`translateY(${(-40*fl).toFixed(1)}px) scale(${((.5+.5*e)*1.45).toFixed(4)})")   # Kundenfeedback: +Ös-Pille bei Tamara größer
# Formate: App-Download-Pille (wie auf dem Billboard) unten in der Wocheneinkauf-Karte
rep("const pts=[...row.querySelectorAll('.bbPt')],r0=BILL.render;", "{const h=document.querySelector('.fmAppPill'),src=$('bbPill');if(h&&src){const c=src.cloneNode(true);c.removeAttribute('id');Object.assign(c.style,{left:'0',top:'0',transform:'scale(.34)',transformOrigin:'0 0',boxShadow:'0 14px 34px rgba(60,10,0,.18)'});h.appendChild(c)}}\n const pts=[...row.querySelectorAll('.bbPt')],r0=BILL.render;")
# Kunde: Julian-UI – nur die beigen Karten haben runde Ecken, die Verlaufsflächen sind eckig (von der Karte beschnitten)
for _r in ("border-radius:28px 0 0 28px;background:${UIG}", "border-radius:40px 40px 0 0;background:${UIG}", "border-radius:22px 22px 0 0;background:${UIG}", "border-radius:0 0 30px 30px;background:${UIG}"):
    rep(_r, "border-radius:0;background:${UIG}")
# Verlauf liegt hinten, darüber die beige Fläche mit runden Ecken an der Kante zum Verlauf
_bz = "position:absolute;background:${CR};"
rep('<div style="position:absolute;left:324px;top:0;right:0;bottom:0;border-radius:0;background:${UIG}"></div>',
    '<div style="position:absolute;left:300px;top:0;right:0;bottom:0;background:${UIG}"></div><div style="' + _bz + 'left:-1px;top:-1px;bottom:-1px;width:353px;border-radius:0 28px 28px 0"></div>')
rep('<div style="position:absolute;left:0;right:0;top:86px;bottom:0;border-radius:0;background:${UIG}"></div>',
    '<div style="position:absolute;left:0;right:0;top:50px;bottom:0;background:${UIG}"></div><div style="' + _bz + 'left:-1px;right:-1px;top:-1px;height:87px;border-radius:0 0 28px 28px"></div>')
rep('<div style="position:absolute;left:0;right:0;top:0;height:122px;border-radius:0;background:${UIG}"></div>',
    '<div style="position:absolute;left:0;right:0;top:0;height:150px;background:${UIG}"></div><div style="' + _bz + 'left:-1px;right:-1px;top:122px;bottom:-1px;border-radius:28px 28px 0 0"></div>')
rep("$('ui_ring').innerHTML=`<div style=\"position:absolute;inset:0;border-radius:24px;overflow:hidden;background:${CR}\">",
    "$('ui_ring').innerHTML=`<div style=\"position:absolute;inset:0;border-radius:24px;overflow:hidden;background:${CR}\"><div style=\"position:absolute;left:0;right:0;top:283px;bottom:0;background:${UIG}\"></div><div style=\"" + _bz + "left:-1px;right:-1px;top:-1px;height:312px;border-radius:0 0 28px 28px\"></div>")
rep("$('ui_jump').innerHTML=`<div style=\"position:absolute;inset:0;", "$('ui_jump').innerHTML=`<div style=\"position:absolute;left:0;top:0;width:560px;height:368px;zoom:.8;")  # Kachel mit der Frau 80 %
rep("position:absolute;right:38px;top:28px;font-size:29px", "position:absolute;z-index:1;right:38px;top:28px;font-size:29px")
rep("top:311px;bottom:0;border-radius:0;background:${UIG};display:flex", "top:311px;bottom:0;border-radius:0;background:none;display:flex")
# Kunde: Julian-UI-Elemente rund um die Headline „Dein persönlicher digitaler Begleiter.“, die mit derselben Parallaxe mitläuft
rep(" {id:'jump',name:'Sprung-Kachel',wx:1960,y:70,w:560,h:368,s:1,z:2},\n {id:'save',name:'Ersparnis',wx:2643,y:96,w:537,h:248,s:1,z:2},\n {id:'ring',name:'Ring',wx:3545,y:560,w:312,h:405,s:1.25,z:3},\n {id:'plus',name:'3x Ös (ganz vorne)',wx:2604,y:756,w:330,h:165,s:1.55,z:4},\n {id:'fav',name:'Favoriten (vorne)',wx:2819,y:600,w:542,h:355,s:1.3,z:4}];",
    " {id:'jump',name:'Sprung-Kachel',wx:2040,y:60,w:448,h:294,s:1,z:2,zm:.86},\n {id:'save',name:'Ersparnis',wx:2643,y:60,w:537,h:248,s:1,z:2,zm:.85},\n {id:'hl',name:'Headline',wx:2000,y:322,w:1500,h:330,s:1.12,z:5},\n {id:'ring',name:'Ring',wx:3545,y:676,w:312,h:405,s:1.25,z:3,zm:.85},\n {id:'plus',name:'3x Ös (ganz vorne)',wx:2650,y:870,w:330,h:165,s:1.55,z:4,zm:.85},\n {id:'fav',name:'Favoriten (vorne)',wx:2840,y:718,w:542,h:355,s:1.3,z:4,zm:.85}];")
rep('<div class="jui" id="ui_fav"></div>', '<div class="jui" id="ui_hl" style="filter:none;color:#6b0505;font-size:150px;font-weight:900;letter-spacing:-.02em;line-height:1.04;text-align:center;display:flex;flex-direction:column;justify-content:center"><div>Dein persönlicher</div><div>digitaler Begleiter.</div></div><div class="jui" id="ui_fav"></div>')
# Kunde: Fliedergrau bleibt hinter den Julian-UI-Elementen, Beige kommt erst mit dem schnellen Rausfahren (kurz vor Farben)
rep("xb=1920*(1-eStFlow(seg(mT,tEnd-1.45,tEnd)))}", "xb=1920*(1-eStFlow(seg(mT,S.clips.colors.start-.45,S.clips.colors.start+.75)))}")
rep("M.items.forEach(it=>{const e=$('ui_'+it.id),x=it.wx-d*it.s;Object.assign(e.style,{left:'0px',top:it.y+'px',width:it.w+'px',height:it.h+'px',zIndex:it.z,transform:`translateX(${x.toFixed(1)}px)`});",
    "M.items.forEach(it=>{const e=$('ui_'+it.id),x=it.wx-d*it.s,zm=it.zm||1;Object.assign(e.style,{left:'0px',top:(it.y/zm)+'px',width:it.w+'px',height:it.h+'px',zIndex:it.z,zoom:zm,transform:`translateX(${(x/zm).toFixed(1)}px)`});")  # Kunde: UI-Elemente etwas kleiner, Abstand zum Bildrand
rep("u=mT-c.start+c.in-J.P.sStart;x=M.P.edge", "u=clipHold('julian',c.in+(mT-c.start)*(c.rate||1))-J.P.sStart;x=M.P.edge")  # Fliedergrau-Kante läuft synchron zum Julian-Scroll (Tempo + Zeitlupe), erscheint erst mit dem Slider
# Billboard: Verlauf liegt hinten (volle Breite), Beige mit runden Ecken fährt darüber von rechts rein
rep('<div id="bbBig" style="position:absolute;left:0;top:0;width:2300px;height:1000px;border-radius:0 200px 200px 0;background:${JG_CSS}"></div>',
    '<div style="position:absolute;inset:0;background:${JG_CSS}"></div><div id="bbBig" style="position:absolute;right:-2px;top:-2px;width:0;height:1004px;border-radius:200px 0 0 200px;background:#f4f1ea"></div>')
rep("E.big.style.width=(3300-1000*b).toFixed(1)+'px';E.big.style.borderRadius=`0 ${(200*b).toFixed(1)}px ${(200*b).toFixed(1)}px 0`;",
    "E.big.style.width=(1002*b).toFixed(1)+'px';E.big.style.borderRadius=`${(200*b).toFixed(1)}px 0 0 ${(200*b).toFixed(1)}px`;")
rep("      c.style.opacity=1;", "      c.style.opacity=i?1:seg(t,.66,.85).toFixed(3); // Beige-Fläche blendet erst auf, solange darunter noch Julian läuft")
# „Konsistent über alle Kanäle.“ setzt auf dem Drop bei F2852 ein: Start 2 Schläge früher (aus dem Halte-Ende des Tag-Systems), Ende bleibt
_kd = round(2 * BEAT, 4)
CLIPS["tags"]["len"] = round(CLIPS["tags"]["len"] - _kd, 4)
CLIPS["kanal"]["start"] = round(CLIPS["kanal"]["start"] - _kd, 4); CLIPS["kanal"]["len"] = round(CLIPS["kanal"]["len"] + _kd, 4)
_kn = 4 * CLIPS["kanal"]["len"] / BARL   # Subebene läuft im Takt-Raster (4 Einheiten pro Takt)
PARAMS["kanal"] = {"len": round(_kn, 3), "inAt": 0, "outAt": round(_kn - .85, 3)}   # erstes Wort direkt auf dem Drop, Ausblenden wie bisher kurz vor den Formaten
# Farben wie im Editor gesetzt (Start nach Julian, tiefer in die Subebene)
_ce = round(CLIPS["colors"]["start"] + CLIPS["colors"]["len"], 4)
# Julian → Farben als durchgehende Bewegung: Farbkarten fahren schon rein, während Julians Karten links rausgleiten;
# Julian hält darunter sein leeres Beige-Endbild, bis die Beige-Karte deckt (kein Schwarz-Frame)
_co0 = 18.504
CLIPS["colors"] = C(_co0, round(_ce - _co0, 4), .2); CLIPS["colors"]["rate"] = round((NATIVE_CO - .2) / CLIPS["colors"]["len"], 5)
for k in ("julian", "white2"):
    CLIPS[k]["len"] = round(20.2 - CLIPS[k]["start"], 4)
# Zoom in Kians Kreis setzt auf dem Drop bei F878 (36,58 s) ein; Kian-Video schließt direkt an und endet wie bisher
_fz = 15.9
PARAMS["fuer"] = {**PARAMS["fuer"], "zoomAt": _fz}
_fe = round(CLIPS["fuer"]["start"] + _fz * BEAT + 1.4 + 1 / 24, 4)
_re = CLIPS["rabatt"]["start"] + CLIPS["rabatt"]["len"]
CLIPS["rabatt"]["rate"] = round(CLIPS["rabatt"]["len"] / (_re - _fe), 5)
CLIPS["rabatt"]["start"], CLIPS["rabatt"]["len"] = _fe, round(_re - _fe, 4)
CLIPS["fuer"]["len"] = round(_fe - CLIPS["fuer"]["start"], 4)
# Synth-Hits (Takt-Einsen in den drei Energie-Teilen, aus dem Audio gemessen) – Bewegungen in der Nähe genau darauf:
# Kian-Video: Banner „Mehr für Kian.“ auf F933, Pill auf den nächsten Schlag F946, Pill schrumpft auf F988
PARAMS["rabatt"] = {**PARAMS.get("rabatt", {}), "banAt": .3544, "inAt": .875, "outAt": 2.3835}
PARAMS["fuer"] = {**PARAMS["fuer"], "cloudAt": 12}            # Profil-Wolke auf F823
PARAMS["brand"] = {**PARAMS.get("brand", {}), "step": .75}  # bei rate .75 = exakt ein Schlag pro Partnerfarbe (vorher .71 = 13,0 F → driftete bis 7 F vom Hit)
PARAMS["formats"] = {**PARAMS.get("formats", {}), "sh": 1.09}
CLIPS["brand"]["in"] = .0625   # 2 F Vorlauf, damit die Kreise sichtbar genau auf dem Schlag aufgehen  # Bildschirm 2 und 3 starten auf F3072 / F3182
# Mockup-Teil: Schnitte auf die Takt-Einsen (vorher auf Schlag 4/2/3 → fühlte sich off-beat an)
_db = lambda k: round((3456.3 + k * 54.9) / 24, 4)   # gemessene Takt-Einsen ab F3456
CLIPS["c5"]["start"], CLIPS["c5"]["len"] = _db(0), round(_db(1) - _db(0), 4)
CLIPS["deal"]["len"] = round(_db(0) - CLIPS["deal"]["start"], 4)
CLIPS["city"] = {**C(_db(1), round(_db(4) - _db(1), 4)), "rate": round(4.317 / (_db(4) - _db(1)), 4)}   # 3 Takte
CLIPS["ubahn"] = C(_db(4), round(_db(6) - _db(4), 4)); PARAMS["ubahn"] = {"len": CLIPS["ubahn"]["len"]}  # 2 Takte
CLIPS["bill"]["start"] = _db(6); CLIPS["bill"]["len"] = round(_et - _db(6), 4)                           # bis zum Schluss-Text
# Farben → Verlauf auf den Hit bei F548 (vorher ~F579): Wechsel 30 F früher, Verlaufs-Phase entsprechend länger
_sh = 30 / 24 * CLIPS["colors"]["rate"] / BEAT
PARAMS["colors"] = {**PARAMS["colors"], "beatsB": round(PARAMS["colors"]["beatsB"] - _sh, 4), "beatsC": round(PARAMS["colors"]["beatsC"] + _sh, 4)}
PARAMS["prod"] = {**PARAMS.get("prod", {}), "ppIn": .5, "ppStag": .1}
PARAMS["logo2"] = {**PARAMS.get("logo2", {}), "outAt": round((4278.7 - 1.5) / 24 - CLIPS["logo2"]["start"] + CLIPS["logo2"]["in"], 4)}   # Übergang ins App-Icon auf dem Hit
# „Konsistent über alle Kanäle.“ geht auf dem Drop F2908 raus, Formate gleiten schon währenddessen hoch (kein leerer Screen)
_ks, _fe0 = CLIPS["kanal"]["start"], CLIPS["formats"]["start"] + CLIPS["formats"]["len"]
CLIPS["kanal"]["len"] = round(2918 / 24 - _ks, 4)
PARAMS["kanal"] = {**PARAMS["kanal"], "len": round(CLIPS["kanal"]["len"] * 4 / BARL, 3), "outAt": round((2906.5 / 24 - _ks) * 4 / BARL, 3)}
_fs = round(2900 / 24, 4)
PARAMS["formats"] = {**PARAMS["formats"], "sh": round(PARAMS["formats"]["sh"] + CLIPS["formats"]["start"] - _fs, 4), "clearUntil": round(2918 / 24 - _fs, 3)}
CLIPS["formats"]["start"], CLIPS["formats"]["len"] = _fs, round(_fe0 - _fs, 4)
# „Rebranding by“ erscheint auf dem Hit F4336: Endcard 28,5 F früher, Pill bleibt auf dem Bass
_ed = round(28.5 / 24, 4); _ec2 = round(CLIPS["endc"]["start"] - _ed, 4)
CLIPS["endc"] = C(_ec2, round(190 - _ec2, 4))
PARAMS["endc"] = {**PARAMS["endc"], **{k: round(PARAMS["endc"][k] + _ed, 3) for k in ("outAt", "linkAt", "pillAt")}}
for k in ("logo2", "endtxt"):
    CLIPS[k]["len"] = round(_ec2 - CLIPS[k]["start"], 4)
CLIPS["hl1b"]["start"] = 9000.0   # Kundenfeedback: Headline 1b entfällt, das Tanken-Video läuft allein
# Kundenfeedback: Banner „Mehr für Kian/Tamara.“ raus, Rabattsammler-Pill größer; Tafel „So persönlich wie nie zuvor.“ raus –
# ihre 2 Takte gehen an die Menschen (6 Schläge pro Person), alles danach bleibt stehen
PARAMS["rabatt"] = {**PARAMS["rabatt"], "banner": 0, "sc": 1.15, "y": 300, "cx": 720}
PARAMS["cloud"] = {**PARAMS.get("cloud", {}), "banner": 0}
_c3 = CLIPS["c3"]["start"]; _pe = CLIPS["people"]["start"] + CLIPS["people"]["len"]
CLIPS["pers"]["start"] = _c3
CLIPS["people"]["start"] = round(_c3 + CLIPS["pers"]["len"], 4); CLIPS["people"]["len"] = round(_pe - CLIPS["people"]["start"], 4)
PARAMS["people"] = {**PARAMS["people"], "sb": 6}
CLIPS["c3"]["start"] = 9000.0
# Neue Reihenfolge (Kunde): Partner (ohne „Eine Welt voller Marken.“) → Marken-Lockups → Menschen → „Eine Welt voller Marken.“ → Prämien
_p0, _pr = CLIPS["people"]["start"], CLIPS["prod"]["start"]
CLIPS["partner"]["start"] = _p0
CLIPS["brand"]["start"] = round(_p0 + CLIPS["partner"]["len"], 4)
CLIPS["people"] = C(round(CLIPS["brand"]["start"] + CLIPS["brand"]["len"], 4), round(5 * BARL, 4))
PARAMS["people"] = {**PARAMS["people"], "sb": 5}
CLIPS["welt"] = C(round(CLIPS["people"]["start"] + CLIPS["people"]["len"], 4), 0); CLIPS["welt"]["len"] = round(_pr - CLIPS["welt"]["start"], 4)
PARAMS["welt"] = {"len": round(CLIPS["welt"]["len"] * 4 / BARL, 3), "outAt": round(CLIPS["welt"]["len"] * 4 / BARL - .85, 3)}
PARAMS["partner"] = {**PARAMS["partner"], "sent": 1000, "sent2": 6.45}
# Kunde: „Eine Welt voller Marken.“-Tafel, Prämien, Tag-System, „Eigenständig im Auftritt.“ raus → Film genau 8 Takte kürzer.
# Musik-Schnitt bei 100,545 s um 8 Takte (18,285 s): die Takte davor klingen wie die vor dem Drop, der Film springt direkt in den Drop;
# alles ab „Flexibel im Zusammenspiel.“ rückt um genau diese Länge vor und bleibt dadurch auf den Hits
AU_CA, AU_CD = 100.545, round(8 * 45.7136 / 20, 5)
_ce = CLIPS["city"]["start"] + CLIPS["city"]["len"]
CLIPS["city"] = {**C(CLIPS["c5"]["start"], round(_ce - CLIPS["c5"]["start"], 4)), "rate": round(4.317 / (_ce - CLIPS["c5"]["start"]), 4)}  # Citylight bekommt den Takt von „Eigenständig“
for k in ("welt", "prod", "tags", "c5"):
    CLIPS[k]["start"] = 9000.0
_kn2 = round(CLIPS["kanal"]["start"] - AU_CD, 4)
CLIPS["partner"]["len"] = round(4 * BARL, 4); PARAMS["partner"] = {**PARAMS["partner"], "lOut": 5.6, "sent2": 5.65}
CLIPS["brand"]["start"] = round(CLIPS["partner"]["start"] + CLIPS["partner"]["len"], 4)
CLIPS["people"] = C(round(CLIPS["brand"]["start"] + CLIPS["brand"]["len"], 4), round(4 * BARL, 4)); PARAMS["people"] = {**PARAMS["people"], "sb": 4}
CLIPS["system"]["start"] = round(CLIPS["people"]["start"] + CLIPS["people"]["len"], 4)
_bo = CLIPS["badges"]["len"]
CLIPS["badges"] = {**C(round(CLIPS["system"]["start"] + CLIPS["system"]["len"], 4), round(4 * BARL, 4)), "rate": round(_bo / (4 * BARL), 4)}
_wo = CLIPS["wall"]["len"]; _ws = round(CLIPS["badges"]["start"] + CLIPS["badges"]["len"], 4)
CLIPS["wall"] = {**C(_ws, round(_kn2 - _ws, 4)), "rate": round(_wo / (_kn2 - _ws), 4)}
for k, v in CLIPS.items():
    if 118.0 <= v["start"] < 1000:
        v["start"] = round(v["start"] - AU_CD, 4)
rep(f"const T_MAIN={T_LEN}, FPS=24, TRACK_LEN=187.48;", f"const T_MAIN={round(T_LEN - AU_CD, 2)}, FPS=24, TRACK_LEN={round(187.48 - AU_CD, 2)};")
rep("abufAt='loop';return out}",
    "abufAt='loop';{const ca=Math.round(AU_CA*sr),cd=Math.round(AU_CD*sr),o2=actx.createBuffer(abuf0.numberOfChannels,n-cd,sr); // 8-Takt-Schnitt (Kunde): Takte vor dem Drop fallen weg\n"
    "    for(let ch=0;ch<abuf0.numberOfChannels;ch++){const d=out.getChannelData(ch),e=o2.getChannelData(ch);e.set(d.subarray(0,ca));e.set(d.subarray(ca+cd),ca);for(let i=0;i<xf;i++){const w=i/xf;e[ca+i]=d[ca+cd+i]*w+d[ca+i]*(1-w)}}\n"
    "    return o2}}")
rep("PEAKS.push(...tail)}\n", "PEAKS.push(...tail)}\n"
    f"const AU_CA={AU_CA},AU_CD={AU_CD};{{const per=(96.0522+AU_LN*AU_LL)/PEAKS.length;PEAKS.splice(Math.round(AU_CA/per),Math.round(AU_CD/per));"
    "const nb=BEATS.filter(v=>v<AU_CA-.02).concat(BEATS.filter(v=>v>=AU_CA+AU_CD-.02).map(v=>+(v-AU_CD).toFixed(3)));BEATS.length=0;BEATS.push(...nb);BAR.length=0;for(let i=0;i*4<BEATS.length;i++)BAR.push(+BEATS[i*4].toFixed(2))}\n")
# Kunde, Ende: „Gemeinsam mehr“ steht, darunter Sichtbarkeit. → Relevanz. → Verbindung. → jö-Logo → „Österreichs größte tägliche Markenbühne.“ → jö im App-Icon (Hit) → H·A
_e0 = CLIPS["endtxt"]["start"]
PARAMS["endtxt"] = {**PARAMS["endtxt"], "aIn": .25, "aOut": 11.0, "bIn": 1.25, "hold": 3.5, "bOut": 11.0, "cIn": 16.75, "cOut": 22.25}
CLIPS["logo4"] = C(round(_e0 + 11.0 * BEAT, 4), round(5.5 * BEAT, 4))
_mo = CLIPS["logo2"]["start"] + PARAMS["logo2"]["outAt"] - CLIPS["logo2"]["in"]          # Übergang ins App-Icon bleibt auf dem Hit
_l2 = round(_e0 + 23.0 * BEAT, 4); _end2 = CLIPS["logo2"]["start"] + CLIPS["logo2"]["len"]
CLIPS["logo2"] = C(_l2, round(_end2 - _l2, 4), round(PARAMS["logo2"]["outAt"] - (_mo - _l2), 4))
PARAMS["logo2"] = {**PARAMS["logo2"]}
# Kunde: Partner nur „Eine Welt voller Marken.“; „Ein gemeinsames Markenerlebnis.“ erst, wenn alle Marken-Kreise im jö-Icon sind (F1467)
# – dafür 1 Takt mehr Partner, die Angebots-Wand wird um den Takt kürzer (läuft etwas schneller), der Schnitt in den Drop bleibt
PARAMS["partner"] = {**PARAMS["partner"], "lOut": round((1461 / 24 - CLIPS["partner"]["start"]) * .75, 3), "sent2": round((1464.5 / 24 - CLIPS["partner"]["start"]) * .75, 3)}
CLIPS["partner"]["len"] = round(CLIPS["partner"]["len"] + BARL, 4)
for k in ("brand", "people", "system", "badges"):
    CLIPS[k]["start"] = round(CLIPS[k]["start"] + BARL, 4)
_wn = CLIPS["wall"]["rate"] * CLIPS["wall"]["len"]
CLIPS["wall"]["start"] = round(CLIPS["wall"]["start"] + BARL, 4); CLIPS["wall"]["len"] = round(CLIPS["wall"]["len"] - BARL, 4); CLIPS["wall"]["rate"] = round(_wn / CLIPS["wall"]["len"], 4)
# Kunde: „Ganz nach dir.“ raus; sein Takt geht an den Julian-Screen mit allen Karten (Slider startet 1 Takt später) –
# Farben, Für, Kian, Wolken und Tamara rücken genau 1 Takt nach hinten und bleiben damit auf den Takt-Hits
_jp = CLIPS["pers"]["start"]; CLIPS["pers"]["start"] = 9000.0
PARAMS["julian"] = {**PARAMS["julian"], "sStart": round(PARAMS["julian"]["sStart"] + BARL * CLIPS["julian"]["rate"], 4)}
_js0 = CLIPS["julian"]["start"]
for k, v in CLIPS.items():
    if _js0 + .5 < v["start"] < _jp - .01:
        v["start"] = round(v["start"] + BARL, 4)
for k in ("julian", "white2"):
    CLIPS[k]["len"] = round(CLIPS[k]["len"] + BARL, 4)
# Kunden-Feedback (WhatsApp): Rabattsammler-Pill nicht übers Gesicht; Partner-Logos fliegen früher ein (Takt zurück an die Wand);
# jö-Logo hinter den Menschen größer; Formate Bildschirm 1 kürzer (Wechsel 2 und 3 je 1 Takt früher, weiter auf Hits)
PARAMS["rabatt"] = {**PARAMS["rabatt"], "sc": .85, "cx": 470, "y": 300}
_pd = round(BARL * .75, 3)
PARAMS["partner"] = {**PARAMS["partner"], **{k: round(PARAMS["partner"][k] - _pd, 3) for k in ("hit", "lOut", "sent2")}}
CLIPS["partner"]["len"] = round(CLIPS["partner"]["len"] - BARL, 4)
for k in ("brand", "people", "system", "badges"):
    CLIPS[k]["start"] = round(CLIPS[k]["start"] - BARL, 4)
_wn = CLIPS["wall"]["rate"] * CLIPS["wall"]["len"]
CLIPS["wall"]["start"] = round(CLIPS["wall"]["start"] - BARL, 4); CLIPS["wall"]["len"] = round(CLIPS["wall"]["len"] + BARL, 4); CLIPS["wall"]["rate"] = round(_wn / CLIPS["wall"]["len"], 4)
PARAMS["formats"] = {**PARAMS["formats"], "sh": round(PARAMS["formats"]["sh"] - BARL, 4)}
# Kunde: Julian-UI-Screen 1 Takt länger (Standbild in Julian), dafür startet Farben 1 Takt später (Ende bleibt, etwas schneller)
for k in ("julian", "white2"):
    CLIPS[k]["len"] = round(CLIPS[k]["len"] + BARL, 4)
_cn = CLIPS["colors"]["len"] * CLIPS["colors"]["rate"]
CLIPS["colors"]["start"] = round(CLIPS["colors"]["start"] + BARL, 4); CLIPS["colors"]["len"] = round(CLIPS["colors"]["len"] - BARL, 4); CLIPS["colors"]["rate"] = round(_cn / CLIPS["colors"]["len"], 5)
PARAMS["city"] = {**PARAMS.get("city", {}), "start": 0, "speed": 1.8}   # Kunde: Citylight nicht so lange leer – Aufbau sofort und schneller
PARAMS["ubahn"] = {**PARAMS["ubahn"]}
# Citylight → U-Bahn auf den Hit F3182 (1 Takt früher), U-Bahn 1 Takt länger
_ub = round(3182.2 / 24, 4); _ue = CLIPS["ubahn"]["start"] + CLIPS["ubahn"]["len"]
_cn = CLIPS["city"]["len"] * CLIPS["city"]["rate"]
CLIPS["city"]["len"] = round(_ub - CLIPS["city"]["start"], 4); CLIPS["city"]["rate"] = round(_cn / CLIPS["city"]["len"], 4)
CLIPS["ubahn"]["start"], CLIPS["ubahn"]["len"] = _ub, round(_ue - _ub, 4); PARAMS["ubahn"] = {**PARAMS["ubahn"], "len": CLIPS["ubahn"]["len"]}
# Kunde: Tamara-Video 1 Takt kürzer (Schnitt ~F1208), der Takt geht an „Eine Welt voller Marken.“ (steht länger), Rest bleibt
CLIPS["cloud"]["len"] = round(CLIPS["cloud"]["len"] - BARL, 4)
CLIPS["partner"]["start"] = round(CLIPS["partner"]["start"] - BARL, 4); CLIPS["partner"]["len"] = round(CLIPS["partner"]["len"] + BARL, 4)
_pd2 = round(BARL * .75, 3)
PARAMS["partner"] = {**PARAMS["partner"], "swap": round(PARAMS["partner"].get("swap", 2) + _pd2, 3), **{k: round(PARAMS["partner"][k] + _pd2, 3) for k in ("hit", "lOut", "sent2")}}
# Kunde: Citylight kürzer (1 Takt) – startet 1 Takt später, die Anzeigen davor laufen entsprechend langsamer; U-Bahn bleibt auf dem Hit F3182
_dn = CLIPS["deal"]["len"] * CLIPS["deal"].get("rate", 1)
CLIPS["deal"]["len"] = round(CLIPS["deal"]["len"] + BARL, 4); CLIPS["deal"]["rate"] = round(_dn / CLIPS["deal"]["len"], 4)
_cn2 = CLIPS["city"]["len"] * CLIPS["city"]["rate"]
CLIPS["city"]["start"] = round(CLIPS["city"]["start"] + BARL, 4); CLIPS["city"]["len"] = round(CLIPS["city"]["len"] - BARL, 4); CLIPS["city"]["rate"] = round(_cn2 / CLIPS["city"]["len"], 4)
# Kunde: U-Bahn und Billboard so lang wie das Citylight (2 Takte); die freie Zeit bis zum Schluss-Text = schwarzer Platzhalter „POS-System“
_L2 = CLIPS["city"]["len"]
CLIPS["ubahn"]["len"] = _L2; PARAMS["ubahn"] = {**PARAMS["ubahn"], "len": _L2}
_bn = CLIPS["bill"]["len"] * CLIPS["bill"].get("rate", 1); _be = CLIPS["bill"]["start"] + CLIPS["bill"]["len"]
CLIPS["bill"]["start"] = round(CLIPS["ubahn"]["start"] + _L2, 4); CLIPS["bill"]["len"] = _L2; CLIPS["bill"]["rate"] = round(_bn / _L2, 4)
CLIPS["pos"] = C(round(CLIPS["bill"]["start"] + _L2, 4), 0); CLIPS["pos"]["len"] = round(_be - CLIPS["pos"]["start"], 4)
PARAMS["pos"] = {"len": round(CLIPS["pos"]["len"] / BEAT, 3), "outAt": round(CLIPS["pos"]["len"] / BEAT + 1, 3)}
# Kunde: Beige fährt ruhiger rein – Farben startet 0,5 s später (Ende bleibt, etwas schneller)
_cn3 = CLIPS["colors"]["len"] * CLIPS["colors"]["rate"]
CLIPS["colors"]["start"] = round(CLIPS["colors"]["start"] + .5, 4); CLIPS["colors"]["len"] = round(CLIPS["colors"]["len"] - .5, 4); CLIPS["colors"]["rate"] = round(_cn3 / CLIPS["colors"]["len"], 5)
# Kunde: „Eine Welt voller starker Marken.“ zu lang – 1 Takt raus (Partner-Ablauf früher), der Takt geht an die Angebots-Wand
_pd3 = round(BARL * .75, 3)
PARAMS["partner"] = {**PARAMS["partner"], **{k: round(PARAMS["partner"][k] - _pd3, 3) for k in ("swap", "hit", "lOut", "sent2")}}
CLIPS["partner"]["len"] = round(CLIPS["partner"]["len"] - BARL, 4)
for k in ("brand", "people", "system", "badges"):
    CLIPS[k]["start"] = round(CLIPS[k]["start"] - BARL, 4)
_wn3 = CLIPS["wall"]["rate"] * CLIPS["wall"]["len"]
CLIPS["wall"]["start"] = round(CLIPS["wall"]["start"] - BARL, 4); CLIPS["wall"]["len"] = round(CLIPS["wall"]["len"] + BARL, 4); CLIPS["wall"]["rate"] = round(_wn3 / CLIPS["wall"]["len"], 4)
block = f"S.warp={{r0:{WR0_REAL}}};S.clips.white.len=8.7;\n" + "\n".join(f"S.clips.{k}={{start:{v['start']},len:{v['len']},in:{v['in']}" + (f",rate:{v['rate']}" if 'rate' in v else "") + "};" for k, v in CLIPS.items()) + "\n"
block += "".join(f"Object.assign(S.comps.{k}.params,{json.dumps(v)});FM.{k}=COMPS.{k}.model(S.comps.{k}.params);\n" for k, v in PARAMS.items())
rep("w.style.transform=`translateY(${((1-eExpo(p))*110+eInCub(q)*110).toFixed(2)}%)`", "w.style.transform=`translateY(${((1-eExpo(p))*110+eInCub(q)*110*(P.outDir||1)).toFixed(2)}%)`")  # Tafeln: Ausstieg wahlweise nach oben
rep("COMPS[k].render(FM[k],Math.min(c.in+t-c.start,FM[k].total))", "COMPS[k].render(FM[k],Math.min(clipHold(k,c.in+(t-c.start)*(c.rate||1)),FM[k].total))")  # Clip-Tempo: rate < 1 = langsamer; clipHold = Standbild-Abschnitt
rep("function wDesign(", f"const CL_HOLD={{julian:[3.75,1.6,{round(BARL*.76873,4)}],white2:[3.75,1.6,{round(BARL*.76873,4)}]}};function clipHold(k,u){{const h=CL_HOLD[k];if(!h||u<=h[0])return u;const L=h[1]+h[2];if(u>=h[0]+L)return u-h[2];const x=(u-h[0])/L,m=.9,f=(1-m)*x+m*(.5+4*Math.pow(x-.5,3));return h[0]+h[1]*f}} // Kunde: Julian-UI-Screen – schnell rein, in der Mitte ganz langsam (nie stehend), schnell wieder raus\nfunction wDesign(")
rep("let db=null;const DOC_TL='jo/timeline'", block + "let db=null;const DOC_TL='jo/timeline'")

s = s.replace("__ECICON__", "data:image/webp;base64," + base64.b64encode((here / "endc_icon.webp").read_bytes()).decode())
(here / "index.html").write_text(s, encoding="utf-8")
# Player-Version zum Teilen: nur das Video, ohne Timeline, Header und Infos
_pc = """<style id="playerOnly">
html,body{margin:0;height:100%;background:#000;overflow:hidden}
.wrap{position:fixed!important;inset:0!important;width:auto!important;max-width:none!important;padding:0!important;margin:0!important;display:flex;align-items:center;justify-content:center}
.wrap>header,#viewMain>.tl,#info,#viewMain .controls>*:not(#mPlay){display:none!important}
#vp{position:relative;margin:0!important;border-radius:0!important;cursor:pointer}
#viewMain{position:fixed;left:0;right:0;bottom:0;padding:0!important;margin:0!important;background:none!important}
#viewMain .controls{justify-content:center;padding:0 0 18px!important;background:none!important;opacity:0;transition:opacity .25s}
body:hover #viewMain .controls,body.paused #viewMain .controls{opacity:1}
#mPlay{width:64px!important;height:64px!important}
</style>"""
_ps = """<script>
(function(){const vp=document.getElementById('vp');
 function sz(){const w=Math.min(innerWidth,innerHeight*16/9);vp.style.width=w+'px';vp.style.height=(w*9/16)+'px';try{fit()}catch(e){}}
 addEventListener('resize',sz);sz();setTimeout(sz,300);
 vp.addEventListener('click',()=>document.getElementById('mPlay').click());
 const upd=()=>document.body.classList.toggle('paused',document.getElementById('mPlay').getAttribute('aria-label')!=='Pausieren');setInterval(upd,250);
 document.title='jö Partnerfilm';})();
</script>"""
_p = s.replace("</head>", _pc + "</head>", 1).replace("</body>", _ps + "</body>", 1)
_p = _p.replace("db=window.claude&&window.claude.use?await window.claude.use('db'):null", "db=null /* Player: keine Datenbank, Timing ist eingebaut */", 1)
_p = _p.replace("<title>jö Strategiefilm</title>", "<title>jö Partnerfilm</title>", 1)
# Player: Zeitleiste zum Scrubben
_p = _p.replace("window.__t={BEATS,", "window.__t={get mT(){return mT},BEATS,", 1)
_p = _p.replace("</style></head>", """#pBar{position:fixed;left:0;right:0;bottom:0;display:flex;align-items:center;gap:16px;padding:14px 22px 18px;background:linear-gradient(transparent,rgba(0,0,0,.55));opacity:0;transition:opacity .25s;z-index:50}
body:hover #pBar,body.paused #pBar,body.drag #pBar{opacity:1}
#pBar input{flex:1;accent-color:#ee2a06;height:6px;cursor:pointer}
#pBar span{color:#fff;font:600 14px/1 var(--font),system-ui,sans-serif;font-variant-numeric:tabular-nums;min-width:92px;text-align:right}
#viewMain .controls{display:none!important}
#pBar #mPlay{flex:none}
</style>
</head>""", 1)
_p = _p.replace("vp.addEventListener('click',()=>document.getElementById('mPlay').click());", """vp.addEventListener('click',()=>document.getElementById('mPlay').click());
 const bar=document.createElement('div');bar.id='pBar';bar.innerHTML='<input type="range" min="0" max="1000" step="1" value="0" aria-label="Zeitleiste"><span>0:00 / 0:00</span>';document.body.appendChild(bar);
 bar.prepend(document.getElementById('mPlay'));
 const rg=bar.querySelector('input'),lb=bar.querySelector('span');let drag=false;
 const END=()=>{try{const c=window.__t.S.clips.endc;return c.start+c.len}catch(e){return 171.7}};
 const fm=x=>Math.floor(x/60)+':'+String(Math.floor(x%60)).padStart(2,'0');
 rg.addEventListener('input',()=>{drag=true;document.body.classList.add('drag');window.__t.mSeek(rg.value/1000*END())});
 rg.addEventListener('change',()=>{drag=false;document.body.classList.remove('drag')});
 setInterval(()=>{const t=window.__t?window.__t.mT:0,e=END();if(!drag)rg.value=Math.round(Math.min(1,t/e)*1000);lb.textContent=fm(t)+' / '+fm(e)},100);""", 1)
(here / "player.html").write_text(_p, encoding="utf-8")

tl = json.loads((here / "timeline_markenfilm.json").read_text())
for k in DROP:
    tl["clips"].pop(k, None)
tl["clips"].update(CLIPS)
tl["warp"] = {"r0": WR0_REAL}
(here / "timeline_partnerfilm.json").write_text(json.dumps(tl, indent=1), encoding="utf-8")
print("Ende", END, "AU_CUT", AU_CUT, "Logo2", LOGO2)
for k, v in sorted(CLIPS.items(), key=lambda kv: kv[1]["start"]):
    print(f"  {k:8s} {v['start']:7.3f} – {v['start'] + v['len']:7.3f}")
