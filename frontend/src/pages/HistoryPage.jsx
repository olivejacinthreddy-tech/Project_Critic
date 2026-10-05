import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Trash2,
  Eye,
  GitCompare,
  PlusCircle,
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { api } from '../services/api.js';

export default function HistoryPage({
  onViewProject,
  onCompareProjects,
  onNewAnalysis,
  onShowToast
}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data || []);
    } catch (err) {
      console.error('[History Fetch Error]:', err);
      onShowToast?.({
        type: 'error',
        message: 'Could not load project history.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the evaluation for "${title}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await api.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      setSelectedForCompare((prev) => prev.filter((selId) => selId !== id));
      onShowToast?.({
        type: 'success',
        message: `Deleted "${title}" successfully.`
      });
    } catch (err) {
      onShowToast?.({
        type: 'error',
        message: 'Failed to delete project.'
      });
    } finally {
      setDeletingId(null);
    }
  };

  const toggleCompareSelect = (id) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((item) => item !== id));
    } else {
      if (selectedForCompare.length >= 2) {
        // Keep only the most recent 1 and add the new one
        setSelectedForCompare([selectedForCompare[1], id]);
      } else {
        setSelectedForCompare([...selectedForCompare, id]);
      }
    }
  };

  const handleTriggerCompare = () => {
    if (selectedForCompare.length !== 2) {
      onShowToast?.({
        type: 'info',
        message: 'Please select exactly 2 projects to compare.'
      });
      return;
    }
    onCompareProjects(selectedForCompare[0], selectedForCompare[1]);
  };

  const filteredProjects = projects.filter((p) => {
    const title = p.projectOverview?.title || '';
    const idea = p.projectOverview?.idea || '';
    const q = searchQuery.toLowerCase();
    return title.toLowerCase().includes(q) || idea.toLowerCase().includes(q);
  });

  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case 'Highly Recommended':
        return 'badge-emerald';
      case 'Recommended with Improvements':
        return 'badge-indigo';
      case 'Needs Major Changes':
        return 'badge-amber';
      case 'Not Recommended':
        return 'badge-rose';
      default:
        return 'badge-slate';
    }
  };

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <History size={28} style={{ color: 'var(--accent-primary)' }} />
            <span>Project Evaluation History</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Manage and compare your previous multi-agent project evaluations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {selectedForCompare.length === 2 && (
            <button onClick={handleTriggerCompare} className="btn-primary btn-sm" style={{ animation: 'pulseGlow 2s infinite' }}>
              <GitCompare size={16} />
              <span>Compare Selected (2)</span>
            </button>
          )}

          <button onClick={onNewAnalysis} className="btn-primary btn-sm">
            <PlusCircle size={16} />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Search & Compare Instructions Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search saved projects by title or idea keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', padding: '0.4rem', fontSize: '0.95rem' }}
          />
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {selectedForCompare.length > 0 ? (
            <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
              {selectedForCompare.length} of 2 selected for comparison
            </span>
          ) : (
            <span>Check any 2 items to compare side-by-side</span>
          )}
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-primary)', margin: '0 auto 1rem auto' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading previous analyses from database...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Layers size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No Saved Evaluations Found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
            {searchQuery
              ? `No evaluations matched your search for "${searchQuery}".`
              : 'You have not evaluated any project ideas yet. Submit your first software concept to see it stored here.'}
          </p>
          <button onClick={onNewAnalysis} className="btn-primary">
            <PlusCircle size={16} />
            <span>Analyze Your First Project</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredProjects.map((proj) => {
            const isSelected = selectedForCompare.includes(proj._id);
            const title = proj.projectOverview?.title || 'Untitled Project';
            const overallScore = proj.scores?.overallScore || 'N/A';
            const origScore = proj.scores?.originality || 'N/A';
            const feasScore = proj.scores?.feasibility || 'N/A';
            const verdict = proj.verdict || 'Evaluation Complete';
            const dateStr = proj.createdAt
              ? new Date(proj.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'Recently';

            return (
              <div
                key={proj._id}
                className="glass-card"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  borderColor: isSelected ? 'var(--accent-primary)' : undefined,
                  background: isSelected ? 'rgba(99, 102, 241, 0.08)' : undefined
                }}
              >
                {/* Compare Checkbox & Main Info */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1, minWidth: '280px' }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCompareSelect(proj._id)}
                    title="Select to compare"
                    style={{
                      width: '18px',
                      height: '18px',
                      marginTop: '4px',
                      cursor: 'pointer',
                      accentColor: 'var(--accent-primary)'
                    }}
                  />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <h3
                        onClick={() => onViewProject(proj._id)}
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          color: 'var(--text-primary)'
                        }}
                        onMouseEnter={(e) => (e.target.style.color = 'var(--accent-primary)')}
                        onMouseLeave={(e) => (e.target.style.color = 'var(--text-primary)')}
                      >
                        {title}
                      </h3>
                      <span className={`badge ${getVerdictBadge(verdict)}`} style={{ fontSize: '0.72rem' }}>
                        {verdict}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {proj.projectOverview?.idea}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} />
                        {dateStr}
                      </span>
                      <span>Type: {proj.projectOverview?.projectType || 'Web App'}</span>
                    </div>
                  </div>
                </div>

                {/* Scores Breakdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1 }}>
                      {overallScore}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      OVERALL
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <div>Originality: <strong style={{ color: 'var(--text-primary)' }}>{origScore}/10</strong></div>
                    <div>Feasibility: <strong style={{ color: 'var(--text-primary)' }}>{feasScore}/10</strong></div>
                  </div>

                  {/* Actions: View, Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => onViewProject(proj._id)}
                      className="btn-secondary btn-sm"
                      title="View Detailed Evaluation Report"
                    >
                      <Eye size={15} />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => handleDelete(proj._id, title)}
                      className="btn-secondary btn-sm"
                      style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.2)' }}
                      title="Delete Evaluation"
                      disabled={deletingId === proj._id}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
