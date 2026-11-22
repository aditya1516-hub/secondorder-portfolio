(function (root) {
  'use strict';
  const WINDOW_MS = 120000, REVIEW_MS = 10000;
  const copy = value => JSON.parse(JSON.stringify(value));
  const clamp = value => Math.max(0, Math.min(100, Math.round(value)));
  const stamp = value => Number.isFinite(value) ? new Date(value).toISOString() : null;
  const parse = value => value ? Date.parse(value) : NaN;
  const current = state => state.emergencyControversy?.current;
  const journey = state => current(state)?.journey;
  const blocked = state => Boolean(journey(state) && journey(state).phase !== 'closed');
  const keys = ['outrage', 'boardPanic', 'boycott'];
  const business = state => ({revenue:state.stats.EconomicStability,margin:state.stats.FiscalHealth,board:state.domestic.ParliamentApproval,trust:state.sentiment.TrustInGovernment});
  const flagsFor = {
    audit_apology:['review'], timeboxed_check:['review'], evidence_room:['verified'], retailer_protection:['protect'], protected_reporting:['protect'],
    accountability:['communicate'], evidence_update:['communicate'], leader_qa:['communicate'], consumer_repair:['communicate'], fact_finding:['communicate'],
    independent_panel:['review','oversight'], partner_stabilization:['partners'], governance_gate:['controls'],
  };
  const contracts = {
    audit_apology:['A credible independent process reduces uncertainty without deciding guilt.','The review costs money and still needs evidence, protection and follow-through.'],
    timeboxed_check:['Preserving records and assigning a verification owner makes a short wait defensible.','Verification is not a finding. Protect reporters and set an update time.'],
    protected_reporting:['A protected reporting route reduces immediate employee exposure.','Protection does not replace fact-finding or independent oversight.'],
    retailer_protection:['Practical frontline support reduces harm while the central response is prepared.','Funding remedies consumes margin; the underlying allegation remains unresolved.'],
    evidence_room:['A checked factual brief reduces competing accounts and partner confusion.','Protect identities and distinguish verified facts from allegations.'],
    pause_campaign:['Pausing amplification avoids worsening the mismatch between promotion and stakeholder concern.','Lost campaign momentum and committed spend remain real costs.'],
    deny_counter:['An unsupported denial increases the risk of later contradiction.','Correct claims that cannot be supported by evidence.'],
    legal_pressure:['Broad legal pressure before verification can discourage legitimate reporting.','Narrow, verified falsehoods and blanket suppression require different responses.'],
    accountability:['Acknowledgment and a named review give stakeholders a basis for judging follow-through.','An announcement is not completed repair. Deliver the promised updates.'],
    fact_finding:['A holding statement acknowledges uncertainty without inventing a conclusion.','A statement alone is not a review. Assign owners and verification steps.'],
    defensive_denial:['Defensive claims outrun the evidence and can undermine the review.','Do not confuse message control with fact-finding.'],
    consumer_repair:['A relevant customer remedy can reduce harm and public uncertainty.','Remedies cost money and may not address an internal culture issue.'],
    evidence_update:['A dated factual update makes leadership commitments easier to verify.','Keep the update promise and do not publish unverified claims.'],
    leader_qa:['Prepared leadership can explain evidence, ownership and remaining uncertainty.','A live Q&A without preparation can amplify speculation.'],
    independent_panel:['Independent oversight reduces conflicts of interest and makes follow-through verifiable.','A full investigation and fair process continue after immediate containment.'],
    leadership_accountability:['A neutral reassignment protects the review without announcing a finding of guilt.','Preserve operational continuity and procedural fairness.'],
    values_reset:['Funded remediation makes the response more tangible.','Spending is not proof of improved conduct; verify that the remedy fits the incident.'],
    governance_gate:['New approval controls reduce future exposure.','Future controls do not resolve the current allegation or replace a review.'],
    partner_stabilization:['One verified brief and escalation owner reduce channel confusion.','Commercial continuity is not the same as cultural or operational repair.'],
  };
  function additionalOptions() { return [
    {id:'timeboxed_check',title:'Preserve records and commission a time-boxed fact check',note:'Name a verification owner and preserve the full context before public claims.',deltas:{stats:{FiscalHealth:-1},domestic:{ParliamentApproval:2},sentiment:{TrustInGovernment:2}},tracker:{outrage:-5,mediaPressure:-5,boardPanic:-4,boycott:-2}},
    {id:'protected_reporting',title:'Open a protected reporting and escalation route',note:'Give affected people a confidential contact, non-retaliation protection and a named owner.',deltas:{stats:{FiscalHealth:-2},domestic:{ParliamentApproval:2},sentiment:{TrustInGovernment:3}},tracker:{outrage:-7,mediaPressure:-4,boardPanic:-5,boycott:-3}},
    {id:'wait_verified',title:'Wait for verified information',note:'Deliberately hold a public response; the effect depends on whether verification is already under way.',deltas:{},tracker:{}},
  ]; }
  function begin(state, now = Date.now(), legacy = false) {
    const crisis=current(state), cs=state.emergencyControversy;
    if (!crisis || crisis.journey || !state.onboardingComplete || state.sessionReportShown || state.dismissed) return false;
    const left=root.SecondOrderSessionClock.remaining(state,now);
    if (left<=0) return false;
    if (state.meetingActive) root.SecondOrderSessionClock.endMeeting(state,now);
    const oldEnd=parse(cs.responseEndsAt);
    crisis.journey={version:1,phase:legacy?'response':'brief',openedAt:stamp(now),startedAt:legacy?stamp(now):null,deadline:legacy?stamp(Math.min(Number.isFinite(oldEnd)?oldEnd:now+WINDOW_MS,now+WINDOW_MS)):null,reviewUntil:null,flags:[],breaches:0,actions:[],lastImpact:null,outcome:null,outcomeApplied:false,noteDraft:'',businessBefore:business(state),legacy};
    state.emergencyClockPause={remainingMs:left,startedAt:stamp(now),analysisRemainingMs:Math.max(0,(parse(state.analysisWindowEndsAt)||0)-now)};
    cs.responseEndsAt=crisis.journey.deadline;cs.nextActionAt=null;cs.popupOpen=false;cs.windowExpired=false;
    if (legacy) {
      const ids=[...(crisis.usedResponses||[]),...(crisis.usedMajorDecisions||[]),crisis.statementChoiceId].filter(Boolean);
      crisis.journey.flags=[...new Set(ids.flatMap(id=>flagsFor[id]||[]))];
    }
    return true;
  }
  function start(state, now=Date.now()) {
    const flow=journey(state);if(!flow||flow.phase!=='brief')return false;
    flow.phase='response';flow.startedAt=stamp(now);flow.deadline=stamp(now+WINDOW_MS);state.emergencyControversy.responseEndsAt=flow.deadline;return true;
  }
  function remaining(state,now=Date.now()) {const flow=journey(state);return !flow||flow.phase==='brief'?WINDOW_MS:!Number.isFinite(parse(flow.deadline))?0:flow.closedAt?Math.max(0,parse(flow.deadline)-parse(flow.closedAt)):Math.max(0,parse(flow.deadline)-now);}
  function reviewRemaining(state,now=Date.now()){return Math.max(0,(parse(journey(state)?.reviewUntil)||0)-now);}
  function available(state,now=Date.now()){return journey(state)?.phase==='response'&&remaining(state,now)>0&&!state.dismissed&&!state.sessionReportShown;}
  function evaluate(state,option){
    const flow=journey(state),flags=new Set(flow.flags),pair=contracts[option.id]||[option.note,'Check the remaining stakeholder and execution trade-offs.'];
    let result={tracker:copy(option.tracker||{}),deltas:copy(option.deltas||{}),why:pair[0],trade:pair[1],flags:flagsFor[option.id]||[],breach:null};
    const missing=['evidence_room','evidence_update','leader_qa','leadership_accountability','partner_stabilization'].includes(option.id)&&!flags.has('review');
    if(missing)result={...result,flags:[],tracker:{outrage:4,mediaPressure:4,boardPanic:5,boycott:3},deltas:{domestic:{ParliamentApproval:-2},sentiment:{TrustInGovernment:-2}},breach:'A commitment ran ahead of its evidence base.',why:'This step can be useful, but no fact-finding process was established first. The premature commitment weakens credibility.'};
    if(['deny_counter','legal_pressure','defensive_denial'].includes(option.id))result.breach='The response used unsupported claims or broad suppression before verification.';
    if(option.id==='wait_verified'){
      const ready=flags.has('review');result={...result,tracker:ready?{outrage:-1,boardPanic:-1,boycott:0}:{outrage:5,mediaPressure:4,boardPanic:4,boycott:3},deltas:{},flags:[],why:ready?'The wait is supported by an active verification process. Avoiding premature claims can be proportionate.':'Without a verification owner or review, waiting leaves stakeholders without a credible process. Uncertainty increases.',trade:'Waiting is not automatically wrong. Keep an owner, a deadline and a route for affected people.'};
    }
    return result;
  }
  function saveNote(state){
    const crisis=current(state),flow=journey(state),last=flow?.actions.at(-1),text=String(flow?.noteDraft||'').trim();
    if(!last||!text||last.reasoning===text)return;
    last.reasoning=text;
    const reviewId=`emergency-${crisis.startedAt}-${last.id}`;
    state.reflections=Array.isArray(state.reflections)?state.reflections:[];
    const record={reviewId,decisionTitle:last.title,contextType:'emergency',prompt:'Why did you choose this response given the evidence and trade-offs?',questions:['What risk were you containing?','Why this response rather than an alternative?','What consequence did you anticipate?'],selectedChoice:last.title,choiceDetails:last.note,emergencyStartedAt:crisis.startedAt,emergencyTitle:crisis.title,emergencyBrief:crisis.brief,text,time:new Date().toISOString()};
    const index=state.reflections.findIndex(r=>r.reviewId===reviewId);if(index<0)state.reflections.push(record);else state.reflections[index]=record;
    if(state.pendingReflection?.reviewId===reviewId)state.pendingReflection=null;
  }
  function record(state, option, kind, assessment, before, afterAction, now=Date.now()){
    const crisis=current(state),flow=journey(state);if(!available(state,now)||flow.actions.some(a=>a.id===option.id))return false;
    assessment.flags.forEach(flag=>{if(!flow.flags.includes(flag))flow.flags.push(flag);});
    if(assessment.breach)flow.breaches=Math.min(3,flow.breaches+1);
    let development=null;const turn=flow.actions.length+1;
    if(turn===2){development={title:'Additional stakeholder accounts arrive.',detail:'New submissions widen the questions to investigate; they are not verified findings.',tracker:flow.flags.includes('protect')?{outrage:1,boardPanic:1}:{outrage:4,boardPanic:3,boycott:2}};}
    if(turn===4){const ready=flow.flags.includes('communicate')&&flow.flags.includes('review');development={title:ready?'Retail partners accept the interim briefing.':'A retailer pauses a promotional placement.',detail:ready?'Continuation remains conditional on leadership following through.':'The partner asks for verified information and a named escalation owner.',tracker:ready?{outrage:-3,boardPanic:-3,boycott:-2}:{outrage:3,boardPanic:4,boycott:2}};}
    if(development)Object.entries(development.tracker).forEach(([key,value])=>crisis.tracker[key]=clamp(crisis.tracker[key]+value));
    const action={id:option.id,title:option.title,note:option.note,kind,at:stamp(now),elapsedMs:Math.max(0,now-parse(flow.startedAt)),before,afterAction,after:{pressure:copy(crisis.tracker),business:business(state)},why:assessment.why,trade:assessment.trade,breach:assessment.breach,development,reasoning:''};
    flow.actions.push(action);flow.lastImpact=action;flow.noteDraft='';flow.phase='review';flow.reviewUntil=stamp(Math.min(now+REVIEW_MS,parse(flow.deadline)));state.emergencyControversy.nextActionAt=flow.reviewUntil;
    const contained=keys.every(k=>crisis.tracker[k]<=30)&&['review','protect','communicate','oversight'].every(flag=>flow.flags.includes(flag));
    flow.pendingOutcome=flow.breaches>=3||keys.some(k=>crisis.tracker[k]>=95)?'escalated':contained?'contained':null;
    return true;
  }
  function finish(state,outcome,now=Date.now()){
    const crisis=current(state),flow=journey(state);if(!flow||flow.outcomeApplied)return null;
    saveNote(state);flow.outcome=outcome;flow.phase='outcome';flow.closedAt=stamp(Number.isFinite(parse(flow.deadline))?Math.min(now,parse(flow.deadline)):now);flow.outcomeApplied=true;
    state.emergencyControversy.active=false;state.emergencyControversy.windowExpired=outcome==='timeout';state.emergencyControversy.nextActionAt=null;
    crisis.resolution=outcome==='contained'?'Immediate danger contained; investigation and follow-through remain.':outcome==='escalated'?'Escalation threshold crossed; business consequences carried forward.':'Response window expired with unresolved incident risk.';
    if(outcome==='contained')crisis.resolvedAt=state.clock;else crisis.responseWindowExpiredAt=stamp(now);
    const deltas=outcome==='contained'?{domestic:{ParliamentApproval:2},sentiment:{TrustInGovernment:2}}:outcome==='escalated'?{stats:{EconomicStability:-8,FiscalHealth:-5},domestic:{ParliamentApproval:-12},sentiment:{TrustInGovernment:-10},economy:{StockIndex:-4}}:{stats:{EconomicStability:-3,FiscalHealth:-2},domestic:{ParliamentApproval:-4},sentiment:{TrustInGovernment:-4},economy:{StockIndex:-2}};
    return {outcome,deltas};
  }
  function advance(state,now=Date.now()){
    const flow=journey(state);if(!flow||!['response','review'].includes(flow.phase))return null;
    if(remaining(state,now)===0)return finish(state,flow.pendingOutcome||'timeout',now);
    if(flow.phase==='review'&&reviewRemaining(state,now)===0){saveNote(state);if(flow.pendingOutcome)return finish(state,flow.pendingOutcome,now);flow.phase='response';flow.reviewUntil=null;state.emergencyControversy.nextActionAt=null;return {reviewEnded:true};}
    return null;
  }
  function resume(state,now=Date.now()){
    const flow=journey(state),pause=state.emergencyClockPause;if(!flow||flow.phase!=='outcome'||!pause)return false;
    saveNote(state);flow.phase='closed';flow.returnedAt=stamp(now);state.sessionEndsAt=stamp(now+pause.remainingMs);state.analysisWindowEndsAt=stamp(now+(pause.analysisRemainingMs||0));state.emergencyClockPause=null;return true;
  }
  root.SecondOrderEmergencyFlow={WINDOW_MS,REVIEW_MS,keys,business,current,journey,blocked,begin,start,remaining,reviewRemaining,available,evaluate,record,advance,finish,resume,saveNote,additionalOptions};
})(typeof window!=='undefined'?window:globalThis);
