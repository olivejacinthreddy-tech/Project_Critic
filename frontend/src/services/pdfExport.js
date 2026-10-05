import { jsPDF } from 'jspdf';

/**
 * Generate and download a high-grade academic PDF evaluation report
 */
export function downloadProjectPDF(project) {
  if (!project) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = margin;

  // Helper for adding lines and headers
  const addHeader = (text, size = 16, color = [99, 102, 241]) => {
    if (y > 750) {
      doc.addPage();
      y = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(text, margin, y);
    y += size + 6;
  };

  const addText = (text, size = 10, isBold = false, color = [30, 41, 59]) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text || '', pageWidth - margin * 2);
    for (const line of lines) {
      if (y > 770) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += size + 4;
    }
  };

  const addDivider = () => {
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;
  };

  // Document Title Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 80, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('AI PROJECT IDEA CRITIC AGENT', margin, 36);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Autonomous Multi-Agent Evaluation & Academic Feasibility Report', margin, 54);

  y = 105;

  // Project Overview
  const title = project.projectOverview?.title || 'Project Evaluation';
  addHeader(title, 18, [15, 23, 42]);
  
  const createdDate = project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' }) : new Date().toLocaleDateString();
  addText(`Evaluation Date: ${createdDate} | Engine: Gemini AI`, 9, false, [100, 116, 139]);
  y += 6;

  // Verdict & Overall Score Box
  const score = project.scores?.overallScore || 0;
  const verdict = project.verdict || 'Evaluation Complete';

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 54, 6, 6, 'FD');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(99, 102, 241);
  doc.text(`${score} / 10`, margin + 16, y + 34);

  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`VERDICT: ${verdict.toUpperCase()}`, margin + 110, y + 25);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Complexity: ${project.agentResults?.costAndComplexity?.complexityLevel || 'Moderate'} | Est. Duration: ${project.agentResults?.costAndComplexity?.estimatedDuration || '4-6 weeks'}`, margin + 110, y + 42);

  y += 72;

  // Project Idea & Problem
  addHeader('1. Project Overview & Problem Statement', 13);
  addText(`Project Idea: ${project.projectOverview?.idea || 'N/A'}`);
  y += 4;
  if (project.projectOverview?.problemStatement) {
    addText(`Problem Solved: ${project.projectOverview.problemStatement}`);
    y += 4;
  }
  if (project.projectOverview?.targetUsers) {
    addText(`Target Users: ${project.projectOverview.targetUsers}`);
    y += 4;
  }
  addDivider();

  // Multi-Dimensional Scores
  addHeader('2. Multi-Agent Evaluation Scores', 13);
  const scores = project.scores || {};
  const scoreItems = [
    `Originality: ${scores.originality || 'N/A'}/10`,
    `Feasibility: ${scores.feasibility || 'N/A'}/10`,
    `Technical Complexity: ${scores.technicalComplexity || 'N/A'}/10`,
    `Practical Value: ${scores.practicalValue || 'N/A'}/10`,
    `AI Suitability: ${scores.aiSuitability || 'N/A'}/10`,
    `Innovation Potential: ${scores.innovationPotential || 'N/A'}/10`
  ];
  addText(scoreItems.join('   |   '), 10, true, [79, 70, 229]);
  y += 6;
  addDivider();

  // Strengths & Weaknesses
  addHeader('3. Strengths & Academic Value', 13, [16, 185, 129]);
  const strengths = project.agentResults?.critic?.strengths || [];
  strengths.forEach((s) => addText(`• ${s}`, 9.5));
  y += 6;

  addHeader('4. Weaknesses & Vulnerabilities', 13, [245, 158, 11]);
  const weaknesses = project.agentResults?.critic?.weaknesses || [];
  weaknesses.forEach((w) => addText(`• ${w}`, 9.5));
  y += 6;
  addDivider();

  // Prior Art & Uniqueness
  addHeader('5. Similarity & Differentiation Strategy', 13);
  addText(`Novelty Classification: ${project.agentResults?.research?.noveltyLevel || 'Moderately differentiated'}`, 10, true);
  if (project.agentResults?.research?.findingsSummary) {
    addText(project.agentResults.research.findingsSummary, 9.5);
    y += 4;
  }
  const angles = project.agentResults?.originality?.uniqueAngleSuggestions || [];
  if (angles.length > 0) {
    addText('Recommended Differentiation Angles:', 9.5, true);
    angles.forEach((a) => addText(`• ${a}`, 9));
  }
  y += 6;
  addDivider();

  // Recommended Tech Stack
  addHeader('6. Recommended Technology Stack', 13);
  const tech = project.agentResults?.technology || {};
  const techList = [
    `Frontend: ${tech.frontend?.name || 'React'} (${tech.frontend?.reason || ''})`,
    `Backend: ${tech.backend?.name || 'Node.js'} (${tech.backend?.reason || ''})`,
    `Database: ${tech.database?.name || 'MongoDB'} (${tech.database?.reason || ''})`,
    `AI / ML: ${tech.aiTechnologies?.name || 'Gemini API'} (${tech.aiTechnologies?.reason || ''})`,
    `Hosting: ${tech.hosting?.name || 'Vercel / Render'} (${tech.hosting?.reason || ''})`
  ];
  techList.forEach((t) => addText(t, 9));
  y += 6;
  addDivider();

  // Feature Roadmap
  addHeader('7. Feature Roadmap & Scope', 13);
  const features = project.agentResults?.critic?.recommendedFeatures || {};
  addText('Must Have (Core MVP):', 9.5, true);
  (features.mustHave || []).forEach((f) => addText(` [x] ${f}`, 9));
  y += 3;
  addText('Should Have (High Value):', 9.5, true);
  (features.shouldHave || []).forEach((f) => addText(` [ ] ${f}`, 9));
  y += 3;
  addText('Optional (Future Scope):', 9.5, true);
  (features.optional || []).forEach((f) => addText(` [ ] ${f}`, 9));
  y += 6;
  addDivider();

  // Risks & Conclusion
  addHeader('8. Key Risks & Mitigation', 13, [244, 63, 94]);
  const risks = project.agentResults?.critic?.risks || [];
  risks.forEach((r) => addText(`• ${r}`, 9));
  y += 6;

  addHeader('9. Final Academic Conclusion', 13);
  addText(project.agentResults?.critic?.conclusion || 'Project is recommended for minor project submission with proper scope management.', 9.5);
  y += 12;

  // Footer on all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${totalPages}  |  Generated by AI Project Idea Critic Agent  |  College Minor Project`, margin, 825);
  }

  // Save the PDF
  const filename = `${(project.projectOverview?.title || 'project-critique').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-evaluation.pdf`;
  doc.save(filename);
}

