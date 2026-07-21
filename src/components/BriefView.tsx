'use client';

import React, { useState } from 'react';
import { PheebsBrief } from '@/packages/shared/types';
import { Target, Zap, ShieldAlert, CheckCircle, Copy, Check, MessageSquare, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface BriefViewProps {
  brief: PheebsBrief;
  onReset: () => void;
}

export const BriefView: React.FC<BriefViewProps> = ({ brief, onReset }) => {
  const { business, diagnosis, strategy, recommendation } = brief;
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Target Business Context Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '20px'
      }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#818CF8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Target Account Observed
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', margin: 0, marginTop: '4px', letterSpacing: '-0.02em' }}>
            {business.name}
          </h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0, marginTop: '4px' }}>
            {business.category} • {business.address} • ⭐ {business.rating} ({business.reviewCount} reviews)
          </p>
        </div>
        <button
          onClick={onReset}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#D1D5DB',
            fontSize: '12.5px',
            fontWeight: 600,
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
        >
          Observe Another URL
        </button>
      </div>

      {/* PRINCIPLE ONE: RECOMMENDATION & ACTION ANCHOR FIRST */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '16px',
        padding: '28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Zap size={18} color="#818CF8" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#818CF8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            1. Recommended Solution Anchor (Lead With This)
          </span>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: 0, lineHeight: 1.3 }}>
          {recommendation.anchorProduct}
        </h2>

        <p style={{ fontSize: '14.5px', color: '#D1D5DB', marginTop: '12px', lineHeight: 1.6 }}>
          {recommendation.strategicRationale}
        </p>

        {/* Opening Conversation Hook */}
        <div style={{
          marginTop: '20px',
          background: 'rgba(9, 9, 11, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          padding: '16px 20px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={13} color="#818CF8" /> High-Impact Call Opening Hook
            </span>
            <button
              onClick={() => handleCopy(strategy.opening, 'opening')}
              style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
            >
              {copiedKey === 'opening' ? <Check size={13} color="#22C55E" /> : <Copy size={13} />}
              {copiedKey === 'opening' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p style={{ fontSize: '15px', color: '#F3F4F6', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
            "{strategy.opening}"
          </p>
        </div>
      </div>

      {/* SECTION 2: CONVERSATION STRATEGY & THE EXACT DISCOVERY QUESTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Courageous Discovery Questions */}
        <div style={{
          background: 'rgba(24, 24, 27, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Target size={16} color="#22C55E" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#22C55E', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              2. Single Question Worth Asking
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {strategy.questions.map((q, i) => (
              <div key={i} style={{ background: 'rgba(255, 255, 255, 0.02)', borderLeft: '3px solid #22C55E', padding: '12px 14px', borderRadius: '4px' }}>
                <p style={{ fontSize: '13.5px', color: '#E5E7EB', margin: 0, lineHeight: 1.45, fontWeight: 500 }}>
                  "{q}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Avoid & Watchouts */}
        <div style={{
          background: 'rgba(24, 24, 27, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <ShieldAlert size={16} color="#EF4444" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#EF4444', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Traps & Watchouts To Avoid
            </span>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {strategy.avoid.map((item, i) => (
              <li key={i} style={{ fontSize: '13px', color: '#FCA5A5', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ color: '#EF4444', fontWeight: 700 }}>✕</span>
                <span>{item}</span>
              </li>
            ))}
            {strategy.watchouts.map((w, i) => (
              <li key={`w-${i}`} style={{ fontSize: '12.5px', color: '#9CA3AF', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ color: '#F59E0B' }}>⚠️</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* SECTION 3: DIAGNOSIS & VERIFIABLE EVIDENCE (AT BOTTOM) */}
      <div style={{
        background: 'rgba(24, 24, 27, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '14px',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={16} color="#F59E0B" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#F59E0B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              3. Diagnosed Constraint ({diagnosis.confidence}% Confidence)
            </span>
          </div>
        </div>

        <p style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 600, margin: 0, marginBottom: '16px' }}>
          {diagnosis.primaryConstraint}
        </p>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px' }}>
          <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
            Observable Factual Evidence
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {diagnosis.evidence.map((ev, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#D1D5DB' }}>
                <CheckCircle size={14} color="#22C55E" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{ev}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Executed Metadata Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#6B7280', paddingTop: '8px' }}>
        <span>Generated in {brief.executionTimeMs}ms • Adapter: {recommendation.adapterName}</span>
        <span>Pheebs Core Genesis Engine v0.1</span>
      </div>
    </motion.div>
  );
};
