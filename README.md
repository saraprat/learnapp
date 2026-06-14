# 🇪🇺 EU-Länder lernen

Eine kleine, build-freie Lern-App für die **27 EU-Mitgliedsstaaten und ihre Hauptstädte**.
Reines HTML/CSS/JavaScript – läuft direkt im Browser und auf GitHub Pages, ohne Abhängigkeiten.

## Lernmodi

- **Karteikarten** – Land ansehen, antippen, Hauptstadt aufdecken, „Gewusst / Nicht gewusst" markieren.
- **Quiz** – Multiple-Choice: die richtige Hauptstadt aus vier Optionen wählen.
- **Tippen** – Hauptstadt frei eingeben (toleranter Vergleich: Groß-/Kleinschreibung und Akzente egal).
- **Liste** – alle 27 Länder mit Hauptstadt und Flagge, durchsuchbar.
- **Falsche üben** – wiederholt gezielt die Länder, die im Quiz oder Tippen falsch beantwortet wurden.
  Die Liste bleibt erhalten, sodass falsche Antworten **immer wieder** geübt werden können. Ein Land
  verschwindet erst, wenn man es bewusst über den Knopf „Gelernt – aus Falsch-Liste entfernen" herausnimmt
  (oder alle über „Falsche zurücksetzen" löscht). Gespeichert in `localStorage`, bleibt also über
  Sitzungen hinweg erhalten.

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

| Datei         | Zweck                                  |
| ------------- | -------------------------------------- |
| `index.html`  | Seitenstruktur                         |
| `style.css`   | Gestaltung (EU-Blau/Gold)              |
| `app.js`      | Logik aller Lernmodi                   |
| `data.js`     | Die 27 EU-Länder mit Hauptstädten      |
