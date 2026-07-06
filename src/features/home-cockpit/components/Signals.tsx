import React, { useState } from 'react';

interface SignalItem {
  id: string;
  text: string;
  detail: string;
}

interface SignalsProps {
  signals?: SignalItem[];
}

export const Signals: React.FC<SignalsProps> = ({ signals }) => {
  const defaultSignals: SignalItem[] = [
    { id: '1', text: 'Competitor Vagaro reduced core pricing by 15%', detail: 'Competitor Vagaro announced a 15% discount on their merchant processing rates for new dental and spa clients.' },
    { id: '2', text: 'Prospect Tawana hired VP of Sales', detail: 'Tawana recently hired a new VP of Sales, who is reviewing all pipeline tools and onboarding processes.' },
    { id: '3', text: 'Website changed to feature digital booking', detail: 'Glow Med Spa updated their homepage to emphasize real-time online appointment bookings.' },
    { id: '4', text: '3 new Google reviews posted', detail: 'Natural Forte received three new 5-star Google reviews focusing on customer service speeds.' }
  ];

  const activeSignals = signals || defaultSignals;
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);

  const toggleDetail = (id: string) => {
    setActiveDetailId(prev => prev === id ? null : id);
  };

  return (
    <section className="launch-section">
      <h2 className="launch-section-heading">Signals</h2>
      <div className="signals-list">
        {activeSignals.map((item) => (
          <div key={item.id} className="signals-container-item">
            <div className="signals-item">
              <span className="signals-text">• {item.text}</span>
              <button 
                onClick={() => toggleDetail(item.id)} 
                className="signals-action"
              >
                {activeDetailId === item.id ? 'Hide Details' : 'View Details'}
              </button>
            </div>
            {activeDetailId === item.id && (
              <div className="signals-detail-panel">
                <p className="signals-detail-text">{item.detail}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Signals;
