/* Lern-App mit mehreren Themen.
 * Modi: Karteikarten, Quiz, Tippen, Liste, Falsche üben.
 * Falsch beantwortete Karten werden pro Thema in localStorage gemerkt und
 * lassen sich beliebig oft wiederholen, bis man sie als "gelernt" markiert.
 */
(function () {
  "use strict";

  const TOPIC_KEY = "lernapp-topic";
  const view = document.getElementById("view");
  const progressEl = document.getElementById("progress");
  const wrongCountEl = document.getElementById("wrong-count");
  const resetWrongBtn = document.getElementById("reset-wrong");
  const subtitleEl = document.getElementById("app-subtitle");
  const topicSelect = document.getElementById("topic");
  const modeButtons = Array.from(document.querySelectorAll(".mode-btn"));

  let topic = TOPICS[0]; // aktuelles Thema
  let mode = "flashcards";
  let deck = [];         // aktuelle Reihenfolge der Karten
  let index = 0;         // Position im Deck
  let score = 0;         // richtige Antworten in dieser Runde

  /* ---------- Falsch-Liste (pro Thema) ---------- */

  function storageKey() {
    return "lernapp-wrong-" + topic.id;
  }

  function loadWrong() {
    try {
      const raw = localStorage.getItem(storageKey());
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch (_) {
      return new Set();
    }
  }

  function saveWrong(set) {
    try {
      localStorage.setItem(storageKey(), JSON.stringify(Array.from(set)));
    } catch (_) { /* ignore */ }
    updateWrongBadge();
  }

  function markWrong(key) {
    const set = loadWrong();
    set.add(key);
    saveWrong(set);
  }

  function clearWrong(key) {
    const set = loadWrong();
    set.delete(key);
    saveWrong(set);
  }

  function updateWrongBadge() {
    wrongCountEl.textContent = String(loadWrong().size);
  }

  function wrongDeck() {
    const set = loadWrong();
    return topic.cards.filter((c) => set.has(c.front));
  }

  /* ---------- Hilfsfunktionen ---------- */

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

  function setProgress(text) {
    progressEl.textContent = text || "";
  }

  /* ---------- Themen-Steuerung ---------- */

  function setTopic(id) {
    const next = TOPICS.find((t) => t.id === id) || TOPICS[0];
    topic = next;
    try { localStorage.setItem(TOPIC_KEY, topic.id); } catch (_) { /* ignore */ }
    topicSelect.value = topic.id;
    subtitleEl.textContent = `${topic.emoji} ${topic.name} · ${topic.subtitle}`;
    document.title = `Vinci-Lernapp · ${topic.name}`;
    updateWrongBadge();
    setMode(mode);
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
      case "flashcards": deck = shuffle(topic.cards); renderFlashcard(); break;
      case "quiz":       deck = shuffle(topic.cards); renderQuiz(); break;
      case "type":       deck = shuffle(topic.cards); renderType(); break;
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
        `<div class="prompt-flag">${c.icon || ""}</div>` +
        `<div class="prompt-label">${topic.promptLabel}</div>` +
        `<p class="prompt-value">${c.front}</p>` +
        `<p class="hint">Tippe auf die Karte, um die Antwort zu sehen</p>`;
    }
    function paintBack() {
      card.innerHTML =
        `<div class="prompt-flag">${c.icon || ""}</div>` +
        `<div class="prompt-label">${topic.answerLabel}</div>` +
        `<p class="prompt-value answer">${c.back}</p>` +
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
        if (act.dataset.act === "nope") markWrong(c.front);
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
    // Drei falsche Antworten aus dem Themenpool wählen (ohne Dubletten).
    const pool = Array.from(new Set(
      topic.cards.map((x) => x.back).filter((b) => b !== c.back)
    ));
    const distractors = shuffle(pool).slice(0, 3);
    const options = shuffle([c.back, ...distractors]);

    const qValue = topic.quizPrompt ? `${c.front}?` : c.front;
    const qLabel = topic.quizPrompt || topic.promptLabel;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML =
      `<div class="prompt-flag">${c.icon || ""}</div>` +
      `<div class="prompt-label">${qLabel}</div>` +
      `<p class="prompt-value">${qValue}</p>` +
      `<div class="options"></div>` +
      `<div class="score-line">Richtig: ${score} / ${deck.length}</div>`;

    const optWrap = card.querySelector(".options");
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "option";
      btn.type = "button";
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        const correct = opt === c.back;
        optWrap.querySelectorAll(".option").forEach((b) => {
          b.disabled = true;
          if (b.textContent === c.back) b.classList.add("correct");
        });
        if (!correct) btn.classList.add("wrong");
        if (correct) score++;

        const next = document.createElement("button");
        next.className = "btn";
        next.style.marginTop = "18px";
        next.textContent = index + 1 < deck.length ? "Weiter" : "Ergebnis";
        next.addEventListener("click", () => { index++; proceed(); });
        card.appendChild(next);
        onAnswered(correct, c, card);
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
      if (!correct) markWrong(c.front);
    }, renderQuiz);
  }

  /* ---------- Tippen ---------- */

  function renderType() {
    if (index >= deck.length) return renderRoundDone("Tippen", true);
    const c = deck[index];

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML =
      `<div class="prompt-flag">${c.icon || ""}</div>` +
      `<div class="prompt-label">${topic.promptLabel}</div>` +
      `<p class="prompt-value">${c.front}</p>` +
      `<form class="type-form">` +
      `<input class="type-input" type="text" autocomplete="off" autocapitalize="words" ` +
      `spellcheck="false" placeholder="${topic.typePlaceholder}" aria-label="Antwort" />` +
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
      const correct = normalize(guess) === normalize(c.back);
      input.disabled = true;
      form.querySelector("button").disabled = true;

      if (correct) {
        score++;
        feedback.textContent = "✓ Richtig!";
        feedback.className = "feedback ok";
      } else {
        markWrong(c.front);
        feedback.textContent = `✗ Falsch – richtig ist: ${c.back}`;
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
    search.placeholder = "Suchen…";
    search.setAttribute("aria-label", "Liste durchsuchen");

    const ul = document.createElement("ul");
    ul.className = "country-list";

    function paint(filter) {
      const f = normalize(filter || "");
      ul.innerHTML = "";
      const items = topic.cards
        .slice()
        .sort((a, b) => a.front.localeCompare(b.front, "de"))
        .filter((c) => !f || normalize(c.front).includes(f) || normalize(c.back).includes(f));
      if (!items.length) {
        ul.innerHTML = `<li><span class="ln">Kein Treffer</span></li>`;
        return;
      }
      items.forEach((c) => {
        const li = document.createElement("li");
        li.innerHTML =
          `<span class="lf">${c.icon || ""}</span>` +
          `<span class="lt">` +
          `<span class="ln">${c.front}</span>` +
          `<span class="lc">${c.back}</span>` +
          `</span>`;
        ul.appendChild(li);
      });
    }

    search.addEventListener("input", () => paint(search.value));
    paint("");

    wrap.appendChild(search);
    wrap.appendChild(ul);
    view.appendChild(wrap);
    setProgress(`${topic.cards.length} Karten`);
  }

  /* ---------- Falsche üben ---------- */

  function renderWrong() {
    if (!deck.length) {
      view.innerHTML =
        `<div class="empty-state">` +
        `<div class="big">🎉</div>` +
        `<p>Keine falschen Antworten gespeichert.</p>` +
        `<p>Spiele Quiz oder Tippen – falsch beantwortete Karten landen hier zum Wiederholen.</p>` +
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
          ? `<p>${remaining.length} Karte(n) in der Liste – beliebig oft wiederholbar.</p>`
          : `<p>Alle Falschen entfernt!</p>`) +
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
    // Quiz-Format. Falsche bleiben gespeichert, damit sie immer wieder geübt
    // werden können – erst der "Gelernt"-Knopf entfernt eine Karte aus der Liste.
    renderQuizCard(deck[index], (correct, c, card) => {
      if (!correct) return;
      const learned = document.createElement("button");
      learned.className = "btn btn--ghost";
      learned.style.marginTop = "10px";
      learned.textContent = "Gelernt – aus Falsch-Liste entfernen";
      learned.addEventListener("click", () => {
        clearWrong(c.front);
        learned.disabled = true;
        learned.textContent = "Entfernt ✓";
      });
      card.appendChild(learned);
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

  // Themen-Auswahl füllen.
  TOPICS.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = `${t.emoji} ${t.name}`;
    topicSelect.appendChild(opt);
  });
  topicSelect.addEventListener("change", () => setTopic(topicSelect.value));

  modeButtons.forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
  resetWrongBtn.addEventListener("click", () => {
    saveWrong(new Set());
    if (mode === "wrong") render();
  });

  // Zuletzt gewähltes Thema wiederherstellen.
  let startId = TOPICS[0].id;
  try {
    const saved = localStorage.getItem(TOPIC_KEY);
    if (saved && TOPICS.some((t) => t.id === saved)) startId = saved;
  } catch (_) { /* ignore */ }

  setTopic(startId);
})();
