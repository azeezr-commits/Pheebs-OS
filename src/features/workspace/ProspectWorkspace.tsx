import React, { useState, useEffect, useRef } from 'react';
import { useSessionEngine } from '../../core/session-engine/SessionContext';
import type { Session } from '../../contracts/Session';
import type { Belief, AEBriefing } from '../../domain/business/types';
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

  // Input states for adding evidence/contradictions per belief
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
        <span style={{ color: '#71717A', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '13px' }}>Sourcing case file...</span>
      </div>
    );
  }

  const briefing: AEBriefing = session.payload.briefing || session.payload || {};
  const beliefs: Belief[] = session.payload.beliefs || briefing.beliefs || [];

  const handleUpdateBeliefConfidence = (beliefId: string, newConfidence: number) => {
    const updatedBeliefs = beliefs.map((b) => 
      b.id === beliefId ? { ...b, confidence: newConfidence } : b
    );
    
    const updatedPayload = {
      ...session.payload,
      beliefs: updatedBeliefs,
      briefing: {
        ...briefing,
        beliefs: updatedBeliefs
      }
    };
    
    setSession({
      ...session,
      payload: updatedPayload
    });
    
    triggerAutoSave(updatedPayload);
  };

  const handleAddEvidence = (beliefId: string) => {
    const text = newEvidenceTexts[beliefId] || '';
    if (!text.trim()) return;

    const updatedBeliefs = beliefs.map((b) => 
      b.id === beliefId ? { ...b, evidence: [...b.evidence, text.trim()] } : b
    );

    const updatedPayload = {
      ...session.payload,
      beliefs: updatedBeliefs,
      briefing: {
        ...briefing,
        beliefs: updatedBeliefs
      }
    };

    setSession({
      ...session,
      payload: updatedPayload
    });

    setNewEvidenceTexts({
      ...newEvidenceTexts,
      [beliefId]: ''
    });

    triggerAutoSave(updatedPayload);
  };

  const handleAddContradiction = (beliefId: string) => {
    const text = newContraTexts[beliefId] || '';
    if (!text.trim()) return;

    const updatedBeliefs = beliefs.map((b) => 
      b.id === beliefId ? { ...b, contradictions: [...b.contradictions, text.trim()] } : b
    );

    const updatedPayload = {
      ...session.payload,
      beliefs: updatedBeliefs,
      briefing: {
        ...briefing,
        beliefs: updatedBeliefs
      }
    };

    setSession({
      ...session,
      payload: updatedPayload
    });

    setNewContraTexts({
      ...newContraTexts,
      [beliefId]: ''
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
              {saveStatus === 'saving' ? 'Re-calculating...' : saveStatus === 'saved' ? 'Saved ✓' : 'synchronized'}
            </span>
            <span style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 500 }}>
              Confidence score: {briefing.confidenceScore}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. THE BELIEFS Dossier Flow */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
        {beliefs.map((belief: Belief) => {
          // Color based on confidence levels
          let confidenceColor = '#EF4444'; // Red
          let confidenceLabel = 'Highly Uncertain';
          if (belief.confidence >= 75) {
            confidenceColor = '#22C55E'; // Green
            confidenceLabel = 'Verified Belief';
          } else if (belief.confidence >= 40) {
            confidenceColor = '#F59E0B'; // Orange/Yellow
            confidenceLabel = 'Unverified Assumption';
          }

          return (
            <div 
              key={belief.id} 
              style={{ 
                borderBottom: '1px solid #1C1C1E', 
                paddingBottom: '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              {/* Belief Title & Confidence Selector */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#FFFFFF', margin: 0 }}>
                    {belief.title}
                  </h3>
                  <span style={{ fontSize: '11px', color: confidenceColor, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {confidenceLabel} ({belief.confidence}%)
                  </span>
                </div>

                {/* Interactive confidence selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {[10, 25, 50, 75, 90].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleUpdateBeliefConfidence(belief.id, num)}
                      style={{
                        background: belief.confidence === num ? '#FFFFFF' : 'transparent',
                        color: belief.confidence === num ? '#0A0A0B' : '#71717A',
                        border: '1px solid #2C2C2F',
                        borderRadius: '4px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        fontFamily: 'monospace'
                      }}
                      onMouseEnter={e => {
                        if (belief.confidence !== num) {
                          e.currentTarget.style.borderColor = '#3B3B40';
                          e.currentTarget.style.color = '#FFFFFF';
                        }
                      }}
                      onMouseLeave={e => {
                        if (belief.confidence !== num) {
                          e.currentTarget.style.borderColor = '#2C2C2F';
                          e.currentTarget.style.color = '#71717A';
                        }
                      }}
                    >
                      {num}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Evidence vs Contradictions Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '8px' }}>
                
                {/* Evidence Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Evidence (Supporting)
                  </span>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {belief.evidence.length === 0 ? (
                      <li style={{ fontSize: '13px', color: '#71717A', fontStyle: 'italic' }}>No supporting evidence found.</li>
                    ) : (
                      belief.evidence.map((item, idx) => (
                        <li key={idx} style={{ fontSize: '13.5px', color: '#E4E4E7', display: 'flex', gap: '8px', alignItems: 'flex-start', lineHeight: '1.4' }}>
                          <span style={{ color: '#22C55E' }}>✓</span>
                          <span>{item}</span>
                        </li>
                      ))
                    )}
                  </ul>

                  {/* Add evidence input */}
                  <div style={{ marginTop: '4px' }}>
                    <input 
                      type="text" 
                      placeholder="+ Add supporting observation..."
                      value={newEvidenceTexts[belief.id] || ''}
                      onChange={e => setNewEvidenceTexts({ ...newEvidenceTexts, [belief.id]: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && handleAddEvidence(belief.id)}
                      style={{ 
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px dashed #2C2C2F',
                        fontSize: '13px',
                        color: '#FFFFFF',
                        padding: '6px 0',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={e => e.currentTarget.style.borderBottomColor = '#3B3B40'}
                      onBlur={e => e.currentTarget.style.borderBottomColor = '#2C2C2F'}
                    />
                  </div>
                </div>

                {/* Contradictions Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Contradictions (Challenging)
                  </span>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {belief.contradictions.length === 0 ? (
                      <li style={{ fontSize: '13px', color: '#71717A', fontStyle: 'italic' }}>No contradictions found.</li>
                    ) : (
                      belief.contradictions.map((item, idx) => (
                        <li key={idx} style={{ fontSize: '13.5px', color: '#FCA5A5', display: 'flex', gap: '8px', alignItems: 'flex-start', lineHeight: '1.4' }}>
                          <span style={{ color: '#EF4444' }}>?</span>
                          <span>{item}</span>
                        </li>
                      ))
                    )}
                  </ul>

                  {/* Add contradiction input */}
                  <div style={{ marginTop: '4px' }}>
                    <input 
                      type="text" 
                      placeholder="+ Add challenging counter-fact..."
                      value={newContraTexts[belief.id] || ''}
                      onChange={e => setNewContraTexts({ ...newContraTexts, [belief.id]: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && handleAddContradiction(belief.id)}
                      style={{ 
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px dashed #2C2C2F',
                        fontSize: '13px',
                        color: '#FFFFFF',
                        padding: '6px 0',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={e => e.currentTarget.style.borderBottomColor = '#3B3B40'}
                      onBlur={e => e.currentTarget.style.borderBottomColor = '#2C2C2F'}
                    />
                  </div>
                </div>

              </div>

              {/* Next Question to update belief */}
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
                  Next Discovery Question (to challenge assumption)
                </span>
                <p style={{ 
                  fontSize: '15px', 
                  color: '#FFFFFF', 
                  fontStyle: 'italic', 
                  margin: 0, 
                  lineHeight: '1.4',
                  fontWeight: 300
                }}>
                  "{belief.nextQuestion}"
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
