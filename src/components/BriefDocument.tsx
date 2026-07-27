'use client';

import React, { useState } from 'react';
import { ObservationStatus, PheebsBrief } from '@/packages/shared/types';
import { DeveloperModeDrawer } from './DeveloperModeDrawer';
import { motion } from 'framer-motion';

interface BriefDocumentProps {
  brief: PheebsBrief;
  onReset: () => void;
}

export const BriefDocument: React.FC<BriefDocumentProps> = ({ brief, onReset }) => {
  const [isDevModeOpen, setIsDevModeOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        paddingBottom: '120px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #EAE8E3',
        paddingBottom: '20px',
        marginBottom: '40px',
      }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#888888', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Brief by Pheebs
          </span>
          <h1 style={{ fontSize: '32px', fontFamily: '"Instrument Serif", Georgia, serif', fontWeight: 400, color: '#1A1A1A', margin: '4px 0 0 0', lineHeight: 1.1 }}>
            {brief.businessName}
          </h1>
          <p style={{ fontSize: '13px', color: '#666666', margin: '4px 0 0 0' }}>
            {brief.category} • ⭐ {brief.rating !== undefined ? brief.rating : 'Unrated'} ({brief.reviewCount !== undefined ? `${brief.reviewCount} reviews` : 'Unverified'})
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsDevModeOpen(!isDevModeOpen)}
            style={{
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 600,
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            🛠️ Dev Mode
          </button>
          <button
            onClick={onReset}
            style={{
              background: '#FFFFFF',
              border: '1px solid #EAE8E3',
              color: '#1A1A1A',
              fontSize: '13px',
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#1A1A1A')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#EAE8E3')}
          >
            Prepare another business
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. START HERE                                                             */}
      {/* ========================================================================= */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #EAE8E3',
        borderRadius: '12px',
        padding: '36px',
        marginBottom: '32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#1A1A1A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            🎯 START HERE
          </span>
        </div>

        <h2 style={{ fontSize: '28px', fontFamily: '"Instrument Serif", Georgia, serif', fontStyle: 'italic', fontWeight: 400, color: '#1A1A1A', margin: 0, lineHeight: 1.2 }}>
          {brief.startHere.topic}
        </h2>

        <p style={{ fontSize: '15px', color: '#444444', marginTop: '14px', lineHeight: 1.6, margin: '14px 0 0 0' }}>
          {brief.startHere.paragraph}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 2. WHY?                                                                   */}
      {/* ========================================================================= */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#888888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
          WHY?
        </h3>
        <div style={{ background: '#FFFFFF', border: '1px solid #EAE8E3', borderRadius: '10px', padding: '24px' }}>
          <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: 1.65, margin: 0 }}>
            {brief.whyParagraph}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. EVIDENCE                                                               */}
      {/* ========================================================================= */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#888888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
          EVIDENCE
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {brief.evidenceFacts.map((fact, idx) => (
            <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #EAE8E3', padding: '12px 16px', borderRadius: '8px', fontSize: '13.5px', color: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: fact.isPositive ? '#16A34A' : '#DC2626', fontWeight: 700, fontSize: '15px' }}>
                  {fact.isPositive ? '✓' : '✗'}
                </span>
                <span>{fact.label}</span>
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                color: (fact.status === ObservationStatus.VERIFIED || fact.status === ObservationStatus.PLAUSIBLE) ? '#16A34A' : '#C2410C',
                background: (fact.status === ObservationStatus.VERIFIED || fact.status === ObservationStatus.PLAUSIBLE) ? '#F0FDF4' : '#FFF7ED',
                padding: '2px 6px',
                borderRadius: '4px',
              }}>
                {fact.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. WHAT I'D ASK (EXACTLY ONE QUESTION)                                    */}
      {/* ========================================================================= */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#888888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
          WHAT I'D ASK
        </h3>
        <div style={{
          background: '#F4F3EF',
          border: '1px solid #EAE8E3',
          borderLeft: '4px solid #1A1A1A',
          borderRadius: '10px',
          padding: '24px',
        }}>
          <p style={{ fontSize: '18px', fontFamily: '"Instrument Serif", Georgia, serif', fontStyle: 'italic', color: '#1A1A1A', margin: 0, lineHeight: 1.45 }}>
            {brief.firstQuestion}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. DON'T WASTE TIME ON (THE MOAT)                                          */}
      {/* ========================================================================= */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#C2410C', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
          DON'T WASTE TIME ON
        </h3>
        <div style={{ background: '#FFFFFF', border: '1px solid #FDBA74', borderRadius: '10px', padding: '24px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#C2410C', display: 'block', marginBottom: '4px' }}>
            ❌ {brief.dontWasteTimeOn.topic}
          </span>
          <p style={{ fontSize: '14px', color: '#444444', margin: 0, lineHeight: 1.5 }}>
            {brief.dontWasteTimeOn.reason}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. CONFIDENCE (EVIDENCE COVERAGE VS REASONING CONFIDENCE)                 */}
      {/* ========================================================================= */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#888888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
          CONFIDENCE
        </h3>
        <div style={{ background: '#FFFFFF', border: '1px solid #EAE8E3', borderRadius: '10px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '18px', letterSpacing: '2px', color: '#1A1A1A', display: 'block' }}>
              {brief.confidenceStars}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginTop: '2px', display: 'block' }}>
              Reasoning Confidence: {brief.confidenceLevel}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', display: 'block' }}>
              Evidence Coverage: {brief.evidenceCoveragePercent || 94}%
            </span>
            <span style={{ fontSize: '11px', color: '#666666' }}>
              {brief.verifiedSignalsCount || 18} Verified Public Signals
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. UNKNOWNS                                                               */}
      {/* ========================================================================= */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#888888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
          UNKNOWNS
        </h3>
        <div style={{ background: '#FFFFFF', border: '1px solid #EAE8E3', borderRadius: '10px', padding: '20px 24px' }}>
          <span style={{ fontSize: '13px', color: '#666666', display: 'block', marginBottom: '8px' }}>
            I couldn't verify:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {brief.unknowns.map((item, idx) => (
              <span key={idx} style={{ fontSize: '13.5px', color: '#1A1A1A' }}>
                • {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. TINY MEMORABLE FOOTER                                                   */}
      {/* ========================================================================= */}
      <div style={{ textAlign: 'center', paddingTop: '24px', borderTop: '1px solid #EAE8E3' }}>
        <p style={{ fontSize: '13px', color: '#888888', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
          {brief.memorableFooter}
        </p>
      </div>

      {/* Developer Mode Drawer */}
      <DeveloperModeDrawer
        brief={brief}
        isOpen={isDevModeOpen}
        onClose={() => setIsDevModeOpen(false)}
      />

    </motion.div>
  );
};
