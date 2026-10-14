'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, ExternalLink, Film, Sparkles, Box, Camera, Layers, Play } from 'lucide-react';
import { VideoEmbed } from './video-embed';

export interface WorkItem {
  id: string;
  slug: string;
  title: string;
  year?: string;
  description: string;
  fullDescription?: string;
  contentType: string;
  documentedTech?: string;
  tools: string[];
  externalUrl?: string;
  videoEmbedUrl?: string;
  videoPlatform?: 'vimeo' | 'youtube';
  aspectRatio?: string;
  mediaType?: 'video' | 'interactive' | 'image' | 'text';
  attribution?: string;
  thumbnailUrl?: string;
  creatorName: string;
  creatorSlug: string;
  creatorAvatar?: string;
}

interface WorkCardProps {
  work: WorkItem;
}

// ==============================================================================
// Premium Typographic & Geometric Fallback Cover
// Displays when no video embed or thumbnail exists, or if a thumbnail fails to load
// ==============================================================================
export function WorkMediaFallback({
  title,
  contentType,
  creatorName,
  year,
  aspectRatio = '16/10'
}: {
  title: string;
  contentType: string;
  creatorName: string;
  year?: string;
  aspectRatio?: string;
}) {
  const getFormatIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'ai video':
      case 'film':
        return <Film size={18} />;
      case 'installation':
      case '3d':
        return <Box size={18} />;
      case 'ai photography':
      case 'photography':
        return <Camera size={18} />;
      case 'generative art':
        return <Sparkles size={18} />;
      default:
        return <Layers size={18} />;
    }
  };

  return (
    <div
      className="work-media-fallback"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: aspectRatio.replace(':', '/'),
        background: 'linear-gradient(135deg, #0a0e0b 0%, #121813 50%, #0d130f 100%)',
        borderRadius: 8,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '18px 20px',
        boxSizing: 'border-box'
      }}
    >
      {/* Background Decorative Generative Curves */}
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
        viewBox="0 0 400 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="340" cy="50" r="140" stroke="#c7f23c" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M-20 200 C 100 120, 260 280, 420 160" stroke="#c7f23c" strokeWidth="1.2" />
        <path d="M-20 220 C 120 140, 240 260, 420 180" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        <circle cx="80" cy="70" r="2" fill="#c7f23c" />
        <circle cx="280" cy="180" r="2.5" fill="#c7f23c" />
        <circle cx="310" cy="120" r="1.5" fill="#ffffff" />
      </svg>

      {/* Top Header: Content Type & Year */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 4,
            padding: '3px 8px',
            fontSize: 10,
            fontFamily: 'var(--mono, monospace)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#c2d4c0'
          }}
        >
          {getFormatIcon(contentType)}
          {contentType}
        </span>
        {year && (
          <span
            style={{
              fontSize: 10,
              fontFamily: 'var(--mono, monospace)',
              color: 'var(--muted, #859585)'
            }}
          >
            {year}
          </span>
        )}
      </div>

      {/* Center: Large Project Title Preview */}
      <div style={{ position: 'relative', zIndex: 2, margin: '10px 0' }}>
        <h4
          style={{
            fontFamily: 'var(--heading, sans-serif)',
            fontSize: 'clamp(15px, 2vw, 18px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#f5f8f3',
            margin: 0,
            lineHeight: 1.25,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {title}
        </h4>
      </div>

      {/* Bottom: Creator Attribution & Subtle Format Indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 10
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: 'var(--muted, #889988)',
            fontFamily: 'var(--mono, monospace)'
          }}
        >
          By <strong style={{ color: '#e0ece0', fontWeight: 600 }}>{creatorName}</strong>
        </span>
        <span
          style={{
            fontSize: 10,
            color: 'var(--accent, #c7f23c)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          Curated Archive ↗
        </span>
      </div>
    </div>
  );
}

// ==============================================================================
// Complete Unified WorkCard Component
// Eliminates layout asymmetry between video and non-video editorial items
// ==============================================================================
export function WorkCard({ work }: WorkCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const internalUrl = `/creators/${work.creatorSlug}/works/${work.slug}`;

  return (
    <article
      className="portfolio-card unified-work-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 8,
        border: '1px solid var(--line, #282d28)',
        background: 'var(--surface, #121513)',
        overflow: 'hidden',
        height: '100%',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s, transform 0.2s'
      }}
    >
      {/* 1. TOP MEDIA REGION (Fixed 16:10 aspect ratio) */}
      <div className="work-card-media-region" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        {work.videoEmbedUrl ? (
          <VideoEmbed
            title={work.title}
            videoEmbedUrl={work.videoEmbedUrl}
            videoPlatform={work.videoPlatform}
            externalUrl={work.externalUrl}
            aspectRatio="16/10"
            attribution={work.attribution}
          />
        ) : work.thumbnailUrl && !imgFailed ? (
          <a
            href={internalUrl}
            style={{
              display: 'block',
              width: '100%',
              aspectRatio: '16/10',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <img
              src={work.thumbnailUrl}
              alt=""
              loading="lazy"
              onError={() => setImgFailed(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                borderRadius: 4,
                padding: '3px 8px',
                fontSize: 10,
                color: '#fff',
                fontFamily: 'var(--mono, monospace)'
              }}
            >
              {work.contentType}
            </div>
          </a>
        ) : (
          <a href={internalUrl} style={{ display: 'block', textDecoration: 'none' }}>
            <WorkMediaFallback
              title={work.title}
              contentType={work.contentType}
              creatorName={work.creatorName}
              year={work.year}
              aspectRatio="16/10"
            />
          </a>
        )}
      </div>

      {/* 2. PROJECT INFORMATION */}
      <div
        className="work-card-body"
        style={{
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          gap: 12
        }}
      >
        <div>
          {/* Header row: Category & Year (if not video embed top) */}
          {work.videoEmbedUrl && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className="badge" style={{ fontSize: 9 }}>{work.contentType}</span>
              {work.year && <span className="micro" style={{ fontSize: 10 }}>{work.year}</span>}
            </div>
          )}

          {/* Project Title */}
          <a
            href={internalUrl}
            style={{
              color: 'var(--text, #f4f8f2)',
              textDecoration: 'none'
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                margin: '0 0 6px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                lineHeight: 1.3
              }}
            >
              <span>{work.title}</span>
              <ArrowUpRight size={15} style={{ color: 'var(--accent, #c7f23c)', flexShrink: 0 }} />
            </h3>
          </a>

          {/* Short Description */}
          <p
            style={{
              fontSize: 12,
              color: 'var(--muted, #94a394)',
              margin: '0 0 10px 0',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: 36
            }}
          >
            {work.description}
          </p>

          {/* Documented AI Tools */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {work.tools.slice(0, 3).map((t: string) => (
              <span
                key={t}
                style={{
                  fontSize: 10,
                  fontFamily: 'var(--mono, monospace)',
                  color: 'var(--accent, #c7f23c)',
                  background: 'rgba(199, 242, 60, 0.08)',
                  border: '1px solid rgba(199, 242, 60, 0.2)',
                  borderRadius: 3,
                  padding: '2px 6px'
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* 3. CARD FOOTER */}
        <div
          style={{
            borderTop: '1px solid var(--line, #282d28)',
            paddingTop: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8
          }}
        >
          {/* Creator Attribution */}
          <a
            href={`/creators/${work.creatorSlug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: 'var(--text, #f4f8f2)',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            <span style={{ color: 'var(--muted, #859585)' }}>By</span>
            <span style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>{work.creatorName}</span>
          </a>

          {/* CTA Cluster */}
          <div style={{ display: 'flex', gap: 6 }}>
            <a
              href={internalUrl}
              className="button"
              style={{
                fontSize: 11,
                padding: '4px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              Details <ArrowRight size={12} />
            </a>
            {work.externalUrl && (
              <a
                href={work.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="button secondary"
                style={{
                  fontSize: 11,
                  padding: '4px 8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3
                }}
                title="View original project on official archive"
              >
                Archive <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default WorkCard;
