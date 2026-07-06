import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface AssetCardProps {
  title: string;
  icon: React.ReactNode;
  content: string;
  onChange: (val: string) => void;
  isTextArea?: boolean;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  title,
  icon,
  content,
  onChange,
  isTextArea = true
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="card-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {icon}
          <span>{title}</span>
        </div>

        <button
          onClick={handleCopy}
          style={{
            background: 'transparent',
            border: 'none',
            color: copied ? 'var(--success)' : 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: 600
          }}
          onMouseEnter={(e) => !copied && (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => !copied && (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          {copied ? (
            <>
              <Check size={12} /> Copied!
            </>
          ) : (
            <>
              <Copy size={12} /> Copy
            </>
          )}
        </button>
      </div>

      {isTextArea ? (
        <textarea
          className="input-field"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          style={{
            resize: 'none',
            fontSize: '12.5px',
            lineHeight: '1.5',
            background: 'rgba(0,0,0,0.15)',
            borderColor: 'rgba(255,255,255,0.02)'
          }}
        />
      ) : (
        <div style={{
          padding: '10px',
          borderRadius: '6px',
          background: 'rgba(0,0,0,0.15)',
          fontSize: '12.5px',
          lineHeight: '1.5',
          color: 'var(--text-primary)',
          whiteSpace: 'pre-wrap'
        }}>
          {content}
        </div>
      )}
    </div>
  );
};
