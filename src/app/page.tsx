'use client';

import React, { useState } from 'react';
import { ThinkingSequence, SequenceStep } from '@/components/ThinkingSequence';
import { BriefDocument } from '@/components/BriefDocument';
import { BriefByPheebs } from '@/packages/shared/types';

const PRESET_ACCOUNTS = [
  { name: 'Bright Smile Orthodontics', url: 'https://maps.google.com/?q=Bright+Smile+Orthodontics+San+Francisco' },
  { name: 'Evergreen Dental Care', url: 'https://maps.google.com/?q=Evergreen+Dental+Care+Seattle' },
  { name: 'Apex Chiropractic', url: 'https://maps.google.com/?q=Apex+Spinal+Sports+Chiropractic+Austin' }
];

export default function BriefByPheebsPage() {
  const [inputUrl, setInputUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<SequenceStep[]>([]);
  const [brief, setBrief] = useState<BriefByPheebs | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async (targetUrl?: string) => {
    const urlToUse = targetUrl || inputUrl;
    if (!urlToUse.trim()) {
      setErrorMsg('Please paste a Google Business Profile or Maps URL');
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);
    setBrief(null);

    const initialSteps: SequenceStep[] = [
      { label: 'Reading Google Business Profile', status: 'active' },
      { label: 'Understanding customer signals', status: 'pending' },
      { label: 'Identifying growth constraint', status: 'pending' },
      { label: 'Preparing conversation strategy', status: 'pending' }
    ];
    setThinkingSteps(initialSteps);

    try {
      await new Promise(r => setTimeout(r, 450));
      setThinkingSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'done' } : i === 1 ? { ...s, status: 'active' } : s));

      await new Promise(r => setTimeout(r, 550));
      setThinkingSteps(prev => prev.map((s, i) => i === 1 ? { ...s, status: 'done' } : i === 2 ? { ...s, status: 'active' } : s));

      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToUse })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to prepare brief');
      }

      setThinkingSteps(prev => prev.map((s, i) => i === 2 ? { ...s, status: 'done' } : i === 3 ? { ...s, status: 'active' } : s));
      await new Promise(r => setTimeout(r, 400));

      const data: BriefByPheebs = await res.json();

      setThinkingSteps(prev => prev.map(s => ({ ...s, status: 'done' })));
      await new Promise(r => setTimeout(r, 300));

      setBrief(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error preparing brief');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', padding: '80px 24px 60px 24px', background: '#F8F7F4' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* LANDING HERO (Rendered when no brief is open) */}
        {!brief && !isGenerating && (
          <div style={{ textAlign: 'center', margin: '40px 0 60px 0' }}>
            
            {/* Logo / Brand Header */}
            <div style={{ marginBottom: '32px' }}>
              <span style={{
                fontSize: '24px',
                fontFamily: 'Instrument Serif, serif',
                letterSpacing: '0.15em',
                color: '#161616',
                display: 'block',
                fontWeight: 400
              }}>
                BRIEF
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#666666',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: '4px',
                display: 'block'
              }}>
                by Pheebs
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: '52px',
              fontFamily: 'Instrument Serif, serif',
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#161616',
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}>
              Walk in prepared. <br />
              Every single time.
            </h1>

            {/* Centered Input Box */}
            <div style={{
              maxWidth: '580px',
              margin: '40px auto 0 auto',
              background: '#FFFFFF',
              border: '1px solid #E8E5DF',
              borderRadius: '12px',
              padding: '8px 8px 8px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 4px 20px rgba(22, 22, 22, 0.04)'
            }}>
              <input
                type="text"
                placeholder="Paste any Google Business Profile URL"
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#161616',
                  fontSize: '15px',
                  fontFamily: 'inherit'
                }}
              />
              <button
                onClick={() => handleGenerate()}
                className="btn-primary"
                style={{ whiteSpace: 'nowrap' }}
              >
                Prepare Me
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <p style={{ color: '#C2410C', fontSize: '13px', marginTop: '12px' }}>
                {errorMsg}
              </p>
            )}

            {/* Preset Account Chips */}
            <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12.5px', color: '#666666' }}>Try sample account:</span>
              {PRESET_ACCOUNTS.map((acc, idx) => (
                <button
                  key={idx}
                  className="chip-preset"
                  onClick={() => {
                    setInputUrl(acc.url);
                    handleGenerate(acc.url);
                  }}
                >
                  {acc.name}
                </button>
              ))}
            </div>

            {/* Tagline Footer */}
            <p style={{
              fontSize: '13px',
              color: '#888888',
              fontStyle: 'italic',
              marginTop: '56px'
            }}>
              Not a report. A point of view.
            </p>

          </div>
        )}

        {/* THINKING SEQUENCE */}
        {isGenerating && (
          <ThinkingSequence steps={thinkingSteps} />
        )}

        {/* BRIEF DOCUMENT (RECOMMENDATION FIRST) */}
        {brief && !isGenerating && (
          <BriefDocument
            brief={brief}
            onReset={() => {
              setBrief(null);
              setInputUrl('');
            }}
          />
        )}

      </div>
    </main>
  );
}
