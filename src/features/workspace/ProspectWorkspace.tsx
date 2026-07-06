import React, { useState, useEffect, useRef } from 'react';
import { useSessionEngine } from '../../core/session-engine/SessionContext';
import type { Session } from '../../contracts/Session';
import { generateOutreachAssets } from '../outreach-studio/generators/outreachGenerator';
import { 
  ArrowLeft, 
  Send, 
  Plus,
  PlayCircle,
  ShieldAlert,
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
  const hasPhoneLeak = (briefing.bookingFindings || []).some((f: string) => f.toLowerCase().match(/voicemail|busy|phone/)) ||
                       (briefing.likelyRevenueLeak || '').toLowerCase().includes('call');

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

      {/* 4-SECTION SINGLE-SCROLL LAYOUT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* ================= SECTION 1: OVERVIEW ================= */}
        <div style={{ borderBottom: '1px solid #2C2C2F', paddingBottom: '32px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#71717A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>
            1. Overview
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 300px', gap: '24px', alignItems: 'start' }}>
            {/* Snapshot */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '11px' }}>WEBSITE</span>
                <a href={`https://${briefing.website}`} target="_blank" rel="noreferrer" style={{ color: '#FFFFFF', textDecoration: 'underline', fontWeight: 600 }}>
                  {briefing.website || 'Unable to verify'}
                </a>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '11px' }}>GOOGLE RATING</span>
                <span style={{ fontWeight: 600 }}>4.2 / 5.0 (42 reviews)</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '11px' }}>BOOKING PLATFORM</span>
                <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>Vagaro</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '11px' }}>ESTIMATED ARR</span>
                <span style={{ fontWeight: 600, color: 'var(--success)' }}>$2,400</span>
              </div>
            </div>

            {/* AI Summary */}
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, display: 'block', marginBottom: '4px' }}>AI SUMMARY</span>
              <p style={{ fontSize: '14px', color: '#A1A1AA', lineHeight: '1.5' }}>
                Bright Smile Orthodontics is a multi-chair dental practice using Vagaro. Google profile score is low due to missing posts and profile completeness. Tawana requested proof before agreeing to a meeting. Primary opportunity is increasing local visibility.
              </p>
              {hasPhoneLeak && (
                <div style={{ fontSize: '13px', color: '#F59E0B', marginTop: '8px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <ShieldAlert size={13} /> Phone line abandonment detected.
                </div>
              )}
            </div>

            {/* Deal Signals Checklist */}
            <div style={{ padding: '16px 20px', borderLeft: '2px solid #3B3B40' }}>
              <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DEAL SIGNALS</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                <div style={{ color: '#22C55E' }}>✓ Requested proof</div>
                <div style={{ color: '#22C55E' }}>✓ Accepted meeting</div>
                <div style={{ color: '#22C55E' }}>✓ Opened emails</div>
                <div style={{ color: '#F59E0B' }}>⚠ Uses Vagaro</div>
                <div style={{ color: '#EF4444' }}>⚠ Price concern</div>
              </div>
            </div>
          </div>

          {/* Continue where you left off CTA */}
          <div style={{ borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Last Action: <strong>Prepared Demo</strong> • Status: Not Started
            </div>
            <button 
              onClick={() => setIsPlaybookOpen(true)}
              className="btn-primary" 
              style={{ padding: '6px 16px', fontSize: '12.5px' }}
            >
              Continue
            </button>
          </div>
        </div>

        {/* ================= SECTION 2: STRATEGY ================= */}
        <div style={{ borderBottom: '1px solid #2C2C2F', paddingBottom: '32px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#71717A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>
            2. Strategy parameters
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>PRIMARY PROBLEM</label>
              <select 
                className="input-field" 
                value={primaryProblem} 
                onChange={e => { setPrimaryProblem(e.target.value); triggerAutoSave({ strategyProblem: e.target.value }); }}
                style={{ marginTop: '6px' }}
              >
                <option value="Receptionist Phone Abandonment">Receptionist Phone Abandonment</option>
                <option value="Booking Checkout drop-off">Booking Checkout drop-off</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>PRIMARY HOOK</label>
              <input 
                type="text" 
                className="input-field" 
                value={primaryHook} 
                onChange={e => { setPrimaryHook(e.target.value); triggerAutoSave({ strategyHook: e.target.value }); }}
                style={{ marginTop: '6px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button 
                onClick={handleApplyStrategy}
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Apply Hook & Regenerate
              </button>
            </div>
          </div>
        </div>

        {/* ================= SECTION 3: ACTION CENTER ================= */}
        <div style={{ borderBottom: '1px solid #2C2C2F', paddingBottom: '32px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#71717A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>
            3. Action Center
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
            
            <button 
              onClick={() => onStartCall(session.businessName)}
              className="card-panel" 
              style={{ padding: '20px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid #2C2C2F', background: '#18181B', borderRadius: '8px', transition: 'background 0.2s, border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#202024'; e.currentTarget.style.borderColor = '#3B3B40'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#18181B'; e.currentTarget.style.borderColor = '#2C2C2F'; }}
            >
              <Phone size={24} color="#A1A1AA" />
              <strong style={{ fontSize: '14px', color: '#fff' }}>Start Call</strong>
              <span style={{ fontSize: '11.5px', color: '#A1A1AA' }}>Launch call focus HUD</span>
            </button>

            <button 
              onClick={() => setIsPlaybookOpen(true)}
              className="card-panel" 
              style={{ padding: '20px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid #2C2C2F', background: '#18181B', borderRadius: '8px', transition: 'background 0.2s, border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#202024'; e.currentTarget.style.borderColor = '#3B3B40'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#18181B'; e.currentTarget.style.borderColor = '#2C2C2F'; }}
            >
              <PlayCircle size={24} color="#A1A1AA" />
              <strong style={{ fontSize: '14px', color: '#fff' }}>Prepare Demo</strong>
              <span style={{ fontSize: '11.5px', color: '#A1A1AA' }}>Review discovery checklists</span>
            </button>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(coldEmailBody);
                alert('Email script copied to clipboard!');
              }}
              className="card-panel" 
              style={{ padding: '20px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid #2C2C2F', background: '#18181B', borderRadius: '8px', transition: 'background 0.2s, border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#202024'; e.currentTarget.style.borderColor = '#3B3B40'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#18181B'; e.currentTarget.style.borderColor = '#2C2C2F'; }}
            >
              <Send size={24} color="#A1A1AA" />
              <strong style={{ fontSize: '14px', color: '#fff' }}>Generate Email</strong>
              <span style={{ fontSize: '11.5px', color: '#A1A1AA' }}>Copy personalized cold sequence</span>
            </button>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(linkedin);
                alert('LinkedIn script copied!');
              }}
              className="card-panel" 
              style={{ padding: '20px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid #2C2C2F', background: '#18181B', borderRadius: '8px', transition: 'background 0.2s, border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#202024'; e.currentTarget.style.borderColor = '#3B3B40'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#18181B'; e.currentTarget.style.borderColor = '#2C2C2F'; }}
            >
              <ArrowLeft size={24} style={{ transform: 'rotate(180deg)' }} color="#A1A1AA" />
              <strong style={{ fontSize: '14px', color: '#fff' }}>Send Follow-up</strong>
              <span style={{ fontSize: '11.5px', color: '#A1A1AA' }}>Copy LinkedIn connection</span>
            </button>

          </div>

          {/* Expanded Outreach Preview block */}
          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div style={{ padding: '0 20px 0 0', borderRight: '1px solid #2C2C2F' }}>
              <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>COLD EMAIL COPY</span>
              <div style={{ fontSize: '13.5px', color: '#A1A1AA', marginTop: '12px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                <strong>Subject:</strong> {coldEmailSubject}
                {"\n\n"}{coldEmailBody}
              </div>
            </div>
            <div style={{ padding: '0 0 0 20px' }}>
              <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>COLD CALL & SCRIPT</span>
              <div style={{ fontSize: '13.5px', color: '#A1A1AA', marginTop: '12px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                <strong>Opening:</strong> {callOpening}
                {"\n\n"}<strong>Permission Check:</strong> {callPermission}
                {"\n\n"}<strong>Curiosity Hook:</strong> {callCuriosity}
                {"\n\n"}<strong>Voicemail:</strong> {voicemail}
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 4: HISTORY ================= */}
        <div style={{ paddingBottom: '32px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#71717A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>
            4. History & Client Updates
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'start' }}>
            
            {/* Timeline */}
            <div>
              <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>INTELLIGENT ACTIVITY FEED</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginTop: '12px' }}>
                {timeline.map((item, idx) => (
                  <div key={idx} style={{ padding: '14px 0', borderBottom: '1px solid #2C2C2F' }}>
                    <div 
                      onClick={() => toggleTimelineExpand(idx)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px' }}>
                        <span>
                          {item.text.includes('Email') ? '📧' : item.text.includes('Call') ? '📞' : item.text.includes('Meeting') ? '📅' : '📄'}
                        </span>
                        <div>
                          <strong style={{ color: '#fff' }}>{item.text}</strong>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '8px' }}>{item.time}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.expanded ? 'Collapse ▲' : 'Expand ▼'}</span>
                    </div>

                    {item.expanded && item.detail && (
                      <p style={{ fontSize: '13px', color: '#A1A1AA', marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #2C2C2F', lineHeight: '1.5', paddingLeft: '8px' }}>
                        {item.detail}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Updates Diary */}
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800 }}>DIARY LOGS</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {whatsappNotes.map((note, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '4px', fontSize: '12.5px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 700 }}>{note.date}</span>
                      <p style={{ color: '#fff', marginTop: '2px' }}>{note.text}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Type diary update..." 
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddWhatsAppNote()}
                  />
                  <button onClick={handleAddWhatsAppNote} className="btn-primary" style={{ padding: '8px 14px', boxShadow: 'none' }}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Prospect Journal */}
              <div style={{ marginTop: '16px', borderTop: '1px dashed #2C2C2F', paddingTop: '12px' }}>
                <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>PROSPECT JOURNAL</span>
                <textarea
                  className="input-field"
                  rows={2}
                  style={{ 
                    marginTop: '6px', 
                    fontSize: '13px',
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
