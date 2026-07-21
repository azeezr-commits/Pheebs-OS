'use client';

import React, { useState } from 'react';
import { PheebsBrief, ThinkingTrace } from '@/packages/shared/types';
import { Target, Zap, ShieldAlert, CheckCircle, Copy, Check, MessageSquare, Flame, Cpu, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface BriefViewProps {
  brief: PheebsBrief;
  trace?: ThinkingTrace;
  onReset: () => void;
}

export const BriefView: React.FC<BriefViewProps> = ({ brief, trace, onReset }) => {
  const { business, diagnosis, strategy, recommendation } = brief;
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const engineVersions = trace?.engineVersions || {
    observer: 'v1.0.0',
    reasoner: 'v1.0.0',
    strategy: 'v1.0.0',
    playbook: 'v1.0.0'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        maxWidth: '820px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#818CF8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Target Business Record Observed
            </span>
            <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.06)', color: '#A1A1AA', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
              {business.observerVersion || 'Observer v1.0.0'}
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
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

      {/* PRINCIPLE ONE: RECOMMENDATION & PLAYBOOK ANCHOR FIRST */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '16px',
        padding: '28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#818CF8" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#818CF8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              1. Playbook Recommendation (Lead With This)
            </span>
          </div>
          <span style={{ fontSize: '10px', background: 'rgba(99, 102, 241, 0.2)', color: '#C084FC', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
            {recommendation.playbookName || 'Zoca Playbook'} ({recommendation.playbookVersion || 'v1.0.0'})
          </span>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: 0, lineHeight: 1.3 }}>
          {recommendation.anchorProduct}
        </h2>

        <p style={{ fontSize: '14.5px', color: '#D1D5DB', marginTop: '12px', lineHeight: 1.6 }}>
          {recommendation.strategicRationale}
        </p>

        {/* Opening Call Hook */}
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
        
        {/* Courageous Discovery Question */}
        <div style={{
          background: 'rgba(24, 24, 27, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={16} color="#22C55E" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#22C55E', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                2. Single Question Worth Asking
              </span>
            </div>
            <span style={{ fontSize: '10px', color: '#52525B', fontFamily: 'monospace' }}>
              Strategy {strategy.strategyVersion || 'v1.0.0'}
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

        {/* Strategic Traps to Avoid */}
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

      {/* SECTION 3: DIAGNOSED CONSTRAINT & EXTRACTED SIGNALS */}
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
              3. Diagnosed Primary Constraint ({diagnosis.confidence}% Confidence)
            </span>
          </div>
          <span style={{ fontSize: '10px', color: '#52525B', fontFamily: 'monospace' }}>
            Reasoner {diagnosis.reasonerVersion || 'v1.0.0'}
          </span>
        </div>

        <p style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 600, margin: 0, marginBottom: '16px' }}>
          {diagnosis.primaryConstraint}
        </p>

        {/* Extracted Factual Signals */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Layers size={13} color="#818CF8" />
            <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Observed Signals ({business.signals?.length || 0})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {business.signals && business.signals.length > 0 ? (
              business.signals.map((sig) => (
                <div key={sig.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={13} color="#22C55E" />
                    <span style={{ color: '#E5E7EB', fontWeight: 500 }}>{sig.label}:</span>
                    <span style={{ color: '#9CA3AF' }}>{String(sig.value)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#6B7280' }}>
                    <span>{sig.source}</span>
                    <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>{sig.confidence}</span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '12.5px', color: '#6B7280', margin: 0 }}>Signals observed from listing metadata</p>
            )}
          </div>
        </div>
      </div>

      {/* Engine Versioning Audit Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: '#6B7280',
        paddingTop: '8px',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Cpu size={12} color="#818CF8" /> Engine Trace ID: {trace?.id || brief.traceId || brief.id}
          </span>
          <span>• Execution: {brief.executionTimeMs}ms</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'monospace', fontSize: '10px' }}>
          <span>Observer {engineVersions.observer}</span>
          <span>•</span>
          <span>Reasoner {engineVersions.reasoner}</span>
          <span>•</span>
          <span>Strategy {engineVersions.strategy}</span>
          <span>•</span>
          <span>Playbook {engineVersions.playbook}</span>
        </div>
      </div>
    </motion.div>
  );
};
