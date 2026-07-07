import React, { useState, useEffect } from 'react';
import { SessionProvider, useSessionEngine } from './core/session-engine/SessionContext';
import { AnalyzerModule } from './features/business-analyzer/AnalyzerModule';
import { VaultModule } from './features/brain/VaultModule';
import { HomeModule } from './features/launch/HomeModule';
import { CommandBar } from './features/search/CommandBar';
import { CallOutcomeModal } from './features/feedback-loop/CallOutcomeModal';
import { ProspectWorkspace } from './features/workspace/ProspectWorkspace';
import { AnalyticsModule } from './features/analytics/AnalyticsModule';
import { GrowthModule } from './features/growth/GrowthModule';
import { CallHudOverlay } from './features/calls/CallHudOverlay';
import { CallModeModule } from './features/call-mode/CallModeModule';
import confetti from 'canvas-confetti';
import { performAudit } from './features/business-analyzer/analyzerEngine';

const AEWorkspace: React.FC = () => {
  const { manager } = useSessionEngine();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analyzer' | 'vault' | 'settings' | 'workspace' | 'analytics' | 'growth' | 'calls'>('dashboard');
  const [preloadSessionId, setPreloadSessionId] = useState<string | null>(null);
  const [activeWorkspaceSessionId, setActiveWorkspaceSessionId] = useState<string | null>(null);
  const [initialSearchName, setInitialSearchName] = useState('');
  
  // Overlay states
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState(false);
  const [interventionOpen, setInterventionOpen] = useState(() => !sessionStorage.getItem('pheebs_intervention_seen'));

  // Session list for Workspace Dock
  const [sessions, setSessions] = useState<any[]>([]);

  const loadSessions = async () => {
    let list = await manager.listSessions('analyzer');
    if (list.length === 0) {
      // Seed default Bright Smile Orthodontics session!
      const auditResult = await performAudit(
        'Bright Smile Orthodontics',
        'brightsmile-example.com',
        'https://google.com/maps/place/Bright+Smile+Orthodontics',
        'Dental',
        'Tawana is the practice coordinator. Talked on the phone, she is interested but requested a proof of drop-out leaks before agreeing to buy.'
      );
      const seededSession = await manager.createSession('analyzer', auditResult);
      list = [seededSession];
    }
    setSessions(list);
  };

  useEffect(() => {
    loadSessions();
  }, [activeTab]);

  // Call HUD battle mode states
  const [inCallMode, setInCallMode] = useState(false);
  const [callProspectName, setCallProspectName] = useState('');

  const handleCloseCallHud = (outcome: 'Won' | 'Lost' | 'CallBack' | 'NoAnswer', notes: string) => {
    setInCallMode(false);
    
    // Save outcome stats
    try {
      const stored = localStorage.getItem('pheebs_outcome_stats') || JSON.stringify({
        totalLogged: 0,
        outcomes: { won: 0, lost: 0, noAnswer: 0, callBack: 0 },
        lostReasons: { pricing: 0, timing: 0, trust: 0, agency: 0, other: 0 }
      });
      const stats = JSON.parse(stored);
      stats.totalLogged += 1;
      
      if (outcome === 'Won') {
        stats.outcomes.won += 1;
        confetti({ particleCount: 50, spread: 45, colors: ['#7C5CFF', '#00E5FF', '#22C55E'] });
      } else if (outcome === 'Lost') {
        stats.outcomes.lost += 1;
        stats.lostReasons.pricing += 1;
      } else if (outcome === 'CallBack') {
        stats.outcomes.callBack += 1;
      } else {
        stats.outcomes.noAnswer += 1;
      }
      localStorage.setItem('pheebs_outcome_stats', JSON.stringify(stats));



      // Log call to active session logs
      if (activeWorkspaceSessionId) {
        manager.getSession(activeWorkspaceSessionId).then(session => {
          if (session) {
            const oldLogs = session.payload.timelineLogs || [];
            const newLogs = [...oldLogs, { time: 'Today', text: `📞 Call: ${outcome}`, detail: `Live Call Notes: ${notes}` }];
            manager.updateSession(session.id, { timelineLogs: newLogs });
          }
        });
      }
      
      alert(`Call outcome logged: ${outcome}. Notes saved.`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartCall = (name: string) => {
    setCallProspectName(name);
    setInCallMode(true);
  };

  // Global meta+k listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandBarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (inCallMode) {
    return (
      <CallHudOverlay 
        businessName={callProspectName} 
        onClose={handleCloseCallHud} 
      />
    );
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: '#0F0F10',
      color: '#FFFFFF',
      fontFamily: 'Plus Jakarta Sans, sans-serif'
    }}>
      
      {/* 1. Left Sidebar Navigation Dock */}
      <aside style={{
        width: '60px',
        height: '100vh',
        background: '#0F0F10',
        borderRight: '1px solid #2C2C2F',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 0',
        zIndex: 10
      }}>
        {/* Logo isolated at top */}
        <div style={{ marginBottom: '32px', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2H22L28 8V12L22 18H10V30" stroke="url(#logo_grad_sidebar)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 8H18L21 11V12L18 15H12V8" stroke="url(#logo_grad_sidebar)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="logo_grad_sidebar" x1="6" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#71717A" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Navigation centered icons */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
          {[
            { id: 'dashboard', glyph: '⌂', size: '18px', title: 'Launch' },
            { id: 'workspace', glyph: '◧', size: '16px', title: 'Workspace' },
            { id: 'vault', glyph: '🧠', size: '16px', title: 'Brain' },
            { id: 'settings', glyph: '⚙', size: '17px', title: 'Settings' }
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'vault') {
                    setPreloadSessionId(null);
                  }
                  setActiveTab(item.id as any);
                }}
                title={item.title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  background: isActive ? '#3B3B40' : 'transparent',
                  border: 'none',
                  borderRadius: '50%',
                  color: isActive ? '#FFFFFF' : '#71717A',
                  cursor: 'pointer',
                  fontSize: item.size,
                  lineHeight: 1,
                  position: 'relative',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.background = '#202024';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#71717A';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {item.glyph}
              </button>
            );
          })}
        </nav>

        <hr style={{ border: 'none', borderTop: '1px solid #2C2C2F', width: '20px', margin: '20px 0' }} />

        {/* Workspace Dock list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center', flex: 1 }}>
          {sessions.map(s => {
            const isHot = s.businessName.toLowerCase().includes('tawana');
            const color = isHot ? '#EF4444' : '#F97316';
            const letter = s.businessName.charAt(0).toUpperCase();
            const isActive = activeWorkspaceSessionId === s.id && activeTab === 'workspace';

            return (
              <button
                key={s.id}
                onClick={() => {
                  setActiveWorkspaceSessionId(s.id);
                  setActiveTab('workspace');
                }}
                title={s.businessName}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isActive ? '#3B3B40' : 'transparent',
                  border: isActive ? `1px solid ${color}` : '1px solid #2C2C2F',
                  color: isActive ? '#FFFFFF' : '#71717A',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = color;
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = '#2C2C2F';
                    e.currentTarget.style.color = '#71717A';
                  }
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: '-1px',
                  right: '-1px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: color
                }} />
                {letter}
              </button>
            );
          })}
        </div>

        {/* Minimal version tag at the bottom */}
        <div style={{ fontSize: '9px', color: '#3B3B40', textAlign: 'center', fontWeight: 600, marginBottom: '8px' }}>
          v0.7
        </div>
      </aside>

      {/* 2. Main content view */}
      <main style={{
        flex: 1,
        height: '100vh',
        overflowY: 'auto',
        padding: '32px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        
        {/* Workspace global header row */}
        <header style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.03)',
          paddingBottom: '16px'
        }}>
          {/* Quick-outcome trigger button */}
          <button 
            onClick={() => setIsOutcomeModalOpen(true)}
            className="btn-secondary" 
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              border: '1px dashed rgba(255,255,255,0.1)'
            }}
          >
            📞 Log Call Outcome
          </button>

          {/* Search command bar trigger header */}
          <div 
            onClick={() => setIsCommandBarOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              color: 'var(--text-secondary)'
            }}
          >
            <span>Type a command...</span>
            <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 4px', borderRadius: '3px', fontSize: '10px' }}>⌘K</kbd>
          </div>
        </header>

        {/* Content body viewport */}
        <div style={{ flex: 1 }}>
          {activeTab === 'dashboard' && (
            <HomeModule 
              onOpenOutreach={(sessionId) => {
                setActiveWorkspaceSessionId(sessionId);
                setActiveTab('workspace');
              }}
              onStartAnalysis={(name) => {
                setInitialSearchName(name);
                setActiveTab('analyzer');
              }}
              onStartCall={handleStartCall}
            />
          )}

          {activeTab === 'analyzer' && (
            <AnalyzerModule 
              initialSearchName={initialSearchName}
              onClearInitialSearch={() => setInitialSearchName('')}
              onOpenOutreach={(sessionId: string) => {
                setActiveWorkspaceSessionId(sessionId);
                setActiveTab('workspace');
              }} 
            />
          )}

          {activeTab === 'workspace' && (
            activeWorkspaceSessionId ? (
              <ProspectWorkspace 
                sessionId={activeWorkspaceSessionId} 
                onBack={() => setActiveTab('dashboard')}
                onStartCall={handleStartCall}
              />
            ) : (
              <div style={{ maxWidth: '500px', margin: '60px auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '48px' }}>📂</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>No Active Workspace</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px' }}>
                  Please select a prospect from your Command Center priorities list or click their dot status in the Workspace Dock to launch their cockpit.
                </p>
                <button onClick={() => setActiveTab('dashboard')} className="btn-primary" style={{ alignSelf: 'center' }}>
                  Go to Command Center
                </button>
              </div>
            )
          )}

          {activeTab === 'vault' && (
            <VaultModule 
              setActiveTab={setActiveTab as any} 
              preloadedSessionId={preloadSessionId}
              onClearPreload={() => setPreloadSessionId(null)}
              onSelectSession={(sessionId) => {
                setActiveWorkspaceSessionId(sessionId);
                setActiveTab('workspace');
              }}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsModule />}
          {activeTab === 'growth' && <GrowthModule />}
          {activeTab === 'calls' && <CallModeModule />}

          {activeTab === 'settings' && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 className="title-gradient" style={{ fontSize: '28px', marginBottom: '8px' }}>Settings</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px' }}>
                Configure your desktop Sales Cockpit parameters.
              </p>
              <div className="card-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>OUTBOUND DEFAULT STRATEGY</label>
                  <select className="input-field" style={{ marginTop: '6px', appearance: 'none', background: 'rgba(9,9,12,0.8)' }}>
                    <option>Consultative / High-Value Hook</option>
                    <option>Direct Pitch / Case Study Hook</option>
                  </select>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>

      {/* Glass Command overlay */}
      <CommandBar 
        isOpen={isCommandBarOpen} 
        onClose={() => setIsCommandBarOpen(false)} 
        setActiveTab={setActiveTab}
        onSelectSession={(sessionId) => {
          setActiveWorkspaceSessionId(sessionId);
          setActiveTab('workspace');
        }}
      />

      {/* Outcome objections feedback logs dialog */}
      <CallOutcomeModal 
        isOpen={isOutcomeModalOpen} 
        onClose={() => setIsOutcomeModalOpen(false)} 
      />

      {/* Moment of Magic: Strategic Interruption Overlay */}
      {activeTab === 'dashboard' && interventionOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#050508',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}>
          <div style={{ maxWidth: '480px', width: '100%', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '13px', color: '#71717A', letterSpacing: '0.05em' }}>Good evening.</span>
              <hr style={{ border: 'none', borderTop: '1px solid #2C2C2F', margin: '16px 0 24px 0' }} />
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚠️</div>
              <span style={{ fontSize: '12px', color: '#EF4444', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                CRITICAL BLINDSPOT ALERT
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: 400, color: '#FFFFFF', lineHeight: '1.4', marginTop: '6px' }}>
                Before today's demo...
              </h2>
              <p style={{ fontSize: '16px', color: '#A1A1AA', lineHeight: '1.5', marginTop: '12px' }}>
                You're assuming <strong style={{ color: '#FFFFFF' }}>Tawana</strong> is the decision maker.
              </p>
              <p style={{ fontSize: '16px', color: '#EF4444', fontWeight: 500, lineHeight: '1.5', marginTop: '8px' }}>
                There is no evidence that's true.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
              <button 
                onClick={() => {
                  const brightSmile = sessions.find(s => s.businessName.toLowerCase().includes('smile'));
                  if (brightSmile) {
                    setPreloadSessionId(brightSmile.id);
                  }
                  sessionStorage.setItem('pheebs_intervention_seen', 'true');
                  setInterventionOpen(false);
                  setActiveTab('vault');
                }}
                style={{
                  flex: 1,
                  background: '#EF4444',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '14px 20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#DC2626'}
                onMouseLeave={e => e.currentTarget.style.background = '#EF4444'}
              >
                Review Blindspot
              </button>
              
              <button 
                onClick={() => {
                  sessionStorage.setItem('pheebs_intervention_seen', 'true');
                  setInterventionOpen(false);
                }}
                style={{
                  background: 'transparent',
                  color: '#71717A',
                  border: '1px solid #2C2C2F',
                  borderRadius: '6px',
                  padding: '14px 24px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B3B40'; e.currentTarget.style.color = '#FFFFFF'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2C2C2F'; e.currentTarget.style.color = '#71717A'; }}
              >
                Ignore
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SessionProvider>
      <AEWorkspace />
    </SessionProvider>
  );
};

export default App;
