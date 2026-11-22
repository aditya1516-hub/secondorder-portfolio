(function (root) {
  'use strict';
  const array = value => Array.isArray(value) ? value : [];
  const numeric = value => value !== null && value !== '' && value !== undefined && Number.isFinite(Number(value));
  const clamp = value => Math.max(0, Math.min(100, Number(value)));
  const average = values => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  const time = value => {
    if (typeof value === 'number') return value;
    if (!value) return null;
    const parsed = Date.parse(String(value).replace(/^(\d{4}-\d{2}-\d{2}) /, '$1T'));
    return Number.isFinite(parsed) ? parsed : null;
  };
  const BUSINESS = [
    ['Revenue momentum','stats','EconomicStability',.15],['Margin health','stats','FiscalHealth',.2],
    ['Board confidence','domestic','ParliamentApproval',.1],['Consumer trust','sentiment','TrustInGovernment',.15],
    ['Market confidence','systems','MarketConfidence',.1],['Supply resilience','systems','SupplyChainIntegrity',.1],
    ['Service capacity','systems','HealthcareCapacity',.1],['Margin pressure','threats','EconomicPressure',.1,true],
  ];
  const GOVERNANCE = [
    ['Security','stats','NationalSecurity',.25],['Public confidence','stats','PublicConfidence',.2],
    ['Diplomacy','stats','DiplomaticStanding',.15],['Service capacity','systems','HealthcareCapacity',.15],
    ['Infrastructure','systems','InfrastructureIntegrity',.15],['Public panic','sentiment','PanicLevel',.1,true],
  ];
  function health(snapshot, business = true) {
    let total = 0, coverage = 0;
    (business ? BUSINESS : GOVERNANCE).forEach(([,group,key,weight,inverse]) => {
      const value = snapshot?.[group]?.[key];
      if (!numeric(value)) return;
      total += (inverse ? 100 - clamp(value) : clamp(value)) * weight; coverage += weight;
    });
    return coverage >= .6 ? { value: Math.round(total / coverage * 10) / 10, coverage: Math.round(coverage * 100) } : null;
  }
  const POLICY = [
    ['problemSolving','Problem solving','strategicReasoning',.2],
    ['reasoningQuality','Reasoning quality','manualReasoningScore',.35],
    ['secondOrderThinking','Second-order thinking','secondOrderThinking',.2],
    ['adaptation','Adaptation','adaptation',.15],
    ['stakeholderJudgment','Stakeholder judgment','stakeholderAwareness',.1],
  ];
  function scoreReport(report, evidence) {
    const reflections = array(evidence?.reflections);
    const reviews = array(report.manualReasoningReviews);
    const scoreKeys = ['conceptualScore','alignmentScore','specificityScore','technicalDepthScore'];
    const perResponse = reviews.map(review => review.verdict === 'unrelated' ? 0 : average(scoreKeys.map(key => clamp(review[key]))));
    report.manualReasoningScore = reflections.length && perResponse.length ? Math.round(average(perResponse)) : 0;
    let sum = 0, weight = 0;
    POLICY.forEach(([, , key, w]) => {
      const dimension = report[key];
      const observed = key === 'manualReasoningScore' ? reflections.length && reviews.length === reflections.length : array(dimension?.evidenceIds).length;
      const value = key === 'manualReasoningScore' ? dimension : dimension?.score;
      if (observed && numeric(value)) { sum += clamp(value) * w; weight += w; }
    });
    report.overallReasoningScore = weight ? Math.round(sum / weight) : 0;
    return report;
  }
  function build(state, evidence, envelope, snapshots = []) {
    const business = state.scenarioId === 'secondorder_business';
    const report = envelope?.assessment || null;
    const decisions = array(evidence?.decisions);
    const reflections = array(evidence?.reflections);
    const boardroom = array(evidence?.boardroomInteractions);
    const emergencies = array(evidence?.emergencies);
    const samples = [];
    const add = (snapshot, clock, source, phase = 0) => {
      const result = health(snapshot, business);
      if (result) samples.push({ ...result, time: time(clock), source, phase, order: samples.length });
    };
    decisions.forEach((decision,index) => {
      add(decision.stateBefore, decision.time, decision.evidenceId || `D${index+1}`, -1);
      add(decision.stateAfter, decision.time, decision.evidenceId || `D${index+1}`, 1);
    });
    snapshots.forEach(item => add(item.metrics, item.clock, 'Recorded state'));
    const ledger = array(evidence?.eventLedger);
    ledger.forEach(item => add(item.stateDigest, item.simulationTime, item.evidenceId));
    add(state, state.clock, 'Final state', 2);
    samples.sort((a,b) => (a.time ?? Infinity) - (b.time ?? Infinity) || a.phase - b.phase || a.order - b.order);
    const points = samples.filter((item,index) => index === 0 || item.time !== samples[index-1].time || item.value !== samples[index-1].value);
    const firstTime = points.find(item => item.time !== null)?.time;
    const lastTime = [...points].reverse().find(item => item.time !== null)?.time;
    points.forEach((item,index) => { item.progress = lastTime > firstTime && item.time !== null ? clamp((item.time-firstTime)/(lastTime-firstTime)*100) : points.length > 1 ? index/(points.length-1)*100 : 100; });
    const nearest = clock => {
      const at = time(clock);
      if (at === null || !points.length) return null;
      return points.reduce((best,item) => {
        const distance = Math.abs((item.time ?? Infinity)-at);
        const previous = Math.abs((best.time ?? Infinity)-at);
        return distance < previous || (distance === previous && item.time === best.time && item.phase > best.phase) ? item : best;
      }, points[0]);
    };
    const events = [];
    const pin = (id, label, kind, point, description, evidenceIds = []) => {
      if (!point || events.some(item => item.id === id)) return;
      events.push({ id, label, kind, progress:point.progress, value:point.value, time:point.time, description, evidenceIds });
    };
    emergencies.forEach((crisis,index) => {
      const event = ledger.find(item => item.type === 'emergency_triggered' && item.sourceEvidenceId === crisis.evidenceId);
      const recorded = snapshots.find(item => item.emergencyCount > index);
      const source = decisions.find(item => item.title === crisis.sourceDecision || item.decisionId === crisis.sourceDecision);
      pin(crisis.evidenceId, 'Emergency', 'emergency', nearest(event?.simulationTime || recorded?.clock || source?.time), `${crisis.title}. ${crisis.resolution || 'No resolution was recorded before the session ended.'}`, [crisis.evidenceId]);
    });
    if (boardroom.length) pin('boardroom','Board consultation','boardroom',nearest(boardroom[0].time),`The participant asked: ${boardroom[0].question}. Consultation is evidence of inquiry; later actions are evaluated separately.`,[boardroom[0].evidenceId]);
    if (points.length > 1) {
      const low = points.reduce((best,item) => item.value < best.value ? item : best);
      const high = points.reduce((best,item) => item.value > best.value ? item : best);
      if (Math.abs(low.value-high.value) >= 1) {
        pin('low','Lowest health','low',low,`The recorded company-health index reached ${low.value}/100. This is a measured state, not proof of a single decision's causal effect.`,[low.source].filter(id=>/^[DERBL]\d+$/.test(id)));
        pin('peak','Peak health','peak',high,`The strongest recorded company-health index was ${high.value}/100. The line reflects the combined effects visible in recorded snapshots.`,[high.source].filter(id=>/^[DERBL]\d+$/.test(id)));
      }
    }
    const unique = events.filter((item,index) => !events.slice(0,index).some(other => Math.abs(other.progress-item.progress)<3));
    const selectedEvents = unique.slice(0,4).sort((a,b)=>a.progress-b.progress);
    const start = points[0]?.value ?? null, end = points.at(-1)?.value ?? null;
    const delta = start !== null && end !== null && points.length > 1 ? Math.round((end-start)*10)/10 : null;
    const low = points.length ? Math.min(...points.map(item=>item.value)) : null;
    const high = points.length ? Math.max(...points.map(item=>item.value)) : null;
    const capabilities = POLICY.map(([id,label,key,weight]) => {
      const dimension = report?.[key];
      const observed = key === 'manualReasoningScore' ? reflections.length && array(report?.manualReasoningReviews).length === reflections.length : array(dimension?.evidenceIds).length;
      return {id,label,weight,score:report && observed && numeric(key === 'manualReasoningScore' ? dimension : dimension?.score) ? clamp(key === 'manualReasoningScore' ? dimension : dimension.score) : null,summary:key === 'manualReasoningScore' ? report?.manualReasoningSummary || 'Participant reasoning has not been assessed.' : dimension?.analysis || 'No AI assessment is available.',evidenceIds:key === 'manualReasoningScore' ? reflections.map(item=>item.evidenceId) : array(dimension?.evidenceIds)};
    });
    const review = [...array(report?.manualReasoningReviews)].sort((a,b)=>Number(a.conceptualScore)-Number(b.conceptualScore))[0];
    const source = reflections.find(item=>item.evidenceId===review?.reasoningEvidenceId) || reflections[0] || null;
    const changeText = delta === null ? 'There is not enough recorded history to compare the start and finish.' : `Health moved from ${start} to ${end} (${delta >= 0 ? '+' : ''}${delta} index points). The session low was ${low}.`;
    return {
      schemaVersion:1,mode:envelope ? 'ai' : 'standard',scenario:evidence.scenario,session:evidence.session,
      health:{version:'health-index-v1',points,start,end,delta,low,high,methodology:'Fixed weighted index of recorded metrics. Pressure indicators are inverted; missing fields are excluded only when at least 60% of the configured weight is observed. Event pins use the nearest available recorded state. A simulation indicator, not a financial valuation or proof of a single cause.',weights:(business?BUSINESS:GOVERNANCE).map(([label,,,weight,inverse])=>({label,weight,inverse:Boolean(inverse)}))},
      events:selectedEvents,capabilities,processScore:report && capabilities.some(item=>item.score!==null) ? report.overallReasoningScore : null,
      verdict:{title:delta===null?'Your recorded simulation journey':delta>0?'Stronger at the finish. Review the path you took.':delta<0?'The business finished under more pressure.':'A steady finish. Examine the trade-offs.',summary:report?.executiveSummary || changeText},
      spotlight:source?{...source,review:review || null}:null,
      takeaways:{worked:array(report?.strengths)[0] || (delta!==null && delta>0?'The final health index exceeded the starting reading.':'Use the chart to identify periods of stability.'),gap:array(report?.developmentPriorities)[0] || 'Written understanding requires a contextual assessment, not inference from outcomes.',next:array(report?.developmentPriorities)[1] || 'State the constraint, supporting evidence and a review trigger before your next move.'},
      coverage:{decisions:decisions.length,reflections:reflections.length,reviewed:array(report?.manualReasoningReviews).length,boardroom:boardroom.length,emergencies:emergencies.length},
    };
  }
  root.SecondOrderReviewModel = {health,build,time,scoreReport,POLICY};
})(typeof globalThis !== 'undefined' ? globalThis : this);
