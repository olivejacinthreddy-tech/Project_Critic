import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';

import LandingPage from './pages/LandingPage.jsx';
import NewAnalysisPage from './pages/NewAnalysisPage.jsx';
import AnalysisProgressPage from './pages/AnalysisProgressPage.jsx';
import ReportDashboardPage from './pages/ReportDashboardPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import ProjectComparisonPage from './pages/ProjectComparisonPage.jsx';

import { api } from './services/api.js';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [activeProject, setActiveProject] = useState(null);
  const [sampleProjects, setSampleProjects] = useState([]);
  const [toast, setToast] = useState(null);

  // Analysis Progress States
  const [analyzingInput, setAnalyzingInput] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [agentStates, setAgentStates] = useState({});
  const [analysisError, setAnalysisError] = useState(null);

  // Comparison IDs
  const [compareAId, setCompareAId] = useState(null);
  const [compareBId, setCompareBId] = useState(null);

  // Pre-filled form data for new analysis
  const [prefilledData, setPrefilledData] = useState(null);

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('project_critic_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('project_critic_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch initial health and samples
  const refreshSystemHealth = async () => {
    try {
      const health = await api.checkHealth();
      if (health?.aiEngine) {
        setAiStatus(health.aiEngine);
      }
    } catch (e) {
      console.warn('[App] Health refresh failed:', e);
    }
  };

  useEffect(() => {
    refreshSystemHealth();
    async function loadInitialData() {
      try {
        const samples = await api.getSamples();
        setSampleProjects(samples);
        const existing = await api.getProjects();
        if (existing && existing.length > 0) {
          setActiveProject(existing[0]);
        }
      } catch (err) {
        console.warn('[App] Initial data load error:', err);
      }
    }
    loadInitialData();
  }, []);

  const showToast = (toastObj) => {
    setToast(toastObj);
  };

  // Start Analysis Workflow
  const handleStartAnalysis = async (formData) => {
    setAnalyzingInput(formData);
    setCurrentStep(1);
    setAnalysisError(null);
    setAgentStates({
      1: { status: 'running', message: 'Analyzing existing solutions & prior art...' },
      2: { status: null, message: '' },
      3: { status: null, message: '' },
      4: { status: null, message: '' },
      5: { status: null, message: '' },
      6: { status: null, message: '' }
    });
    setCurrentPage('progress');

    try {
      const result = await api.analyzeProject(formData, (progress) => {
        setCurrentStep(progress.step);
        setAgentStates((prev) => ({
          ...prev,
          [progress.step]: {
            status: progress.status,
            message: progress.message
          },
          ...(progress.status === 'completed' && progress.step < 6
            ? { [progress.step + 1]: { status: 'running', message: 'Starting next agent...' } }
            : {})
        }));
      });

      if (result && result.project) {
        setActiveProject(result.project);
        setCurrentPage('report');
        showToast({
          type: 'success',
          message: 'Autonomous multi-agent evaluation completed successfully!'
        });

        if ((result.project.scores?.overallScore || 0) >= 8.0) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (err) {
      console.error('[App] Analysis execution error:', err);
      setAnalysisError(err.message || 'An unexpected error occurred during agent analysis.');
      showToast({
        type: 'error',
        message: err.message || 'Analysis failed. Please check backend or retry.'
      });
    }
  };

  // Trigger quick sample analysis
  const handleLoadSampleFromLanding = (sampleId) => {
    const found = sampleProjects.find((s) => s.id === sampleId) || sampleProjects[0];
    if (found) {
      setPrefilledData(found);
      setCurrentPage('new-analysis');
    }
  };

  // Navigate to view a specific historical project
  const handleViewProject = async (id) => {
    try {
      const proj = await api.getProjectById(id);
      if (proj) {
        setActiveProject(proj);
        setCurrentPage('report');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      showToast({
        type: 'error',
        message: 'Could not load project report.'
      });
    }
  };

  // Navigate to compare two projects
  const handleCompareProjects = (idA, idB) => {
    setCompareAId(idA);
    setCompareBId(idB);
    setCurrentPage('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        hasActiveProject={Boolean(activeProject)}
      />

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1, paddingTop: '2.5rem' }}>
        {currentPage === 'landing' && (
          <LandingPage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLoadSample={handleLoadSampleFromLanding}
          />
        )}

        {currentPage === 'new-analysis' && (
          <NewAnalysisPage
            onSubmit={handleStartAnalysis}
            sampleProjects={sampleProjects}
            initialData={prefilledData}
          />
        )}

        {currentPage === 'progress' && (
          <AnalysisProgressPage
            projectInput={analyzingInput || {}}
            currentStep={currentStep}
            agentStates={agentStates}
            error={analysisError}
            onRetry={() => analyzingInput && handleStartAnalysis(analyzingInput)}
          />
        )}

        {currentPage === 'report' && (
          <ReportDashboardPage
            project={activeProject}
            onNewAnalysis={() => {
              setPrefilledData(null);
              setCurrentPage('new-analysis');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCompare={(projId) => {
              setCompareAId(projId);
              setCurrentPage('compare');
            }}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'history' && (
          <HistoryPage
            onViewProject={handleViewProject}
            onCompareProjects={handleCompareProjects}
            onNewAnalysis={() => {
              setPrefilledData(null);
              setCurrentPage('new-analysis');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'compare' && (
          <ProjectComparisonPage
            initialProjectAId={compareAId}
            initialProjectBId={compareBId}
            onViewProject={handleViewProject}
            onNewAnalysis={() => {
              setPrefilledData(null);
              setCurrentPage('new-analysis');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
