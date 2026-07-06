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
    <section className="launch-section">
      <h2 className="launch-section-heading">Continue</h2>
      <div className="continue-details">
        <div className="continue-title">{businessName}</div>
        <div className="launch-meta">{timeDetail}</div>
        <div className="launch-meta-signal">{signalDetail}</div>
        <div className="launch-link-spacing">
          <button onClick={onOpenWorkspace} className="launch-link">
            Open Workspace &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Continue;
