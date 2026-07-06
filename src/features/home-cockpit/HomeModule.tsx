import React, { useState, useEffect } from 'react';
import { useSessionEngine } from '../../core/session-engine/SessionContext';
import type { Session } from '../../contracts/Session';

// Modular Components
import PageHeading from './components/PageHeading';
import Continue from './components/Continue';
import Today from './components/Today';
import Signals from './components/Signals';
import Recent from './components/Recent';

// Launch CSS styling (no inline styles allowed)
import './Launch.css';

interface HomeModuleProps {
  onOpenOutreach: (sessionId: string) => void;
  onStartAnalysis: (businessName: string) => void;
  onStartCall: (businessName: string) => void;
}

export const HomeModule: React.FC<HomeModuleProps> = (props) => {
  const { onOpenOutreach, onStartAnalysis } = props;
  const { manager } = useSessionEngine();
  const [sessions, setSessions] = useState<Session[]>([]);

  // Load sessions from local database
  const loadSessions = async () => {
    try {
      const list = await manager.listSessions('analyzer');
      // Sort with latest modified first using string localeCompare
      const sorted = [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      setSessions(sorted);
    } catch (e) {
      console.error("Failed loading sessions:", e);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // Determine active/priority deal to continue
  const getPriorityDeal = () => {
    if (sessions.length === 0) {
      return {
        id: 'mock-tawana',
        businessName: 'Tawana',
        timeDetail: 'Meeting in 2 hours',
        signalDetail: 'Deal signals improving',
        isMock: true
      };
    }
    // Prioritize Tawana if present, otherwise get the latest modified
    const tawana = sessions.find(s => s.businessName?.toLowerCase().includes('tawana'));
    const active = tawana || sessions[0];
    return {
      id: active.id,
      businessName: active.businessName || 'Tawana',
      timeDetail: 'Meeting in 2 hours',
      signalDetail: active.payload?.timelineLogs?.length > 0 ? 'Recent action logged' : 'Deal signals improving',
      isMock: false
    };
  };

  const priorityDeal = getPriorityDeal();

  const handleOpenWorkspace = () => {
    if (priorityDeal.isMock) {
      onStartAnalysis(priorityDeal.businessName);
    } else {
      onOpenOutreach(priorityDeal.id);
    }
  };

  const handleResumeWorkspace = (sessionId: string) => {
    onOpenOutreach(sessionId);
  };

  // Helper for relative timestamps parsing ISO strings
  const formatRelativeTime = (timeStr: string) => {
    const timestamp = new Date(timeStr).getTime();
    if (isNaN(timestamp)) return 'Recently';
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Map database sessions to minimalist Recent listing
  const mappedRecentWorkspaces = sessions.slice(0, 5).map(s => ({
    id: s.id,
    name: s.businessName,
    lastOpened: formatRelativeTime(s.updatedAt),
    stage: s.payload.dealStage || 'Discovery'
  }));

  return (
    <div className="launch-container">
      {/* 1. Greeting & Page Identity */}
      <PageHeading />

      {/* 2. Primary Active Workspace focus */}
      <Continue 
        businessName={priorityDeal.businessName}
        timeDetail={priorityDeal.timeDetail}
        signalDetail={priorityDeal.signalDetail}
        onOpenWorkspace={handleOpenWorkspace}
      />

      {/* 3. Timeline Today */}
      <Today />

      {/* 4. Intelligence Feed */}
      <Signals />

      {/* 5. Recent workspaces history */}
      {mappedRecentWorkspaces.length > 0 && (
        <Recent 
          workspaces={mappedRecentWorkspaces}
          onResume={handleResumeWorkspace}
        />
      )}
    </div>
  );
};

export default HomeModule;
