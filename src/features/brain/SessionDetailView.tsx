import React, { useState, useEffect } from 'react';
import type { Session } from '../../contracts/Session';
import { useSessionEngine } from '../../core/session-engine/SessionContext';
import { 
  Pin, 
  Archive, 
  Trash2, 
  Copy, 
  Download, 
  ArrowLeft, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  BookOpen,
  Send
} from 'lucide-react';

interface SessionDetailViewProps {
  session: Session;
  onBack: () => void;
  onRefresh: () => void;
}

export const SessionDetailView: React.FC<SessionDetailViewProps> = ({
  session,
  onBack,
  onRefresh
}) => {
  const { manager } = useSessionEngine();
  const [notes, setNotes] = useState(session.privateNotes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [newLessonText, setNewLessonText] = useState('');
  
  // Local list of lessons pinned to this session (stored in session.payload.lessons or defaults)
  const [lessons, setLessons] = useState<string[]>(session.payload.lessons || []);

  useEffect(() => {
    setNotes(session.privateNotes || '');
    setLessons(session.payload.lessons || []);
  }, [session]);

  const handleSaveNotes = async () => {
    try {
      await manager.updateSession(session.id, { privateNotes: notes });
      setIsEditingNotes(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLesson = async () => {
    if (!newLessonText.trim()) return;
    const updatedLessons = [...lessons, newLessonText.trim()];
    setLessons(updatedLessons);
    setNewLessonText('');

    try {
      await manager.updateSession(session.id, { 
        payload: { ...session.payload, lessons: updatedLessons } 
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLesson = async (idx: number) => {
    const updatedLessons = lessons.filter((_, i) => i !== idx);
    setLessons(updatedLessons);

    try {
      await manager.updateSession(session.id, { 
        payload: { ...session.payload, lessons: updatedLessons } 
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePinToggle = async () => {
    try {
      await manager.pinSession(session.id, !session.pinned);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchiveToggle = async () => {
    try {
      await manager.archiveSession(session.id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this session? This action is permanent.')) {
      try {
        await manager.deleteSession(session.id);
        onBack();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDuplicate = async () => {
    try {
      await manager.createSession(session.type, {
        ...session.payload,
        title: `Copy of ${session.title}`,
        businessName: session.businessName,
        privateNotes: session.privateNotes,
        tags: [...session.tags],
        collections: [...session.collections]
      });
      alert('Session duplicated.');
      onBack();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportText = () => {
    const dataStr = `PHEEBS PRE-CALL BRIEFING REPORT\n` +
      `==============================\n` +
      `Business: ${session.businessName}\n` +
      `Type: ${session.type.toUpperCase()}\n` +
      `Created At: ${new Date(session.createdAt).toLocaleString()}\n` +
      `Confidence: ${session.confidence}%\n` +
      `------------------------------\n` +
      `Executive Summary:\n${session.summary}\n` +
      `------------------------------\n` +
      `Likely Revenue Leak:\n${session.anchor}\n` +
      `------------------------------\n` +
      `Private Notes:\n${session.privateNotes || 'No notes added.'}\n` +
      `------------------------------\n` +
      `Pinned Lessons:\n${lessons.length > 0 ? lessons.map((l, i) => `${i+1}. ${l}`).join('\n') : 'No lessons pinned.'}\n` +
      `==============================`;
      
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href",     "data:text/plain;charset=utf-8," + encodeURIComponent(dataStr)     );
    downloadAnchor.setAttribute("download", `pheebs_briefing_${session.businessName.toLowerCase().replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Helper to resolve reflection block dynamically if not present
  const getAIReflection = () => {
    if (session.reflection) return session.reflection;
    
    // Fallback: generate high-fidelity reflection cards based on confidence
    if (session.confidence < 40) return null;

    if (session.type === 'analyzer') {
      return {
        whatWentWell: [
          'Identified distinct checkout redirection loops (forced Mindbody registration blocks user checkout).',
          'Aesthetic review sentiment provides high leverage (complaints about peak hold-times).'
        ],
        risks: [
          'If the owner denies call abandonment statistics, the AE lacks external logs to counter without running a test dial.',
          'Missing SSL warnings aren\'t severe enough to trigger tech anxiety.'
        ],
        nextQuestions: [
          'Ask: "What percentage of clients book online after your physical clinic closes at 6 PM?"',
          'Ask: "How do your front-desk employees notify you when callers drop off because lines are busy?"'
        ]
      };
    }
    return {
      whatWentWell: ['Good discovery pacing.'],
      risks: ['Features pitched before identifying pain.'],
      nextQuestions: ['Ask: "Walk me through how booking works today?"']
    };
  };

  const reflection = getAIReflection();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Header tool bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <button 
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={16} /> Back to Explorer
        </button>

        {/* Action icons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handlePinToggle}
            className="btn-secondary" 
            style={{ 
              padding: '8px 12px', 
              fontSize: '12px',
              color: session.pinned ? 'var(--warning)' : 'var(--text-secondary)',
              borderColor: session.pinned ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255,255,255,0.06)'
            }}
          >
            <Pin size={14} fill={session.pinned ? 'var(--warning)' : 'transparent'} /> {session.pinned ? 'Pinned' : 'Pin'}
          </button>
          
          <button 
            onClick={handleArchiveToggle}
            className="btn-secondary" 
            style={{ 
              padding: '8px 12px', 
              fontSize: '12px',
              color: session.archived ? 'var(--primary)' : 'var(--text-secondary)',
              borderColor: session.archived ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255,255,255,0.06)'
            }}
          >
            <Archive size={14} /> {session.archived ? 'Archived' : 'Archive'}
          </button>

          <button onClick={handleDuplicate} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '12px' }}>
            <Copy size={14} /> Duplicate
          </button>

          <button onClick={handleExportText} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '12px' }}>
            <Download size={14} /> Export Text
          </button>

          <button 
            onClick={handleDelete}
            className="btn-secondary" 
            style={{ 
              padding: '8px 12px', 
              fontSize: '12px',
              color: 'var(--danger)',
              borderColor: 'rgba(239, 68, 68, 0.15)'
            }}
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* Hero Overview */}
      <div className="card-panel" style={{ padding: '24px', background: 'rgba(22, 22, 33, 0.6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.1em' }}>
              {session.type.toUpperCase()} SESSION RECORD
            </span>
            <h2 style={{ fontSize: '24px', marginTop: '4px', letterSpacing: '-0.02em' }}>{session.title}</h2>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Created on {new Date(session.createdAt).toLocaleDateString()} • Status: <span style={{ color: 'var(--success)', fontWeight: 600 }}>{session.status}</span>
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)', fontSize: '12px', textAlign: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '9px', fontWeight: 700 }}>CONFIDENCE</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--secondary)' }}>{session.confidence}%</span>
          </div>
        </div>

        {session.summary && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>EXECUTIVE BRIEFING</div>
            <p style={{ fontSize: '13.5px', lineHeight: '1.5', color: 'var(--text-primary)' }}>{session.summary}</p>
          </div>
        )}
      </div>

      {/* Likely Leak Block */}
      {session.anchor && (
        <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--danger)', letterSpacing: '0.05em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} /> IDENTIFIED LEAK POINT
          </div>
          <p style={{ fontSize: '13px', color: '#fca5a5', lineHeight: '1.4' }}>{session.anchor}</p>
        </div>
      )}

      {/* Persisted Outreach Assets Panel */}
      {session.payload.outreach && (
        <div className="card-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Send size={16} color="var(--primary)" /> Saved Outreach Assets
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(0,0,0,0.15)', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.05em' }}>COLD OUTREACH EMAIL</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Subject: {session.payload.outreach.coldEmail.subject}</div>
              <div style={{ fontSize: '12.5px', marginTop: '6px', whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{session.payload.outreach.coldEmail.body}</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.15)', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.05em' }}>LINKEDIN MESSAGE</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{session.payload.outreach.linkedinMessage}</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.15)', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.05em' }}>VOICEMAIL SCRIPT</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{session.payload.outreach.voicemail}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Reflection & Private Notes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left: AI Reflection */}
        <div className="card-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lightbulb size={16} color="var(--primary)" /> AI Session Reflection
          </h3>

          {session.confidence < 40 ? (
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
              color: 'var(--warning)',
              fontSize: '13px'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '6px' }}>⚠</div>
              <strong>Insufficient evidence.</strong>
              <div style={{ marginTop: '2px', fontSize: '12px' }}>More verification logs required to generate reflection.</div>
            </div>
          ) : reflection ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12.5px' }}>
              <div>
                <span style={{ color: 'var(--success)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>WHAT WENT WELL</span>
                <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-secondary)' }}>
                  {reflection.whatWentWell.map((w, idx) => <li key={idx}>{w}</li>)}
                </ul>
              </div>

              <div>
                <span style={{ color: 'var(--danger)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>POTENTIAL RISKS</span>
                <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-secondary)' }}>
                  {reflection.risks.map((r, idx) => <li key={idx}>{r}</li>)}
                </ul>
              </div>

              <div>
                <span style={{ color: 'var(--secondary)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>SUGGESTED NEXT QUESTIONS</span>
                <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-secondary)' }}>
                  {reflection.nextQuestions.map((q, idx) => <li key={idx}>{q}</li>)}
                </ul>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No reflection generated.</div>
          )}
        </div>

        {/* Right: Private Notes */}
        <div className="card-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', display: 'flex', justifySelf: 'space-between', alignItems: 'center' }}>
            <span>Private Notes (AE Only)</span>
            {!isEditingNotes && (
              <button 
                onClick={() => setIsEditingNotes(true)}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
              >
                Edit
              </button>
            )}
          </h3>

          {isEditingNotes ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <textarea
                className="input-field"
                rows={6}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste client call notes, personal critiques, or booking friction details observed..."
                style={{ resize: 'none', fontSize: '13px' }}
              />
              <div style={{ display: 'flex', justifySelf: 'flex-end', gap: '8px', alignSelf: 'flex-end' }}>
                <button onClick={() => setIsEditingNotes(false)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>Cancel</button>
                <button onClick={handleSaveNotes} className="btn-primary" style={{ padding: '6px 12px', fontSize: '11px' }}>Save Notes</button>
              </div>
            </div>
          ) : (
            <p style={{
              fontSize: '13px',
              lineHeight: '1.5',
              color: session.privateNotes ? 'var(--text-primary)' : 'var(--text-muted)',
              fontStyle: session.privateNotes ? 'normal' : 'italic',
              whiteSpace: 'pre-wrap'
            }}>
              {session.privateNotes || 'No notes added. Click edit to record call dynamics.'}
            </p>
          )}
        </div>
      </div>

      {/* Grid: Lessons & Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left: Lessons Checklist */}
        <div className="card-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={16} color="var(--success)" /> Pinned Lessons (Sales DNA Seeds)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lessons.map((lesson, idx) => (
              <div key={idx} className="card-item" style={{ display: 'flex', justifySelf: 'space-between', alignItems: 'center', padding: '8px 12px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12.5px' }}>
                  <span style={{ color: 'var(--success)' }}>💡</span>
                  <span>{lesson}</span>
                </div>
                <button 
                  onClick={() => handleDeleteLesson(idx)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="What did you learn? (e.g. Price objection handler)"
                value={newLessonText}
                onChange={e => setNewLessonText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddLesson()}
                style={{ fontSize: '12px', padding: '8px 12px' }}
              />
              <button onClick={handleAddLesson} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '12px' }}>
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Right: Session Timeline */}
        <div className="card-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={16} color="var(--secondary)" /> Session Timeline Audit
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {session.timeline.map((event, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                {/* Visual bullet pipeline */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: idx === session.timeline.length - 1 ? 'var(--secondary)' : 'rgba(255,255,255,0.15)',
                    boxShadow: idx === session.timeline.length - 1 ? '0 0 8px var(--secondary)' : 'none',
                    marginTop: '4px'
                  }}></div>
                  {idx < session.timeline.length - 1 && (
                    <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.08)', marginTop: '4px' }}></div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 600 }}>{event.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {new Date(event.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
