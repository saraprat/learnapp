/* Arbeitsblatt zum Ausdrucken: erzeugt aus dem aktuellen Thema ein zufälliges
 * Übungsblatt (30 Aufgaben) zum Ausfüllen von Hand, plus Lösungsseite.
 * Fügt dazu einen Knopf "🖨️ Arbeitsblatt" in die Modus-Leiste ein.
 */
(function () {
  "use strict";

  const COUNT = 30;
  const topics = (typeof TOPICS !== "undefined" && Array.isArray(TOPICS)) ? TOPICS : [];
  const modesEl = document.querySelector(".modes");
  const view = document.getElementById("view");
  const progressEl = document.getElementById("progress");
  if (!modesEl || !view || !topics.length) return;

  function currentTopic() {
    const active = document.querySelector(".topic-tab.active");
    const id = active ? active.dataset.topic : null;
    return topics.find((t) => t.id === id) || null;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const LINE = '<span class="ws-line"></span>';

  // Aufgabe (Vorderseite mit Schreiblinien) für eine Karte.
  function taskHtml(c) {
    if (c.present && typeof c.present === "object") {
      const rows = ["je", "tu", "il / elle", "nous", "vous", "ils / elles"]
        .map((p) => `<div class="ws-row"><span class="ws-label">${p}</span>${LINE}</div>`).join("");
      return `<div class="ws-q">${c.front}</div><div class="ws-conj">${rows}` +
        `<div class="ws-row"><span class="ws-label">passé composé</span>${LINE}</div></div>`;
    }
    if (c.present !== undefined) {
      return `<div class="ws-q">${c.front}</div>` +
        `<div class="ws-row"><span class="ws-label">present</span>${LINE}` +
        `<span class="ws-label">past</span>${LINE}</div>`;
    }
    if (c.hint) {
      return `<div class="ws-q">${c.front}</div>` +
        `<div class="ws-row"><span class="ws-label">Hilfsverb</span>${LINE}` +
        `<span class="ws-label">Partizip</span>${LINE}</div>`;
    }
    if (c.front.includes("___")) {
      return `<div class="ws-q">${c.front.replace(/_{3,}/g, '<span class="ws-gap"></span>')}</div>`;
    }
    return `<div class="ws-q">${c.front}</div><div class="ws-row">${LINE}</div>`;
  }

  function solutionHtml(c) {
    if (c.present && typeof c.present === "object") {
      const p = c.present;
      return [p.je, p.tu, p.il, p.nous, p.vous, p.ils].join(" · ") + ` · <em>${c.pc}</em>`;
    }
    if (c.present !== undefined) return `${c.present} – ${c.past}`;
    if (c.hint) return `${c.back} – ${c.hint}`;
    return c.back;
  }

  function render() {
    const topic = currentTopic();
    if (!topic) return;
    modesEl.querySelectorAll(".mode-btn").forEach((b) => b.classList.toggle("active", b === btn));
    const resetBtn = document.getElementById("reset-wrong");
    if (resetBtn) resetBtn.hidden = true;
    if (progressEl) progressEl.textContent = "";

    const cards = shuffle(topic.cards).slice(0, COUNT);
    const today = new Date().toLocaleDateString("de-CH");

    view.innerHTML =
      `<div class="ws-tools row-btns">` +
      `<button type="button" class="btn" data-act="print">🖨️ Drucken</button>` +
      `<button type="button" class="btn btn--ghost" data-act="new">🔀 Neues Blatt</button>` +
      `</div>` +
      `<p class="hint ws-tip">Tipp: Im Druckdialog kann man auch «Als PDF sichern» wählen.</p>` +
      `<div class="ws-sheet">` +
      `<header class="ws-head"><h2>${topic.emoji} ${topic.name}</h2>` +
      `<div class="ws-meta"><span>Name: <span class="ws-line ws-line--short"></span></span>` +
      `<span>Datum: ${today}</span></div>` +
      (topic.subtitle ? `<p class="ws-sub">${topic.subtitle}</p>` : "") +
      `</header>` +
      `<ol class="ws-list">${cards.map((c) => `<li>${taskHtml(c)}</li>`).join("")}</ol>` +
      `<section class="ws-solutions"><h2>Lösungen – ${topic.name}</h2>` +
      `<ol class="ws-sol-list">${cards.map((c) => `<li>${solutionHtml(c)}</li>`).join("")}</ol>` +
      `</section></div>`;

    view.querySelector('[data-act="print"]').addEventListener("click", () => window.print());
    view.querySelector('[data-act="new"]').addEventListener("click", render);
  }

  const btn = document.createElement("button");
  btn.className = "mode-btn mode-btn--print";
  btn.type = "button";
  btn.dataset.mode = "print";
  btn.textContent = "🖨️ Arbeitsblatt";
  btn.addEventListener("click", render);
  modesEl.appendChild(btn);

  // Andere Modus-Knöpfe: Arbeitsblatt-Knopf wieder deaktivieren.
  modesEl.addEventListener("click", (e) => {
    const b = e.target.closest(".mode-btn");
    if (b && b !== btn) btn.classList.remove("active");
  });
  document.getElementById("topic-tabs").addEventListener("click", () => btn.classList.remove("active"));
})();
