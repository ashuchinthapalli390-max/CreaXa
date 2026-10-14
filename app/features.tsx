'use client';
import { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
import { ArrowUpRight, ArrowRight, ArrowLeft, Plus, X, Search, Check, CheckCircle2, Download, Copy, Star, Heart, FileText, FolderOpen, SlidersHorizontal, Command, Bookmark, Shield, Layers, Clock, Target, Users, Palette, Film, Image as ImageIcon, Box, RefreshCw, Sparkles, ExternalLink } from 'lucide-react';
import { list } from '../lib/matching';
import { AppSelect } from '../components/ui/app-select';
import { AnimatedCheckbox } from '../components/ui/animated-checkbox';
import { EXTERNAL_CREATOR_REFERENCES } from '../lib/creators/external-references';
import { VideoEmbed } from '../components/ui/video-embed';
type Data = Record<string, any>;
async function request(path: string, data?: unknown, method?: string) { const r = await fetch('/api/' + path, { method: method || (data !== undefined ? 'POST' : 'GET'), headers: data !== undefined ? { 'Content-Type': 'application/json' } : {}, body: data !== undefined ? JSON.stringify(data) : undefined }); const v: any = await r.json(); if (!r.ok)
    throw new Error(v.error || 'Please try again.'); return v; }
function useData(path: string | null) { const [data, setData] = useState<any>(null), [error, setError] = useState(''), [loading, setLoading] = useState(!!path), [rev, setRev] = useState(0); const refresh = useCallback(() => setRev(v => v + 1), []); useEffect(() => { let cancelled = false; if (!path) {
    setLoading(false);
    return;
} setLoading(true); setError(''); request(path).then(v => { if (!cancelled)
    setData(v); }).catch(e => { if (!cancelled)
    setError(e.message); }).finally(() => { if (!cancelled)
    setLoading(false); }); return () => { cancelled = true; }; }, [path, rev]); return { data, error, loading, refresh }; }
function Action({ children, href, secondary = false, ...props }: any) { return href ? <a href={href} className={'button ' + (secondary ? 'secondary' : '')} {...props}>{children}</a> : <button className={'button ' + (secondary ? 'secondary' : '')} {...props}>{children}</button>; }
function Notice({ error }: any) { return error ? <p className="error-box" role="alert">{error}</p> : null; }
function NoItems({ title, body, href, action }: any) { return <div className="empty"><div className="empty-icon"><Layers size={27}/></div><h3>{title}</h3><p>{body}</p>{href && <Action href={href}>{action}<ArrowUpRight size={16}/></Action>}</div>; }
const CompareContext = createContext<{
    selected: string[];
    toggle: (slug: string) => void;
    clear: () => void;
}>({ selected: [], toggle: () => { }, clear: () => { } });
export function CompareProvider({ children }: any) { const [selected, setSelected] = useState<string[]>([]), [warning, setWarning] = useState(''); useEffect(() => { try {
    const stored = JSON.parse(sessionStorage.getItem('creaxa-compare') || '[]');
    if (Array.isArray(stored))
        setSelected(stored.filter(v => typeof v === 'string' && /^[a-z0-9-]+$/.test(v)).slice(0, 3));
}
catch { } }, []); const toggle = (slug: string) => setSelected(prev => { let next; if (prev.includes(slug))
    next = prev.filter(s => s !== slug);
else if (prev.length >= 3) {
    setWarning('Compare up to three creators. Remove one to add another.');
    setTimeout(() => setWarning(''), 3500);
    return prev;
}
else
    next = [...prev, slug]; try {
    sessionStorage.setItem('creaxa-compare', JSON.stringify(next));
}
catch { } return next; }); const clear = () => { setSelected([]); try {
    sessionStorage.removeItem('creaxa-compare');
}
catch { } }; return <CompareContext.Provider value={{ selected, toggle, clear }}>{children}{selected.length > 0 && <div className="compare-tray"><div><strong>{selected.length} creator{selected.length > 1 ? 's' : ''} selected</strong><span>Tools, formats, rates and availability side by side.</span></div><Action href={'/compare?creators=' + encodeURIComponent(selected.join(','))}>Compare<ArrowRight size={15}/></Action><button className="icon-btn" onClick={clear} aria-label="Clear comparison"><X size={17}/></button></div>}{warning && <div className="toast" role="status">{warning}</div>}</CompareContext.Provider>; }
export function CompareSelect({ slug }: any) { const { selected, toggle } = useContext(CompareContext); return <button className={'compare-select ' + (selected.includes(slug) ? 'selected' : '')} aria-pressed={selected.includes(slug)} onClick={() => toggle(slug)}>{selected.includes(slug) ? <Check size={13}/> : <Plus size={13}/>}Compare</button>; }
export function ComparePage() { const { selected } = useContext(CompareContext); const [slugs, setSlugs] = useState<string[]>([]), [profiles, setProfiles] = useState<any[]>([]), [error, setError] = useState(''), [loading, setLoading] = useState(true); useEffect(() => { const q = new URLSearchParams(location.search).get('creators'); setSlugs((q ? q.split(',') : selected).filter(v => /^[a-z0-9-]+$/.test(v)).slice(0, 3)); }, [selected]); useEffect(() => { let active = true; if (!slugs.length) {
    setProfiles([]);
    setLoading(false);
    return;
} setLoading(true); setError(''); setProfiles([]); Promise.all(slugs.map(s => request('creators/' + s))).then(rows => { if (active)
    setProfiles(rows.map(r => r.profile)); }).catch(e => { if (active)
    setError(e.message); }).finally(() => { if (active)
    setLoading(false); }); return () => { active = false; }; }, [slugs]); const rows = [['Specializations', 'specializations'], ['AI tools', 'tools'], ['Creative styles', 'styles'], ['Content formats', 'contentTypes'], ['Aspect ratios', 'aspectRatios'], ['Industry experience', 'industries'], ['Availability', 'availability'], ['Starting rate', 'rate'], ['Typical turnaround', 'turnaround'], ['Revision rounds', 'revisions'], ['Commercial projects', 'commercial']]; return <div className="page"><span className="eyebrow">PERSPECTIVES, SIDE BY SIDE</span><h1>Choose your<br /><em>creative fit.</em></h1><p className="large-copy">Compare actual declared capabilities. Use the portfolio and conversation to understand the details behind each profile.</p><Notice error={error}/>{loading ? <div className="loading">Loading creator capabilities…</div> : profiles.length ? <div className="compare-scroll"><table className="compare-table"><thead><tr><th>Capability</th>{profiles.map(p => <th key={p.id}><div className="avatar">{p.data.avatar ? <img src={'/api/files/' + p.data.avatar} alt=""/> : p.data.name.slice(0, 1)}</div><h3>{p.data.name}</h3><p>{p.data.headline}</p><a className="text-link" href={'/creators/' + p.slug}>View profile<ArrowUpRight size={15}/></a></th>)}</tr></thead><tbody>{rows.map(([label, key]) => <tr key={key}><th scope="row">{label}</th>{profiles.map(p => <td key={p.id}>{key === 'rate' ? (p.data.rate ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: p.data.currency }).format(p.data.rate) : 'On request') : key === 'commercial' ? (p.data.commercial ? 'Accepted, subject to agreed rights' : 'Not declared') : key === 'turnaround' ? (p.data.turnaround ? p.data.turnaround + ' days' : 'Not provided') : key === 'revisions' ? String(p.data.revisions ?? 'Not provided') : list(p.data[key]).join(' · ') || 'Not provided'}</td>)}</tr>)}<tr><th scope="row">Verification</th>{profiles.map(p => <td key={p.id}>{p.verification}</td>)}</tr></tbody></table></div> : <NoItems title="Your shortlist starts with discovery." body="Select up to three published creators to compare their capabilities." href="/discover" action="Explore creators"/>}<div className="note">Availability, tools, rates and skills are creator declared unless a specific claim has been reviewed. Verification does not certify commercial rights.</div></div>; }
