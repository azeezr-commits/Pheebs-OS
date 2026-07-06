import React, { useState, useEffect } from 'react';
import { performAudit } from './analyzerEngine';
import { BriefingRenderer } from './BriefingRenderer';
import { useSessionEngine } from '../../core/session-engine/SessionContext';
import { globalEventBus } from '../../core/event-bus/EventBus';
import type { AEBriefing } from '../../domain/business/types';
import { SearchCode, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AnalyzerModuleProps {
  onOpenOutreach?: (sessionId: string) => void;
  onPracticeCall?: () => void;
  initialSearchName?: string;
  onClearInitialSearch?: () => void;
}

export const AnalyzerModule: React.FC<AnalyzerModuleProps> = ({ 
  onOpenOutreach, 
  onPracticeCall,
  initialSearchName,
  onClearInitialSearch
}) => {
  const { manager } = useSessionEngine();

  // Inputs
  const [bizName, setBizName] = useState(initialSearchName || '');
  const [website, setWebsite] = useState('');
  const [gpbUrl, setGpbUrl] = useState('');
  const [niche, setNiche] = useState<string>('Salon');
  const [aeNotes, setAeNotes] = useState('');

  useEffect(() => {
    if (initialSearchName) {
      setBizName(initialSearchName);
      if (onClearInitialSearch) {
        onClearInitialSearch();
      }
    }
  }, [initialSearchName]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [briefing, setBriefing] = useState<AEBriefing | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName) return;

    setLoading(true);
    const steps = [
      'Scoping website domain structures...',
      'Validating Google Business Profile indexes...',
      'Parsing AE manual observations and evidence logs...',
      'Calculating audit confidence score (Rule 5)...'
    ];

    let stepIdx = 0;
    setLoadingStep(steps[0]);

    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setLoadingStep(steps[stepIdx]);
      }
    }, 600);

    try {
      // Simulate audit interval delay
      await new Promise(resolve => setTimeout(resolve, 2400));
      clearInterval(interval);

      const report = await performAudit(bizName, website, gpbUrl, niche, aeNotes);
      setBriefing(report);

      // Instantiate a DRAFT session in the Session Engine (Foundation requirements!)
      const session = await manager.createSession('analyzer', {
        businessName: report.businessName,
        website: report.website,
        status: 'Draft',
        briefing: report
      });
      setActiveSessionId(session.id);
      await manager.startSession(session.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToVault = async () => {
    if (!briefing || !activeSessionId) return;

    setIsSaving(true);
    try {
      // Transition Draft session to Completed with full briefing payload
      await manager.updateSession(activeSessionId, { briefing });
      await manager.completeSession(activeSessionId);

      // Emit completed event on EventBus (Decoupled subscriber integration!)
      globalEventBus.emit('analysis:completed', {
        businessId: briefing.id,
        website: briefing.website,
        score: briefing.confidenceScore
      });

      confetti({ particleCount: 60, spread: 45, colors: ['#06b6d4', '#8b5cf6', '#ffffff'] });
      alert('Briefing logged to Practice Vault. Session closed.');
      
      // Reset
      setBriefing(null);
      setActiveSessionId(null);
      setBizName('');
      setWebsite('');
      setGpbUrl('');
      setAeNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenOutreach = async () => {
    if (!briefing || !activeSessionId) return;
    try {
      await manager.updateSession(activeSessionId, { briefing });
      await manager.completeSession(activeSessionId);
      
      globalEventBus.emit('analysis:completed', {
        businessId: briefing.id,
        website: briefing.website,
        score: briefing.confidenceScore
      });

      if (onOpenOutreach) {
        onOpenOutreach(activeSessionId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {briefing ? (
        /* Render Computed Briefing */
        <BriefingRenderer
          briefing={briefing}
          onBack={() => setBriefing(null)}
          onSave={handleSaveToVault}
          isSaving={isSaving}
          onOpenOutreach={handleOpenOutreach}
          onPracticeCall={onPracticeCall}
        />
      ) : loading ? (
        /* Audit loader spinner */
        <div style={{
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <div className="spin-slow" style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(139, 92, 246, 0.1)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{ fontWeight: 600, fontSize: '16px', letterSpacing: '-0.01em' }}>Compiling Pre-Call Briefing...</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontFamily: 'monospace' }}>
            {loadingStep}
          </div>
        </div>
      ) : (
        /* Form Inputs */
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <h1 className="title-gradient" style={{ fontSize: '32px', marginBottom: '8px' }}>Pre-Call Business Analyzer</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Create an AE pitch briefing in under 2 minutes. Enter business facts and manual observations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', marginBottom: '6px' }}>
              <SearchCode size={20} color="var(--primary)" /> Prospect Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Business Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Glow Med Spa" 
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Niche Vertical</label>
                <select 
                  className="input-field"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  style={{ appearance: 'none', background: 'rgba(9,9,12,0.8)' }}
                >
                  <option value="Salon">Julie (Glow Salon/Spa)</option>
                  <option value="Med Spa">Bloom Aesthetic Center</option>
                  <option value="Dental">Vertex Dental Clinic</option>
                  <option value="Fitness">Forge Gym/Fitness</option>
                  <option value="Custom">Custom Niche</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Website URL</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. glowmedspa.com" 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Google Maps / GBP link</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. google.com/maps/place/..." 
                  value={gpbUrl}
                  onChange={(e) => setGpbUrl(e.target.value)}
                />
              </div>
            </div>

            {/* AE Observations Area (Sourced evidence) */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                AE Manual Observations (Evidence Sourcing)
              </label>
              <textarea 
                className="input-field" 
                rows={4}
                placeholder="What did you observe? e.g., 'Called at 12 PM, went to voicemail', 'Mindbody checkout widget takes 5 clicks to book', 'Review claims they don't pick up during peak hours'."
                value={aeNotes}
                onChange={(e) => setAeNotes(e.target.value)}
                style={{ resize: 'none' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                <HelpCircle size={12} /> Sourced observations prevent hallucinated analytics and provide concrete discovery anchors.
              </span>
            </div>

            <button 
              type="submit"
              className="btn-primary"
              style={{ padding: '12px', justifyContent: 'center', marginTop: '10px', fontSize: '14px' }}
            >
              Analyze & Generate Briefing
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
