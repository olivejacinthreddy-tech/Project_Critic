import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="btn-secondary btn-sm"
      style={{
        borderRadius: 'var(--radius-full)',
        padding: '0.45rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px'
      }}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle Color Theme"
    >
      {theme === 'dark' ? (
        <Sun size={18} style={{ color: '#f59e0b' }} />
      ) : (
        <Moon size={18} style={{ color: '#6366f1' }} />
      )}
    </button>
  );
}
