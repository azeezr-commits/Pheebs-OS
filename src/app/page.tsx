'use client';

import React, { useState } from 'react';
import { ThinkingSequence } from '@/components/ThinkingSequence';
import { BriefDocument } from '@/components/BriefDocument';
import { PheebsBrief } from '@/packages/shared/types';

const PRESET_ACCOUNTS = [
  { name: 'Brooklyn Brows NYC', url: 'https://maps.google.com/?q=Brooklyn+Brows+NYC' },
  { name: 'Bright Smile Orthodontics', url: 'https://maps.google.com/?q=Bright+Smile+Orthodontics+San+Francisco' },
  { name: 'Evergreen Dental Care', url: 'https://maps.google.com/?q=Evergreen+Dental+Care+Seattle' },
];

export default function PheebsV0Page() {
  const [inputUrl, setInputUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [brief, setBrief] = useState<PheebsBrief | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async (targetUrl?: string) => {
    const urlToUse = targetUrl || inputUrl;
    if (!urlToUse.trim()) {
      setErrorMsg('Please paste a Google Business Profile URL');
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);
    setBrief(null);
    setCurrentStepIndex(0);

    // 6-8 Second Calm Conversation Sequence Timer
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < 4) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 1400);

    try {
      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToUse }),
      });

      if (!res.ok) {
        clearInterval(stepInterval);
        const err = await res.json();
        setErrorMsg(err.error || "I couldn't confidently identify the business. Please provide another Google Business Profile.");
        setIsGenerating(false);
        return;
      }

      const data: PheebsBrief = await res.json();

      // Ensure full 6-8s calm experience finishes before showing brief
      setTimeout(() => {
        clearInterval(stepInterval);
        setIsGenerating(false);
        setBrief(data);
      }, 6500);

    } catch (err: any) {
      clearInterval(stepInterval);
      console.error(err);
      setErrorMsg(err.message || 'Error preparing brief');
      setIsGenerating(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', padding: '90px 24px 60px 24px', background: '#FBFBF9' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        {/* 1. LANDING HERO EXPERIENCE */}
        {!brief && !isGenerating && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            
            {/* Header Title */}
            <h1 style={{
              fontSize: '44px',
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontWeight: 400,
              color: '#1A1A1A',
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              Pheebs
            </h1>

            <p style={{
              fontSize: '15px',
              color: '#666666',
              marginTop: '4px',
              fontStyle: 'italic',
            }}>
              Know where to start.
            </p>

            {/* Playful Prompt */}
            <div style={{ margin: '48px 0 28px 0' }}>
              <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>👀</span>
              <p style={{
                fontSize: '22px',
                fontFamily: '"Instrument Serif", Georgia, serif',
                fontStyle: 'italic',
                color: '#1A1A1A',
                margin: 0,
                lineHeight: 1.3,
              }}>
                “Oh good.<br />
                Another business.”
              </p>
            </div>

            {/* Centered Minimalist Input */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #EAE8E3',
              borderRadius: '12px',
              padding: '8px 8px 8px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
              marginTop: '32px',
            }}>
              <input
                type="text"
                placeholder="Paste a Google Business Profile URL"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#1A1A1A',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                }}
              />
              <button
                onClick={() => handleGenerate()}
                style={{
                  background: '#1A1A1A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1.0')}
              >
                Let's investigate →
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div style={{
                background: '#FFF7ED',
                border: '1px solid #FDBA74',
                color: '#C2410C',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '13.5px',
                marginTop: '20px',
                textAlign: 'center',
              }}>
                {errorMsg}
              </div>
            )}

            {/* Preset Samples */}
            <div style={{ marginTop: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12.5px', color: '#888888' }}>Try sample:</span>
              {PRESET_ACCOUNTS.map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputUrl(acc.url);
                    handleGenerate(acc.url);
                  }}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #EAE8E3',
                    borderRadius: '20px',
                    padding: '5px 14px',
                    fontSize: '12.5px',
                    color: '#444444',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1A1A1A';
                    e.currentTarget.style.color = '#1A1A1A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#EAE8E3';
                    e.currentTarget.style.color = '#444444';
                  }}
                >
                  {acc.name}
                </button>
              ))}
            </div>

          </div>
        )}

        {/* 2. CONVERSATIONAL LOADING (6-8 SECONDS) */}
        {isGenerating && (
          <ThinkingSequence currentStepIndex={currentStepIndex} />
        )}

        {/* 3. THE BRIEF DOCUMENT */}
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
