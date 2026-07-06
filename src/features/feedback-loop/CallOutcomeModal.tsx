import React, { useState } from 'react';
import { Target, ShieldAlert, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CallOutcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CallOutcomeModal: React.FC<CallOutcomeModalProps> = ({
  isOpen,
  onClose
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const handleOutcomeClick = (selected: 'Won' | 'Lost' | 'NoAnswer' | 'CallBack') => {
    if (selected === 'Lost') {
      setStep(2);
    } else {
      // Save stats immediately
      saveStats(selected);
      if (selected === 'Won') {
        confetti({ particleCount: 50, spread: 45, colors: ['#7C5CFF', '#00E5FF', '#22C55E'] });
      }
      handleComplete();
    }
  };

  const handleReasonClick = (reason: 'pricing' | 'timing' | 'trust' | 'agency' | 'other') => {
    saveStats('Lost', reason);
    handleComplete();
  };

  const saveStats = (outcomeType: string, lostReason?: string) => {
    try {
      const stored = localStorage.getItem('pheebs_outcome_stats') || JSON.stringify({
        totalLogged: 0,
        outcomes: { won: 0, lost: 0, noAnswer: 0, callBack: 0 },
        lostReasons: { pricing: 0, timing: 0, trust: 0, agency: 0, other: 0 }
      });
      
      const stats = JSON.parse(stored);
      stats.totalLogged += 1;
      
      if (outcomeType === 'Won') stats.outcomes.won += 1;
      else if (outcomeType === 'Lost') stats.outcomes.lost += 1;
      else if (outcomeType === 'NoAnswer') stats.outcomes.noAnswer += 1;
      else if (outcomeType === 'CallBack') stats.outcomes.callBack += 1;

      if (lostReason) {
        stats.lostReasons[lostReason] += 1;
      }

      localStorage.setItem('pheebs_outcome_stats', JSON.stringify(stats));
    } catch (e) {
      console.error(e);
    }
  };

  const handleComplete = () => {
    setStep(1);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 5, 8, 0.75)',
      backdropFilter: 'blur(10px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      
      <div 
        className="card-panel"
        style={{
          width: '400px',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          position: 'relative'
        }}
      >
        <button 
          onClick={handleComplete}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {step === 1 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(124, 92, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              margin: '0 auto'
            }}><Target size={24} /></div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>How did the call go?</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Log outcomes to update your sales cockpit diagnostics.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button 
                onClick={() => handleOutcomeClick('Won')}
                className="btn-primary" 
                style={{ justifyContent: 'center', background: 'var(--success)', boxShadow: 'none' }}
              >
                🏆 Won (Booked)
              </button>
              <button 
                onClick={() => handleOutcomeClick('Lost')}
                className="btn-secondary" 
                style={{ justifyContent: 'center', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}
              >
                💔 Lost Objection
              </button>
              <button 
                onClick={() => handleOutcomeClick('NoAnswer')}
                className="btn-secondary" 
                style={{ justifyContent: 'center' }}
              >
                🔇 No Answer
              </button>
              <button 
                onClick={() => handleOutcomeClick('CallBack')}
                className="btn-secondary" 
                style={{ justifyContent: 'center' }}
              >
                📅 Call Back
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--danger)',
              margin: '0 auto'
            }}><ShieldAlert size={24} /></div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>What was the objection?</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Help Pheebs customize your next objections practice drills.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => handleReasonClick('pricing')}
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                💵 Pricing / Budget Limits
              </button>
              <button 
                onClick={() => handleReasonClick('timing')}
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                ⏳ Timing / Next Quarter
              </button>
              <button 
                onClick={() => handleReasonClick('trust')}
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                🛡️ Trust / Agency Competency
              </button>
              <button 
                onClick={() => handleReasonClick('agency')}
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                🔄 Using another competitor / setup
              </button>
              <button 
                onClick={() => handleReasonClick('other')}
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                🧩 Other
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
