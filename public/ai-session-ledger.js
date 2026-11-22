(function initSecondOrderSessionLedger() {
  "use strict";

  const STATE_KEY = "pm-warroom-state-v3";
  const LEDGER_PREFIX = "secondorder-ai-ledger-v1:";
  const MAX_EVENTS = 300;
  const POLL_MS = 500;
  let activeSessionKey = "";
  let events = [];
  let fingerprints = new Set();
  let lastPrioritySignature = "";
  let nextSequence = 1;

  function safeArray(value) { return Array.isArray(value) ? value : []; }
  function readState() {
    try { return JSON.parse(localStorage.getItem(STATE_KEY) || "null"); } catch { return null; }
  }
  function sessionKey(state) {
    return `${LEDGER_PREFIX}${String(state && state.createdAt || "unstarted").replace(/[^a-zA-Z0-9_-]/g, "_")}`;
  }
  function compactMetrics(source) {
    const pick = (group, names) => Object.fromEntries(names.map((name) => [name, Number(source && source[group] && source[group][name] || 0)]));
    return {
      stats: pick("stats", ["EconomicStability", "FiscalHealth", "PublicConfidence", "DiplomaticStanding", "NationalSecurity"]),
      domestic: pick("domestic", ["ParliamentApproval", "OppositionPressure", "ProtestRisk", "MediaHostility"]),
      sentiment: pick("sentiment", ["TrustInGovernment", "PanicLevel"]),
      economy: pick("economy", ["StockIndex", "CurrencyValue"]),
      systems: pick("systems", ["MarketConfidence", "SupplyChainIntegrity", "HealthcareCapacity", "InfrastructureIntegrity"]),
      threats: pick("threats", ["EconomicPressure", "DisinformationRisk", "BorderTension", "TerrorThreat"]),
      toleranceLoad: Number(source && source.toleranceLoad || 0),
      escalationIndex: Number(source && source.escalationIndex || 0),
    };
  }
  function compactReview(review) {
    return {
      decisionId: review.id || "",
      title: review.title || "Decision",
      optionIds: safeArray(review.optionIds),
      style: review.style || "mixed",
      domains: safeArray(review.domains).length ? review.domains : [review.domain || "General"],
      risk: Number(review.risk || 0),
      credibility: Number(review.legality || 0),
      outcome: review.outcome || "Unknown",
      causalNotes: safeArray(review.causalNotes).slice(0, 8),
      realityAudit: review.realityAudit || null,
      impactLedger: safeArray(review.impactLedger).slice(0, 8),
      before: review.stateBefore ? compactMetrics(review.stateBefore) : null,
      after: review.stateAfter ? compactMetrics(review.stateAfter) : null,
    };
  }
  function save() {
    if (!activeSessionKey) return;
    localStorage.setItem(activeSessionKey, JSON.stringify(events.slice(-MAX_EVENTS)));
  }
  function load(state) {
    const nextKey = sessionKey(state);
    if (nextKey === activeSessionKey) return;
    activeSessionKey = nextKey;
    try { events = safeArray(JSON.parse(localStorage.getItem(activeSessionKey) || "[]")); } catch { events = []; }
    fingerprints = new Set(events.map((event) => event.fingerprint).filter(Boolean));
    nextSequence = events.reduce((highest, event) => {
      const sequence = Number(String(event.evidenceId || "").replace(/^L/, ""));
      return Number.isFinite(sequence) ? Math.max(highest, sequence + 1) : highest;
    }, 1);
  }
  function append(type, fingerprint, payload, state, sourceEvidenceId = null) {
    if (!state || fingerprints.has(fingerprint)) return;
    fingerprints.add(fingerprint);
    const event = {
      evidenceId: `L${String(nextSequence++).padStart(3, "0")}`,
      type,
      fingerprint,
      occurredAt: new Date().toISOString(),
      simulationTime: state.clock || null,
      sourceEvidenceId,
      payload,
      stateDigest: compactMetrics(state),
    };
    events.push(event);
    if (events.length > MAX_EVENTS) events = events.slice(-MAX_EVENTS);
    save();
  }
  function scanDecisions(state) {
    safeArray(state.decisionReviews).forEach((review, index) => {
      const evidenceId = `D${index + 1}`;
      append("decision_committed", `decision:${review.id || index}`, compactReview(review), state, evidenceId);
      const reflection = String(review.reflection || "").trim();
      if (reflection) append("reflection_saved", `reflection:${review.id || index}:${reflection}`, { decisionId: review.id || "", decisionTitle: review.title || "Decision", text: reflection }, state, `R${safeArray(state.decisionReviews).slice(0, index + 1).filter((item) => String(item.reflection || "").trim()).length}`);
    });
  }
  function scanBoardroom(state) {
    safeArray(state.meetingRounds).forEach((round, index) => append(
      "boardroom_round_completed",
      `boardroom:${round.id || index}`,
      {
        question: round.prompt || "",
        source: round.source || "",
        responses: safeArray(round.responses).map((response) => ({ stakeholder: response.name || "Board", response: response.text || "" })),
      },
      state,
      `B${index + 1}`
    ));
  }
  function scanCrisis(crisis, index, state) {
    if (!crisis) return;
    const evidenceId = `E${index + 1}`;
    const crisisKey = crisis.startedAt || crisis.id || index;
    append("emergency_triggered", `crisis:${crisisKey}:triggered`, { title: crisis.title || "Emergency", brief: crisis.brief || "", sourceDecision: crisis.sourceDecision || "" }, state, evidenceId);
    const responses = new Map(safeArray(crisis.responses).map((item) => [item.id, item]));
    safeArray(crisis.usedResponses).forEach((id) => {
      const item = responses.get(id) || {};
      append("emergency_response_selected", `crisis:${crisisKey}:response:${id}`, { id, title: item.title || id, note: item.note || "" }, state, evidenceId);
    });
    const major = new Map(safeArray(crisis.majorDecisions).map((item) => [item.id, item]));
    safeArray(crisis.usedMajorDecisions).forEach((id) => {
      const item = major.get(id) || {};
      append("emergency_major_call", `crisis:${crisisKey}:major:${id}`, { id, title: item.title || id, note: item.note || "" }, state, evidenceId);
    });
    if (crisis.statementReleased) append("emergency_statement_issued", `crisis:${crisisKey}:statement:${crisis.statementChoiceId || "unknown"}`, { statementId: crisis.statementChoiceId || "unknown", internalPosture: crisis.internalChoice || "unknown" }, state, evidenceId);
    if (crisis.resolvedAt) append("emergency_resolved", `crisis:${crisisKey}:resolved`, { resolvedAt: crisis.resolvedAt, resolution: crisis.resolution || "Resolved" }, state, evidenceId);
    safeArray(crisis.journey?.actions).forEach((action,index)=>append("emergency_action_review",`crisis:${crisisKey}:action:${action.id}`,{...action,reasoning:undefined},state,`${evidenceId}-A${index+1}`));
    if(crisis.journey?.outcome)append("emergency_window_closed",`crisis:${crisisKey}:closed`,{outcome:crisis.journey.outcome,breaches:crisis.journey.breaches,businessBefore:crisis.journey.businessBefore,businessAfter:crisis.journey.businessAfter},state,evidenceId);
  }
  function scanEmergencies(state) {
    const crisisState = state.emergencyControversy || {};
    const crises = [...safeArray(crisisState.history)];
    if (crisisState.current && !crises.some((item) => item && item.startedAt === crisisState.current.startedAt)) crises.push(crisisState.current);
    crises.forEach((crisis, index) => scanCrisis(crisis, index, state));
  }
  function scanPriorities(state) {
    const signature = JSON.stringify(safeArray(state.decisionPriorities));
    if (signature === lastPrioritySignature) return;
    lastPrioritySignature = signature;
    if (signature !== "[]") append("priorities_updated", `priorities:${signature}`, { priorities: safeArray(state.decisionPriorities) }, state);
  }
  function scanState() {
    const state = readState();
    if (!state) return;
    load(state);
    append("session_observed", `session:${state.createdAt || "unknown"}`, { scenarioId: state.scenarioId || "", role: state.roleName || state.pmName || "Participant" }, state);
    scanPriorities(state);
    scanDecisions(state);
    scanBoardroom(state);
    scanEmergencies(state);
    if (state.sessionReportShown) append("session_completed", `session:${state.createdAt || "unknown"}:completed`, { decisionCount: safeArray(state.decisionReviews).length, dismissed: Boolean(state.dismissed) }, state);
  }
  function captureOptionInteraction(target) {
    const checkbox = target.closest('input[type="checkbox"]');
    if (!checkbox) return;
    setTimeout(() => {
      const state = readState();
      if (!state) return;
      load(state);
      const card = checkbox.closest("article, label, .option-card, .mcq-option");
      const label = String(card && card.innerText || checkbox.value || "Simulation option").replace(/\s+/g, " ").trim().slice(0, 240);
      const optionId = checkbox.dataset.optionId || checkbox.value || checkbox.id || label;
      append("option_toggled", `option:${Date.now()}:${optionId}:${checkbox.checked}`, { optionId, label, selected: Boolean(checkbox.checked) }, state);
    }, 0);
  }
  function captureNavigation(target) {
    const button = target.closest("[data-sim-page], #boardroomMeetingNavBtn");
    if (!button) return;
    const state = readState();
    if (!state) return;
    load(state);
    append("workspace_opened", `navigation:${Date.now()}:${button.dataset.simPage || button.id}`, { workspace: button.dataset.simPage || button.id, label: String(button.innerText || "").replace(/\s+/g, " ").trim().slice(0, 120) }, state);
  }

  document.addEventListener("click", (event) => {
    captureOptionInteraction(event.target);
    captureNavigation(event.target);
  }, true);
  scanState();
  setInterval(scanState, POLL_MS);

  globalThis.SecondOrderSessionLedger = {
    snapshot(state = readState()) {
      if (state) { load(state); scanState(); }
      return events.map(({ fingerprint, ...event }) => event);
    },
    summary() {
      return events.reduce((counts, event) => {
        counts[event.type] = (counts[event.type] || 0) + 1;
        return counts;
      }, {});
    },
  };
})();
