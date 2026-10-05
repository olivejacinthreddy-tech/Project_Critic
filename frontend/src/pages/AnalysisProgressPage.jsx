import React from 'react';
import AgentPipelineVisualizer from '../components/AgentPipelineVisualizer.jsx';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function AnalysisProgressPage({
  projectInput = {},
  currentStep = 1,
  agentStates = {},
  error = null,
  onRetry
}) {
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span className="badge badge-indigo">
            <Sparkles size={14} className="animate-spin" />
            Step 2 of 3: Live Agent Orchestration
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Agents Evaluating "{projectInput.title || 'Your Project Idea'}"
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Please wait while our 6 specialized AI agents perform multi-angle evaluation.
        </p>
      </div>

      {/* Error Callout if any */}
      {error && (
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            marginBottom: '1.5rem',
            borderColor: 'var(--accent-rose)',
            background: 'var(--accent-rose-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={22} style={{ color: 'var(--accent-rose)' }} />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--accent-rose)' }}>
                Analysis Encountered An Error
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                {error}
              </div>
            </div>
          </div>
          {onRetry && (
            <button onClick={onRetry} className="btn-primary btn-sm">
              Retry Analysis
            </button>
          )}
        </div>
      )}

      {/* Visual Pipeline */}
      <AgentPipelineVisualizer currentStep={currentStep} agentStates={agentStates} />

      {/* Footer Info Pill */}
      <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
          <Loader2 size={14} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
          <span>Generating verified evaluation dossier with citations and score calibration</span>
        </div>
      </div>
    </div>
  );
}
