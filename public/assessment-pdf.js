(function initSecondOrderAssessmentPdf(global) {
  "use strict";

  const PAGE = { width: 595.28, height: 841.89, margin: 42 };
  const COLORS = {
    navy: [0.039, 0.169, 0.314],
    teal: [0.031, 0.498, 0.549],
    cyan: [0.902, 0.965, 0.961],
    pale: [0.965, 0.985, 0.985],
    ink: [0.102, 0.224, 0.337],
    body: [0.302, 0.416, 0.482],
    muted: [0.478, 0.576, 0.616],
    line: [0.820, 0.902, 0.906],
    white: [1, 1, 1],
    coral: [0.788, 0.365, 0.247],
    amber: [0.682, 0.475, 0.137],
    green: [0.110, 0.557, 0.486],
  };

  function safeArray(value) { return Array.isArray(value) ? value : []; }
  function clean(value) {
    return String(value == null ? "" : value)
      .replace(/[\u2010-\u2015]/g, "-")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201c\u201d]/g, '"')
      .replace(/[^\x20-\x7E\n]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function esc(value) { return clean(value).replace(/([\\()])/g, "\\$1"); }
  function rgb(color) { return `${color[0]} ${color[1]} ${color[2]}`; }
  function wrap(text, size, width) {
    const words = clean(text).split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    const capacity = Math.max(8, Math.floor(width / (size * 0.51)));
    words.forEach((word) => {
      const next = line ? `${line} ${word}` : word;
      if (next.length <= capacity) line = next;
      else {
        if (line) lines.push(line);
        line = word.length > capacity ? `${word.slice(0, capacity - 1)}-` : word;
      }
    });
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  }

  class PdfPage {
    constructor() { this.commands = []; }
    rect(x, top, width, height, fill, stroke = null, radius = 0) {
      const y = PAGE.height - top - height;
      if (fill) this.commands.push(`${rgb(fill)} rg`);
      if (stroke) this.commands.push(`${rgb(stroke)} RG 0.7 w`);
      if (radius > 0) {
        const r = Math.min(radius, width / 2, height / 2);
        const k = 0.5522848 * r;
        const x2 = x + width; const y2 = y + height;
        this.commands.push(`${x + r} ${y} m ${x2 - r} ${y} l ${x2 - r + k} ${y} ${x2} ${y + r - k} ${x2} ${y + r} c ${x2} ${y2 - r} l ${x2} ${y2 - r + k} ${x2 - r + k} ${y2} ${x2 - r} ${y2} c ${x + r} ${y2} l ${x + r - k} ${y2} ${x} ${y2 - r + k} ${x} ${y2 - r} c ${x} ${y + r} l ${x} ${y + r - k} ${x + r - k} ${y} ${x + r} ${y} c`);
      } else this.commands.push(`${x} ${y} ${width} ${height} re`);
      this.commands.push(fill && stroke ? "B" : fill ? "f" : "S");
    }
    line(x1, top1, x2, top2, color = COLORS.line, width = 0.7) {
      this.commands.push(`${rgb(color)} RG ${width} w ${x1} ${PAGE.height - top1} m ${x2} ${PAGE.height - top2} l S`);
    }
    text(value, x, top, size = 9, font = "F1", color = COLORS.body) {
      this.commands.push(`BT /${font} ${size} Tf ${rgb(color)} rg 1 0 0 1 ${x} ${PAGE.height - top - size} Tm (${esc(value)}) Tj ET`);
    }
    wrapped(value, x, top, width, size = 9, leading = 1.4, font = "F1", color = COLORS.body, maxLines = 100) {
      const lines = wrap(value, size, width).slice(0, maxLines);
      lines.forEach((line, index) => this.text(line, x, top + index * size * leading, size, font, color));
      return top + lines.length * size * leading;
    }
    circle(cx, topCenter, radius, fill, stroke = null) {
      const cy = PAGE.height - topCenter;
      const k = 0.5522848 * radius;
      if (fill) this.commands.push(`${rgb(fill)} rg`);
      if (stroke) this.commands.push(`${rgb(stroke)} RG 0.7 w`);
      this.commands.push(`${cx + radius} ${cy} m ${cx + radius} ${cy + k} ${cx + k} ${cy + radius} ${cx} ${cy + radius} c ${cx - k} ${cy + radius} ${cx - radius} ${cy + k} ${cx - radius} ${cy} c ${cx - radius} ${cy - k} ${cx - k} ${cy - radius} ${cx} ${cy - radius} c ${cx + k} ${cy - radius} ${cx + radius} ${cy - k} ${cx + radius} ${cy} c ${fill && stroke ? "B" : fill ? "f" : "S"}`);
    }
    stream() { return this.commands.join("\n"); }
  }

  class PdfDocument {
    constructor() { this.pages = []; }
    addPage() { const page = new PdfPage(); this.pages.push(page); return page; }
    build() {
      const objects = [];
      objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
      objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
      objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
      objects[5] = "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>";
      const kids = [];
      this.pages.forEach((page, index) => {
        const pageId = 6 + index * 2;
        const streamId = pageId + 1;
        const stream = page.stream();
        kids.push(`${pageId} 0 R`);
        objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE.width} ${PAGE.height}] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${streamId} 0 R >>`;
        objects[streamId] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
      });
      objects[2] = `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${this.pages.length} >>`;
      let output = "%PDF-1.4\n";
      const offsets = [0];
      for (let i = 1; i < objects.length; i += 1) {
        offsets[i] = output.length;
        output += `${i} 0 obj\n${objects[i]}\nendobj\n`;
      }
      const xref = output.length;
      output += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
      for (let i = 1; i < objects.length; i += 1) output += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
      output += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
      return output;
    }
  }

  function addHeader(page, title, subtitle, pageNumber) {
    page.rect(0, 0, PAGE.width, 78, COLORS.navy);
    page.rect(0, 78, PAGE.width, 4, COLORS.teal);
    page.text("SECONDORDER", PAGE.margin, 20, 8, "F2", COLORS.cyan);
    page.text(title, PAGE.margin, 35, 20, "F3", COLORS.white);
    page.text(subtitle, PAGE.margin, 61, 7.5, "F1", [0.75, 0.87, 0.89]);
    page.text(String(pageNumber).padStart(2, "0"), PAGE.width - PAGE.margin - 16, 34, 11, "F2", COLORS.white);
  }

  function addFooter(page, pageNumber, totalPages) {
    page.line(PAGE.margin, 810, PAGE.width - PAGE.margin, 810);
    page.text("Evidence-bound AI assessment - simulation behavior, not personality", PAGE.margin, 818, 6.5, "F1", COLORS.muted);
    page.text(`${pageNumber} / ${totalPages}`, PAGE.width - PAGE.margin - 28, 818, 6.5, "F2", COLORS.teal);
  }

  function scoreBar(page, label, score, x, top, width) {
    page.text(label, x, top, 7.2, "F2", COLORS.ink);
    page.text(`${score}/100`, x + width - 38, top, 7.2, "F2", COLORS.teal);
    page.rect(x, top + 14, width, 6, [0.90, 0.94, 0.95], null, 3);
    page.rect(x, top + 14, Math.max(2, width * Math.max(0, Math.min(100, Number(score) || 0)) / 100), 6, COLORS.teal, null, 3);
  }

  function metricAverage(value) {
    const numbers = [];
    const visit = (item) => {
      if (Number.isFinite(Number(item)) && typeof item !== "boolean") numbers.push(Number(item));
      else if (item && typeof item === "object") Object.values(item).forEach(visit);
    };
    visit(value);
    return numbers.length ? numbers.reduce((sum, item) => sum + item, 0) / numbers.length : NaN;
  }

  function performanceSeries(session) {
    const decisions = safeArray(session.decisions);
    const values = [];
    if (decisions.length) {
      const start = metricAverage(decisions[0].stateBefore);
      if (Number.isFinite(start)) values.push(start);
      decisions.forEach((decision) => {
        const value = metricAverage(decision.stateAfter);
        if (Number.isFinite(value)) values.push(value);
      });
    }
    if (!values.length) values.push(Number(session.deterministicAssessment?.score || 0));
    return values.map((value) => Math.max(0, Math.min(100, value)));
  }

  function lineChart(page, values, x, top, width, height) {
    [0, 25, 50, 75, 100].forEach((value) => {
      const y = top + height - value * height / 100;
      page.line(x, y, x + width, y, COLORS.line, 0.5);
      page.text(String(value), x - 20, y - 3, 5.5, "F1", COLORS.muted);
    });
    const points = values.map((value, index) => ({
      x: values.length === 1 ? x + width / 2 : x + index * width / (values.length - 1),
      y: top + height - value * height / 100,
    }));
    points.slice(1).forEach((point, index) => page.line(points[index].x, points[index].y, point.x, point.y, COLORS.teal, 2));
    points.forEach((point, index) => {
      page.circle(point.x, point.y, 4, index === points.length - 1 ? COLORS.navy : COLORS.white, COLORS.teal);
      page.text(index ? `D${index}` : "Start", point.x - 8, top + height + 10, 5.5, "F1", COLORS.muted);
    });
  }

  function buildAssessmentPdf(envelope, evidence) {
    const report = envelope && envelope.assessment ? envelope.assessment : envelope;
    if (!report) throw new Error("Assessment data is unavailable.");
    const session = evidence || {};
    const doc = new PdfDocument();
    const dimensions = [
      ["Strategic reasoning", report.strategicReasoning],
      ["Second-order thinking", report.secondOrderThinking],
      ["Commercial judgment", report.commercialJudgment],
      ["Emergency judgment", report.emergencyJudgment],
      ["Stakeholder awareness", report.stakeholderAwareness],
      ["Reflective quality", report.reflectiveQuality],
    ];

    let page = doc.addPage();
    page.rect(0, 0, PAGE.width, PAGE.height, COLORS.pale);
    page.rect(0, 0, PAGE.width, 250, COLORS.navy);
    page.rect(0, 250, PAGE.width, 6, COLORS.teal);
    page.text("SECONDORDER", PAGE.margin, 44, 10, "F2", COLORS.cyan);
    page.text("FINAL ASSESSMENT REPORT", PAGE.margin, 78, 27, "F3", COLORS.white);
    page.wrapped(session.scenario?.name || "Strategic simulation", PAGE.margin, 118, 420, 12, 1.35, "F1", [0.79, 0.90, 0.91], 2);
    page.text(`Role: ${session.scenario?.role || "Participant"}`, PAGE.margin, 162, 8.5, "F1", COLORS.white);
    page.text(`Generated: ${new Date(envelope.generatedAt || Date.now()).toLocaleDateString()}`, PAGE.margin, 180, 8.5, "F1", COLORS.white);
    page.circle(482, 135, 54, COLORS.white);
    page.text(String(report.overallReasoningScore), 452, 105, 30, "F3", COLORS.navy);
    page.text("/ 100", 466, 145, 9, "F2", COLORS.teal);
    page.text("REASONING SCORE", 440, 166, 6.5, "F2", COLORS.navy);
    page.text("EXECUTIVE VERDICT", PAGE.margin, 292, 8, "F2", COLORS.teal);
    page.wrapped(report.executiveSummary, PAGE.margin, 316, PAGE.width - PAGE.margin * 2, 11, 1.55, "F1", COLORS.ink, 10);
    page.rect(PAGE.margin, 474, PAGE.width - PAGE.margin * 2, 104, COLORS.cyan, COLORS.line, 10);
    page.text("SESSION SNAPSHOT", PAGE.margin + 18, 492, 7.2, "F2", COLORS.teal);
    const snapshot = [
      ["Recorded decisions", session.session?.recordedDecisionCount || safeArray(session.decisions).length],
      ["Board consultations", safeArray(session.boardroomInteractions).length],
      ["Emergency records", safeArray(session.emergencies).length],
      ["Reflections", safeArray(session.reflections).length],
    ];
    snapshot.forEach(([label, value], index) => {
      const x = PAGE.margin + 18 + index * 126;
      page.text(String(value), x, 520, 18, "F3", COLORS.navy);
      page.text(label, x, 548, 6.7, "F1", COLORS.body);
    });
    page.text("ASSESSMENT BOUNDARY", PAGE.margin, 620, 7.2, "F2", COLORS.teal);
    page.wrapped("This report interprets recorded simulation choices, reasoning, emergency handling, and boardroom interactions. Deterministic outcomes remain authoritative. It does not assess personality or real-world professional fitness.", PAGE.margin, 642, PAGE.width - PAGE.margin * 2, 9, 1.5, "F1", COLORS.body, 6);

    page = doc.addPage();
    addHeader(page, "Competency Profile", "Evidence-linked reasoning dimensions", 2);
    let y = 112;
    dimensions.forEach(([label, dimension], index) => {
      const col = index % 2; const row = Math.floor(index / 2);
      const x = PAGE.margin + col * 258; const top = y + row * 190;
      page.rect(x, top, 244, 168, COLORS.white, COLORS.line, 9);
      scoreBar(page, label, dimension?.score || 0, x + 14, top + 16, 216);
      page.wrapped(dimension?.analysis || "Behavior not observed.", x + 14, top + 48, 216, 7.5, 1.45, "F1", COLORS.body, 7);
      page.text(`Evidence: ${safeArray(dimension?.evidenceIds).join(", ") || "not observed"}`, x + 14, top + 145, 6.3, "F1", COLORS.muted);
    });

    page = doc.addPage();
    addHeader(page, "Performance and Decision Insight", "A visual reconstruction of the simulation trajectory", 3);
    const series = performanceSeries(session);
    page.text("PERFORMANCE OVER TIME", PAGE.margin, 112, 7.5, "F2", COLORS.teal);
    page.rect(PAGE.margin, 136, 510, 252, COLORS.white, COLORS.line, 10);
    lineChart(page, series, PAGE.margin + 42, 174, 438, 148);
    page.text("Each point represents the combined recorded company position after a decision.", PAGE.margin + 18, 354, 7, "F1", COLORS.muted);
    const insightCards = [
      ["DECISIONS", safeArray(session.decisions).length, "Recorded choices"],
      ["DECISION QUALITY", Math.round(Number(session.deterministicAssessment?.score || 0)), "Deterministic /100"],
      ["EMERGENCY JUDGMENT", Math.round(Number(report.emergencyJudgment?.score || 0)), "AI reasoning /100"],
      ["BOARDROOM QUALITY", Math.round(Number(report.stakeholderAwareness?.score || 0)), "AI reasoning /100"],
    ];
    insightCards.forEach(([label, value, note], index) => {
      const x = PAGE.margin + (index % 2) * 258;
      const cardTop = 420 + Math.floor(index / 2) * 104;
      page.rect(x, cardTop, 244, 88, index === 0 ? COLORS.cyan : COLORS.pale, COLORS.line, 9);
      page.text(label, x + 14, cardTop + 14, 6.7, "F2", COLORS.teal);
      page.text(String(value), x + 14, cardTop + 34, 24, "F3", COLORS.navy);
      page.text(note, x + 72, cardTop + 45, 6.7, "F1", COLORS.body);
    });
    const outcomeMix = session.deterministicAssessment?.outcomeMix || {};
    const success = Number(outcomeMix.success || 0); const partial = Number(outcomeMix.partial || 0); const failure = Number(outcomeMix.failure || 0);
    const totalOutcomes = Math.max(1, success + partial + failure);
    page.text("OUTCOME MIX", PAGE.margin, 646, 7.5, "F2", COLORS.teal);
    page.rect(PAGE.margin, 670, 510, 16, [0.90, 0.94, 0.95], null, 8);
    let outcomeX = PAGE.margin;
    [[success, COLORS.green], [partial, COLORS.amber], [failure, COLORS.coral]].forEach(([count, color]) => {
      const segment = 510 * count / totalOutcomes;
      if (segment > 0) page.rect(outcomeX, 670, segment, 16, color);
      outcomeX += segment;
    });
    page.text(`${success} successful`, PAGE.margin, 700, 7, "F2", COLORS.green);
    page.text(`${partial} partial`, PAGE.margin + 170, 700, 7, "F2", COLORS.amber);
    page.text(`${failure} failed`, PAGE.margin + 340, 700, 7, "F2", COLORS.coral);

    const decisionPages = Math.max(1, Math.ceil(safeArray(session.decisions).length / 7));
    for (let batch = 0; batch < decisionPages; batch += 1) {
      page = doc.addPage();
      addHeader(page, batch ? "Decision Journey - Continued" : "Decision Journey", "Chronological choices, trade-offs, and consequences", 4 + batch);
      let top = 108;
      safeArray(session.decisions).slice(batch * 7, batch * 7 + 7).forEach((decision, index) => {
        page.circle(58, top + 20, 14, index % 2 ? COLORS.cyan : COLORS.teal);
        page.text(clean(decision.evidenceId || `D${batch * 7 + index + 1}`), 48, top + 14, 7, "F2", index % 2 ? COLORS.teal : COLORS.white);
        page.text(decision.title || "Decision", 84, top + 5, 9, "F2", COLORS.ink);
        page.text(`${decision.time || "Time not recorded"} | ${clean(decision.outcome || "Unknown")} | Risk ${Number(decision.risk || 0)}/100`, 84, top + 22, 6.6, "F1", COLORS.muted);
        const notes = safeArray(decision.causalNotes).concat(safeArray(decision.impactLedger).slice(0, 1));
        page.wrapped(notes.join(" ") || "No causal note was recorded for this decision.", 84, top + 40, 452, 7.1, 1.4, "F1", COLORS.body, 5);
        page.line(84, top + 88, 536, top + 88);
        top += 96;
      });
    }

    page = doc.addPage();
    addHeader(page, "Pivotal Moments and Reflection", "Where the trajectory changed and how reasoning was articulated", 4 + decisionPages);
    y = 110;
    page.text("PIVOTAL MOMENTS", PAGE.margin, y, 7.5, "F2", COLORS.teal); y += 22;
    safeArray(report.keyMoments).forEach((moment, index) => {
      page.rect(PAGE.margin, y, PAGE.width - PAGE.margin * 2, 90, index === 0 ? COLORS.cyan : COLORS.white, COLORS.line, 9);
      page.text(moment.evidenceId, PAGE.margin + 14, y + 13, 7, "F2", COLORS.teal);
      page.text(moment.title, PAGE.margin + 54, y + 13, 8.5, "F2", COLORS.ink);
      page.wrapped(moment.interpretation, PAGE.margin + 14, y + 36, PAGE.width - PAGE.margin * 2 - 28, 7.5, 1.45, "F1", COLORS.body, 5);
      y += 102;
    });
    y += 4; page.text("RECORDED REFLECTIONS", PAGE.margin, y, 7.5, "F2", COLORS.teal); y += 22;
    if (!safeArray(session.reflections).length) page.wrapped("No participant-authored reflection was recorded. The assessment therefore cannot verify the reasoning behind selected actions.", PAGE.margin, y, PAGE.width - PAGE.margin * 2, 8.5, 1.5, "F1", COLORS.body);
    safeArray(session.reflections).slice(0, 4).forEach((reflection) => {
      page.rect(PAGE.margin, y, PAGE.width - PAGE.margin * 2, 70, COLORS.pale, COLORS.line, 8);
      page.text(`${reflection.evidenceId} - ${reflection.decisionTitle || "Decision"}`, PAGE.margin + 12, y + 12, 7, "F2", COLORS.ink);
      page.wrapped(reflection.text, PAGE.margin + 12, y + 31, PAGE.width - PAGE.margin * 2 - 24, 7.1, 1.4, "F1", COLORS.body, 4);
      y += 80;
    });

    const manualReviews = safeArray(report.manualReasoningReviews);
    const reflectionMap = new Map(safeArray(session.reflections).map((item) => [item.evidenceId, item]));
    const reasoningPages = Math.max(1, Math.ceil(manualReviews.length / 2));
    for (let batch = 0; batch < reasoningPages; batch += 1) {
      page = doc.addPage();
      addHeader(page, batch ? "Manual Reasoning Review - Continued" : "Manual Reasoning Review", "Participant-authored logic compared with the selected choice and recorded context", 5 + decisionPages + batch);
      let reviewTop = 108;
      if (!manualReviews.length) {
        page.rect(PAGE.margin, reviewTop, 510, 112, COLORS.pale, COLORS.line, 10);
        page.text("NO MANUAL REASONING RECORDED", PAGE.margin + 16, reviewTop + 18, 7.5, "F2", COLORS.coral);
        page.wrapped(report.manualReasoningSummary || "The participant did not provide authored reasoning, so conceptual alignment could not be assessed.", PAGE.margin + 16, reviewTop + 44, 478, 8.2, 1.5, "F1", COLORS.body, 6);
      }
      manualReviews.slice(batch * 2, batch * 2 + 2).forEach((review) => {
        const reflection = reflectionMap.get(review.reasoningEvidenceId) || {};
        const weak = ["weak", "unrelated", "insufficient"].includes(review.verdict);
        const accent = weak ? COLORS.coral : review.verdict === "partially_aligned" ? COLORS.amber : COLORS.green;
        page.rect(PAGE.margin, reviewTop, 510, 304, COLORS.white, COLORS.line, 10);
        page.rect(PAGE.margin, reviewTop, 5, 304, accent, null, 3);
        page.text(`${review.reasoningEvidenceId} linked to ${review.linkedEvidenceId}`, PAGE.margin + 16, reviewTop + 14, 6.5, "F2", COLORS.teal);
        page.text(clean(String(review.verdict || "insufficient").replace(/_/g, " ").toUpperCase()), PAGE.margin + 404, reviewTop + 14, 6.4, "F2", accent);
        page.text(reflection.selectedChoice || reflection.decisionTitle || "Recorded choice", PAGE.margin + 16, reviewTop + 34, 9, "F2", COLORS.ink);
        page.text("PARTICIPANT RESPONSE", PAGE.margin + 16, reviewTop + 58, 6.2, "F2", COLORS.teal);
        page.wrapped(reflection.text || "No response text was recorded.", PAGE.margin + 16, reviewTop + 76, 478, 7.4, 1.35, "F1", COLORS.body, 3);
        const scoreRows = [
          ["Concept", review.conceptualScore], ["Choice alignment", review.alignmentScore],
          ["Specificity", review.specificityScore], ["Technical depth", review.technicalDepthScore],
        ];
        scoreRows.forEach(([label, value], index) => {
          const col = index % 2; const row = Math.floor(index / 2);
          scoreBar(page, label, value, PAGE.margin + 16 + col * 247, reviewTop + 122 + row * 34, 225);
        });
        page.text("ASSESSMENT", PAGE.margin + 16, reviewTop + 198, 6.2, "F2", COLORS.teal);
        page.wrapped(review.analysis, PAGE.margin + 16, reviewTop + 215, 225, 6.7, 1.35, "F1", COLORS.body, 4);
        page.text("WHAT WAS MISSING", PAGE.margin + 263, reviewTop + 198, 6.2, "F2", COLORS.coral);
        page.wrapped(review.whatWasMissing, PAGE.margin + 263, reviewTop + 215, 231, 6.7, 1.35, "F1", COLORS.body, 4);
        page.text("STRONGER REASONING APPROACH", PAGE.margin + 16, reviewTop + 266, 6.2, "F2", COLORS.green);
        page.wrapped(review.strongerReasoning, PAGE.margin + 150, reviewTop + 263, 344, 6.7, 1.35, "F1", COLORS.body, 3);
        reviewTop += 318;
      });
    }

    page = doc.addPage();
    addHeader(page, "Emergency and Boardroom Review", "How pressure was handled and consultation was used", 5 + decisionPages + reasoningPages);
    y = 110;
    page.text("EMERGENCY HANDLING", PAGE.margin, y, 7.5, "F2", COLORS.teal); y += 20;
    const emergencies = safeArray(session.emergencies);
    if (!emergencies.length) { page.wrapped("No emergency response evidence was recorded in this run.", PAGE.margin, y, 510, 8.5); y += 42; }
    emergencies.slice(0, 3).forEach((item) => {
      page.rect(PAGE.margin, y, 510, 82, COLORS.white, COLORS.line, 8);
      page.text(`${item.evidenceId || "E"} - ${item.title || "Emergency"}`, PAGE.margin + 12, y + 12, 8, "F2", COLORS.ink);
      page.wrapped(item.resolution || item.brief || "Resolution was not recorded.", PAGE.margin + 12, y + 33, 486, 7.2, 1.4, "F1", COLORS.body, 5);
      y += 92;
    });
    y += 6; page.text("BOARDROOM INTERACTIONS", PAGE.margin, y, 7.5, "F2", COLORS.teal); y += 20;
    const interactions = safeArray(session.boardroomInteractions);
    if (!interactions.length) page.wrapped("The participant did not use the boardroom consultation during this run.", PAGE.margin, y, 510, 8.5);
    interactions.slice(0, 4).forEach((item) => {
      page.rect(PAGE.margin, y, 510, 96, COLORS.cyan, COLORS.line, 8);
      page.text(`${item.evidenceId || "B"} - Question`, PAGE.margin + 12, y + 12, 7, "F2", COLORS.teal);
      page.wrapped(item.question || "No question recorded.", PAGE.margin + 12, y + 30, 486, 7.8, 1.4, "F2", COLORS.ink, 3);
      const stakeholderLine = safeArray(item.responses).slice(0, 2).map((response) => `${response.stakeholder}: ${response.response}`).join(" | ");
      page.wrapped(stakeholderLine || "No response recorded.", PAGE.margin + 12, y + 61, 486, 6.5, 1.35, "F1", COLORS.body, 3);
      y += 106;
    });

    page = doc.addPage();
    addHeader(page, "Evidence and Outcome Snapshot", "Deterministic results and traceable source records", 6 + decisionPages + reasoningPages);
    y = 112;
    page.text("DETERMINISTIC OUTCOME", PAGE.margin, y, 7.5, "F2", COLORS.teal); y += 22;
    const deterministic = session.deterministicAssessment || {};
    page.rect(PAGE.margin, y, 510, 92, COLORS.cyan, COLORS.line, 10);
    page.text(String(Math.round(Number(deterministic.score || 0))), PAGE.margin + 18, y + 20, 26, "F3", COLORS.navy);
    page.text("/ 100 deterministic decision quality", PAGE.margin + 64, y + 33, 8, "F2", COLORS.teal);
    const mix = deterministic.outcomeMix || {};
    page.text(`Outcomes: ${Number(mix.success || 0)} successful | ${Number(mix.partial || 0)} partial | ${Number(mix.failure || 0)} failed`, PAGE.margin + 18, y + 63, 7.3, "F1", COLORS.body);
    y += 118;
    page.text("FINAL METRIC SNAPSHOT", PAGE.margin, y, 7.5, "F2", COLORS.teal); y += 20;
    const metricRows = [];
    Object.entries(deterministic.finalMetrics || {}).forEach(([group, values]) => {
      Object.entries(values && typeof values === "object" ? values : {}).forEach(([key, value]) => {
        if (Number.isFinite(Number(value)) && metricRows.length < 12) metricRows.push([`${group} / ${key}`, Math.round(Number(value))]);
      });
    });
    if (!metricRows.length) metricRows.push(["Final metrics", "Not recorded"]);
    metricRows.forEach(([label, value], index) => {
      const col = index % 2; const row = Math.floor(index / 2);
      const x = PAGE.margin + col * 258; const top = y + row * 38;
      page.rect(x, top, 244, 30, COLORS.white, COLORS.line, 6);
      page.text(label, x + 9, top + 9, 6.5, "F1", COLORS.body);
      page.text(String(value), x + 203, top + 8, 7.5, "F2", COLORS.navy);
    });
    y += Math.ceil(metricRows.length / 2) * 38 + 16;
    page.text("EVIDENCE INDEX", PAGE.margin, y, 7.5, "F2", COLORS.teal); y += 20;
    const evidenceIndex = [
      ...safeArray(session.decisions).map((item) => `${item.evidenceId}: Decision - ${item.title || "recorded choice"}`),
      ...safeArray(session.reflections).map((item) => `${item.evidenceId}: Reflection - ${item.decisionTitle || "participant reasoning"}`),
      ...safeArray(session.emergencies).map((item) => `${item.evidenceId}: Emergency - ${item.title || "pressure event"}`),
      ...safeArray(session.boardroomInteractions).map((item) => `${item.evidenceId}: Boardroom - ${item.question || "consultation"}`),
    ];
    if (!evidenceIndex.length) evidenceIndex.push("No source evidence identifiers were recorded.");
    evidenceIndex.slice(0, 18).forEach((item, index) => {
      const col = index % 2; const row = Math.floor(index / 2);
      const x = PAGE.margin + col * 258; const top = y + row * 31;
      page.text("-", x, top, 7, "F2", COLORS.teal);
      page.wrapped(item, x + 11, top, 226, 6.6, 1.35, "F1", COLORS.body, 2);
    });

    page = doc.addPage();
    addHeader(page, "Development Plan", "What to retain, change, and practise next", 7 + decisionPages + reasoningPages);
    y = 112;
    [["STRENGTHS TO RETAIN", report.strengths, COLORS.green], ["DEVELOPMENT PRIORITIES", report.developmentPriorities, COLORS.coral]].forEach(([title, items, accent]) => {
      page.text(title, PAGE.margin, y, 7.5, "F2", accent); y += 20;
      safeArray(items).forEach((item, index) => {
        page.circle(PAGE.margin + 8, y + 7, 7, accent);
        page.text(String(index + 1), PAGE.margin + 5.4, y + 2.5, 6, "F2", COLORS.white);
        y = page.wrapped(item, PAGE.margin + 24, y, 480, 8.2, 1.45, "F1", COLORS.body, 5) + 12;
      });
      y += 12;
    });
    page.rect(PAGE.margin, y, 510, 118, COLORS.cyan, COLORS.line, 10);
    page.text("FACULTY NOTE", PAGE.margin + 16, y + 15, 7.2, "F2", COLORS.teal);
    page.wrapped(report.facultyNote, PAGE.margin + 16, y + 38, 478, 8, 1.5, "F1", COLORS.ink, 7);
    y += 140;
    page.text("ASSESSMENT LIMITATIONS", PAGE.margin, y, 7.5, "F2", COLORS.teal); y += 18;
    safeArray(report.limitations).forEach((item) => { page.text("-", PAGE.margin, y, 8, "F2", COLORS.teal); y = page.wrapped(item, PAGE.margin + 13, y, 495, 7.4, 1.45, "F1", COLORS.body, 4) + 7; });

    const total = doc.pages.length;
    doc.pages.forEach((item, index) => addFooter(item, index + 1, total));
    return doc.build();
  }

  function download(envelope, evidence, filename = "SecondOrder-Final-Assessment.pdf") {
    const output = buildAssessmentPdf(envelope, evidence);
    const bytes = new TextEncoder().encode(output);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  const api = { buildAssessmentPdf, download, PdfDocument, PAGE, COLORS, addHeader, addFooter, lineChart, clean, wrap };
  global.SecondOrderAssessmentPdf = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
