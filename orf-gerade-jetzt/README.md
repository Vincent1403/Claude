# Gerade jetzt – ORF Public-Value-Bericht 2026/27

Konzept: Der Bericht wird zum Arbeitsheft. Er erzählt, was der ORF gerade jetzt für das
Gemeinwohl tut, und bittet die Leser:innen, gerade jetzt selbst etwas zu tun. Erst durch
die Benutzung wird das Heft fertig.

Zusammengeführt aus dem Chat „Werteberichte ORF und interaktive Ideen“ und den Artefakten
daraus (Stand 28.10.2026):

| Quelle | Inhalt | Hier im Repo |
|---|---|---|
| [Mitmach-Doppelseiten](https://claude.ai/artifact/1LXvJ7H1SpHcQZCbpHamus) (Doc) | Ideensammlung, Kapitelstruktur, Aufgaben | dieses README |
| [Doppelseite Vertrauen](https://claude.ai/artifact/994EWbS8fYXja3ZkM3PsrH) (Design-Canvas) | 3 Print-Doppelseiten, 3 Web-Modul-Entwürfe | `print/src/`, `design-canvas/` |
| [Digitale Module](https://claude.ai/artifact/VZvoAAuz9BwCi2qL71XJBA) (Seite) | Website-Prototyp mit 3 interaktiven Modulen | `web/index.html` |

## Ordner

```
web/index.html        Website-Prototyp, läuft direkt im Browser (Google Fonts + web/assets/)
web/assets/           archiv_figur.webp: Sprite-Sheet der Archiv-Figur (11 Zellen à 280 × 360)
web/sprites/          Referenz-Sheet der Figur + cut.py/sheet.py, die daraus das Sprite-Sheet bauen
print/src/*.dc.html   Doppelseiten-Quellen aus dem Design-Canvas (2× A4 = 1588 × 1123 px)
print/build.py        macht daraus eigenständige Seiten: print/spreads/*.html + print/index.html (Übersicht)
design-canvas/        Original-Quellen der Web-Module aus dem Canvas (brauchen dessen Runtime, nur als Referenz) + canvas.json
```

Print neu bauen, nachdem eine Quelle geändert wurde:

```bash
python3 print/build.py
```

## Aufbau des Hefts

Je Kapitel: Held:innen-Story (Haltung in Zeiten von Gegenwind) → Kapitel-Erklärung →
Beiträge aus dem ORF → Daten & Fakten → ein bis zwei Aufgaben-Doppelseiten, jede an einen
konkreten ORF-Fakt oder ein Programm gekoppelt.

**Durchgängig:** Daumenkino in den Seitenecken: eine Figur richtet sich über das ganze Heft
langsam auf. Gerade stehen, gerade jetzt.

| Kapitel | Arbeitstitel | Dimension → Aufgabe | ORF-Anker | Stand |
|---|---|---|---|---|
| Intro | Gerade stehen | Links „Gerade jetzt.“ mit Pfeil zu „gerade“ („auch: aufrecht“). Rechts: Datum + was dich gerade beschäftigt | Live-Insert: „Gerade jetzt laufen [Zahl] ORF-Programme gleichzeitig.“ | Idee |
| 1 Individueller Wert | Mut ist ansteckend | **Vertrauen**: Schlagzeilen, echte und erfundene, durchstreichen; Auflösung kopfüber | Faktencheck, Zahl geprüfter Meldungen | **Doppelseite** S. 12–13 |
| | | Service: Notfallkarte für die Geldtasche (Blackout, Unwetter, Sender, Frequenz) | Ö3, Landesstudios, Zivilschutz-Warnungen | Idee |
| 2 Gesellschaftswert | Zusammenhalten statt spalten | **Vielfalt**: Seite zum Megafon rollen, fremde Meinung laut sagen | Diskussionsformate, Vielfalt der Stimmen | **Doppelseite** S. 24–25 |
| | | Integration: etwas einkleben, das du von jemandem aus einer anderen Kultur bekommen hast | Volksgruppenprogramme, mehrsprachige Angebote | Idee |
| | | Bürgernähe: Bildschirm ausschneiden, als Rahmen vor etwas halten, das Aufmerksamkeit verdient | Alltagsberichte, Hörer:innen-Formate, Landesstudios | Idee |
| 3 Österreichwert | Erinnern statt vergessen | Föderalismus: Frottage von etwas aus deiner Region; daneben, wie oft das Landesstudio von dort berichtet hat | Neun Landesstudios | Idee |
| 4 Internationaler Wert | Europa statt Algorithmus | Globale Perspektive: Weltkarte ausmalen; Rückseite zeigt die Orte der Korrespondent:innen | Korrespondent:innen-Netz | Idee |
| 5 Unternehmenswert | Wirtschaft für alle | **Transparenz**: Seite ist ein adressiertes Kuvert für Kritik am ORF | Qualitätssicherung, Beschwerdewege, Publikumsrat | **Doppelseite** S. 48–49 |
| Schluss | Gerade jetzt. Und morgen auch. | Erste Seite wieder aufschlagen: Was ist noch wichtig? | | Idee |

**Postkarten** (perforiert im Heft und lose): 1. Hauptvisual mit durchgestrichenem und
überschriebenem Begriffspaar (~~Propaganda~~ Kritik), Rückseite Kernaussagen.
2. „Gerade jetzt: ____“ zum Selbstausfüllen, Rückseite Kernzahlen.

## Spielregeln für die Aufgaben

- **Machen statt ausfüllen.** Reißen, falten, zerknüllen, durchstechen, abreiben, einkleben,
  mitnehmen. Jede Zerstörung hat einen Sinn (zerreißen, um zu teilen …), nie Zerstörung um
  ihrer selbst willen, solange im Haus Kündigungen anstehen.
- **Nachdenklich statt verspielt:** keine Punkte, keine Gewinner, kein Rätselheft-Look.
- **Jede Aufgabe hat einen ORF-Anker:** eine Zahl, ein Format, ein Sender.
- **Ton:** „Gerade jetzt bist du dran.“ Kein erhobener Zeigefinger.
- **Durchgängige Mechanik:** Durchstreichen und Darüberschreiben wie in einer Korrekturfahne.

## Web: „X statt Y“-Module

Die Website behält ihre Struktur. Jedes Modul endet damit, dass ein roter Strich das Wort
durchstreicht, wofür der ORF nicht stehen will.

1. **Erinnern statt Vergessen:** Archivkarton mit Maus/Pfeilen bewegen, sechs fallende
   Momente der Zeitgeschichte (1955 Staatsvertrag … 2008 Fußball-EM) auffangen; sie landen
   im Regal und verlinken auf ORF III.
2. **Kontrolle statt „wird schon stimmen“:** vier Beispiel-Schlagzeilen einschätzen
   (Stimmt / Stimmt nicht / … wird schon stimmen), danach der Prüfweg der Redaktion
   (Quelle → Gegencheck → Entscheidung) mit Stempel.
3. **Haushaltsabgabe statt Abo:** 50-Cent-Münze in den Fernseher ziehen; daraus wachsen
   zwölf Angebote (ZIB, Bundesland heute, Ö1, FM4, ORF III, ÖGS …).

## Gestaltung

- Farben: ORF-Rot `#E2001A`, Rot-Halbton `#F6C2C8`, Tinte `#111111`, Papier `#FFFFFF`,
  Grau `#E4E4E4`; Rasterpunkte in Rot als Fläche.
- Schrift: Archivo (schmal, `wdth 62`, 900, Versalien) für Headlines und Text;
  Print zusätzlich Anton (hochskaliert) für die Riesenzeilen und Permanent Marker für
  Handschrift-Notizen.
- Strichzeichnungen mit 2,5 px Kontur, Figuren in Rot/Weiß/Schwarz.
- Print: Schwarz-Weiß auf ungestrichenem Recycling- oder Zeitungspapier, Fadenheftung oder
  Rückendraht, fünf Papierfarben für fünf Kapitel. Perforationen und Stanzungen sparsam.

## Platzhalter und Offenes

- Alle `[ZAHL]` kommen vom ORF. **Achtung:** Die Vertrauen-Doppelseite zeigt „4029 Meldungen“.
  Das ist ein Beispielwert, keine bestätigte Zahl. Er muss vor dem Druck durch die echte
  Zahl ersetzt oder zu `[ZAHL]` gemacht werden. Dasselbe gilt für `[ORF-LOGO]`.
- Schlagzeilen und Prüfwege im Web-Modul 2 sind Beispiele.
- Widerspruch klären: Die Ideensammlung sagt online „kein interaktiver Nachbau, damit nichts
  nach Spiel aussieht“. Die Digitalen Module sind aber genau das. Entscheiden, welche
  Richtung gilt.
- Ein Heft mit Bericht und Aufgaben gemischt, oder Bericht plus beigelegtes Mitmach-Heft?
- Eine starke Aufgaben-Doppelseite pro Kapitel oder alle Dimensionen?
- Liefert der ORF die Anker-Zahlen (Landesstudio-Beiträge, Beschwerden, Korrespondent:innen)?
- Passt der Arbeitsheft-Ton für die Geschäftsführung?
- 50 Cent am Tag: als nüchterne Fakten-Seite in Kapitel 5 statt als Slogan?
- Auflage und Verteilung von Heft und Postkarten.

## Nächste Schritte

- Doppelseiten für die übrigen Dimensionen (Service, Föderalismus/Frottage, Weltkarte,
  Intro, Schluss, Postkarten) im selben Raster unter `print/src/` anlegen.
- Daumenkino-Figur als Sequenz für die Seitenecken.
- Web-Modul für Kapitel 4 (Europa statt Algorithmus) und Kapitel 2 (Vielfalt).
