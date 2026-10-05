import React from 'react';
import {
  Search,
  Cpu,
  CheckCircle2,
  Clock,
  Lightbulb,
  DollarSign,
  Scale,
  FileCheck,
  Loader2,
  Check
} from 'lucide-react';

export default function AgentPipelineVisualizer({ currentStep = 1, agentStates = {} }) {
  const agents = [
    {
      id: 1,
      name: 'Research Agent',
      desc: 'Analyzing prior art, similar platforms, and novelty classification',
      icon: <Search size={18} />
    },
    {
      id: 2,
      name: 'Technology Agent',
      desc: 'Recommending modern, accessible frontend, backend & AI stack',
      icon: <Cpu size={18} />
    },
    {
      id: 3,
      name: 'Feasibility Agent',
      desc: 'Scoring technical, time, skill, resource & AI feasibility',
      icon: <Clock size={18} />
    },
    {
      id: 4,
      name: 'Originality Agent',
      desc: 'Detecting cliches & finding unique differentiation angles',
      icon: <Lightbulb size={18} />
    },
    {
      id: 5,
      name: 'Cost & Complexity Agent',
      desc: 'Estimating development duration, student budget & complexity',
      icon: <DollarSign size={18} />
    },
    {
      id: 6,
      name: 'Critic Agent',
      desc: 'Synthesizing all agent reports, SWOT analysis & final verdict',
      icon: <Scale size={18} />
    }
  ];

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Autonomous Agent Pipeline</span>
            <span className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>
              6 Specialized Agents
            </span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Each agent executes sequentially, passing validated structured findings to subsequent evaluation stages.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Step {Math.min(currentStep, 6)} of 6
          </span>
          <div
            style={{
              width: '120px',
              height: '8px',
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${(Math.min(currentStep, 6) / 6) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #10b981)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {agents.map((agent, index) => {
          const state = agentStates[agent.id] || {};
          const isCurrent = currentStep === agent.id;
          const isDone = currentStep > agent.id || state.status === 'completed';
          const isPending = currentStep < agent.id && !state.status;

          return (
            <div
              key={agent.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: isCurrent
                  ? 'rgba(99, 102, 241, 0.08)'
                  : isDone
                  ? 'var(--bg-card)'
                  : 'rgba(15, 23, 42, 0.4)',
                border: isCurrent
                  ? '1px solid var(--accent-primary)'
                  : isDone
                  ? '1px solid rgba(16, 185, 129, 0.25)'
                  : '1px solid var(--border-subtle)',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Step indicator / Icon */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: isDone
                    ? 'rgba(16, 185, 129, 0.15)'
                    : isCurrent
                    ? 'rgba(99, 102, 241, 0.2)'
                    : 'var(--bg-elevated)',
                  color: isDone
                    ? 'var(--accent-emerald)'
                    : isCurrent
                    ? 'var(--accent-primary)'
                    : 'var(--text-muted)'
                }}
              >
                {isDone ? (
                  <Check size={20} style={{ strokeWidth: 3 }} />
                ) : isCurrent ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  agent.icon
                )}
              </div>

              {/* Main Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isDone ? 'var(--text-primary)' : isCurrent ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                      {agent.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      • Agent {agent.id}
                    </span>
                  </div>

                  {/* Status Pill */}
                  <div>
                    {isDone ? (
                      <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                        <CheckCircle2 size={12} />
                        Completed ✓
                      </span>
                    ) : isCurrent ? (
                      <span className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>
                        <Loader2 size={12} className="animate-spin" />
                        Analyzing...
                      </span>
                    ) : (
                      <span className="badge badge-slate" style={{ fontSize: '0.75rem' }}>
                        Queued
                      </span>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {agent.desc}
                </p>

                {/* Concise Findings Badge if completed or running */}
                {state.message && (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-elevated)',
                      fontSize: '0.8rem',
                      color: isDone ? 'var(--text-secondary)' : 'var(--text-primary)',
                      borderLeft: `3px solid ${isDone ? 'var(--accent-emerald)' : 'var(--accent-primary)'}`
                    }}
                  >
                    {state.message}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
