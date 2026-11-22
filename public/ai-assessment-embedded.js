(function initEmbeddedAssessment() {
  "use strict";

  const logic = globalThis.SecondOrderLogic;
  const scenarioNames = { mumbai_terror: "Mumbai Terror Aftermath", secondorder_business: "boAt Limited Business Case" };

  function safeArray(value) { return Array.isArray(value) ? value : []; }
  function average(values) {
    const safe = values.filter(Number.isFinite);
    return safe.length ? safe.reduce((sum, value) => sum + value, 0) / safe.length : 0;
  }
  function compactMetrics(source) {
    return Object.fromEntries(["stats", "threats", "domestic", "sentiment", "economy", "systems"]
      .map((group) => [group, { ...((source && source[group]) || {}) }]));
  }

  function emergencyEvidence(crisis, index) {
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
      publicStatement: crisis.statementReleased ? { id: crisis.statementChoiceId || "unknown", internalPosture: crisis.internalChoice || "unknown" } : null,
      finalPressure: { ...(crisis.tracker || {}) },
      timedResponse: crisis.journey ? {
        windowMs: 120000, reviewMs: 10000,
        startedAt: crisis.journey.startedAt, deadline: crisis.journey.deadline,
        outcome: crisis.journey.outcome, breaches: crisis.journey.breaches,
        safeguards: crisis.journey.flags,
        businessBefore: crisis.journey.businessBefore, businessAfter: crisis.journey.businessAfter,
        actions: safeArray(crisis.journey.actions),
      } : null,
      updates: safeArray(crisis.updates).slice(-12),
    };
  }

  function buildEvidence(state) {
    const reviews = safeArray(state.decisionReviews);
    const decisionEvidenceById = new Map(reviews.map((review, index) => [review.id, `D${index + 1}`]));
    const crisisState = state.emergencyControversy || {};
    const crises = [...safeArray(crisisState.history)];
    if (crisisState.current && !crises.some((item) => item && item.startedAt === crisisState.current.startedAt)) crises.push(crisisState.current);
    const emergencyEvidenceRecords = crises.map(emergencyEvidence);
    const emergencyEvidenceByStart = new Map(crises.map((crisis, index) => [crisis && crisis.startedAt, `E${index + 1}`]));
    const reflections = [];
    const reflectionIds = new Map();
    reviews.forEach((review) => {
      const text = String(review.reflection || "").trim();
      if (!text) return;
      const stored = safeArray(state.reflections).find((item) => item && item.reviewId === review.id) || {};
      const evidenceId = `R${reflections.length + 1}`;
      reflectionIds.set(review.id, evidenceId);
      reflections.push({
        evidenceId,
        linkedEvidenceId: decisionEvidenceById.get(review.id) || null,
        decisionId: review.id || "",
        decisionTitle: review.title || "Decision",
        contextType: stored.contextType || "decision",
        prompt: stored.prompt || "Why did you choose this direction?",
        guidingQuestions: safeArray(stored.questions),
        selectedChoice: stored.selectedChoice || review.title || "Decision",
        choiceDetails: stored.choiceDetails || safeArray(review.causalNotes).join(" "),
        text,
      });
    });
    safeArray(state.reflections).forEach((item) => {
      const text = String(item && item.text || "").trim();
      if (!text || reflectionIds.has(item.reviewId)) return;
      const evidenceId = `R${reflections.length + 1}`;
      reflectionIds.set(item.reviewId, evidenceId);
      reflections.push({
        evidenceId,
        linkedEvidenceId: item.contextType === "emergency"
          ? (emergencyEvidenceByStart.get(item.emergencyStartedAt) || null)
          : (decisionEvidenceById.get(item.reviewId) || null),
        decisionId: item.reviewId || "",
        decisionTitle: item.decisionTitle || "Decision",
        contextType: item.contextType || "decision",
        prompt: item.prompt || "Why did you choose this direction?",
        guidingQuestions: safeArray(item.questions),
        selectedChoice: item.selectedChoice || item.decisionTitle || "Decision",
        choiceDetails: item.choiceDetails || "",
        emergencyContext: item.contextType === "emergency" ? {
          title: item.emergencyTitle || "Emergency situation",
          brief: item.emergencyBrief || "",
        } : null,
        text,
      });
    });
    const metrics = state.decisionMetrics || {};
    const qualities = reviews.map((review) => logic && logic.decisionQuality ? logic.decisionQuality(review) : NaN).filter(Number.isFinite);

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
        reflectionEvidenceId: reflectionIds.get(review.id) || null,
      })),
      reflections,
      boardroomInteractions: safeArray(state.meetingRounds).map((round, index) => ({
        evidenceId: `B${index + 1}`,
        time: round.time || null,
        question: round.prompt || "",
        source: round.source || "",
        responses: safeArray(round.responses).map((response) => ({ stakeholder: response.name || "Board", response: response.text || "" })),
      })),
      emergencies: emergencyEvidenceRecords,
      eventLedger: globalThis.SecondOrderSessionLedger ? globalThis.SecondOrderSessionLedger.snapshot(state) : [],
      deterministicAssessment: {
        score: Math.round(average(qualities)),
        scoreMeaning: "Average deterministic decision quality; AI cannot modify this value.",
        outcomeMix: { success: Number(metrics.successCount || 0), partial: Number(metrics.partialCount || 0), failure: Number(metrics.failureCount || 0) },
        toleranceLoad: Number(state.toleranceLoad || 0),
        dismissed: Boolean(state.dismissed),
        dismissalReason: state.dismissalReason || "",
        finalMetrics: compactMetrics(state),
      },
      declaredPriorities: safeArray(state.decisionPriorities),
    };
  }

  globalThis.SecondOrderAiEvidence = { build: buildEvidence };
})();
