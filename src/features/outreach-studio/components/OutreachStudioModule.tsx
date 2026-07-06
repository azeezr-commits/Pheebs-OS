import React, { useState, useEffect } from 'react';
import { useSessionEngine } from '../../../core/session-engine/SessionContext';
import { generateOutreachAssets } from '../generators/outreachGenerator';
import { AssetCard } from './AssetCard';
import type { Session } from '../../../contracts/Session';
import type { OutreachAssets } from '../types';
import { 
  Mail, 
  PhoneCall, 
  Volume2, 
  HelpCircle, 
  ListOrdered, 
  Save, 
  Send,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OutreachStudioModuleProps {
  setActiveTab: (tab: 'dashboard' | 'analyzer' | 'outreach' | 'vault') => void;
  preloadedSessionId?: string | null;
  onClearPreload?: () => void;
}

export const OutreachStudioModule: React.FC<OutreachStudioModuleProps> = ({
  setActiveTab,
  preloadedSessionId,
  onClearPreload
}) => {
  const { manager } = useSessionEngine();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Outreach Assets states (Editable!)
  const [coldEmailSubject, setColdEmailSubject] = useState('');
  const [coldEmailBody, setColdEmailBody] = useState('');
  const [followUpSubject, setFollowUpSubject] = useState('');
  const [followUpBody, setFollowUpBody] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [callOpening, setCallOpening] = useState('');
  const [callPermission, setCallPermission] = useState('');
  const [callCuriosity, setCallCuriosity] = useState('');
  const [callQuestions, setCallQuestions] = useState<string[]>([]);
  const [callTransition, setCallTransition] = useState('');
  const [voicemail, setVoicemail] = useState('');
  const [discQuestions, setDiscQuestions] = useState<string[]>([]);
  const [discObjections, setDiscObjections] = useState<string[]>([]);
  const [discGoals, setDiscGoals] = useState<string[]>([]);
  const [discPositioning, setDiscPositioning] = useState('');
  const [subjectLines, setSubjectLines] = useState<string[]>([]);

  const [activeSubTab, setActiveSubTab] = useState<'email' | 'call' | 'linkedin' | 'voicemail' | 'prep' | 'subjects'>('email');
  const [isSaving, setIsSaving] = useState(false);

  // Load completed analyzer sessions
  const loadSessions = async () => {
    const list = await manager.listSessions('analyzer');
    // Filter to completed only so we have audit briefing facts
    const completed = list.filter((s: Session) => s.status === 'Completed');
    setSessions(completed);

    // Handle preloaded session mapping
    const activeId = preloadedSessionId || (completed.length > 0 ? completed[0].id : '');
    setSelectedSessionId(activeId);
  };

  useEffect(() => {
    loadSessions();
  }, [preloadedSessionId]);

  // Load session assets when selection changes
  useEffect(() => {
    if (!selectedSessionId) {
      setSelectedSession(null);
      return;
    }

    const fetchSession = async () => {
      const session = await manager.getSession(selectedSessionId);
      if (!session) return;

      setSelectedSession(session);

      // Check if session already has saved outreach assets
      const savedOutreach = session.payload.outreach as OutreachAssets | undefined;
      const briefing = session.payload.briefing || session.payload;

      if (savedOutreach) {
        // Load saved values
        setColdEmailSubject(savedOutreach.coldEmail.subject);
        setColdEmailBody(savedOutreach.coldEmail.body);
        setFollowUpSubject(savedOutreach.followUpEmail.subject);
        setFollowUpBody(savedOutreach.followUpEmail.body);
        setLinkedin(savedOutreach.linkedinMessage);
        setCallOpening(savedOutreach.coldCallScript.opening);
        setCallPermission(savedOutreach.coldCallScript.permission);
        setCallCuriosity(savedOutreach.coldCallScript.curiosityHook);
        setCallQuestions(savedOutreach.coldCallScript.discoveryQuestions);
        setCallTransition(savedOutreach.coldCallScript.meetingTransition);
        setVoicemail(savedOutreach.voicemail);
        setDiscQuestions(savedOutreach.discoveryPrep.questions);
        setDiscObjections(savedOutreach.discoveryPrep.likelyObjections);
        setDiscGoals(savedOutreach.discoveryPrep.likelyGoals);
        setDiscPositioning(savedOutreach.discoveryPrep.recommendedPositioning);
        setSubjectLines(savedOutreach.subjectLines);
      } else {
        // Compile new assets using the Generator
        const generated = generateOutreachAssets(briefing);
        setColdEmailSubject(generated.coldEmail.subject);
        setColdEmailBody(generated.coldEmail.body);
        setFollowUpSubject(generated.followUpEmail.subject);
        setFollowUpBody(generated.followUpEmail.body);
        setLinkedin(generated.linkedinMessage);
        setCallOpening(generated.coldCallScript.opening);
        setCallPermission(generated.coldCallScript.permission);
        setCallCuriosity(generated.coldCallScript.curiosityHook);
        setCallQuestions(generated.coldCallScript.discoveryQuestions);
        setCallTransition(generated.coldCallScript.meetingTransition);
        setVoicemail(generated.voicemail);
        setDiscQuestions(generated.discoveryPrep.questions);
        setDiscObjections(generated.discoveryPrep.likelyObjections);
        setDiscGoals(generated.discoveryPrep.likelyGoals);
        setDiscPositioning(generated.discoveryPrep.recommendedPositioning);
        setSubjectLines(generated.subjectLines);
      }
    };

    fetchSession();
  }, [selectedSessionId]);

  const handleSaveOutreach = async () => {
    if (!selectedSession) return;

    setIsSaving(true);
    const outreachPayload: OutreachAssets = {
      coldEmail: { subject: coldEmailSubject, body: coldEmailBody },
      followUpEmail: { subject: followUpSubject, body: followUpBody },
      linkedinMessage: linkedin,
      coldCallScript: {
        opening: callOpening,
        permission: callPermission,
        curiosityHook: callCuriosity,
        discoveryQuestions: callQuestions,
        meetingTransition: callTransition
      },
      voicemail,
      discoveryPrep: {
        questions: discQuestions,
        likelyObjections: discObjections,
        likelyGoals: discGoals,
        recommendedPositioning: discPositioning
      },
      subjectLines
    };

    try {
      // Save directly in the session's dynamic payload object (Rule compliance)
      await manager.updateSession(selectedSession.id, {
        outreach: outreachPayload
      });

      confetti({ particleCount: 50, spread: 30, colors: ['#a78bfa', '#06b6d4', '#ffffff'] });
      alert('Outreach assets successfully saved in Vault.');
      
      if (onClearPreload) {
        onClearPreload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const briefing = selectedSession?.payload?.briefing || selectedSession?.payload || {};
  const hasPhoneLeak = (briefing.bookingFindings || []).some((f: string) => f.toLowerCase().match(/voicemail|busy|phone/)) || 
                       (briefing.reviewFindings || []).some((f: string) => f.toLowerCase().match(/voicemail|busy|phone/)) ||
                       (briefing.likelyRevenueLeak || '').toLowerCase().includes('call');

  const hasFrictionBooking = (briefing.bookingFindings || []).some((f: string) => f.toLowerCase().match(/click|mindbody|checkout|pdf/)) ||
                             (briefing.likelyRevenueLeak || '').toLowerCase().includes('booking') || 
                             (briefing.likelyRevenueLeak || '').toLowerCase().includes('checkout');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Selection & Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="title-gradient" style={{ fontSize: '32px', marginBottom: '6px' }}>Outreach Studio</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Transform business intelligence logs into low-friction sales copy.
          </p>
        </div>

        {/* Audit selector dropdown */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Audit:</label>
          <select
            className="input-field"
            value={selectedSessionId}
            onChange={(e) => {
              setSelectedSessionId(e.target.value);
              if (onClearPreload) onClearPreload();
            }}
            style={{ width: '220px', appearance: 'none', background: 'rgba(9,9,12,0.8)' }}
          >
            {sessions.map((s: Session) => (
              <option key={s.id} value={s.id}>
                {s.businessName} ({s.payload.briefing?.niche || 'Custom'})
              </option>
            ))}
            {sessions.length === 0 && (
              <option value="">No completed audits found</option>
            )}
          </select>

          {selectedSession && (
            <button 
              onClick={handleSaveOutreach} 
              disabled={isSaving}
              className="btn-primary"
              style={{ fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Save size={14} /> {isSaving ? 'Saving...' : 'Save Assets'}
            </button>
          )}
        </div>
      </div>

      {sessions.length === 0 ? (
        /* Empty Analyzer logs state */
        <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <AlertTriangle size={48} color="var(--warning)" style={{ opacity: 0.8 }} />
          <div>
            <h3 style={{ fontSize: '18px' }}>No completed business audits found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px', maxWidth: '380px', lineHeight: '1.5' }}>
              The Outreach Studio requires verified prospect data. Please perform a business audit check first.
            </p>
          </div>
          <button onClick={() => setActiveTab('analyzer') as any} className="btn-primary" style={{ fontSize: '13px' }}>
            Run First Analysis
          </button>
        </div>
      ) : selectedSession ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Campaign Overview Panel */}
          <div className="glass-panel" style={{
            padding: '18px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            background: 'rgba(255,255,255,0.01)'
          }}>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', letterSpacing: '0.05em' }}>CAMPAIGN</span>
              <span style={{ fontSize: '16px', fontWeight: 700, marginTop: '2px', display: 'block' }}>{selectedSession.businessName}</span>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', letterSpacing: '0.05em' }}>STRATEGY</span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary)', marginTop: '2px', display: 'block' }}>Consultative Outreach</span>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', letterSpacing: '0.05em' }}>PRIMARY HOOK</span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--secondary)', marginTop: '2px', display: 'block' }}>
                {hasPhoneLeak ? 'Phone Abandonment' : hasFrictionBooking ? 'Booking Friction' : 'Visibility'}
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500, marginLeft: '6px' }}>
                  (Confidence: {selectedSession.payload.briefing?.confidenceScore || selectedSession.confidence}%)
                </span>
              </span>
            </div>
          </div>

          {/* Grid workspace layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Left Tab navigation */}
          <aside className="glass-panel" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', padding: '6px 8px' }}>OUTBOUND CHANNELS</span>
            {[
              { id: 'email', name: 'Email Sequences', icon: Mail },
              { id: 'call', name: 'Cold Call Script', icon: PhoneCall },
              { id: 'linkedin', name: 'LinkedIn Hook', icon: Send },
              { id: 'voicemail', name: 'Voicemail Script', icon: Volume2 },
              { id: 'prep', name: 'Discovery Prep', icon: HelpCircle },
              { id: 'subjects', name: 'Subject Lines', icon: ListOrdered }
            ].map((subTab) => {
              const Icon = subTab.icon;
              const isActive = activeSubTab === subTab.id;
              return (
                <button
                  key={subTab.id}
                  onClick={() => setActiveSubTab(subTab.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: isActive ? 'rgba(139,92,246,0.1)' : 'transparent',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 500,
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={14} color={isActive ? 'var(--primary)' : 'var(--text-secondary)'} />
                  {subTab.name}
                </button>
              );
            })}

            {/* Sidebar briefing preview stats */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '10px', paddingTop: '12px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '8px' }}>
              <div>Confidence: <strong style={{ color: 'var(--secondary)' }}>{selectedSession.payload.briefing?.confidenceScore || selectedSession.confidence}%</strong></div>
              <div>Tone: <strong style={{ color: 'var(--success)' }}>{(selectedSession.payload.briefing?.confidenceScore || selectedSession.confidence) >= 70 ? 'Evidence Direct' : 'Exploratory'}</strong></div>
            </div>
          </aside>

          {/* Main workspace editing panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {activeSubTab === 'email' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <AssetCard
                  title="Cold Outreach Email"
                  icon={<Mail size={16} color="var(--primary)" />}
                  content={`Subject: ${coldEmailSubject}\n\n${coldEmailBody}`}
                  onChange={(val) => {
                    const lines = val.split('\n');
                    const subjLine = lines[0].replace('Subject: ', '');
                    const bodyLines = lines.slice(2).join('\n');
                    setColdEmailSubject(subjLine);
                    setColdEmailBody(bodyLines);
                  }}
                />

                <AssetCard
                  title="Follow-Up Email"
                  icon={<Mail size={16} color="var(--secondary)" />}
                  content={`Subject: ${followUpSubject}\n\n${followUpBody}`}
                  onChange={(val) => {
                    const lines = val.split('\n');
                    const subjLine = lines[0].replace('Subject: ', '');
                    const bodyLines = lines.slice(2).join('\n');
                    setFollowUpSubject(subjLine);
                    setFollowUpBody(bodyLines);
                  }}
                />
              </div>
            )}

            {activeSubTab === 'linkedin' && (
              <AssetCard
                title="LinkedIn Connection / InMail Hook (Under 300 characters)"
                icon={<Send size={16} color="#0a66c2" />}
                content={linkedin}
                onChange={(val) => setLinkedin(val.substring(0, 300))}
              />
            )}

            {activeSubTab === 'voicemail' && (
              <AssetCard
                title="Voicemail script (20-30 seconds)"
                icon={<Volume2 size={16} color="var(--secondary)" />}
                content={voicemail}
                onChange={setVoicemail}
              />
            )}

            {activeSubTab === 'subjects' && (
              <AssetCard
                title="Curated Subject Lines (Curiosity Ranked)"
                icon={<ListOrdered size={16} color="var(--success)" />}
                content={subjectLines.map((s, i) => `${i + 1}. ${s}`).join('\n')}
                onChange={(val) => {
                  const cleaned = val.split('\n').map(line => line.replace(/^\d+\.\s*/, ''));
                  setSubjectLines(cleaned);
                }}
              />
            )}

            {activeSubTab === 'call' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AssetCard
                  title="Script: Greeting & Opening"
                  icon={<PhoneCall size={14} color="var(--primary)" />}
                  content={callOpening}
                  onChange={setCallOpening}
                />
                <AssetCard
                  title="Script: Request Permission"
                  icon={<PhoneCall size={14} color="var(--primary)" />}
                  content={callPermission}
                  onChange={setCallPermission}
                />
                <AssetCard
                  title="Script: Curiosity Hook"
                  icon={<PhoneCall size={14} color="var(--secondary)" />}
                  content={callCuriosity}
                  onChange={setCallCuriosity}
                />
                <AssetCard
                  title="Script: Discovery Prompts"
                  icon={<PhoneCall size={14} color="var(--success)" />}
                  content={callQuestions.join('\n\n')}
                  onChange={(val) => setCallQuestions(val.split('\n\n'))}
                />
                <AssetCard
                  title="Script: Meeting Transition"
                  icon={<PhoneCall size={14} color="var(--secondary)" />}
                  content={callTransition}
                  onChange={setCallTransition}
                />
              </div>
            )}

            {activeSubTab === 'prep' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <AssetCard
                    title="Key Discovery Questions"
                    icon={<HelpCircle size={15} color="var(--primary)" />}
                    content={discQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}
                    onChange={(val) => {
                      const cleaned = val.split('\n\n').map(line => line.replace(/^\d+\.\s*/, ''));
                      setDiscQuestions(cleaned);
                    }}
                  />
                  <AssetCard
                    title="Likely Objections & Objections Handles"
                    icon={<AlertTriangle size={15} color="var(--danger)" />}
                    content={discObjections.join('\n\n')}
                    onChange={(val) => setDiscObjections(val.split('\n\n'))}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <AssetCard
                    title="Likely Client Goals"
                    icon={<TrendingUp size={15} color="var(--success)" />}
                    content={discGoals.map((g, i) => `${i + 1}. ${g}`).join('\n')}
                    onChange={(val) => {
                      const cleaned = val.split('\n').map(line => line.replace(/^\d+\.\s*/, ''));
                      setDiscGoals(cleaned);
                    }}
                  />
                  <AssetCard
                    title="Recommended positioning strategy"
                    icon={<Send size={15} color="var(--secondary)" />}
                    content={discPositioning}
                    onChange={setDiscPositioning}
                  />
                </div>
              </div>
            )}

          </div>
        </div>
        </div>
      ) : (
        <div style={{ color: 'var(--text-muted)' }}>Loading...</div>
      )}
    </div>
  );
};
