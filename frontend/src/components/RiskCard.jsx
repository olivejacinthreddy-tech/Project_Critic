import React from 'react';
import { AlertOctagon, Clock, DollarSign, Activity, FileCheck2 } from 'lucide-react';

export default function RiskCard({
  complexity = 'Moderate',
  duration = '4-6 weeks',
  cost = '$0 - $15',
  costExplanation = '',
  risks = [],
  conclusion = ''
}) {
  const getComplexityBadge = (c) => {
    switch (c) {
      case 'Easy':
        return 'badge-pastel-mint';
      case 'Moderate':
        return 'badge-pastel-lavender';
      case 'Difficult':
        return 'badge-pastel-peach';
      default:
        return 'badge-pastel-lavender';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 3 Metric Summary Boxes with Pastel Touches */}
      <div className="grid-3">
        {/* Complexity */}
        <div className="glass-card" style={{ padding: '1.25rem', borderTop: '3px solid var(--pastel-lavender)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Activity size={18} style={{ color: 'var(--pastel-lavender)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Project Complexity
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{complexity}</span>
            <span className={`badge ${getComplexityBadge(complexity)}`}>{complexity} Tier</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Calibrated for college minor project scope
          </p>
        </div>

        {/* Estimated Duration */}
        <div className="glass-card" style={{ padding: '1.25rem', borderTop: '3px solid var(--pastel-sky)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Clock size={18} style={{ color: 'var(--pastel-sky)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Estimated Duration
            </span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {duration}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Full development, integration & testing
          </p>
        </div>

        {/* Estimated Cost */}
        <div className="glass-card" style={{ padding: '1.25rem', borderTop: '3px solid var(--pastel-mint)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <DollarSign size={18} style={{ color: 'var(--pastel-mint)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Estimated Cost
            </span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pastel-mint)' }}>
            {cost}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            {costExplanation || 'Actual costs depend on API usage & hosting'}
          </p>
        </div>
      </div>

      {/* Risks & Limitations with Pastel Rose */}
      <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--pastel-rose)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--pastel-rose-bg)' }}>
            <AlertOctagon size={18} style={{ color: 'var(--pastel-rose)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Risks and Limitations
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Execution hazards to address before academic viva
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {risks.map((r, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--pastel-rose)', fontWeight: 700 }}>⚠</span>
              <span style={{ color: 'var(--text-primary)' }}>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Final Recommendation & Conclusion with Pastel Glow */}
      {conclusion && (
        <div
          className="glass-card"
          style={{
            padding: '1.75rem',
            background: 'linear-gradient(135deg, var(--pastel-lavender-bg) 0%, var(--pastel-rose-bg) 100%)',
            border: '1px solid var(--pastel-lavender-border)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <FileCheck2 size={20} style={{ color: 'var(--pastel-lavender)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              Critic Agent's Final Recommendation & Conclusion
            </h3>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {conclusion}
          </p>
        </div>
      )}
    </div>
  );
}
