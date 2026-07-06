import React from 'react';

interface ContinueProps {
  businessName: string;
  timeDetail: string;
  signalDetail: string;
  onOpenWorkspace: () => void;
}

export const Continue: React.FC<ContinueProps> = ({
  businessName,
  timeDetail,
  signalDetail,
  onOpenWorkspace
}) => {
  return (
    <section className="launch-section" style={{ gap: '8px' }}>
      <span style={{ fontSize: '10px', color: '#71717A', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Continue
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 500, color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0 }}>
          {businessName}
        </h2>
        <div style={{ fontSize: '14px', color: '#A1A1AA', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span>{timeDetail}</span>
          <span>•</span>
          <span style={{ color: '#22C55E', fontWeight: 500 }}>{signalDetail}</span>
        </div>
        <div style={{ marginTop: '12px' }}>
          <button 
            onClick={onOpenWorkspace} 
            className="btn-primary"
            style={{ padding: '8px 20px', fontSize: '13px' }}
          >
            Open Workspace &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Continue;
