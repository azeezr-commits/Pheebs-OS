'use client';

import React from 'react';
import { Eye, Brain, Compass, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export interface PulseStep {
  key: 'observer' | 'reasoner' | 'strategist' | 'adapter';
  title: string;
  desc: string;
  status: 'pending' | 'running' | 'done';
}

interface LiveObserverPulseProps {
  steps: PulseStep[];
}

export const LiveObserverPulse: React.FC<LiveObserverPulseProps> = ({ steps }) => {
  const icons = {
    observer: Eye,
    reasoner: Brain,
    strategist: Compass,
    adapter: Sparkles
  };

  return (
    <div style={{
      maxWidth: '640px',
      margin: '40px auto',
      background: 'rgba(15, 15, 20, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '24px 28px',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#A1A1AA', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Pheebs Core Execution Engine
        </span>
        <span style={{ fontSize: '11px', color: '#6366F1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366F1', boxShadow: '0 0 8px #6366F1' }} />
          First-Principles Reasoning
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {steps.map((step) => {
          const Icon = icons[step.key];
          const isDone = step.status === 'done';
          const isRunning = step.status === 'running';

          return (
            <div
              key={step.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 16px',
                borderRadius: '10px',
                background: isRunning 
                  ? 'rgba(99, 102, 241, 0.08)' 
                  : isDone 
                  ? 'rgba(255, 255, 255, 0.02)' 
                  : 'transparent',
                border: isRunning 
                  ? '1px solid rgba(99, 102, 241, 0.3)' 
                  : '1px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isDone ? 'rgba(34, 197, 94, 0.15)' : isRunning ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: isDone ? '#22C55E' : isRunning ? '#818CF8' : '#52525B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isDone ? <CheckCircle2 size={16} /> : <Icon size={16} />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: isDone || isRunning ? '#FFFFFF' : '#71717A' }}>
                    {step.title}
                  </span>
                  {isRunning && (
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      style={{ fontSize: '11px', color: '#818CF8', fontWeight: 500 }}
                    >
                      analyzing...
                    </motion.span>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: '#71717A', margin: 0, marginTop: '2px' }}>
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
