(function (root) {
  "use strict";

  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const initials = (name) => String(name || "Board").replace(/\([^)]*\)/g, " ").split(/[\s/]+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  const stance = (value) => ({ support: "Supports", challenge: "Challenges", condition: "Sets conditions", redirect: "Redirects" })[value] || "Advises";
  const number = (value) => Number.isFinite(Number(value)) ? Math.round(Number(value)) : 0;

  function groupOptions(options) {
    const groups = new Map();
    options.forEach((option) => {
      const domain = option.domain || "General";
      if (!groups.has(domain)) groups.set(domain, []);
      groups.get(domain).push(option);
    });
    return [...groups.entries()];
  }

  function optionFacts(option) {
    return `<dl class="explorer-facts"><div><dt>Risk</dt><dd>${number(option.risk * 100)}/100</dd></div><div><dt>Legality</dt><dd>${number(option.legality * 100)}/100</dd></div><div><dt>Approach</dt><dd>${escape(option.style || "Mixed")}</dd></div></dl>`;
  }

  function effectList(option, beneficial) {
    const labels = (option.effects || []).filter((effect) => effect.beneficial === beneficial).slice(0, 3).map((effect) => effect.label);
    return escape(labels.join(", ") || (beneficial ? "No direct upside specified" : "No direct downside specified"));
  }

  function renderDesk({ options, selectedIds = [], activeCategory, compare = false, visited = [] }) {
    const groups = groupOptions(options);
    if (!groups.length) return '<p class="workspace-empty">No choices are available for this scenario.</p>';
    const active = groups.find(([domain]) => domain === activeCategory) || groups[0];
    const chosen = options.filter((option) => selectedIds.includes(option.id));
    return `<div class="category-explorer">
      <nav class="explorer-categories" aria-label="Decision categories"><span class="workspace-eyebrow">Explore your options</span>
        ${groups.map(([domain, items], index) => `<button type="button" data-desk-category="${index}" aria-pressed="${domain === active[0]}" class="${domain === active[0] ? "active" : ""}"><span>${escape(domain)}${items.some((item) => selectedIds.includes(item.id)) ? '<i aria-label="Contains shortlisted choice"></i>' : ""}</span><small>${items.length}</small></button>`).join("")}
        <p>${groups.filter(([domain]) => visited.includes(domain) || domain === active[0]).length} of ${groups.length} categories viewed.<br>All choices remain available.</p>
      </nav>
      <section class="explorer-main" aria-labelledby="explorerCategoryTitle"><header class="explorer-heading"><div><span class="workspace-eyebrow">One area at a time</span><h3 id="explorerCategoryTitle">${escape(active[0])}</h3></div><span>${active[1].length} alternatives</span></header>
        <div class="explorer-cards">${active[1].map((option) => {
          const selected = selectedIds.includes(option.id);
          const matches = option.priorityMatches || [];
          return `<article class="explorer-option ${selected ? "selected" : ""}"><label class="explorer-choice"><input type="checkbox" data-option-id="${escape(option.id)}" ${selected ? "checked" : ""}><span>${escape(option.title)}</span></label>
            ${matches.length ? `<span class="explorer-priority">Fits your priorities: ${escape(matches.join(" + "))}</span>` : ""}
            <details class="explorer-details" data-option-details="${escape(option.id)}"><summary>Trade-offs & details</summary>${optionFacts(option)}<p><b>Potential upside</b>${effectList(option, true)}</p><p><b>Watch closely</b>${effectList(option, false)}</p><small>Base effects, not guaranteed outcomes. Readiness and context still apply.</small></details></article>`;
        }).join("")}</div>
      </section>
    </div>
    <section class="explorer-shortlist" aria-label="Your decision shortlist"><div class="shortlist-heading"><div><span class="workspace-eyebrow">Your shortlist</span><strong>${chosen.length}/2 choices</strong></div><button type="button" class="ghost" data-desk-compare ${chosen.length ? "" : "disabled"} aria-expanded="${compare && chosen.length > 0}">${compare ? "Close comparison" : "Review & compare"}</button></div>
      <div class="shortlist-items">${chosen.length ? chosen.map((option) => `<div><span><small>${escape(option.domain || "General")}</small>${escape(option.title)}</span><button type="button" class="ghost" data-desk-remove="${escape(option.id)}" aria-label="Remove ${escape(option.title)} from shortlist">Remove</button></div>`).join("") : '<p>Shortlist up to two choices from any category. Selecting a choice does not implement it.</p>'}</div>
    </section>
    ${compare && chosen.length ? `<section class="explorer-comparison" aria-label="Shortlisted choices compared"><header><span class="workspace-eyebrow">Before you commit</span><h3>Compare the trade-offs</h3><p>These are the existing option definitions, not a prediction of the final result.</p></header><div class="comparison-cards">${chosen.map((option) => `<article><small>${escape(option.domain)}</small><h4>${escape(option.title)}</h4>${optionFacts(option)}<p><b>Potential upside</b>${effectList(option, true)}</p><p><b>Watch closely</b>${effectList(option, false)}</p></article>`).join("")}</div></section>` : ""}`;
  }

  function roundResponses(round) {
    return (round?.responses || []).filter((item) => item && !/Situation Assessment|Board Synthesis|Crisis-Room Synthesis/i.test(item.name || "")).slice(0, 5);
  }

  function renderBasis(response) {
    return `<details class="hub-basis" data-basis-id="${escape(response.id || response.name)}"><summary>View basis</summary><p>${escape(response.selectionReason || "This role was selected by the built-in advisor rules for this question.")}</p><ul>${response.evidence?.length ? response.evidence.map((item) => `<li>${escape(item)}</li>`).join("") : '<li>No specific evidence citation was recorded for this contribution.</li>'}</ul></details>`;
  }

  function renderInspector(view, round, context) {
    if (!view) return "";
    const evidence = view === "evidence";
    const take = round?.takeForward || {};
    const tension = round?.tensionSummary || {};
    const observed = round?.observedBehavior || {};
    const block = (title, text) => text ? `<section><h4>${escape(title)}</h4><p>${escape(text)}</p></section>` : "";
    return `<aside class="hub-inspector" aria-label="${evidence ? "Simulation evidence" : "Meeting takeaways"}"><header><h3>${evidence ? "Evidence in view" : "Meeting takeaways"}</h3><button class="ghost" type="button" data-hub-inspector="close" aria-label="Close details">Close</button></header>
      ${evidence ? `<p class="hub-caption">${round ? "Snapshot when this question was asked." : "Current company snapshot."} Scores are simulation indices, not financial amounts.</p><dl class="hub-metrics">${(context.metrics || []).map((metric) => `<div><dt>${escape(metric.label)}</dt><dd>${escape(metric.value)}<small>/100</small></dd></div>`).join("")}</dl><h4>Recent decisions</h4>${context.decisions?.length ? `<ol class="hub-decision-list">${context.decisions.map((decision) => `<li><strong>${escape(decision.title || "Decision")}</strong><small>${escape(decision.outcome || "Recorded")} ${escape(decision.time || "")}</small></li>`).join("")}</ol>` : '<p>No completed decisions in this snapshot.</p>'}${block("Emergency", context.emergency)}<p class="hub-caption">Open “View basis” on a contribution for its recorded citations. A citation is not proof that advice is correct.</p>` : round ? `${block("Recommendation", take.recommendation || round.synthesis)}${block("Guardrail", take.guardrail)}${block("Watch metric", take.metric)}<details class="hub-extra"><summary>Agreement, tension & gaps</summary>${block("Agreement", tension.agreement)}${block("Disagreement", tension.disagreement)}${block("Missing information", tension.missingInformation)}${!round.tensionSummary ? '<p>No separate tension analysis was recorded.</p>' : ""}</details><details class="hub-extra"><summary>Observed decision patterns</summary>${block("Current focus", observed.currentOptimization)}${block("Repeated pattern", observed.repeatedPattern)}${block("Possible blind spot", observed.blindSpot)}${block("Useful next question", observed.nextQuestion)}${!round.observedBehavior ? '<p>No AI behavior analysis was recorded in this exchange.</p>' : ""}<p class="hub-caption">Interpretations of recorded simulation behavior, not personality or diagnosis.</p></details><p class="hub-caption">Advice is not an implemented decision. Return to the Strategy Desk or Strategy Room to act.</p>` : '<p>Ask a question first. Its recommendation and trade-offs will appear here.</p>'}
    </aside>`;
  }

  function renderHub({ rounds = [], selectedRoundId, visibleCount = 2, inspector = null, context = {}, advisors = [], busy = false, pendingPrompt = "", aiMode = false }) {
    const round = rounds.find((item) => item.id === selectedRoundId) || rounds.at(-1);
    const responses = roundResponses(round);
    const roster = round ? responses : advisors.slice(0, 5);
    const shown = responses.slice(0, Math.max(2, visibleCount));
    const snapshot = round?.contextSnapshot || (round ? { metrics: [], decisions: [], emergency: "" } : context);
    const source = round?.source || (aiMode ? "AI-assisted mode · no response yet" : "Standard mode · built-in advisors");
    return `<div class="conversation-hub ${inspector ? "inspector-open" : ""}">
      <aside class="hub-sidebar"><span class="workspace-eyebrow">${round ? "In this exchange" : "Your board"}</span><h3>People, not panels.</h3><p class="hub-caption">${round ? "Choose a voice to reveal its contribution." : "Ask one question. Relevant voices join the conversation."}</p><div class="hub-roster">${roster.map((response, index) => `<button type="button" data-hub-speaker="${index}" ${round ? "" : "disabled"}><span class="hub-avatar tone-${index % 5}" aria-hidden="true">${escape(initials(response.name))}</span><span><strong>${escape(response.name)}</strong><small>${round ? escape(stance(response.stance)) : "Available perspective"}</small></span></button>`).join("")}</div>
        <div class="hub-history"><span class="workspace-eyebrow">Conversation history · ${rounds.length}</span>${rounds.length ? rounds.map((item, index) => `<button type="button" data-hub-round="${escape(item.id)}" aria-pressed="${item.id === round?.id}"><small>Question ${index + 1}</small>${escape(item.prompt)}</button>`).join("") : '<p class="hub-caption">Your questions will stay here during this simulation.</p>'}</div>
      </aside>
      <section class="hub-thread" aria-label="Boardroom conversation"><header class="hub-context"><div><span class="workspace-eyebrow">${escape(source)}</span><p>${round ? (round.contextSnapshot ? `${number(round.contextSnapshot.decisionCount)} completed decisions considered` : "Earlier exchange · no scorecard snapshot recorded") : `${number(context.decisionCount)} completed decisions available`}${busy ? " · Reviewing your new question" : ""}</p></div><div class="hub-tools"><button type="button" class="ghost" data-hub-inspector="evidence" aria-expanded="${inspector === "evidence"}">Evidence</button><button type="button" class="ghost" data-hub-inspector="takeaways" aria-expanded="${inspector === "takeaways"}">Takeaways</button></div></header>
        <div class="hub-messages">
          ${round ? `<article class="hub-question"><span class="workspace-eyebrow">You asked · ${escape(round.time || "This session")}</span><p>${escape(round.prompt)}</p></article>${round.situationAssessment ? `<details class="hub-situation"><summary>How the board reads the situation</summary><p>${escape(round.situationAssessment)}</p></details>` : ""}
          ${shown.map((response, index) => `<article class="hub-message" tabindex="-1" data-hub-message="${index}"><div class="hub-message-head"><span class="hub-avatar tone-${index % 5}" aria-hidden="true">${escape(initials(response.name))}</span><div><h4>${escape(response.name)}</h4><small>${escape(stance(response.stance))}</small></div></div><p>${escape(response.text || "No response recorded.")}</p>${renderBasis(response)}</article>`).join("")}
          ${shown.length < responses.length ? `<button type="button" class="hub-reveal ghost" data-hub-reveal>Hear ${responses.length - shown.length} more perspective${responses.length - shown.length === 1 ? "" : "s"} <span>No additional AI request</span></button>` : ""}
          ${shown.length > 2 ? '<button type="button" class="hub-reveal ghost" data-hub-collapse>Show fewer perspectives</button>' : ""}
          <button type="button" class="hub-takeaway-link ghost" data-hub-inspector="takeaways">Open meeting takeaways <span aria-hidden="true">&rarr;</span></button>` : `<div class="hub-welcome"><span class="workspace-eyebrow">A focused conversation</span><h3>What would you like to pressure-test?</h3><p>Bring a decision, an uncertainty, or a risk. Hear the most relevant perspectives, check their evidence, then decide what to do.</p><div><span>01 Ask</span><span>02 Challenge</span><span>03 Act</span></div><small>${aiMode ? "AI is requested only when you submit a question." : "Standard mode uses built-in stakeholder rules. No OpenAI request is made."}</small></div>`}
          ${busy ? `<article class="hub-question"><span class="workspace-eyebrow">Your next question</span><p>${escape(pendingPrompt)}</p></article><p class="hub-pending" role="status">The board is reviewing the supplied simulation evidence…</p>` : ""}
        </div>
      </section>${renderInspector(inspector, round, snapshot)}
    </div>`;
  }

  root.SecondOrderWorkspaces = { escape, groupOptions, roundResponses, renderDesk, renderHub };
})(typeof window !== "undefined" ? window : globalThis);
