import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

export const AnalyticsModule: React.FC = () => {
  const [showRevenueDetails, setShowRevenueDetails] = useState(false);
  const [closedDeals, setClosedDeals] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = localStorage.getItem('pheebs_outcome_stats');
        if (stored) {
          const stats = JSON.parse(stored);
          setClosedDeals(1 + (stats.outcomes?.won || 0));
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const closedARR = closedDeals * 2400;
  const targetARR = 9600;
  const remainingARR = Math.max(0, targetARR - closedARR);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '30px' }}>
      
      <div>
        <h1 className="title-gradient" style={{ fontSize: '28px', marginBottom: '4px' }}>📈 Performance Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Evaluate conversion drop-off funnels, ARR forecast thresholds, and activity heatmaps.
        </p>
      </div>

      {/* Grid: Revenue & Funnel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* Card 1: Revenue Scoreboard (Progressive Disclosure) */}
        <div className="card-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>CLOSED REVENUE ARR</span>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>
                ${closedARR.toLocaleString()}
              </div>
            </div>
            
            <button 
              onClick={() => setShowRevenueDetails(!showRevenueDetails)}
              className="btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                padding: '6px 12px'
              }}
            >
              {showRevenueDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />} 
              {showRevenueDetails ? 'Hide Details' : 'View Details'}
            </button>
          </div>

          {showRevenueDetails && (
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '16px', 
                paddingTop: '16px', 
                borderTop: '1px dashed rgba(255,255,255,0.06)',
                fontSize: '13px',
                color: 'var(--text-secondary)'
              }}
            >
              <div>
                <span>Pipeline Value</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>$12,000</div>
              </div>
              <div>
                <span>Forecast ARR</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--secondary)', marginTop: '2px' }}>$7,200</div>
              </div>
              <div>
                <span>Goal Target</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>$9,600</div>
              </div>
              <div>
                <span style={{ color: 'var(--danger)' }}>Remaining Quota</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--danger)', marginTop: '2px' }}>
                  ${remainingARR.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Funnel rates */}
        <div className="card-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
            July Sales Conversion Funnel
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
            {[
              { stage: 'Businesses Identified', val: 132, conv: '67%' },
              { stage: 'Emails Delivered', val: 89, conv: '24%' },
              { stage: 'Conversations Sourced', val: 21, conv: '19%' },
              { stage: 'Meetings Scheduled', val: 4, conv: '50%' },
              { stage: 'Demos Held', val: 2, conv: '50%' },
              { stage: 'Deals Won', val: closedDeals }
            ].map((f, idx) => (
              <React.Fragment key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{f.stage}</span>
                  <span style={{ fontWeight: 700 }}>{f.val}</span>
                </div>
                {f.conv && (
                  <div style={{ fontSize: '10.5px', color: 'var(--primary)', textAlign: 'center', padding: '1px 0' }}>
                    ↓ {f.conv} conversion
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Weekly Heatmap & Activity Trends */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Heatmap */}
        <div className="card-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
            Weekly Conversion Heatmap
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginTop: '4px' }}>
            {[
              { day: 'Monday', bars: '█████', count: '2 Meetings booked', color: 'var(--success)' },
              { day: 'Tuesday', bars: '██', count: '0 Meetings', color: 'var(--text-muted)' },
              { day: 'Wednesday', bars: '████████', count: '3 Meetings booked', color: 'var(--success)' },
              { day: 'Thursday', bars: '███', count: '0 Meetings', color: 'var(--text-muted)' },
              { day: 'Friday', bars: '██████', count: '1 Meeting booked', color: 'var(--secondary)' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '90px 120px 1fr', gap: '10px', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{item.day}</span>
                <span style={{ color: item.color, fontFamily: 'monospace', letterSpacing: '2px', fontSize: '14px' }}>{item.bars}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Trends info */}
        <div className="card-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
            Historical Pipeline Trends
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Average Sales Cycle Duration</span>
              <strong style={{ color: '#fff' }}>6.2 Days</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Primary Objections Channel</span>
              <strong style={{ color: '#fca5a5' }}>Pricing objections (40% of losses)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Best Email Outreach Template</span>
              <strong style={{ color: 'var(--success)' }}>Consultative / Phone Sync Hook</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default AnalyticsModule;
