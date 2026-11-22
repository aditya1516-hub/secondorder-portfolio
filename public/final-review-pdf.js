(function(root){
  'use strict';
  const a=value=>Array.isArray(value)?value:[];
  const v=value=>value===null||value===undefined?'Unassessed':`${Math.round(value)}/100`;
  function engine(){if(!root.SecondOrderAssessmentPdf)throw new Error('The PDF runtime is unavailable.');return root.SecondOrderAssessmentPdf;}
  function start(doc,title,subtitle){const e=engine(),page=doc.addPage();e.addHeader(page,title,subtitle,doc.pages.length);return page;}
  function finish(doc){const e=engine();doc.pages.forEach((page,index)=>e.addFooter(page,index+1,doc.pages.length));return doc.build();}
  function label(page,title,y){const e=engine();page.text(title,42,y,8,'F2',e.COLORS.teal);}
  function paragraph(page,text,y,maxLines=4,width=510,x=42,size=9){return page.wrapped(text,x,y,width,size,1.45,'F1',engine().COLORS.body,maxLines);}
  function summary(model,envelope,evidence){
    const e=engine(),doc=new e.PdfDocument(),c=e.COLORS,report=envelope?.assessment;
    let page=start(doc,'Your simulation journey',`${model.scenario.name} | ${model.scenario.role}`);
    label(page,envelope?'AI-ASSISTED REVIEW':'STANDARD REVIEW - NO AI ASSESSMENT',103);
    paragraph(page,model.verdict.summary,122,4);
    [[`Final health`,model.health.end===null?'Unavailable':`${model.health.end}/100`],[`Decision process`,v(model.processScore)],[`Written reasoning`,v(model.capabilities.find(item=>item.id==='reasoningQuality')?.score)]].forEach(([name,score],index)=>{const x=42+index*174;page.rect(x,185,162,69,c.pale,c.line,7);page.text(name,x+12,197,8,'F2',c.ink);page.text(score,x+12,216,21,'F3',c.teal);});
    label(page,'CUMULATIVE HEALTH / 0-100',277);
    if(model.health.points.length){
      const x=progress=>65+progress/100*470,y=value=>462-value/100*155;
      [0,25,50,75,100].forEach(value=>{page.line(65,y(value),535,y(value),c.line,.5);page.text(value,44,y(value)-4,7,'F1',c.muted);});
      model.health.points.forEach((point,index)=>{const before=model.health.points[index-1];if(before)page.line(x(before.progress),y(before.value),x(point.progress),y(point.value),c.teal,2);});
      model.events.forEach((event,index)=>{page.circle(x(event.progress),y(event.value),4,c.white,c.teal);page.text(index+1,x(event.progress)-2,y(event.value)-17,7,'F2',c.navy);});
      page.text('0%',65,472,7,'F1',c.muted);page.text('Session progress',255,472,7,'F1',c.muted);page.text('100%',517,472,7,'F1',c.muted);
    }else paragraph(page,'No comparable company-state snapshots were recorded.',310);
    label(page,'MAJOR EVENTS',506);
    model.events.forEach((event,index)=>{const y=527+index*54;page.circle(51,y+8,9,c.cyan);page.text(index+1,48,y+3,7,'F2',c.teal);page.text(event.label,69,y,9,'F2',c.ink);paragraph(page,event.description,y+16,2,465,69,8);});
    if(!model.events.length)paragraph(page,'No major event has enough timing evidence for a chart marker.',530);
    paragraph(page,`Start ${model.health.start??'unavailable'} | Finish ${model.health.end??'unavailable'} | Session low ${model.health.low??'unavailable'}. Health is calculated by fixed code and is separate from the reasoning assessment.`,755,3,510,42,7.5);
    page=start(doc,'Capabilities and evidence','Rubric interpretation, coverage and limits');
    const dimensions=[...model.capabilities];
    [['commercialJudgment','Commercial judgment'],['emergencyJudgment','Emergency judgment']].forEach(([id,name])=>{const d=report?.[id];dimensions.push({label:name,score:a(d?.evidenceIds).length?d.score:null,summary:d?.analysis||'No AI assessment is available.'});});
    dimensions.forEach((item,index)=>{const y=105+index*83;page.text(item.label,42,y,9,'F2',c.ink);page.text(v(item.score),472,y,8,'F2',c.teal);page.rect(42,y+17,510,5,c.line,null,2);if(item.score!==null)page.rect(42,y+17,510*item.score/100,5,c.teal,null,2);paragraph(page,item.score===null?'Unassessed: sufficient scored evidence was not available.':item.summary,y+30,3,510,42,8);});
    const count=model.coverage;paragraph(page,`Evidence coverage: ${count.decisions} decisions, ${count.reflections} written responses (${count.reviewed} reviewed), ${count.boardroom} board questions, ${count.emergencies} emergency records.`,710,3,510,42,8);
    paragraph(page,'Fixed process weights: problem solving 20%, written reasoning 35%, second-order thinking 20%, adaptation 15%, stakeholder judgment 10%. Missing dimensions are excluded and remaining weights normalized. AI interpretation still requires assessor calibration.',752,4,510,42,7.5);
    page=start(doc,'Manual reasoning in context','A concise selection; every original response is preserved in the full audit');
    const reviews=a(report?.manualReasoningReviews),sources=a(evidence.reflections);
    const ranked=[...reviews].sort((x,y)=>x.conceptualScore-y.conceptualScore);
    const chosen=[ranked[0],ranked.at(-1),ranked.find(item=>sources.find(source=>source.evidenceId===item.reasoningEvidenceId)?.contextType==='emergency')].filter((item,index,list)=>item&&list.findIndex(other=>other?.reasoningEvidenceId===item.reasoningEvidenceId)===index);
    const cards=(chosen.length?chosen.map(review=>({source:sources.find(source=>source.evidenceId===review.reasoningEvidenceId),review})):sources.slice(0,3).map(source=>({source,review:null}))).slice(0,3);
    if(!cards.length)paragraph(page,'No participant-authored reasoning was recorded. This is missing evidence, not an automatic score of zero.',120,5);
    cards.forEach(({source,review},index)=>{
      const y=107+index*219;page.rect(42,y,510,204,c.pale,c.line,7);
      page.text(`${source.evidenceId} / ${source.linkedEvidenceId||'Unlinked'} - ${review?review.verdict.replaceAll('_',' '):'Unassessed'}`,55,y+12,8,'F2',c.teal);
      paragraph(page,`Action: ${source.selectedChoice||source.decisionTitle}. Prompt: ${source.prompt}`,y+31,2,484,55,8);
      page.text('PARTICIPANT RESPONSE - EXCERPT',55,y+61,6.8,'F2',c.muted);
      paragraph(page,source.text,y+76,3,484,55,8.5);
      paragraph(page,review?`Assessment: ${review.analysis}`:'This explanation is recorded but has not been assessed.',y+117,2,484,55,8);
      paragraph(page,review?`Next: ${review.whatWasMissing}`:'AI or faculty review is needed for a conceptual-understanding score.',y+147,2,484,55,8);
      if(review)page.text(`Concept ${review.conceptualScore} | Alignment ${review.alignmentScore} | Specificity ${review.specificityScore} | Depth ${review.technicalDepthScore}`,55,y+182,7,'F2',c.teal);
    });
    paragraph(page,'This page uses labelled excerpts to keep the summary concise. The optional full evidence-audit PDF includes every complete response, original question, linked choice, available context and returned assessment.',777,2,510,42,7);
    page=start(doc,'Your next practice','Specific priorities for another simulation');
    label(page,'WHAT WORKED',109);
    const strengths=a(report?.strengths).length?report.strengths:[model.takeaways.worked];
    strengths.slice(0,3).forEach((text,index)=>paragraph(page,`${index+1}. ${text}`,132+index*65,4,510,42,9));
    label(page,'DEVELOPMENT PRIORITIES',343);
    const priorities=a(report?.developmentPriorities).length?report.developmentPriorities:[model.takeaways.gap,model.takeaways.next];
    priorities.slice(0,3).forEach((text,index)=>paragraph(page,`${index+1}. ${text}`,366+index*70,4,510,42,9));
    label(page,'METHOD AND INTERPRETATION',595);
    paragraph(page,model.health.methodology,616,4,510,42,8);
    paragraph(page,report?.facultyNote||'Use this review as a learning aid. Standard mode does not infer conceptual understanding or personality from selected options.',675,4,510,42,8);
    paragraph(page,a(report?.limitations).join(' ')||'This report is limited to recorded simulation behavior. Missing data is unassessed; results do not establish real-world professional competence.',735,4,510,42,7.5);
    return finish(doc);
  }
  function allLines(value,size=9,width=510){
    const e=engine(),capacity=Math.max(8,Math.floor(width/(size*.55))),words=e.clean(value).split(/\s+/),lines=[];let line='';
    words.forEach(word=>{while(word.length>capacity){if(line){lines.push(line);line='';}lines.push(word.slice(0,capacity));word=word.slice(capacity);}const next=line?`${line} ${word}`:word;if(next.length>capacity){lines.push(line);line=word;}else line=next;});if(line)lines.push(line);return lines;
  }
  function audit(model,envelope,evidence){
    const e=engine(),doc=new e.PdfDocument(),c=e.COLORS;let page=null,y=0;
    const next=()=>{page=start(doc,'Complete evidence audit',`${model.scenario.name} | Original recorded session`);y=106;};next();
    function write(text,heading=false){const size=heading?10:8.5,leading=heading?16:13;allLines(text,size).forEach(line=>{if(y+leading>787)next();page.text(line,42,y,size,heading?'F2':'F1',heading?c.teal:c.body);y+=leading;});y+=heading?8:7;}
    write('SESSION AND SCORE METHOD',true);write(JSON.stringify(model.scenario));write(model.health.methodology);write(`AI assessment: ${envelope?'available':'not available'}. Reasoning reviewed: ${model.coverage.reviewed}/${model.coverage.reflections}.`);
    a(evidence.decisions).forEach(item=>{write(`${item.evidenceId} - ${item.title}`,true);write(`Time: ${item.time||'Not recorded'} | Outcome: ${item.outcome}`);write(`Options: ${a(item.optionIds).join(', ')}`);write(`Causal notes: ${a(item.causalNotes).join(' ')}`);write(`State before: ${JSON.stringify(item.stateBefore)}`);write(`State after: ${JSON.stringify(item.stateAfter)}`);write(`Impact ledger: ${JSON.stringify(item.impactLedger)}`);});
    a(evidence.reflections).forEach(item=>{write(`${item.evidenceId} - MANUAL REASONING / ${item.linkedEvidenceId||'Unlinked'}`,true);write(`Question: ${item.prompt}`);write(`Action: ${item.selectedChoice||item.decisionTitle}`);write(`Context: ${item.choiceDetails||''} ${JSON.stringify(item.emergencyContext||{})}`);write(`Original participant response: ${item.text}`);const review=a(envelope?.assessment?.manualReasoningReviews).find(record=>record.reasoningEvidenceId===item.evidenceId);if(review){write(`Assessment: ${review.analysis}`);write(`Verdict: ${review.verdict}. Concept ${review.conceptualScore}/100; alignment ${review.alignmentScore}/100; specificity ${review.specificityScore}/100; depth ${review.technicalDepthScore}/100.`);write(`What was missing: ${review.whatWasMissing}`);write(`Stronger reasoning approach: ${review.strongerReasoning}`);}else write('Assessment: Unassessed. No interpretation has been fabricated.');});
    a(evidence.boardroomInteractions).forEach(item=>{write(`${item.evidenceId} - BOARDROOM CONSULTATION`,true);write(`Question: ${item.question}`);a(item.responses).forEach(response=>write(`${response.stakeholder}: ${response.response}`));});
    a(evidence.emergencies).forEach(item=>{write(`${item.evidenceId} - EMERGENCY`,true);write(JSON.stringify(item));});
    if(envelope?.assessment){write('COMPLETE RETURNED ASSESSMENT',true);write(JSON.stringify(envelope.assessment));}
    a(evidence.eventLedger).forEach(item=>{write(`${item.evidenceId} - ${item.type}`,true);write(JSON.stringify(item));});
    return finish(doc);
  }
  function download(model,envelope,evidence,full=false){const output=full?audit(model,envelope,evidence):summary(model,envelope,evidence);const url=URL.createObjectURL(new Blob([new TextEncoder().encode(output)],{type:'application/pdf'}));const link=document.createElement('a');link.href=url;link.download=`SecondOrder-${full?'Complete-Evidence-Audit':'Four-Page-Review'}.pdf`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
  root.SecondOrderFinalPdf={summary,audit,download};
})(typeof globalThis!=='undefined'?globalThis:this);
