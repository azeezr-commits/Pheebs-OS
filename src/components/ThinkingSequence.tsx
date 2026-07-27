'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SequenceStep {
  label: string;
  status: 'pending' | 'active' | 'done';
}

interface ThinkingSequenceProps {
  currentStepIndex: number;
}

const STEPS = [
  'Looking around...',
  'Ignoring the obvious...',
  'Following an interesting clue...',
  'Checking if my theory holds...',
  "Okay... I'd start here.",
];

export const ThinkingSequence: React.FC<ThinkingSequenceProps> = ({ currentStepIndex }) => {
  const currentLabel = STEPS[Math.min(currentStepIndex, STEPS.length - 1)];

  return (
    <div style={{
      maxWidth: '480px',
      margin: '120px auto 0 auto',
      textAlign: 'center',
      padding: '40px 24px',
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLabel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <span className="pulse-dot" />
          <span style={{
            fontSize: '18px',
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontStyle: 'italic',
            color: '#1A1A1A',
            letterSpacing: '-0.01em',
          }}>
            {currentLabel}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
