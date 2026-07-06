import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Clock, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CallModeModule: React.FC = () => {
  const [inCall, setInCall] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [liveNotes, setLiveNotes] = useState('');
  const [activeObjection, setActiveObjection] = useState<string | null>(null);

  // Checkboxes
  const [discoveryChecks, setDiscoveryChecks] = useState({
    verifyCoordinates: false,
    confirmGatekeeper: false,
    askTrafficOrigin: false,
    validateAgencyStatus: false
  });

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (inCall) {
      setSeconds(0);
      setActiveObjection(null);
      setLiveNotes('');
      setDiscoveryChecks({
        verifyCoordinates: false,
        confirmGatekeeper: false,
        askTrafficOrigin: false,
        validateAgencyStatus: false
      });
      
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [inCall]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setInCall(true);
  };

  const handleLogCallOutcome = (outcome: 'Won' | 'Lost' | 'NoAnswer' | 'CallBack', objectionReason?: string) => {
    setInCall(false);
    
    // Save to outcome stats
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
        alert(`🏆 Demo Booked successfully!`);
      } else if (outcome === 'Lost') {
        stats.outcomes.lost += 1;
        if (objectionReason) {
          stats.lostReasons[objectionReason] = (stats.lostReasons[objectionReason] || 0) + 1;
        }
        alert(`Logged Lost Objection outcome.`);
      } else if (outcome === 'NoAnswer') {
        stats.outcomes.noAnswer += 1;
        alert(`Logged No Answer.`);
      } else if (outcome === 'CallBack') {
        stats.outcomes.callBack += 1;
        alert(`Logged Call Back scheduled.`);
      }

      localStorage.setItem('pheebs_outcome_stats', JSON.stringify(stats));

      // Award XP
      const savedXp = localStorage.getItem('pheebs_sales_xp');
      const currentXp = savedXp ? parseInt(savedXp, 10) : 3420;
      const earned = outcome === 'Won' ? 500 : 25;
      const updatedXp = currentXp + earned;
      localStorage.setItem('pheebs_sales_xp', updatedXp.toString());
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '30px' }}>
      
      <div>
        <h1 className="title-gradient" style={{ fontSize: '28px', marginBottom: '4px' }}>📞 Calls Focus Mode</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Enter focus dial mode. Track conversations, consult objection response cards, verify discovery checklists, and log bookings.
        </p>
      </div>

      {!inCall ? (
        <div 
          className="card-panel" 
          style={{ 
            padding: '40px', 
            textAlign: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '16px',
            maxWidth: '500px',
            margin: '40px auto'
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(124, 92, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Phone size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Ready to Dial?</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Start focus mode to load call timers, objection response cards, and live notes logger.
            </p>
          </div>
          <button 
            onClick={handleStartCall}
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: '14px', marginTop: '10px' }}
          >
            Start Active Call Mode
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>
          
          {/* Main workspace */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Call timer header bar */}
            <div className="card-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: 'var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="spin-slow" style={{ display: 'inline-flex', color: 'var(--danger)' }}>
                  <PhoneOff size={20} />
                </span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>Active Call Focus Mode</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Avoid distraction. Track notes below.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 800 }}>
                <Clock size={18} color="var(--primary)" />
                <span>{formatTime(seconds)}</span>
              </div>
            </div>

            {/* Live notes logger textarea */}
            <div className="card-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>LIVE CONVERSATION NOTES</label>
              <textarea 
                className="input-field" 
                rows={6}
                placeholder="Type details during call... e.g. Owner name Julie, currently using Mindbody, open to checking busy phone drop-outs next week..."
                value={liveNotes}
                onChange={e => setLiveNotes(e.target.value)}
              />
            </div>

            {/* Objection responses assistant */}
            <div className="card-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Brain size={15} color="var(--primary)" /> Coached Objection Response Scripts
              </h4>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { id: 'pricing', label: '💵 Pricing' },
                  { id: 'timing', label: '⏳ Timing' },
                  { id: 'trust', label: '🛡️ Trust' },
                  { id: 'agency', label: '🔄 Agency' }
                ].map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => setActiveObjection(activeObjection === obj.id ? null : obj.id)}
                    className="btn-secondary"
                    style={{
                      flex: 1,
                      fontSize: '12px',
                      padding: '8px',
                      background: activeObjection === obj.id ? 'rgba(124,92,255,0.08)' : 'transparent',
                      borderColor: activeObjection === obj.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                      color: activeObjection === obj.id ? '#fff' : 'var(--text-secondary)'
                    }}
                  >
                    {obj.label}
                  </button>
                ))}
              </div>

              {/* Objection response script box */}
              {activeObjection && (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(124,92,255,0.15)', borderRadius: '6px', padding: '14px', fontSize: '13px', lineHeight: '1.4' }}>
                  <div style={{ fontWeight: 700, color: 'var(--secondary)', marginBottom: '6px' }}>
                    {activeObjection.toUpperCase()} Response Script
                  </div>
                  
                  {activeObjection === 'pricing' && (
                    <p style={{ fontStyle: 'italic' }}>
                      "I understand budget is top of mind. We actually build tests mapping busy phone lines coordinate dropouts. If Zoca doesn't book you at least 3 meetings in month 1, you pay $0. We put our money where our mouth is."
                    </p>
                  )}
                  {activeObjection === 'timing' && (
                    <p style={{ fontStyle: 'italic' }}>
                      "Totally get it, busy quarter. Checking map settings takes 5 minutes, and we verify traffic leaks. Would you mind if we sync coordinates now so you have it ready whenever you revisit next quarter?"
                    </p>
                  )}
                  {activeObjection === 'trust' && (
                    <p style={{ fontStyle: 'italic' }}>
                      "Fair enough. We verified Bloom Center and Julie's busy lines. We coordinates Mindbody checkout drop-off rates directly. You don't have to trust us, we let coordinates verify checkout friction."
                    </p>
                  )}
                  {activeObjection === 'agency' && (
                    <p style={{ fontStyle: 'italic' }}>
                      "Understood. Agency partners do a design job. Rather, we found that standard widgets leak about 20% of traffic. Would you mind if I sent over Ashish's Agency checklist so your partners can check that themselves?"
                    </p>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Sidebar checklist & actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Discovery checklist */}
            <div className="card-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                Discovery Checklist
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                {[
                  { id: 'verifyCoordinates', label: 'Verify profile coords' },
                  { id: 'confirmGatekeeper', label: 'Confirm gatekeeper' },
                  { id: 'askTrafficOrigin', label: 'Ask traffic source' },
                  { id: 'validateAgencyStatus', label: 'Check agency status' }
                ].map((item) => (
                  <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={(discoveryChecks as any)[item.id]}
                      onChange={() => setDiscoveryChecks(prev => ({ ...prev, [item.id]: !(prev as any)[item.id] }))}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quick Outcome Logger panel */}
            <div className="card-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                Log Call Outcome
              </h4>
              
              <button 
                onClick={() => handleLogCallOutcome('Won')}
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', background: 'var(--success)', boxShadow: 'none', fontSize: '12.5px' }}
              >
                🏆 Won (Booked Demo)
              </button>
              
              <button 
                onClick={() => handleLogCallOutcome('Lost', 'pricing')}
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'center', fontSize: '12px', color: '#fca5a5' }}
              >
                💔 Lost Objection
              </button>

              <button 
                onClick={() => handleLogCallOutcome('NoAnswer')}
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}
              >
                🔇 No Answer
              </button>

              <button 
                onClick={() => handleLogCallOutcome('CallBack')}
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}
              >
                📅 Call Back / Reschedule
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
export default CallModeModule;
