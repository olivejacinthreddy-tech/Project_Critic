import React, { useState } from 'react';
import {
  Download,
  Copy,
  PlusCircle,
  GitCompare,
  Share2,
  CheckCircle2,
  Calendar,
  Layers,
  Users,
  Target,
  FileText,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge.jsx';
import ScoreCards from '../components/ScoreCards.jsx';
import TechStackCard from '../components/TechStackCard.jsx';
import FeatureRoadmapCard from '../components/FeatureRoadmapCard.jsx';
import SwotCards from '../components/SwotCards.jsx';
import RiskCard from '../components/RiskCard.jsx';
import { downloadProjectPDF, formatProjectMarkdown } from '../services/pdfExport.js';

export default function ReportDashboardPage({
  project,
  onNewAnalysis,
  onCompare,
  onShowToast
}) {
  const [copied, setCopied] = useState(false);

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>No Active Evaluation Report</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
          Please submit a project idea to view its evaluation dashboard.
        </p>
        <button onClick={onNewAnalysis} className="btn-primary">
          Start Analysis
        </button>
      </div>
    );
  }

  const overview = project.projectOverview || {};
  const scores = project.scores || {};
  const agentResults = project.agentResults || {};
  const critic = agentResults.critic || {};
  const research = agentResults.research || {};
  const originality = agentResults.originality || {};
  const tech = agentResults.technology || {};
  const cost = agentResults.costAndComplexity || {};

  const handleDownloadPDF = () => {
    try {
      downloadProjectPDF(project);
      onShowToast?.({
        type: 'success',
        message: 'Evaluation report PDF downloaded successfully!'
      });
    } catch (err) {
      console.error('[PDF Export Error]:', err);
      onShowToast?.({
        type: 'error',
        message: 'Could not generate PDF. Please try again.'
      });
    }
  };

  const handleCopyReport = async () => {
    try {
      const md = formatProjectMarkdown(project);
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      onShowToast?.({
        type: 'success',
        message: 'Complete evaluation copied to clipboard in Markdown format!'
      });
    } catch (err) {
      onShowToast?.({
        type: 'error',
        message: 'Clipboard copy failed. Please select text manually.'
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '4rem' }}>
      {/* Top Action Bar */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <span className="badge badge-pastel-mint" style={{ marginBottom: '0.35rem' }}>
            Analysis Complete ✓
          </span>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Evaluated on{' '}
            {new Date(project.createdAt || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>

        {/* Buttons: Download PDF, Copy Report, Compare, Analyze Another */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={handleDownloadPDF} className="btn-primary btn-sm">
            <Download size={16} />
            <span>Download Report (PDF)</span>
          </button>

          <button onClick={handleCopyReport} className="btn-secondary btn-sm">
            {copied ? <CheckCircle2 size={16} style={{ color: 'var(--pastel-mint)' }} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy Report'}</span>
          </button>

          <button onClick={() => onCompare?.(project._id)} className="btn-secondary btn-sm">
            <GitCompare size={16} />
            <span>Compare Idea</span>
          </button>

          <button onClick={onNewAnalysis} className="btn-outline btn-sm">
            <PlusCircle size={16} />
            <span>Analyze Another Idea</span>
          </button>
        </div>
      </div>

      {/* Main Overview Grid: Project Info & Circular Score Gauge */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '1.5rem',
          alignItems: 'stretch'
        }}
      >
        {/* Left: Project Overview */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem', borderTop: '3px solid var(--pastel-lavender)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-pastel-lavender">{overview.projectType || 'Web Application'}</span>
              <span className="badge badge-slate">Team: {overview.teamSize || '1-3'}</span>
              <span className="badge badge-slate">Level: {overview.skillLevel || 'Intermediate'}</span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              {overview.title || 'Untitled Project'}
            </h1>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {overview.idea}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            {overview.problemStatement && (
              <div style={{ fontSize: '0.88rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Problem Solved: </span>
                <span style={{ color: 'var(--text-secondary)' }}>{overview.problemStatement}</span>
              </div>
            )}
            {overview.targetUsers && (
              <div style={{ fontSize: '0.88rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Target Users: </span>
                <span style={{ color: 'var(--text-secondary)' }}>{overview.targetUsers}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Large Score Gauge & Verdict */}
        <ScoreGauge score={scores.overallScore || 8.0} verdict={project.verdict} />
      </div>

      {/* Individual Scores (6 Dimensional Cards) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>
            Multi-Dimensional Agent Evaluation Scores
          </h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Scored on 1.0 – 10.0 scale
          </span>
        </div>
        <ScoreCards scores={scores} />
      </div>

      {/* SWOT & Differentiation Cards (Strengths, Weaknesses, Existing Solutions, How To Make Unique) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>
            Strategic Critique & Uniqueness Blueprint
          </h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Research & Originality Agent Synthesis
          </span>
        </div>
        <SwotCards
          strengths={critic.strengths || []}
          weaknesses={critic.weaknesses || []}
          noveltyLevel={research.noveltyLevel || 'Moderately differentiated'}
          similarSolutions={research.commonSolutions || []}
          uniqueAngleSuggestions={originality.uniqueAngleSuggestions || []}
        />
      </div>

      {/* Recommended Technology Stack */}
      <TechStackCard technology={tech} />

      {/* Feature Prioritization Roadmap (Must Have, Should Have, Optional) */}
      <FeatureRoadmapCard features={critic.recommendedFeatures || {}} />

      {/* Risk Assessment, Cost, Complexity, and Final Verdict Conclusion */}
      <RiskCard
        complexity={cost.complexityLevel || 'Moderate'}
        duration={cost.estimatedDuration || overview.timeline || '4-6 weeks'}
        cost={cost.estimatedCostRange || '$0 - $15'}
        costExplanation={cost.costExplanation}
        risks={critic.risks || []}
        conclusion={critic.conclusion}
      />
    </div>
  );
}
