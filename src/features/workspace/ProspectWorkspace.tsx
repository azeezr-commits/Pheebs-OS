import React, { useState, useEffect, useRef } from 'react';
import { useSessionEngine } from '../../core/session-engine/SessionContext';
import type { Session } from '../../contracts/Session';
import { generateOutreachAssets } from '../outreach-studio/generators/outreachGenerator';
import { 
  ArrowLeft, 
  Send, 
  Plus,
  PlayCircle,
  Phone
} from 'lucide-react';

interface ProspectWorkspaceProps {
  sessionId: string;
  onBack: () => void;
  onStartCall: (businessName: string) => void;
}

export const ProspectWorkspace: React.FC<ProspectWorkspaceProps> = ({
  sessionId,
  onBack,
  onStartCall
}) => {
  const { manager } = useSessionEngine();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Strategy parameters
  const [primaryProblem, setPrimaryProblem] = useState('');
  const [primaryHook, setPrimaryHook] = useState('');
  const [positioningApproach, setPositioningApproach] = useState('Consultative');

  // Copy drafts
  const [coldEmailSubject, setColdEmailSubject] = useState('');
  const [coldEmailBody, setColdEmailBody] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [callOpening, setCallOpening] = useState('');
  const [callPermission, setCallPermission] = useState('');
  const [callCuriosity, setCallCuriosity] = useState('');
  const [voicemail, setVoicemail] = useState('');

  // WhatsApp Notes
  const [newNoteText, setNewNoteText] = useState('');
  const [whatsappNotes, setWhatsappNotes] = useState<{ date: string; text: string }[]>([]);

  // Journal
  const [journalText, setJournalText] = useState('');

  // Timeline & expanded items
  const [timeline, setTimeline] = useState<{ time: string; text: string; expanded?: boolean; detail?: string }[]>([]);

  // Playbook Modal state
  const [isPlaybookOpen, setIsPlaybookOpen] = useState(false);
  const [liveMeetingNotes, setLiveMeetingNotes] = useState('');
  const [playbookAgendaChecks, setPlaybookAgendaChecks] = useState({
    agendaReview: false,
    discoveryQs: false,
    objectionHandling: false,
    roiReview: false,
    closeStrategy: false
  });

  // Auto-save fleeting status: 'idle' | 'saving' | 'saved'
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const autoSaveTimeoutRef = useRef<any>(null);

  const triggerAutoSave = (updatedData: any) => {
    setSaveStatus('saving');
    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);

    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        if (session) {
          await manager.updateSession(session.id, updatedData);
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 1500);
        }
      } catch (e) {
        console.error(e);
        setSaveStatus('idle');
      }
    }, 1000);
  };

  const loadWorkspace = async () => {
    setLoading(true);
    try {
      const refreshed = await manager.getSession(sessionId);
      if (refreshed) {
        setSession(refreshed);
        const briefing = refreshed.payload.briefing || refreshed.payload || {};

        setPrimaryProblem(refreshed.payload.strategyProblem || 'Receptionist Phone Abandonment');
        setPrimaryHook(refreshed.payload.strategyHook || 'Direct Busy Signal Dial test');
        setPositioningApproach(refreshed.payload.strategyApproach || 'Consultative / Low Pressure');

        // Outreach drafts
        const savedOutreach = refreshed.payload.outreach;
        if (savedOutreach) {
          setColdEmailSubject(savedOutreach.coldEmail?.subject || '');
          setColdEmailBody(savedOutreach.coldEmail?.body || '');
          setLinkedin(savedOutreach.linkedinMessage || '');
          setCallOpening(savedOutreach.coldCallScript?.opening || '');
          setCallPermission(savedOutreach.coldCallScript?.permission || '');
          setCallCuriosity(savedOutreach.coldCallScript?.curiosityHook || '');
          setVoicemail(savedOutreach.voicemail || '');
        } else {
          const assets = generateOutreachAssets(briefing);
          setColdEmailSubject(assets.coldEmail.subject);
          setColdEmailBody(assets.coldEmail.body);
          setLinkedin(assets.linkedinMessage);
          setCallOpening(assets.coldCallScript.opening);
          setCallPermission(assets.coldCallScript.permission);
          setCallCuriosity(assets.coldCallScript.curiosityHook);
          setVoicemail(assets.voicemail);
        }

        // Notes
        setWhatsappNotes(refreshed.payload.whatsappNotes || [
          { date: 'July 3', text: 'Customer said "I already use Vagaro for booking, design is fine."' },
          { date: 'July 4', text: 'Requested screenshots validating call drop statistics.' },
          { date: 'July 5', text: 'Accepted Google Meet calendar invite.' }
        ]);

        // Journal
        setJournalText(refreshed.payload.journalText || 'She likes proof. Follow up Tuesday.');

        // Live Demo Notes
        setLiveMeetingNotes(refreshed.payload.demoNotes || '');
        if (refreshed.payload.playbookAgendaChecks) {
          setPlaybookAgendaChecks(refreshed.payload.playbookAgendaChecks);
        }

        // Timeline
        setTimeline(refreshed.payload.timelineLogs || [
          { time: 'July 1', text: 'Research Complete', detail: 'Identified Google Profile visibility issues.' },
          { time: 'July 2', text: 'Email Sent', detail: 'Subject: I owe you a better report. Sourced checkout dropout analysis.' },
          { time: 'July 2', text: 'Email Opened', detail: 'Opened 2x, Clicked checkout audit report link.' },
          { time: 'July 3', text: 'Audit Shared', detail: 'Shared Google Business map audit coordinates.' },
          { time: 'July 5', text: 'Meeting Accepted', detail: 'Demo scheduled for July 7 at 1:00 PM.' }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, [sessionId]);

  if (loading || !session) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '16px' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid rgba(124,92,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ color: 'var(--text-secondary)' }}>Loading Workspace...</span>
      </div>
    );
  }

  const briefing = session.payload.briefing || session.payload || {};

  const handleApplyStrategy = () => {
    const customBriefing = {
      ...briefing,
      likelyRevenueLeak: primaryProblem
    };
    const assets = generateOutreachAssets(customBriefing);
    setColdEmailSubject(assets.coldEmail.subject);
    setColdEmailBody(assets.coldEmail.body);
    setLinkedin(assets.linkedinMessage);
    setCallOpening(assets.coldCallScript.opening);
    setCallPermission(assets.coldCallScript.permission);
    setCallCuriosity(assets.coldCallScript.curiosityHook);
    setVoicemail(assets.voicemail);

    triggerAutoSave({
      strategyProblem: primaryProblem,
      strategyHook: primaryHook,
      strategyApproach: positioningApproach,
      outreach: {
        coldEmail: { subject: assets.coldEmail.subject, body: assets.coldEmail.body },
        linkedinMessage: assets.linkedinMessage,
        coldCallScript: {
          opening: assets.coldCallScript.opening,
          permission: assets.coldCallScript.permission,
          curiosityHook: assets.coldCallScript.curiosityHook
        },
        voicemail: assets.voicemail
      }
    });
  };

  const handleAddWhatsAppNote = () => {
    if (!newNoteText.trim()) return;
    const dateStr = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });
    const updatedNotes = [...whatsappNotes, { date: dateStr, text: newNoteText.trim() }];
    setWhatsappNotes(updatedNotes);
    setNewNoteText('');

    triggerAutoSave({ whatsappNotes: updatedNotes });
  };

  const toggleTimelineExpand = (idx: number) => {
    const updated = [...timeline];
    updated[idx].expanded = !updated[idx].expanded;
    setTimeline(updated);
  };

  // Playbook note stampers
  const appendNoteStamp = (label: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedNotes = liveMeetingNotes + `\n[${timeStr}] ${label}: `;
    setLiveMeetingNotes(updatedNotes);
    triggerAutoSave({ demoNotes: updatedNotes });
  };

  const knowns: string[] = session.payload.brainKnowns || briefing.brainKnowns || [
    'Domain registered and active.',
    'Initial local search profile verified.'
  ];
  const unknowns: string[] = session.payload.brainUnknowns || briefing.brainUnknowns || [
    'Who is the ultimate decision maker / owner?',
    'Are they tied to long-term software agreements?'
  ];
  const explanation: string = session.payload.brainThinkingExplanation || briefing.brainThinkingExplanation || 'No structured observation has been parsed yet.';
  const evidence: string[] = session.payload.brainThinkingEvidence || briefing.brainThinkingEvidence || [];
  const missing: string[] = session.payload.brainThinkingMissing || briefing.brainThinkingMissing || [];
  const investigation: string = session.payload.brainThinkingInvestigation || briefing.brainThinkingInvestigation || 'Log call details to compile reasoning.';
  const nextQuestion: string = session.payload.brainNextQuestion || briefing.brainNextQuestion || 'Apart from yourself, who else will be involved in approving this purchase?';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px', position: 'relative' }}>
      
      {/* Fleeting Auto-Save Indicator */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '-10px', 
          right: '0', 
          fontSize: '12px', 
          color: saveStatus === 'saved' ? 'var(--success)' : 'var(--text-muted)',
          opacity: saveStatus === 'idle' ? 0 : 1,
          transition: 'opacity 0.3s'
        }}
      >
        {saveStatus === 'saving' && 'Saving...'}
        {saveStatus === 'saved' && 'Saved ✓'}
      </div>

      {/* Back button */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
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
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Header Panel */}
      <div style={{ borderBottom: '1px solid #2C2C2F', paddingBottom: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 500, color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0 }}>
                {session.businessName}
              </h1>
              <span style={{ fontSize: '11px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                ★★★★☆ Hot Lead
              </span>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '13.5px', color: '#A1A1AA' }}>
              <span>Stage: <strong style={{ color: '#FFFFFF' }}>Meeting Scheduled</strong></span>
              <span>•</span>
              <span>Owner: <strong style={{ color: '#FFFFFF' }}>Azeez</strong></span>
              <span>•</span>
              <span>Last Activity: <strong style={{ color: '#FFFFFF' }}>Accepted Google Meet</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* UNIFIED SALES BRAIN & EXECUTION COCKPIT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', marginTop: '16px' }}>
        
        {/* LEFT COLUMN: THE BRAIN REASONING ENGINE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* 1. What We Know (Facts only) */}
          <div>
            <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              What We Know
            </span>
            <hr style={{ border: 'none', borderTop: '1px solid #2C2C2F', margin: '8px 0 16px 0' }} />
            <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '13.5px', lineHeight: '1.6', color: '#E4E4E7', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {knowns.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* 2. What We Don't Know (Crucial Unknowns) */}
          <div>
            <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              What We Don't Know
            </span>
            <hr style={{ border: 'none', borderTop: '1px solid #2C2C2F', margin: '8px 0 16px 0' }} />
            <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '13.5px', lineHeight: '1.6', color: '#EF4444', display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: 500 }}>
              {unknowns.map((item: string, idx: number) => (
                <li key={idx} style={{ color: '#FCA5A5' }}>
                  <span style={{ color: '#EF4444', fontWeight: 700 }}>?</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Thinking (Reasoning & Evidence) */}
          <div>
            <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Reasoning & Evidence
            </span>
            <hr style={{ border: 'none', borderTop: '1px solid #2C2C2F', margin: '8px 0 16px 0' }} />
            
            <div style={{ padding: '20px 24px', borderLeft: '2px solid #3B3B40', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#71717A', display: 'block' }}>POSSIBLE EXPLANATION</span>
                <p style={{ fontSize: '14px', color: '#FFFFFF', margin: '4px 0 0 0', lineHeight: '1.5' }}>
                  {explanation}
                </p>
              </div>

              {evidence.length > 0 && (
                <div>
                  <span style={{ fontSize: '10px', color: '#71717A', display: 'block' }}>SUPPORTING EVIDENCE</span>
                  <ul style={{ paddingLeft: '16px', margin: '4px 0 0 0', fontSize: '13px', color: '#A1A1AA', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {evidence.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {missing.length > 0 && (
                <div>
                  <span style={{ fontSize: '10px', color: '#71717A', display: 'block' }}>MISSING EVIDENCE</span>
                  <ul style={{ paddingLeft: '16px', margin: '4px 0 0 0', fontSize: '13px', color: '#A1A1AA', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {missing.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <span style={{ fontSize: '10px', color: '#71717A', display: 'block' }}>SUGGESTED INVESTIGATION</span>
                <p style={{ fontSize: '13px', color: '#E4E4E7', margin: '4px 0 0 0', fontWeight: 500 }}>
                  {investigation}
                </p>
              </div>
            </div>
          </div>

          {/* 4. Next Best Question (Visual Focal Point) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Next Best Question
            </span>
            <div style={{ background: '#18181B', border: '1px solid #2C2C2F', borderRadius: '6px', padding: '24px' }}>
              <p style={{ fontSize: '16.5px', fontWeight: 400, color: '#FFFFFF', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>
                "{nextQuestion}"
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ACTIONS, OUTREACH & EXECUTION HISTORY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Company Overview Snapshot */}
          <div>
            <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Overview
            </span>
            <hr style={{ border: 'none', borderTop: '1px solid #2C2C2F', margin: '8px 0 16px 0' }} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px', background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '6px', border: '1px solid #2C2C2F' }}>
              <div>
                <span style={{ color: '#71717A', display: 'block', fontSize: '10px' }}>WEBSITE</span>
                <a href={`https://${briefing.website}`} target="_blank" rel="noreferrer" style={{ color: '#FFFFFF', textDecoration: 'underline', fontWeight: 600 }}>
                  {briefing.website || 'Not verified'}
                </a>
              </div>
              <div>
                <span style={{ color: '#71717A', display: 'block', fontSize: '10px' }}>RATING</span>
                <span style={{ fontWeight: 600 }}>4.2 / 5.0 (42 reviews)</span>
              </div>
              <div>
                <span style={{ color: '#71717A', display: 'block', fontSize: '10px' }}>BOOKING PLATFORM</span>
                <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>Vagaro</span>
              </div>
              <div>
                <span style={{ color: '#71717A', display: 'block', fontSize: '10px' }}>ESTIMATED ARR LEAK</span>
                <span style={{ fontWeight: 600, color: 'var(--success)' }}>$2,400</span>
              </div>
            </div>
          </div>

          {/* Strategy parameters hook */}
          <div>
            <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Strategy Hooks
            </span>
            <hr style={{ border: 'none', borderTop: '1px solid #2C2C2F', margin: '8px 0 16px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '10px', color: '#71717A', fontWeight: 600 }}>PRIMARY PROBLEM</label>
                <select 
                  className="input-field" 
                  value={primaryProblem} 
                  onChange={e => { setPrimaryProblem(e.target.value); triggerAutoSave({ strategyProblem: e.target.value }); }}
                  style={{ marginTop: '4px' }}
                >
                  <option value="Receptionist Phone Abandonment">Receptionist Phone Abandonment</option>
                  <option value="Booking Checkout drop-off">Booking Checkout drop-off</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '10px', color: '#71717A', fontWeight: 600 }}>PRIMARY HOOK</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={primaryHook} 
                  onChange={e => { setPrimaryHook(e.target.value); triggerAutoSave({ strategyHook: e.target.value }); }}
                  style={{ marginTop: '4px' }}
                />
              </div>
              <button 
                onClick={handleApplyStrategy}
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
              >
                Apply Hook & Regenerate outreach
              </button>
            </div>
          </div>

          {/* Action Center Buttons */}
          <div>
            <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Execution Center
            </span>
            <hr style={{ border: 'none', borderTop: '1px solid #2C2C2F', margin: '8px 0 16px 0' }} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button 
                onClick={() => onStartCall(session.businessName)}
                className="card-panel" 
                style={{ padding: '16px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', border: '1px solid #2C2C2F', background: '#18181B', borderRadius: '8px' }}
              >
                <Phone size={18} color="#A1A1AA" />
                <strong style={{ fontSize: '13px', color: '#fff' }}>Start Call</strong>
              </button>

              <button 
                onClick={() => setIsPlaybookOpen(true)}
                className="card-panel" 
                style={{ padding: '16px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', border: '1px solid #2C2C2F', background: '#18181B', borderRadius: '8px' }}
              >
                <PlayCircle size={18} color="#A1A1AA" />
                <strong style={{ fontSize: '13px', color: '#fff' }}>Prepare Demo</strong>
              </button>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText(coldEmailBody);
                  alert('Email script copied to clipboard!');
                }}
                className="card-panel" 
                style={{ padding: '16px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', border: '1px solid #2C2C2F', background: '#18181B', borderRadius: '8px' }}
              >
                <Send size={18} color="#A1A1AA" />
                <strong style={{ fontSize: '13px', color: '#fff' }}>Generate Email</strong>
              </button>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText(linkedin);
                  alert('LinkedIn script copied!');
                }}
                className="card-panel" 
                style={{ padding: '16px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', border: '1px solid #2C2C2F', background: '#18181B', borderRadius: '8px' }}
              >
                <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} color="#A1A1AA" />
                <strong style={{ fontSize: '13px', color: '#fff' }}>Send Follow-up</strong>
              </button>
            </div>
            
            {/* Outreach scripts preview */}
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px dashed #2C2C2F', paddingTop: '16px' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#71717A', fontWeight: 700 }}>COLD EMAIL COPY</span>
                <p style={{ fontSize: '12.5px', color: '#A1A1AA', marginTop: '6px', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                  <strong>Subject:</strong> {coldEmailSubject}
                  {"\n\n"}{coldEmailBody}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: '#71717A', fontWeight: 700 }}>COLD CALL & VOICEMAIL SCRIPT</span>
                <p style={{ fontSize: '12.5px', color: '#A1A1AA', marginTop: '6px', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                  <strong>Opening:</strong> {callOpening}
                  {"\n\n"}<strong>Permission Check:</strong> {callPermission}
                  {"\n\n"}<strong>Curiosity Hook:</strong> {callCuriosity}
                  {"\n\n"}<strong>Voicemail:</strong> {voicemail}
                </p>
              </div>
            </div>
          </div>

          {/* Activity Timeline & Logs */}
          <div>
            <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Timeline & Logs
            </span>
            <hr style={{ border: 'none', borderTop: '1px solid #2C2C2F', margin: '8px 0 16px 0' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {timeline.map((item, idx) => (
                <div key={idx} style={{ padding: '12px 0', borderBottom: '1px solid #2C2C2F' }}>
                  <div 
                    onClick={() => toggleTimelineExpand(idx)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12.5px' }}>
                      <span>{item.text.includes('Email') ? '📧' : item.text.includes('Call') ? '📞' : item.text.includes('Meeting') ? '📅' : '📄'}</span>
                      <div>
                        <strong style={{ color: '#fff' }}>{item.text}</strong>
                        <span style={{ fontSize: '11px', color: '#71717A', marginLeft: '6px' }}>{item.time}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: '#71717A' }}>{item.expanded ? '▲' : '▼'}</span>
                  </div>
                  {item.expanded && item.detail && (
                    <p style={{ fontSize: '12px', color: '#A1A1AA', marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #2C2C2F', lineHeight: '1.4' }}>
                      {item.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Diary logs */}
            <div style={{ marginTop: '20px' }}>
              <span style={{ fontSize: '10px', color: '#71717A', fontWeight: 700 }}>DIARY LOGS</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', maxHeight: '140px', overflowY: 'auto' }}>
                {whatsappNotes.map((note, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', padding: '8px', borderRadius: '4px', border: '1px solid #2C2C2F', fontSize: '12px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 700 }}>{note.date}</span>
                    <p style={{ color: '#fff', marginTop: '2px', margin: 0 }}>{note.text}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Type diary update..." 
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddWhatsAppNote()}
                  style={{ fontSize: '12px', padding: '6px 10px' }}
                />
                <button onClick={handleAddWhatsAppNote} className="btn-primary" style={{ padding: '6px 12px' }}>
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Prospect Journal */}
            <div style={{ marginTop: '20px', borderTop: '1px dashed #2C2C2F', paddingTop: '16px' }}>
              <span style={{ fontSize: '10px', color: '#71717A', fontWeight: 700 }}>PROSPECT JOURNAL</span>
              <textarea
                className="input-field"
                rows={2}
                style={{ 
                  marginTop: '6px', 
                  fontSize: '12.5px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #2C2C2F',
                  borderRadius: '0',
                  padding: '8px 0',
                  color: '#FFFFFF'
                }}
                placeholder="Scribble notes for future self..."
                value={journalText}
                onChange={e => { setJournalText(e.target.value); triggerAutoSave({ journalText: e.target.value }); }}
              />
            </div>

          </div>

        </div>

      </div>

      {/* ================= INTERACTIVE DEMO PLAYBOOK OVERLAY MODAL ================= */}
      {isPlaybookOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 5, 8, 0.75)',
          backdropFilter: 'blur(10px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="card-panel" style={{ width: '800px', padding: '28px', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button 
              onClick={() => setIsPlaybookOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '16px' }}
            >
              ✕
            </button>

            {/* Left side: Playbook Checklist */}
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 800 }}>PLAYBOOK FLOW</span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>Demo Playbook</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                {[
                  { id: 'agendaReview', label: '1. Agenda & Goals Review' },
                  { id: 'discoveryQs', label: '2. Discovery Questions' },
                  { id: 'objectionHandling', label: '3. Objection pre-handling' },
                  { id: 'roiReview', label: '4. ROI Examples & Screens' },
                  { id: 'closeStrategy', label: '5. Next Step Close Strategy' }
                ].map(item => (
                  <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={(playbookAgendaChecks as any)[item.id]}
                      onChange={() => {
                        const updated = { ...playbookAgendaChecks, [item.id]: !(playbookAgendaChecks as any)[item.id] };
                        setPlaybookAgendaChecks(updated);
                        triggerAutoSave({ playbookAgendaChecks: updated });
                      }}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>

              <div style={{ fontSize: '12px', background: 'rgba(124,92,255,0.05)', padding: '10px', borderRadius: '4px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                💡 <strong>Coach Advice:</strong> Let Julie explain Vagaro booking checkout drop-out points before presenting Zoca visibility slides.
              </div>
            </div>

            {/* Right side: Live Meeting Notes Stampers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>TIMESTAMPTED RECORDER</span>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Live meeting logger</h4>
              </div>

              {/* Note helper stampers */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {['Question', 'Answer', 'Action Item', 'Follow-up'].map((lbl) => (
                  <button 
                    key={lbl}
                    onClick={() => appendNoteStamp(lbl)}
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '11px', flex: 1 }}
                  >
                    + {lbl}
                  </button>
                ))}
              </div>

              <textarea 
                className="input-field" 
                rows={10} 
                value={liveMeetingNotes}
                onChange={e => { setLiveMeetingNotes(e.target.value); triggerAutoSave({ demoNotes: e.target.value }); }}
                placeholder="Log notes during meeting... Use the stampers above to insert timestamps!"
                style={{ fontSize: '13px', resize: 'vertical' }}
              />

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setIsPlaybookOpen(false)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  Close Playbook
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default ProspectWorkspace;
