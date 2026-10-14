'use client';

import React, { useState } from 'react';
import { Orbit, ArrowUpRight } from 'lucide-react';

interface CreatorCoverMediaProps {
  coverUrl?: string;
  name: string;
  specialization?: string;
  className?: string;
}

interface CreatorAvatarProps {
  avatarUrl?: string;
  name?: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

// ==============================================================================
// Safe Creator Avatar with Error Fallback
// Never shows raw alt text or broken image icon
// ==============================================================================
export function CreatorAvatar({ avatarUrl, name = 'Creator', className = 'avatar', style }: CreatorAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const initial = (name || 'C').trim().slice(0, 1).toUpperCase();

  let resolvedSrc = avatarUrl;
  if (resolvedSrc && resolvedSrc.includes('/creator-fallbacks/')) {
    resolvedSrc = resolvedSrc.replace('/creator-fallbacks/', '/creator-avatars/');
  }

  if (!resolvedSrc || hasError) {
    return (
      <div className={`avatar ${className} avatar-fallback`} style={style} aria-label={name}>
        <span>{initial}</span>
      </div>
    );
  }

  return (
    <div className={`avatar ${className}`} style={style}>
      <img
        src={resolvedSrc}
        alt=""
        onError={() => setHasError(true)}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}

// ==============================================================================
// Safe Creator Cover Media with Error Fallback
// Guarantees proper card aspect ratio and elegant visual presentation
// ==============================================================================
export function CreatorCoverMedia({
  coverUrl,
  name,
  specialization = 'AI Creative',
  className = ''
}: CreatorCoverMediaProps) {
  const [hasError, setHasError] = useState(false);

  if (!coverUrl || hasError) {
    return (
      <div
        className={`cover-empty ${className}`}
        style={{
          width: '100%',
          height: '100%',
          aspectRatio: '1.5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          background: 'radial-gradient(ellipse at 65% 40%, rgba(199, 242, 60, 0.12), transparent 75%), var(--raised, #181d19)',
          color: 'var(--muted, #859585)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle decorative background curves */}
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.15,
            pointerEvents: 'none'
          }}
          viewBox="0 0 300 200"
          fill="none"
        >
          <circle cx="150" cy="100" r="70" stroke="var(--accent, #c7f23c)" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M0 150 Q 150 50 300 150" stroke="var(--accent, #c7f23c)" strokeWidth="1" />
        </svg>

        <Orbit size={48} strokeWidth={0.8} style={{ color: 'var(--accent, #c7f23c)', zIndex: 1 }} />
        <span
          style={{
            fontSize: 10,
            fontFamily: 'var(--mono, monospace)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--muted, #94a594)',
            zIndex: 1
          }}
        >
          {specialization}
        </span>
      </div>
    );
  }

  return (
    <img
      src={coverUrl}
      alt=""
      onError={() => setHasError(true)}
      loading="lazy"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
      }}
    />
  );
}
