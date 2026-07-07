import React, { useState, useEffect } from 'react';
import { useSessionEngine } from '../../core/session-engine/SessionContext';
import type { Session } from '../../contracts/Session';

interface VaultModuleProps {
  setActiveTab: (tab: 'dashboard' | 'analyzer' | 'outreach' | 'practice' | 'vault' | 'settings' | 'workspace') => void;
  preloadedSessionId?: string | null;
  onClearPreload?: () => void;
  onSelectSession?: (sessionId: string) => void;
}

export const VaultModule: React.FC<VaultModuleProps> = ({ 
  setActiveTab: _setActiveTab, 
  preloadedSessionId, 
  onClearPreload,
  onSelectSession
}) => {
  const { manager } = useSessionEngine();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const loadData = async () => {
    const list = await manager.listSessions('analyzer');
    setSessions(list);
    
    // Choose active/selected session
    if (preloadedSessionId) {
      setSelectedSessionId(preloadedSessionId);
      if (onClearPreload) onClearPreload();
    } else if (list.length > 0 && !selectedSessionId) {
      const brightSmile = list.find(s => s.businessName.toLowerCase().includes('smile'));
      setSelectedSessionId(brightSmile ? brightSmile.id : list[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, [preloadedSessionId]);

  const activeSession = sessions.find(s => s.id === selectedSessionId);

  // Fallbacks if data doesn't contain Brain properties yet
  const briefing = activeSession?.payload.briefing || activeSession?.payload || {};
  const knowns: string[] = activeSession?.payload.brainKnowns || briefing.brainKnowns || [
    'Domain registered and active.',
    'Initial local search profile verified.'
  ];
  const unknowns: string[] = activeSession?.payload.brainUnknowns || briefing.brainUnknowns || [
    'Who is the primary business owner contact?',
    'What scheduling software are they using?'
  ];
  const explanation: string = activeSession?.payload.brainThinkingExplanation || briefing.brainThinkingExplanation || 'No structured observation has been parsed yet.';
  const evidence: string[] = activeSession?.payload.brainThinkingEvidence || briefing.brainThinkingEvidence || [];
  const missing: string[] = activeSession?.payload.brainThinkingMissing || briefing.brainThinkingMissing || [];
  const investigation = activeSession?.payload.brainThinkingInvestigation || briefing.brainThinkingInvestigation || 'Log call details to compile reasoning.';
  const nextQuestion = activeSession?.payload.brainNextQuestion || briefing.brainNextQuestion || 'Apart from yourself, who else will be involved in approving this purchase?';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '40px', minHeight: '100%', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* Left side: Case Files List */}
      <div style={{ borderRight: '1px solid #2C2C2F', paddingRight: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '10px', color: '#71717A', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Case Files
          </span>
          <p style={{ fontSize: '13px', color: '#71717A', marginTop: '2px' }}>
            Select a deal brain
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sessions.map(s => {
            const isSelected = s.id === selectedSessionId;
            const isHot = s.businessName.toLowerCase().includes('smile') || s.businessName.toLowerCase().includes('tawana');
            const color = isHot ? '#EF4444' : '#F97316';

            return (
              <button
                key={s.id}
                onClick={() => setSelectedSessionId(s.id)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  textAlign: 'left',
                  background: isSelected ? '#18181B' : 'transparent',
                  border: isSelected ? '1px solid #2C2C2F' : '1px solid transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.background = '#18181B';
                    e.currentTarget.style.borderColor = '#2C2C2F';
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '14.5px', fontWeight: 500, color: '#FFFFFF' }}>
                    {s.businessName}
                  </span>
                  <span style={{ fontSize: '11px', color: '#71717A' }}>
                    {s.payload.niche || 'B2C'} • {s.payload.dealStage || 'Discovery'}
                  </span>
                </div>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side: Structured Brain Workspace */}
      {activeSession ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px' }}>
          
          {/* 1. Context Row (Minimal, always visible) */}
          <div style={{ borderBottom: '1px solid #2C2C2F', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#71717A', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Context
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: 500, color: '#FFFFFF', letterSpacing: '-0.02em', marginTop: '2px' }}>
                {activeSession.businessName}
              </h2>
            </div>
            
            <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#A1A1AA' }}>
              <div>
                <span style={{ display: 'block', fontSize: '10px', color: '#71717A' }}>STAGE</span>
                <strong style={{ color: '#FFFFFF' }}>{activeSession.payload.dealStage || 'Discovery'}</strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '10px', color: '#71717A' }}>CONTACT</span>
                <strong style={{ color: '#FFFFFF' }}>{activeSession.businessName.toLowerCase().includes('smile') ? 'Tawana' : 'Practice Lead'}</strong>
              </div>
              <div>
                <button 
                  onClick={() => onSelectSession && onSelectSession(activeSession.id)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #2C2C2F',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    marginTop: '8px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B3B40'; e.currentTarget.style.background = '#18181B'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2C2C2F'; e.currentTarget.style.background = 'transparent'; }}
                >
                  Open Case File →
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            
            {/* 2. What We Know (Facts only) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                What We Know
              </span>
              <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#E4E4E7', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {knowns.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* 3. What We Don't Know (Urgent unknowns) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                What We Don't Know
              </span>
              <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#EF4444', display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: 500 }}>
                {unknowns.map((item: string, idx: number) => (
                  <li key={idx} style={{ color: '#FCA5A5' }}>
                    <span style={{ color: '#EF4444', fontWeight: 700 }}>?</span> {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #2C2C2F', margin: '8px 0' }} />

          {/* 4. Thinking (Structured Reasoning) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Reasoning & Evidence
            </span>
            
            <div style={{ padding: '20px 24px', borderLeft: '2px solid #3B3B40', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#71717A', display: 'block' }}>POSSIBLE EXPLANATION</span>
                <p style={{ fontSize: '14.5px', color: '#FFFFFF', margin: '4px 0 0 0', lineHeight: '1.5' }}>
                  {explanation}
                </p>
              </div>

              {evidence.length > 0 && (
                <div>
                  <span style={{ fontSize: '11px', color: '#71717A', display: 'block' }}>SUPPORTING EVIDENCE</span>
                  <ul style={{ paddingLeft: '16px', margin: '4px 0 0 0', fontSize: '13.5px', color: '#A1A1AA', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {evidence.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {missing.length > 0 && (
                <div>
                  <span style={{ fontSize: '11px', color: '#71717A', display: 'block' }}>MISSING EVIDENCE</span>
                  <ul style={{ paddingLeft: '16px', margin: '4px 0 0 0', fontSize: '13.5px', color: '#A1A1AA', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {missing.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <span style={{ fontSize: '11px', color: '#71717A', display: 'block' }}>SUGGESTED INVESTIGATION</span>
                <p style={{ fontSize: '13.5px', color: '#E4E4E7', margin: '4px 0 0 0', fontWeight: 500 }}>
                  {investigation}
                </p>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #2C2C2F', margin: '8px 0' }} />

          {/* 5. Next Best Question (Visual Focal Point) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '24px' }}>
            <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Next Best Question
            </span>
            <div style={{ background: '#18181B', border: '1px solid #2C2C2F', borderRadius: '6px', padding: '24px' }}>
              <p style={{ fontSize: '18px', fontWeight: 400, color: '#FFFFFF', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>
                "{nextQuestion}"
              </p>
            </div>
          </div>

        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717A', fontSize: '14.5px' }}>
          No active case files found. Go to Launch or run an audit.
        </div>
      )}

    </div>
  );
};

export default VaultModule;
