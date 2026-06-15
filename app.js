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
  const topicTabsEl = document.getElementById("topic-tabs");
  const modeButtons = Array.from(document.querySelectorAll(".mode-btn"));
  let topicButtons = []; // Reiter-Buttons je Thema

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

  // Prüft eine Eingabe gegen eine Antwort, die mehrere zulässige Formen
  // enthalten kann (getrennt durch "/" oder ","), z. B. "was/were".
  function answerMatches(guess, answer) {
    const g = normalize(guess);
    return answer.split(/[\/,]/).some((opt) => normalize(opt) === g);
  }

  // Französische Konjugation tolerant vergleichen: Akzente (von normalize
  // entfernt), Apostroph-Varianten, optionale Genus-Endung "(e)" und ein
  // vorangestelltes Subjektpronomen werden ignoriert. "il parle" akzeptiert
  // also auch "elle parle" oder nur "parle".
  function conjCore(s) {
    let x = normalize(s)
      .replace(/[’'`]/g, "'")
      .replace(/\s*'\s*/g, "'")
      .replace(/\s+/g, " ")
      .trim();
    x = x.replace(/^(j'|je |tu |il |elle |on |nous |vous |ils |elles )/, "");
    return x.trim();
  }
  function conjVariants(answer) {
    const out = [];
    answer.split("/").forEach((b) => {
      if (/\(e\)/.test(b)) {
        out.push(b.replace(/\(e\)/g, ""));
        out.push(b.replace(/\(e\)/g, "e"));
      } else {
        out.push(b);
      }
    });
    return out;
  }
  function conjMatches(guess, answer) {
    const g = conjCore(guess);
    return conjVariants(answer).some((v) => conjCore(v) === g);
  }
  // Lösungs-Anzeige (alle Formen) für Konjugationskarten.
  function conjSolution(c) {
    return [
      c.present.je, c.present.tu, c.present.il,
      c.present.nous, c.present.vous, c.present.ils,
      "passé composé: " + c.pc,
    ].join("<br>");
  }

  /* ---------- Themen-Steuerung ---------- */

  function setTopic(id) {
    const next = TOPICS.find((t) => t.id === id) || TOPICS[0];
    topic = next;
    try { localStorage.setItem(TOPIC_KEY, topic.id); } catch (_) { /* ignore */ }
    topicButtons.forEach((b) => {
      const active = b.dataset.topic === topic.id;
      b.classList.toggle("active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });
    subtitleEl.textContent = topic.subtitle;
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
      const answerHtml = typeof c.present === "object"
        ? `<div class="prompt-label">${c.fr} · Konjugation</div>` +
          `<div class="conj-table">${conjSolution(c)}</div>`
        : `<div class="prompt-label">${topic.answerLabel}</div>` +
          `<p class="prompt-value answer">${c.back}</p>`;
      card.innerHTML =
        `<div class="prompt-flag">${c.icon || ""}</div>` +
        answerHtml +
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

    // Französische Verben: ganze Konjugation abfragen.
    if (typeof c.present === "object") return renderTypeConjugation(c);
    // Englische Verben: zwei Felder (Gegenwart & Vergangenheit) abfragen.
    if (c.present !== undefined) return renderTypeVerb(c);

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

  // Tippen-Variante für Verben: getrennte Felder für Gegenwart und Vergangenheit.
  function renderTypeVerb(c) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML =
      `<div class="prompt-flag">${c.icon || ""}</div>` +
      `<div class="prompt-label">${topic.promptLabel}</div>` +
      `<p class="prompt-value">${c.front}</p>` +
      `<form class="type-form type-form--verb">` +
      `<label class="verb-field"><span>Gegenwart</span>` +
      `<input class="type-input" data-form="present" type="text" autocomplete="off" ` +
      `autocapitalize="none" spellcheck="false" placeholder="present" aria-label="Gegenwart" /></label>` +
      `<label class="verb-field"><span>Vergangenheit</span>` +
      `<input class="type-input" data-form="past" type="text" autocomplete="off" ` +
      `autocapitalize="none" spellcheck="false" placeholder="past" aria-label="Vergangenheit" /></label>` +
      `<button class="btn" type="submit">Prüfen</button>` +
      `</form>` +
      `<div class="feedback" role="status"></div>` +
      `<div class="score-line">Richtig: ${score} / ${deck.length}</div>`;

    const form = card.querySelector("form");
    const inPresent = card.querySelector('[data-form="present"]');
    const inPast = card.querySelector('[data-form="past"]');
    const feedback = card.querySelector(".feedback");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!inPresent.value.trim() && !inPast.value.trim()) return;

      const okPresent = answerMatches(inPresent.value, c.present);
      const okPast = answerMatches(inPast.value, c.past);
      const correct = okPresent && okPast;

      inPresent.disabled = true;
      inPast.disabled = true;
      form.querySelector("button").disabled = true;
      inPresent.classList.add(okPresent ? "input-ok" : "input-bad");
      inPast.classList.add(okPast ? "input-ok" : "input-bad");

      if (correct) {
        score++;
        feedback.textContent = "✓ Richtig!";
        feedback.className = "feedback ok";
      } else {
        markWrong(c.front);
        feedback.textContent = `✗ Richtig: ${c.present} – ${c.past}`;
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
    inPresent.focus();
    setProgress(`Frage ${index + 1} von ${deck.length}`);
  }

  // Tippen-Variante für französische Verben: ganze Präsens-Konjugation
  // (alle Personen) plus Passé composé eintragen.
  function renderTypeConjugation(c) {
    const rows = [
      ["je", c.present.je],
      ["tu", c.present.tu],
      ["il / elle", c.present.il],
      ["nous", c.present.nous],
      ["vous", c.present.vous],
      ["ils / elles", c.present.ils],
    ];

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML =
      `<div class="prompt-flag">${c.icon || ""}</div>` +
      `<div class="prompt-label">Konjugieren – présent & passé composé</div>` +
      `<p class="prompt-value">${c.front}</p>` +
      `<p class="hint">(${c.fr})</p>` +
      `<form class="type-form type-form--conj">` +
      rows.map((r, i) =>
        `<label class="conj-field"><span>${r[0]}</span>` +
        `<input class="type-input" data-i="${i}" type="text" autocomplete="off" ` +
        `autocapitalize="none" spellcheck="false" placeholder="${r[0].split(" ")[0]} …" aria-label="${r[0]}" /></label>`
      ).join("") +
      `<label class="conj-field conj-field--pc"><span>passé composé</span>` +
      `<input class="type-input" data-i="pc" type="text" autocomplete="off" ` +
      `autocapitalize="none" spellcheck="false" placeholder="z. B. j'ai …" aria-label="passé composé" /></label>` +
      `<button class="btn" type="submit">Prüfen</button>` +
      `</form>` +
      `<div class="feedback" role="status"></div>` +
      `<div class="score-line">Richtig: ${score} / ${deck.length}</div>`;

    const form = card.querySelector("form");
    const inputs = Array.from(card.querySelectorAll(".type-input"));
    const answers = rows.map((r) => r[1]).concat([c.pc]);
    const feedback = card.querySelector(".feedback");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (inputs.every((inp) => !inp.value.trim())) return;

      let allOk = true;
      inputs.forEach((inp, i) => {
        const ok = conjMatches(inp.value, answers[i]);
        if (!ok) allOk = false;
        inp.disabled = true;
        inp.classList.add(ok ? "input-ok" : "input-bad");
      });
      form.querySelector("button").disabled = true;

      if (allOk) {
        score++;
        feedback.textContent = "✓ Richtig!";
        feedback.className = "feedback ok";
      } else {
        markWrong(c.front);
        feedback.innerHTML =
          `✗ Richtig:<div class="conj-solution">${conjSolution(c)}</div>`;
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
    inputs[0].focus();
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

  // Karten mit present/past (Verben): "back" für die Anzeige (Karteikarten,
  // Quiz, Liste) automatisch aus beiden Formen zusammensetzen.
  TOPICS.forEach((t) => t.cards.forEach((c) => {
    if (c.present !== undefined && c.back === undefined) {
      c.back = typeof c.present === "object"
        ? `${c.fr} – ${c.pc}`              // Französisch: Infinitiv – Passé composé
        : `${c.present} – ${c.past}`;       // Englisch: Gegenwart – Vergangenheit
    }
  }));

  // Themen-Reiter aufbauen.
  topicButtons = TOPICS.map((t) => {
    const btn = document.createElement("button");
    btn.className = "topic-tab";
    btn.type = "button";
    btn.dataset.topic = t.id;
    btn.setAttribute("role", "tab");
    btn.textContent = `${t.emoji} ${t.name}`;
    btn.addEventListener("click", () => setTopic(t.id));
    topicTabsEl.appendChild(btn);
    return btn;
  });

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
