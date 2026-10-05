import React from 'react';
import { CheckSquare, ListOrdered, Sparkles, AlertCircle } from 'lucide-react';

export default function FeatureRoadmapCard({ features = {} }) {
  const mustHave = features.mustHave || [];
  const shouldHave = features.shouldHave || [];
  const optional = features.optional || [];

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ListOrdered size={20} style={{ color: 'var(--accent-primary)' }} />
          <span>Feature Prioritization Roadmap</span>
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Scoped by the Critic Agent into high-impact deliverables for college project milestones.
        </p>
      </div>

      <div className="grid-3" style={{ gap: '1.25rem' }}>
        {/* Must Have (Core MVP) */}
        <div
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent-emerald)' }}>
              Must Have (Core MVP)
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
              Phase 1
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Essential for passing the initial project viva.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
            {mustHave.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)'
                }}
              >
                <CheckSquare size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0, marginTop: '2px' }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Should Have (Differentiators) */}
        <div
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent-primary)' }}>
              Should Have (High Value)
            </span>
            <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
              Phase 2
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Differentiates the system from basic CRUD assignments.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
            {shouldHave.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)'
                }}
              >
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '3px',
                    border: '1px solid var(--accent-primary)',
                    flexShrink: 0,
                    marginTop: '3px'
                  }}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Optional (Stretch Goals) */}
        <div
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Optional (Stretch Goals)
            </span>
            <span className="badge badge-slate" style={{ fontSize: '0.7rem' }}>
              Phase 3
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Impressive add-ons if time permits.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
            {optional.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)'
                }}
              >
                <Sparkles size={15} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
