import React, { useState } from 'react';

interface SignalItem {
  id: string;
  text: string;
  time: string;
  detail: string;
}

interface SignalsProps {
  signals?: SignalItem[];
}

export const Signals: React.FC<SignalsProps> = ({ signals }) => {
  const defaultSignals: SignalItem[] = [
    { 
      id: '1', 
      text: 'Competitor Vagaro reduced core pricing by 15%', 
      time: '2h ago',
      detail: 'Vagaro announced a 15% discount on merchant processing rates for new aesthetic clinics, increasing competitive pressure.' 
    },
    { 
      id: '2', 
      text: 'Bright Smile Orthodontics hired new Practice Coordinator', 
      time: 'Yesterday',
      detail: 'Bright Smile Orthodontics hired a new coordinator, who is currently auditing booking friction and conversions.' 
    },
    { 
      id: '3', 
      text: 'Evergreen Dental updated homepage checkout widget', 
      time: '2d ago',
      detail: 'Evergreen Dental updated their main site to emphasize online bookings, leaving them vulnerable to drop-out leaks.' 
    },
    { 
      id: '4', 
      text: 'Dental Care Associates received 3 negative reviews', 
      time: '3d ago',
      detail: 'Dental Care Associates received three new 2-star reviews citing long phone wait times, creating an ideal opening for a speed audit.' 
    }
  ];

  const activeSignals = signals || defaultSignals;
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);

  const toggleDetail = (id: string) => {
    setActiveDetailId(prev => prev === id ? null : id);
  };

  return (
    <section className="launch-section">
      <h2 className="launch-section-heading">Signals</h2>
      <div className="signals-list" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {activeSignals.map((item) => (
          <div 
            key={item.id} 
            className="signals-container-item" 
            style={{ 
              borderBottom: '1px solid #2C2C2F', 
              padding: '16px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'baseline', 
                gap: '16px' 
              }}
            >
              <span style={{ fontSize: '14.5px', color: '#E4E4E7', lineHeight: '1.5' }}>
                {item.text}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                <span style={{ fontSize: '13px', color: '#71717A' }}>{item.time}</span>
                <button 
                  onClick={() => toggleDetail(item.id)} 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#A1A1AA',
                    fontSize: '13px',
                    cursor: 'pointer',
                    padding: 0,
                    fontWeight: 500,
                    textDecoration: 'underline'
                  }}
                >
                  {activeDetailId === item.id ? 'Hide' : 'View'}
                </button>
              </div>
            </div>
            
            {activeDetailId === item.id && (
              <div 
                style={{ 
                  fontSize: '13.5px', 
                  color: '#A1A1AA', 
                  lineHeight: '1.6', 
                  paddingLeft: '12px',
                  borderLeft: '2px solid #3B3B40',
                  marginTop: '4px',
                  animation: 'fadeInDetail 150ms ease-out forwards'
                }}
              >
                {item.detail}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Signals;
