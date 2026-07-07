import React, { useState, useEffect, useRef } from 'react';
import { useSessionEngine } from '../../core/session-engine/SessionContext';
import type { Session } from '../../contracts/Session';
import type { Reasoning, AEBriefing } from '../../domain/business/types';
import { ArrowLeft } from 'lucide-react';

interface ProspectWorkspaceProps {
  sessionId: string;
  onBack: () => void;
  onStartCall: (businessName: string) => void;
  hideBackButton?: boolean;
}

export const ProspectWorkspace: React.FC<ProspectWorkspaceProps> = ({
  sessionId,
  onBack,
  onStartCall: _onStartCall,
  hideBackButton = false
}) => {
  const { manager } = useSessionEngine();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Inputs for observations/counter-facts
  const [newEvidenceTexts, setNewEvidenceTexts] = useState<Record<string, string>>({});
  const [newContraTexts, setNewContraTexts] = useState<Record<string, string>>({});

  // Auto-save fleeting status: 'idle' | 'saving' | 'saved'
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const autoSaveTimeoutRef = useRef<any>(null);

  const triggerAutoSave = (updatedPayload: any) => {
    setSaveStatus('saving');
    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);

    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        if (session) {
          await manager.updateSession(session.id, updatedPayload);
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 1500);
        }
      } catch (e) {
        console.error(e);
        setSaveStatus('idle');
      }
    }, 800);
  };

  const loadWorkspace = async () => {
    setLoading(true);
    try {
      const refreshed = await manager.getSession(sessionId);
      if (refreshed) {
        setSession(refreshed);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, [sessionId]);

  if (loading || !session) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '16px' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.05)', borderTopColor: '#7C5CFF', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ color: '#71717A', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '13px' }}>Consulting second mind...</span>
      </div>
    );
  }

  const briefing: AEBriefing = session.payload.briefing || session.payload || {};
  const reasonings: Reasoning[] = session.payload.reasonings || briefing.reasonings || [];

  const handleAddEvidence = (reasoningId: string) => {
    const text = newEvidenceTexts[reasoningId] || '';
    if (!text.trim()) return;

    const updatedReasonings = reasonings.map((r) => {
      if (r.id === reasoningId) {
        return {
          ...r,
          status: 'Strengthening' as const,
          changeReason: `Added observation: "${text.trim()}"`,
          lastChanged: 'Just now',
          evidence: [...r.evidence, text.trim()]
        };
      }
      return r;
    });

    const updatedPayload = {
      ...session.payload,
      reasonings: updatedReasonings,
      briefing: {
        ...briefing,
        reasonings: updatedReasonings
      }
    };

    setSession({
      ...session,
      payload: updatedPayload
    });

    setNewEvidenceTexts({
      ...newEvidenceTexts,
      [reasoningId]: ''
    });

    triggerAutoSave(updatedPayload);
  };

  const handleAddContradiction = (reasoningId: string) => {
    const text = newContraTexts[reasoningId] || '';
    if (!text.trim()) return;

    const updatedReasonings = reasonings.map((r) => {
      if (r.id === reasoningId) {
        return {
          ...r,
          status: 'Weakening' as const,
          changeReason: `Added warning fact: "${text.trim()}"`,
          lastChanged: 'Just now',
          contradictions: [...r.contradictions, text.trim()]
        };
      }
      return r;
    });

    const updatedPayload = {
      ...session.payload,
      reasonings: updatedReasonings,
      briefing: {
        ...briefing,
        reasonings: updatedReasonings
      }
    };

    setSession({
      ...session,
      payload: updatedPayload
    });

    setNewContraTexts({
      ...newContraTexts,
      [reasoningId]: ''
    });

    triggerAutoSave(updatedPayload);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '80px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* 1. DOSSIER TITLE HEADER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid #2C2C2F', paddingBottom: '24px', marginBottom: '40px' }}>
        {!hideBackButton && (
          <button 
            onClick={onBack} 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'transparent', 
              border: 'none', 
              color: '#71717A', 
              fontSize: '13px', 
              cursor: 'pointer', 
              padding: 0,
              fontFamily: 'inherit',
              transition: 'color 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={e => e.currentTarget.style.color = '#71717A'}
          >
            <ArrowLeft size={16} /> runway
          </button>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 300, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
              {session.businessName}
            </h1>
            <span style={{ fontSize: '12px', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '6px', display: 'block' }}>
              {briefing.niche} niche • Sourced from {briefing.website || 'Google maps profile'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', fontFamily: 'monospace' }}>
            <span style={{ 
              fontSize: '11px', 
              color: saveStatus === 'saving' ? '#F59E0B' : saveStatus === 'saved' ? '#22C55E' : '#71717A',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {saveStatus === 'saving' ? 'Updating understanding...' : saveStatus === 'saved' ? 'Saved ✓' : 'synchronized'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. THE REASONINGS DOSSIER FLOW */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
        {reasonings.map((r: Reasoning) => {
          let statusColor = '#EF4444'; // Red
          let statusLabel = 'Assumption Weakening';
          if (r.status === 'Strengthening') {
            statusColor = '#22C55E'; // Green
            statusLabel = 'Assumption Strengthening';
          } else if (r.status === 'Unverified') {
            statusColor = '#71717A'; // Gray
            statusLabel = 'Unverified Assumption';
          }

          return (
            <div 
              key={r.id} 
              style={{ 
                borderBottom: '1px solid #1C1C1E', 
                paddingBottom: '48px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              {/* Understanding Header */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Current Understanding
                </span>
                <p style={{ fontSize: '20px', fontFamily: 'Outfit, sans-serif', fontWeight: 300, color: '#FFFFFF', margin: 0, lineHeight: '1.4' }}>
                  {r.understanding}
                </p>
                
                {/* Dynamic Status line without percentage jargon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '12.5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor }} />
                  <span style={{ color: statusColor, fontWeight: 600 }}>{statusLabel}</span>
                  {r.changeReason && (
                    <>
                      <span style={{ color: '#3B3B40' }}>•</span>
                      <span style={{ color: '#A1A1AA' }}>
                        Last changed {r.lastChanged.toLowerCase()} ({r.changeReason})
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Evidence vs Contradictions Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                
                {/* Why we think this Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Why we think this
                  </span>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {r.evidence.length === 0 ? (
                      <li style={{ fontSize: '13px', color: '#71717A', fontStyle: 'italic' }}>No supporting details loaded.</li>
                    ) : (
                      r.evidence.map((item, idx) => (
                        <li key={idx} style={{ fontSize: '13.5px', color: '#E4E4E7', display: 'flex', gap: '8px', alignItems: 'flex-start', lineHeight: '1.4' }}>
                          <span style={{ color: '#22C55E' }}>✓</span>
                          <span>{item}</span>
                        </li>
                      ))
                    )}
                  </ul>

                  {/* Share supporting observation input */}
                  <div style={{ marginTop: '4px' }}>
                    <input 
                      type="text" 
                      placeholder="+ Share supporting observation..."
                      value={newEvidenceTexts[r.id] || ''}
                      onChange={e => setNewEvidenceTexts({ ...newEvidenceTexts, [r.id]: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && handleAddEvidence(r.id)}
                      style={{ 
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px dashed #2C2C2F',
                        fontSize: '13px',
                        color: '#FFFFFF',
                        padding: '6px 0',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        fontFamily: 'inherit'
                      }}
                      onFocus={e => e.currentTarget.style.borderBottomColor = '#3B3B40'}
                      onBlur={e => e.currentTarget.style.borderBottomColor = '#2C2C2F'}
                    />
                  </div>
                </div>

                {/* What could make us wrong Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    What could make us wrong
                  </span>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {r.contradictions.length === 0 ? (
                      <li style={{ fontSize: '13px', color: '#71717A', fontStyle: 'italic' }}>No vulnerabilities flagged.</li>
                    ) : (
                      r.contradictions.map((item, idx) => (
                        <li key={idx} style={{ fontSize: '13.5px', color: '#FCA5A5', display: 'flex', gap: '8px', alignItems: 'flex-start', lineHeight: '1.4' }}>
                          <span style={{ color: '#EF4444' }}>?</span>
                          <span>{item}</span>
                        </li>
                      ))
                    )}
                  </ul>

                  {/* Share counter-fact or warning input */}
                  <div style={{ marginTop: '4px' }}>
                    <input 
                      type="text" 
                      placeholder="+ Share warning or counter-fact..."
                      value={newContraTexts[r.id] || ''}
                      onChange={e => setNewContraTexts({ ...newContraTexts, [r.id]: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && handleAddContradiction(r.id)}
                      style={{ 
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px dashed #2C2C2F',
                        fontSize: '13px',
                        color: '#FFFFFF',
                        padding: '6px 0',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        fontFamily: 'inherit'
                      }}
                      onFocus={e => e.currentTarget.style.borderBottomColor = '#3B3B40'}
                      onBlur={e => e.currentTarget.style.borderBottomColor = '#2C2C2F'}
                    />
                  </div>
                </div>

              </div>

              {/* One thing worth investigating */}
              <div 
                style={{ 
                  background: 'rgba(34, 197, 94, 0.02)', 
                  border: '1px solid rgba(34, 197, 94, 0.08)', 
                  borderLeft: '3px solid #22C55E', 
                  padding: '16px 20px', 
                  borderRadius: '4px', 
                  marginTop: '12px' 
                }}
              >
                <span style={{ 
                  fontSize: '10px', 
                  color: '#71717A', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em', 
                  display: 'block', 
                  marginBottom: '6px',
                  fontWeight: 600
                }}>
                  One thing worth investigating
                </span>
                <p style={{ 
                  fontSize: '15.5px', 
                  color: '#FFFFFF', 
                  fontStyle: 'italic', 
                  margin: 0, 
                  lineHeight: '1.4',
                  fontWeight: 300
                }}>
                  "{r.nextQuestion}"
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
