'use client';

import React, { useState } from 'react';
import { Shield, Sparkles, Orbit } from 'lucide-react';

interface ProfileHeroBannerProps {
  coverUrl?: string;
  name: string;
  specialization?: string;
  isExternalReference?: boolean;
  className?: string;
}

export function ProfileHeroBanner({
  coverUrl,
  name,
  specialization = 'AI Creative & Digital Pioneer',
  isExternalReference = false,
  className = ''
}: ProfileHeroBannerProps) {
  const [hasError, setHasError] = useState(false);

  // Determine actual image source
  const resolvedSrc = coverUrl
    ? coverUrl.startsWith('http://') || coverUrl.startsWith('https://')
      ? coverUrl
      : `/api/files/${coverUrl}`
    : undefined;

  const showFallback = !resolvedSrc || hasError;

  return (
    <div
      className={`profile-hero-banner-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '260px',
        maxHeight: '380px',
        height: '32vw',
        borderRadius: 'var(--radius, 8px)',
        overflow: 'hidden',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, #090c0a 0%, #111712 50%, #0d120e 100%)',
        border: '1px solid var(--line, rgba(255, 255, 255, 0.08))',
        boxSizing: 'border-box'
      }}
    >
      {!showFallback ? (
        <img
          src={resolvedSrc}
          alt=""
          loading="eager"
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      ) : (
        /* Intentional CreaXa-Branded Typographic Hero (Guaranteed Zero Broken Media Icons) */
        <div
          className="profile-cover-typographic-hero"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(20px, 4vw, 36px) clamp(24px, 5vw, 44px)',
            background: 'radial-gradient(ellipse at 75% 30%, rgba(199, 242, 60, 0.12), transparent 70%), linear-gradient(135deg, #070908 0%, #111712 60%, #090d0a 100%)',
            boxSizing: 'border-box'
          }}
        >
          {/* Subtle Generative Geometry Layer */}
          <svg
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0.18,
              pointerEvents: 'none'
            }}
            viewBox="0 0 900 350"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="750" cy="80" r="220" stroke="var(--accent, #c7f23c)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="750" cy="80" r="140" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.8" />
            <path d="M-50 280 C 200 120, 500 380, 950 180" stroke="var(--accent, #c7f23c)" strokeWidth="1.2" />
            <path d="M-50 310 C 220 150, 480 350, 950 210" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" />
          </svg>

          {/* Top Row: Category Badges */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(199, 242, 60, 0.08)',
                border: '1px solid rgba(199, 242, 60, 0.25)',
                borderRadius: 4,
                padding: '4px 10px',
                fontSize: 11,
                fontFamily: 'var(--mono, monospace)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--accent, #c7f23c)'
              }}
            >
              {isExternalReference ? <Shield size={12} /> : <Sparkles size={12} />}
              {isExternalReference ? 'Editorial Reference Profile' : 'Verified Creator'}
            </span>

            <span
              style={{
                fontSize: 11,
                fontFamily: 'var(--mono, monospace)',
                color: 'var(--muted, #859585)',
                letterSpacing: '0.05em'
              }}
            >
              CREAXA ARCHIVE
            </span>
          </div>

          {/* Center / Bottom: Artist Name & Specialization */}
          <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto' }}>
            <span
              style={{
                fontSize: 11,
                fontFamily: 'var(--mono, monospace)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted, #94a394)',
                display: 'block',
                marginBottom: 6
              }}
            >
              {specialization}
            </span>
            <h2
              style={{
                fontFamily: 'var(--heading, sans-serif)',
                fontSize: 'clamp(24px, 4vw, 42px)',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                color: '#f5f8f3',
                margin: 0,
                lineHeight: 1.15
              }}
            >
              {name}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileHeroBanner;
