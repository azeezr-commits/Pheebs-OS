import React, { useState, useEffect } from 'react';
import { useSessionEngine } from '../../core/session-engine/SessionContext';
import type { Session } from '../../contracts/Session';
import { CompareModeView } from './CompareModeView';
import { 
  Search, 
  Pin, 
  Archive, 
  Trash2, 
  Layers
} from 'lucide-react';

interface VaultModuleProps {
  setActiveTab: (tab: 'dashboard' | 'analyzer' | 'outreach' | 'practice' | 'vault' | 'settings' | 'workspace') => void;
  preloadedSessionId?: string | null;
  onClearPreload?: () => void;
  onSelectSession?: (sessionId: string) => void;
}

export const VaultModule: React.FC<VaultModuleProps> = ({ 
  setActiveTab, 
  preloadedSessionId, 
  onClearPreload,
  onSelectSession
}) => {
  const { manager } = useSessionEngine();
  
  // State
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'Newest' | 'Oldest' | 'Highest Confidence'>('Newest');
  
  // Compare state
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  
  // Detail state
  const [viewingSession, setViewingSession] = useState<Session | null>(null);

  // Load and refresh sessions list
  const refreshList = async () => {
    const list = await manager.listSessions();
    setSessions(list);
    
    // Auto-update viewingSession if it is open to pick up changes
    if (viewingSession) {
      const refreshed = list.find(s => s.id === viewingSession.id);
      if (refreshed) {
        setViewingSession(refreshed);
      } else {
        setViewingSession(null);
      }
    }
  };

  useEffect(() => {
    refreshList();
  }, []);

  useEffect(() => {
    if (preloadedSessionId) {
      const loadPreload = async () => {
        const list = await manager.listSessions();
        const found = list.find(s => s.id === preloadedSessionId);
        if (found) {
          setViewingSession(found);
        }
        if (onClearPreload) {
          onClearPreload();
        }
      };
      loadPreload();
    }
  }, [preloadedSessionId]);



  const handleTogglePin = async (id: string, currentPin: boolean) => {
    try {
      await manager.pinSession(id, !currentPin);
      refreshList();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleArchive = async (id: string) => {
    try {
      await manager.archiveSession(id);
      refreshList();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this session permanently?')) {
      try {
        await manager.deleteSession(id);
        refreshList();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleViewDetail = async (session: Session) => {
    try {
      await manager.viewSession(session.id);
      if (onSelectSession) {
        onSelectSession(session.id);
      } else {
        setViewingSession(session);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCompareCheck = (id: string) => {
    setSelectedForCompare(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filter & Search Logic
  const getFilteredSessions = () => {
    return sessions.filter((s) => {
      // 1. Search query matching
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        (s.businessName || '').toLowerCase().includes(query) ||
        (s.title || '').toLowerCase().includes(query) ||
        (s.summary || '').toLowerCase().includes(query) ||
        (s.anchor || '').toLowerCase().includes(query) ||
        (s.tags || []).some(t => (t || '').toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // 2. Filter mapping
      if (activeFilter === 'All') return !s.archived;
      if (activeFilter === 'Archived') return !!s.archived;
      if (activeFilter === 'analyzer') return s.type === 'analyzer' && !s.archived;
      
      if (activeFilter === 'objections') {
        return (!!s.payload.strategyProblem || s.type === 'mock') && !s.archived;
      }
      
      if (activeFilter === 'winning') {
        return !!s.payload.outreach?.coldEmail && !s.archived;
      }
      
      if (activeFilter === 'lost') {
        const logs = s.payload.timelineLogs || [];
        return logs.some((l: any) => l.text.toLowerCase().includes('lost')) && !s.archived;
      }
      
      if (activeFilter === 'coach') {
        return (!!s.privateNotes || !!s.payload.privateNotes) && !s.archived;
      }
      
      if (activeFilter === 'dna') {
        const score = s.confidence || s.payload.briefing?.confidenceScore || 0;
        return score >= 80 && !s.archived;
      }

      return !s.archived;
    }).sort((a, b) => {
      // 3. Sorting logic
      if (sortBy === 'Oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'Highest Confidence') {
        return b.confidence - a.confidence;
      }
      // Default: Newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const filteredSessions = getFilteredSessions();

  // Statistics counters
  const stats = {
    analyzer: sessions.filter(s => s.type === 'analyzer' && !s.archived).length,
    mock: sessions.filter(s => s.type === 'mock' && !s.archived).length,
    coach: sessions.filter(s => s.type === 'coach' && !s.archived).length,
    pinned: sessions.filter(s => s.pinned && !s.archived).length
  };

  return (
    <div style={{ width: '100%' }}>
      {isComparing ? (
        /* RENDER COMPARE SIDE-BY-SIDE */
        <CompareModeView 
          selectedSessions={sessions.filter(s => selectedForCompare.includes(s.id))}
          onBack={() => setIsComparing(false)}
        />
      ) : (
        /* RENDER EXPLORER HOME SCREEN */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* 1. Statistics Top Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '16px'
          }}>
            {[
              { label: 'Business Analysis', value: stats.analyzer, color: 'var(--secondary)' },
              { label: 'Mock Calls', value: stats.mock, color: 'var(--primary)' },
              { label: 'Coach Sessions', value: stats.coach, color: 'var(--danger)' },
              { label: 'Objections Logged', value: sessions.filter(s => s.payload.timelineLogs?.some((t: any) => t.text.includes('Outcome: Lost'))).length, color: 'var(--success)' },
              { label: 'Pinned Lesson Seeds', value: stats.pinned, valueColor: 'var(--warning)', color: 'rgba(255,255,255,0.04)' }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="card-panel" 
                style={{ 
                  padding: '14px', 
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.01)',
                  borderBottom: `2px solid ${stat.color}`
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>{stat.label.toUpperCase()}</div>
                <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px', color: stat.valueColor || '#fff' }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Large Search-first Obsidian layout */}
          <div className="card-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search Anything... (e.g. SEO, Objections, Glow Med Spa)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '44px', paddingRight: '16px', fontSize: '15px', padding: '14px 18px', width: '100%' }}
              />
              <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
            </div>
            
            {/* Tag pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, marginRight: '4px' }}>RECOMMENDED TAGS:</span>
              {['SEO', 'Objections', 'Glow Med Spa', 'Pricing', 'Dental', 'Winning Calls'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    setActiveFilter('All');
                  }}
                  className="btn-secondary"
                  style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '11px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    background: searchQuery === tag ? 'rgba(124, 92, 255, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    borderColor: searchQuery === tag ? 'var(--primary)' : 'rgba(255, 255, 255, 0.06)',
                    color: searchQuery === tag ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Actions Toolbar Header */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', alignItems: 'center' }}>
            {/* Compare Trigger Button */}
            {selectedForCompare.length > 0 && (
              <button
                onClick={() => setIsComparing(true)}
                disabled={selectedForCompare.length < 2}
                className="btn-primary"
                style={{
                  background: 'linear-gradient(135deg, var(--secondary) 0%, #0891b2 100%)',
                  boxShadow: 'none',
                  fontSize: '12px',
                  padding: '8px 14px'
                }}
              >
                Compare ({selectedForCompare.length})
              </button>
            )}

            {/* Sorting */}
            <select
              className="input-field"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              style={{ width: '180px', fontSize: '13px', padding: '8px 12px', appearance: 'none', background: 'rgba(9,9,12,0.8)' }}
            >
              <option value="Newest">Sort: Newest</option>
              <option value="Oldest">Sort: Oldest</option>
              <option value="Highest Confidence">Sort: High Confidence</option>
            </select>

            {/* Quick Sprint buttons */}
            <button onClick={() => setActiveTab('analyzer')} className="btn-primary" style={{ fontSize: '13px', padding: '8px 14px' }}>
              ＋ New Analysis
            </button>
            
            <button 
              onClick={() => alert('Practice Engine drills are active under the Practice tab.')} 
              className="btn-secondary" 
              style={{ fontSize: '13px', padding: '8px 14px' }}
            >
              🎤 New Mock
            </button>
          </div>

          {/* 3. Grid Workspace */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '230px 1fr',
            gap: '24px',
            alignItems: 'start'
          }}>
            {/* Sidebar filter index */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Brain node links list */}
              <div className="card-panel" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', padding: '6px 8px' }}>BRAIN NODES</span>
                {[
                  { id: 'All', name: 'All Nodes' },
                  { id: 'analyzer', name: 'Businesses' },
                  { id: 'objections', name: 'Objections' },
                  { id: 'winning', name: 'Winning Emails' },
                  { id: 'lost', name: 'Lost Deals' },
                  { id: 'coach', name: 'Coach Notes' },
                  { id: 'dna', name: 'DNA' },
                  { id: 'Archived', name: 'Archived' }
                ].map((item) => {
                  const isActive = activeFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveFilter(item.id); setSelectedForCompare([]); }}
                      style={{
                        padding: '8px 12px',
                        border: 'none',
                        background: isActive ? 'rgba(124,92,255,0.1)' : 'transparent',
                        color: isActive ? '#fff' : 'var(--text-secondary)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        textAlign: 'left',
                        fontWeight: isActive ? 600 : 500
                      }}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Session cards ledger */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredSessions.length === 0 ? (
                /* EMPTY STATE BOARD */
                <div className="card-panel" style={{
                  padding: '60px 40px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <Layers size={48} color="var(--text-muted)" style={{ opacity: 0.6 }} />
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Nothing here yet.</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px', maxWidth: '350px', margin: '4px auto 0 auto', lineHeight: '1.5' }}>
                      Every analysis you create will become a permanent part of your sales learning memory brain.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('analyzer')} 
                    className="btn-primary"
                    style={{ fontSize: '13px' }}
                  >
                    Run First Analysis
                  </button>
                </div>
              ) : (
                /* CARDS LIST */
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: '16px'
                }}>
                  {filteredSessions.map((session) => (
                    <div 
                      key={session.id}
                      className="card-panel"
                      style={{
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        border: '1px solid rgba(255,255,255,0.03)',
                        background: 'rgba(22, 22, 33, 0.45)',
                        position: 'relative',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      {/* Compare Checkbox */}
                      <input 
                        type="checkbox"
                        checked={selectedForCompare.includes(session.id)}
                        onChange={() => handleToggleCompareCheck(session.id)}
                        style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          accentColor: 'var(--secondary)',
                          cursor: 'pointer'
                        }}
                      />

                      {/* Header */}
                      <div onClick={() => handleViewDetail(session)} style={{ cursor: 'pointer' }}>
                        <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.05em' }}>
                          {(session.type || 'session').toUpperCase()}
                        </span>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, marginTop: '2px', color: '#fff' }}>
                          {session.businessName || 'General Session'}
                        </h4>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>

                      {/* Metadata row */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        background: 'rgba(0,0,0,0.12)',
                        padding: '6px 10px',
                        borderRadius: '4px'
                      }}>
                        <span>⭐ Conf: {session.confidence || 0}%</span>
                        {session.anchor && (
                          <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>🎯 Anchor: Visible</span>
                        )}
                      </div>

                      {/* Folder badges */}
                      {(session.collections || []).length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {(session.collections || []).map((col) => (
                            <span key={col} style={{
                              fontSize: '9px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'rgba(16,185,129,0.08)',
                              color: 'var(--success)',
                              border: '1px solid rgba(16,185,129,0.15)'
                            }}>
                              {col.replace('⭐ ', '')}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Operations */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        paddingTop: '10px',
                        marginTop: 'auto'
                      }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleTogglePin(session.id, session.pinned)}
                            style={{ background: 'transparent', border: 'none', color: session.pinned ? 'var(--warning)' : 'var(--text-muted)', cursor: 'pointer' }}
                          >
                            <Pin size={12} fill={session.pinned ? 'var(--warning)' : 'transparent'} />
                          </button>
                          <button 
                            onClick={() => handleToggleArchive(session.id)}
                            style={{ background: 'transparent', border: 'none', color: session.archived ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer' }}
                          >
                            <Archive size={12} />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleDelete(session.id)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
