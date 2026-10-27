/* Zusatz-Themen: Mathematik 8. Klasse E, Kapitel 6c «Die Welt der ganzen Zahlen: Grundoperationen»
 * (Prüfung Fr 30.10.2026). Wird nach data.js geladen und hängt die Themen an TOPICS an.
 * Alle Resultate sind nachgerechnet. Antworten bei Zahlen mit normalem Minus (-) eintippen.
 * Hinweis: Die Kelvin-Karten beruhen auf allgemeinem Wissen und sollten mit dem Dossier abgeglichen werden.
 */
(function () {
  if (typeof TOPICS === "undefined") return;
  const NEU = [
  {
    "id": "zahlen-rechnen",
    "name": "Ganze Zahlen: Rechnen",
    "emoji": "➖",
    "subtitle": "Multiplizieren, Dividieren, Potenzen und Rechenreihenfolge (Mathe 8. Klasse E, Kapitel 6c)",
    "promptLabel": "Rechne aus",
    "answerLabel": "Resultat",
    "quizPrompt": "",
    "typePlaceholder": "Zahl eingeben (z. B. -56)…",
    "cards": [
      {
        "front": "(−8) · 7",
        "back": "-56",
        "icon": "✖️"
      },
      {
        "front": "(−12) · (−5)",
        "back": "60",
        "icon": "✖️"
      },
      {
        "front": "−96 : (−8)",
        "back": "12",
        "icon": "✖️"
      },
      {
        "front": "105 : (−7)",
        "back": "-15",
        "icon": "✖️"
      },
      {
        "front": "(−15) · (−4)",
        "back": "60",
        "icon": "✖️"
      },
      {
        "front": "−144 : 12",
        "back": "-12",
        "icon": "✖️"
      },
      {
        "front": "(−13) · 6",
        "back": "-78",
        "icon": "✖️"
      },
      {
        "front": "−84 : (−12)",
        "back": "7",
        "icon": "✖️"
      },
      {
        "front": "(−9) · (−11)",
        "back": "99",
        "icon": "✖️"
      },
      {
        "front": "−132 : 11",
        "back": "-12",
        "icon": "✖️"
      },
      {
        "front": "24 · (−5)",
        "back": "-120",
        "icon": "✖️"
      },
      {
        "front": "(−7) · 8 · (−2)",
        "back": "112",
        "icon": "✖️"
      },
      {
        "front": "(−9) · x = 72, x = ?",
        "back": "-8",
        "icon": "❓"
      },
      {
        "front": "x : (−6) = −11, x = ?",
        "back": "66",
        "icon": "❓"
      },
      {
        "front": "(−4) · x = −36, x = ?",
        "back": "9",
        "icon": "❓"
      },
      {
        "front": "x : 5 = −13, x = ?",
        "back": "-65",
        "icon": "❓"
      },
      {
        "front": "(−4)³",
        "back": "-64",
        "icon": "⚡"
      },
      {
        "front": "(−3)⁴",
        "back": "81",
        "icon": "⚡"
      },
      {
        "front": "28 + (−2)⁵",
        "back": "-4",
        "icon": "⚡"
      },
      {
        "front": "(−5)² − (−4)³",
        "back": "89",
        "icon": "⚡"
      },
      {
        "front": "(−2)⁶",
        "back": "64",
        "icon": "⚡"
      },
      {
        "front": "(−5)³",
        "back": "-125",
        "icon": "⚡"
      },
      {
        "front": "40 + (−3)³",
        "back": "13",
        "icon": "⚡"
      },
      {
        "front": "(−6)² − (−2)⁵",
        "back": "68",
        "icon": "⚡"
      },
      {
        "front": "(−10)³",
        "back": "-1000",
        "icon": "⚡"
      },
      {
        "front": "−48 + (−27 − 15)",
        "back": "-90",
        "icon": "🧮"
      },
      {
        "front": "6 · (−12) + 150",
        "back": "78",
        "icon": "🧮"
      },
      {
        "front": "−300 : (−15) − 4 · (−9)",
        "back": "56",
        "icon": "🧮"
      },
      {
        "front": "3 · (−4)² − 100 : (−5)",
        "back": "68",
        "icon": "🧮"
      },
      {
        "front": "(−125 + 45) : (−8) · (−3)",
        "back": "-30",
        "icon": "🧮"
      },
      {
        "front": "−(−7 + 12) · (−9) − 2³",
        "back": "37",
        "icon": "🧮"
      },
      {
        "front": "−5 · (−6) − 18 : (−3)",
        "back": "36",
        "icon": "🧮"
      },
      {
        "front": "(−20 + 8) · (−4) + 7",
        "back": "55",
        "icon": "🧮"
      },
      {
        "front": "(−3)³ + 50 : (−5)",
        "back": "-37",
        "icon": "🧮"
      },
      {
        "front": "−2 · (3 − 8)²",
        "back": "-50",
        "icon": "🧮"
      }
    ]
  },
  {
    "id": "zahlen-vorzeichen",
    "name": "Vorzeichen von Potenzen",
    "emoji": "±",
    "subtitle": "Positiv oder negativ? Entscheide ohne Ausrechnen",
    "promptLabel": "Positiv oder negativ?",
    "answerLabel": "Vorzeichen",
    "quizPrompt": "",
    "typePlaceholder": "positiv oder negativ",
    "cards": [
      {
        "front": "(−3)⁵",
        "back": "negativ",
        "icon": "±"
      },
      {
        "front": "(−7)⁴",
        "back": "positiv",
        "icon": "±"
      },
      {
        "front": "(−2)⁸ · (−5)³",
        "back": "negativ",
        "icon": "±"
      },
      {
        "front": "(−1)⁹⁹ · (−4)⁷",
        "back": "positiv",
        "icon": "±"
      },
      {
        "front": "−6 · (−3)⁴ · (−2)⁵",
        "back": "positiv",
        "icon": "±"
      },
      {
        "front": "(−2)⁶ : (−8)³",
        "back": "negativ",
        "icon": "±"
      },
      {
        "front": "(−4)⁶",
        "back": "positiv",
        "icon": "±"
      },
      {
        "front": "(−2)⁷",
        "back": "negativ",
        "icon": "±"
      },
      {
        "front": "(−3)² · (−3)³",
        "back": "negativ",
        "icon": "±"
      },
      {
        "front": "(−5)⁴ : (−5)²",
        "back": "positiv",
        "icon": "±"
      }
    ]
  },
  {
    "id": "zahlen-temperatur",
    "name": "Temperaturen",
    "emoji": "🌡️",
    "subtitle": "Celsius, Fahrenheit, Windchill-Term und Kelvin",
    "promptLabel": "Rechne um",
    "answerLabel": "Resultat",
    "quizPrompt": "",
    "typePlaceholder": "Zahl eingeben (z. B. -20)…",
    "cards": [
      {
        "front": "30 °C in °F<br><small>9/5 · c + 32</small>",
        "back": "86",
        "icon": "🌡️"
      },
      {
        "front": "−10 °C in °F<br><small>9/5 · c + 32</small>",
        "back": "14",
        "icon": "🌡️"
      },
      {
        "front": "100 °C in °F<br><small>9/5 · c + 32</small>",
        "back": "212",
        "icon": "🌡️"
      },
      {
        "front": "0 °C in °F<br><small>9/5 · c + 32</small>",
        "back": "32",
        "icon": "🌡️"
      },
      {
        "front": "−40 °C in °F<br><small>9/5 · c + 32</small>",
        "back": "-40",
        "icon": "🌡️"
      },
      {
        "front": "25 °C in °F<br><small>9/5 · c + 32</small>",
        "back": "77",
        "icon": "🌡️"
      },
      {
        "front": "10 °C in °F<br><small>9/5 · c + 32</small>",
        "back": "50",
        "icon": "🌡️"
      },
      {
        "front": "−20 °C in °F<br><small>9/5 · c + 32</small>",
        "back": "-4",
        "icon": "🌡️"
      },
      {
        "front": "68 °F in °C<br><small>(f − 32) · 5/9</small>",
        "back": "20",
        "icon": "🌡️"
      },
      {
        "front": "−4 °F in °C<br><small>(f − 32) · 5/9</small>",
        "back": "-20",
        "icon": "🌡️"
      },
      {
        "front": "14 °F in °C<br><small>(f − 32) · 5/9</small>",
        "back": "-10",
        "icon": "🌡️"
      },
      {
        "front": "95 °F in °C<br><small>(f − 32) · 5/9</small>",
        "back": "35",
        "icon": "🌡️"
      },
      {
        "front": "50 °F in °C<br><small>(f − 32) · 5/9</small>",
        "back": "10",
        "icon": "🌡️"
      },
      {
        "front": "32 °F in °C<br><small>(f − 32) · 5/9</small>",
        "back": "0",
        "icon": "🌡️"
      },
      {
        "front": "212 °F in °C<br><small>(f − 32) · 5/9</small>",
        "back": "100",
        "icon": "🌡️"
      },
      {
        "front": "23 °F in °C<br><small>(f − 32) · 5/9</small>",
        "back": "-5",
        "icon": "🌡️"
      },
      {
        "front": "Gefühlte Temperatur bei 50 km/h Wind, wenn das Thermometer −5 °C zeigt (auf ganze Grad runden)<br><small>1.363 · t − 8.142</small>",
        "back": "-15",
        "icon": "💨"
      },
      {
        "front": "Gefühlte Temperatur bei 50 km/h Wind, wenn das Thermometer 5 °C zeigt (auf ganze Grad runden)<br><small>1.363 · t − 8.142</small>",
        "back": "-1",
        "icon": "💨"
      },
      {
        "front": "Gefühlte Temperatur bei 50 km/h Wind, wenn das Thermometer 0 °C zeigt (auf ganze Grad runden)<br><small>1.363 · t − 8.142</small>",
        "back": "-8",
        "icon": "💨"
      },
      {
        "front": "Gefühlte Temperatur bei 50 km/h Wind, wenn das Thermometer −10 °C zeigt (auf ganze Grad runden)<br><small>1.363 · t − 8.142</small>",
        "back": "-22",
        "icon": "💨"
      },
      {
        "front": "Gefühlte Temperatur bei 50 km/h Wind, wenn das Thermometer −2 °C zeigt (auf ganze Grad runden)<br><small>1.363 · t − 8.142</small>",
        "back": "-11",
        "icon": "💨"
      },
      {
        "front": "Gefühlte Temperatur bei 50 km/h Wind, wenn das Thermometer 10 °C zeigt (auf ganze Grad runden)<br><small>1.363 · t − 8.142</small>",
        "back": "5",
        "icon": "💨"
      },
      {
        "front": "Windchill-Effekt: Thermometer 0 °C, gefühlt −7 °C. Wie viele Grad kälter fühlt es sich an?",
        "back": "7",
        "icon": "💨"
      },
      {
        "front": "Windchill-Effekt: Thermometer 5 °C, gefühlt −1 °C. Wie viele Grad kälter fühlt es sich an?",
        "back": "6",
        "icon": "💨"
      },
      {
        "front": "Windchill-Effekt: Thermometer −10 °C, gefühlt −22 °C. Wie viele Grad kälter fühlt es sich an?",
        "back": "12",
        "icon": "💨"
      },
      {
        "front": "0 °C in Kelvin (ungefähr)<br><small>K = °C + 273</small>",
        "back": "273",
        "icon": "🧊"
      },
      {
        "front": "25 °C in Kelvin (ungefähr)<br><small>K = °C + 273</small>",
        "back": "298",
        "icon": "🧊"
      },
      {
        "front": "100 °C in Kelvin (ungefähr)<br><small>K = °C + 273</small>",
        "back": "373",
        "icon": "🧊"
      },
      {
        "front": "−273 °C in Kelvin (ungefähr)<br><small>K = °C + 273</small>",
        "back": "0",
        "icon": "🧊"
      },
      {
        "front": "300 K in °C (ungefähr)",
        "back": "27",
        "icon": "🧊"
      },
      {
        "front": "273 K in °C (ungefähr)",
        "back": "0",
        "icon": "🧊"
      }
    ]
  },
  {
    "id": "zahlen-merk",
    "name": "Ganze Zahlen: Merkwissen",
    "emoji": "📘",
    "subtitle": "Regeln und Begriffe zu Kapitel 6c",
    "promptLabel": "Frage",
    "answerLabel": "Antwort",
    "quizPrompt": "",
    "typePlaceholder": "Antwort eingeben…",
    "cards": [
      {
        "front": "Was ergibt (−) · (−)?",
        "back": "Positiv. Gleiche Vorzeichen ergeben +.",
        "icon": "📘"
      },
      {
        "front": "Was ergibt (+) · (−)?",
        "back": "Negativ. Verschiedene Vorzeichen ergeben −.",
        "icon": "📘"
      },
      {
        "front": "Was ergibt (−) : (−)?",
        "back": "Positiv. Es gilt die gleiche Regel wie beim Multiplizieren.",
        "icon": "📘"
      },
      {
        "front": "Wie kontrollierst du eine Division?",
        "back": "Mit der Umkehrung: Resultat · Teiler = Ausgangszahl.",
        "icon": "📘"
      },
      {
        "front": "Wann ist eine Potenz mit negativer Basis positiv?",
        "back": "Wenn der Exponent gerade ist, zum Beispiel (−3)⁴ = 81.",
        "icon": "📘"
      },
      {
        "front": "Wann ist eine Potenz mit negativer Basis negativ?",
        "back": "Wenn der Exponent ungerade ist, zum Beispiel (−2)³ = −8.",
        "icon": "📘"
      },
      {
        "front": "Was ist (−1)ⁿ?",
        "back": "+1 bei geradem n, −1 bei ungeradem n.",
        "icon": "📘"
      },
      {
        "front": "Rechenreihenfolge?",
        "back": "1. Klammern, 2. Potenzen, 3. Punkt vor Strich, 4. Plus und Minus von links nach rechts.",
        "icon": "📘"
      },
      {
        "front": "Was bedeutet Subtrahieren einer negativen Zahl?",
        "back": "Es wird zum Addieren: 20 − (−36) = 20 + 36 = 56.",
        "icon": "📘"
      },
      {
        "front": "Was ist der Windchill-Effekt?",
        "back": "Gefühlte Kälte durch Wind: Der Wind entzieht dem Körper Wärme, deshalb fühlt es sich kälter an, als das Thermometer zeigt.",
        "icon": "📘"
      },
      {
        "front": "Wie liest du die Windchill-Tabelle?",
        "back": "Zeile = wirkliche Temperatur, Spalte = Windgeschwindigkeit, im Kreuzungsfeld steht die gefühlte Temperatur.",
        "icon": "📘"
      },
      {
        "front": "Term für die gefühlte Temperatur bei 50 km/h?",
        "back": "1.363 · t − 8.142 (t = wirkliche Temperatur).",
        "icon": "📘"
      },
      {
        "front": "Celsius → Fahrenheit?",
        "back": "9/5 · c + 32. Beispiel: 30 °C = 86 °F.",
        "icon": "📘"
      },
      {
        "front": "Fahrenheit → Celsius?",
        "back": "(f − 32) · 5/9. Beispiel: 68 °F = 20 °C.",
        "icon": "📘"
      },
      {
        "front": "Bei welcher Temperatur sind Celsius und Fahrenheit gleich?",
        "back": "Bei −40: −40 °C = −40 °F.",
        "icon": "📘"
      },
      {
        "front": "Gefrierpunkt und Siedepunkt von Wasser in °F?",
        "back": "0 °C = 32 °F und 100 °C = 212 °F.",
        "icon": "📘"
      },
      {
        "front": "Was ist Kelvin?",
        "back": "Eine Temperaturskala, die beim absoluten Nullpunkt beginnt (0 K ≈ −273 °C). Es gibt keine negativen Werte.",
        "icon": "📘"
      },
      {
        "front": "Wie rechnest du °C in Kelvin um?",
        "back": "K = °C + 273. Beispiel: 0 °C ≈ 273 K.",
        "icon": "📘"
      },
      {
        "front": "Konto-Spiel: Welcher Term gehört zum Abgeben eines Verlustscheins (−7)?",
        "back": "k − (−7) = k + 7. Der Kontostand steigt.",
        "icon": "📘"
      },
      {
        "front": "Konto-Spiel: Welcher Term gehört zum Erhalten eines Verlustscheins (−7)?",
        "back": "k + (−7) = k − 7. Der Kontostand sinkt.",
        "icon": "📘"
      },
      {
        "front": "Saldo-Spiel: Was bedeutet (−3) · (−20)?",
        "back": "Man gibt 3 Scheine à −20 ab. Der Kontostand steigt um 60.",
        "icon": "📘"
      },
      {
        "front": "Wie schreibst du zu 7 · (−5) = −35 zwei Divisionen?",
        "back": "(−35) : 7 = −5 und (−35) : (−5) = 7.",
        "icon": "📘"
      },
      {
        "front": "Welchen Zahlenraum musst du sicher beherrschen?",
        "back": "Alle Grundoperationen mit ganzen Zahlen von −1000 bis 1000.",
        "icon": "📘"
      }
    ]
  }
];
  NEU.forEach((t) => TOPICS.push(t));
})();
