/* Lernplan für die Vinci-Lernapp.
 * Eigener Reiter "📅 Lernplan" neben den Themen. Prüfungen (Thema + Datum)
 * werden direkt in der App erfasst; daraus entsteht ein Tagesplan mit
 * passenden Lernmodi bis zur Prüfung. Alles wird in localStorage gespeichert.
 *
 * Läuft unabhängig von app.js: nutzt nur die vorhandenen Reiter- und
 * Modus-Knöpfe, um eine Lerneinheit direkt zu starten.
 */
(function () {
  "use strict";

  const PLAN_KEY = "lernapp-plan";
  const OPEN_KEY = "lernapp-plan-open";
  const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const MODE_NAMES = {
    list: "Liste durchlesen",
    flashcards: "Karteikarten",
    quiz: "Quiz",
    type: "Tippen",
    wrong: "Falsche üben",
  };

  const topics = (typeof TOPICS !== "undefined" && Array.isArray(TOPICS)) ? TOPICS : [];
  const view = document.getElementById("view");
  const tabsEl = document.getElementById("topic-tabs");
  const modesEl = document.querySelector(".modes");
  const footerEl = document.querySelector(".app-footer");
  const subtitleEl = document.getElementById("app-subtitle");
  if (!view || !tabsEl) return;

  let active = false;
  let subview = "today"; // today | overview | exams
  let editingId = null;

  /* ---------- Speicher ---------- */

  function defaults() {
    return { exams: [], done: {}, minutes: 30, days: [1, 2, 3, 4, 5] };
  }

  function load() {
    try {
      const raw = localStorage.getItem(PLAN_KEY);
      const p = raw ? JSON.parse(raw) : null;
      if (!p || typeof p !== "object") return defaults();
      const d = defaults();
      return {
        exams: Array.isArray(p.exams) ? p.exams : d.exams,
        done: p.done && typeof p.done === "object" ? p.done : d.done,
        minutes: Number(p.minutes) > 0 ? Number(p.minutes) : d.minutes,
        days: Array.isArray(p.days) && p.days.length ? p.days : d.days,
      };
    } catch (_) {
      return defaults();
    }
  }

  function save(p) {
    try { localStorage.setItem(PLAN_KEY, JSON.stringify(p)); } catch (_) { /* ignore */ }
  }

  /* ---------- Datum ---------- */

  function iso(d) {
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  }
  function parse(s) {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  function today() {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function addDays(d, n) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  }
  function diffDays(a, b) {
    return Math.round((b - a) / 86400000);
  }
  function fmt(d) {
    return `${WEEKDAYS[d.getDay()]}, ${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  }
  function fmtShort(d) {
    return `${WEEKDAYS[d.getDay()]} ${d.getDate()}.${d.getMonth() + 1}.`;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (ch) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
    ));
  }

  function topicOf(exam) {
    return topics.find((t) => t.id === exam.topicId) || null;
  }
  function examLabel(exam) {
    const t = topicOf(exam);
    if (exam.title) return exam.title;
    return t ? `${t.emoji} ${t.name}` : "Prüfung";
  }

  /* ---------- Planberechnung ---------- */

  // Lerntage vor der Prüfung (ohne Prüfungstag), ab heute.
  function studyDays(exam, p) {
    const start = today();
    const end = parse(exam.date);
    const out = [];
    for (let d = start; d < end; d = addDays(d, 1)) {
      if (p.days.includes(d.getDay())) out.push(iso(d));
    }
    // Falls keine Lerntage übrig sind (z. B. Prüfung morgen, aber kein
    // Lerntag), trotzdem den letzten Tag vor der Prüfung einplanen.
    if (!out.length && diffDays(start, end) >= 1) out.push(iso(addDays(end, -1)));
    return out;
  }

  // Phase eines Lerntages: früh = kennenlernen, Mitte = festigen,
  // spät = prüfen, letzter Tag = Generalprobe.
  function tasksFor(posFromEnd, total) {
    if (posFromEnd === 0) {
      return { phase: "Generalprobe", modes: [["wrong", 0.5], ["type", 0.5]] };
    }
    const progress = total <= 1 ? 1 : 1 - posFromEnd / (total - 1);
    if (progress < 0.34) {
      return { phase: "Kennenlernen", modes: [["list", 0.3], ["flashcards", 0.7]] };
    }
    if (progress < 0.67) {
      return { phase: "Festigen", modes: [["flashcards", 0.4], ["quiz", 0.6]] };
    }
    return { phase: "Prüfen", modes: [["type", 0.6], ["wrong", 0.4]] };
  }

  // Plan für einen Tag: alle offenen Prüfungen, die Minuten werden aufgeteilt.
  // Prüfungen in den nächsten 3 Tagen erhalten doppeltes Gewicht.
  function planForDay(dayIso, p) {
    const entries = [];
    p.exams.forEach((exam) => {
      const days = studyDays(exam, p);
      const pos = days.indexOf(dayIso);
      if (pos === -1) return;
      const posFromEnd = days.length - 1 - pos;
      const until = diffDays(parse(dayIso), parse(exam.date));
      entries.push({ exam, posFromEnd, total: days.length, weight: until <= 3 ? 2 : 1 });
    });
    const sum = entries.reduce((s, e) => s + e.weight, 0);
    return entries
      .sort((a, b) => a.exam.date.localeCompare(b.exam.date))
      .map((e) => {
        const minutes = Math.max(5, Math.round((p.minutes * e.weight / sum) / 5) * 5);
        const t = tasksFor(e.posFromEnd, e.total);
        const tasks = t.modes.map(([m, share], i) => ({
          key: `${dayIso}|${e.exam.id}|${i}`,
          mode: m,
          minutes: Math.max(5, Math.round((minutes * share) / 5) * 5),
        }));
        return { exam: e.exam, phase: t.phase, minutes, tasks };
      });
  }

  function examsOn(dayIso, p) {
    return p.exams.filter((e) => e.date === dayIso);
  }

  /* ---------- Ein-/Ausblenden ---------- */

  function setActive(on) {
    active = on;
    try { localStorage.setItem(OPEN_KEY, on ? "1" : "0"); } catch (_) { /* ignore */ }
    planBtn.classList.toggle("active", on);
    planBtn.setAttribute("aria-selected", on ? "true" : "false");
    if (modesEl) modesEl.hidden = on;
    if (footerEl) footerEl.hidden = on;
    if (on) {
      tabsEl.querySelectorAll(".topic-tab").forEach((b) => {
        if (b !== planBtn) {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        }
      });
      if (subtitleEl) subtitleEl.textContent = "Prüfungen eintragen – die App plant die Lerneinheiten bis zum Termin.";
      document.title = "Vinci-Lernapp · Lernplan";
      render();
    }
  }

  // Lerneinheit starten: Thema-Reiter und Modus-Knopf der App auslösen.
  function startTask(exam, mode) {
    const btn = tabsEl.querySelector(`.topic-tab[data-topic="${CSS.escape(exam.topicId)}"]`);
    if (!btn) return;
    setActive(false);
    btn.click();
    const modeBtn = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
    if (modeBtn) modeBtn.click();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- Darstellung ---------- */

  function render() {
    if (!active) return;
    const p = load();
    view.innerHTML = "";

    const nav = document.createElement("div");
    nav.className = "plan-nav";
    [["today", "Heute"], ["overview", "Übersicht"], ["exams", `Prüfungen (${p.exams.length})`]]
      .forEach(([id, label]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "mode-btn" + (subview === id ? " active" : "");
        b.textContent = label;
        b.addEventListener("click", () => { subview = id; editingId = null; render(); });
        nav.appendChild(b);
      });
    view.appendChild(nav);

    if (subview === "today") renderToday(p);
    else if (subview === "overview") renderOverview(p);
    else renderExams(p);
  }

  function renderTaskList(container, dayIso, p, interactive) {
    const plan = planForDay(dayIso, p);
    plan.forEach((block) => {
      const t = topicOf(block.exam);
      const until = diffDays(parse(dayIso), parse(block.exam.date));
      const el = document.createElement("div");
      el.className = "plan-block";
      el.innerHTML =
        `<div class="plan-block-head">` +
        `<span class="plan-title">${esc(examLabel(block.exam))}</span>` +
        `<span class="plan-meta">${esc(block.phase)} · ${block.minutes} Min. · ` +
        `Prüfung in ${until} ${until === 1 ? "Tag" : "Tagen"}</span>` +
        `</div>`;
      const ul = document.createElement("ul");
      ul.className = "plan-tasks";
      block.tasks.forEach((task) => {
        const li = document.createElement("li");
        const done = !!p.done[task.key];
        li.className = done ? "done" : "";
        const label = `${MODE_NAMES[task.mode]} – ${task.minutes} Min.`;
        if (interactive) {
          li.innerHTML =
            `<label class="plan-check"><input type="checkbox" ${done ? "checked" : ""} />` +
            `<span>${esc(label)}</span></label>`;
          li.querySelector("input").addEventListener("change", (e) => {
            const q = load();
            if (e.target.checked) q.done[task.key] = true;
            else delete q.done[task.key];
            save(q);
            render();
          });
          if (t) {
            const go = document.createElement("button");
            go.type = "button";
            go.className = "btn btn--small";
            go.textContent = "Starten";
            go.addEventListener("click", () => startTask(block.exam, task.mode));
            li.appendChild(go);
          }
        } else {
          li.innerHTML = `<span>${done ? "✓ " : ""}${esc(label)}</span>`;
        }
        ul.appendChild(li);
      });
      el.appendChild(ul);
      if (interactive && !t) {
        const hint = document.createElement("p");
        hint.className = "plan-hint";
        hint.textContent = "Kein App-Thema verknüpft – mit eigenem Material lernen.";
        el.appendChild(hint);
      }
      container.appendChild(el);
    });
    return plan.length;
  }

  function renderToday(p) {
    const d = today();
    const dIso = iso(d);
    const card = document.createElement("div");
    card.className = "card plan-card";
    card.innerHTML = `<div class="prompt-label">Heute · ${fmt(d)}</div>`;

    const todaysExams = examsOn(dIso, p);
    todaysExams.forEach((e) => {
      const div = document.createElement("div");
      div.className = "plan-exam-today";
      div.textContent = `🍀 Heute Prüfung: ${examLabel(e)} – viel Erfolg!`;
      card.appendChild(div);
    });

    const count = renderTaskList(card, dIso, p, true);
    if (!count) {
      const upcoming = p.exams
        .filter((e) => e.date > dIso)
        .sort((a, b) => a.date.localeCompare(b.date));
      const msg = document.createElement("div");
      msg.className = "empty-state";
      if (!p.exams.length) {
        msg.innerHTML = `<div class="big">📅</div><p>Noch keine Prüfungen eingetragen.</p>`;
        const b = document.createElement("button");
        b.className = "btn";
        b.type = "button";
        b.textContent = "Prüfung eintragen";
        b.addEventListener("click", () => { subview = "exams"; render(); });
        msg.appendChild(b);
      } else if (upcoming.length) {
        msg.innerHTML = `<div class="big">😌</div><p>Heute ist kein Lerntag.</p>` +
          `<p>Nächste Prüfung: ${esc(examLabel(upcoming[0]))} am ${fmt(parse(upcoming[0].date))}.</p>`;
      } else {
        msg.innerHTML = `<div class="big">🎉</div><p>Alle eingetragenen Prüfungen sind vorbei.</p>`;
      }
      card.appendChild(msg);
    } else {
      const keys = planForDay(dIso, p).flatMap((b) => b.tasks.map((t) => t.key));
      const doneN = keys.filter((k) => p.done[k]).length;
      const prog = document.createElement("div");
      prog.className = "plan-progress";
      prog.innerHTML =
        `<div class="plan-bar"><span style="width:${Math.round((doneN / keys.length) * 100)}%"></span></div>` +
        `<span>${doneN} von ${keys.length} erledigt</span>`;
      card.appendChild(prog);
    }
    view.appendChild(card);
  }

  function renderOverview(p) {
    const start = today();
    const last = p.exams.reduce((m, e) => (e.date > m ? e.date : m), iso(start));
    const span = Math.min(60, diffDays(start, parse(last)));
    const wrap = document.createElement("div");
    wrap.className = "plan-overview";
    let shown = 0;
    for (let i = 0; i <= span; i++) {
      const d = addDays(start, i);
      const dIso = iso(d);
      const exams = examsOn(dIso, p);
      const has = planForDay(dIso, p).length;
      if (!has && !exams.length) continue;
      const day = document.createElement("div");
      day.className = "card plan-day" + (i === 0 ? " plan-day--today" : "");
      day.innerHTML = `<div class="prompt-label">${i === 0 ? "Heute · " : ""}${fmtShort(d)}</div>`;
      exams.forEach((e) => {
        const div = document.createElement("div");
        div.className = "plan-exam-today";
        div.textContent = `📝 Prüfung: ${examLabel(e)}`;
        day.appendChild(div);
      });
      renderTaskList(day, dIso, p, false);
      wrap.appendChild(day);
      shown++;
    }
    if (!shown) {
      wrap.innerHTML = `<div class="empty-state"><div class="big">📅</div><p>Noch nichts geplant – zuerst eine Prüfung eintragen.</p></div>`;
    }
    view.appendChild(wrap);
  }

  function renderExams(p) {
    const card = document.createElement("div");
    card.className = "card plan-card";
    const editing = p.exams.find((e) => e.id === editingId) || null;

    const options = topics.map((t) =>
      `<option value="${esc(t.id)}" ${editing && editing.topicId === t.id ? "selected" : ""}>` +
      `${esc(t.emoji + " " + t.name)}</option>`
    ).join("");

    card.innerHTML =
      `<div class="prompt-label">${editing ? "Prüfung bearbeiten" : "Neue Prüfung"}</div>` +
      `<form class="plan-form">` +
      `<label><span>Thema in der App</span>` +
      `<select name="topic"><option value="">– kein App-Thema –</option>${options}</select></label>` +
      `<label><span>Bezeichnung (optional)</span>` +
      `<input name="title" type="text" maxlength="60" placeholder="z. B. Franz-Test Unité 3" ` +
      `value="${editing ? esc(editing.title || "") : ""}" /></label>` +
      `<label><span>Prüfungsdatum</span>` +
      `<input name="date" type="date" required min="${iso(today())}" value="${editing ? esc(editing.date) : ""}" /></label>` +
      `<div class="row-btns">` +
      (editing ? `<button type="button" class="btn btn--ghost" data-act="cancel">Abbrechen</button>` : "") +
      `<button type="submit" class="btn">${editing ? "Speichern" : "Hinzufügen"}</button>` +
      `</div>` +
      `<p class="feedback bad" role="status"></p>` +
      `</form>`;

    const form = card.querySelector("form");
    const fb = card.querySelector(".feedback");
    const cancel = card.querySelector('[data-act="cancel"]');
    if (cancel) cancel.addEventListener("click", () => { editingId = null; render(); });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = form.elements;
      const topicId = f.topic.value;
      const title = f.title.value.trim();
      const date = f.date.value;
      if (!date) { fb.textContent = "Bitte ein Datum wählen."; return; }
      if (!topicId && !title) { fb.textContent = "Bitte ein Thema wählen oder eine Bezeichnung eingeben."; return; }
      const q = load();
      if (editing) {
        const ex = q.exams.find((x) => x.id === editing.id);
        if (ex) Object.assign(ex, { topicId, title, date });
      } else {
        q.exams.push({ id: "e" + Date.now().toString(36), topicId, title, date });
      }
      save(q);
      editingId = null;
      render();
    });
    view.appendChild(card);

    // Liste der Prüfungen
    const list = document.createElement("ul");
    list.className = "country-list plan-exam-list";
    const sorted = p.exams.slice().sort((a, b) => a.date.localeCompare(b.date));
    sorted.forEach((exam) => {
      const d = parse(exam.date);
      const until = diffDays(today(), d);
      const li = document.createElement("li");
      const when = until < 0 ? "vorbei" : until === 0 ? "heute" : `in ${until} ${until === 1 ? "Tag" : "Tagen"}`;
      li.innerHTML =
        `<span class="lf">📝</span>` +
        `<span class="lt"><span class="ln">${esc(examLabel(exam))}</span>` +
        `<span class="lc">${fmt(d)} · ${when}</span></span>` +
        `<span class="plan-actions">` +
        `<button type="button" class="link-btn" data-act="edit">Bearbeiten</button>` +
        `<button type="button" class="link-btn plan-del" data-act="del">Löschen</button>` +
        `</span>`;
      li.querySelector('[data-act="edit"]').addEventListener("click", () => { editingId = exam.id; render(); });
      li.querySelector('[data-act="del"]').addEventListener("click", () => {
        if (!confirm(`Prüfung «${examLabel(exam)}» löschen?`)) return;
        const q = load();
        q.exams = q.exams.filter((x) => x.id !== exam.id);
        Object.keys(q.done).forEach((k) => { if (k.split("|")[1] === exam.id) delete q.done[k]; });
        save(q);
        render();
      });
      list.appendChild(li);
    });
    if (sorted.length) view.appendChild(list);

    // Einstellungen: Minuten pro Tag und Lerntage
    const set = document.createElement("div");
    set.className = "card plan-card plan-settings";
    set.innerHTML =
      `<div class="prompt-label">Einstellungen</div>` +
      `<label class="plan-inline"><span>Lernzeit pro Tag</span>` +
      `<select name="minutes">${[15, 20, 30, 45, 60].map((m) =>
        `<option value="${m}" ${p.minutes === m ? "selected" : ""}>${m} Min.</option>`).join("")}</select></label>` +
      `<div class="plan-days"><span>Lerntage</span>` +
      [1, 2, 3, 4, 5, 6, 0].map((d) =>
        `<label><input type="checkbox" value="${d}" ${p.days.includes(d) ? "checked" : ""} />${WEEKDAYS[d]}</label>`
      ).join("") +
      `</div>`;
    set.querySelector('[name="minutes"]').addEventListener("change", (e) => {
      const q = load(); q.minutes = Number(e.target.value); save(q);
    });
    set.querySelectorAll('.plan-days input').forEach((cb) => cb.addEventListener("change", () => {
      const days = Array.from(set.querySelectorAll('.plan-days input:checked')).map((x) => Number(x.value));
      if (!days.length) { cb.checked = true; return; }
      const q = load(); q.days = days; save(q);
    }));
    view.appendChild(set);
  }

  /* ---------- Allgemein: Apostroph vereinheitlichen ---------- */
  // Handy-Tastaturen setzen oft ’ statt ' – beim Tippen-Modus angleichen,
  // damit z. B. "j’ai bu" als richtig erkannt wird.
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (el && el.classList && el.classList.contains("type-input") && /[’‘`´]/.test(el.value)) {
      const pos = el.selectionStart;
      el.value = el.value.replace(/[’‘`´]/g, "'");
      try { el.setSelectionRange(pos, pos); } catch (_) { /* ignore */ }
    }
  });

  /* ---------- Init ---------- */

  const planBtn = document.createElement("button");
  planBtn.className = "topic-tab topic-tab--plan";
  planBtn.type = "button";
  planBtn.dataset.topic = "__plan";
  planBtn.setAttribute("role", "tab");
  planBtn.textContent = "📅 Lernplan";
  planBtn.addEventListener("click", () => setActive(true));
  tabsEl.appendChild(planBtn);

  // Klick auf ein Thema verlässt den Lernplan (app.js rendert das Thema selbst).
  tabsEl.addEventListener("click", (e) => {
    const b = e.target.closest(".topic-tab");
    if (b && b !== planBtn && active) {
      active = false;
      try { localStorage.setItem(OPEN_KEY, "0"); } catch (_) { /* ignore */ }
      planBtn.classList.remove("active");
      planBtn.setAttribute("aria-selected", "false");
      if (modesEl) modesEl.hidden = false;
      if (footerEl) footerEl.hidden = false;
    }
  }, true);

  let openAtStart = !topics.length;
  try { if (localStorage.getItem(OPEN_KEY) === "1") openAtStart = true; } catch (_) { /* ignore */ }
  if (openAtStart) setActive(true);
})();
