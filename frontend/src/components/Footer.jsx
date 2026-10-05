import React from 'react';
import { Cpu, ShieldCheck, Database, Sparkles, BookOpen } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer
      style={{
        marginTop: '5rem',
        borderTop: '1px solid var(--border-card)',
        background: 'var(--bg-secondary)',
        padding: '3rem 0 2rem 0'
      }}
    >
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <Sparkles size={20} style={{ color: 'var(--pastel-lavender)' }} />
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>AI Project Critic</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              An Agentic AI minor project evaluation platform built for engineering students. Deploys 6 specialized AI agents to analyze originality, feasibility, technology choices, and academic risks.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Agent Architecture
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>• Research Agent (Prior Art)</li>
              <li>• Technology Agent (Stack)</li>
              <li>• Feasibility Agent (5 Dimensions)</li>
              <li>• Originality Agent (Novelty Score)</li>
              <li>• Cost & Complexity Agent</li>
              <li>• Critic Agent (Final Verdict)</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>
                <button onClick={() => onNavigate('landing')} style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
                  Home / Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('new-analysis')} style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
                  New Project Analysis
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('history')} style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
                  Project History & Archives
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compare')} style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
                  Side-by-Side Comparison
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              College Minor Project
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
              Designed to satisfy university viva requirements for Generative AI & Autonomous Agent pair-programming.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-pastel-lavender" style={{ fontSize: '0.72rem' }}>Node.js / Express</span>
              <span className="badge badge-pastel-sky" style={{ fontSize: '0.72rem' }}>React + Vite</span>
              <span className="badge badge-pastel-mint" style={{ fontSize: '0.72rem' }}>Gemini 2.5 Flash</span>
              <span className="badge badge-pastel-peach" style={{ fontSize: '0.72rem' }}>MongoDB / FileStore</span>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-card)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            © {new Date().getFullYear()} AI Project Idea Critic Agent — Production Minor Project Release.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Real-time Multi-Agent Pipeline</span>
            <span>Structured JSON Schema</span>
            <span>Zero-Lockin Database Adapter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
