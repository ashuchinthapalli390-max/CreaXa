'use client';

import React, { useState } from 'react';
import { Play, ExternalLink, AlertCircle, Film, RefreshCw } from 'lucide-react';

export interface VideoEmbedProps {
  title: string;
  videoEmbedUrl?: string;
  videoPlatform?: 'vimeo' | 'youtube';
  externalUrl?: string;
  thumbnailUrl?: string;
  aspectRatio?: string;
  attribution?: string;
  className?: string;
}

export function VideoEmbed({
  title,
  videoEmbedUrl,
  videoPlatform,
  externalUrl,
  thumbnailUrl,
  aspectRatio = '16/9',
  attribution,
  className = ''
}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Parse aspect ratio into CSS ratio format
  const parsedRatio = aspectRatio.includes(':') 
    ? aspectRatio.replace(':', '/') 
    : aspectRatio;

  const handlePlay = () => {
    if (!videoEmbedUrl) {
      if (externalUrl) {
        window.open(externalUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }
    setIsLoading(true);
    setIsPlaying(true);
  };

  // Embed URL with privacy-conscious parameters
  const getEmbedSrc = () => {
    if (!videoEmbedUrl) return '';
    try {
      const url = new URL(videoEmbedUrl);
      if (videoPlatform === 'vimeo' || url.hostname.includes('vimeo')) {
        url.searchParams.set('dnt', '1'); // Do Not Track
        url.searchParams.set('autoplay', '1');
        url.searchParams.set('title', '0');
        url.searchParams.set('byline', '0');
        url.searchParams.set('portrait', '0');
      } else if (videoPlatform === 'youtube' || url.hostname.includes('youtube') || url.hostname.includes('youtu.be')) {
        url.searchParams.set('autoplay', '1');
        url.searchParams.set('rel', '0');
        url.searchParams.set('modestbranding', '1');
      }
      return url.toString();
    } catch {
      return videoEmbedUrl;
    }
  };

  return (
    <div
      className={`video-embed-root ${className}`}
      style={{
        width: '100%',
        borderRadius: 8,
        overflow: 'hidden',
        background: 'var(--surface, #121316)',
        border: '1px solid var(--line, #282828)',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: parsedRatio,
          background: '#0a0a0c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isPlaying && videoEmbedUrl && !hasError ? (
          <>
            {isLoading && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#0a0a0c',
                  zIndex: 2,
                  color: 'var(--muted)'
                }}
              >
                <RefreshCw size={24} className="spin" />
              </div>
            )}
            <iframe
              src={getEmbedSrc()}
              title={title}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                position: 'relative',
                zIndex: 1
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
              onError={() => setHasError(true)}
            />
          </>
        ) : hasError ? (
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              color: 'var(--text)'
            }}
          >
            <AlertCircle size={28} style={{ color: 'var(--accent)' }} />
            <div style={{ fontSize: 14, fontWeight: 600 }}>Embed blocked by host or browser privacy settings</div>
            <p style={{ fontSize: 12, color: 'var(--muted)', maxWidth: 360, margin: 0 }}>
              {title} is hosted on an external video network. You can view the original work directly.
            </p>
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="button"
                style={{ fontSize: 12, padding: '8px 16px', marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                Watch on Official Site <ExternalLink size={13} />
              </a>
            )}
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              cursor: videoEmbedUrl || externalUrl ? 'pointer' : 'default',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onClick={handlePlay}
            role="button"
            tabIndex={0}
            aria-label={`Play video: ${title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePlay();
              }
            }}
          >
            {/* Subtle Gradient Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(10,10,12,0.4) 0%, rgba(10,10,12,0.85) 100%)'
              }}
            />

            {/* Play Button & Center Indicator */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  background: 'var(--accent, #d4ff00)',
                  color: '#0a0a0c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(212,255,0,0.25)',
                  transition: 'transform 0.2s ease'
                }}
                className="play-pulse-btn"
              >
                {videoEmbedUrl ? (
                  <Play size={22} fill="currentColor" style={{ marginLeft: 3 }} />
                ) : (
                  <ExternalLink size={20} />
                )}
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: 'var(--text, #fff)',
                  textTransform: 'uppercase'
                }}
              >
                {videoEmbedUrl ? 'Play Original Work' : 'Watch on Artist Archive'}
              </span>
            </div>

            {/* Bottom Meta Bar on Poster */}
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                left: 16,
                right: 16,
                zIndex: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 11,
                color: 'var(--muted, #888)'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Film size={13} style={{ color: 'var(--accent)' }} />
                {title}
              </span>
              {aspectRatio && <span>{aspectRatio}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Attribution & Direct Link Footer */}
      {(attribution || externalUrl) && (
        <div
          style={{
            padding: '10px 16px',
            fontSize: 11,
            color: 'var(--muted, #888)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--line, #282828)',
            background: 'var(--panel, #18191c)'
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
            {attribution || title}
          </span>
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--accent, #d4ff00)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                fontWeight: 600,
                flexShrink: 0
              }}
            >
              Original Source <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoEmbed;
