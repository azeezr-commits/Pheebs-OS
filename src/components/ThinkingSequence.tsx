'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface SequenceStep {
  label: string;
  status: 'pending' | 'active' | 'done';
}

interface ThinkingSequenceProps {
  steps: SequenceStep[];
}

export const ThinkingSequence: React.FC<ThinkingSequenceProps> = ({ steps }) => {
  return (
    <div style={{
      maxWidth: '480px',
      margin: '60px auto',
      background: '#FFFFFF',
      border: '1px solid #E8E5DF',
      borderRadius: '16px',
      padding: '36px 40px',
      boxShadow: '0 4px 24px rgba(22, 22, 22, 0.04)',
      fontFamily: 'Inter, sans-serif'
    }}>
      <p style={{
        fontSize: '13px',
        fontWeight: 600,
        color: '#666666',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '24px',
        margin: 0
      }}>
        Preparing your brief...
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
        {steps.map((step, index) => {
          const isDone = step.status === 'done';
          const isActive = step.status === 'active';

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                fontSize: '14.5px',
                color: isDone ? '#161616' : isActive ? '#0F172A' : '#999999',
                fontWeight: isDone || isActive ? 500 : 400
              }}
            >
              <span style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600,
                color: isDone ? '#161616' : isActive ? '#0F172A' : '#CCCCCC',
                background: isDone ? '#F1EFEA' : isActive ? '#F8F7F4' : 'transparent',
                border: isDone ? '1px solid #D6D2CA' : isActive ? '1px solid #0F172A' : '1px solid #E8E5DF'
              }}>
                {isDone ? '✓' : isActive ? '•' : ''}
              </span>

              <span>{step.label}</span>

              {isActive && (
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ fontSize: '12px', color: '#666666', marginLeft: 'auto' }}
                >
                  thinking...
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
