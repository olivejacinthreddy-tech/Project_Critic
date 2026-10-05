import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Search,
  CheckCircle,
  Lightbulb,
  DollarSign,
  Scale,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function LandingPage({ onNavigate, onLoadSample }) {
  const steps = [
    {
      num: '01',
      title: 'Research Agent',
      desc: 'Scans academic databases and existing repositories to benchmark prior art and classify novelty level.',
      color: 'var(--pastel-sky)',
      icon: <Search size={22} style={{ color: 'var(--pastel-sky)' }} />
    },
    {
      num: '02',
      title: 'Technology Agent',
      desc: 'Recommends production-grade yet student-accessible frontend, backend, database and AI stacks with justifications.',
      color: 'var(--pastel-lavender)',
      icon: <Cpu size={22} style={{ color: 'var(--pastel-lavender)' }} />
    },
    {
      num: '03',
      title: 'Feasibility Agent',
      desc: 'Evaluates technical, time, skill, resource, and AI feasibility with granular 1–10 scores in simple language.',
      color: 'var(--pastel-mint)',
      icon: <CheckCircle size={22} style={{ color: 'var(--pastel-mint)' }} />
    },
    {
      num: '04',
      title: 'Originality Agent',
      desc: 'Flags academic clichés and identifies concrete, high-impact features to make your proposal standout.',
      color: 'var(--pastel-peach)',
      icon: <Lightbulb size={22} style={{ color: 'var(--pastel-peach)' }} />
    },
    {
      num: '05',
      title: 'Cost & Complexity Agent',
      desc: 'Estimates development timelines, student budget ranges, cloud free tiers, and system difficulty.',
      color: 'var(--pastel-rose)',
      icon: <DollarSign size={22} style={{ color: 'var(--pastel-rose)' }} />
    },
    {
      num: '06',
      title: 'Critic Agent',
      desc: 'Synthesizes all multi-agent findings, conducts SWOT analysis, and issues an authoritative final verdict.',
      color: 'var(--pastel-lilac)',
      icon: <Scale size={22} style={{ color: 'var(--pastel-lilac)' }} />
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '3rem' }}>
      {/* Hero Section with Pastel Aura */}
      <section style={{ textAlign: 'center', paddingTop: '3.5rem', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <span className="badge badge-pastel-lavender" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            <Sparkles size={14} />
            Autonomous Multi-Agent AI System
          </span>
          <span className="badge badge-pastel-mint" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
            College Minor Project
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            maxWidth: '920px',
            margin: '0 auto 1.5rem auto',
            letterSpacing: '-0.03em',
            lineHeight: 1.15
          }}
        >
          Transform Your Project Idea Into An{' '}
          <span className="gradient-text">Award-Winning</span> Capstone
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '720px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6
          }}
        >
          Don’t guess what your project guide or viva examiners will say. Deploy 6 specialized AI agents to rigorously analyze originality, tech stack feasibility, complexity, and risks before you write a single line of code.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('new-analysis')}
            className="btn-primary btn-lg"
          >
            <span>Analyze Your Project Idea</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => onLoadSample('sample-smart-campus')}
            className="btn-secondary btn-lg"
          >
            <Sparkles size={18} style={{ color: 'var(--pastel-lavender)' }} />
            <span>Try Sample: AI Campus Assistant</span>
          </button>
        </div>

        {/* Feature Highlights Ticker */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2.5rem',
            marginTop: '3.5rem',
            flexWrap: 'wrap',
            color: 'var(--text-muted)',
            fontSize: '0.88rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} style={{ color: 'var(--pastel-mint)' }} />
            <span>Zero Generic Chatbot Responses</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} style={{ color: 'var(--pastel-sky)' }} />
            <span>Granular 1–10 Dimension Scores</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} style={{ color: 'var(--pastel-lavender)' }} />
            <span>PDF Export for Viva Dossiers</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} style={{ color: 'var(--pastel-rose)' }} />
            <span>Side-by-Side Idea Comparison</span>
          </div>
        </div>
      </section>

      {/* Multi-Agent Architecture Section */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-pastel-lavender" style={{ marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Agentic AI Workflow
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            How The 6 Specialized Agents Collaborate
          </h2>
          <p style={{ maxWidth: '640px', margin: '0.5rem auto 0 auto', color: 'var(--text-muted)' }}>
            Each agent represents a dedicated evaluation role, mimicking a committee of software engineers, university professors, and project managers.
          </p>
        </div>

        <div className="grid-3" style={{ gap: '1.5rem' }}>
          {steps.map((st) => (
            <div
              key={st.num}
              className="glass-card"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative',
                borderTop: `3px solid ${st.color}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  {st.icon}
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: st.color,
                    opacity: 0.6
                  }}
                >
                  {st.num}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  {st.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Minor Project Academic Value Proposition */}
      <section
        className="glass-card"
        style={{
          padding: '3rem',
          background: 'linear-gradient(135deg, var(--pastel-lavender-bg) 0%, var(--pastel-mint-bg) 100%)',
          border: '1px solid var(--pastel-lavender-border)'
        }}
      >
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Built For College Viva & Minor Project Submissions
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Evaluators frequently penalize student projects that duplicate common internet tutorials (like generic weather apps or standard chatbots). AI Project Critic ensures your proposal possesses clear technical differentiation, grounded architecture, and manageable scope.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('new-analysis')}
              className="btn-primary"
            >
              Start Your First Evaluation
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="btn-secondary"
            >
              Browse Previous Evaluations
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
