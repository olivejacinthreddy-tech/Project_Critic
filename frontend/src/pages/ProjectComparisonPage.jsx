import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  Trophy,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Wrench,
  Layers,
  DollarSign,
  Cpu,
  Eye,
  PlusCircle,
  Loader2
} from 'lucide-react';
import { api } from '../services/api.js';

export default function ProjectComparisonPage({
  initialProjectAId = null,
  initialProjectBId = null,
  onViewProject,
  onNewAnalysis,
  onShowToast
}) {
  const [allProjects, setAllProjects] = useState([]);
  const [projectAId, setProjectAId] = useState(initialProjectAId || '');
  const [projectBId, setProjectBId] = useState(initialProjectBId || '');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  // Load project list
  useEffect(() => {
    async function loadProjects() {
      try {
        const list = await api.getProjects();
        setAllProjects(list || []);

        // Pre-select if we have at least 2 and none selected
        if (!projectAId && list.length > 0) {
          setProjectAId(list[0]._id);
        }
        if (!projectBId && list.length > 1) {
          setProjectBId(list[1]._id);
        }
      } catch (err) {
        console.error('[Comparison Load Error]:', err);
      } finally {
        setLoadingList(false);
      }
    }
    loadProjects();
  }, []);

  // Run comparison when IDs change
  useEffect(() => {
    if (projectAId && projectBId && projectAId !== projectBId) {
      handleRunComparison(projectAId, projectBId);
    } else {
      setComparison(null);
    }
  }, [projectAId, projectBId]);

  const handleRunComparison = async (idA, idB) => {
    setLoading(true);
    try {
      const result = await api.compareProjects(idA, idB);
      setComparison(result);
    } catch (err) {
      console.error('[Compare Run Error]:', err);
      onShowToast?.({
        type: 'error',
        message: err.message || 'Failed to compare projects.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = projectAId;
    setProjectAId(projectBId);
    setProjectBId(temp);
  };

  const projA = comparison?.projectA;
  const projB = comparison?.projectB;
  const metrics = comparison?.metrics || {};

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span className="badge badge-indigo">
            <GitCompare size={14} />
            Side-by-Side Evaluation
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Project Idea Comparison Matrix
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Compare two evaluated software concepts across originality, feasibility, tech complexity, and student cost.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="glass-card" style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
          {/* Project A Select */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Project A
            </label>
            <select
              value={projectAId}
              onChange={(e) => setProjectAId(e.target.value)}
              disabled={loadingList || allProjects.length === 0}
            >
              {allProjects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.projectOverview?.title || 'Untitled'} ({p.scores?.overallScore}/10)
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div style={{ paddingTop: '1.2rem', textAlign: 'center' }}>
            <button
              onClick={handleSwap}
              className="btn-secondary"
              title="Swap Projects"
              style={{ borderRadius: 'var(--radius-full)', padding: '0.6rem' }}
            >
              <ArrowRightLeft size={16} />
            </button>
          </div>

          {/* Project B Select */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-secondary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Project B
            </label>
            <select
              value={projectBId}
              onChange={(e) => setProjectBId(e.target.value)}
              disabled={loadingList || allProjects.length < 2}
            >
              {allProjects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.projectOverview?.title || 'Untitled'} ({p.scores?.overallScore}/10)
                </option>
              ))}
            </select>
          </div>
        </div>

        {allProjects.length < 2 && !loadingList && (
          <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            You need at least 2 evaluated projects in your history to run comparisons.
            <button onClick={onNewAnalysis} className="btn-outline btn-sm" style={{ marginLeft: '0.75rem' }}>
              <PlusCircle size={14} />
              <span>Analyze Another Project</span>
            </button>
          </div>
        )}
      </div>

      {/* Comparison Body */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-primary)', margin: '0 auto 1rem auto' }} />
          <p style={{ color: 'var(--text-muted)' }}>Calculating comparative score differences...</p>
        </div>
      ) : projA && projB ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Comparative Winner Banner */}
          <div
            className="glass-card"
            style={{
              padding: '1.5rem 2rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.08) 100%)',
              border: '1px solid var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-emerald-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-emerald)'
                }}
              >
                <Trophy size={26} />
              </div>
              <div>
                <span className="badge badge-emerald" style={{ marginBottom: '0.2rem' }}>
                  Higher Evaluator Rating
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  Winner: {metrics.overallWinner}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Leads by {metrics.scoreDiff} points on the 10-point academic rubric.
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', maxWidth: '420px', lineHeight: 1.4 }}>
              {comparison.comparativeSummary}
            </p>
          </div>

          {/* Side by Side Project Summary Cards */}
          <div className="grid-2">
            {/* Project A Card */}
            <div className="glass-card" style={{ padding: '1.75rem', borderTop: '4px solid var(--accent-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-indigo">Project A</span>
                <span className="badge badge-slate">{projA.verdict}</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                {projA.projectOverview?.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {projA.projectOverview?.idea}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {projA.scores?.overallScore}/10
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>OVERALL SCORE</div>
                </div>
                <button onClick={() => onViewProject(projA._id)} className="btn-secondary btn-sm">
                  <Eye size={14} />
                  <span>View Full Report</span>
                </button>
              </div>
            </div>

            {/* Project B Card */}
            <div className="glass-card" style={{ padding: '1.75rem', borderTop: '4px solid var(--accent-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-indigo">Project B</span>
                <span className="badge badge-slate">{projB.verdict}</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                {projB.projectOverview?.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {projB.projectOverview?.idea}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                    {projB.scores?.overallScore}/10
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>OVERALL SCORE</div>
                </div>
                <button onClick={() => onViewProject(projB._id)} className="btn-secondary btn-sm">
                  <Eye size={14} />
                  <span>View Full Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Metric By Metric Comparison Table */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              Granular Metric Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Row: Originality */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1fr',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-elevated)',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Originality Score</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Novelty & differentiation</div>
                </div>
                <div style={{ fontWeight: 800, color: metrics.originalityComparison?.higher === 'A' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                  {projA.scores?.originality}/10 {metrics.originalityComparison?.higher === 'A' && '★'}
                </div>
                <div style={{ fontWeight: 800, color: metrics.originalityComparison?.higher === 'B' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                  {projB.scores?.originality}/10 {metrics.originalityComparison?.higher === 'B' && '★'}
                </div>
              </div>

              {/* Row: Feasibility */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1fr',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-elevated)',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Feasibility Score</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Technical & timeline practicality</div>
                </div>
                <div style={{ fontWeight: 800, color: metrics.feasibilityComparison?.higher === 'A' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                  {projA.scores?.feasibility}/10 {metrics.feasibilityComparison?.higher === 'A' && '★'}
                </div>
                <div style={{ fontWeight: 800, color: metrics.feasibilityComparison?.higher === 'B' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                  {projB.scores?.feasibility}/10 {metrics.feasibilityComparison?.higher === 'B' && '★'}
                </div>
              </div>

              {/* Row: Technical Complexity */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1fr',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-elevated)',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Complexity Level</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>System implementation challenge</div>
                </div>
                <div style={{ fontWeight: 700 }}>
                  {metrics.complexityComparison?.projectA}
                </div>
                <div style={{ fontWeight: 700 }}>
                  {metrics.complexityComparison?.projectB}
                </div>
              </div>

              {/* Row: Estimated Cost */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1fr',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-elevated)',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Estimated Cost</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Student infrastructure expenditure</div>
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {metrics.costComparison?.projectA}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {metrics.costComparison?.projectB}
                </div>
              </div>

              {/* Row: AI Suitability */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1fr',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-elevated)',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>AI Suitability</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Natural GenAI integration depth</div>
                </div>
                <div style={{ fontWeight: 800, color: metrics.aiSuitabilityComparison?.higher === 'A' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                  {projA.scores?.aiSuitability}/10 {metrics.aiSuitabilityComparison?.higher === 'A' && '★'}
                </div>
                <div style={{ fontWeight: 800, color: metrics.aiSuitabilityComparison?.higher === 'B' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                  {projB.scores?.aiSuitability}/10 {metrics.aiSuitabilityComparison?.higher === 'B' && '★'}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
