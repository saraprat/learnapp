/* Merkblatt Passé composé (avoir / être) mit Eselsbrücken.
 * Knopf "📒 Merkblatt" erscheint bei den Passé-composé-Themen (id beginnt mit "pc-").
 */
(function () {
  "use strict";

  const HTML = `
<article class="mb">
  <h2>📒 Merkblatt: Passé composé</h2>
  <p class="mb-lead">Das passé composé erzählt, was <b>passiert ist</b> (abgeschlossen, in der Vergangenheit).</p>

  <section class="mb-box mb-box--blue">
    <h3>1. Der Bauplan</h3>
    <p class="mb-formula"><span class="mb-s">Subjekt</span> + <span class="mb-h">Hilfsverb (avoir / être)</span> + <span class="mb-p">Partizip</span></p>
    <p>Tu <b>as mangé</b> une pomme. · Elles <b>sont allées</b> au café.</p>
    <p class="mb-tip">💡 Wie im Deutschen: ich <b>habe</b> gegessen · ich <b>bin</b> gegangen.</p>
  </section>

  <section class="mb-box">
    <h3>2. Die Hilfsverben im Präsens</h3>
    <table class="mb-table">
      <tr><th></th><th>avoir</th><th>être</th></tr>
      <tr><td>je / j'</td><td>ai</td><td>suis</td></tr>
      <tr><td>tu</td><td>as</td><td>es</td></tr>
      <tr><td>il / elle / on</td><td>a</td><td>est</td></tr>
      <tr><td>nous</td><td>avons</td><td>sommes</td></tr>
      <tr><td>vous</td><td>avez</td><td>êtes</td></tr>
      <tr><td>ils / elles</td><td>ont</td><td>sont</td></tr>
    </table>
    <p class="mb-tip">💡 <b>ils ont</b> (haben) – <b>ils sont</b> (sind): Das <b>s</b> von <b>s</b>ont steht für <b>s</b>ein.</p>
  </section>

  <section class="mb-box">
    <h3>3. Partizip – regelmässig</h3>
    <table class="mb-table">
      <tr><th>Infinitiv</th><th>wird zu</th><th>Beispiel</th></tr>
      <tr><td>-er</td><td><b>-é</b></td><td>manger → mangé</td></tr>
      <tr><td>-ir</td><td><b>-i</b></td><td>finir → fini</td></tr>
      <tr><td>-re</td><td><b>-u</b></td><td>vendre → vendu</td></tr>
    </table>
    <p class="mb-tip">💡 Merke die Reihe <b>é – i – u</b> (er – ir – re).<br>
    ⚠️ Nie den Infinitiv schreiben: tu as <s>travailler</s> → tu as <b>travaillé</b>.</p>
  </section>

  <section class="mb-box">
    <h3>4. Partizip – unregelmässig (in Familien lernen)</h3>
    <div class="mb-grid">
      <div><h4>u-Familie</h4>
        avoir → <b>eu</b><br>voir → <b>vu</b><br>savoir → <b>su</b><br>pouvoir → <b>pu</b><br>vouloir → <b>voulu</b><br>
        boire → <b>bu</b><br>lire → <b>lu</b><br>courir → <b>couru</b><br>vivre → <b>vécu</b><br>venir → <b>venu</b></div>
      <div><h4>is / it-Familie</h4>
        prendre → <b>pris</b><br>mettre → <b>mis</b><br>dire → <b>dit</b><br>faire → <b>fait</b>
        <h4>ert-Familie</h4>
        offrir → <b>offert</b><br>ouvrir → <b>ouvert</b>
        <h4>Einzelgänger</h4>
        être → <b>été</b><br>naître → <b>né</b><br>mourir → <b>mort</b><br>rire → <b>ri</b></div>
    </div>
    <p class="mb-tip">💡 Die u-Familie ist die grösste. Viele Verben auf <b>-oir</b> haben ein kurzes Partizip auf <b>-u</b>: voir → vu, savoir → su, pouvoir → pu, vouloir → voulu.</p>
  </section>

  <section class="mb-box mb-box--blue">
    <h3>5. Welche Verben nehmen «être»?</h3>
    <p><b>Fast alle Verben nehmen avoir.</b> Nur <b>16 Verben</b> + alle <b>rückbezüglichen Verben</b> (se lever …) nehmen être.</p>
    <p class="mb-tip">💡 <b>Eselsbrücke 1: DR &amp; MRS VANDERTRAMP</b> – jeder Buchstabe ist ein Verb:</p>
    <table class="mb-table mb-table--small">
      <tr><th></th><th>Verb</th><th>Deutsch</th><th>Partizip</th></tr>
      <tr><td>D</td><td>devenir</td><td>werden</td><td>devenu</td></tr>
      <tr><td>R</td><td>revenir</td><td>zurückkehren</td><td>revenu</td></tr>
      <tr><td>M</td><td>monter</td><td>hinaufsteigen</td><td>monté</td></tr>
      <tr><td>R</td><td>retourner</td><td>zurückgehen</td><td>retourné</td></tr>
      <tr><td>S</td><td>sortir</td><td>hinausgehen</td><td>sorti</td></tr>
      <tr><td>V</td><td>venir</td><td>kommen</td><td>venu</td></tr>
      <tr><td>A</td><td>arriver</td><td>ankommen</td><td>arrivé</td></tr>
      <tr><td>N</td><td>naître</td><td>geboren werden</td><td>né</td></tr>
      <tr><td>D</td><td>descendre</td><td>hinabsteigen</td><td>descendu</td></tr>
      <tr><td>E</td><td>entrer</td><td>eintreten</td><td>entré</td></tr>
      <tr><td>R</td><td>rester</td><td>bleiben</td><td>resté</td></tr>
      <tr><td>T</td><td>tomber</td><td>fallen</td><td>tombé</td></tr>
      <tr><td>R</td><td>rentrer</td><td>heimkehren</td><td>rentré</td></tr>
      <tr><td>A</td><td>aller</td><td>gehen</td><td>allé</td></tr>
      <tr><td>M</td><td>mourir</td><td>sterben</td><td>mort</td></tr>
      <tr><td>P</td><td>partir</td><td>weggehen</td><td>parti</td></tr>
    </table>
    <p class="mb-tip">💡 <b>Eselsbrücke 2: Das Haus</b> (wie im Dossier-Bild) – fast alles sind <b>Gegensatz-Paare</b> rund ums Haus:<br>
      naître ↔ mourir · arriver ↔ partir · aller ↔ venir · entrer ↔ sortir · monter ↔ descendre<br>
      dazu: rester · tomber · devenir · revenir · retourner · rentrer</p>
    <p class="mb-tip">⚠️ Nicht jedes deutsche «bin» heisst être! Mit <b>avoir</b>: courir (ich bin gerannt → j'<b>ai</b> couru), nager (j'<b>ai</b> nagé), sauter (j'<b>ai</b> sauté), voyager (j'<b>ai</b> voyagé).</p>
  </section>

  <section class="mb-box">
    <h3>6. Bei «être»: Partizip anpassen</h3>
    <p>Mit être verhält sich das Partizip wie ein Adjektiv: Es passt sich dem <b>Subjekt</b> an.</p>
    <table class="mb-table">
      <tr><th></th><th>männlich</th><th>weiblich</th></tr>
      <tr><td>Einzahl</td><td>il est allé</td><td>elle est allé<b>e</b></td></tr>
      <tr><td>Mehrzahl</td><td>ils sont allé<b>s</b></td><td>elles sont allé<b>es</b></td></tr>
    </table>
    <p class="mb-tip">💡 <b>+e</b> = weiblich · <b>+s</b> = mehrere · <b>+es</b> = mehrere Frauen/Mädchen.<br>
    💡 Mit <b>avoir</b> wird das Partizip in der Regel <b>nicht</b> angepasst: elle <b>a</b> mangé, elles <b>ont</b> mangé.</p>
  </section>

  <section class="mb-box">
    <h3>7. Rückbezügliche Verben (se lever …)</h3>
    <p>Immer mit <b>être</b>. Das kleine Pronomen steht <b>vor</b> dem Hilfsverb.</p>
    <table class="mb-table mb-table--small">
      <tr><td>je <b>me suis</b> levé(e)</td><td>nous <b>nous sommes</b> levé(e)s</td></tr>
      <tr><td>tu <b>t'es</b> levé(e)</td><td>vous <b>vous êtes</b> levé(e)(s)</td></tr>
      <tr><td>il <b>s'est</b> levé / elle <b>s'est</b> levée</td><td>ils <b>se sont</b> levés / elles <b>se sont</b> levées</td></tr>
    </table>
    <p class="mb-tip">💡 Verneinung: <b>ne</b> vor das Pronomen, <b>pas</b> nach dem Hilfsverb:<br>
    je <b>ne</b> me suis <b>pas</b> levé · il <b>ne</b> s'est <b>pas</b> lavé · (ohne Pronomen: je <b>n'</b>ai <b>pas</b> mangé)</p>
  </section>

  <section class="mb-box mb-box--yellow">
    <h3>8. Häufige Fehler</h3>
    <ul>
      <li>ils <s>oent</s> → ils <b>ont</b></li>
      <li>tu as <s>travailler</s> → tu as <b>travaillé</b> (Partizip, nicht Infinitiv)</li>
      <li>j'ai <s>lit</s> → j'ai <b>lu</b> · il a <s>couri</s> → il a <b>couru</b></li>
      <li>ils ont <s>être</s> → ils ont <b>été</b> · vous avez <s>savé</s> → vous avez <b>su</b></li>
      <li>Ces hommes <s>inventé</s> → Ces hommes <b>ont</b> inventé (Hilfsverb nicht vergessen!)</li>
      <li>elle est <s>allé</s> → elle est <b>allée</b> (bei être anpassen)</li>
    </ul>
  </section>

  <section class="mb-box mb-box--blue">
    <h3>✅ In 3 Schritten zur richtigen Form</h3>
    <ol>
      <li><b>Hilfsverb wählen:</b> DR &amp; MRS VANDERTRAMP oder «se …»? → <b>être</b>. Sonst → <b>avoir</b>.</li>
      <li><b>Partizip bilden:</b> é – i – u, oder unregelmässig (Familien).</li>
      <li><b>Bei être anpassen:</b> Subjekt anschauen → +e / +s / +es.</li>
    </ol>
  </section>
</article>`;

  window.MERKBLATT_PC_HTML = HTML;

  const modesEl = document.querySelector(".modes");
  const view = document.getElementById("view");
  const progressEl = document.getElementById("progress");
  if (!modesEl || !view) return;

  const btn = document.createElement("button");
  btn.className = "mode-btn mode-btn--merk";
  btn.type = "button";
  btn.dataset.mode = "merkblatt";
  btn.textContent = "📒 Merkblatt";

  function activeTopicId() {
    const a = document.querySelector(".topic-tab.active");
    return a ? a.dataset.topic : "";
  }
  function updateVisibility() {
    btn.hidden = !/^pc-/.test(activeTopicId());
  }

  btn.addEventListener("click", () => {
    modesEl.querySelectorAll(".mode-btn").forEach((b) => b.classList.toggle("active", b === btn));
    const resetBtn = document.getElementById("reset-wrong");
    if (resetBtn) resetBtn.hidden = true;
    if (progressEl) progressEl.textContent = "";
    view.innerHTML =
      `<div class="ws-tools row-btns"><button type="button" class="btn" data-act="print">🖨️ Merkblatt drucken</button></div>` +
      HTML;
    view.querySelector('[data-act="print"]').addEventListener("click", () => window.print());
    window.scrollTo({ top: 0 });
  });
  modesEl.appendChild(btn);

  modesEl.addEventListener("click", (e) => {
    const b = e.target.closest(".mode-btn");
    if (b && b !== btn) btn.classList.remove("active");
  });
  document.getElementById("topic-tabs").addEventListener("click", () => {
    btn.classList.remove("active");
    setTimeout(updateVisibility, 0);
  });
  updateVisibility();
})();
