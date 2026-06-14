/* EU-Länder-Lern-App
 * Modi: Karteikarten, Quiz, Tippen, Liste, Falsche üben.
 * Falsch beantwortete Länder werden in localStorage gemerkt.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "eu-lernapp-wrong";
  const view = document.getElementById("view");
  const progressEl = document.getElementById("progress");
  const wrongCountEl = document.getElementById("wrong-count");
  const resetWrongBtn = document.getElementById("reset-wrong");
  const modeButtons = Array.from(document.querySelectorAll(".mode-btn"));

  let mode = "flashcards";
  let deck = [];        // aktuelle Reihenfolge der Länder
  let index = 0;        // Position im Deck
  let score = 0;        // richtige Antworten in dieser Runde

  /* ---------- Hilfsfunktionen ---------- */

  function loadWrong() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch (_) {
      return new Set();
    }
  }

  function saveWrong(set) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
    } catch (_) { /* ignore */ }
    updateWrongBadge();
  }

  function markWrong(country) {
    const set = loadWrong();
    set.add(country);
    saveWrong(set);
  }

  function clearWrong(country) {
    const set = loadWrong();
    set.delete(country);
    saveWrong(set);
  }

  function updateWrongBadge() {
    wrongCountEl.textContent = String(loadWrong().size);
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Lenienter Vergleich: Groß/Klein, Leerzeichen und Akzente ignorieren.
  function normalize(s) {
    return s
      .toLowerCase()
      .trim()
      .replace(/ß/g, "ss")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/\s+/g, " ");
  }

  function wrongDeck() {
    const set = loadWrong();
    return COUNTRIES.filter((c) => set.has(c.country));
  }

  function setProgress(text) {
    progressEl.textContent = text || "";
  }

  /* ---------- Modus-Steuerung ---------- */

  function setMode(next) {
    mode = next;
    modeButtons.forEach((b) => b.classList.toggle("active", b.dataset.mode === next));
    resetWrongBtn.hidden = next !== "wrong";
    score = 0;
    index = 0;
    render();
  }

  function render() {
    view.innerHTML = "";
    setProgress("");
    switch (mode) {
      case "flashcards": deck = shuffle(COUNTRIES); renderFlashcard(); break;
      case "quiz":       deck = shuffle(COUNTRIES); renderQuiz(); break;
      case "type":       deck = shuffle(COUNTRIES); renderType(); break;
      case "list":       renderList(); break;
      case "wrong":      deck = shuffle(wrongDeck()); renderWrong(); break;
    }
  }

  /* ---------- Karteikarten ---------- */

  function renderFlashcard() {
    if (index >= deck.length) return renderRoundDone("Karteikarten");
    const c = deck[index];
    let revealed = false;

    const card = document.createElement("div");
    card.className = "card flashcard";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    function paintFront() {
      card.innerHTML =
        `<div class="prompt-flag">${c.flag}</div>` +
        `<div class="prompt-label">Land</div>` +
        `<p class="prompt-value">${c.country}</p>` +
        `<p class="hint">Tippe auf die Karte, um die Hauptstadt zu sehen</p>`;
    }
    function paintBack() {
      card.innerHTML =
        `<div class="prompt-flag">${c.flag}</div>` +
        `<div class="prompt-label">Hauptstadt von ${c.country}</div>` +
        `<p class="prompt-value answer">${c.capital}</p>` +
        `<div class="row-btns">` +
        `<button class="btn btn--bad" data-act="nope">Nicht gewusst</button>` +
        `<button class="btn btn--ok" data-act="yep">Gewusst</button>` +
        `</div>`;
    }

    function flip() {
      revealed = !revealed;
      revealed ? paintBack() : paintFront();
    }

    card.addEventListener("click", (e) => {
      const act = e.target.closest("[data-act]");
      if (act) {
        e.stopPropagation();
        if (act.dataset.act === "nope") markWrong(c.country);
        index++;
        renderFlashcard();
        return;
      }
      flip();
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
    });

    paintFront();
    view.appendChild(card);
    setProgress(`Karte ${index + 1} von ${deck.length}`);
  }

  /* ---------- Quiz (Multiple Choice) ---------- */

  function renderQuizCard(c, onAnswered, proceed) {

    // Drei falsche Hauptstädte aus dem Gesamtpool wählen.
    const distractors = shuffle(COUNTRIES.filter((x) => x.capital !== c.capital))
      .slice(0, 3)
      .map((x) => x.capital);
    const options = shuffle([c.capital, ...distractors]);

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML =
      `<div class="prompt-flag">${c.flag}</div>` +
      `<div class="prompt-label">Wie heißt die Hauptstadt von</div>` +
      `<p class="prompt-value">${c.country}?</p>` +
      `<div class="options"></div>` +
      `<div class="score-line">Richtig: ${score} / ${deck.length}</div>`;

    const optWrap = card.querySelector(".options");
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "option";
      btn.type = "button";
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        const correct = opt === c.capital;
        optWrap.querySelectorAll(".option").forEach((b) => {
          b.disabled = true;
          if (b.textContent === c.capital) b.classList.add("correct");
        });
        if (!correct) btn.classList.add("wrong");
        if (correct) score++;
        onAnswered(correct, c);

        const next = document.createElement("button");
        next.className = "btn";
        next.style.marginTop = "18px";
        next.textContent = index + 1 < deck.length ? "Weiter" : "Ergebnis";
        next.addEventListener("click", () => { index++; proceed(); });
        card.appendChild(next);
        next.focus();
      });
      optWrap.appendChild(btn);
    });

    view.appendChild(card);
    setProgress(`Frage ${index + 1} von ${deck.length}`);
  }

  function renderQuiz() {
    if (index >= deck.length) return renderRoundDone("Quiz", true);
    renderQuizCard(deck[index], (correct, c) => {
      if (!correct) markWrong(c.country);
    }, renderQuiz);
  }

  /* ---------- Tippen ---------- */

  function renderType() {
    if (index >= deck.length) return renderRoundDone("Tippen", true);
    const c = deck[index];

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML =
      `<div class="prompt-flag">${c.flag}</div>` +
      `<div class="prompt-label">Hauptstadt von</div>` +
      `<p class="prompt-value">${c.country}?</p>` +
      `<form class="type-form">` +
      `<input class="type-input" type="text" autocomplete="off" autocapitalize="words" ` +
      `spellcheck="false" placeholder="Hauptstadt eingeben…" aria-label="Hauptstadt" />` +
      `<button class="btn" type="submit">Prüfen</button>` +
      `</form>` +
      `<div class="feedback" role="status"></div>` +
      `<div class="score-line">Richtig: ${score} / ${deck.length}</div>`;

    const form = card.querySelector("form");
    const input = card.querySelector("input");
    const feedback = card.querySelector(".feedback");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const guess = input.value;
      if (!guess.trim()) return;
      const correct = normalize(guess) === normalize(c.capital);
      input.disabled = true;
      form.querySelector("button").disabled = true;

      if (correct) {
        score++;
        feedback.textContent = "✓ Richtig!";
        feedback.className = "feedback ok";
      } else {
        markWrong(c.country);
        feedback.textContent = `✗ Falsch – richtig ist: ${c.capital}`;
        feedback.className = "feedback bad";
      }

      const next = document.createElement("button");
      next.className = "btn";
      next.style.marginTop = "16px";
      next.textContent = index + 1 < deck.length ? "Weiter" : "Ergebnis";
      next.addEventListener("click", () => { index++; renderType(); });
      card.appendChild(next);
      next.focus();
    });

    view.appendChild(card);
    input.focus();
    setProgress(`Frage ${index + 1} von ${deck.length}`);
  }

  /* ---------- Liste ---------- */

  function renderList() {
    const wrap = document.createElement("div");

    const search = document.createElement("input");
    search.className = "list-search";
    search.type = "search";
    search.placeholder = "Land oder Hauptstadt suchen…";
    search.setAttribute("aria-label", "Liste durchsuchen");

    const ul = document.createElement("ul");
    ul.className = "country-list";

    function paint(filter) {
      const f = normalize(filter || "");
      ul.innerHTML = "";
      const items = COUNTRIES
        .slice()
        .sort((a, b) => a.country.localeCompare(b.country, "de"))
        .filter((c) => !f || normalize(c.country).includes(f) || normalize(c.capital).includes(f));
      if (!items.length) {
        ul.innerHTML = `<li><span class="ln">Kein Treffer</span></li>`;
        return;
      }
      items.forEach((c) => {
        const li = document.createElement("li");
        li.innerHTML =
          `<span class="lf">${c.flag}</span>` +
          `<span class="ln">${c.country}</span>` +
          `<span class="lc">${c.capital}</span>`;
        ul.appendChild(li);
      });
    }

    search.addEventListener("input", () => paint(search.value));
    paint("");

    wrap.appendChild(search);
    wrap.appendChild(ul);
    view.appendChild(wrap);
    setProgress(`${COUNTRIES.length} EU-Länder`);
  }

  /* ---------- Falsche üben ---------- */

  function renderWrong() {
    if (!deck.length) {
      view.innerHTML =
        `<div class="empty-state">` +
        `<div class="big">🎉</div>` +
        `<p>Keine falschen Antworten gespeichert.</p>` +
        `<p>Spiele Quiz oder Tippen – falsch beantwortete Länder landen hier zum Wiederholen.</p>` +
        `</div>`;
      setProgress("");
      return;
    }
    if (index >= deck.length) {
      // Runde fertig: Deck mit noch verbliebenen Falschen neu aufbauen.
      const remaining = wrongDeck();
      view.innerHTML =
        `<div class="empty-state">` +
        `<div class="big">${remaining.length ? "💪" : "🎉"}</div>` +
        `<p>Runde beendet – ${score} von ${deck.length} richtig.</p>` +
        (remaining.length
          ? `<p>Noch ${remaining.length} Land/Länder zum Üben.</p>`
          : `<p>Alle Falschen gemeistert!</p>`) +
        `</div>`;
      const btns = document.createElement("div");
      btns.className = "row-btns";
      if (remaining.length) {
        const again = document.createElement("button");
        again.className = "btn";
        again.textContent = "Weiter üben";
        again.addEventListener("click", () => { score = 0; index = 0; deck = shuffle(remaining); renderWrong(); });
        btns.appendChild(again);
      }
      view.appendChild(btns);
      setProgress("");
      return;
    }
    // Quiz-Format; richtige Antwort entfernt das Land aus der Falsch-Liste.
    renderQuizCard(deck[index], (correct, c) => {
      if (correct) clearWrong(c.country);
    }, renderWrong);
  }

  /* ---------- Rundenabschluss (Quiz/Tippen/Karteikarten) ---------- */

  function renderRoundDone(label, withScore) {
    view.innerHTML =
      `<div class="empty-state">` +
      `<div class="big">✅</div>` +
      `<p>${label} abgeschlossen!</p>` +
      (withScore ? `<p><strong>${score} von ${deck.length}</strong> richtig.</p>` : "") +
      `</div>`;
    const btns = document.createElement("div");
    btns.className = "row-btns";
    const again = document.createElement("button");
    again.className = "btn";
    again.textContent = "Nochmal";
    again.addEventListener("click", () => setMode(mode));
    btns.appendChild(again);
    view.appendChild(btns);
    setProgress("");
  }

  /* ---------- Init ---------- */

  modeButtons.forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
  resetWrongBtn.addEventListener("click", () => {
    saveWrong(new Set());
    if (mode === "wrong") render();
  });

  updateWrongBadge();
  setMode("flashcards");
})();
