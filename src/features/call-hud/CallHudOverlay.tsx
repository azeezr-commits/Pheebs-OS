import React, { useState, useEffect, useRef } from 'react';
import { Clock, Brain } from 'lucide-react';

interface CallHudOverlayProps {
  businessName: string;
  onClose: (outcome: 'Won' | 'Lost' | 'CallBack' | 'NoAnswer', notes: string) => void;
}

export const CallHudOverlay: React.FC<CallHudOverlayProps> = ({
  businessName,
  onClose
}) => {
  const [seconds, setSeconds] = useState(0);
  const [liveNotes, setLiveNotes] = useState('');
  const [activeStage, setActiveStage] = useState('Discovery');

  const timerRef = useRef<any>(null);

  useEffect(() => {
    setSeconds(0);
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCoachedQuestion = () => {
    switch (activeStage) {
      case 'Discovery':
        return 'How are you currently getting most of your new booking clients?';
      case 'Friction Check':
        return 'When was the last time you ran a test to verify checkout widget dropouts?';
      case 'CTA':
        return 'Would you be open to checking our visibility audit reports next Tuesday at 1 PM?';
      default:
        return 'How are you currently getting most of your new booking clients?';
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#0F0F10',
        color: '#FFFFFF',
        zIndex: 999999,
        display: 'grid',
        gridTemplateRows: '80px 1fr 100px',
        padding: '24px 40px',
        fontFamily: 'Plus Jakarta Sans, sans-serif'
      }}
    >
      
      {/* 1. Header hud bar */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          paddingBottom: '16px' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.05em' }}>LIVE BATTLE MODE</span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px', letterSpacing: '-0.01em' }}>{businessName}</h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: 800, fontFamily: 'monospace' }}>
          <Clock size={20} color="#A1A1AA" />
          <span>{formatTime(seconds)}</span>
        </div>
      </div>

      {/* 2. Middle workspace layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 340px', gap: '30px', padding: '24px 0', overflowY: 'auto' }}>
        
        {/* Left column: Coaching Stage & Next Question */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Active Call Stages */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800 }}>CURRENT STAGE</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'Discovery', label: '1. Discovery Phase' },
                { id: 'Friction Check', label: '2. Friction Validation' },
                { id: 'CTA', label: '3. Demo Scheduler CTA' }
              ].map(stg => (
                <button
                  key={stg.id}
                  onClick={() => setActiveStage(stg.id)}
                  style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    borderRadius: '6px',
                    border: '1px solid',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: activeStage === stg.id ? 700 : 500,
                    background: activeStage === stg.id ? 'rgba(124,92,255,0.08)' : 'transparent',
                    borderColor: activeStage === stg.id ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                    color: activeStage === stg.id ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  {stg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Next coached question */}
          <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--secondary)', background: 'rgba(0,229,255,0.01)' }}>
            <span style={{ fontSize: '10px', color: 'var(--secondary)', fontWeight: 800 }}>NEXT COACHED QUESTION</span>
            <p style={{ fontSize: '14.5px', fontWeight: 600, color: '#fff', marginTop: '6px', lineHeight: '1.4' }}>
              "{getCoachedQuestion()}"
            </p>
          </div>

          {/* Deal signals */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800 }}>DEAL SIGNALS</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <div style={{ color: 'var(--success)' }}>✓ Requested Audit Proof</div>
              <div style={{ color: 'var(--success)' }}>✓ Accepted Calendar Invite</div>
              <div style={{ color: 'var(--success)' }}>✓ Opened 3 Sequence Emails</div>
              <div style={{ color: 'var(--warning)' }}>⚠ Uses Vagaro Platform</div>
              <div style={{ color: 'var(--danger)' }}>⚠ Mentions Price concerns</div>
            </div>
          </div>

        </div>

        {/* Center column: Live Notes log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800 }}>LIVE NOTE RECORDER (AUTO-SAVING)</span>
            <textarea
              className="input-field"
              style={{ flex: 1, resize: 'none', fontSize: '14.5px', lineHeight: '1.5', background: 'transparent', border: 'none', padding: 0 }}
              placeholder="Start typing notes during call... e.g. Owner name Tawana, checks checkout Widget tomorrow..."
              value={liveNotes}
              onChange={e => setLiveNotes(e.target.value)}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-start' }}>
              {['Pricing', 'Agency', 'Busy', 'Vagaro'].map(label => (
                <button
                  key={label}
                  onClick={() => setLiveNotes(prev => prev + ` [Objection: ${label}]`)}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: 'var(--text-secondary)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  + Log {label} Objection
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Objections Cheat Sheet */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800 }}>OBJECTIONS CHEAT SHEET</span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--secondary)' }}>💵 Pricing Objection</div>
              <p style={{ color: 'var(--text-secondary)', marginTop: '2px', fontStyle: 'italic', lineHeight: '1.3' }}>
                "ROI before price. If Zoca doesn't book you at least 3 meetings in month 1, you pay $0."
              </p>
            </div>
            
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
              <div style={{ fontWeight: 700, color: 'var(--secondary)' }}>🔄 Agency Objection</div>
              <p style={{ color: 'var(--text-secondary)', marginTop: '2px', fontStyle: 'italic', lineHeight: '1.3' }}>
                "Who updates GBP posts? Do they check visibility checkout dropouts monthly?"
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
              <div style={{ fontWeight: 700, color: '#FFFFFF' }}>⏳ Busy Objection</div>
              <p style={{ color: '#A1A1AA', marginTop: '2px', fontStyle: 'italic', lineHeight: '1.3' }}>
                "Is that because you have too many bookings, or is it just bad timing?"
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
              <div style={{ fontWeight: 700, color: '#FFFFFF' }}>🔌 Vagaro Platform</div>
              <p style={{ color: '#A1A1AA', marginTop: '2px', fontStyle: 'italic', lineHeight: '1.3' }}>
                "Not replacing Vagaro. We integrate directly with Vagaro to recover widget abandonments."
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Footer logger buttons */}
      <div 
        style={{ 
          borderTop: '1px solid #2C2C2F', 
          paddingTop: '16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#A1A1AA' }}>
          <Brain size={16} color="#A1A1AA" />
          <span>Press outcome below to save call logs and close Battle Mode.</span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => onClose('Won', liveNotes)}
            className="btn-primary"
            style={{ background: '#22C55E', color: '#000000', padding: '10px 24px', fontSize: '13.5px' }}
          >
            🏆 Won (Booked Demo)
          </button>
          
          <button 
            onClick={() => onClose('Lost', liveNotes)}
            className="btn-secondary"
            style={{ borderColor: '#EF4444', color: '#EF4444', padding: '10px 20px', fontSize: '13.5px' }}
          >
            💔 Lost Objection
          </button>

          <button 
            onClick={() => onClose('CallBack', liveNotes)}
            className="btn-secondary"
            style={{ padding: '10px 20px', fontSize: '13.5px' }}
          >
            📅 Call Back
          </button>

          <button 
            onClick={() => onClose('NoAnswer', liveNotes)}
            className="btn-secondary"
            style={{ padding: '10px 20px', fontSize: '13.5px' }}
          >
            🔇 No Answer
          </button>
        </div>
      </div>

    </div>
  );
};
