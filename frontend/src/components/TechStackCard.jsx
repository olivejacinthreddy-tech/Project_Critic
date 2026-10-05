import React from 'react';
import { Layout, Server, Database, Brain, Globe, Shield, Cloud, Sparkles } from 'lucide-react';

export default function TechStackCard({ technology = {} }) {
  const stackItems = [
    {
      category: 'Frontend',
      name: technology.frontend?.name || 'React + Vite',
      reason: technology.frontend?.reason || 'Modern, reactive single-page app development.',
      color: 'var(--pastel-sky)',
      icon: <Layout size={18} style={{ color: 'var(--pastel-sky)' }} />
    },
    {
      category: 'Backend',
      name: technology.backend?.name || 'Node.js + Express',
      reason: technology.backend?.reason || 'Non-blocking async API layer and agent pipeline.',
      color: 'var(--pastel-mint)',
      icon: <Server size={18} style={{ color: 'var(--pastel-mint)' }} />
    },
    {
      category: 'Database',
      name: technology.database?.name || 'MongoDB (Mongoose)',
      reason: technology.database?.reason || 'Flexible NoSQL document model for agent outputs.',
      color: 'var(--pastel-peach)',
      icon: <Database size={18} style={{ color: 'var(--pastel-peach)' }} />
    },
    {
      category: 'AI / LLM Engine',
      name: technology.aiTechnologies?.name || 'Google Gemini 2.5 Flash API',
      reason: technology.aiTechnologies?.reason || 'High token speed, structured JSON generation & RAG.',
      color: 'var(--pastel-lavender)',
      icon: <Brain size={18} style={{ color: 'var(--pastel-lavender)' }} />
    },
    {
      category: 'APIs & Protocols',
      name: technology.apis?.name || 'REST APIs + Server-Sent Events',
      reason: technology.apis?.reason || 'Clean client-server contracts and real-time streaming.',
      color: 'var(--pastel-rose)',
      icon: <Globe size={18} style={{ color: 'var(--pastel-rose)' }} />
    },
    {
      category: 'Authentication',
      name: technology.authentication?.name || 'JWT Authentication',
      reason: technology.authentication?.reason || 'Stateless, safe user access control.',
      color: 'var(--pastel-lemon)',
      icon: <Shield size={18} style={{ color: 'var(--pastel-peach)' }} />
    },
    {
      category: 'Hosting & Deployment',
      name: technology.hosting?.name || 'Vercel / Render',
      reason: technology.hosting?.reason || 'Zero-cost student cloud tiers with auto GitHub CI/CD.',
      color: 'var(--pastel-sky)',
      icon: <Cloud size={18} style={{ color: 'var(--pastel-sky)' }} />
    }
  ];

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            Recommended Technology Stack
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Selected by Technology Agent for rapid student implementation and zero-cost cloud tiers.
          </p>
        </div>
        <span className="badge badge-pastel-lavender">
          Student Optimized
        </span>
      </div>

      <div className="grid-2" style={{ gap: '1rem' }}>
        {stackItems.map((item, idx) => (
          <div
            key={idx}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderLeft: `3px solid ${item.color}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {item.icon}
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {item.category}
                </span>
              </div>
            </div>

            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {item.name}
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
              {item.reason}
            </p>
          </div>
        ))}
      </div>

      {technology.optional && technology.optional.length > 0 && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            Optional Enhancements
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {technology.optional.map((opt, i) => (
              <span key={i} className="badge badge-pastel-lavender" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                <Sparkles size={12} style={{ color: 'var(--pastel-lavender)' }} />
                <strong>{opt.name}:</strong> {opt.reason}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
