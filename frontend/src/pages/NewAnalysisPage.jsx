import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  HelpCircle,
  FileCode,
  Users,
  Target,
  Wrench,
  Clock,
  DollarSign,
  AlertCircle,
  Check
} from 'lucide-react';

export default function NewAnalysisPage({ onSubmit, sampleProjects = [], initialData = null }) {
  const [formData, setFormData] = useState({
    idea: initialData?.idea || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    targetUsers: initialData?.targetUsers || '',
    problemStatement: initialData?.problemStatement || '',
    preferredTech: initialData?.preferredTech || '',
    projectType: initialData?.projectType || 'Web Application',
    timeline: initialData?.timeline || '4–6 weeks',
    teamSize: initialData?.teamSize || '2-3 students',
    skillLevel: initialData?.skillLevel || 'Intermediate',
    budget: initialData?.budget || '$0 - $50 (Free Tiers)'
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'idea' && value.trim()) {
      setValidationError('');
    }
  };

  const handleSelectSample = (sample) => {
    setFormData({
      idea: sample.idea,
      title: sample.title,
      description: sample.description || '',
      targetUsers: sample.targetUsers || '',
      problemStatement: sample.problemStatement || '',
      preferredTech: sample.preferredTech || '',
      projectType: sample.projectType || 'Web Application',
      timeline: sample.timeline || '4–6 weeks',
      teamSize: sample.teamSize || '2-3 students',
      skillLevel: sample.skillLevel || 'Intermediate',
      budget: sample.budget || '$0 - $50'
    });
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.idea.trim()) {
      setValidationError('Project Idea is required. Please provide a clear overview of your project concept.');
      // Scroll to idea field
      document.getElementById('project-idea-input')?.focus();
      return;
    }

    setValidationError('');
    onSubmit(formData);
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span className="badge badge-pastel-lavender">
            <Sparkles size={14} />
            Step 1 of 3
          </span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Submit Project For Multi-Agent Evaluation
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Enter your software concept below. Our 6 autonomous agents will assess originality, recommend a tech stack, evaluate feasibility, and issue an overall score.
        </p>
      </div>

      {/* Preset Quick Loader Buttons */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', borderTop: '3px solid var(--pastel-lavender)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Instant Demo Presets
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--pastel-lavender)', fontWeight: 600 }}>
            Click to auto-populate form
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => handleSelectSample(sampleProjects[0] || {
              title: 'AI-Based Smart Campus Assistant',
              idea: 'An intelligent AI-powered campus assistant web and mobile platform that helps university students navigate campus facilities, query real-time timetables, and find vacant study rooms via sensor integration.',
              targetUsers: 'Students, faculty, and campus administrators',
              problemStatement: 'Disjointed campus portals and repetitive administrative inquiries',
              preferredTech: 'React, Node.js, Gemini API, MongoDB',
              projectType: 'Web Application'
            })}
            className="btn-secondary btn-sm"
            style={{ fontSize: '0.82rem' }}
          >
            <Sparkles size={14} style={{ color: 'var(--pastel-lavender)' }} />
            <span>AI-Based Smart Campus Assistant</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSample(sampleProjects[1] || {
              title: 'Secure Health Records Portal with AI Pre-Screener',
              idea: 'A role-based medical health portal where patients own and share their encrypted clinical records, combined with an AI preliminary symptom checker.',
              targetUsers: 'Patients and outpatient clinics',
              problemStatement: 'Fragmented patient records between medical centers',
              preferredTech: 'React, Node.js, Web Crypto API, Gemini API',
              projectType: 'Web Application'
            })}
            className="btn-secondary btn-sm"
            style={{ fontSize: '0.82rem' }}
          >
            <span>Patient Health Portal</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSample(sampleProjects[2] || {
              title: 'EcoSort: Edge-AI Automated Waste Segregation Bin',
              idea: 'An automated IoT smart dustbin with camera and Raspberry Pi running a computer vision model to sort recyclables.',
              targetUsers: 'University cafeterias and public facilities',
              problemStatement: 'Manual recycling contamination',
              preferredTech: 'Python, OpenCV, Raspberry Pi, Node.js',
              projectType: 'IoT'
            })}
            className="btn-secondary btn-sm"
            style={{ fontSize: '0.82rem' }}
          >
            <span>IoT Waste Segregator</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Required: Project Idea */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label htmlFor="project-idea-input" style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>Project Idea</span>
              <span style={{ color: 'var(--accent-rose)' }}>*</span>
              <span className="badge badge-indigo" style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem' }}>
                Required
              </span>
            </label>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Explain what the system does and its core premise
            </span>
          </div>
          <textarea
            id="project-idea-input"
            name="idea"
            rows="5"
            placeholder="Describe your project concept in detail (e.g., An AI-powered campus companion that aggregates real-time schedules, library occupancy sensors, and answers handbook queries using retrieval-augmented generation)..."
            value={formData.idea}
            onChange={handleChange}
            style={{
              borderColor: validationError ? 'var(--accent-rose)' : undefined,
              fontSize: '0.98rem'
            }}
          />
          {validationError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-rose)', fontSize: '0.82rem', marginTop: '0.5rem' }}>
              <AlertCircle size={15} />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Optional Fields Divider */}
        <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
            Optional Project Details (Improves Evaluation Accuracy)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Title & Project Type */}
            <div className="grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. AI-Based Smart Campus Assistant"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Project Type
                </label>
                <select name="projectType" value={formData.projectType} onChange={handleChange}>
                  <option value="Web Application">Web Application</option>
                  <option value="Mobile Application">Mobile Application</option>
                  <option value="AI/ML">AI / Machine Learning</option>
                  <option value="IoT">IoT (Hardware + Software)</option>
                  <option value="Cybersecurity">Cybersecurity / Cryptography</option>
                  <option value="Data Analytics">Data Analytics / Business Intelligence</option>
                  <option value="Other">Other Category</option>
                </select>
              </div>
            </div>

            {/* Description & Target Users */}
            <div className="grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Project Description / Context
                </label>
                <textarea
                  name="description"
                  rows="2"
                  placeholder="Additional background context, motivations..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Target Users
                </label>
                <textarea
                  name="targetUsers"
                  rows="2"
                  placeholder="e.g. University students, teaching faculty, campus visitors"
                  value={formData.targetUsers}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Problem Statement & Preferred Tech */}
            <div className="grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Main Problem Being Solved
                </label>
                <input
                  type="text"
                  name="problemStatement"
                  placeholder="e.g. Fragmented departmental portals and lost notices"
                  value={formData.problemStatement}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Preferred Technologies (if any)
                </label>
                <input
                  type="text"
                  name="preferredTech"
                  placeholder="e.g. React, Node.js, Gemini API, MongoDB"
                  value={formData.preferredTech}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Team, Timeline, Skill & Budget */}
            <div className="grid-4">
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Team Size
                </label>
                <select name="teamSize" value={formData.teamSize} onChange={handleChange}>
                  <option value="1 student (Solo)">1 student (Solo)</option>
                  <option value="2 students">2 students</option>
                  <option value="3 students">3 students</option>
                  <option value="4+ students">4+ students</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Skill Level
                </label>
                <select name="skillLevel" value={formData.skillLevel} onChange={handleChange}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Available Time
                </label>
                <select name="timeline" value={formData.timeline} onChange={handleChange}>
                  <option value="2–4 weeks">2–4 weeks</option>
                  <option value="4–6 weeks">4–6 weeks</option>
                  <option value="6–8 weeks">6–8 weeks</option>
                  <option value="8–12 weeks">8–12 weeks</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Approx Budget
                </label>
                <select name="budget" value={formData.budget} onChange={handleChange}>
                  <option value="$0 (Free tier only)">$0 (Free tier only)</option>
                  <option value="$0 - $50">$0 - $50</option>
                  <option value="$50 - $150">$50 - $150</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            type="submit"
            className="btn-primary btn-lg"
            style={{ width: '100%', fontSize: '1.1rem', padding: '1.1rem' }}
          >
            <Sparkles size={20} />
            <span>Analyze Project with 6 AI Agents</span>
            <Send size={18} />
          </button>
          <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Each agent performs specialized evaluation before the Critic Agent compiles the final verdict.
          </div>
        </div>
      </form>
    </div>
  );
}
