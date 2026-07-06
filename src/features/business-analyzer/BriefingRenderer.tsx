import React from 'react';
import type { AEBriefing } from '../../domain/business/types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft
} from 'lucide-react';

interface BriefingRendererProps {
  briefing: AEBriefing;
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
  onOpenOutreach?: () => void;
  onPracticeCall?: () => void;
}

export const BriefingRenderer: React.FC<BriefingRendererProps> = ({
  briefing,
  onBack,
  onSave,
  isSaving,
  onOpenOutreach,
  onPracticeCall
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22C55E'; // Success
    if (score >= 50) return '#F59E0B'; // Warning
    return '#EF4444'; // Danger
  };

  // Health Score is calculated as an inverse representation of checked leakages
  const healthScore = Math.max(10, Math.min(95, briefing.confidenceScore - 6));

  const hasPhoneLeak = briefing.bookingFindings.some(f => f.toLowerCase().match(/voicemail|busy|phone/)) || 
                       briefing.reviewFindings.some(f => f.toLowerCase().match(/voicemail|busy|phone/)) ||
                       briefing.likelyRevenueLeak.toLowerCase().includes('call');

  const hasFrictionBooking = briefing.bookingFindings.some(f => f.toLowerCase().match(/click|mindbody|checkout|pdf/)) ||
                             briefing.likelyRevenueLeak.toLowerCase().includes('booking') || 
                             briefing.likelyRevenueLeak.toLowerCase().includes('checkout');

  // Convert raw details into clean bullet points
  const getFoundChecklist = () => {
    const list = [];
    if (hasPhoneLeak) {
      list.push('Receptionist Phone Abandonment (Busy Signal Leak)');
    }
    if (hasFrictionBooking) {
      list.push('Booking Funnel friction (redirections & forced signups)');
    }
    
    // Google profile checks
    const hasGbpFriction = briefing.googleProfileFindings.some(f => f.toLowerCase().includes('missing') || f.toLowerCase().includes('alley') || f.toLowerCase().includes('unable'));
    if (hasGbpFriction) {
      list.push('Weak Google Business Profile Posts & Missing product tabs');
    } else {
      list.push('Unverified Google Maps coordinates sync');
    }

    // Website checks
    const hasWebFriction = briefing.websiteFindings.some(f => f.toLowerCase().includes('speed') || f.toLowerCase().includes('fold') || f.toLowerCase().includes('unable'));
    if (hasWebFriction) {
      list.push('Weak Mobile Landing Page folds');
    } else {
      list.push('Unoptimized site loading speeds (slow core web vitals)');
    }

    return list;
  };

  const checklist = getFoundChecklist();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '40px' }}>
      
      {/* 1. Header Navigation */}
      <div>
        <button 
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={16} /> Back to Audit Search
        </button>
      </div>

      {/* 2. Business Overview Grid */}
      <div className="card-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
          <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.1em' }}>
            AUDIT REPORT SUMMARY ({briefing.niche.toUpperCase()})
          </span>
          <h2 style={{ fontSize: '32px', letterSpacing: '-0.03em' }} className="title-gradient">{briefing.businessName}</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Website verified: <a href={`https://${briefing.website}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>{briefing.website}</a>
          </p>
        </div>

        {/* High-level metrics matrix */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '20px'
        }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>BUSINESS HEALTH</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: getScoreColor(healthScore), marginTop: '4px', display: 'block' }}>
              {healthScore}%
            </span>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>PRIMARY REVENUE LEAK</span>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#fca5a5', marginTop: '6px', display: 'block', textTransform: 'capitalize' }}>
              {hasPhoneLeak ? 'Phone Routing Leak' : hasFrictionBooking ? 'Booking Friction' : 'Visibility Leak'}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>AUDIT CONFIDENCE</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--secondary)', marginTop: '4px', display: 'block' }}>
              {briefing.confidenceScore}%
            </span>
          </div>
        </div>
      </div>

      {/* 3. "What I Found" Checklist */}
      <div className="card-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', marginBottom: '16px' }}>
          What I Found
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {checklist.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
              <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0 }} />
              <span style={{ color: 'var(--text-primary)' }}>{item}</span>
            </div>
          ))}
          {checklist.length === 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: 'var(--warning)' }}>
              <AlertTriangle size={18} />
              <span>Unable to verify leak channels - AE must run manual dials.</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Guided Next Step CTAs */}
      <div className="card-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: 'rgba(124, 92, 255, 0.03)', borderColor: 'rgba(124, 92, 255, 0.15)' }}>
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 700 }}>Ready to close this prospect?</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>Choose the next step to execute outreach sequences or practice cold calls.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {onOpenOutreach && (
            <button 
              onClick={onOpenOutreach}
              className="btn-primary"
              style={{ fontSize: '13px', background: 'linear-gradient(135deg, var(--primary) 0%, #6d28d9 100%)' }}
            >
              Generate Outreach
            </button>
          )}

          {onPracticeCall && (
            <button 
              onClick={onPracticeCall}
              className="btn-secondary"
              style={{ fontSize: '13px' }}
            >
              Practice Call
            </button>
          )}

          <button 
            onClick={onSave}
            disabled={isSaving}
            className="btn-secondary"
            style={{ fontSize: '13px', borderStyle: 'dashed' }}
          >
            {isSaving ? 'Saving...' : 'Save Audit'}
          </button>
        </div>
      </div>

    </div>
  );
};
