/* Lerninhalte der App, nach Themen gruppiert.
 *
 * Jedes Thema hat eine Liste von Lernkarten. Eine Karte besteht aus:
 *   front: Vorderseite (Frage bzw. Begriff)
 *   back:  Rückseite  (gesuchte Antwort)
 *   icon:  Emoji, das gross auf der Karte angezeigt wird
 *
 * Alle Modi (Karteikarten, Quiz, Tippen, Liste, Falsche üben) arbeiten mit
 * diesem einheitlichen Format, egal welches Thema gewählt ist.
 */

const TOPICS = [
  {
    id: "eu",
    name: "EU-Länder",
    emoji: "🇪🇺",
    subtitle: "Die 27 EU-Staaten und ihre Hauptstädte",
    promptLabel: "Land",
    answerLabel: "Hauptstadt",
    // Bei der Quiz-/Tippen-Frage vorangestellter Text. Leer = nur die Frage zeigen.
    quizPrompt: "Wie heißt die Hauptstadt von",
    typePlaceholder: "Hauptstadt eingeben…",
    cards: [
      { front: "Belgien",      back: "Brüssel",     icon: "🇧🇪" },
      { front: "Bulgarien",    back: "Sofia",       icon: "🇧🇬" },
      { front: "Dänemark",     back: "Kopenhagen",  icon: "🇩🇰" },
      { front: "Deutschland",  back: "Berlin",      icon: "🇩🇪" },
      { front: "Estland",      back: "Tallinn",     icon: "🇪🇪" },
      { front: "Finnland",     back: "Helsinki",    icon: "🇫🇮" },
      { front: "Frankreich",   back: "Paris",       icon: "🇫🇷" },
      { front: "Griechenland", back: "Athen",       icon: "🇬🇷" },
      { front: "Irland",       back: "Dublin",      icon: "🇮🇪" },
      { front: "Italien",      back: "Rom",         icon: "🇮🇹" },
      { front: "Kroatien",     back: "Zagreb",      icon: "🇭🇷" },
      { front: "Lettland",     back: "Riga",        icon: "🇱🇻" },
      { front: "Litauen",      back: "Vilnius",     icon: "🇱🇹" },
      { front: "Luxemburg",    back: "Luxemburg",   icon: "🇱🇺" },
      { front: "Malta",        back: "Valletta",    icon: "🇲🇹" },
      { front: "Niederlande",  back: "Amsterdam",   icon: "🇳🇱" },
      { front: "Österreich",   back: "Wien",        icon: "🇦🇹" },
      { front: "Polen",        back: "Warschau",    icon: "🇵🇱" },
      { front: "Portugal",     back: "Lissabon",    icon: "🇵🇹" },
      { front: "Rumänien",     back: "Bukarest",    icon: "🇷🇴" },
      { front: "Schweden",     back: "Stockholm",   icon: "🇸🇪" },
      { front: "Slowakei",     back: "Bratislava",  icon: "🇸🇰" },
      { front: "Slowenien",    back: "Ljubljana",   icon: "🇸🇮" },
      { front: "Spanien",      back: "Madrid",      icon: "🇪🇸" },
      { front: "Tschechien",   back: "Prag",        icon: "🇨🇿" },
      { front: "Ungarn",       back: "Budapest",    icon: "🇭🇺" },
      { front: "Zypern",       back: "Nikosia",     icon: "🇨🇾" },
    ],
  },

  {
    id: "blueten",
    name: "Blütenpflanzen",
    emoji: "🌼",
    subtitle: "Aufbau, Bestäubung, Früchte & Samenverbreitung",
    promptLabel: "Frage",
    answerLabel: "Antwort",
    quizPrompt: "",
    typePlaceholder: "Antwort eingeben…",
    cards: [
      // --- Aufbau und Funktion der Blütenpflanze ---
      { front: "Welche vier Grundorgane besitzt jede Blütenpflanze?", back: "Wurzel, Stängel, Blätter und Blüte", icon: "🌱" },
      { front: "Welches Organ verankert die Pflanze im Boden und nimmt Wasser auf?", back: "Die Wurzel", icon: "🌱" },
      { front: "Wie heißt der oberirdische Teil der Pflanze (Stängel, Blätter, Blüten)?", back: "Der Spross", icon: "🌱" },
      { front: "Welche Aufgabe hat der Stängel (die Sprossachse)?", back: "Er stützt die Pflanze und trägt Blätter und Blüten", icon: "🌿" },
      { front: "Wie nennt man den verholzten Stängel eines Baumes?", back: "Stamm", icon: "🌳" },
      { front: "In welchem Pflanzenteil bildet die Pflanze Traubenzucker?", back: "In den Blättern", icon: "🍃" },
      { front: "Was braucht die Pflanze, um in den Blättern Zucker aufzubauen?", back: "Wasser, Kohlenstoffdioxid und Sonnenlicht", icon: "☀️" },
      { front: "Wie heißt der Vorgang, bei dem Pflanzen mit Sonnenlicht Nährstoffe aufbauen?", back: "Fotosynthese", icon: "☀️" },
      { front: "Welches Gas geben Pflanzen bei der Fotosynthese ab?", back: "Sauerstoff", icon: "💨" },
      { front: "Wie heißen die Leitröhren, die Wasser in der Pflanze transportieren?", back: "Gefäße", icon: "💧" },
      { front: "Wie heißen die kleinen Öffnungen in den Blättern, über die Wasserdampf abgegeben wird?", back: "Spaltöffnungen", icon: "🍃" },
      { front: "Womit öffnen und schließen sich die Spaltöffnungen?", back: "Mit Schließzellen", icon: "🍃" },
      { front: "Welche Hauptaufgabe hat die Blüte?", back: "Die Fortpflanzung", icon: "🌸" },

      // --- Bau und Funktion der Blüte ---
      { front: "Wie heißen die äußeren grünen Blätter der Blüte, die die Knospe schützen?", back: "Kelchblätter", icon: "🌸" },
      { front: "Wie heißen die meist großen, farbigen Blätter, die Bestäuber anlocken?", back: "Kronblätter", icon: "🌷" },
      { front: "Wie nennt man Kelch- und Kronblätter zusammen?", back: "Blütenhülle", icon: "🌸" },
      { front: "Wie heißen die männlichen Fortpflanzungsorgane der Blüte?", back: "Staubblätter", icon: "🌼" },
      { front: "Aus welchen zwei Teilen besteht ein Staubblatt?", back: "Staubfaden und Staubbeutel", icon: "🌼" },
      { front: "Wo entsteht der Blütenstaub (Pollen)?", back: "In den Staubbeuteln", icon: "🌼" },
      { front: "Wie heißen die männlichen Fortpflanzungszellen?", back: "Pollenkörner", icon: "🌼" },
      { front: "Wie heißt das weibliche Fortpflanzungsorgan der Blüte?", back: "Der Stempel", icon: "🌸" },
      { front: "Aus welchen drei Teilen besteht der Stempel?", back: "Narbe, Griffel und Fruchtknoten", icon: "🌸" },
      { front: "In welchem Teil des Stempels liegt die Samenanlage mit der Eizelle?", back: "Im Fruchtknoten", icon: "🌸" },
      { front: "Wie heißt die weibliche Fortpflanzungszelle?", back: "Die Eizelle", icon: "🥚" },
      { front: "Wie heißt der klebrige obere Teil des Stempels, auf dem der Pollen landet?", back: "Die Narbe", icon: "🌸" },

      // --- Bestäubung und Befruchtung ---
      { front: "Wie nennt man die Übertragung von Pollen auf die Narbe?", back: "Bestäubung", icon: "🐝" },
      { front: "Wodurch werden Blüten bestäubt?", back: "Durch Insekten oder durch den Wind", icon: "🐝" },
      { front: "Wie heißen Pflanzen, die von Insekten bestäubt werden?", back: "Insektenblütler", icon: "🐝" },
      { front: "Wie heißen Pflanzen, die vom Wind bestäubt werden?", back: "Windblütler", icon: "💨" },
      { front: "Womit locken Insektenblütler ihre Bestäuber an?", back: "Mit Farbe, Duft und Nektar", icon: "🌺" },
      { front: "Wie sind die Blüten der Windblütler gebaut?", back: "Klein und unscheinbar", icon: "💨" },
      { front: "Wie heißen die männlichen Blüten der Hasel?", back: "Kätzchen", icon: "🌳" },
      { front: "Was wächst aus dem Pollenkorn, sobald es auf der Narbe liegt?", back: "Der Pollenschlauch", icon: "🌸" },
      { front: "Wohin wächst der Pollenschlauch?", back: "Durch den Griffel bis zur Samenanlage im Fruchtknoten", icon: "🌸" },
      { front: "Wie nennt man die Verschmelzung von männlicher Geschlechtszelle und Eizelle?", back: "Befruchtung", icon: "💞" },
      { front: "Wo findet die Befruchtung statt?", back: "Im Fruchtknoten", icon: "🌸" },

      // --- Von der Blüte zur Frucht ---
      { front: "Woraus entsteht nach der Befruchtung die Frucht?", back: "Aus dem Fruchtknoten", icon: "🍒" },
      { front: "Woraus entsteht der Samen?", back: "Aus der Samenanlage", icon: "🌰" },
      { front: "Wie heißt eine Frucht mit einem harten Stein im Inneren (z. B. Kirsche)?", back: "Steinfrucht", icon: "🍒" },
      { front: "Wie heißt eine fleischige Frucht mit vielen Samen (z. B. Tomate, Traube)?", back: "Beere", icon: "🍇" },
      { front: "Wie heißt die Frucht, bei der viele kleine Früchtchen zusammenwachsen (z. B. Brombeere)?", back: "Sammelfrucht", icon: "🫐" },
      { front: "Aus welchem Blütenteil wächst beim Apfel das Fruchtfleisch?", back: "Aus dem Blütenboden", icon: "🍎" },
      { front: "Wie heißt die trockene Frucht von Bohne und Erbse?", back: "Hülsenfrucht", icon: "🫛" },
      { front: "Ist die Tomate biologisch eine Frucht oder Gemüse?", back: "Eine Frucht", icon: "🍅" },

      // --- Verbreitung von Samen und Früchten ---
      { front: "Auf welche vier Arten können Samen und Früchte verbreitet werden?", back: "Durch Wind, Wasser, Tiere und Selbstverbreitung", icon: "🍃" },
      { front: "Wodurch wird der Löwenzahn verbreitet?", back: "Durch den Wind", icon: "🌬️" },
      { front: "Wie heißen Früchte mit Widerhaken, die im Fell von Tieren hängen bleiben?", back: "Klettfrüchte", icon: "🦔" },
      { front: "Wie verbreiten sich Ginster und Springkraut?", back: "Durch Selbstverbreitung", icon: "💥" },
      { front: "Wodurch wird die Kokosnuss verbreitet?", back: "Durch Wasser", icon: "🥥" },
      { front: "Warum sind viele Früchte auffällig gefärbt?", back: "Damit Tiere sie fressen und die Samen verbreiten", icon: "🐦" },

      // --- Samen und Keimung ---
      { front: "Was braucht ein Samen zum Keimen?", back: "Wasser, Luft und Wärme", icon: "🌱" },
      { front: "Was braucht eine Pflanze zusätzlich zum Wachsen?", back: "Sonnenlicht und Mineralstoffe", icon: "☀️" },
      { front: "Aus welchen drei Teilen besteht der Keimling?", back: "Keimwurzel, Keimstängel und Keimblätter", icon: "🌱" },
      { front: "Was befindet sich im Inneren eines Samens?", back: "Ein Embryo", icon: "🌰" },
      { front: "Wie nennt man die Vermehrung ohne Samen (z. B. durch Zwiebeln oder Ausläufer)?", back: "Ungeschlechtliche Vermehrung", icon: "🧅" },
      { front: "Welches Speicherorgan lässt die Tulpe früh im Frühling austreiben?", back: "Die Zwiebel", icon: "🧅" },
    ],
  },
];
