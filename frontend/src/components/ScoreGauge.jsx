import React from 'react';
import { Award, CheckCircle2, AlertTriangle, AlertOctagon, XCircle } from 'lucide-react';

export default function ScoreGauge({ score = 8.0, verdict = 'Recommended with Improvements' }) {
  const normalized = Math.min(10, Math.max(0, Number(score)));
  const percentage = (normalized / 10) * 100;
  
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Verdict config with pastel tones
  const getVerdictConfig = (v) => {
    switch (v) {
      case 'Highly Recommended':
        return {
          color: 'var(--pastel-mint)',
          bgBadge: 'badge-pastel-mint',
          icon: <CheckCircle2 size={16} />
        };
      case 'Recommended with Improvements':
        return {
          color: 'var(--pastel-lavender)',
          bgBadge: 'badge-pastel-lavender',
          icon: <Award size={16} />
        };
      case 'Needs Major Changes':
        return {
          color: 'var(--pastel-peach)',
          bgBadge: 'badge-pastel-peach',
          icon: <AlertTriangle size={16} />
        };
      case 'Not Recommended':
        return {
          color: 'var(--pastel-rose)',
          bgBadge: 'badge-pastel-rose',
          icon: <XCircle size={16} />
        };
      default:
        return {
          color: 'var(--pastel-lavender)',
          bgBadge: 'badge-pastel-lavender',
          icon: <Award size={16} />
        };
    }
  };

  const config = getVerdictConfig(verdict);

  return (
    <div
      className="glass-card"
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-25px',
          right: '-25px',
          width: '130px',
          height: '130px',
          background: `radial-gradient(circle, var(--pastel-lavender-bg) 0%, transparent 70%)`,
          pointerEvents: 'none'
        }}
      />

      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
        Overall Evaluation Score
      </span>

      {/* Circular Pastel Gauge */}
      <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background Track */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="var(--bg-elevated)"
            strokeWidth="12"
          />
          {/* Progress Arc with Pastel Color */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke={config.color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </svg>

        {/* Center Score Display */}
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '2.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', lineHeight: 1 }}>
            {normalized.toFixed(1)}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '3px' }}>
            OUT OF 10
          </span>
        </div>
      </div>

      {/* Verdict Badge */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Project Verdict
        </div>
        <span className={`badge ${config.bgBadge}`} style={{ fontSize: '0.95rem', padding: '0.45rem 1.15rem', fontWeight: 700 }}>
          {config.icon}
          <span>{verdict}</span>
        </span>
      </div>
    </div>
  );
}
