import React from 'react';

interface WorkspaceItem {
  id: string;
  name: string;
  lastOpened: string;
  stage: string;
}

interface RecentProps {
  workspaces: WorkspaceItem[];
  onResume: (id: string) => void;
}

export const Recent: React.FC<RecentProps> = ({ workspaces, onResume }) => {
  return (
    <section className="launch-section">
      <h2 className="launch-section-heading">Recent</h2>
      <div className="recent-list">
        {workspaces.map((item) => (
          <div key={item.id} className="recent-row">
            <div className="recent-company-group">
              <span className="recent-company">{item.name}</span>
            </div>
            <div className="recent-meta-group">
              <span className="recent-time">{item.lastOpened}</span>
              <span className="recent-stage">{item.stage}</span>
              <button 
                onClick={() => onResume(item.id)} 
                className="recent-resume"
              >
                Resume &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Recent;
