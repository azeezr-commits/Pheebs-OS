'use client';

import React, { useState } from 'react';
import { PheebsBrief } from '@/packages/shared/types';
import { motion } from 'framer-motion';

interface BriefDocumentProps {
  brief: PheebsBrief;
  onReset: () => void;
}

export const BriefDocument: React.FC<BriefDocumentProps> = ({ brief, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyOpening = () => {
    navigator.clipboard.writeText(brief.opening);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        maxWidth: '840px',
        margin: '0 auto',
        paddingBottom: '100px',
        fontFamily: 'Inter, -apple-system, sans-serif'
      }}
    >
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #E8E5DF',
        paddingBottom: '20px',
        marginBottom: '32px'
      }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Brief by Pheebs
          </span>
          <h1 style={{ fontSize: '28px', fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', color: '#161616', margin: 0, marginTop: '2px' }}>
            {brief.businessName}
          </h1>
          <p style={{ fontSize: '13px', color: '#666666', margin: 0, marginTop: '2px' }}>
            {brief.category} • {brief.address} • ⭐ {brief.rating} ({brief.reviewCount} reviews)
          </p>
          {brief.versions && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, background: '#F1EFEA', padding: '2px 8px', borderRadius: '4px', border: '1px solid #E8E5DF', color: '#666' }}>
                Observer v{brief.versions.observer}
              </span>
              <span style={{ fontSize: '10px', fontWeight: 600, background: '#F1EFEA', padding: '2px 8px', borderRadius: '4px', border: '1px solid #E8E5DF', color: '#666' }}>
                Evidence v{brief.versions.evidence}
              </span>
              <span style={{ fontSize: '10px', fontWeight: 600, background: '#F1EFEA', padding: '2px 8px', borderRadius: '4px', border: '1px solid #E8E5DF', color: '#666' }}>
                Prioritization v{brief.versions.prioritization}
              </span>
              <span style={{ fontSize: '10px', fontWeight: 600, background: '#F1EFEA', padding: '2px 8px', borderRadius: '4px', border: '1px solid #E8E5DF', color: '#666' }}>
                Judgment v{brief.versions.judgment}
              </span>
              <span style={{ fontSize: '10px', fontWeight: 600, background: '#F1EFEA', padding: '2px 8px', borderRadius: '4px', border: '1px solid #E8E5DF', color: '#666' }}>
                Conversation v{brief.versions.conversation}
              </span>
              <span style={{ fontSize: '10px', fontWeight: 600, background: '#F1EFEA', padding: '2px 8px', borderRadius: '4px', border: '1px solid #E8E5DF', color: '#666' }}>
                Renderer v{brief.versions.renderer}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onReset}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E8E5DF',
            color: '#161616',
            fontSize: '12.5px',
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#161616'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#E8E5DF'}
        >
          Prepare Another Account
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: ABOVE THE FOLD (NO SCROLLING REQUIRED)                         */}
      {/* ========================================================================= */}
      <div className="warm-card" style={{ padding: '36px', marginBottom: '40px', background: '#FFFFFF', border: '1px solid #E8E5DF' }}>
        
        {/* START HERE Callout Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              🎯 START HERE
            </span>
            {brief.startHere.primaryConstraint && (
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#FFFFFF', background: brief.startHere.primaryConstraint === 'Unknown' ? '#64748B' : '#0F172A', padding: '2px 8px', borderRadius: '4px' }}>
                Constraint: {brief.startHere.primaryConstraint}
              </span>
            )}
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: brief.startHere.confidence === 'Low' ? '#C2410C' : '#0F172A', background: '#F1EFEA', padding: '3px 10px', borderRadius: '12px', border: '1px solid #E8E5DF' }}>
            Confidence: {brief.startHere.confidence} {brief.startHere.confidenceScore !== undefined ? `(${Math.round(brief.startHere.confidenceScore * 100)}%)` : ''}
          </span>
        </div>

        <h2 style={{ fontSize: '32px', fontFamily: 'Instrument Serif, serif', fontWeight: 400, color: '#161616', margin: 0, lineHeight: 1.2 }}>
          {brief.startHere.topic}
        </h2>

        {brief.startHere.primaryConstraint === 'Unknown' && (
          <div style={{ marginTop: '14px', background: '#FFF7ED', border: '1px solid #FFEDD5', padding: '12px 16px', borderRadius: '6px', fontSize: '13.5px', color: '#9A3412' }}>
            ⚠️ <strong>Insufficient public evidence detected.</strong> Rather than guessing a recommendation, validate intake flow during discovery.
          </div>
        )}

        <p style={{ fontSize: '15px', color: '#444444', marginTop: '14px', lineHeight: 1.6, maxWidth: '720px' }}>
          {brief.startHere.why}
        </p>

        {/* Why Not (Deliberately Ignore) Grid */}
        <div style={{ marginTop: '28px', borderTop: '1px solid #F1EFEA', paddingTop: '24px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#888888', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '14px' }}>
            Why not (Deliberately ignore today):
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {brief.whyNot.map((item, idx) => (
              <div key={idx} style={{ background: '#F9F8F6', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E8E5DF' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#C2410C', display: 'block', marginBottom: '4px' }}>
                  ❌ {item.topic}
                </span>
                <span style={{ fontSize: '12px', color: '#666666', lineHeight: 1.4, display: 'block' }}>
                  {item.reason}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* First Question Highlight Box */}
        <div style={{
          marginTop: '28px',
          background: '#F1EFEA',
          border: '1px solid #E8E5DF',
          borderLeft: '4px solid #0F172A',
          padding: '20px 24px',
          borderRadius: '8px'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
            First Question to Ask
          </span>
          <p style={{ fontSize: '17px', fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', color: '#161616', margin: 0, lineHeight: 1.4 }}>
            {brief.firstQuestion}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: BELOW THE FOLD (SUPPORTING EVIDENCE & PREPARATION)              */}
      {/* ========================================================================= */}
      
      {/* 1. Business Context (One Concise Paragraph) */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '20px', fontFamily: 'Instrument Serif, serif', color: '#161616', margin: 0, marginBottom: '10px' }}>
          Business Context
        </h3>
        <p style={{ fontSize: '15px', color: '#444444', lineHeight: 1.6, margin: 0, background: '#FFFFFF', padding: '20px 24px', borderRadius: '10px', border: '1px solid #E8E5DF' }}>
          {brief.businessContext}
        </p>
      </div>

      {/* 2. Ranked Priorities (The Heart of Pheebs & The Moat) */}
      {brief.priorityRanking && brief.priorityRanking.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '20px', fontFamily: 'Instrument Serif, serif', color: '#161616', margin: 0 }}>
              Evidence Priority Ranking
            </h3>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', background: '#F1EFEA', padding: '2px 10px', borderRadius: '12px', border: '1px solid #E8E5DF' }}>
              Ranked by Judgment Engine
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {brief.priorityRanking.map((p, idx) => (
              <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #E8E5DF', borderLeft: p.rank === 1 ? '4px solid #0F172A' : '1px solid #E8E5DF', padding: '16px 20px', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: p.rank === 1 ? '#FFFFFF' : '#666666', background: p.rank === 1 ? '#0F172A' : '#F1EFEA', padding: '2px 8px', borderRadius: '12px' }}>
                  #{p.rank}
                </span>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#161616', display: 'block', marginBottom: '2px' }}>
                    {p.label}
                  </span>
                  <span style={{ fontSize: '13px', color: '#555555', lineHeight: 1.4, display: 'block' }}>
                    {p.importanceReason}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Falsification Evidence ("What evidence could prove us wrong?") */}
      {brief.falsificationEvidence && brief.falsificationEvidence.length > 0 && (
        <div style={{ marginBottom: '40px', background: '#FAF5FF', border: '1px solid #F3E8FF', padding: '20px 24px', borderRadius: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#7E22CE', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            🔍 What evidence could prove us wrong?
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {brief.falsificationEvidence.map((item, idx) => (
              <span key={idx} style={{ fontSize: '13.5px', color: '#581C87', lineHeight: 1.5 }}>
                • {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3. Conversation Strategy Timeline */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '20px', fontFamily: 'Instrument Serif, serif', color: '#161616', margin: 0, marginBottom: '14px' }}>
          Conversation Strategy
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {brief.timeline.map((step, idx) => (
            <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #E8E5DF', padding: '16px', borderRadius: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                {step.minute}
              </span>
              <span style={{ fontSize: '13px', color: '#444444', lineHeight: 1.4, display: 'block' }}>
                {step.action}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Discovery Questions */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '20px', fontFamily: 'Instrument Serif, serif', color: '#161616', margin: 0, marginBottom: '14px' }}>
          Discovery Questions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Primary Question */}
          <div style={{ background: '#FFFFFF', border: '1px solid #0F172A', padding: '18px 20px', borderRadius: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
              ⭐ Ask this first
            </span>
            <p style={{ fontSize: '15px', fontWeight: 500, color: '#161616', margin: 0 }}>
              {brief.questions.primary}
            </p>
          </div>

          {/* Secondary Questions */}
          {brief.questions.secondary.map((q, idx) => (
            <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #E8E5DF', padding: '14px 20px', borderRadius: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>
                Other useful question
              </span>
              <p style={{ fontSize: '14px', color: '#444444', margin: 0 }}>
                {q}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Objections (Exactly 3) */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '20px', fontFamily: 'Instrument Serif, serif', color: '#161616', margin: 0, marginBottom: '14px' }}>
          Likely Objections & Responses
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {brief.objections.map((obj, idx) => (
            <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #E8E5DF', padding: '18px 20px', borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#C2410C', margin: 0, marginBottom: '6px' }}>
                {obj.objection}
              </p>
              <p style={{ fontSize: '13.5px', color: '#444444', margin: 0, lineHeight: 1.5 }}>
                {obj.response}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Human Opening Call Script */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '20px', fontFamily: 'Instrument Serif, serif', color: '#161616', margin: 0 }}>
            Opening Call Script
          </h3>
          <button
            onClick={handleCopyOpening}
            style={{ background: 'transparent', border: 'none', color: '#666666', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}
          >
            {copied ? 'Copied ✓' : 'Copy Script'}
          </button>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DF', padding: '20px 24px', borderRadius: '10px' }}>
          <p style={{ fontSize: '15px', color: '#161616', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
            {brief.opening}
          </p>
        </div>
      </div>

      {/* 7. Before You Assume */}
      <div style={{ background: '#F1EFEA', border: '1px solid #E8E5DF', padding: '24px 28px', borderRadius: '10px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#161616', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
          Before You Assume
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {brief.beforeYouAssume.map((item, idx) => (
            <span key={idx} style={{ fontSize: '13.5px', color: '#444444', lineHeight: 1.4 }}>
              {item}
            </span>
          ))}
        </div>
      </div>

    </motion.div>
  );
};
