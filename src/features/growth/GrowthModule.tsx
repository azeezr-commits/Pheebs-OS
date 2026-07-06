import React, { useState, useEffect } from 'react';
import { Flame, Brain } from 'lucide-react';

export const GrowthModule: React.FC = () => {


  // XP State
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('pheebs_sales_xp');
    return saved ? parseInt(saved, 10) : 3420;
  });

  // Weakest skill tracking
  const [weakestSkill, setWeakestSkill] = useState('Objection Handling');

  // Streak checklist
  const [streakCheck, setStreakCheck] = useState({
    research: true,
    calls: true,
    learning: false
  });

  useEffect(() => {
    const load = async () => {
      try {
        const storedStats = localStorage.getItem('pheebs_outcome_stats');
        if (storedStats) {
          const stats = JSON.parse(storedStats);
          if (stats.lostReasons && stats.lostReasons.pricing > stats.lostReasons.timing) {
            setWeakestSkill('Pricing Objections');
          } else if (stats.lostReasons && stats.lostReasons.trust > 0) {
            setWeakestSkill('Credibility / Trust');
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const addXp = (amount: number, reason: string) => {
    const updated = xp + amount;
    setXp(updated);
    localStorage.setItem('pheebs_sales_xp', updated.toString());
    alert(`🌟 Earned +${amount} XP for: ${reason}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '30px' }}>
      
      <div>
        <h1 className="title-gradient" style={{ fontSize: '28px', marginBottom: '4px' }}>🎯 Personal Growth</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Evaluate your sales XP leveling status, objection drill streaks, and AI coach history.
        </p>
      </div>

      {/* Grid: XP & Streak */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* XP Level Card */}
        <div className="card-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>AE EXPERIENCE LEVEL</span>
            <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 800, background: 'rgba(124,92,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
              Level 4 AE
            </span>
          </div>

          <div style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            {xp.toLocaleString()} <span style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 500 }}>XP</span>
          </div>

          {/* Progress Bar */}
          <div style={{ height: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '50px', marginTop: '10px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${Math.min(100, ((xp % 1000) / 1000) * 100)}%`, 
                background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)' 
              }} 
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>{xp % 1000} / 1,000 XP</span>
            <span>{1000 - (xp % 1000)} XP to Level 5</span>
          </div>
        </div>

        {/* Streak Tracker Card */}
        <div className="card-panel" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Flame size={44} color="var(--danger)" fill="rgba(239, 68, 68, 0.15)" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>15 Days Active Streak</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Complete daily checklists to avoid breaking your streak coordinates.
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <span onClick={() => setStreakCheck(p => ({ ...p, research: !p.research }))} style={{ cursor: 'pointer', color: streakCheck.research ? 'var(--success)' : 'var(--text-muted)' }}>
                {streakCheck.research ? '✔' : '○'} Research
              </span>
              <span>•</span>
              <span onClick={() => setStreakCheck(p => ({ ...p, calls: !p.calls }))} style={{ cursor: 'pointer', color: streakCheck.calls ? 'var(--success)' : 'var(--text-muted)' }}>
                {streakCheck.calls ? '✔' : '○'} Calls
              </span>
              <span>•</span>
              <span onClick={() => { setStreakCheck(p => ({ ...p, learning: !p.learning })); if (!streakCheck.learning) addXp(50, 'Daily learning session'); }} style={{ cursor: 'pointer', color: streakCheck.learning ? 'var(--success)' : 'var(--text-muted)' }}>
                {streakCheck.learning ? '✔' : '○'} Learning
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: AI Coach Insignts & Learning Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        
        {/* AI Coach Insights */}
        <div className="card-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
            <Brain size={16} /> AI Coach History Logs
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontWeight: 700 }}>YESTERDAY'S ANALYSIS</div>
              <p style={{ color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                You pitched Zoca before asking enough discovery questions. You focused on features rather than validation drop-offs.
              </p>
            </div>
            <div style={{ borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '10px' }}>
              <div style={{ color: 'var(--secondary)', fontWeight: 700 }}>TODAY'S STRATEGY</div>
              <p style={{ color: '#fff', marginTop: '2px', lineHeight: '1.4', fontWeight: 600 }}>
                Try asking *"How are you currently getting most of your new clients?"* before discussing checkout drop-out rates.
              </p>
            </div>
          </div>
        </div>

        {/* Learning metrics */}
        <div className="card-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
            AE Learning Scorecard
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Objection Response Drills</span>
              <strong style={{ color: '#fff' }}>12 Completed</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Weakest Sales Category</span>
              <strong style={{ color: '#fca5a5' }}>{weakestSkill}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Coached sessions held</span>
              <strong style={{ color: '#fff' }}>5 Sessions</strong>
            </div>
          </div>

          <button 
            onClick={() => addXp(100, 'Objection drill practice')}
            className="btn-primary" 
            style={{ alignSelf: 'flex-start', marginTop: '8px' }}
          >
            Practice Objection Drills (+100 XP)
          </button>
        </div>

      </div>

    </div>
  );
};
export default GrowthModule;
