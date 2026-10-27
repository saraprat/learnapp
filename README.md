# 🌱 Vinci-Lernapp

Eine kleine, build-freie Lern-App mit mehreren Themen. Reines HTML/CSS/JavaScript –
läuft direkt im Browser und auf GitHub Pages, ohne Abhängigkeiten.

## Themen

Oben lässt sich über die **Reiter (Register)** zwischen den Lerninhalten umschalten:

- **🇪🇺 EU-Länder** – die 27 EU-Mitgliedsstaaten und ihre Hauptstädte.
- **🌼 Blütenpflanzen** – Biologie: Aufbau der Pflanze und der Blüte, Bestäubung,
  Befruchtung, Früchte und Samenverbreitung (aus dem Schul-Dossier).
- **🇬🇧 Englische Verben** – die 103 wichtigsten unregelmäßigen Verben. Angezeigt
  wird das deutsche Verb, einzutragen ist die englische Form in **Gegenwart und
  Vergangenheit** (im Modus „Tippen" mit zwei Schreibfeldern; mehrere zulässige
  Formen wie `was/were` oder `burnt/burned` werden akzeptiert).
- **🇫🇷 Französische Verben** – 53 Verben mit voller **Konjugation**: deutsches
  Verb anzeigen, dann **Présent (alle Personen)** und **Passé composé** schreiben
  (im Modus „Tippen" mit einem Feld je Person). Tolerant bei Akzenten,
  Apostroph-Varianten, der optionalen Genus-Endung `(e)` und gleichwertigen
  Subjekten (`il`/`elle`).

Jedes Thema hat seine eigene „Falsche üben"-Liste.

- 🔢 **Ganze Zahlen (Mathematik, 8. Klasse E, Kapitel 6c)** – vier Themen: *Ganze Zahlen: Rechnen* (35 Aufgaben zu Multiplizieren, Dividieren, Potenzen und Rechenreihenfolge), *Vorzeichen von Potenzen*, *Temperaturen* (Celsius, Fahrenheit, Windchill-Term, Kelvin) und *Merkwissen*. Zahlen im Modus „Tippen" mit normalem Minus eintippen (z. B. -56). Die Kelvin-Karten beruhen auf allgemeinem Wissen und sollten mit dem Dossier abgeglichen werden. Dateien: `data-zahlen.js`.

## Lernmodi

- **Karteikarten** – Frage ansehen, antippen, Antwort aufdecken, „Gewusst / Nicht gewusst" markieren.
- **Quiz** – Multiple-Choice: die richtige Antwort aus vier Optionen wählen.
- **Tippen** – Antwort frei eingeben (toleranter Vergleich: Groß-/Kleinschreibung und Akzente egal).
- **Liste** – alle Karten des Themas mit Frage und Antwort, durchsuchbar.
- **Falsche üben** – wiederholt gezielt die Karten, die im Quiz oder Tippen falsch beantwortet wurden.
  Die Liste bleibt erhalten, sodass falsche Antworten **immer wieder** geübt werden können. Eine Karte
  verschwindet erst, wenn man sie bewusst über den Knopf „Gelernt – aus Falsch-Liste entfernen" herausnimmt
  (oder alle über „Falsche zurücksetzen" löscht). Gespeichert in `localStorage` (pro Thema getrennt),
  bleibt also über Sitzungen hinweg erhalten.

## 📅 Lernplan

Der Reiter **„📅 Lernplan"** plant die Lerneinheiten bis zu den Prüfungen:

- **Prüfungen** – Prüfung mit Thema (aus `data.js`, optional) und Datum eintragen, bearbeiten oder löschen.
  Ohne App-Thema genügt eine Bezeichnung (z. B. für Lernstoff aus dem Heft).
  Dazu die **Lernzeit pro Tag** (Standard 30 Min.) und die **Lerntage** (Standard Mo–Fr) einstellen.
- **Heute** – zeigt die heutigen Aufgaben mit Minuten, Abhaken und **„Starten"**, das direkt das
  passende Thema im passenden Lernmodus öffnet. Fortschrittsbalken für den Tag.
- **Übersicht** – alle geplanten Lerntage bis zur letzten Prüfung (max. 60 Tage).

Die Lerntage vor einer Prüfung durchlaufen vier Phasen:

| Phase | Zeitpunkt | Lernmodi |
| ------------ | ---------------------- | ------------------------------- |
| Kennenlernen | erstes Drittel | Liste durchlesen, Karteikarten |
| Festigen | zweites Drittel | Karteikarten, Quiz |
| Prüfen | letztes Drittel | Tippen, Falsche üben |
| Generalprobe | letzter Lerntag | Falsche üben, Tippen |

Liegen mehrere Prüfungen gleichzeitig an, wird die Tageszeit aufgeteilt; Prüfungen in den nächsten
3 Tagen bekommen doppelt so viel Zeit. Alles wird in `localStorage` gespeichert (`lernapp-plan`).

## Als Web-App installieren (PWA)

Die App ist eine **Progressive Web App** und lässt sich auf Handy oder Desktop
installieren – danach startet sie wie eine native App im eigenen Fenster und
funktioniert **offline**.

- **Android/Chrome:** Menü ⋮ → „App installieren" bzw. „Zum Startbildschirm hinzufügen".
- **iPhone/Safari:** Teilen-Symbol → „Zum Home-Bildschirm".
- **Desktop (Chrome/Edge):** Installations-Symbol in der Adressleiste.

Dafür sorgen `manifest.webmanifest` (Name, Icon, Farben) und `service-worker.js`
(cacht die App-Shell für den Offline-Betrieb). Bei Inhaltsänderungen die
`CACHE_VERSION` im Service Worker erhöhen, damit Clients die neue Version laden.

## Lokal starten

Einfach `index.html` im Browser öffnen – oder einen kleinen Webserver nutzen:

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

## Deployment (GitHub Pages)

Der Workflow unter `.github/workflows/deploy.yml` veröffentlicht die Seite automatisch bei jedem
Push auf `main`. In den Repository-Einstellungen unter **Settings → Pages → Build and deployment**
muss als Source **„GitHub Actions"** ausgewählt sein.

## Dateien

| Datei                  | Zweck                                          |
| ---------------------- | ---------------------------------------------- |
| `index.html`           | Seitenstruktur                                 |
| `style.css`            | Gestaltung                                     |
| `plan.css`             | Gestaltung des Lernplans                       |
| `app.js`               | Logik aller Lernmodi (themenunabhängig)        |
| `plan.js`              | Lernplan: Prüfungen, Tagesplan, Übersicht      |
| `data.js`              | Die Themen mit ihren Lernkarten                |
| `manifest.webmanifest` | Web-App-Manifest (Name, Icon, Farben)          |
| `service-worker.js`    | Offline-Cache der App-Shell                    |
| `icon.svg`             | App-Icon                                       |

## Neues Thema hinzufügen

In `data.js` dem Array `TOPICS` ein Objekt hinzufügen:

```js
{
  id: "kuerzel",
  name: "Anzeigename",
  emoji: "📚",
  subtitle: "Kurzbeschreibung",
  promptLabel: "Frage",          // Label auf der Kartenvorderseite
  answerLabel: "Antwort",        // Label auf der Kartenrückseite
  quizPrompt: "",                // optionaler Text vor der Quizfrage
  typePlaceholder: "Antwort eingeben…",
  cards: [
    { front: "Frage?", back: "Antwort", icon: "🔤" },
    // …
  ],
}
```

Neue Themen erscheinen automatisch in der Themenauswahl des Lernplans.
