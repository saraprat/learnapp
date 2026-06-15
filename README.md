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

| Datei         | Zweck                                          |
| ------------- | ---------------------------------------------- |
| `index.html`  | Seitenstruktur                                 |
| `style.css`   | Gestaltung                                     |
| `app.js`      | Logik aller Lernmodi (themenunabhängig)        |
| `data.js`     | Die Themen mit ihren Lernkarten                |
| `manifest.webmanifest` | Web-App-Manifest (Name, Icon, Farben) |
| `service-worker.js`    | Offline-Cache der App-Shell           |
| `icon.svg`    | App-Icon                                       |

## Neues Thema hinzufügen

In `data.js` dem Array `TOPICS` ein Objekt hinzufügen:

```js
{
  id: "kuerzel",
  name: "Anzeigename",
  emoji: "📚",
  subtitle: "Kurzbeschreibung",
  promptLabel: "Frage",        // Label auf der Kartenvorderseite
  answerLabel: "Antwort",      // Label auf der Kartenrückseite
  quizPrompt: "",              // optionaler Text vor der Quizfrage
  typePlaceholder: "Antwort eingeben…",
  cards: [
    { front: "Frage?", back: "Antwort", icon: "🔤" },
    // …
  ],
}
```