export function SavedSearchTools({ signedIn, current, onApply }: any) { const r = useData(signedIn ? 'saved-searches' : null); const [name, setName] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState(''), [open, setOpen] = useState(false); if (!signedIn)
    return <a className="micro saved-search-link" href="/login"><Bookmark size={13}/>Sign in to save this search</a>; return <section className="saved-search-tools"><div><button className="text-link" onClick={() => setOpen(!open)}><Bookmark size={15}/>Saved searches <span>{r.data?.length || 0}</span></button>{open && <form onSubmit={async (e) => { e.preventDefault(); setBusy(true); setError(''); try {
    await request('saved-searches', { name, filters: current });
    setName('');
    r.refresh();
}
catch (e: any) {
    setError(e.message);
}
finally {
    setBusy(false);
} }}><input aria-label="Saved search name" placeholder="Name this search" required minLength={2} maxLength={80} value={name} onChange={e => setName(e.target.value)}/><Action disabled={busy}>Save current filters<Plus size={14}/></Action></form>}</div><Notice error={error || r.error}/>{open && r.data?.length > 0 && <div className="saved-search-list">{r.data.map((s: any) => <div key={s.id}><button onClick={() => onApply(s.data)}>{s.name}<ArrowRight size={13}/></button><button className="icon-btn" aria-label={'Delete ' + s.name} onClick={async () => { if (!confirm('Delete this saved search?'))
    return; try {
    await request('saved-searches/' + s.id, undefined, 'DELETE');
    r.refresh();
}
catch (e: any) {
    setError(e.message);
} }}><X size={13}/></button></div>)}</div>}</section>; }
export function WorkGallery() { 
  const [galleryMode, setGalleryMode] = useState<'featured' | 'registered'>('featured');
  const [q, setQ] = useState(''), [type, setType] = useState(''), [page, setPage] = useState(1); 
  const query = new URLSearchParams({ q, type, page: String(page) }); 
  const r = useData('work?' + query); 

  const contentTypeOptions = [
    { value: '', label: 'All creative formats' },
    { value: 'AI Video', label: 'AI Video' },
    { value: 'AI Image', label: 'AI Image' },
    { value: 'AI Animation', label: 'AI Animation' },
    { value: 'Generative Art', label: 'Generative Art' },
    { value: 'Installation', label: 'Installation' },
    { value: 'AI Photography', label: 'AI Photography' }
  ];

  // Flatten verified genuine works from the 10 real AI creators
  const featuredArtistWorks = EXTERNAL_CREATOR_REFERENCES.flatMap(ref => 
    ref.featuredWorks.map(w => ({
      ...w,
      creatorName: ref.name,
      creatorSlug: ref.slug,
      creatorAvatar: ref.avatarUrl
    }))
  ).filter(work => {
    if (type && work.contentType !== type) return false;
    if (q) {
      const needle = q.toLowerCase();
      return (
        work.title.toLowerCase().includes(needle) ||
        work.description.toLowerCase().includes(needle) ||
        work.creatorName.toLowerCase().includes(needle) ||
        work.tools.some(t => t.toLowerCase().includes(needle))
      );
    }
    return true;
  });

  return (
    <div className="page">
      <span className="eyebrow">ORIGINAL WORK. OPEN PERSPECTIVES.</span>
      <h1>The creative<br /><em>workroom.</em></h1>
      <p className="large-copy">Explore original projects from genuine AI artists and registered marketplace creators.</p>
      
      <div style={{ display: 'flex', gap: 10, margin: '24px 0 20px', borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
        <button
          type="button"
          className={'button ' + (galleryMode === 'featured' ? '' : 'secondary')}
          onClick={() => setGalleryMode('featured')}
          style={{ fontSize: 13, padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Sparkles size={14} /> Featured AI Artist Works (10 Genuine Creators)
        </button>
        <button
          type="button"
          className={'button ' + (galleryMode === 'registered' ? '' : 'secondary')}
          onClick={() => setGalleryMode('registered')}
          style={{ fontSize: 13, padding: '8px 18px' }}
        >
          Registered Creator Portfolios
        </button>
      </div>

      <div className="work-toolbar">
        <div className="search">
          <Search size={19}/>
          <input 
            aria-label="Search portfolio work" 
            placeholder="Search project titles, tools or creators..." 
            value={q} 
            onChange={e => { setQ(e.target.value); setPage(1); }}
          />
        </div>
        <div style={{ minWidth: '220px' }}>
          <AppSelect 
            value={type} 
            onChange={v => { setType(v); setPage(1); }} 
            options={contentTypeOptions} 
            placeholder="All creative formats" 
            ariaLabel="Filter work by content type"
          />
        </div>
      </div>

      {galleryMode === 'featured' ? (
        <>
          <div className="results-heading">
            <span>{featuredArtistWorks.length} Verified Editorial Works</span>
            <span className="micro">OFFICIAL EMBEDS & CASE STUDIES</span>
          </div>

          {featuredArtistWorks.length ? (
            <div className="portfolio-grid work-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {featuredArtistWorks.map(w => (
                <div key={w.id} className="portfolio-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {w.videoEmbedUrl ? (
                    <VideoEmbed
                      title={w.title}
                      videoEmbedUrl={w.videoEmbedUrl}
                      videoPlatform={w.videoPlatform}
                      externalUrl={w.externalUrl}
                      aspectRatio={w.aspectRatio || '16/9'}
                      attribution={w.attribution}
                    />
                  ) : (
                    <div style={{ padding: '24px', background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minHeight: 220 }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="badge">{w.contentType}</span>
                          {w.year && <span className="micro">{w.year}</span>}
                        </div>
                        <h3 style={{ marginTop: 12, fontSize: 16 }}>{w.title}</h3>
                        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8, lineHeight: 1.5 }}>{w.description}</p>
                      </div>
                      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                        <span style={{ fontSize: 11, color: 'var(--accent)' }}>
                          {w.tools.join(' · ')}
                        </span>
                        {w.externalUrl && (
                          <a href={w.externalUrl} target="_blank" rel="noopener noreferrer" className="button secondary" style={{ fontSize: 11, padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            Archive <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px', fontSize: 12 }}>
                    <span style={{ color: 'var(--muted)' }}>By</span>
                    <a href={'/creators/' + w.creatorSlug} style={{ color: 'var(--text)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {w.creatorName} <ArrowUpRight size={13} style={{ opacity: 0.7 }} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">
              <div className="empty-icon"><Search size={28}/></div>
              <h3>No featured works match your search.</h3>
              <p>Try searching for Paul Trillo, Refik Anadol, Sora, or Runway.</p>
              {q && <button className="button secondary" onClick={() => setQ('')}>Clear search</button>}
            </div>
          )}
        </>
      ) : r.error ? (
        <div className="workroom-error-card" role="alert">
          <div className="error-badge">WORKROOM TEMPORARILY UNAVAILABLE</div>
          <h3>Couldn't load the workroom.</h3>
          <p>Please try again. If the issue persists, check your network connection.</p>
          <button className="button retry-btn" onClick={() => r.refresh()}>
            <RefreshCw size={14} />
            Retry request
          </button>
        </div>
      ) : r.loading ? (
        <>
          <div className="results-heading"><span>Loading published work…</span></div>
          <div className="portfolio-grid work-grid loading-grid" aria-busy="true">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-media" />
                <div className="skeleton-text-wrap">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line title" />
                  <div className="skeleton-line" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="results-heading">
            <span>{r.data?.total || 0} published project{r.data?.total === 1 ? '' : 's'}</span>
          </div>

          {r.data?.items?.length ? (
            <div className="portfolio-grid work-grid">
              {r.data.items.map((p: any) => (
                <a className="portfolio-card" key={p.id} href={'/projects/' + p.slug}>
                  <img src={'/api/files/' + p.data.cover} alt={p.data.title} loading="lazy"/>
                  <div>
                    <span className="badge">{p.data.contentType}</span>
                    <h3>{p.data.title}<ArrowUpRight size={18}/></h3>
                    <p>{p.creator_name} · {list(p.data.tools).join(' / ')}</p>
                  </div>
                </a>
              ))}
            </div>
          ) : (q || type) ? (
            <div className="empty">
              <div className="empty-icon"><Search size={28}/></div>
              <h3>No projects match your search.</h3>
              <p>Try searching with different terms or reset your creative format filter.</p>
              <div className="empty-actions-row">
                {q && <button className="button secondary" onClick={() => { setQ(''); setPage(1); }}>Clear search</button>}
                {type && <button className="button secondary" onClick={() => { setType(''); setPage(1); }}>Clear format filter</button>}
              </div>
            </div>
          ) : (
            <NoItems 
              title="Original work will find its home here." 
              body="Published portfolios from discoverable creators appear here. Add your own work with the process and permissions behind it." 
              href="/signup" 
              action="Create a creator profile" 
            />
          )}

          {r.data?.pages > 1 && (
            <div className="pagination">
              <Action secondary disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Action>
              <span>{page} / {r.data.pages}</span>
              <Action secondary disabled={page === r.data.pages} onClick={() => setPage(page + 1)}>Next</Action>
            </div>
          )}
        </>
      )}
    </div>
  ); 
}
export const RECIPES = [
    { id: 'social-video', name: 'Social-first film', icon: Film, tag: 'SHORT-FORM VIDEO', desc: 'Define a focused idea, a clear hook and a mobile-first delivery.', fields: { contentType: 'AI Video', platform: 'Instagram', aspectRatio: '9:16', format: 'MP4', duration: 30, quantity: 1, styles: ['Cinematic'], commercialUse: 'Organic social' }, check: ['Message in the opening seconds', 'Safe areas for platform overlays', 'Captions and language requirements', 'Final format and export resolution'] },
    { id: 'product-image', name: 'Product storytelling', icon: ImageIcon, tag: 'GENERATIVE IMAGE', desc: 'Build a visual brief around the product, its audience and the desired mood.', fields: { contentType: 'AI Image', platform: 'Web Ads', aspectRatio: '1:1', format: 'PNG', quantity: 1, styles: ['Realistic'], commercialUse: 'Paid advertising' }, check: ['Accurate product details', 'Brand palette and visual references', 'Permitted retouching or generation', 'Usage territory and duration'] },
    { id: 'motion', name: 'Motion with a purpose', icon: Box, tag: 'ANIMATION', desc: 'Give movement a job: explain a feature, introduce an idea or build recognition.', fields: { contentType: 'AI Animation', platform: 'YouTube', aspectRatio: '16:9', format: 'MP4', quantity: 1, styles: ['3D'], commercialUse: 'Organic social' }, check: ['Sequence and key frames', 'Timing and pacing', 'Sound and music permissions', 'What the audience should understand'] },
    { id: 'editorial', name: 'An editorial perspective', icon: Palette, tag: 'VISUAL CAMPAIGN', desc: 'Create a coherent image direction for an editorial series or visual launch.', fields: { contentType: 'AI Image', platform: 'Instagram', aspectRatio: '4:5', format: 'JPG', quantity: 1, styles: ['Editorial'], commercialUse: 'Website / editorial' }, check: ['Series consistency', 'Visual references with context', 'Attribution requirements', 'Portfolio display permission'] },
    { id: 'explainer', name: 'A clear explanation', icon: FileText, tag: 'EXPLAINER FILM', desc: 'Turn a complicated message into a considered, understandable visual sequence.', fields: { contentType: 'AI Video', platform: 'YouTube', aspectRatio: '16:9', format: 'MP4', quantity: 1, commercialUse: 'Website / editorial' }, check: ['One primary message', 'Audience familiarity with the topic', 'Script and factual review responsibility', 'Voiceover language and pronunciation'] },
    { id: 'identity', name: 'A graphic direction', icon: Layers, tag: 'CREATIVE GRAPHICS', desc: 'Specify a visual system for a campaign without losing the brand’s existing identity.', fields: { contentType: 'AI Graphics', platform: 'LinkedIn', aspectRatio: '1:1', format: 'PNG', quantity: 1, styles: ['Minimal'], commercialUse: 'Organic social' }, check: ['Existing brand constraints', 'Typography and licensed assets', 'Required layout variations', 'Editable-source delivery expectations'] }
];
export function TemplateGallery() { return <div className="page"><span className="eyebrow">START WITH A STRONG STRUCTURE</span><h1>A brief for<br /><em>your ambition.</em></h1><p className="large-copy">Choose a starting structure, then make it yours. Budgets, deadlines and usage rights stay yours to define.</p><div className="template-grid">{RECIPES.map(t => <article className="template-card" key={t.id}><t.icon size={35} strokeWidth={1}/><span className="eyebrow">{t.tag}</span><h3>{t.name}</h3><p>{t.desc}</p><ul>{t.check.map(s => <li key={s}><Check size={13}/>{s}</li>)}</ul><Action href={'/app/brand/campaigns/new?recipe=' + t.id}>Use this structure<ArrowUpRight size={16}/></Action></article>)}</div><div className="note">These structures are editable field presets, not published campaigns. Review every field and agree scope, rights and delivery with your creator.</div></div>; }
const GUIDES = [
    { id: 'write-a-brief', title: 'Write a brief that creates clarity', tag: 'BRIEFING', icon: FileText, intro: 'A creative brief is a shared starting point. It should explain the problem and the boundaries while leaving room for a creator’s perspective.', sections: [['Start with the outcome', 'Describe what the audience should notice, understand or do. Give context about the brand, the product and the people you want to reach.'], ['Specify the output', 'Record content type, aspect ratio, resolution, duration, quantity, language and file format. Distinguish a final export from editable source files.'], ['Make practical decisions', 'Set your actual budget and delivery deadline. Agree revision rounds, review turnaround and who supplies reference assets.'], ['Define intended usage', 'Record distribution channels, territory, duration, attribution and any exclusivity request. Tool terms and third-party permissions need separate review.']] },
    { id: 'build-a-portfolio', title: 'Show the thinking behind the work', tag: 'PORTFOLIO', icon: FolderOpen, intro: 'The final image gets attention. The workflow, contribution and context help a potential partner understand what you can actually deliver.', sections: [['Select original work', 'Choose projects you can display with permission. Avoid implying client relationships or contributions you did not have.'], ['Explain your contribution', 'Describe your role: concept, prompting, generation, editing, compositing or final production. Separate your work from collaborators’ contributions.'], ['Document the process', 'List tools and formats, describe the workflow and show relevant constraints. Submit sensitive process evidence privately.'], ['Keep capability information current', 'Update rates, supported formats, turnaround and availability so a brief can be evaluated against accurate information.']] },
    { id: 'compare-creators', title: 'Compare capability with context', tag: 'DISCOVERY', icon: Users, intro: 'Use filters and comparison to narrow the field, then inspect project details and talk about how the work will be made.', sections: [['Begin with hard requirements', 'Check output type, aspect ratio, availability and a compatible budget/currency before focusing on creative preference.'], ['Use the comparison view', 'Select up to three published creators. Compare their declared tools, formats, rates and turnaround side by side.'], ['Read beyond the score', 'Compatibility is a weighted index based on available profile data. It is not a guarantee or a success probability.'], ['Ask a concrete question', 'Discuss a relevant portfolio project, the production approach and any rights or delivery constraints before accepting terms.']] },
    { id: 'feedback-and-revisions', title: 'Give feedback that moves work forward', tag: 'COLLABORATION', icon: Target, intro: 'Specific feedback lets a creator decide what to change. Keep comments connected to the brief and the submitted version.', sections: [['Name the version', 'Refer to the deliverable and version you reviewed. Keep old submissions available for context.'], ['Describe the observed issue', 'Explain the frame, timing, message or visual detail that needs attention. State the intended outcome, rather than asking for vague improvements.'], ['Respect the agreed scope', 'Use the revision allowance for changes within the agreed brief. Discuss additional deliverables or direction changes as new scope.'], ['Close the loop', 'Approve the final version deliberately. Delivery completion records creative-workflow status; it does not represent payment settlement.']] },
    { id: 'rights-and-evidence', title: 'Keep rights and verification specific', tag: 'TRUST', icon: Shield, intro: 'A verified tool claim, a commercial-use declaration and an agreed license answer different questions.', sections: [['Separate the questions', 'Tool access does not establish ownership of every output. A campaign’s rights request is not itself a license or transfer.'], ['Check the intended use', 'Review the relevant tool/model terms and permissions for supplied assets, likenesses, music and other third-party material.'], ['Understand evidence states', 'Self-declared, evidence submitted, under review, verified and rejected are distinct states. Read what specific capability was reviewed.'], ['Document the agreement', 'Keep territory, duration, distribution, attribution, confidentiality and usage terms with the project scope. Seek qualified advice for uncertain legal obligations.']] },
    { id: 'final-delivery', title: 'Prepare a complete handoff', tag: 'DELIVERY', icon: CheckCircle2, intro: 'A clear handoff connects the approved work to the practical files and expectations agreed at the start.', sections: [['Check the agreed deliverables', 'Confirm quantity, format, resolution, aspect ratio and any source-file requirement from the agreement.'], ['Keep version history intact', 'Deliver the approved version and retain earlier submissions and feedback in the workspace.'], ['Review supporting details', 'Include relevant usage information, asset disclosures and production notes when the scope requires them.'], ['Confirm completion', 'The creator marks delivery and the brand completes the workspace after review. Payments remain separately arranged.']] }
];
export function ResourceHub({ slug }: any) { const guide = GUIDES.find(g => g.id === slug); if (slug && !guide)
    return <div className="page"><NoItems title="Guide not found." body="Explore the creative field notes to continue." href="/resources" action="Open field notes"/></div>; if (guide)
    return <div className="page info-page"><a className="back-link" href="/resources"><ArrowLeft size={15}/>All field notes</a><span className="eyebrow">{guide.tag} / CREAXA FIELD NOTES</span><h1>{guide.title}</h1><p className="large-copy">{guide.intro}</p>{guide.sections.map(([title, body], i) => <section key={title}><span className="eyebrow">0{i + 1}</span><h2>{title}</h2><p>{body}</p></section>)}<div className="info-cta"><Action href="/templates">Build a clearer brief<ArrowUpRight size={16}/></Action><Action secondary href="/discover">Discover creators<ArrowUpRight size={16}/></Action></div></div>; return <div className="page"><span className="eyebrow">CREAXA FIELD NOTES</span><h1>A little context.<br /><em>A better collaboration.</em></h1><p className="large-copy">Practical notes for briefing, choosing a partner, giving feedback and delivering work with clear expectations.</p><div className="resource-grid">{GUIDES.map(g => <a className="resource-card" href={'/resources/' + g.id} key={g.id}><g.icon size={32} strokeWidth={1}/><span className="eyebrow">{g.tag}</span><h3>{g.title}</h3><p>{g.intro}</p><span className="text-link">Read the field note<ArrowUpRight size={17}/></span></a>)}</div></div>; }
export function ProjectTasks({ id, viewer, status }: any) { const r = useData('tasks/' + id); const [title, setTitle] = useState(''), [due, setDue] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState(''); const tasks = r.data || [], done = tasks.filter((t: any) => t.completed).length; const mutate = async (data: any) => { setBusy(true); setError(''); try {
    await request('tasks/' + id, data);
    r.refresh();
    return true;
}
catch (e: any) {
    setError(e.message);
    return false;
}
finally {
    setBusy(false);
} }; return <section className="panel task-panel"><div className="panel-heading"><h3>Project checklist</h3><span>{done} / {tasks.length} complete</span></div>{tasks.length > 0 && <div className="check-progress"><i style={{ width: Math.round(done / tasks.length * 100) + '%' }}/></div>}<Notice error={error || r.error}/>{r.loading && !r.data ? <p className="micro">Loading the project checklist…</p> : tasks.length ? tasks.map((t: any) => <div className={'task-row ' + (t.completed ? 'complete' : '')} key={t.id}><AnimatedCheckbox checked={!!t.completed} disabled={busy} onChange={checked => mutate({ id: t.id, title: t.title, due: t.due || '', completed: checked })} ariaLabel={'Complete ' + t.title}/><div><strong>{t.title}</strong><p>{t.author_name}{t.due ? ' · Due ' + t.due : ''}</p></div>{t.author === viewer && <button className="icon-btn" aria-label={'Delete task ' + t.title} disabled={busy} onClick={async () => { if (!confirm('Delete this project task?'))
    return; setBusy(true); try {
    await request('tasks/' + id + '/' + t.id, undefined, 'DELETE');
    r.refresh();
}
catch (e: any) {
    setError(e.message);
}
finally {
    setBusy(false);
} }}><X size={14}/></button>}</div>) : <p className="micro">Add practical steps for your shared scope. Both project participants can update completion.</p>}{!['completed', 'cancelled'].includes(status) && <form className="task-form" onSubmit={async (e) => { e.preventDefault(); if (await mutate({ title, due, completed: false })) {
    setTitle('');
    setDue('');
} }}><input aria-label="New project task" placeholder="Add a project step" required minLength={3} maxLength={200} value={title} onChange={e => setTitle(e.target.value)}/><input aria-label="Task due date" type="date" value={due} onChange={e => setDue(e.target.value)}/><Action secondary disabled={busy}><Plus size={14}/>Add task</Action></form>}</section>; }
export function ProjectReview({ engagement, viewer }: any) { const r = useData(engagement.status === 'completed' ? 'project-review/' + engagement.id : null); const [rating, setRating] = useState(0), [comment, setComment] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState(''), [success, setSuccess] = useState(false); useEffect(() => { if (r.data) {
    setRating(r.data.rating);
    setComment(r.data.comment);
} }, [r.data]); if (engagement.status !== 'completed')
    return null; const own = engagement.brand === viewer; return <section className="panel"><span className="eyebrow">FEEDBACK WITH REAL CONTEXT</span><h3>Completed-project feedback</h3><p>Feedback is linked to this completed collaboration and appears on the creator’s public profile.</p><Notice error={error || r.error}/>{own ? <form onSubmit={async (e) => { e.preventDefault(); setBusy(true); setError(''); setSuccess(false); try {
    await request('review', { engagement: engagement.id, rating, comment });
    r.refresh();
    setSuccess(true);
}
catch (e: any) {
    setError(e.message);
}
finally {
    setBusy(false);
} }}><div className="field"><label>Your rating</label><AppSelect value={rating ? String(rating) : ''} onChange={v => setRating(Number(v))} placeholder="Choose your rating" options={[{ value: '5', label: '5 / 5 — Exceptional' }, { value: '4', label: '4 / 5 — Strong delivery' }, { value: '3', label: '3 / 5 — Satisfactory' }, { value: '2', label: '2 / 5 — Needed revisions' }, { value: '1', label: '1 / 5 — Incomplete' }]} ariaLabel="Choose your rating"/></div><div className="field review-comment"><label htmlFor="review-comment">Describe your experience</label><textarea id="review-comment" required minLength={20} maxLength={2000} rows={4} value={comment} onChange={e => setComment(e.target.value)}/></div><Action disabled={busy}>{r.data ? 'Update feedback' : 'Publish feedback'}<ArrowUpRight size={16}/></Action>{success && <p className="success-note" role="status"><CheckCircle2 size={15}/>Your feedback is saved.</p>}</form> : r.data ? <div className="review-item"><Stars rating={r.data.rating}/><p>{r.data.comment}</p></div> : <p className="micro">Your brand partner hasn’t submitted feedback yet.</p>}</section>; }
function Stars({ rating }: any) { return <span className="review-stars" aria-label={rating + ' out of 5'}>{[1, 2, 3, 4, 5].map(n => <Star key={n} size={14} fill={n <= rating ? 'currentColor' : 'none'} className={n <= rating ? 'filled' : ''}/>)}</span>; }
export function CreatorReviews({ slug }: any) { const [page, setPage] = useState(1); const r = useData('reviews/' + slug + '?page=' + page); if (r.loading && !r.data)
    return <section className="profile-section"><h2>Project feedback</h2><p className="micro">Loading completed-project feedback…</p></section>; const reviews = r.data?.items || [], average = r.data?.average != null ? Number(r.data.average).toFixed(1) : null; return <section className="profile-section"><div className="section-heading"><h2>Project feedback</h2>{average && <span>{average} / 5 · {r.data.total} review{r.data.total !== 1 ? 's' : ''}</span>}</div><Notice error={r.error}/>{reviews.length ? reviews.map((review: any) => <article className="review-item" key={review.id}><div><Stars rating={review.rating}/><span className="badge">Completed collaboration</span></div><p className="preserve">{review.comment}</p><span className="micro">{review.reviewer_name} · {new Date(review.updated).toLocaleDateString('en-IN')}</span></article>) : <NoItems title="Feedback follows real collaboration." body="Brands can review this creator after completing a project through CreaXa."/>}{r.data?.pages > 1 && <div className="pagination"><Action secondary disabled={r.loading || page === 1} onClick={() => setPage(page - 1)}>Previous</Action><span>{page} / {r.data.pages}</span><Action secondary disabled={r.loading || page >= r.data.pages} onClick={() => setPage(page + 1)}>Next</Action></div>}</section>; }
function saveJson(data: any, filename: string) { const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
export function CampaignTools({ campaign, base }: any) { const [busy, setBusy] = useState(false), [error, setError] = useState(''); return <div className="campaign-tools"><div className="inline-actions"><Action secondary disabled={busy} onClick={async () => { setBusy(true); setError(''); try {
    const c = await request('duplicate-campaign/' + campaign.id, {});
    location.href = base + '/campaigns/' + c.id;
}
catch (e: any) {
    setError(e.message);
}
finally {
    setBusy(false);
} }}><Copy size={15}/>Duplicate as draft</Action><Action secondary onClick={() => saveJson({ id: campaign.id, status: campaign.status, brief: campaign.data }, 'creaxa-campaign-' + campaign.id + '.json')}><Download size={15}/>Export brief</Action></div><Notice error={error}/></div>; }
export function AccountExport() { const [busy, setBusy] = useState(false), [error, setError] = useState(''); return <section className="panel"><h3>Your data, in your hands.</h3><p>Download your account, profiles, campaign records, authored updates and permitted project information as JSON. File metadata is included; media files remain available through your authorized downloads.</p><Action secondary disabled={busy} onClick={async () => { setBusy(true); setError(''); try {
    const data = await request('account-export');
    saveJson(data, 'creaxa-account-export.json');
}
catch (e: any) {
    setError(e.message);
}
finally {
    setBusy(false);
} }}><Download size={16}/>{busy ? 'Preparing your export…' : 'Download my data'}</Action><Notice error={error}/></section>; }
export function ProfileChecklist({ profile, projects, base }: any) { const d = profile?.data || {}; const checks = [{ label: 'Introduce your perspective', done: !!(d.name && d.headline && d.bio), href: base + '/profile' }, { label: 'Declare tools and formats', done: !!(list(d.tools).length && list(d.contentTypes).length && list(d.aspectRatios).length), href: base + '/profile' }, { label: 'Set availability and rates', done: !!(d.availability && d.currency && d.turnaround > 0), href: base + '/profile' }, { label: 'Publish original portfolio work', done: projects.some((p: any) => p.published), href: base + '/portfolio' }, { label: 'Make your profile discoverable', done: !!profile?.published, href: base + '/profile' }]; const complete = checks.filter(c => c.done).length; return <section className="panel profile-checklist"><div className="panel-heading"><h3>Your profile readiness</h3><span>{complete} / {checks.length}</span></div><div className="check-progress"><i style={{ width: complete / checks.length * 100 + '%' }}/></div>{checks.map(c => <a key={c.label} href={c.href} className="checklist-link">{c.done ? <CheckCircle2 size={17}/> : <span className="checklist-circle"/>}<span>{c.label}</span><ArrowUpRight size={14}/></a>)}<p className="micro">A readiness checklist reflects your profile details, not verification or a quality rating.</p></section>; }
export function SavedCreators() { const [page, setPage] = useState(1), [busy, setBusy] = useState(false), [error, setError] = useState(''); const r = useData('discovery?saved=1&sort=recent&page=' + page); return <><div className="workspace-title"><div><span className="eyebrow">KEEP YOUR CREATIVE CONNECTIONS CLOSE</span><h1>Your saved creators.</h1><p>A private shortlist built from profiles you choose.</p></div><Action href="/discover">Find more creators<ArrowUpRight size={16}/></Action></div><Notice error={error || r.error}/>{r.loading ? <div className="loading">Loading saved creators…</div> : r.data?.items?.length ? <div className="campaign-grid">{r.data.items.map((p: any) => <article className="campaign-card" key={p.id}><div><span className="badge">{p.data.availability}</span><CompareSelect slug={p.slug}/></div><h3>{p.data.name}</h3><p>{p.data.headline}</p><div className="tags">{list(p.data.tools).slice(0, 4).map(t => <span className="badge" key={t}>{t}</span>)}</div><div className="inline-actions"><a className="text-link" href={'/creators/' + p.slug}>View creator<ArrowUpRight size={15}/></a><button className="icon-btn" aria-label={'Remove ' + p.data.name + ' from saved creators'} disabled={busy} onClick={async () => { setBusy(true); setError(''); try {
    await request('favorite', { creator: p.id });
    if (r.data.items.length === 1 && page > 1)
        setPage(page - 1);
    else
        r.refresh();
}
catch (e: any) {
    setError(e.message);
}
finally {
    setBusy(false);
} }}><Heart size={16} fill="currentColor"/></button></div></article>)}</div> : <NoItems title="Build a thoughtful shortlist." body="Save creators from discovery or their public profiles to revisit them here." href="/discover" action="Discover creators"/>}{r.data?.pages > 1 && <div className="pagination"><Action secondary disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Action><span>{page} / {r.data.pages}</span><Action secondary disabled={page >= r.data.pages} onClick={() => setPage(page + 1)}>Next</Action></div>}</>; }
export function HomeAdditions() { return <><section className="section feature-section"><div className="section-heading"><div><span className="eyebrow">A WORKFLOW WITH ROOM TO THINK</span><h2>More context.<br /><em>Better decisions.</em></h2></div><a className="text-link" href="/resources">Explore field notes<ArrowUpRight size={17}/></a></div><div className="feature-grid">{[[Users, 'Compare your creative fit', 'Bring up to three creators together and understand the practical differences in tools, formats, rates and availability.', '/discover', 'Start a comparison'], [FileText, 'Give your brief a clear structure', 'Start with a purpose-built format, then define the budget, deadline and rights that belong to your campaign.', '/templates', 'Explore brief structures'], [FolderOpen, 'Read the process behind the work', 'Browse real published projects with tools, workflow, creator contribution and commercial-use context.', '/work', 'Open the workroom']].map(([Icon, title, body, href, label]: any) => <article className="feature-card" key={title}><Icon size={36} strokeWidth={1}/><h3>{title}</h3><p>{body}</p><a className="text-link" href={href}>{label}<ArrowUpRight size={16}/></a></article>)}</div></section><section className="section collaboration-detail"><div><span className="eyebrow">CLEAR EXPECTATIONS. CONNECTED WORK.</span><h2>Every detail<br /><em>has a place.</em></h2><p className="large-copy">A project is more than a final file. Keep the brief, practical steps, version history and agreed decisions connected.</p><Action href="/how-it-works">See the complete journey<ArrowUpRight size={17}/></Action></div><div className="collaboration-list">{[[Target, 'A shared checklist', 'Turn scope into practical steps with due dates and visible completion.'], [Layers, 'Versioned submissions', 'Keep earlier files and feedback alongside the latest deliverable.'], [Shield, 'Specific agreements', 'Record usage, revisions and delivery expectations before the work starts.'], [Star, 'Feedback from real work', 'Completed collaborations can receive genuine project reviews.']].map(([Icon, title, body]: any, i) => <article key={title}><span>0{i + 1}</span><Icon size={25} strokeWidth={1}/><div><h3>{title}</h3><p>{body}</p></div></article>)}</div></section></>; }
export function GlobalTools({ role }: any) { const dialog = useRef<HTMLDialogElement>(null), search = useRef<HTMLInputElement>(null); const [query, setQuery] = useState(''), [offline, setOffline] = useState(false); const base = '/app/' + (role === 'creator' ? 'creator' : 'brand'); const routes = [['Discover creators', '/discover', 'Search talent, tools and styles'], ['The workroom', '/work', 'Explore published portfolios'], ['Brief structures', '/templates', 'Start with a clear format'], ['Field notes', '/resources', 'Briefing, feedback and delivery'], ['Compare creators', '/compare', 'Review your comparison'], ['How it works', '/how-it-works', 'Understand the complete journey'], ['Contact', '/contact', 'Send a support enquiry'], ...(role ? [['Your workspace', base, 'Projects and activity'], ['Settings', '/app/settings', 'Account and appearance'], ['Notifications', '/app/notifications', 'Project updates'], ...(role !== 'creator' ? [['New campaign', base + '/campaigns/new', 'Create a complete brief'], ['Saved creators', base + '/saved', 'Revisit your shortlist']] : [['My portfolio', base + '/portfolio', 'Publish original work']])] : [['Sign in', '/login', 'Open your account']])]; const open = () => { setQuery(''); dialog.current?.showModal(); setTimeout(() => search.current?.focus(), 0); }; useEffect(() => { const key = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (dialog.current?.open)
        dialog.current.close();
    else
        open();
} }; const status = () => setOffline(!navigator.onLine); status(); window.addEventListener('keydown', key); window.addEventListener('online', status); window.addEventListener('offline', status); return () => { window.removeEventListener('keydown', key); window.removeEventListener('online', status); window.removeEventListener('offline', status); }; }, []); const results = routes.filter(([title, , description]) => (title + ' ' + description).toLowerCase().includes(query.toLowerCase())); return <>{offline && <div className="offline-banner" role="status">You’re offline. Saved information may remain visible; new changes need a connection.</div>}<button className="quick-nav" aria-label="Open quick navigation" onClick={open}><Search size={16}/><span>Quick navigation</span><kbd>⌘ / Ctrl K</kbd></button><dialog className="command-dialog" ref={dialog} aria-labelledby="quick-nav-title" onClick={e => { if (e.target === dialog.current)
    dialog.current.close(); }}><div className="command-heading"><h2 id="quick-nav-title">Where would you like to go?</h2><button className="icon-btn" aria-label="Close quick navigation" onClick={() => dialog.current?.close()}><X size={18}/></button></div><div className="search"><Search size={18}/><input ref={search} aria-label="Search navigation" placeholder="Search pages and actions" value={query} onChange={e => setQuery(e.target.value)}/></div><div className="command-results">{results.map(([title, href, description]) => <a href={href} key={href}><div><strong>{title}</strong><span>{description}</span></div><ArrowUpRight size={17}/></a>)}{!results.length && <p>No pages match this search.</p>}</div><p className="micro">Use Tab to select a result. Press Escape to close.</p></dialog></>; }

