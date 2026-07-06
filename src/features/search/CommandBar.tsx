import React, { useState, useEffect, useRef } from 'react';
import { useSessionEngine } from '../../core/session-engine/SessionContext';
import type { Session } from '../../contracts/Session';
import { 
  Search, 
  Terminal, 
  SearchCode, 
  Send, 
  Target, 
  Settings, 
  History,
  CornerDownLeft,
  Brain
} from 'lucide-react';

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: 'dashboard' | 'analyzer' | 'vault' | 'settings' | 'workspace') => void;
  onSelectSession: (sessionId: string) => void;
}

export const CommandBar: React.FC<CommandBarProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  onSelectSession
}) => {
  const { manager } = useSessionEngine();
  const [query, setQuery] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      
      const load = async () => {
        const list = await manager.listSessions('analyzer');
        setSessions(list);
      };
      load();
    }
  }, [isOpen]);

  // Handle command submission
  const executeCommand = (cmd: CommandItem) => {
    onClose();
    if (cmd.type === 'tab') {
      if (cmd.action === 'vault-lost') {
        setActiveTab('vault');
      } else if (cmd.action === 'upload') {
        alert('Call recording audio upload is locked for Sprint 4. Ready in next release.');
      } else if (cmd.action === 'ask') {
        alert('AI Coach Chat is loading... Open Home tab to review dynamic coach prompts.');
      } else {
        setActiveTab(cmd.action as any);
      }
    } else if (cmd.type === 'session') {
      onSelectSession(cmd.action);
    }
  };

  // Keyboard navigation inside Command Bar
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(filtered.length - 1, prev + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          executeCommand(filtered[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, query, sessions]);

  if (!isOpen) return null;

  interface CommandItem {
    id: string;
    name: string;
    desc: string;
    icon: React.ReactNode;
    type: 'tab' | 'session';
    action: string;
  }

  // Core static command options
  const defaultCommands: CommandItem[] = [
    { id: 'c-analyze', name: 'Analyze Business', desc: 'Scan a new prospect website for leaks', icon: <SearchCode size={16} />, type: 'tab', action: 'analyzer' },
    { id: 'c-email', name: 'Generate Email', desc: 'Generate high-value consultative cold drafts', icon: <Send size={16} />, type: 'tab', action: 'outreach' },
    { id: 'c-practice', name: 'Practice Pricing', desc: 'Duolingo-style pricing objection drill', icon: <Target size={16} />, type: 'tab', action: 'practice' },
    { id: 'c-lost', name: 'Show Lost Deals', desc: 'View objection reasons in Obsidian notes', icon: <History size={16} />, type: 'tab', action: 'vault-lost' },
    { id: 'c-upload', name: 'Upload Call Recording', desc: 'Analyze MP3/WAV audio for coach feedback', icon: <History size={16} />, type: 'tab', action: 'upload' },
    { id: 'c-ask', name: 'Ask Pheebs', desc: 'Chat with your AI coach about deal objection handling', icon: <Brain size={16} />, type: 'tab', action: 'ask' },
    { id: 'c-settings', name: 'Settings Options', desc: 'Configure AE cockpit thresholds', icon: <Settings size={16} />, type: 'tab', action: 'settings' }
  ];

  // Dynamic prospect sessions options
  const prospectCommands: CommandItem[] = sessions.map(s => ({
    id: `s-${s.id}`,
    name: `Open ${s.businessName}`,
    desc: `Launch Prospect Workspace for ${s.businessName}`,
    icon: <SearchCode size={16} color="var(--secondary)" />,
    type: 'session',
    action: s.id
  }));

  const allItems = [...defaultCommands, ...prospectCommands];

  const filtered = allItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 5, 8, 0.75)',
      backdropFilter: 'blur(10px)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '100px'
    }} onClick={onClose}>
      
      {/* Search Console box */}
      <div 
        style={{
          width: '600px',
          maxHeight: '440px',
          background: '#18181B',
          border: '1px solid #2C2C2F',
          borderRadius: '8px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <Search size={18} color="var(--text-secondary)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or prospect name..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '16px',
              outline: 'none',
              flex: 1,
              fontFamily: 'var(--font-body)'
            }}
          />
          <span style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.02)'
          }}>ESC</span>
        </div>

        {/* Results Stream list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {filtered.length === 0 ? (
            <div style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
              padding: '24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Terminal size={24} style={{ opacity: 0.6 }} />
              No matching commands or prospects found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => executeCommand(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    background: isSelected ? '#3B3B40' : 'transparent',
                    border: '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      color: isSelected ? '#FFFFFF' : '#A1A1AA'
                    }}>{item.icon}</div>
                    <div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: isSelected ? '#FFFFFF' : '#FFFFFF'
                      }}>{item.name}</div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        marginTop: '2px'
                      }}>{item.desc}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '10px',
                      color: '#FFFFFF',
                      fontWeight: 600
                    }}>
                      Select <CornerDownLeft size={10} />
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
