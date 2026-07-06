import React from 'react';
import type { Session } from '../../contracts/Session';
import { ArrowLeft, AlertTriangle, ShieldAlert } from 'lucide-react';

interface CompareModeViewProps {
  selectedSessions: Session[];
  onBack: () => void;
}

export const CompareModeView: React.FC<CompareModeViewProps> = ({
  selectedSessions,
  onBack
}) => {
  if (selectedSessions.length < 2) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <ShieldAlert size={48} color="var(--warning)" style={{ marginBottom: '12px' }} />
        <h3>Compare Mode requires at least 2 sessions</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Select multiple cards from the vault explorer to verify metrics side-by-side.</p>
        <button onClick={onBack} className="btn-secondary" style={{ marginTop: '16px' }}>Back to Explorer</button>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  // Helper to extract briefing structure or default
  const resolveFindings = (session: Session) => {
    const brief = session.payload.briefing || {};
    return {
      executiveSummary: session.summary || brief.executiveSummary || 'No summary recorded.',
      likelyRevenueLeak: session.anchor || brief.likelyRevenueLeak || 'No leak recorded.',
      googleProfile: brief.googleProfileFindings || ['Unable to verify.'],
      website: brief.websiteFindings || ['Unable to verify.'],
      booking: brief.bookingFindings || ['Unable to verify.'],
      reviews: brief.reviewFindings || ['Unable to verify.'],
      discoveryQuestions: brief.discoveryQuestions || ['No discovery questions logged.'],
      recommendedAnchor: brief.recommendedAnchor || 'No sales anchor recommended.'
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      
      {/* Back Header */}
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
        >
          <ArrowLeft size={16} /> Exit Compare Mode
        </button>
      </div>

      {/* Compare Grid Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '12px 16px', width: '200px', fontSize: '13px', color: 'var(--text-muted)' }}>CRITERIA</th>
              {selectedSessions.map((session) => (
                <th key={session.id} style={{ padding: '12px 16px', fontSize: '15px', fontWeight: 700 }}>
                  <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>{session.type.toUpperCase()}</div>
                  {session.businessName}
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 500 }}>
                    {new Date(session.createdAt).toLocaleDateString()}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            
            {/* Row 1: Confidence */}
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '12px', color: 'var(--text-muted)' }}>CONFIDENCE SCORE</td>
              {selectedSessions.map((session) => (
                <td key={session.id} style={{ padding: '14px 16px', fontSize: '18px', fontWeight: 800, color: getScoreColor(session.confidence) }}>
                  {session.confidence}%
                </td>
              ))}
            </tr>

            {/* Row 2: Leak */}
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '12px', color: 'var(--text-muted)' }}>REVENUE LEAK</td>
              {selectedSessions.map((session) => {
                const data = resolveFindings(session);
                return (
                  <td key={session.id} style={{ padding: '14px 16px', fontSize: '13px', lineHeight: '1.4', color: '#fca5a5' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{data.likelyRevenueLeak}</span>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Row 3: Google Profile */}
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '12px', color: 'var(--text-muted)' }}>GOOGLE PROFILE FINDINGS</td>
              {selectedSessions.map((session) => {
                const data = resolveFindings(session);
                return (
                  <td key={session.id} style={{ padding: '14px 16px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    {data.googleProfile.map((f: string, i: number) => <div key={i} style={{ marginBottom: '4px' }}>• {f}</div>)}
                  </td>
                );
              })}
            </tr>

            {/* Row 4: Website */}
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '12px', color: 'var(--text-muted)' }}>WEBSITE FINDINGS</td>
              {selectedSessions.map((session) => {
                const data = resolveFindings(session);
                return (
                  <td key={session.id} style={{ padding: '14px 16px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    {data.website.map((f: string, i: number) => <div key={i} style={{ marginBottom: '4px' }}>• {f}</div>)}
                  </td>
                );
              })}
            </tr>

            {/* Row 5: Booking Journey */}
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '12px', color: 'var(--text-muted)' }}>BOOKING FINDINGS</td>
              {selectedSessions.map((session) => {
                const data = resolveFindings(session);
                return (
                  <td key={session.id} style={{ padding: '14px 16px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    {data.booking.map((f: string, i: number) => <div key={i} style={{ marginBottom: '4px' }}>• {f}</div>)}
                  </td>
                );
              })}
            </tr>

            {/* Row 6: Review Findings */}
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '12px', color: 'var(--text-muted)' }}>REVIEW FINDINGS</td>
              {selectedSessions.map((session) => {
                const data = resolveFindings(session);
                return (
                  <td key={session.id} style={{ padding: '14px 16px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    {data.reviews.map((f: string, i: number) => <div key={i} style={{ marginBottom: '4px' }}>• {f}</div>)}
                  </td>
                );
              })}
            </tr>

            {/* Row 7: Anchor */}
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '12px', color: 'var(--text-muted)' }}>RECOMMENDED ANCHOR</td>
              {selectedSessions.map((session) => {
                const data = resolveFindings(session);
                return (
                  <td key={session.id} style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-primary)' }}>
                    {data.recommendedAnchor}
                  </td>
                );
              })}
            </tr>

            {/* Row 8: Questions */}
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '12px', color: 'var(--text-muted)' }}>DISCOVERY QUESTIONS</td>
              {selectedSessions.map((session) => {
                const data = resolveFindings(session);
                return (
                  <td key={session.id} style={{ padding: '14px 16px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    {data.discoveryQuestions.map((q: string, i: number) => <div key={i} style={{ marginBottom: '6px' }}>• {q}</div>)}
                  </td>
                );
              })}
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};
