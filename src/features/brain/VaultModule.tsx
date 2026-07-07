import React, { useState, useEffect } from 'react';
import { useSessionEngine } from '../../core/session-engine/SessionContext';
import type { Session } from '../../contracts/Session';
import { ProspectWorkspace } from '../workspace/ProspectWorkspace';

interface VaultModuleProps {
  setActiveTab: (tab: 'dashboard' | 'analyzer' | 'outreach' | 'practice' | 'vault' | 'settings' | 'workspace') => void;
  preloadedSessionId?: string | null;
  onClearPreload?: () => void;
  onSelectSession?: (sessionId: string) => void;
}

export const VaultModule: React.FC<VaultModuleProps> = ({ 
  setActiveTab: _setActiveTab, 
  preloadedSessionId, 
  onClearPreload,
  onSelectSession: _onSelectSession
}) => {
  const { manager } = useSessionEngine();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const loadData = async () => {
    const list = await manager.listSessions('analyzer');
    setSessions(list);
    
    // Choose active/selected session
    if (preloadedSessionId) {
      setSelectedSessionId(preloadedSessionId);
      if (onClearPreload) onClearPreload();
    } else if (list.length > 0 && !selectedSessionId) {
      const brightSmile = list.find(s => s.businessName.toLowerCase().includes('smile'));
      setSelectedSessionId(brightSmile ? brightSmile.id : list[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, [preloadedSessionId]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '40px', minHeight: '100%', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* Left side: Case Files List */}
      <div style={{ borderRight: '1px solid #2C2C2F', paddingRight: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '10px', color: '#71717A', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Case Files
          </span>
          <p style={{ fontSize: '13px', color: '#71717A', marginTop: '2px' }}>
            Select a deal brain
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sessions.map(s => {
            const isSelected = s.id === selectedSessionId;
            const isHot = s.businessName.toLowerCase().includes('smile') || s.businessName.toLowerCase().includes('tawana');
            const color = isHot ? '#EF4444' : '#F97316';

            return (
              <button
                key={s.id}
                onClick={() => setSelectedSessionId(s.id)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  textAlign: 'left',
                  background: isSelected ? '#18181B' : 'transparent',
                  border: isSelected ? '1px solid #2C2C2F' : '1px solid transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.background = '#18181B';
                    e.currentTarget.style.borderColor = '#2C2C2F';
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF' }}>
                    {s.businessName}
                  </span>
                  <span style={{ fontSize: '11px', color: '#71717A' }}>
                    {s.payload.briefing?.niche || s.payload.niche || 'B2C'} • {s.payload.briefing?.confidenceScore || 90}% match
                  </span>
                </div>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side: Beliefs Dossier Workspace */}
      {selectedSessionId ? (
        <div style={{ maxHeight: '100vh', overflowY: 'auto', paddingRight: '12px' }}>
          <ProspectWorkspace 
            sessionId={selectedSessionId} 
            onBack={() => {}} 
            onStartCall={() => {}}
            hideBackButton={true}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717A', fontSize: '14px' }}>
          No active case files found. Go to runway to trigger an audit.
        </div>
      )}

    </div>
  );
};

export default VaultModule;
