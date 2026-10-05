import React from 'react';
import {
  Sparkles,
  PlusCircle,
  FileText,
  History,
  GitCompare,
  Home,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar({
  currentPage,
  onNavigate,
  theme,
  onToggleTheme,
  hasActiveProject
}) {

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: 'var(--nav-height)',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-card)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Brand with Pastel Glow */}
        <div
          onClick={() => onNavigate('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(167, 139, 250, 0.4)'
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.18rem', letterSpacing: '-0.02em' }} className="gradient-text">
                Project Critic
              </span>
              <span className="badge badge-pastel-lavender" style={{ padding: '0.15rem 0.5rem', fontSize: '0.68rem' }}>
                AGENTIC AI
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '-2px' }}>
              College Minor Project Advisor
            </div>
          </div>
        </div>

        {/* Navigation Links (Home, New Analysis, Results, History, Compare) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => onNavigate('landing')}
            className={`btn-secondary btn-sm ${currentPage === 'landing' ? 'active' : ''}`}
            style={{
              background: currentPage === 'landing' ? 'var(--pastel-lavender-bg)' : 'transparent',
              borderColor: currentPage === 'landing' ? 'var(--pastel-lavender)' : 'transparent',
              color: currentPage === 'landing' ? 'var(--pastel-lavender)' : 'var(--text-secondary)'
            }}
          >
            <Home size={16} />
            <span>Home</span>
          </button>

          <button
            onClick={() => onNavigate('new-analysis')}
            className={`btn-secondary btn-sm ${currentPage === 'new-analysis' ? 'active' : ''}`}
            style={{
              background: currentPage === 'new-analysis' ? 'var(--pastel-lavender-bg)' : 'transparent',
              borderColor: currentPage === 'new-analysis' ? 'var(--pastel-lavender)' : 'transparent',
              color: currentPage === 'new-analysis' ? 'var(--pastel-lavender)' : 'var(--text-secondary)'
            }}
          >
            <PlusCircle size={16} />
            <span>New Analysis</span>
          </button>

          {hasActiveProject && (
            <button
              onClick={() => onNavigate('report')}
              className={`btn-secondary btn-sm ${currentPage === 'report' ? 'active' : ''}`}
              style={{
                background: currentPage === 'report' ? 'var(--pastel-lavender-bg)' : 'transparent',
                borderColor: currentPage === 'report' ? 'var(--pastel-lavender)' : 'transparent',
                color: currentPage === 'report' ? 'var(--pastel-lavender)' : 'var(--text-secondary)'
              }}
            >
              <FileText size={16} />
              <span>Results</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('history')}
            className={`btn-secondary btn-sm ${currentPage === 'history' ? 'active' : ''}`}
            style={{
              background: currentPage === 'history' ? 'var(--pastel-lavender-bg)' : 'transparent',
              borderColor: currentPage === 'history' ? 'var(--pastel-lavender)' : 'transparent',
              color: currentPage === 'history' ? 'var(--pastel-lavender)' : 'var(--text-secondary)'
            }}
          >
            <History size={16} />
            <span>History</span>
          </button>

          <button
            onClick={() => onNavigate('compare')}
            className={`btn-secondary btn-sm ${currentPage === 'compare' ? 'active' : ''}`}
            style={{
              background: currentPage === 'compare' ? 'var(--pastel-lavender-bg)' : 'transparent',
              borderColor: currentPage === 'compare' ? 'var(--pastel-lavender)' : 'transparent',
              color: currentPage === 'compare' ? 'var(--pastel-lavender)' : 'var(--text-secondary)'
            }}
          >
            <GitCompare size={16} />
            <span>Compare</span>
          </button>
        </nav>

        {/* Right Controls: Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}
