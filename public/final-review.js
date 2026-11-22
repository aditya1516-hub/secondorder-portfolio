(function () {
  'use strict';
  const key='pm-warroom-state-v3';
  const aiMode=/\/pm-interface-ai(?:\.html)?\/?$/i.test(location.pathname);
  let currentState=null,currentEvidence=null,currentModel=null,envelope=null,handled='',busy=false,selectedEvent=null;
  const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'null');}catch{return null;}};
  const historyKey=state=>`secondorder-health-v1:${state.createdAt||'session'}`;
  function snapshots(state){try{return JSON.parse(localStorage.getItem(historyKey(state))||'[]');}catch{return [];}}
  function collect(){
    const state=read();
    if(!state||!state.onboardingComplete||state.sessionReportShown)return;
    const history=snapshots(state);
    const metrics=Object.fromEntries(['stats','domestic','sentiment','systems','threats','economy'].map(group=>[group,state[group]||{}]));
    const crises=[...(state.emergencyControversy?.history||[])];
    if(state.emergencyControversy?.current&&!crises.some(item=>item.startedAt===state.emergencyControversy.current.startedAt))crises.push(state.emergencyControversy.current);
    const item={clock:state.clock,metrics,emergencyCount:crises.length};
    if(JSON.stringify(history.at(-1))===JSON.stringify(item))return;
    history.push(item);
    try{localStorage.setItem(historyKey(state),JSON.stringify(history.slice(-2000)));}catch{/* Existing saves and export remain usable when browser storage is full. */}
  }
  collect();setInterval(collect,2000);
  const text=(selector,value)=>{const node=document.querySelector(selector);if(node)node.textContent=value==null?'Unassessed':String(value);};
  const value=number=>number===null||number===undefined?'—':Number(number).toFixed(1).replace(/\.0$/,'');
  function create(){
    const content=document.getElementById('sessionReportContent');
    if(!content)return null;
    content.classList.add('turning-point-active');
    document.getElementById('sessionReportPanel').classList.add('turning-point-panel');
    const section=document.createElement('section');section.id='turningPointReview';section.className='tp-review';
    section.innerHTML=`<header class="tp-heading"><div><span class="tp-kicker">Simulation performance review</span><h2 id="tpTitle"></h2><p id="tpVerdict"></p></div><div class="tp-downloads"><button id="tpDownloadSummary" type="button">Download PDF summary</button><button id="tpDownloadAudit" class="ghost" type="button">Full evidence audit</button></div></header>
      <div id="tpStatus" class="tp-status" role="status"></div><div class="tp-layout"><article class="tp-card tp-journey"><div class="tp-card-heading"><div><h3>The cumulative journey</h3><span id="tpHealthLabel">Company health / 0–100</span></div><span id="tpCoverage"></span></div><div id="tpChart" class="tp-chart" role="img" aria-label="Recorded health index over session progress"></div><div id="tpEvents" class="tp-events" role="group" aria-label="Major events"></div><div id="tpEventDetail" class="tp-event-detail" aria-live="polite"></div><div class="tp-readings"><span>Start <b id="tpStart"></b></span><span>Finish <b id="tpEnd"></b></span><span>Net change <b id="tpDelta"></b></span><span>Session low <b id="tpLow"></b></span></div></article>
      <aside class="tp-card tp-capabilities"><h3>Capabilities demonstrated</h3><div id="tpGauges"></div><details class="tp-other"><summary>All competency scores</summary><div id="tpAllCapabilities"></div></details><p id="tpScoreSource"></p></aside></div>
      <section class="tp-takeaways"><div><span>What worked</span><p id="tpWorked"></p></div><div><span>What held you back</span><p id="tpGap"></p></div><div><span>Your next practice</span><p id="tpNext"></p></div></section>
      <article id="tpReasoning" class="tp-card tp-reasoning"><div><div class="tp-reason-heading"><h3>Your words, in context</h3><span id="tpReasoningScore"></span></div><p id="tpReasoningContext" class="tp-context"></p><blockquote id="tpQuote"></blockquote></div><div><p id="tpInterpretation"></p><span id="tpReasoningNote"></span></div></article>
      <details class="tp-method"><summary>How to read these results</summary><p id="tpMethod"></p><div id="tpWeights"></div><p>Competency scores are rubric-based interpretations of observed simulation evidence, not a diagnosis of personality. Missing evidence is unassessed. The full audit contains the original recorded responses and citations.</p></details><div class="tp-endnote"><span id="tpEvidenceCount"></span><button id="tpRetry" class="ghost" type="button" hidden>Retry AI assessment</button><span id="tpDownloadStatus" role="status"></span></div>`;
    content.append(section);
    section.querySelector('#tpDownloadSummary').addEventListener('click',()=>download(false));
    section.querySelector('#tpDownloadAudit').addEventListener('click',()=>download(true));
    section.querySelector('#tpRetry').addEventListener('click',()=>requestAssessment(true));
    new ResizeObserver(()=>drawChart()).observe(section.querySelector('#tpChart'));
    return section;
  }
  function drawChart(){
    const container=document.getElementById('tpChart');
    if(!container||!currentModel)return;
    const points=currentModel.health.points;
    if(!points.length){container.textContent='No comparable company-state snapshots were recorded.';return;}
    const width=container.clientWidth;if(width<100)return;
    const height=container.clientHeight, left=36,right=width-15,top=23,bottom=height-40;
    const x=progress=>left+progress/100*(right-left),y=score=>bottom-score/100*(bottom-top);
    const ns='http://www.w3.org/2000/svg';
    const el=(tag,attrs,label)=>{const node=document.createElementNS(ns,tag);Object.entries(attrs||{}).forEach(([name,v])=>node.setAttribute(name,v));if(label!==undefined)node.textContent=label;return node;};
    const svg=el('svg',{viewBox:`0 0 ${width} ${height}`,role:'presentation'});
    [0,25,50,75,100].forEach(score=>{svg.append(el('line',{x1:left,x2:right,y1:y(score),y2:y(score),class:'tp-gridline'}));svg.append(el('text',{x:left-8,y:y(score)+4,'text-anchor':'end'},score));});
    (width<400?[0,50,100]:[0,25,50,75,100]).forEach(progress=>svg.append(el('text',{x:x(progress),y:height-21,'text-anchor':progress===0?'start':progress===100?'end':'middle'},`${progress}%`)));
    svg.append(el('text',{x:(left+right)/2,y:height-4,'text-anchor':'middle'},'Recorded session progress'));
    if(points.length>1){const line=points.map(point=>`${x(point.progress)},${y(point.value)}`).join(' ');svg.append(el('polygon',{points:`${x(points[0].progress)},${bottom} ${line} ${x(points.at(-1).progress)},${bottom}`,class:'tp-area'}));svg.append(el('polyline',{points:line,class:'tp-line'}));}
    else svg.append(el('circle',{cx:x(100),cy:y(points[0].value),r:4,class:'tp-point'}));
    currentModel.events.forEach((event,index)=>{const cx=x(event.progress),cy=y(event.value),pinY=Math.max(12,cy-27);svg.append(el('line',{x1:cx,x2:cx,y1:pinY+9,y2:cy-5,class:'tp-pin-line'}));svg.append(el('circle',{cx,cy,r:4,class:'tp-point'}));svg.append(el('circle',{cx,cy:pinY,r:9,class:event.id===selectedEvent?'tp-pin selected':'tp-pin'}));svg.append(el('text',{x:cx,y:pinY+4,'text-anchor':'middle',class:event.id===selectedEvent?'tp-pin-number selected':'tp-pin-number'},index+1));});
    container.replaceChildren(svg);
    container.setAttribute('aria-label',`Recorded health index: start ${value(currentModel.health.start)}, finish ${value(currentModel.health.end)}, low ${value(currentModel.health.low)} out of 100.`);
  }
  function selectEvent(id){
    selectedEvent=id;const event=currentModel.events.find(item=>item.id===id);
    document.querySelectorAll('#tpEvents button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.eventId===id)));
    const detail=document.getElementById('tpEventDetail');detail.replaceChildren();
    if(event){const strong=document.createElement('strong');strong.textContent=event.label;const p=document.createElement('p');p.textContent=event.description;detail.append(strong,p);}else detail.textContent='No major event has enough timing evidence to pin to this session.';
    drawChart();
  }
  function render(){
    if(!document.getElementById('turningPointReview'))create();
    if(!currentModel)return;
    text('#tpTitle',currentModel.verdict.title);text('#tpVerdict',currentModel.verdict.summary);
    text('#tpHealthLabel',currentState.scenarioId==='secondorder_business'?'Company health / 0–100':'Scenario health / 0–100');
    text('#tpCoverage',`${currentModel.health.points.length} recorded snapshots`);
    text('#tpStart',value(currentModel.health.start));text('#tpEnd',value(currentModel.health.end));text('#tpLow',value(currentModel.health.low));
    const change=currentModel.health.delta;text('#tpDelta',change===null?'Unassessed':`${change>=0?'+':''}${value(change)} pts`);
    const events=document.getElementById('tpEvents');events.replaceChildren(...currentModel.events.map((event,index)=>{const button=document.createElement('button');button.type='button';button.dataset.eventId=event.id;button.textContent=`${index+1}  ${event.label}`;button.addEventListener('click',()=>selectEvent(event.id));return button;}));
    selectEvent(currentModel.events.some(item=>item.id===selectedEvent)?selectedEvent:currentModel.events[0]?.id);
    const gauges=document.getElementById('tpGauges');gauges.replaceChildren(...['problemSolving','reasoningQuality','adaptation'].map(id=>{
      const capability=currentModel.capabilities.find(item=>item.id===id);const row=document.createElement('div');row.className='tp-gauge';
      const ring=document.createElement('div');ring.className='tp-ring';ring.style.setProperty('--score',capability.score??0);ring.setAttribute('role','img');ring.setAttribute('aria-label',`${capability.label}: ${capability.score===null?'Unassessed':capability.score+' out of 100'}`);
      const score=document.createElement('span');score.textContent=capability.score===null?'—':Math.round(capability.score);ring.append(score);
      const copy=document.createElement('div');const title=document.createElement('strong');title.textContent=capability.label;const note=document.createElement('p');note.textContent=capability.score===null?'Unassessed':capability.score>=75?'Well demonstrated':capability.score>=50?'Partially demonstrated':'Needs development';copy.append(title,note);row.append(ring,copy);return row;
    }));
    const all=document.getElementById('tpAllCapabilities');all.replaceChildren(...currentModel.capabilities.map(item=>{const row=document.createElement('p');row.textContent=`${item.label}: ${item.score===null?'Unassessed':Math.round(item.score)+'/100'}`;return row;}));
    text('#tpScoreSource',envelope?`Rubric-based AI interpretation. Process score: ${currentModel.processScore===null?'Unassessed':currentModel.processScore+'/100'}.`:'Standard mode: company outcomes are shown. Written reasoning and competencies need an AI or assessor review.');
    text('#tpWorked',currentModel.takeaways.worked);text('#tpGap',currentModel.takeaways.gap);text('#tpNext',currentModel.takeaways.next);
    const source=currentModel.spotlight;
    text('#tpReasoningContext',source?`Action: ${source.selectedChoice || source.decisionTitle}. Prompt: ${source.prompt}. ${source.choiceDetails || source.emergencyContext?.brief || ''}`:'No participant-authored explanation was recorded.');
    text('#tpQuote',source?`${source.text.slice(0,420)}${source.text.length>420?'…':''}`:'No written response to display.');
    text('#tpReasoningScore',source?.review?`${source.review.conceptualScore}/100 · this response`:'Unassessed');
    text('#tpInterpretation',source?.review?.analysis || (source?'Your original explanation is shown here. It has not been assessed; no quality score has been inferred.':'Missing written evidence is not treated as a zero score.'));
    text('#tpReasoningNote',`${source?.text?.length>420?'Excerpt shown. ':''}The PDF contains the separate manual-reasoning review. The full audit preserves every recorded response.`);
    text('#tpMethod',currentModel.health.methodology);
    document.getElementById('tpWeights').textContent=currentModel.health.weights.map(item=>`${item.label}: ${Math.round(item.weight*100)}%${item.inverse?' (lower pressure is healthier)':''}`).join(' · ');
    const c=currentModel.coverage;text('#tpEvidenceCount',`${c.decisions} decisions · ${c.reflections} written responses (${c.reviewed} reviewed) · ${c.boardroom} board questions · ${c.emergencies} emergency records`);
  }
  function model(){currentModel=SecondOrderReviewModel.build(currentState,currentEvidence,envelope,snapshots(currentState));render();}
  async function requestAssessment(force=false){
    if(!aiMode||busy)return;
    const cacheKey=`secondorder-final-review-v3:${currentState.createdAt}:${currentEvidence.decisions.length}:${currentEvidence.reflections.length}:${currentState.clock}`;
    if(!force&&handled===cacheKey)return;handled=cacheKey;
    if(!force){try{const cached=JSON.parse(localStorage.getItem(cacheKey)||'null');if(cached?.assessment){envelope=cached;model();text('#tpStatus','AI assessment loaded from this session’s saved result.');return;}}catch{/* Ignore an invalid local assessment cache. */}}
    busy=true;text('#tpStatus','Reviewing the recorded journey and written reasoning…');document.getElementById('tpRetry').hidden=true;
    try{
      const response=await fetch('/api/assess-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(currentEvidence)});
      const result=await response.json();if(!response.ok)throw new Error(result.error||'AI assessment unavailable.');
      envelope=result;try{localStorage.setItem(cacheKey,JSON.stringify(result));}catch{/* A full browser store must not hide a completed assessment. */}
      model();text('#tpStatus','AI assessment complete. Reasoning and outcomes are shown separately.');
    }catch(error){text('#tpStatus',`AI assessment unavailable: ${error.message} Your session evidence and PDF export remain available.`);document.getElementById('tpRetry').hidden=false;}
    finally{busy=false;}
  }
  function download(audit){
    try{const pdf=globalThis.SecondOrderFinalPdf;if(!pdf)throw new Error('PDF generator did not load. Reload this page and retry.');pdf.download(currentModel,envelope,currentEvidence,audit);text('#tpDownloadStatus',audit?'Full evidence audit downloaded.':'Four-page summary downloaded.');}
    catch(error){text('#tpDownloadStatus',error.message);}
  }
  function activate(){
    const panel=document.getElementById('sessionReportPanel');if(!panel||panel.classList.contains('hidden'))return;
    const state=read();if(!state||!globalThis.SecondOrderAiEvidence)return;
    const same=currentState?.createdAt===state.createdAt;
    if(same&&document.getElementById('turningPointReview'))return;
    if(!same){envelope=null;handled='';selectedEvent=null;}
    currentState=state;currentEvidence=SecondOrderAiEvidence.build(state);currentEvidence.performanceSnapshots=snapshots(state);
    model();text('#tpStatus',aiMode?'Preparing the optional AI assessment.':'Standard simulation · no AI API usage.');
    if(aiMode)requestAssessment();
  }
  const panel=document.getElementById('sessionReportPanel'),content=document.getElementById('sessionReportContent');
  if(panel)new MutationObserver(activate).observe(panel,{attributes:true,attributeFilter:['class']});
  if(content)new MutationObserver(activate).observe(content,{childList:true});
  activate();
})();
