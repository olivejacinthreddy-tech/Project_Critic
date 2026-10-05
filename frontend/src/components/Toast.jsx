import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const icons = {
    success: <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />,
    error: <AlertCircle size={18} style={{ color: 'var(--accent-rose)' }} />,
    info: <Info size={18} style={{ color: 'var(--accent-primary)' }} />
  };

  const bgStyles = {
    success: 'rgba(16, 185, 129, 0.15)',
    error: 'rgba(244, 63, 94, 0.15)',
    info: 'rgba(99, 102, 241, 0.15)'
  };

  const borderStyles = {
    success: 'rgba(16, 185, 129, 0.4)',
    error: 'rgba(244, 63, 94, 0.4)',
    info: 'rgba(99, 102, 241, 0.4)'
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-secondary)',
        border: `1px solid ${borderStyles[toast.type] || borderStyles.info}`,
        boxShadow: 'var(--shadow-lg)',
        color: 'var(--text-primary)',
        maxWidth: '420px',
        animation: 'slideUpFade 0.3s ease-out'
      }}
    >
      {icons[toast.type] || icons.info}
      <span style={{ fontSize: '0.9rem', flex: 1, fontWeight: 500 }}>
        {toast.message}
      </span>
      <button
        onClick={onClose}
        style={{
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
