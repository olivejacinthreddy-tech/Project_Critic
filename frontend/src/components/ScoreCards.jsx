import React from 'react';
import { Lightbulb, Wrench, Layers, HeartHandshake, Cpu, Rocket } from 'lucide-react';

export default function ScoreCards({ scores = {} }) {
  const metrics = [
    {
      key: 'originality',
      label: 'Originality',
      score: scores.originality || 7.5,
      color: 'var(--pastel-peach)',
      icon: <Lightbulb size={20} style={{ color: 'var(--pastel-peach)' }} />,
      desc: 'Distinctiveness vs common student project patterns'
    },
    {
      key: 'feasibility',
      label: 'Feasibility',
      score: scores.feasibility || 8.0,
      color: 'var(--pastel-mint)',
      icon: <Wrench size={20} style={{ color: 'var(--pastel-mint)' }} />,
      desc: 'Achievability within academic semester constraints'
    },
    {
      key: 'technicalComplexity',
      label: 'Technical Complexity',
      score: scores.technicalComplexity || 7.0,
      color: 'var(--pastel-lavender)',
      icon: <Layers size={20} style={{ color: 'var(--pastel-lavender)' }} />,
      desc: 'Engineering depth & architectural sophistication'
    },
    {
      key: 'practicalValue',
      label: 'Practical Value',
      score: scores.practicalValue || 8.2,
      color: 'var(--pastel-sky)',
      icon: <HeartHandshake size={20} style={{ color: 'var(--pastel-sky)' }} />,
      desc: 'Real-world utility & end-user problem resolution'
    },
    {
      key: 'aiSuitability',
      label: 'AI Suitability',
      score: scores.aiSuitability || 8.5,
      color: 'var(--pastel-lilac)',
      icon: <Cpu size={20} style={{ color: 'var(--pastel-lilac)' }} />,
      desc: 'Natural fit for GenAI / ML without over-engineering'
    },
    {
      key: 'innovationPotential',
      label: 'Innovation Potential',
      score: scores.innovationPotential || 7.8,
      color: 'var(--pastel-rose)',
      icon: <Rocket size={20} style={{ color: 'var(--pastel-rose)' }} />,
      desc: 'Capacity for follow-on publication or capstone scaling'
    }
  ];

  return (
    <div className="grid-3">
      {metrics.map((m) => {
        const scoreVal = Number(m.score);
        const pct = Math.min(100, Math.max(0, (scoreVal / 10) * 100));

        return (
          <div
            key={m.key}
            className="glass-card"
            style={{
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.75rem',
              borderTop: `3px solid ${m.color}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    padding: '0.45rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {m.icon}
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{m.label}</span>
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  fontFamily: 'var(--font-heading)',
                  color: m.color
                }}
              >
                {scoreVal.toFixed(1)}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  /10
                </span>
              </span>
            </div>

            {/* Visual Bar with Pastel Glow */}
            <div
              style={{
                width: '100%',
                height: '7px',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: m.color,
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 1s ease-out'
                }}
              />
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {m.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
