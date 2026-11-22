(function initAssessmentLayer() {
  "use strict";

  const STORAGE_KEY = "pm-warroom-state-v3";
  const logic = globalThis.SecondOrderLogic;
  const scenarioNames = {
    mumbai_terror: "Mumbai Terror Aftermath",
    secondorder_business: "boAt Limited Business Case",
  };
  const dimensions = [
    ["strategicReasoning", "Strategic reasoning"],
    ["secondOrderThinking", "Second-order thinking"],
    ["commercialJudgment", "Commercial judgment"],
    ["emergencyJudgment", "Emergency judgment"],
    ["stakeholderAwareness", "Stakeholder awareness"],
    ["reflectiveQuality", "Reflective quality"],
  ];

  const els = Object.fromEntries([
    "serverStatusDot", "serverStatus", "loadBrowserSessionBtn", "sessionFileInput", "evidencePanel",
    "scenarioName", "sessionMeta", "decisionCount", "reflectionCount", "boardroomCount", "emergencyCount",
    "generateAssessmentBtn", "assessmentStatusPanel", "assessmentStatusTitle", "assessmentStatusText",
    "assessmentResult", "overallReasoningScore", "assessmentHeadline", "executiveSummary", "dimensionGrid",
    "strengthList", "priorityList", "facultyNote", "limitationList", "downloadAssessmentBtn", "pageMessage",
  ].map((id) => [id, document.getElementById(id)]));

  let loadedState = null;
  let evidence = null;
  let assessmentEnvelope = null;
  let serverConfigured = false;
  let requestActive = false;

  function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function average(values) {
    const safe = values.filter(Number.isFinite);
    return safe.length ? safe.reduce((sum, value) => sum + value, 0) / safe.length : 0;
  }

  function message(text, error = false) {
    els.pageMessage.textContent = text;
    els.pageMessage.style.color = error ? "#b54d56" : "";
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function compactMetrics(source) {
    const groups = ["stats", "threats", "domestic", "sentiment", "economy", "systems"];
    return Object.fromEntries(groups.map((group) => [group, { ...((source && source[group]) || {}) }]));
  }

  function summarizeEmergency(crisis, index) {
    const responseMap = new Map(safeArray(crisis.responses).map((item) => [item.id, item]));
    const majorMap = new Map(safeArray(crisis.majorDecisions).map((item) => [item.id, item]));
    return {
      evidenceId: `E${index + 1}`,
      title: crisis.title || "Emergency situation",
      brief: crisis.brief || "",
      sourceDecision: crisis.sourceDecision || "",
      startedAt: crisis.startedAt || null,
      resolvedAt: crisis.resolvedAt || null,
      resolution: crisis.resolution || "Unresolved when the session ended",
      responseWindowExpired: Boolean(crisis.responseWindowExpiredAt),
      selectedResponses: safeArray(crisis.usedResponses).map((id) => {
        const item = responseMap.get(id) || {};
        return { id, title: item.title || id, note: item.note || "" };
      }),
      majorDecisions: safeArray(crisis.usedMajorDecisions).map((id) => {
        const item = majorMap.get(id) || {};
        return { id, title: item.title || id, note: item.note || "" };
      }),
      publicStatement: crisis.statementReleased ? {
        id: crisis.statementChoiceId || "unknown",
        internalPosture: crisis.internalChoice || "unknown",
      } : null,
      finalPressure: { ...(crisis.tracker || {}) },
      updates: safeArray(crisis.updates).slice(-12).map((item) => typeof item === "string" ? item : {
        text: item.text || item.message || "",
        type: item.type || "update",
        time: item.time || null,
      }),
    };
  }

  function deterministicSummary(state) {
    const reviews = safeArray(state.decisionReviews);
    const qualities = reviews.map((review) => logic && logic.decisionQuality ? logic.decisionQuality(review) : NaN);
    const metrics = state.decisionMetrics || {};
    return {
      score: Math.round(clamp(average(qualities.filter(Number.isFinite)))),
      scoreMeaning: "Average deterministic decision quality across recorded moves; AI cannot modify this value.",
      outcomeMix: {
        success: Number(metrics.successCount || 0),
        partial: Number(metrics.partialCount || 0),
        failure: Number(metrics.failureCount || 0),
      },
      toleranceLoad: Number(state.toleranceLoad || 0),
      dismissed: Boolean(state.dismissed),
      dismissalReason: state.dismissalReason || "",
      finalMetrics: compactMetrics(state),
    };
  }

  function buildEvidence(state) {
    const reviews = safeArray(state.decisionReviews);
    const reflections = [];
    const reflectionIdByReview = new Map();
    reviews.forEach((review) => {
      const text = String(review.reflection || "").trim();
      if (!text) return;
      const evidenceId = `R${reflections.length + 1}`;
      reflectionIdByReview.set(review.id, evidenceId);
      reflections.push({ evidenceId, decisionId: review.id || "", decisionTitle: review.title || "Decision", text });
    });
    safeArray(state.reflections).forEach((item) => {
      const text = String(item && item.text || "").trim();
      if (!text || reflectionIdByReview.has(item.reviewId)) return;
      const evidenceId = `R${reflections.length + 1}`;
      reflectionIdByReview.set(item.reviewId, evidenceId);
      reflections.push({ evidenceId, decisionId: item.reviewId || "", decisionTitle: item.decisionTitle || "Decision", text });
    });

    const crisisState = state.emergencyControversy || {};
    const crises = [...safeArray(crisisState.history)];
    if (crisisState.current && !crises.some((item) => item && item.startedAt === crisisState.current.startedAt)) {
      crises.push(crisisState.current);
    }

    return {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      scenario: {
        id: state.scenarioId || "unknown",
        name: scenarioNames[state.scenarioId] || state.scenarioId || "SecondOrder simulation",
        role: state.roleName || state.pmName || "Participant",
      },
      session: {
        createdAt: state.createdAt || null,
        completedAt: state.updatedAt || null,
        simulationClock: state.clock || null,
        recordedDecisionCount: reviews.length,
      },
      decisions: reviews.map((review, index) => ({
        evidenceId: `D${index + 1}`,
        decisionId: review.id || `decision-${index + 1}`,
        time: review.time || null,
        title: review.title || "Decision",
        optionIds: safeArray(review.optionIds),
        style: review.style || "mixed",
        domains: safeArray(review.domains).length ? review.domains : [review.domain || "General"],
        risk: Number(review.risk || 0),
        credibility: Number(review.legality || 0),
        outcome: review.outcome || "Unknown",
        causalNotes: safeArray(review.causalNotes),
        impactLedger: safeArray(review.impactLedger),
        stateBefore: review.stateBefore ? compactMetrics(review.stateBefore) : null,
        stateAfter: review.stateAfter ? compactMetrics(review.stateAfter) : null,
        reflectionEvidenceId: reflectionIdByReview.get(review.id) || null,
      })),
      reflections,
      boardroomInteractions: safeArray(state.meetingRounds).map((round, index) => ({
        evidenceId: `B${index + 1}`,
        time: round.time || null,
        question: round.prompt || "",
        source: round.source || "",
        responses: safeArray(round.responses).map((response) => ({
          stakeholder: response.name || response.speaker || "Board",
          response: response.text || "",
        })),
      })),
      emergencies: crises.map(summarizeEmergency),
      eventLedger: [],
      deterministicAssessment: deterministicSummary(state),
      declaredPriorities: safeArray(state.decisionPriorities),
    };
  }

  function renderEvidence() {
    const ready = Boolean(evidence);
    els.evidencePanel.classList.toggle("empty", !ready);
    els.evidencePanel.querySelector(".evidence-empty").classList.toggle("hidden", ready);
    els.evidencePanel.querySelector(".evidence-ready").classList.toggle("hidden", !ready);
    els.generateAssessmentBtn.disabled = !ready || !serverConfigured || requestActive;
    if (!ready) return;
    els.scenarioName.textContent = evidence.scenario.name;
    els.sessionMeta.textContent = `${evidence.scenario.role} · ${evidence.session.completedAt ? new Date(evidence.session.completedAt).toLocaleString() : "Completion time unavailable"}`;
    els.decisionCount.textContent = evidence.decisions.length;
    els.reflectionCount.textContent = evidence.reflections.length;
    els.boardroomCount.textContent = evidence.boardroomInteractions.length;
    els.emergencyCount.textContent = evidence.emergencies.length;
  }

  function loadState(raw, source) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("This is not a valid SecondOrder session file.");
    if (!raw.scenarioId || !raw.decisionMetrics) throw new Error("The file does not contain recognizable SecondOrder session data.");
    loadedState = raw;
    evidence = buildEvidence(raw);
    assessmentEnvelope = null;
    els.assessmentResult.classList.add("hidden");
    els.assessmentStatusPanel.classList.add("hidden");
    renderEvidence();
    message(`${source} loaded. Review the evidence counts, then generate the optional assessment.`);
  }

  async function checkServer() {
    try {
      const response = await fetch("/api/assessment-health", { cache: "no-store" });
      if (!response.ok) throw new Error("Assessment server unavailable");
      const health = await response.json();
      serverConfigured = Boolean(health.configured);
      els.serverStatusDot.className = serverConfigured ? "online" : "offline";
      els.serverStatus.textContent = serverConfigured ? `Ready · ${health.model}` : "API key not configured";
    } catch {
      serverConfigured = false;
      els.serverStatusDot.className = "offline";
      els.serverStatus.textContent = "Open through optional server";
    }
    renderEvidence();
  }

  function setAssessmentStatus(title, text, error = false) {
    els.assessmentStatusPanel.classList.remove("hidden");
    els.assessmentStatusPanel.classList.toggle("error", error);
    els.assessmentStatusTitle.textContent = title;
    els.assessmentStatusText.textContent = text;
  }

  function fillList(element, items) {
    element.replaceChildren(...safeArray(items).map((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      return item;
    }));
  }

  function renderAssessment(payload) {
    const report = payload.assessment;
    els.overallReasoningScore.textContent = report.overallReasoningScore;
    els.assessmentHeadline.textContent = `${report.confidence[0].toUpperCase()}${report.confidence.slice(1)}-confidence assessment`;
    els.executiveSummary.textContent = report.executiveSummary;
    els.dimensionGrid.replaceChildren(...dimensions.map(([key, label]) => {
      const value = report[key];
      const article = document.createElement("article");
      article.className = "dimension-card";
      const head = document.createElement("div");
      head.className = "dimension-head";
      const title = document.createElement("strong");
      title.textContent = label;
      const score = document.createElement("span");
      score.textContent = `${value.score}/100`;
      head.append(title, score);
      const track = document.createElement("div");
      track.className = "dimension-track";
      const bar = document.createElement("i");
      bar.style.width = `${clamp(value.score)}%`;
      track.append(bar);
      const analysis = document.createElement("p");
      analysis.textContent = value.analysis;
      const citations = document.createElement("small");
      citations.textContent = value.evidenceIds.length ? `Evidence: ${value.evidenceIds.join(", ")}` : "Evidence: not observed";
      article.append(head, track, analysis, citations);
      return article;
    }));
    fillList(els.strengthList, report.strengths);
    fillList(els.priorityList, report.developmentPriorities);
    els.facultyNote.textContent = report.facultyNote;
    fillList(els.limitationList, report.limitations);
    els.assessmentResult.classList.remove("hidden");
    els.assessmentStatusPanel.classList.add("hidden");
  }

  async function generateAssessment() {
    if (!evidence || requestActive) return;
    requestActive = true;
    renderEvidence();
    setAssessmentStatus("Reviewing the session", "Linking every conclusion to recorded decision, reflection, emergency, or boardroom evidence...");
    els.assessmentResult.classList.add("hidden");
    try {
      const response = await fetch("/api/assess-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evidence),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `Assessment failed with status ${response.status}.`);
      assessmentEnvelope = { ...payload, sessionEvidence: evidence };
      renderAssessment(payload);
      message("Assessment generated. Faculty review remains required before grading use.");
    } catch (error) {
      setAssessmentStatus("Assessment unavailable", error.message, true);
      message("The original simulation report is unaffected.", true);
    } finally {
      requestActive = false;
      renderEvidence();
    }
  }

  function downloadAssessment() {
    if (!assessmentEnvelope) return;
    const blob = new Blob([JSON.stringify(assessmentEnvelope, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `secondorder_ai_assessment_${Date.now()}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  els.loadBrowserSessionBtn.addEventListener("click", () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) throw new Error("No browser session was found on this server origin. Use Import Exported JSON instead.");
      loadState(JSON.parse(raw), "Browser session");
    } catch (error) {
      message(error.message, true);
    }
  });

  els.sessionFileInput.addEventListener("change", async () => {
    const [file] = els.sessionFileInput.files;
    if (!file) return;
    try {
      loadState(JSON.parse(await file.text()), file.name);
    } catch (error) {
      message(error.message, true);
    } finally {
      els.sessionFileInput.value = "";
    }
  });

  els.generateAssessmentBtn.addEventListener("click", generateAssessment);
  els.downloadAssessmentBtn.addEventListener("click", downloadAssessment);
  checkServer();
})();