/**
 * Format project evaluation as clean Markdown for clipboard copy
 */
export function formatProjectMarkdown(project) {
  if (!project) return '';

  const tech = project.agentResults?.technology || {};
  const critic = project.agentResults?.critic || {};
  const scores = project.scores || {};

  return `# ${project.projectOverview?.title || 'Project Evaluation'}
**Overall Score:** ${scores.overallScore || 'N/A'}/10
**Verdict:** ${project.verdict || 'N/A'}
**Evaluated On:** ${new Date(project.createdAt || Date.now()).toLocaleDateString()}
**Engine:** Gemini AI

---

## 1. Project Overview
- **Project Idea:** ${project.projectOverview?.idea || 'N/A'}
- **Target Users:** ${project.projectOverview?.targetUsers || 'N/A'}
- **Problem Statement:** ${project.projectOverview?.problemStatement || 'N/A'}
- **Project Type:** ${project.projectOverview?.projectType || 'Web Application'}

---

## 2. Multi-Agent Evaluation Scores
- **Originality:** ${scores.originality || 'N/A'}/10
- **Feasibility:** ${scores.feasibility || 'N/A'}/10
- **Technical Complexity:** ${scores.technicalComplexity || 'N/A'}/10
- **Practical Value:** ${scores.practicalValue || 'N/A'}/10
- **AI Suitability:** ${scores.aiSuitability || 'N/A'}/10
- **Innovation Potential:** ${scores.innovationPotential || 'N/A'}/10

---

## 3. Recommended Technology Stack
- **Frontend:** ${tech.frontend?.name || 'React'} — ${tech.frontend?.reason || ''}
- **Backend:** ${tech.backend?.name || 'Node.js'} — ${tech.backend?.reason || ''}
- **Database:** ${tech.database?.name || 'MongoDB'} — ${tech.database?.reason || ''}
- **AI / ML:** ${tech.aiTechnologies?.name || 'Gemini API'} — ${tech.aiTechnologies?.reason || ''}
- **Hosting:** ${tech.hosting?.name || 'Vercel / Render'} — ${tech.hosting?.reason || ''}

---

## 4. Strengths
${(critic.strengths || []).map((s) => `- ${s}`).join('\n')}

## 5. Weaknesses & Considerations
${(critic.weaknesses || []).map((w) => `- ${w}`).join('\n')}

## 6. How to Make It Unique
${(project.agentResults?.originality?.uniqueAngleSuggestions || []).map((a) => `- ${a}`).join('\n')}

## 7. Feature Roadmap
### Must Have (MVP)
${(critic.recommendedFeatures?.mustHave || []).map((f) => `- [x] ${f}`).join('\n')}

### Should Have
${(critic.recommendedFeatures?.shouldHave || []).map((f) => `- [ ] ${f}`).join('\n')}

### Optional
${(critic.recommendedFeatures?.optional || []).map((f) => `- [ ] ${f}`).join('\n')}

---

## 8. Development & Cost Estimates
- **Complexity:** ${project.agentResults?.costAndComplexity?.complexityLevel || 'Moderate'}
- **Estimated Duration:** ${project.agentResults?.costAndComplexity?.estimatedDuration || '4-6 weeks'}
- **Estimated Cost:** ${project.agentResults?.costAndComplexity?.estimatedCostRange || '$0 - $15'}
- **Explanation:** ${project.agentResults?.costAndComplexity?.costExplanation || ''}

---

## 9. Conclusion
${critic.conclusion || ''}
`;
}
