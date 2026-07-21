'use client';

import React, { useState } from 'react';
import { Search, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { LiveObserverPulse, PulseStep } from '@/components/LiveObserverPulse';
import { BriefView } from '@/components/BriefView';
import { PheebsBrief, ThinkingTrace } from '@/packages/shared/types';

const PRESET_ACCOUNTS = [
  { name: 'Bright Smile Orthodontics', url: 'https://maps.google.com/?q=Bright+Smile+Orthodontics+San+Francisco' },
  { name: 'Evergreen Dental Care', url: 'https://maps.google.com/?q=Evergreen+Dental+Care+Seattle' },
  { name: 'Apex Chiropractic', url: 'https://maps.google.com/?q=Apex+Spinal+Sports+Chiropractic+Austin' }
];

export default function PheebsGenesisPage() {
  const [inputUrl, setInputUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pulseSteps, setPulseSteps] = useState<PulseStep[]>([]);
  const [generatedBrief, setGeneratedBrief] = useState<PheebsBrief | null>(null);
  const [generatedTrace, setGeneratedTrace] = useState<ThinkingTrace | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async (targetUrl?: string) => {
    const urlToUse = targetUrl || inputUrl;
    if (!urlToUse.trim()) {
      setErrorMsg('Please enter a Google Business Profile or Maps URL');
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);
    setGeneratedBrief(null);
    setGeneratedTrace(undefined);

    // Initialize execution pulse steps with versioning
    const initialSteps: PulseStep[] = [
      { key: 'observer', title: 'Observer Service', desc: 'Extracting factual Business Record & Signals (No AI)', version: 'v1.0.0', status: 'running' },
      { key: 'reasoner', title: 'The Brain Reasoner', desc: 'Diagnosing primary constraint over observed Signals', version: 'v1.0.0', status: 'pending' },
      { key: 'strategist', title: 'The Brain Strategist', desc: 'Formulating discovery question & opening call hook', version: 'v1.0.0', status: 'pending' },
      { key: 'playbook', title: 'Zoca Playbook Engine', desc: 'Selecting actionable recommendation & pitch anchor', version: 'v1.0.0', status: 'pending' }
    ];
    setPulseSteps(initialSteps);

    try {
      await new Promise(r => setTimeout(r, 500));
      setPulseSteps(prev => prev.map(s => s.key === 'observer' ? { ...s, status: 'done' } : s.key === 'reasoner' ? { ...s, status: 'running' } : s));

      await new Promise(r => setTimeout(r, 600));
      setPulseSteps(prev => prev.map(s => s.key === 'reasoner' ? { ...s, status: 'done' } : s.key === 'strategist' ? { ...s, status: 'running' } : s));

      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToUse, playbookKey: 'zoca' })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate brief');
      }

      setPulseSteps(prev => prev.map(s => s.key === 'strategist' ? { ...s, status: 'done' } : s.key === 'playbook' ? { ...s, status: 'running' } : s));
      await new Promise(r => setTimeout(r, 400));

      const responseData = await res.json();
      const briefData: PheebsBrief = responseData.brief;
      const traceData: ThinkingTrace = responseData.trace;

      setPulseSteps(prev => prev.map(s => ({ ...s, status: 'done' })));
      await new Promise(r => setTimeout(r, 300));

      setGeneratedBrief(briefData);
      setGeneratedTrace(traceData);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error executing pipeline');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', padding: '60px 24px', position: 'relative' }}>
      
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '1000px',
        height: '500px',
        background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.12) 0%, rgba(9, 9, 11, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header Branding Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#818CF8',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            <Cpu size={14} color="#818CF8" />
            Pheebs Core — Genesis v0.2 Judgment Engine
          </div>
        </div>

        {/* HERO SECTION */}
        {!generatedBrief && (
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '-0.03em',
              lineHeight: 1.15
            }}>
              Never start a sales call <br />
              <span style={{
                background: 'linear-gradient(135deg, #818CF8 0%, #C084FC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                without Pheebs.
              </span>
            </h1>

            <p style={{
              fontSize: '16px',
              color: '#9CA3AF',
              maxWidth: '580px',
              margin: '16px auto 0 auto',
              lineHeight: 1.6
            }}>
              Observer Signals ➔ The Brain ➔ Playbooks. Paste a Google Business Profile to generate your versioned thinking trace.
            </p>

            {/* Input Bar */}
            <div style={{
              maxWidth: '680px',
              margin: '36px auto 0 auto',
              background: 'rgba(24, 24, 27, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '8px 8px 8px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
            }}>
              <Search size={20} color="#71717A" />
              <input
                type="text"
                placeholder="Paste Google Maps or Profile URL (e.g. maps.google.com/?q=Bright+Smile)"
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !isGenerating && handleGenerate()}
                disabled={isGenerating}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '14.5px',
                  fontFamily: 'inherit'
                }}
              />
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                className="btn-glow"
                style={{
                  padding: '12px 24px',
                  fontSize: '13.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  opacity: isGenerating ? 0.7 : 1
                }}
              >
                {isGenerating ? 'Observing...' : 'Generate Brief'}
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <p style={{ color: '#EF4444', fontSize: '13px', marginTop: '12px' }}>
                {errorMsg}
              </p>
            )}

            {/* Quick preset chips */}
            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: '#71717A', fontWeight: 500 }}>Try sample target:</span>
              {PRESET_ACCOUNTS.map((account, i) => (
                <button
                  key={i}
                  className="chip-preset"
                  onClick={() => {
                    setInputUrl(account.url);
                    handleGenerate(account.url);
                  }}
                  disabled={isGenerating}
                >
                  {account.name}
                </button>
              ))}
            </div>

          </div>
        )}

        {/* LIVE OBSERVER PULSE ANIMATION */}
        {isGenerating && (
          <LiveObserverPulse steps={pulseSteps} />
        )}

        {/* OPINIONATED BRIEF VIEW */}
        {generatedBrief && (
          <BriefView
            brief={generatedBrief}
            trace={generatedTrace}
            onReset={() => {
              setGeneratedBrief(null);
              setGeneratedTrace(undefined);
              setInputUrl('');
            }}
          />
        )}

        {/* Footer Principles Disclaimer */}
        <div style={{ textAlign: 'center', marginTop: '60px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '24px' }}>
          <p style={{ fontSize: '12px', color: '#52525B', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <ShieldCheck size={14} color="#52525B" />
            Principle: Never show information before a recommendation. Save Thinking, not just Briefs.
          </p>
        </div>

      </div>
    </main>
  );
}
