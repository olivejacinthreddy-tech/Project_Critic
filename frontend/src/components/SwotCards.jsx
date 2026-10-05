import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, Compass } from 'lucide-react';

export default function SwotCards({
  strengths = [],
  weaknesses = [],
  noveltyLevel = '',
  similarSolutions = [],
  uniqueAngleSuggestions = []
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 2-Column: Strengths vs Weaknesses */}
      <div className="grid-2">
        {/* Strengths with Pastel Mint */}
        <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--pastel-mint)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--pastel-mint-bg)' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--pastel-mint)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                Why This Project Is Good
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Identified academic and technical strengths
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {strengths.map((str, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--pastel-mint)', fontWeight: 700 }}>•</span>
                <span style={{ color: 'var(--text-primary)' }}>{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses with Pastel Peach */}
        <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--pastel-peach)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--pastel-peach-bg)' }}>
              <AlertTriangle size={18} style={{ color: 'var(--pastel-peach)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                Problems / Weaknesses
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Potential academic critique points to address
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {weaknesses.map((wk, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--pastel-peach)', fontWeight: 700 }}>•</span>
                <span style={{ color: 'var(--text-primary)' }}>{wk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column: Existing Parallels vs How To Make It Unique */}
      <div className="grid-2">
        {/* Similarity / Existing Solutions with Pastel Sky */}
        <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--pastel-sky)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Compass size={20} style={{ color: 'var(--pastel-sky)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                Similarity & Existing Solutions
              </h3>
            </div>
            {noveltyLevel && (
              <span className="badge badge-pastel-sky" style={{ fontSize: '0.75rem' }}>
                Novelty: {noveltyLevel}
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            The Research Agent mapped the following commercial and academic parallels:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {similarSolutions.map((sol, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-elevated)',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {sol}
              </div>
            ))}
          </div>
        </div>

        {/* How To Make It Unique with Pastel Lavender */}
        <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--pastel-lavender)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--pastel-lavender-bg)' }}>
              <Lightbulb size={18} style={{ color: 'var(--pastel-lavender)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                How To Make It Unique
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Originality Agent's actionable differentiation ideas
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {uniqueAngleSuggestions.map((tip, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--pastel-lavender)', fontWeight: 700 }}>→</span>
                <span style={{ color: 'var(--text-primary)' }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
