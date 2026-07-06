import React, { useState } from 'react';
import { CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PracticeModule: React.FC = () => {
  const [drillScore, setDrillScore] = useState(0);
  const [completedDrills, setCompletedDrills] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const objection = `"Your booking widget sounds cool, but we've used Mindbody for years and our front desk handles every appointment."`;
  
  const options = [
    {
      id: 1,
      text: `"Our integration is 10x better than Mindbody! It will save you hours of manual work and receptionists will love it. Let's schedule a call."`,
      feedback: `Incorrect. Avoid feature dumping and hard pitching too early. It sounds like generic automated sales scripts.`,
      correct: false
    },
    {
      id: 2,
      text: `"Understood. Mindbody is a massive player. I'm not looking to replace them. However, we noticed that forcing patients to register before seeing calendar slots typically leaks about 22% of search traffic. Have you calculated your checkout drop-off rate recently?"`,
      feedback: `Correct! You validated their current system, avoided hard pitching, used evidence-driven hooks, and asked a high-leverage curiosity prompt.`,
      correct: true
    },
    {
      id: 3,
      text: `"We help med spas increase calendar occupancy by 25%. I'd love to connect and show you a demo next Tuesday morning."`,
      feedback: `Incorrect. This uses sales clichés ("We help...", "I'd love to connect...") which immediately triggers prospect resistance.`,
      correct: false
    }
  ];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isAnswered) return;
    setIsAnswered(true);

    const isCorrect = options[selectedOption].correct;
    if (isCorrect) {
      setDrillScore(prev => prev + 10);
      setCompletedDrills(prev => prev + 1);
      confetti({ particleCount: 40, spread: 35, colors: ['#7C5CFF', '#22C55E', '#ffffff'] });
    }
  };

  const handleNextDrill = () => {
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Goals */}
      <div className="card-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.05em' }}>GAMIFIED DRILLS</span>
          <h2 style={{ fontSize: '20px', marginTop: '2px' }}>Objection Response Trainer</h2>
        </div>

        {/* Goal stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>TODAY'S GOAL</div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>{completedDrills} / 3 Calls Practiced</div>
          </div>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3].map((star) => (
              <span 
                key={star} 
                style={{ 
                  fontSize: '18px', 
                  color: star <= completedDrills ? 'var(--warning)' : 'var(--text-muted)',
                  textShadow: star <= completedDrills ? '0 0 6px rgba(245,158,11,0.5)' : 'none'
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Objection Drill Panel */}
      <div className="card-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
          PROSPECT OBJECTION
        </div>

        <div style={{
          padding: '16px',
          background: 'rgba(0,0,0,0.15)',
          borderRadius: '8px',
          fontSize: '15px',
          fontStyle: 'italic',
          lineHeight: '1.5',
          borderLeft: '4px solid var(--primary)',
          color: 'var(--text-primary)'
        }}>
          {objection}
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '8px' }}>
          Choose the best positioning hook (Rule 3: Senior Consultant tone):
        </div>

        {/* Options list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            let borderStyle = '1px solid rgba(255,255,255,0.05)';
            let bgStyle = 'rgba(255,255,255,0.01)';
            
            if (isSelected) {
              borderStyle = '1px solid var(--primary)';
              bgStyle = 'rgba(124, 92, 255, 0.05)';
            }
            if (isAnswered) {
              if (opt.correct) {
                borderStyle = '1px solid var(--success)';
                bgStyle = 'rgba(34, 197, 94, 0.08)';
              } else if (isSelected) {
                borderStyle = '1px solid var(--danger)';
                bgStyle = 'rgba(239, 68, 110, 0.08)';
              }
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(idx)}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  border: borderStyle,
                  background: bgStyle,
                  cursor: isAnswered ? 'default' : 'pointer',
                  fontSize: '13.5px',
                  lineHeight: '1.5',
                  transition: 'all 0.2s ease'
                }}
                className={isAnswered ? '' : 'card-item'}
              >
                {opt.text}
              </div>
            );
          })}
        </div>

        {/* Feedback card */}
        {isAnswered && selectedOption !== null && (
          <div style={{
            background: options[selectedOption].correct ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${options[selectedOption].correct ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginTop: '12px'
          }}>
            {options[selectedOption].correct ? (
              <CheckCircle size={20} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <ShieldAlert size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: options[selectedOption].correct ? 'var(--success)' : 'var(--danger)', letterSpacing: '0.05em', marginBottom: '4px' }}>
                {options[selectedOption].correct ? 'CORRECT' : 'INCORRECT'}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {options[selectedOption].feedback}
              </p>
            </div>
          </div>
        )}

        {/* Action button */}
        {!isAnswered ? (
          <button 
            disabled={selectedOption === null}
            onClick={handleSubmit} 
            className="btn-primary" 
            style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}
          >
            Submit Answer
          </button>
        ) : (
          <button 
            onClick={handleNextDrill} 
            className="btn-secondary" 
            style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}
          >
            Try Next Objections Drill
          </button>
        )}
      </div>

      {/* Drill XP Score stats */}
      <div className="card-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="var(--warning)" /> Drilling matches Sales DNA parameters
        </span>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>+{drillScore} XP Gained</span>
      </div>

    </div>
  );
};
