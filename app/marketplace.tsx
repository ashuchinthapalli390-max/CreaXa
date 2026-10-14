'use client';
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { ArrowUpRight, ArrowRight, ArrowLeft, Plus, Search, SlidersHorizontal, X, Menu, ChevronDown, Check, CheckCircle2, Layers, Orbit, MoveUpRight, Film, Image as ImageIcon, Box, Sparkles, Briefcase, LayoutDashboard, Users, FolderOpen, Mail, Bell, Settings, Heart, LogOut, Upload, FileText, Shield, Clock, MapPin, Globe, Eye, Trash2, Download, Send, Loader2, Palette, Play, RefreshCw, ExternalLink } from 'lucide-react';
import { HomeStorytelling } from './home-storytelling';
import MotionSystem from './motion';
import './motion.css';
import './features.css';
import { CompareProvider, CompareSelect, ComparePage, SavedSearchTools, WorkGallery, TemplateGallery, ResourceHub, ProjectTasks, ProjectReview, CreatorReviews, CampaignTools, AccountExport, ProfileChecklist, SavedCreators, HomeAdditions, GlobalTools, RECIPES } from './features';
import { list, intersects } from '../lib/matching';
import { AppSelect } from '../components/ui/app-select';
import { AnimatedCheckbox } from '../components/ui/animated-checkbox';
import { AnimatedAccordion } from '../components/ui/animated-accordion';
import { AdminDashboard } from '../components/admin/admin-dashboard';
import { EXTERNAL_CREATOR_REFERENCES } from '../lib/creators/external-references';
import { VideoEmbed } from '../components/ui/video-embed';
import { CreatorCoverMedia, CreatorAvatar } from '../components/ui/creator-media-card';
import { ProfileHeroBanner } from '../components/ui/profile-hero-banner';
import { ContactEmailModal } from '../components/auth/contact-email-modal';
type Obj = Record<string, any>;
const Context = createContext<any>(null);
const useApp = () => useContext(Context);
const THEMES = ['Obsidian Editorial', 'Paper & Ink', 'Carbon Acid', 'Midnight Cobalt', 'Terracotta Atelier', 'Arctic Signal', 'Plum Archive', 'Industrial Mono', 'Analog Film', 'Deep Teal Gallery'];
const SPECIAL = ['AI Filmmaking', 'AI Animation', 'Generative Images', 'Product Advertising', 'AI Fashion', 'Music Video Production', 'Motion Graphics', 'Concept Art', 'Creative Direction'];
const TOOLS = ['Runway', 'Kling', 'Midjourney', 'Flux', 'Veo', 'Sora', 'ComfyUI', 'Blender', 'After Effects', 'Premiere Pro', 'DaVinci Resolve'];
const TYPES = ['AI Video', 'AI Image', 'AI Animation', 'AI Graphics'];
const STYLES = ['Cinematic', 'Luxury', 'Realistic', 'Futuristic', 'Minimal', 'Surreal', 'Editorial', 'Anime', '3D'];
const INDUSTRIES = ['Fashion', 'Beauty', 'Gaming', 'Technology', 'Food & Beverage', 'Travel', 'Entertainment', 'Education', 'Automotive'];
const PLATFORMS = ['Instagram', 'YouTube', 'TikTok', 'Web Ads', 'LinkedIn', 'Broadcast'];
const RATIOS = ['9:16', '16:9', '1:1', '4:5', '3:2'];
async function api(path: string, data?: unknown, method?: string, signal?: AbortSignal) {
    const res = await fetch('/api/' + path, { signal, method: method || (data !== undefined ? 'POST' : 'GET'), headers: data instanceof FormData ? {} : data !== undefined ? { 'Content-Type': 'application/json' } : {}, body: data instanceof FormData ? data : data !== undefined ? JSON.stringify(data) : undefined });
    const result: any = await res.json();
    if (!res.ok)
        throw new Error(result.error || 'Request failed. Please try again.');
    return result;
}
const money = (n: any, c = 'INR') => new Intl.NumberFormat(c === 'INR' ? 'en-IN' : c === 'EUR' ? 'de-DE' : 'en-US', { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(Number(n) || 0);
const date = (t: any) => t ? new Date(t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set';
const dashboard = (role?: string) => role === 'admin' ? '/admin' : '/app/' + (role === 'creator' ? 'creator' : 'brand');
function Button({ children, href, secondary = false, className = '', ...props }: any) { const cl = 'button ' + (secondary ? 'secondary ' : '') + className; return href ? <a className={cl} href={href} {...props}>{children}</a> : <button className={cl} {...props}>{children}</button>; }
function Badge({ children }: any) { return <span className="badge">{children}</span>; }
function Empty({ icon: Icon = Layers, title, description, action, href }: any) { return <div className="empty"><div className="empty-icon"><Icon size={28}/></div><h3>{title}</h3><p>{description}</p>{action && <Button href={href}>{action}<ArrowUpRight size={16}/></Button>}</div>; }
function Loading() { return <div className="loading"><Loader2 className="spin" size={25}/>Loading your workspace…</div>; }
function ErrorBox({ message, retry }: any) { return <div className="error-box" role="alert"><p>{message}</p>{retry && <button onClick={retry}>Try again</button>}</div>; }
function useResource(path: string) {
    const [data, setData] = useState<any>(null), [error, setError] = useState(''), [loading, setLoading] = useState(true), [revision, setRevision] = useState(0);
    const refresh = useCallback(() => setRevision(n => n + 1), []);
    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError('');
        api(path, undefined, undefined, controller.signal).then(result => {
            if (!controller.signal.aborted)
                setData(result);
        }).catch(e => {
            if (!controller.signal.aborted)
                setError(e.message);
        }).finally(() => {
            if (!controller.signal.aborted)
                setLoading(false);
        });
        return () => controller.abort();
    }, [path, revision]);
    return { data, error, loading, refresh };
}
export default function Marketplace({ path }: {
    path: string;
}) {
    const [me, setMe] = useState<any>(null), [error, setError] = useState(''), [toast, setToast] = useState(''), [theme, setTheme] = useState(0);
    const refreshMe = () => api('me').then(setMe).catch(e => setError(e.message));
    useEffect(() => {
        refreshMe();
        try {
            const n = Number(localStorage.getItem('creaxa-theme') || 0);
            setTheme(Number.isInteger(n) && n >= 0 && n < THEMES.length ? n : 0);
        }
        catch { }
    }, []);
    useEffect(() => {
        document.documentElement.dataset.theme = String(theme);
        try {
            localStorage.setItem('creaxa-theme', String(theme));
        }
        catch { }
    }, [theme]);
    useEffect(() => {
        if (toast) {
            const id = setTimeout(() => setToast(''), 4500);
            return () => clearTimeout(id);
        }
    }, [toast]);
    const app = { me, toast: setToast, refreshMe, theme, setTheme };
    const inside = path.startsWith('/app') || path.startsWith('/admin');
    return <Context.Provider value={app}><CompareProvider><MotionSystem /><GlobalTools role={me?.account?.role}/><a className="skip" href="#main">Skip to content</a>{inside ? <AppShell path={path}/> : <><Header path={path}/><main id="main">{path === '/' ? <Home /> : path === '/discover' ? <Discover /> : path === '/compare' ? <ComparePage /> : path === '/work' ? <WorkGallery /> : path === '/templates' ? <TemplateGallery /> : path === '/resources' || path.startsWith('/resources/') ? <ResourceHub slug={path.split('/')[2]}/> : (path.startsWith('/creators/') || path.startsWith('/artists/')) ? (path.includes('/works/') ? <ArtistProjectDetail artistSlug={path.split('/')[2]} projectSlug={path.split('/')[4]}/> : <Creator slug={path.split('/')[2]}/>) : path.startsWith('/projects/') ? <Project slug={path.split('/')[2]}/> : path === '/onboarding' ? <Onboarding /> : ['/login', '/signup', '/verify-email', '/forgot-password', '/reset-password'].includes(path) ? <Auth path={path}/> : <Info path={path}/>}</main><Footer /></>}{error && <div className="global-error" role="alert">{error}<button onClick={() => { setError(''); refreshMe(); }}>Retry</button></div>}{toast && <div className="toast" role="status"><CheckCircle2 size={18}/>{toast}</div>}</CompareProvider></Context.Provider>;
}
function Logo() { return <a className="logo" href="/" aria-label="CreaXa home"><span className="logo-symbol"><span /><span /><span /></span>CreaXa<span className="logo-period">®</span></a>; }
function Header({ path }: any) {
    const { me, theme, setTheme } = useApp();
    const [menu, setMenu] = useState(false), [palette, setPalette] = useState(false);
    useEffect(() => { document.body.style.overflow = menu ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [menu]);
    useEffect(() => {
        const close = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMenu(false);
                setPalette(false);
            }
        };
        window.addEventListener('keydown', close);
        return () => window.removeEventListener('keydown', close);
    }, []);
    return <header className="header"><Logo /><nav className={menu ? 'nav open' : 'nav'} aria-label="Primary">{[['Discover', '/discover'], ['Work', '/work'], ['Brief structures', '/templates'], ['Field notes', '/resources'], ['How it works', '/how-it-works']].map(([label, href]) => <a key={href} href={href} className={path === href ? 'active' : ''}>{label}</a>)}</nav><div className="header-actions"><div className="theme-menu"><button className="icon-btn" aria-label="Choose theme" aria-expanded={palette} onClick={() => setPalette(!palette)}><Palette size={19}/></button>{palette && <div className="theme-popover"><span className="eyebrow">A DIFFERENT PERSPECTIVE</span>{THEMES.map((t, i) => <button key={t} onClick={() => { setTheme(i); setPalette(false); }}><span className={'swatch swatch-' + i}/>{t}{theme === i && <Check size={15}/>}</button>)}</div>}</div>{me?.account ? <Button href={dashboard(me.account.role)}>Workspace<ArrowUpRight size={15}/></Button> : <><a className="sign-in" href="/login">Sign in</a><Button href="/signup">Get started<ArrowUpRight size={15}/></Button></>}<button className="icon-btn mobile-toggle" onClick={() => setMenu(!menu)} aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu}>{menu ? <X /> : <Menu />}</button></div></header>;
}
function Home() {
    const creators = useResource('creators');
    return (
        <>
            <HomeStorytelling creators={creators.data || []} creatorsLoading={creators.loading} />
            <section className="section faq-section">
                <div>
                    <span className="eyebrow">07 / FREQUENT INQUIRIES</span>
                    <h2>A little more <em>clarity.</em></h2>
                    <a className="text-link" href="/faq">All questions<ArrowUpRight size={17}/></a>
                </div>
                <FaqList />
            </section>
        </>
    );
}
const FAQ = [['What kind of creators can I find here?', 'AI filmmakers, animators, generative artists, product creatives and creative directors. Published profiles show each creator’s declared skills, tools, formats and original portfolio.'], ['How does creator matching work?', 'Compatibility uses creative style and specialization (30%), preferred tools (20%), format (20%), industry (15%), and budget and availability (15%). Required format, commercial-use capability and budget constraints affect eligibility. Scores are compatibility indices, not outcome guarantees.'], ['Who owns the final creative work?', 'Usage rights are agreed between brand and creator for each project. Your brief records licensing or ownership requests, territory, duration and attribution. Underlying AI tools and third-party assets may impose separate terms.'], ['Can I manage revisions and delivery here?', 'Yes. Accepted invitations create a shared workspace for messages, versioned submissions, revision requests, approvals and final delivery. Files are available to authorized project participants.'], ['Are payments processed on the platform?', 'Payments and escrow are not currently processed here. Agree payment arrangements directly with your creative partner. A completed workspace records delivery, not payment settlement.'], ['What does a verification label mean?', 'Self-declared capabilities have not been independently reviewed. Evidence submitted and under review are separate from verified. Verification reviews only the specified claim and does not establish copyright ownership or commercial rights.']];
function FaqList() { 
  const items = FAQ.map(([q, a], i) => ({
    id: 'faq-' + i,
    index: '0' + (i + 1),
    title: q,
    content: a
  }));
  return <div className="faq-list"><AnimatedAccordion items={items} allowMultiple={true} /></div>; 
}
function Footer() { return <footer className="footer"><div className="footer-top"><Logo /><p>A new connection.<br />An original creation.</p><div><a href="/discover">Discover creators</a><a href="/for-brands">For brands</a><a href="/for-creators">For creators</a></div><div><a href="/work">The workroom</a><a href="/templates">Brief structures</a><a href="/resources">Field notes</a><a href="/about">About</a><a href="/faq">FAQs</a><a href="/contact">Contact</a></div></div><div className="footer-wordmark">CreaXa<span>↗</span></div><div className="footer-bottom"><span>© {new Date().getFullYear()} CreaXa</span><span>HUMAN VISION. AI CAPABILITY.</span><div><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></div></footer>; }
function UnifiedCreatorCard({ item, match: score }: any) {
    const { toast, me } = useApp();
    const isRef = !!item.isExternalReference;

    if (isRef) {
        const ref = item;
        return (
            <article className="editorial-creator-card" key={ref.id || ref.slug}>
                <div>
                    <div className="editorial-card-header">
                        <div className="editorial-avatar-wrap">
                            <img
                                src={ref.avatarUrl}
                                alt={ref.name}
                                loading="lazy"
                                onError={(e: any) => { e.currentTarget.src = `/creator-avatars/${ref.slug}.svg`; }}
                            />
                        </div>
                        <div className="editorial-meta-wrap">
                            <div className="editorial-badges-row">
                                <span className="editorial-badge-pill">Editorial Reference</span>
                                {ref.location && (
                                    <span className="editorial-location-pill">{ref.location}</span>
                                )}
                            </div>
                            <h3 className="editorial-artist-name">
                                <a href={'/creators/' + ref.slug}>{ref.name}</a>
                                <ArrowUpRight size={15} style={{ opacity: 0.6 }} />
                            </h3>
                            <p className="editorial-specialization" title={ref.specialization}>
                                {ref.specialization}
                            </p>
                        </div>
                    </div>

                    <p className="editorial-bio-text">
                        {ref.bioSummary}
                    </p>

                    <div className="editorial-tools-strip">
                        {ref.documentedTools.slice(0, 4).map((t: string) => (
                            <span key={t} className="editorial-tool-badge">{t}</span>
                        ))}
                    </div>
                </div>

                <div className="editorial-card-bottom">
                    <Button href={'/creators/' + ref.slug} secondary className="editorial-explore-btn">
                        Explore Works ({ref.featuredWorks.length})
                    </Button>
                    <a
                        href={ref.portfolioUrl || ref.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="editorial-portfolio-link"
                        aria-label={'Official website for ' + ref.name}
                    >
                        Official Portfolio <ArrowUpRight size={13} />
                    </a>
                </div>
            </article>
        );
    }

    const p = item;
    const d = p.data || {};
    const coverUrl = d.cover ? (d.cover.startsWith('http') ? d.cover : '/api/files/' + d.cover) : undefined;
    const avatarUrl = d.avatar ? (d.avatar.startsWith('http') ? d.avatar : '/api/files/' + d.avatar) : undefined;
    return (
        <article className="creator-card unified-creator-card" key={p.id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <a href={'/creators/' + p.slug} className="creator-cover" style={{ aspectRatio: '16/10', position: 'relative' }}>
                <CreatorCoverMedia
                    coverUrl={coverUrl}
                    name={d.name || 'AI Creator'}
                    specialization={list(d.specializations)[0] || 'AI creative'}
                />
                {score ? (
                    <span className="match-badge">{score.score}% compatibility</span>
                ) : (
                    <span className="badge" style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.15)', fontSize: 10 }}>
                        Registered Creator
                    </span>
                )}
                <span className="card-arrow"><ArrowUpRight size={20}/></span>
            </a>
            <div className="creator-meta">
                <CreatorAvatar
                    avatarUrl={avatarUrl}
                    name={d.name || 'Creator'}
                />
                <div>
                    <a href={'/creators/' + p.slug}><h3>{d.name}</h3></a>
                    <p>{d.headline || list(d.specializations)[0] || 'Generative Specialist'}</p>
                </div>
                <button className="icon-btn" aria-label={'Save ' + d.name} onClick={async () => {
                    if (!me?.account) {
                        location.href = '/login';
                        return;
                    }
                    try {
                        const r = await api('favorite', { creator: p.id });
                        toast(r.saved ? 'Creator saved.' : 'Creator removed from saved.');
                    }
                    catch (e: any) {
                        toast(e.message);
                    }
                }}><Heart size={18}/></button>
            </div>
            {d.bio && (
                <p className="card-bio" style={{ padding: '0 20px', fontSize: 12, color: 'var(--muted)', margin: '0 0 12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: '0 0 auto' }}>
                    {d.bio}
                </p>
            )}
            <div className="tags" style={{ padding: '0 20px 14px', flex: '1 0 auto' }}>
                {list(d.tools).slice(0, 3).map((t: string) => <Badge key={t}>{t}</Badge>)}
            </div>
            <CompareSelect slug={p.slug}/>
            <div className="card-bottom" style={{ marginTop: 'auto' }}>
                <span>
                    <span className={'status-dot ' + (d.availability === 'Available' ? 'available' : '')}/>
                    {d.availability || 'Direct inquiry'}
                </span>
                <strong>{d.rate > 0 ? 'From ' + money(d.rate, d.currency) : 'Rate on request'}</strong>
            </div>
            {score && <details className="match-details"><summary>Why this match?<ChevronDown size={15}/></summary>{score.reasons.map((r: any) => <div key={r.label}><span>{r.label}</span><strong>{r.points}/{r.max}</strong></div>)}</details>}
        </article>
    );
}
function CreatorCard({ p, match: score }: any) {
    return <UnifiedCreatorCard item={p} match={score} />;
}
function Discover() {
    const [directoryTab, setDirectoryTab] = useState<'all' | 'references' | 'registered'>('all');
    const [q, setQ] = useState(''), [debounced, setDebounced] = useState(''), [page, setPage] = useState(1), [filters, setFilters] = useState<Obj>({}), [sort, setSort] = useState('recent'), [open, setOpen] = useState(false), [saved, setSaved] = useState(false);
    const { me } = useApp();
    useEffect(() => { const id = setTimeout(() => setDebounced(q), 250); return () => clearTimeout(id); }, [q]);
    const query = new URLSearchParams({ q: debounced, sort, page: String(page) });
    for (const [k, v] of Object.entries(filters)) {
        if (Array.isArray(v) && v.length)
            query.set(k, v.join('|'));
        else if (v)
            query.set(k, typeof v === 'boolean' ? '1' : String(v));
    }
    if (saved)
        query.set('saved', '1');
    const r = useResource('discovery?' + query.toString());
    useEffect(() => setPage(1), [debounced, sort, filters, saved]);
    const groups: [
        string,
        string,
        string[]
    ][] = [['specializations', 'Specialization', SPECIAL], ['tools', 'AI tools', TOOLS], ['contentTypes', 'Content type', TYPES], ['styles', 'Creative style', STYLES], ['aspectRatios', 'Aspect ratio', RATIOS], ['industries', 'Industry', INDUSTRIES], ['platforms', 'Platform', PLATFORMS]];
    const registeredResults = (r.data?.items || []).map((item: any) => ({ ...item, isExternalReference: false }));
    const set = (k: string, v: any) => setFilters({ ...filters, [k]: v });

    const filteredReferences = EXTERNAL_CREATOR_REFERENCES.filter(ref => {
        if (debounced) {
            const needle = debounced.toLowerCase();
            const matchesText = (
                ref.name.toLowerCase().includes(needle) ||
                ref.specialization.toLowerCase().includes(needle) ||
                ref.bioSummary.toLowerCase().includes(needle) ||
                ref.documentedTools.some(t => t.toLowerCase().includes(needle)) ||
                ref.featuredWorks.some(w => w.title.toLowerCase().includes(needle))
            );
            if (!matchesText) return false;
        }
        if (filters.tools && Array.isArray(filters.tools) && filters.tools.length > 0) {
            const hasTool = filters.tools.some((t: string) => ref.documentedTools.some(dt => dt.toLowerCase().includes(t.toLowerCase())));
            if (!hasTool) return false;
        }
        if (filters.specializations && Array.isArray(filters.specializations) && filters.specializations.length > 0) {
            const hasSpec = filters.specializations.some((s: string) => ref.specialization.toLowerCase().includes(s.toLowerCase()) || ref.creativeStyles.some(cs => cs.toLowerCase().includes(s.toLowerCase())));
            if (!hasSpec) return false;
        }
        if (filters.contentTypes && Array.isArray(filters.contentTypes) && filters.contentTypes.length > 0) {
            const hasContent = filters.contentTypes.some((ct: string) => ref.contentTypes.some(c => c.toLowerCase().includes(ct.toLowerCase())));
            if (!hasContent) return false;
        }
        // If user specifically filtered for "Available now" or price range or saved, exclude external references
        if (filters.available || filters.min || filters.max || saved) {
            return false;
        }
        return true;
    }).map(ref => ({ ...ref, isExternalReference: true }));

    // UNIFIED LIST: registered creators and external reference artists together!
    let allCreators: any[] = [...registeredResults, ...filteredReferences];
    if (sort === 'name') {
        allCreators.sort((a, b) => {
            const nameA = (a.isExternalReference ? a.name : a.data?.name || '').toLowerCase();
            const nameB = (b.isExternalReference ? b.name : b.data?.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });
    }

    const totalCount = allCreators.length;

    const displayedCreators = directoryTab === 'references'
        ? filteredReferences
        : directoryTab === 'registered'
        ? registeredResults
        : allCreators;

    return <div className="page discovery">
        <div className="page-intro">
            <span className="eyebrow">THE UNIFIED CREATIVE DIRECTORY</span>
            <h1>Find your next<br /><em>creative partner.</em></h1>
            <p>Explore genuine registered creators and verified editorial AI artists in one unified directory.</p>
        </div>

        <div className="discovery-toolbar" style={{ marginBottom: 25 }}>
            <div className="search" style={{ flex: 1 }}>
                <Search size={20}/>
                <input
                    aria-label="Search all creators and artists"
                    placeholder="Search creators, artists, models (Runway, Sora, Kling, Midjourney) or skills..."
                    value={q}
                    onChange={e => setQ(e.target.value)}
                />
                {q && <button className="icon-btn" onClick={() => setQ('')} aria-label="Clear search"><X size={17}/></button>}
            </div>
            <button className="button secondary" onClick={() => setOpen(!open)} style={{ minHeight: 54, padding: '0 20px', gap: 8, fontSize: 13 }}>
                <SlidersHorizontal size={18}/>
                <span>{open ? 'Hide Filters' : 'Filters'}</span>
                {(Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : !!v) || saved) && (
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
                )}
            </button>
            <div style={{ minWidth: 200 }}>
                <AppSelect ariaLabel="Sort creators" value={sort} onChange={v => setSort(v)} options={[{ value: 'recent', label: 'Recently updated' }, { value: 'name', label: 'Alphabetical' }, { value: 'rate', label: 'Starting rate: low to high' }]}/>
            </div>
        </div>

        {/* Unified Search Tools if signed in */}
        <SavedSearchTools signedIn={!!me?.account} current={{ ...filters, q, sort }} onApply={(values: Obj) => { setQ(values.q || ''); setSort(values.sort || 'recent'); const { q: search, sort: order, ...rest } = values; setFilters(rest); setPage(1); }}/>

        <div className={open ? "discovery-layout" : ""}>
            {open && (
                <aside className={'filters filters-open'}>
                    <div className="filter-heading"><strong>Refine your search</strong><button onClick={() => { setFilters({}); setQ(''); }}>Reset</button></div>
                    <p className="micro">Any selection within a group. All selected groups must match.</p>
                    {groups.map(([key, label, options]) => <details key={key} open={key === 'specializations' || key === 'tools'}><summary>{label}<ChevronDown size={15}/></summary><div style={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '6px 0' }}>{options.map(option => <div key={option} style={{ padding: '3px 0' }}><AnimatedCheckbox label={option} checked={list(filters[key]).includes(option)} onChange={checked => set(key, checked ? [...list(filters[key]), option] : list(filters[key]).filter(v => v !== option))} ariaLabel={option}/></div>)}</div></details>)}
                    <details open><summary>Starting rate ({filters.currency || 'INR'})<ChevronDown size={15}/></summary><div style={{ marginBottom: '8px' }}><AppSelect ariaLabel="Rate currency" value={filters.currency || 'INR'} onChange={v => set('currency', v)} options={[{ value: 'INR', label: 'INR (₹)' }, { value: 'USD', label: 'USD ($)' }, { value: 'EUR', label: 'EUR (€)' }]}/></div><div className="range"><input type="number" min="0" aria-label="Minimum rate" placeholder="Min" value={filters.min || ''} onChange={e => set('min', e.target.value)}/><span>–</span><input type="number" min="0" aria-label="Maximum rate" placeholder="Max" value={filters.max || ''} onChange={e => set('max', e.target.value)}/></div></details>
                    <div style={{ padding: '6px 0' }}><AnimatedCheckbox label="Available now (Registered)" checked={!!filters.available} onChange={checked => set('available', checked)} ariaLabel="Available now"/></div>
                    <div style={{ padding: '6px 0' }}><AnimatedCheckbox label="Verified claims" checked={!!filters.verified} onChange={checked => set('verified', checked)} ariaLabel="Verified claims"/></div>
                    {me?.account && <div style={{ padding: '6px 0' }}><AnimatedCheckbox label="Saved creators" checked={saved} onChange={checked => setSaved(checked)} ariaLabel="Saved creators"/></div>}
                </aside>
            )}

            <div>
                {/* Segmented Directory View Selector */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
                    <button
                        type="button"
                        onClick={() => setDirectoryTab('all')}
                        className={`button ${directoryTab === 'all' ? '' : 'secondary'}`}
                        style={{ fontSize: 12, padding: '8px 18px', minHeight: 38, borderRadius: 24, fontWeight: 600 }}
                    >
                        All Creative Partners ({totalCount})
                    </button>
                    <button
                        type="button"
                        onClick={() => setDirectoryTab('references')}
                        className={`button ${directoryTab === 'references' ? '' : 'secondary'}`}
                        style={{ fontSize: 12, padding: '8px 18px', minHeight: 38, borderRadius: 24, fontWeight: 600 }}
                    >
                        10 Genuine AI Creators ({filteredReferences.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setDirectoryTab('registered')}
                        className={`button ${directoryTab === 'registered' ? '' : 'secondary'}`}
                        style={{ fontSize: 12, padding: '8px 18px', minHeight: 38, borderRadius: 24, fontWeight: 600 }}
                    >
                        Registered Creators ({registeredResults.length})
                    </button>
                </div>

                {directoryTab === 'references' ? (
                    <div className="results-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="live-dot" style={{ width: 8, height: 8 }} />
                            {filteredReferences.length} Genuine AI Creators Documented
                        </span>
                        <span className="micro" style={{ letterSpacing: '0.12em', color: 'var(--accent)', fontWeight: 700 }}>
                            PRIMARY SOURCES & OFFICIAL WEBSITES
                        </span>
                    </div>
                ) : directoryTab === 'registered' ? (
                    <div className="results-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
                            {registeredResults.length} Registered Creator{registeredResults.length === 1 ? '' : 's'}
                        </span>
                        <span className="micro" style={{ letterSpacing: '0.12em', color: 'var(--muted)', fontWeight: 600 }}>
                            AVAILABLE FOR HIRE & DIRECT INVITATION
                        </span>
                    </div>
                ) : (
                    <div className="results-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
                            {r.loading ? 'Searching…' : `${totalCount} Creative Partner${totalCount === 1 ? '' : 's'}`}
                            <span style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 400, marginLeft: 10 }}>
                                ({registeredResults.length} registered · {filteredReferences.length} documented references)
                            </span>
                        </span>
                        <span className="micro" style={{ letterSpacing: '0.12em', color: 'var(--accent)', fontWeight: 700 }}>
                            HUMAN VISION · AI CAPABILITY · ORIGINAL PROVENANCE
                        </span>
                    </div>
                )}

                <div className="selected-filters">{Object.entries(filters).filter(([k, v]) => Array.isArray(v)).flatMap(([k, v]: any) => v.map((s: string) => <button key={k + s} onClick={() => set(k, v.filter((a: string) => a !== s))}>{s}<X size={13}/></button>))}</div>

                {r.loading && !displayedCreators.length ? (
                    <Loading />
                ) : r.error && !displayedCreators.length ? (
                    <ErrorBox message={r.error} retry={r.refresh}/>
                ) : displayedCreators.length > 0 ? (
                    <div className="creator-grid">
                        {displayedCreators.map((item: any) => (
                            <UnifiedCreatorCard key={item.id || item.slug} item={item} />
                        ))}
                    </div>
                ) : (
                    <Empty
                        icon={Users}
                        title={q || Object.values(filters).some(Boolean) ? 'No creators or artists match these filters.' : 'The directory is ready.'}
                        description={q || Object.values(filters).some(Boolean) ? 'Try clearing your search query or broadening your selected filters.' : 'Explore published creator accounts and editorial references.'}
                        action={q || Object.values(filters).some(Boolean) ? 'Clear filters' : 'Publish your creator profile'}
                        href={q || Object.values(filters).some(Boolean) ? undefined : '/signup'}
                        onClick={q || Object.values(filters).some(Boolean) ? () => { setQ(''); setFilters({}); } : undefined}
                    />
                )}
            </div>
        </div>
    </div>;
}
function Creator({ slug }: any) {
    const r = useResource('creators/' + slug);
    const { me, toast } = useApp();
    if (r.loading)
        return <Loading />;
    if (r.error)
        return <div className="page"><ErrorBox message={r.error}/></div>;
    const { profile: p, projects } = r.data, d = p.data;
    const isRef = !!(p.isExternalReference || d.isExternalReference);

    return <div className="page profile-public">
        <a className="back-link" href="/discover"><ArrowLeft size={16}/>Back to discovery</a>
        <ProfileHeroBanner
            coverUrl={d.cover}
            name={d.name}
            specialization={d.headline || d.specialization || (Array.isArray(d.specializations) ? d.specializations[0] : 'AI Creative')}
            isExternalReference={isRef}
        />
        <div className="profile-title">
            <CreatorAvatar
                avatarUrl={d.avatar?.startsWith('http') ? d.avatar : d.avatar ? '/api/files/' + d.avatar : undefined}
                name={d.name}
                className="large"
            />
            <div>
                <div className="tags">
                    {isRef ? (
                        <>
                            <Badge>External Editorial Reference</Badge>
                            <Badge>Public Portfolio</Badge>
                        </>
                    ) : (
                        <>
                            <Badge>{p.verification}</Badge>
                            <Badge>{d.availability}</Badge>
                        </>
                    )}
                </div>
                <h1>{d.name}</h1>
                <p>{d.headline}</p>
            </div>
            {isRef ? (
                <a className="button" href={d.portfolioUrl || d.website} target="_blank" rel="noopener noreferrer">
                    Visit Official Portfolio <ExternalLink size={17} style={{ marginLeft: 6 }}/>
                </a>
            ) : (
                <Button href={'/app/brand/invitations?creator=' + encodeURIComponent(p.id)}>
                    Invite to a campaign<ArrowUpRight size={18}/>
                </Button>
            )}
        </div>

        {isRef && (
            <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8, padding: '16px 20px', margin: '20px 0 28px', display: 'flex', gap: 14, alignItems: 'center' }}>
                <Shield size={22} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                    <strong>Editorial Reference Profile:</strong> Documented from official public sources for benchmarking and research. This artist is not a registered user on CreaXa, no platform fees or availability are represented, and in-app invitations link directly to their official website.
                    {d.attributionNote && <div style={{ marginTop: 4, opacity: 0.8 }}><em>Source: {d.attributionNote}</em></div>}
                </div>
            </div>
        )}

        <div className="profile-layout">
            <div>
                <section className="profile-section">
                    <span className="eyebrow">{isRef ? 'DOCUMENTED BIOGRAPHY & PRACTICE' : 'THE PERSON BEHIND THE PROCESS'}</span>
                    <h2>About</h2>
                    <p className="preserve">{d.bio}</p>
                </section>
                <section className="profile-section">
                    <h2>Tools & capabilities</h2>
                    {[['Specializations', d.specializations], ['AI tools & models', d.tools], ['Creative styles', d.styles], ['Content types', d.contentTypes], ['Aspect ratios', d.aspectRatios], ['Industries', d.industries], ['Output formats', d.formats]].map(([l, v]) => (
                        <div className="capability-row" key={l}>
                            <h4>{l}</h4>
                            <div className="tags">{list(v).length ? list(v).map(t => <Badge key={t}>{t}</Badge>) : <span className="muted">Not provided</span>}</div>
                        </div>
                    ))}
                    {d.experience && <p className="preserve">{d.experience}</p>}
                    {d.workflow && <div className="note"><strong>Creative workflow</strong><p className="preserve">{d.workflow}</p></div>}
                </section>
                <section className="profile-section">
                    <div className="section-heading">
                        <h2>{isRef ? 'Documented Works & Case Studies' : 'Selected work'}</h2>
                        <span>{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
                    </div>
                    {projects.length ? (
                        <div className="portfolio-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                            {projects.map((proj: any) => isRef ? (
                                <div className="portfolio-card" key={proj.id} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {proj.data.videoEmbedUrl ? (
                                        <VideoEmbed
                                            title={proj.data.title}
                                            videoEmbedUrl={proj.data.videoEmbedUrl}
                                            videoPlatform={proj.data.videoPlatform}
                                            externalUrl={proj.data.externalLink}
                                            aspectRatio={proj.data.aspectRatio || '16/9'}
                                            attribution={proj.data.attribution}
                                        />
                                    ) : null}
                                    <div style={{ padding: '22px', background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minHeight: 180 }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Badge>{proj.data.contentType || 'Featured Work'}</Badge>
                                                {proj.data.year && <span className="micro">{proj.data.year}</span>}
                                            </div>
                                            <a href={'/creators/' + slug + '/works/' + (proj.slug || proj.id)} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <h3 style={{ marginTop: 12, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    {proj.data.title} <ArrowUpRight size={16} style={{ color: 'var(--accent)' }} />
                                                </h3>
                                            </a>
                                            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8, lineHeight: 1.5 }}>
                                                {proj.data.description}
                                            </p>
                                        </div>
                                        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12, flexWrap: 'wrap', gap: 8 }}>
                                            <span style={{ fontSize: 11, color: 'var(--accent)' }}>
                                                {list(proj.data.tools).join(' · ')}
                                            </span>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <a href={'/creators/' + slug + '/works/' + (proj.slug || proj.id)} className="button" style={{ fontSize: 11, padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                    Details <ArrowRight size={12} />
                                                </a>
                                                {proj.data.externalLink && (
                                                    <a href={proj.data.externalLink} target="_blank" rel="noopener noreferrer" className="button secondary" style={{ fontSize: 11, padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                                        Archive <ExternalLink size={11} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <a className="portfolio-card" key={proj.id} href={'/projects/' + proj.slug}>
                                    {proj.data.cover ? (
                                        <img 
                                            src={proj.data.cover.startsWith('http') ? proj.data.cover : '/api/files/' + proj.data.cover} 
                                            alt={proj.data.title} 
                                            loading="lazy"
                                            onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div className="cover-empty" style={{ aspectRatio: '1.6' }}>
                                            <Orbit size={32} strokeWidth={0.8} />
                                        </div>
                                    )}
                                    <div>
                                        <Badge>{proj.data.contentType}</Badge>
                                        <h3>{proj.data.title}<ArrowUpRight size={18}/></h3>
                                        <p>{list(proj.data.tools).join(' · ')}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <Empty title="Portfolio work hasn’t been published yet." description="This creator can add project case studies with tools, workflow details and commercial-use declarations."/>
                    )}
                </section>
                {!isRef && <CreatorReviews slug={slug}/>}
            </div>
            <aside className="profile-facts">
                <h3>At a glance</h3>
                <div><MapPin size={17}/>{d.location || 'Location not provided'}</div>
                {isRef ? (
                    <>
                        <div><FolderOpen size={17}/>{projects.length} Documented Project{projects.length === 1 ? '' : 's'}</div>
                        <div><Shield size={17}/>Primary Source Verified</div>
                        {d.website && (
                            <a href={d.website} target="_blank" rel="noopener noreferrer">
                                <Globe size={17}/>Official Website<ExternalLink size={14}/>
                            </a>
                        )}
                        {d.socialLinks && d.socialLinks.length > 0 && (
                            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                                <h4 style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8, fontWeight: 600 }}>Verified Channels</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {d.socialLinks.map((s: any) => (
                                        <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text)', textDecoration: 'none' }}>
                                            <ExternalLink size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                                            <span>{s.label || s.platform.toUpperCase()}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                        <p className="micro">Documented for educational reference and benchmarking. Unclaimed external profile.</p>
                    </>
                ) : (
                    <>
                        <div><Clock size={17}/>{d.turnaround ? d.turnaround + ' day typical turnaround' : 'Turnaround not provided'}</div>
                        <div><Briefcase size={17}/>{d.rate ? money(d.rate, d.currency) + ' starting rate' : 'Rate on request'}</div>
                        <div><RefreshCw size={17}/>{d.revisions} revision rounds</div>
                        <div><Shield size={17}/>{d.commercial ? 'Commercial projects accepted' : 'Commercial capability not declared'}</div>
                        {d.website && <a href={d.website} target="_blank" rel="noopener noreferrer"><Globe size={17}/>Website<ExternalLink size={14}/></a>}
                        <p className="micro">Capabilities and availability are creator declared unless a specific claim has been verified.</p>
                        <CompareSelect slug={p.slug}/>
                        <Button secondary onClick={async () => {
                            if (!me?.account) {
                                location.href = '/login';
                                return;
                            }
                            try {
                                const r = await api('favorite', { creator: p.id });
                                toast(r.saved ? 'Creator saved.' : 'Creator removed.');
                            }
                            catch (e: any) {
                                toast(e.message);
                            }
                        }}><Heart size={16}/>Save creator</Button>
                    </>
                )}
            </aside>
        </div>
    </div>;
}
function ArtistProjectDetail({ artistSlug, projectSlug, initialData }: any) {
    const r = useResource('creators/' + artistSlug + '/works/' + projectSlug);

    const ref = EXTERNAL_CREATOR_REFERENCES.find(c => c.slug === artistSlug);
    const work = ref?.featuredWorks.find(w => w.slug === projectSlug || w.id === projectSlug || `${ref.slug}-${w.slug}` === projectSlug);

    const projectData = initialData?.project?.data || r.data?.project?.data || (work ? {
        title: work.title,
        year: work.year,
        description: work.description,
        fullDescription: work.fullDescription || work.description,
        workflowNotes: work.workflowNotes,
        credits: work.credits,
        contentType: work.contentType,
        tools: work.tools,
        documentedTech: work.documentedTech,
        externalLink: work.externalUrl,
        videoEmbedUrl: work.videoEmbedUrl,
        videoPlatform: work.videoPlatform,
        aspectRatio: work.aspectRatio,
        mediaType: work.mediaType,
        attribution: work.attribution,
        mediaRightsStatus: work.mediaRightsStatus,
        isExternal: true,
        artistSlug: ref?.slug || artistSlug,
        artistName: ref?.name || 'Featured Artist',
    } : null);

    const artistData = initialData?.profile?.data || r.data?.profile?.data || (ref ? {
        name: ref.name,
        headline: ref.headline,
        bio: ref.fullBio || ref.bioSummary,
        avatar: ref.avatarUrl,
        cover: ref.coverUrl,
        location: ref.location,
        website: ref.officialWebsite,
        portfolioUrl: ref.portfolioUrl,
        socialLinks: ref.socialLinks || []
    } : null);

    const relatedWorks = initialData?.relatedWorks || r.data?.relatedWorks || (ref && work ? ref.featuredWorks.filter(w => w.id !== work.id).slice(0, 4) : []);

    if (r.loading && !projectData && !initialData) return <Loading />;
    if (r.error && !projectData && !initialData) return <div className="page"><ErrorBox message={r.error} retry={r.refresh} /></div>;
    if (!projectData || !artistData) return <div className="page"><Empty title="Work could not be found." description="This project is not currently indexed in our verified editorial archive." action="Explore Artists" href="/discover" /></div>;

    const d = projectData;
    const a = artistData;

    return (
        <div className="page project-public">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <a className="back-link" href={'/creators/' + artistSlug} style={{ margin: 0 }}>
                    <ArrowLeft size={16} /> Back to {a.name}’s Profile
                </a>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--muted)' }}>
                    <span>CreaXa</span>
                    <span>/</span>
                    <a href="/discover" style={{ color: 'inherit', textDecoration: 'none' }}>Artists</a>
                    <span>/</span>
                    <a href={'/creators/' + artistSlug} style={{ color: 'inherit', textDecoration: 'none' }}>{a.name}</a>
                    <span>/</span>
                    <span style={{ color: 'var(--text)' }}>{d.title}</span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <Badge>{d.contentType || 'AI Showcase'}</Badge>
                {d.year && <Badge>{d.year}</Badge>}
                <Badge>Public Editorial Reference</Badge>
            </div>

            <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 700, letterSpacing: '-0.02em', margin: '8px 0 16px', lineHeight: 1.15 }}>
                {d.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
                <a href={'/creators/' + artistSlug} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--text)', fontWeight: 600 }}>
                    <CreatorAvatar avatarUrl={a.avatar} name={a.name} style={{ width: 28, height: 28 }} />
                    <span>By {a.name}</span>
                </a>
                {a.location && <span style={{ color: 'var(--muted)', fontSize: 13 }}>• {a.location}</span>}
                {d.attribution && (
                    <span style={{ fontSize: 12, color: 'var(--muted)', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 8px' }}>
                        {d.attribution}
                    </span>
                )}
            </div>

            {/* PRIMARY MEDIA VIEWER */}
            <div style={{ margin: '0 0 40px', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--panel)' }}>
                {d.videoEmbedUrl ? (
                    <VideoEmbed
                        title={d.title}
                        videoEmbedUrl={d.videoEmbedUrl}
                        videoPlatform={d.videoPlatform || 'vimeo'}
                        externalUrl={d.externalLink}
                        aspectRatio={d.aspectRatio || '16/9'}
                        attribution={d.attribution}
                    />
                ) : (
                    <div style={{ padding: '64px 24px', textAlign: 'center', background: 'radial-gradient(ellipse at center, rgba(163,230,53,0.06), transparent 70%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                            <Film size={28} style={{ color: 'var(--accent)' }} />
                        </div>
                        <h2 style={{ fontSize: 22, marginBottom: 10 }}>{d.title}</h2>
                        <p style={{ maxWidth: 540, color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                            {d.description}
                        </p>
                        {d.externalLink && (
                            <a href={d.externalLink} target="_blank" rel="noopener noreferrer" className="button" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                Explore High-Resolution Work on Official Archive <ExternalLink size={15} />
                            </a>
                        )}
                    </div>
                )}
                
                <div style={{ padding: '14px 20px', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)' }}>
                        <Shield size={14} style={{ color: 'var(--accent)' }} />
                        <span>Public editorial reference strictly for education and benchmarking. Unlicensed media is not rehosted.</span>
                    </div>
                    {d.externalLink && (
                        <a href={d.externalLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                            Open Primary Source <ExternalLink size={12} />
                        </a>
                    )}
                </div>
            </div>

            {/* TWO-COLUMN EDITORIAL CONTENT */}
            <div className="profile-layout">
                <div>
                    <section className="profile-section">
                        <span className="eyebrow">CURATORIAL & ARTISTIC CONTEXT</span>
                        <h2>About this work</h2>
                        <p className="preserve large-copy" style={{ lineHeight: 1.7 }}>
                            {d.fullDescription || d.description}
                        </p>
                    </section>

                    {d.workflowNotes && (
                        <section className="profile-section">
                            <h2>Creative process & workflow</h2>
                            <div className="note" style={{ borderLeftColor: 'var(--accent)', background: 'var(--surface)' }}>
                                <strong style={{ color: 'var(--text)' }}>Documented Production Pipeline</strong>
                                <p className="preserve" style={{ marginTop: 8, lineHeight: 1.6 }}>{d.workflowNotes}</p>
                            </div>
                        </section>
                    )}

                    <section className="profile-section">
                        <h2>Documented AI tools & models</h2>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '14px 0 16px' }}>
                            {list(d.tools).map((t: string) => (
                                <span key={t} className="badge" style={{ fontSize: 13, padding: '6px 12px', background: 'var(--panel)', border: '1px solid var(--border)' }}>
                                    {t}
                                </span>
                            ))}
                        </div>
                        {d.documentedTech && (
                            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                                <strong>Technical Methodology:</strong> {d.documentedTech}
                            </p>
                        )}
                    </section>

                    {d.credits && (
                        <section className="profile-section">
                            <h2>Production credits</h2>
                            <p className="preserve" style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                                {d.credits}
                            </p>
                        </section>
                    )}
                </div>

                {/* SIDEBAR */}
                <aside className="profile-facts">
                    <h3>Project overview</h3>
                    <div><Layers size={17} /> Format: {d.contentType || 'AI Showcase'}</div>
                    {d.year && <div><Clock size={17} /> Year: {d.year}</div>}
                    {d.aspectRatio && <div><Box size={17} /> Aspect ratio: {d.aspectRatio}</div>}
                    <div><Shield size={17} /> Sourced Attribution Verified</div>

                    {d.externalLink && (
                        <a href={d.externalLink} target="_blank" rel="noopener noreferrer" className="button" style={{ marginTop: 10, justifyContent: 'center' }}>
                            Visit Original Project <ExternalLink size={15} />
                        </a>
                    )}

                    <div style={{ margin: '24px 0 16px', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>About the artist</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                            <div className="avatar" style={{ width: 44, height: 44, overflow: 'hidden' }}>
                                {a.avatar ? <img src={a.avatar} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : a.name.slice(0, 1)}
                            </div>
                            <div>
                                <h5 style={{ margin: 0, fontSize: 15 }}>{a.name}</h5>
                                <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>{a.headline}</p>
                            </div>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, margin: '8px 0 14px' }}>
                            {a.bio?.slice(0, 150)}…
                        </p>
                        <Button secondary href={'/creators/' + artistSlug} style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}>
                            View Full Artist Profile <ArrowUpRight size={14} />
                        </Button>
                    </div>

                    {a.socialLinks && a.socialLinks.length > 0 && (
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                            <h4 style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                                Verified Channels
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {a.socialLinks.map((s: any) => (
                                    <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text)', textDecoration: 'none' }}>
                                        <Globe size={14} style={{ color: 'var(--accent)' }} />
                                        <span>{s.label || s.platform}</span>
                                        <ExternalLink size={11} style={{ marginLeft: 'auto', opacity: 0.6 }} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>

            {/* MORE WORKS BY ARTIST */}
            {relatedWorks && relatedWorks.length > 0 && (
                <section style={{ marginTop: 60, borderTop: '1px solid var(--border)', paddingTop: 40 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <div>
                            <span className="eyebrow">CONTINUE EXPLORING</span>
                            <h2 style={{ margin: 0 }}>More works by {a.name}</h2>
                        </div>
                        <a href={'/creators/' + artistSlug} className="button secondary" style={{ fontSize: 12, padding: '6px 14px' }}>
                            All {a.name} Projects <ArrowUpRight size={14} />
                        </a>
                    </div>

                    <div className="portfolio-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                        {relatedWorks.map((rw: any) => (
                            <a
                                key={rw.id}
                                href={'/creators/' + artistSlug + '/works/' + (rw.slug || rw.id)}
                                className="portfolio-card"
                                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8, padding: 20, transition: 'all 0.2s ease' }}
                            >
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                        <Badge>{rw.contentType}</Badge>
                                        {rw.year && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{rw.year}</span>}
                                    </div>
                                    <h4 style={{ fontSize: 15, margin: '6px 0 8px', fontWeight: 600 }}>{rw.title}</h4>
                                    <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                                        {rw.description?.slice(0, 110)}…
                                    </p>
                                </div>
                                <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                                    <span style={{ color: 'var(--accent)' }}>{list(rw.tools).slice(0, 2).join(' · ')}</span>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                                        Explore <ArrowRight size={12} />
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

function Project({ slug }: any) {
    const r = useResource('projects/' + slug);
    if (r.loading)
        return <Loading />;
    if (r.error)
        return <div className="page"><ErrorBox message={r.error}/></div>;
    const { project: p, profile } = r.data, d = p.data;
    if (p.isExternal || d.isExternal) {
        return <ArtistProjectDetail artistSlug={d.artistSlug || profile?.slug} projectSlug={slug} initialData={r.data} />;
    }
    const heroSrc = d.cover?.startsWith('http') ? d.cover : d.cover ? '/api/files/' + d.cover : undefined;
    return <div className="page project-public"><a className="back-link" href={profile ? '/creators/' + profile.slug : '/discover'}><ArrowLeft size={16}/>Creator portfolio</a><span className="eyebrow">THE WORK. THE PROCESS. THE THINKING.</span><h1>{d.title}</h1><div className="tags"><Badge>{d.contentType}</Badge><Badge>{d.aspectRatio}</Badge>{d.industry && <Badge>{d.industry}</Badge>}</div>{heroSrc && <img className="project-hero" src={heroSrc} alt={d.title} onError={(e: any) => { e.currentTarget.style.display = 'none'; }}/>}<div className="profile-layout"><div><h2>The brief</h2><p className="preserve large-copy">{d.description}</p><h2>Creative workflow</h2><p className="preserve">{d.workflow}</p><h2>Creator contribution</h2><p className="preserve">{d.contribution}</p><div className="project-media">{d.media.map((id: string) => <Media key={id} id={id}/>)}</div></div><aside className="profile-facts"><h3>Project details</h3><div>Tools: {list(d.tools).join(', ')}</div><div>Skills: {list(d.skills).join(', ')}</div><div>Styles: {list(d.styles).join(', ')}</div><div>Resolution: {d.resolution || 'Not provided'}</div>{d.duration > 0 && <div>Duration: {d.duration} seconds</div>}<h4>Commercial-use declaration</h4><p>{d.commercialUse}</p><p className="micro">This is the creator’s declaration. Tool terms and third-party rights must be checked for your intended usage.</p>{d.externalLink && <a href={d.externalLink} target="_blank" rel="noopener noreferrer">Project link<ExternalLink size={15}/></a>}</aside></div></div>;
}
function Media({ id }: any) {
    const [type, setType] = useState(''), [error, setError] = useState(false);
    useEffect(() => {
        let cancelled = false;
        fetch('/api/files/' + id, { method: 'GET' }).then(r => {
            if (!r.ok)
                throw new Error();
            if (!cancelled)
                setType(r.headers.get('content-type') || '');
            r.body?.cancel();
        }).catch(() => {
            if (!cancelled)
                setError(true);
        });
        return () => { cancelled = true; };
    }, [id]);
    return error ? <p className="error-box">File unavailable.</p> : type.startsWith('video/') ? <video controls preload="metadata" src={'/api/files/' + id}/> : type.startsWith('image/') ? <img src={'/api/files/' + id} alt="Project media" loading="lazy"/> : <a className="file-link" href={'/api/files/' + id} target="_blank" rel="noopener noreferrer"><Download size={17}/>Open file</a>;
}
function GoogleIcon() {
    return <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>;
}
function Auth({ path }: any) {
    const { me, refreshMe, toast } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [terms, setTerms] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [infoMsg, setInfoMsg] = useState('');

    // Custom 6-Digit Email OTP verification state
    const [otpStep, setOtpStep] = useState(path === '/verify-email');
    const [otpCode, setOtpCode] = useState('');
    const [otpCooldown, setOtpCooldown] = useState(0);

    useEffect(() => {
        if (otpCooldown > 0) {
            const timer = setTimeout(() => setOtpCooldown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpCooldown]);

    const syncSession = async (user: any) => {
        try {
            const token = await user.getIdToken();
            document.cookie = `__session=${token}; path=/; max-age=604800; SameSite=Lax`;
            document.cookie = `firebase_token=${token}; path=/; max-age=604800; SameSite=Lax`;
            const sessRes = await api('auth/session', { idToken: token });
            await refreshMe();
            const returnTo = new URLSearchParams(location.search).get('return_to');
            if (sessRes.status === 'needs_onboarding') {
                location.href = '/onboarding' + (returnTo ? '?next=' + encodeURIComponent(returnTo) : '');
            } else if (returnTo && returnTo.startsWith('/')) {
                location.href = returnTo;
            } else {
                location.href = dashboard(sessRes.account?.role);
            }
        } catch (err: any) {
            setError(err.message || 'Authentication session sync failed.');
        }
    };

    const handleGoogle = async () => {
        setBusy(true);
        setError('');
        try {
            const { getFirebaseAuth, googleProvider, signInWithPopup } = await import('../lib/firebase');
            const cred = await signInWithPopup(getFirebaseAuth(), googleProvider);
            toast('Signed in with Google.');
            await syncSession(cred.user);
        } catch (err: any) {
            if (err.code !== 'auth/popup-closed-by-user') {
                setError(err.message || 'Google sign-in failed.');
            }
        } finally {
            setBusy(false);
        }
    };

    const requestOtp = async (purpose = 'signup_email_verification') => {
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }
        setBusy(true);
        setError('');
        try {
            await api('auth/otp/send', { email, purpose });
            setOtpStep(true);
            setOtpCooldown(60);
            toast('Verification code sent to ' + email);
        } catch (err: any) {
            setError(err.message || 'Failed to send verification code.');
        } finally {
            setBusy(false);
        }
    };

    const handleVerifyOtpAndComplete = async (e: any) => {
        e.preventDefault();
        setBusy(true);
        setError('');
        try {
            if (otpCode.trim().length !== 6) {
                throw new Error('Please enter the complete 6-digit verification code.');
            }
            await api('auth/otp/verify', {
                email,
                code: otpCode.trim(),
                purpose: 'signup_email_verification'
            });

            const { getFirebaseAuth, createUserWithEmailAndPassword, updateProfile } = await import('../lib/firebase');
            const auth = getFirebaseAuth();
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            if (displayName) {
                await updateProfile(cred.user, { displayName });
            }
            toast('Email verified & account created.');
            await syncSession(cred.user);
        } catch (err: any) {
            setError(err.message || 'Invalid or expired verification code.');
        } finally {
            setBusy(false);
        }
    };

    const handleEmailAuth = async (e: any) => {
        e.preventDefault();
        setBusy(true);
        setError('');
        setInfoMsg('');
        try {
            const {
                getFirebaseAuth,
                signInWithEmailAndPassword,
                sendPasswordResetEmail,
            } = await import('../lib/firebase');
            const auth = getFirebaseAuth();

            if (path === '/forgot-password' || path === '/reset-password') {
                await sendPasswordResetEmail(auth, email);
                setInfoMsg('Password reset instructions sent. Please check your inbox.');
                toast('Reset link sent.');
                return;
            }

            if (path === '/signup') {
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match.');
                }
                if (password.length < 6) {
                    throw new Error('Password must be at least 6 characters.');
                }
                if (!terms) {
                    throw new Error('Please accept the Terms and Privacy Policy to continue.');
                }
                // Send cryptographic OTP via Resend
                await requestOtp('signup_email_verification');
                return;
            } else {
                try {
                    const loginRes = await api('auth/login', { email: email.trim(), password });
                    if (loginRes?.success) {
                        toast('Signed in.');
                        if (loginRes.token) {
                            document.cookie = `__session=${loginRes.token}; path=/; max-age=604800; SameSite=Lax`;
                            document.cookie = `firebase_token=${loginRes.token}; path=/; max-age=604800; SameSite=Lax`;
                        }
                        if (loginRes.account?.id) {
                            document.cookie = `__sites_local_auth=${loginRes.account.id}; path=/; max-age=604800; SameSite=Lax`;
                        }
                        await refreshMe();
                        const returnTo = new URLSearchParams(location.search).get('return_to');
                        if (returnTo && returnTo.startsWith('/')) {
                            location.href = returnTo;
                        } else {
                            location.href = dashboard(loginRes.account?.role);
                        }
                        return;
                    }
                } catch (credErr: any) {
                    if (credErr.message && (credErr.message.includes('Incorrect') || credErr.message.includes('password'))) {
                        throw credErr;
                    }
                }

                const cred = await signInWithEmailAndPassword(auth, email, password);
                toast('Signed in.');
                await syncSession(cred.user);
            }
        } catch (err: any) {
            const msg = err.code === 'auth/email-already-in-use'
                ? 'An account with this email already exists. Sign in instead.'
                : err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
                ? 'Incorrect email or password.'
                : err.code === 'auth/user-not-found'
                ? 'No account found with this email address.'
                : err.message || 'Authentication failed.';
            setError(msg);
        } finally {
            setBusy(false);
        }
    };

    const isSignUp = path === '/signup';
    const isForgot = path === '/forgot-password' || path === '/reset-password';
    const isVerify = path === '/verify-email';

    return (
        <div className="auth-page">
            <div className="auth-art">
                <span className="eyebrow">THE NEXT CONNECTION STARTS HERE</span>
                <h1>Bring your<br /><em>possibilities.</em></h1>
                <div className="auth-art-visual" aria-hidden="true">
                    <svg viewBox="0 0 200 200" width="160" height="160" fill="none" className="auth-symbol-svg">
                        <circle cx="100" cy="100" r="85" stroke="var(--line)" strokeWidth="1" strokeDasharray="4 4"/>
                        <circle cx="100" cy="100" r="60" stroke="var(--accent)" strokeWidth="1.2" opacity="0.8"/>
                        <circle cx="100" cy="100" r="28" stroke="var(--line)" strokeWidth="1"/>
                        <line x1="15" y1="100" x2="185" y2="100" stroke="var(--line)" strokeWidth="1"/>
                        <line x1="100" y1="15" x2="100" y2="185" stroke="var(--line)" strokeWidth="1"/>
                        <circle cx="100" cy="40" r="3" fill="var(--accent)"/>
                        <circle cx="160" cy="100" r="3" fill="var(--accent)"/>
                    </svg>
                </div>
                <p>One unified account. Unlimited creative collaboration.</p>
            </div>
            <div className="auth-card">
                <Badge>CREAXA / INDEPENDENT MARKETPLACE</Badge>
                <h2>
                    {otpStep ? 'Verify your email.' : isSignUp ? 'Create your account.' : isForgot ? 'Reset your password.' : isVerify ? 'Verify your email.' : 'Welcome back.'}
                </h2>
                <p>
                    {otpStep
                        ? `We sent a secure 6-digit verification code to ${email || 'your email'}. Enter it below to complete registration.`
                        : isSignUp
                        ? 'Join as an AI creator, brand, or agency to begin collaborating.'
                        : isForgot
                        ? 'Enter your registered email to receive secure recovery instructions.'
                        : isVerify
                        ? 'Enter your 6-digit verification code below.'
                        : 'Sign in to your creative workspace.'}
                </p>

                {me?.account && (
                    <div style={{ marginBottom: 20 }}>
                        <Button href={dashboard(me.account.role)}>Open your workspace ({me.account.role})<ArrowUpRight size={18}/></Button>
                    </div>
                )}

                {!isVerify && !isForgot && !otpStep && (
                    <>
                        <div className="oauth-grid single">
                            <button className="oauth-btn google-btn full-width" type="button" onClick={handleGoogle} disabled={busy}>
                                <GoogleIcon />
                                <span>Continue with Google</span>
                            </button>
                        </div>
                        <div className="auth-divider">Or continue with email</div>
                    </>
                )}

                {!isSignUp && !isForgot && !isVerify && !otpStep && (
                    <div style={{
                        background: 'var(--panel)',
                        border: '1px solid var(--line)',
                        borderRadius: 8,
                        padding: '12px 14px',
                        marginBottom: 16
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span className="micro" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.75, fontWeight: 700 }}>
                                Demo Accounts
                            </span>
                            <span className="micro" style={{ color: 'var(--accent)', fontWeight: 600 }}>Password: <code>bytxl@123</code></span>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                className="button secondary"
                                style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6 }}
                                onClick={() => { setEmail('admin@mail.com'); setPassword('bytxl@123'); }}
                            >
                                🛡️ Admin
                            </button>
                            <button
                                type="button"
                                className="button secondary"
                                style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6 }}
                                onClick={() => { setEmail('creator@mail.com'); setPassword('bytxl@123'); }}
                            >
                                🎨 Creator
                            </button>
                            <button
                                type="button"
                                className="button secondary"
                                style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6 }}
                                onClick={() => { setEmail('bytxl@mail.com'); setPassword('bytxl@123'); }}
                            >
                                🏢 Brand
                            </button>
                        </div>
                    </div>
                )}

                {error && <ErrorBox message={error} />}
                {infoMsg && <div className="note"><CheckCircle2 size={18}/>{infoMsg}</div>}

                {otpStep ? (
                    <form className="auth-form" onSubmit={handleVerifyOtpAndComplete}>
                        <div className="field">
                            <label htmlFor="auth-otp">6-Digit Verification Code <span className="accent">*</span></label>
                            <input
                                id="auth-otp"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                required
                                value={otpCode}
                                onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                placeholder="••••••"
                                style={{
                                    fontFamily: 'ui-monospace, monospace',
                                    fontSize: 24,
                                    letterSpacing: '0.4em',
                                    textAlign: 'center',
                                    fontWeight: 700
                                }}
                                disabled={busy}
                                autoFocus
                            />
                            <p className="micro" style={{ marginTop: 8, textAlign: 'center' }}>
                                Valid for 5 minutes. Delivered by Resend.
                            </p>
                        </div>

                        <Button type="submit" disabled={busy || otpCode.length !== 6} className="full">
                            {busy ? (
                                <><Loader2 className="spin" size={17}/> Verifying…</>
                            ) : (
                                <>Verify & Complete Registration<Check size={17}/></>
                            )}
                        </Button>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                            <button
                                type="button"
                                className="button secondary"
                                style={{ fontSize: 12, padding: '6px 12px' }}
                                onClick={() => setOtpStep(false)}
                                disabled={busy}
                            >
                                ← Edit Email
                            </button>
                            <button
                                type="button"
                                className="button secondary"
                                style={{ fontSize: 12, padding: '6px 12px' }}
                                onClick={() => requestOtp('signup_email_verification')}
                                disabled={busy || otpCooldown > 0}
                            >
                                {otpCooldown > 0 ? `Resend code in ${otpCooldown}s` : 'Resend code'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="auth-form" onSubmit={handleEmailAuth}>
                        {isSignUp && (
                            <div className="field">
                                <label htmlFor="auth-name">Your Full Name <span className="accent">*</span></label>
                                <input
                                    id="auth-name"
                                    type="text"
                                    required
                                    value={displayName}
                                    onChange={e => setDisplayName(e.target.value)}
                                    placeholder="Jane Doe"
                                    disabled={busy}
                                />
                            </div>
                        )}
                        <div className="field">
                            <label htmlFor="auth-email">Email Address <span className="accent">*</span></label>
                            <input
                                id="auth-email"
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                disabled={busy}
                            />
                        </div>
                        {!isForgot && (
                            <div className="field">
                                <label htmlFor="auth-password">Password <span className="accent">*</span></label>
                                <div className="password-wrap">
                                    <input
                                        id="auth-password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        minLength={6}
                                        disabled={busy}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Eye size={16}/> : <Eye size={16} style={{ opacity: .5 }}/>}
                                    </button>
                                </div>
                                {!isSignUp && (
                                    <div className="auth-extra-links">
                                        <a href="/forgot-password">Forgot password?</a>
                                    </div>
                                )}
                            </div>
                        )}
                        {isSignUp && (
                            <>
                                <div className="field">
                                    <label htmlFor="auth-confirm">Confirm Password <span className="accent">*</span></label>
                                    <input
                                        id="auth-confirm"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        minLength={6}
                                        disabled={busy}
                                    />
                                </div>
                                <div style={{ margin: '10px 0' }}>
                                    <AnimatedCheckbox
                                        checked={terms}
                                        onChange={setTerms}
                                        label={<>I accept the <a href="/terms" target="_blank">Terms</a> and <a href="/privacy" target="_blank">Privacy Policy</a></>}
                                        ariaLabel="Accept terms and privacy policy"
                                    />
                                </div>
                            </>
                        )}
                        <Button type="submit" disabled={busy} className="full">
                            {busy ? (
                                <><Loader2 className="spin" size={17}/> Processing…</>
                            ) : isSignUp ? (
                                <>Continue with Email Verification<ArrowRight size={17}/></>
                            ) : isForgot ? (
                                <>Send Reset Instructions<Send size={17}/></>
                            ) : (
                                <>Sign In<ArrowRight size={17}/></>
                            )}
                        </Button>
                    </form>
                )}

                <div className="auth-switch">
                    {isSignUp ? (
                        <>Already have an account? <a href="/login">Sign in</a></>
                    ) : isForgot ? (
                        <>Remember your password? <a href="/login">Sign in</a></>
                    ) : (
                        <>Don’t have an account yet? <a href="/signup">Sign up</a></>
                    )}
                </div>

                <div className="auth-note">
                    <Shield size={16}/>
                    <span>End-to-end encrypted authentication. Your credentials are protected by Firebase.</span>
                </div>
            </div>
        </div>
    );
}
function Field({ field, value, set }: any) { const [name, label, type = 'text', options, required = false, help] = field; const id = 'f-' + name; return <div className={'field ' + (type === 'textarea' || type === 'tags' ? 'field-wide' : '')}>{type !== 'check' && <label htmlFor={id}>{label}{required && <span className="accent"> *</span>}</label>}{type === 'textarea' ? <textarea id={id} value={value || ''} onChange={e => set(name, e.target.value)} rows={4} required={required}/> : type === 'select' ? <AppSelect value={value ?? ''} onChange={v => set(name, v)} placeholder={'Select ' + label.toLowerCase()} options={(options || []).map((o: any) => typeof o === 'string' ? { value: o, label: o } : o)} ariaLabel={label}/> : type === 'check' ? <div style={{ padding: '4px 0' }}><AnimatedCheckbox checked={!!value} onChange={checked => set(name, checked)} label={help || label || 'Yes'} ariaLabel={label}/></div> : type === 'tags' ? <div className="pill-select">{options.map((o: string) => <button key={o} type="button" aria-pressed={list(value).includes(o)} className={list(value).includes(o) ? 'selected' : ''} onClick={() => set(name, list(value).includes(o) ? list(value).filter(s => s !== o) : [...list(value), o])}>{o}{list(value).includes(o) && <Check size={13}/>}</button>)}</div> : <input id={id} type={type === 'number' ? 'number' : type === 'date' ? 'date' : type === 'url' ? 'url' : type === 'email' ? 'email' : 'text'} min={type === 'number' ? 0 : type === 'date' ? new Date().toISOString().slice(0, 10) : undefined} value={value ?? ''} onChange={e => set(name, type === 'number' ? e.target.value : e.target.value)} required={required} maxLength={type === 'text' ? 200 : undefined}/>}{help && type !== 'check' && <p className="field-help">{help}</p>}</div>; }
function Fields({ fields, data, set }: any) { return <div className="form-grid">{fields.map((f: any) => <Field key={f[0]} field={f} value={data[f[0]]} set={set}/>)}</div>; }
function UploadField({ label, value, set, multiple = false, accept = 'image/jpeg,image/png,image/webp,video/mp4,application/pdf' }: any) {
    const [busy, setBusy] = useState(false), [err, setErr] = useState('');
    return <div className="field field-wide upload-field"><label>{label}</label><label className="upload-zone"><Upload size={22}/><strong>{busy ? 'Uploading…' : 'Choose ' + (multiple ? 'files' : 'a file')}</strong><span>JPG, PNG, WebP, MP4 or PDF · up to 25 MB each</span><input type="file" accept={accept} multiple={multiple} disabled={busy} aria-label={label} onChange={async (e) => {
            const files = Array.from(e.target.files || []);
            if (!files.length)
                return;
            setBusy(true);
            setErr('');
            try {
                const ids = [];
                for (const f of files) {
                    if (f.size > 25 * 1024 * 1024)
                        throw new Error('Maximum file size is 25 MB.');
                    const form = new FormData();
                    form.set('file', f);
                    const r = await api('upload', form);
                    ids.push(r.id);
                }
                set(multiple ? [...value || [], ...ids] : ids[0]);
            }
            catch (e: any) {
                setErr(e.message);
            }
            finally {
                setBusy(false);
                e.target.value = '';
            }
        }}/></label>{err && <ErrorBox message={err}/>}<div className="uploaded-files">{(multiple ? value || [] : value ? [value] : []).map((id: string, i: number) => <div key={id}><a href={'/api/files/' + id} target="_blank" rel="noopener noreferrer"><FileText size={15}/>Uploaded file {i + 1}</a><button type="button" className="icon-btn" aria-label="Remove attached file" onClick={() => set(multiple ? value.filter((s: string) => s !== id) : '')}><X size={15}/></button></div>)}</div></div>;
}
function Onboarding() {
    const { me, refreshMe, toast } = useApp();
    const [role, setRole] = useState(''), [data, setData] = useState<Obj>({ name: '', organization: '', industry: '', website: '', goals: '', terms: false }), [busy, setBusy] = useState(false), [error, setError] = useState('');
    useEffect(() => {
        if (me?.account) {
            setRole(me.account.role);
            setData(me.account.data);
        }
        else if (me?.user)
            setData(d => ({ ...d, name: me.user.fullName || '' }));
    }, [me]);
    if (me === null)
        return <Loading />;
    return <div className="page onboarding"><span className="eyebrow">A PLACE FOR YOUR PERSPECTIVE</span><h1>How do you<br /><em>create impact?</em></h1><p>Choose the workspace that fits your work.</p><div className="role-cards">{[['creator', Sparkles, 'I’m a creator', 'Share your work. Find your next collaboration.'], ['brand', Briefcase, 'I’m a brand', 'Bring a campaign. Find your creative partner.'], ['agency', Layers, 'I’m an agency', 'Manage client campaigns and creative delivery.']].map(([id, Icon, t, d]: any) => <button key={id} className={role === id ? 'selected' : ''} disabled={!!me?.account && me.account.role !== id} onClick={() => setRole(id)}><Icon size={30} strokeWidth={1}/><h3>{t}</h3><p>{d}</p>{role === id && <CheckCircle2 className="role-check" size={20}/>}</button>)}</div>{role && <form className="form-panel" onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setError('');
                try {
                    await api('account', { ...data, role });
                    refreshMe();
                    toast('Your workspace is ready.');
                    const next = new URLSearchParams(location.search).get('next') || '';
                    const permittedBase = dashboard(role);
                    location.href = next.startsWith(permittedBase + '/') && !next.includes('\\') ? next : role === 'creator' ? '/app/creator/profile' : '/app/brand';
                }
                catch (e: any) {
                    setError(e.message);
                }
                finally {
                    setBusy(false);
                }
            }}><Fields fields={role === 'creator' ? [['name', 'Your name', 'text', null, true]] : [['name', 'Your name', 'text', null, true], ['organization', role === 'agency' ? 'Agency name' : 'Brand / company name', 'text', null, true], ['industry', 'Industry', 'select', INDUSTRIES, true], ['website', 'Website', 'url'], ['contactEmail', 'Business contact email', 'email'], ['country', 'Country', 'text'], ['currency', 'Default currency', 'select', ['INR', 'USD', 'EUR']], ['description', 'Organization overview', 'textarea'], ['goals', 'What are you hoping to create?', 'textarea']]} data={data} set={(k: string, v: any) => setData({ ...data, [k]: v })}/><div style={{ margin: '14px 0' }}><AnimatedCheckbox checked={!!data.terms} onChange={checked => setData({ ...data, terms: checked })} label={<>I agree to the <a href="/terms" target="_blank">Terms</a> and <a href="/privacy" target="_blank">Privacy Policy</a>.</>} ariaLabel="Agree to Terms and Privacy Policy"/></div>{error && <ErrorBox message={error}/>}<Button disabled={busy}>{busy ? 'Setting things up…' : 'Create my workspace'}<ArrowRight size={18}/></Button></form>}</div>;
}
function AppShell({ path }: any) {
    const r = useResource('dashboard');
    const [menu, setMenu] = useState(false);
    const { me, refreshMe } = useApp();
    const [returnTo, setReturnTo] = useState(path);
    const [showContactModal, setShowContactModal] = useState(false);
    useEffect(() => setReturnTo(path + location.search), [path]);
    const data = r.data, role = data?.account?.role || 'creator', base = dashboard(role);
    const creator = role === 'creator';

    const hasVerifiedContactEmail = !!(
        data?.account?.data?.contactEmailVerified ||
        data?.account?.data?.verifiedContactEmail ||
        me?.account?.data?.contactEmailVerified
    );

    useEffect(() => {
        try {
            const dismissed = sessionStorage.getItem('creaxa_contact_email_dismissed') === '1';
            if (!hasVerifiedContactEmail && !dismissed && data?.account) {
                setShowContactModal(true);
            }
        } catch {}
    }, [hasVerifiedContactEmail, data?.account]);

    useEffect(() => {
        if (!data?.account?.id) return;
        let cleanup: (() => void) | null = null;
        import('../lib/supabase').then(({ subscribeToUserNotifications }) => {
            cleanup = subscribeToUserNotifications(data.account.id, () => {
                r.refresh();
            });
        }).catch(() => {});
        return () => { cleanup?.(); };
    }, [data?.account?.id]);
    if (r.loading)
        return <><Header path={path}/><Loading /></>;
    if (r.error)
        return <><Header path={path}/><div className="page"><ErrorBox message={r.error} retry={r.refresh}/></div></>;
    if (r.data.onboarding)
        return <><Header path={path}/><div className="page"><Empty title="Choose your creative workspace." description="Set up your account before publishing work or creating a campaign." action="Set up my account" href={'/onboarding?next=' + encodeURIComponent(returnTo)}/></div></>;
    const links = role === 'admin' ? [[Shield, 'Admin Console', '/admin'], [LayoutDashboard, 'Workspace Overview', base], [FileText, 'Campaigns', base + '/campaigns'], [Users, 'Discover creators', '/discover']] : creator ? [[LayoutDashboard, 'Overview', base], [Users, 'My profile', base + '/profile'], [FolderOpen, 'My portfolio', base + '/portfolio'], [Mail, 'Invitations', base + '/invitations'], [Briefcase, 'Projects', base + '/engagements'], [Shield, 'Verification', base + '/verification']] : [[LayoutDashboard, 'Overview', base], [FileText, 'Campaigns', base + '/campaigns'], [Users, 'Discover creators', '/discover'], [Heart, 'Saved creators', base + '/saved'], [Mail, 'Invitations', base + '/invitations'], [Briefcase, 'Projects', base + '/engagements']];
    const unread = data.notifications.filter((n: any) => !n.read).length;
    return <div className="app-layout"><ContactEmailModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} initialEmail={data?.account?.data?.contactEmail || data?.account?.email || ''} isDismissable={true} onVerified={() => { setShowContactModal(false); r.refresh(); refreshMe(); }} /><aside className={'app-sidebar ' + (menu ? 'open' : '')}><Logo /><span className="sidebar-label">{role === 'admin' ? 'PLATFORM ADMIN' : role === 'agency' ? 'AGENCY' : creator ? 'CREATOR' : 'BRAND'} WORKSPACE</span><nav aria-label="Workspace">{links.map(([Icon, label, href]: any) => <a key={href} className={path === href || (href !== base && path.startsWith(href)) ? 'active' : ''} href={href}><Icon size={19}/>{label}</a>)}<a className={path === '/app/notifications' ? 'active' : ''} href="/app/notifications"><Bell size={19}/>Notifications{unread > 0 && <span className="unread">{unread}</span>}</a><a className={path === '/app/settings' ? 'active' : ''} href="/app/settings"><Settings size={19}/>Settings</a></nav><div className="sidebar-bottom"><a href="/"><ArrowUpRight size={17}/>Back to CreaXa</a><div className="sidebar-account"><div className="avatar">{data.account.name.slice(0, 1)}</div><div><strong>{data.account.name}</strong><span>{role}</span></div><button aria-label="Sign out" className="icon-btn" onClick={async () => { try { const { getFirebaseAuth, signOut } = await import('../lib/firebase'); await signOut(getFirebaseAuth()); } catch {} try { await api('auth/signout', {}); } catch {} document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; document.cookie = 'firebase_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; document.cookie = '__sites_local_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; location.href = '/'; }}><LogOut size={17}/></button></div></div></aside><div className="app-content"><header className="app-header"><button className="icon-btn mobile-toggle" onClick={() => setMenu(!menu)} aria-label="Toggle workspace menu">{menu ? <X /> : <Menu />}</button><span>YOUR VISION, IN PROGRESS.</span><div><a href="/app/notifications" className="icon-btn" aria-label={`${unread} unread notifications`}><Bell size={18}/>{unread > 0 && <span className="notification-dot"/>}</a><a href="/app/settings" className="avatar small">{data.account.name.slice(0, 1)}</a></div></header><main id="main" className="workspace">{path.startsWith('/admin') ? <Admin /> : path === '/app/settings' ? <AccountSettings data={data} refresh={r.refresh}/> : path === '/app/notifications' ? <Notifications data={data} refresh={r.refresh}/> : path === base ? <Overview data={data} base={base}/> : path.endsWith('/saved') ? <SavedCreators /> : path.endsWith('/profile') && creator ? <ProfileEditor data={data} refresh={r.refresh}/> : path.includes('/portfolio') && creator ? <PortfolioManager data={data} refresh={r.refresh}/> : path.endsWith('/verification') && creator ? <Verification data={data} refresh={r.refresh}/> : path.endsWith('/invitations') ? <Invitations data={data} base={base} refresh={r.refresh}/> : path.includes('/engagements/') ? <Workspace id={path.split('/').pop()} base={base}/> : path.endsWith('/engagements') ? <Engagements data={data} base={base}/> : path.endsWith('/matches') ? <Matches id={path.split('/').slice(-2)[0]} base={base}/> : path.endsWith('/campaigns/new') ? <CampaignEditor data={data} base={base}/> : path.includes('/campaigns/') ? <CampaignDetail id={path.split('/').pop()} data={data} base={base}/> : path.endsWith('/campaigns') ? <Campaigns data={data} base={base}/> : <Empty title="Page not found." description="Return to your workspace to continue." action="Go to overview" href={base}/>}</main></div></div>;
}
function PageTitle({ eyebrow, title, description, action }: any) { return <div className="workspace-title"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>; }
function Overview({ data, base }: any) { const creator = data.account.role === 'creator'; const active = data.engagements.filter((p: any) => !['completed', 'cancelled'].includes(p.status)); const pending = data.invitations.filter((p: any) => p.status === 'pending' && new Date(p.data.responseDeadline + 'T23:59:59Z') > new Date()); return <><PageTitle eyebrow="YOUR CREATIVE WORKSPACE" title={'Hello, ' + data.account.name.split(' ')[0] + '.'} description={creator ? 'Your work deserves to be seen. Keep your creative momentum going.' : 'Your next great campaign starts with a clear vision.'} action={<Button href={creator ? base + '/portfolio' : base + '/campaigns/new'}><Plus size={17}/>{creator ? 'Add portfolio work' : 'New campaign'}</Button>}/><div className="stat-grid">{[[creator ? 'Published projects' : 'Campaigns', creator ? data.portfolios.filter((p: any) => p.published).length : data.campaigns.length], [creator ? 'Pending invitations' : 'Invitations sent', creator ? pending.length : data.invitations.length], ['Active projects', active.length], ['Completed projects', data.engagements.filter((p: any) => p.status === 'completed').length]].map(([label, n]) => <article key={label}><span>{label}</span><strong>{n}</strong><ArrowUpRight size={18}/></article>)}</div>{creator && !data.profile?.published && <div className="workspace-banner"><Orbit size={40} strokeWidth={1}/><div><h3>Make your creative capabilities discoverable.</h3><p>Add your real tools, formats and process, then publish your profile.</p></div><Button href={base + '/profile'}>Complete your profile<ArrowRight size={17}/></Button></div>}{creator && <ProfileChecklist profile={data.profile} projects={data.portfolios} base={base}/>}<div className="dashboard-grid"><section className="panel"><div className="panel-heading"><h3>Active projects</h3><a href={base + '/engagements'}>View all<ArrowUpRight size={14}/></a></div>{active.length ? active.slice(0, 5).map((e: any) => <a className="list-row" key={e.id} href={base + '/engagements/' + e.id}><div><strong>{e.data.title}</strong><p>Due {date(e.data.deadline)}</p></div><Badge>{e.status}</Badge><ArrowUpRight size={17}/></a>) : <Empty icon={Briefcase} title="A clear canvas." description="Accepted campaign invitations become projects here."/>}</section><section className="panel"><div className="panel-heading"><h3>Latest activity</h3><a href="/app/notifications">View all<ArrowUpRight size={14}/></a></div>{data.notifications.length ? data.notifications.slice(0, 5).map((n: any) => <a className="list-row" key={n.id} href={n.href}><Bell size={16}/><div><strong>{n.title}</strong><p>{date(n.created)}</p></div></a>) : <Empty icon={Bell} title="You’re all caught up." description="Invitations, submissions and project updates will appear here."/>}</section></div><div className="workspace-callout"><span className="eyebrow">CREATE WITH INTENTION</span><h2>{creator ? 'Your process is part of your portfolio.' : 'A thoughtful brief is a creative advantage.'}</h2><p>{creator ? 'Show what you made, how you made it, and what you contributed.' : 'Define deliverables, rights and expectations before the first frame.'}</p><a className="text-link" href={creator ? base + '/portfolio' : base + '/campaigns/new'}>{creator ? 'Build your portfolio' : 'Create a campaign'}<ArrowUpRight size={18}/></a></div></>; }
const PROFILE_STEPS = [{ title: 'The basics', fields: [['name', 'Display name', 'text', null, true], ['slug', 'Profile URL name', 'text', null, true, 'Lowercase letters, numbers and single hyphens.'], ['headline', 'Professional headline', 'text', null, true], ['location', 'Location', 'text'], ['contactPreference', 'Contact preference', 'select', ['Platform messages', 'Email by agreement', 'Website contact']], ['bio', 'About you', 'textarea', null, true], ['website', 'Website / social link', 'url']] }, { title: 'Specializations', fields: [['specializations', 'Your specializations', 'tags', SPECIAL], ['styles', 'Creative styles', 'tags', STYLES], ['industries', 'Industry experience', 'tags', INDUSTRIES]] }, { title: 'Tools & models', fields: [['tools', 'Your creative toolkit', 'tags', TOOLS], ['experience', 'Tool experience & usage', 'textarea', null, false, 'Include experience levels, how you use each tool, and relevant evidence links. These are self-declared.']] }, { title: 'Formats & workflow', fields: [['contentTypes', 'Supported content', 'tags', TYPES], ['aspectRatios', 'Aspect ratios', 'tags', RATIOS], ['platforms', 'Platforms', 'tags', PLATFORMS], ['formats', 'Output file formats (comma separated)', 'text'], ['maxDuration', 'Maximum video duration (seconds)', 'number'], ['workflow', 'Your creative workflow', 'textarea']] }, { title: 'Rates & availability', fields: [['rate', 'Starting project rate', 'number', null, true], ['maxRate', 'Preferred maximum budget', 'number'], ['currency', 'Currency', 'select', ['INR', 'USD', 'EUR'], true], ['turnaround', 'Typical turnaround (days)', 'number'], ['availability', 'Availability', 'select', ['Available', 'Busy', 'Not accepting work'], true], ['revisions', 'Included revision rounds', 'number'], ['commercial', 'Commercial projects', 'check', null, false, 'I accept commercial-use work subject to agreed rights.']] }, { title: 'Review & publish', fields: [] }];
function ProfileEditor({ data: initial, refresh }: any) {
    const { toast } = useApp();
    const [data, setData] = useState<Obj>(initial.profile?.data || { name: initial.account.name, slug: '', headline: '', bio: '', rate: 0, currency: 'INR', turnaround: 0, availability: 'Available', commercial: false, revisions: 0, published: false }), [step, setStep] = useState(0), [busy, setBusy] = useState(false), [error, setError] = useState('');
    const set = (k: string, v: any) => setData(d => ({ ...d, [k]: v }));
    const save = async (publish: boolean, next = false) => {
        setBusy(true);
        setError('');
        try {
            await api('profile', { ...data, published: publish });
            set('published', publish);
            toast(publish ? 'Your creator profile is published.' : 'Profile saved.');
            refresh();
            if (next)
                setStep(s => Math.min(s + 1, 5));
        }
        catch (e: any) {
            setError(e.message);
        }
        finally {
            setBusy(false);
        }
    };
    return <><PageTitle eyebrow="YOUR CREATIVE IDENTITY" title="Make your perspective visible." description="Real capabilities. Your original work. A process worth knowing." action={initial.profile?.published && <Button secondary href={'/creators/' + initial.profile.slug}>View public profile<Eye size={17}/></Button>}/><div className="wizard-layout"><StepNav steps={PROFILE_STEPS} step={step} setStep={setStep}/><div className="form-panel"><span className="eyebrow">STEP {step + 1} OF 6</span><h2>{PROFILE_STEPS[step].title}</h2><Fields fields={PROFILE_STEPS[step].fields} data={data} set={set}/>{step === 0 && <><UploadField label="Profile image" value={data.avatar} set={(v: any) => set('avatar', v)} accept="image/jpeg,image/png,image/webp"/><UploadField label="Cover image" value={data.cover} set={(v: any) => set('cover', v)} accept="image/jpeg,image/png,image/webp"/></>}{step === 5 && <><Review data={data} keys={['name', 'slug', 'headline', 'bio', 'specializations', 'tools', 'contentTypes', 'aspectRatios', 'rate', 'currency', 'turnaround', 'availability', 'commercial']}/><div className="note">Portfolio projects are managed separately. Add original work with workflow and rights details from My Portfolio.</div></>}{error && <ErrorBox message={error}/>}<div className="form-actions">{step > 0 && <Button secondary onClick={() => setStep(step - 1)}><ArrowLeft size={16}/>Back</Button>}<Button secondary disabled={busy} onClick={() => save(data.published)}>Save {data.published ? 'profile' : 'draft'}</Button>{step < 5 ? <Button disabled={busy} onClick={() => save(data.published, true)}>Save & continue<ArrowRight size={16}/></Button> : <Button disabled={busy} onClick={() => save(true)}>Publish profile<ArrowUpRight size={17}/></Button>}</div>{data.published && <button className="danger-text" disabled={busy} onClick={() => save(false)}>Unpublish profile</button>}</div></div></>;
}
function StepNav({ steps, step, setStep }: any) { return <ol className="steps">{steps.map((s: any, i: number) => <li key={s.title}><button className={i === step ? 'active' : ''} onClick={() => setStep(i)}><span>{i < step ? <Check size={14}/> : String(i + 1).padStart(2, '0')}</span>{s.title}</button></li>)}</ol>; }
function Review({ data, keys }: any) { return <dl className="review">{keys.map((k: string) => <div key={k}><dt>{k.replace(/([A-Z])/g, ' $1')}</dt><dd>{typeof data[k] === 'boolean' ? (data[k] ? 'Yes' : 'No') : Array.isArray(data[k]) ? data[k].join(', ') || 'Not provided' : String(data[k] ?? '') || 'Not provided'}</dd></div>)}</dl>; }
const PORTFOLIO_FIELDS = [['title', 'Project title', 'text', null, true], ['contentType', 'Content type', 'select', TYPES, true], ['description', 'Project brief & description', 'textarea', null, true], ['tools', 'AI tools used', 'tags', TOOLS], ['skills', 'Skills demonstrated (comma separated)', 'text', null, true], ['styles', 'Creative style', 'tags', STYLES], ['workflow', 'Workflow details', 'textarea', null, true], ['contribution', 'Your contribution', 'textarea', null, true], ['aspectRatio', 'Aspect ratio', 'select', RATIOS, true], ['resolution', 'Resolution', 'text'], ['duration', 'Duration (seconds)', 'number'], ['industry', 'Industry', 'select', INDUSTRIES], ['commercialUse', 'Commercial-use declaration', 'textarea', null, true, 'Describe permissions, tool/model conditions and any third-party assets.'], ['externalLink', 'External project link', 'url'], ['permission', 'Portfolio display permission', 'check', null, true, 'I have permission to display these assets and describe my contribution.']];
function PortfolioManager({ data, refresh }: any) {
    const [editing, setEditing] = useState<Obj | null>(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
    const { toast } = useApp();
    const save = async (published: boolean) => {
        setBusy(true);
        setError('');
        try {
            await api('portfolio', { ...editing, published });
            toast(published ? 'Project published.' : 'Project saved.');
            setEditing(null);
            refresh();
        }
        catch (e: any) {
            setError(e.message);
        }
        finally {
            setBusy(false);
        }
    };
    return <><PageTitle eyebrow="YOUR ORIGINAL WORK" title="A portfolio with perspective." description="Show the creative result and the process behind it." action={!editing && <Button onClick={() => { setError(''); setEditing({ title: '', contentType: '', description: '', workflow: '', contribution: '', aspectRatio: '', commercialUse: '', permission: false, cover: '', media: [], evidence: [], published: false }); }}><Plus size={17}/>Add project</Button>}/>{editing ? <div className="form-panel"><div className="panel-heading"><h2>{editing.id ? 'Edit project' : 'New portfolio project'}</h2><button className="icon-btn" aria-label="Close editor" onClick={() => setEditing(null)}><X /></button></div><Fields fields={PORTFOLIO_FIELDS} data={editing} set={(k: string, v: any) => setEditing({ ...editing, [k]: v })}/><UploadField label="Cover image (required)" value={editing.cover} set={(v: any) => setEditing({ ...editing, cover: v })} accept="image/jpeg,image/png,image/webp"/><UploadField label="Project media (required)" value={editing.media} multiple set={(v: any) => setEditing({ ...editing, media: v })} accept="image/jpeg,image/png,image/webp,video/mp4"/><UploadField label="Supporting evidence (private)" value={editing.evidence} multiple set={(v: any) => setEditing({ ...editing, evidence: v })}/>{error && <ErrorBox message={error}/>}<div className="form-actions"><Button secondary disabled={busy} onClick={() => save(false)}>Save unpublished</Button><Button disabled={busy} onClick={() => save(true)}>Publish project<ArrowUpRight size={17}/></Button></div></div> : data.portfolios.length ? <div className="portfolio-grid">{data.portfolios.map((p: any) => <article className="portfolio-card" key={p.id}><img src={'/api/files/' + p.data.cover} alt={p.data.title}/><div><Badge>{p.published ? 'Published' : 'Unpublished'}</Badge><h3>{p.data.title}</h3><p>{p.data.contentType} · {p.data.aspectRatio}</p><div className="card-controls"><button onClick={() => { setError(''); setEditing({ ...p.data, id: p.id }); }}>Edit</button>{p.published && <a href={'/projects/' + p.slug}>View<ArrowUpRight size={14}/></a>}<button className="danger-text" onClick={async () => {
                    if (!confirm('Delete this project and its unreferenced media?'))
                        return;
                    try {
                        await api('portfolio/' + p.id, undefined, 'DELETE');
                        refresh();
                        toast('Project deleted.');
                    }
                    catch (e: any) {
                        toast(e.message);
                    }
                }}>Delete<Trash2 size={14}/></button></div></div></article>)}</div> : <Empty icon={FolderOpen} title="Your work belongs here." description="Add your first project with real media, tools, workflow and commercial-use details."/>}</>;
}
const CAMPAIGN_STEPS = [{ title: 'Campaign identity', fields: [['title', 'Campaign title', 'text', null, true], ['industry', 'Industry', 'select', INDUSTRIES, true], ['description', 'Creative brief', 'textarea', null, true], ['goal', 'Campaign goal', 'text'], ['client', 'Client organization (agencies)', 'text'], ['audience', 'Target audience', 'text'], ['references', 'Reference links & direction', 'textarea']] }, { title: 'Creative requirements', fields: [['contentType', 'Content type', 'select', TYPES, true], ['styles', 'Creative styles', 'tags', STYLES], ['specializations', 'Preferred specialization', 'tags', SPECIAL], ['platform', 'Primary platform', 'select', PLATFORMS, true], ['aspectRatio', 'Aspect ratio', 'select', RATIOS, true], ['resolution', 'Resolution', 'text'], ['duration', 'Duration (seconds)', 'number'], ['quantity', 'Number of deliverables', 'number', null, true], ['language', 'Language', 'text'], ['tools', 'Preferred AI tools', 'tags', TOOLS], ['format', 'Deliverable file format', 'text']] }, { title: 'Budget & timeline', fields: [['budget', 'Project budget', 'number', null, true], ['currency', 'Currency', 'select', ['INR', 'USD', 'EUR'], true], ['deadline', 'Delivery deadline', 'date', null, true], ['revisions', 'Included revision rounds', 'number', null, true], ['availability', 'Creator availability', 'select', ['Available', 'Flexible']], ['reviewTime', 'Expected review turnaround', 'text'], ['milestones', 'Milestone dates & scope', 'textarea']] }, { title: 'Usage & rights', fields: [['commercialUse', 'Intended use', 'select', ['Paid advertising', 'Organic social', 'Website / editorial', 'Personal'], true], ['channels', 'Distribution channels', 'tags', PLATFORMS], ['territory', 'Usage territory', 'text', null, true], ['usageDuration', 'Usage duration', 'text', null, true], ['rights', 'Rights requested', 'select', ['Negotiated license', 'Ownership transfer as agreed', 'To be negotiated'], true], ['thirdParty', 'Third-party assets policy', 'textarea'], ['attribution', 'Attribution', 'select', ['Required', 'Not required', 'Negotiable']], ['exclusivity', 'Exclusivity requested', 'check'], ['confidentiality', 'Confidentiality / NDA requested', 'check']] }, { title: 'Review & publish', fields: [] }];
function CampaignEditor({ data, base, existing }: any) {
    const { toast, me } = useApp();
    const [form, setForm] = useState<Obj>(existing ? { ...existing.data, id: existing.id } : { title: '', description: '', industry: '', contentType: '', platform: '', aspectRatio: '', quantity: 1, budget: 0, currency: 'INR', deadline: '', revisions: 1, commercialUse: '', status: 'draft', assets: [] }), [step, setStep] = useState(0), [busy, setBusy] = useState(false), [error, setError] = useState(''), [idea, setIdea] = useState(''), [ai, setAi] = useState<any>(null), [aiBusy, setAiBusy] = useState(false), [showAi, setShowAi] = useState(false);
    useEffect(() => { if (existing)
        return; const id = new URLSearchParams(location.search).get('recipe'); const recipe = RECIPES.find(r => r.id === id); if (recipe)
        setForm(f => ({ ...f, ...recipe.fields })); }, [existing]);
    const set = (k: string, v: any) => setForm(d => ({ ...d, [k]: v }));
    const save = async (status: string, next = false) => {
        setBusy(true);
        setError('');
        try {
            const r = await api('campaign', { ...form, status });
            setForm(f => ({ ...f, id: r.id, status }));
            if (status === 'draft')
                history.replaceState(null, '', base + '/campaigns/' + r.id);
            toast(status === 'published' ? 'Campaign published.' : 'Campaign saved.');
            if (status === 'published')
                location.href = base + '/campaigns/' + r.id;
            else if (next)
                setStep(s => Math.min(4, s + 1));
        }
        catch (e: any) {
            setError(e.message);
        }
        finally {
            setBusy(false);
        }
    };
    return <><PageTitle eyebrow="BRING YOUR VISION INTO FOCUS" title={existing ? 'Refine your campaign.' : 'A new creative beginning.'} description="A strong brief brings the right people and expectations together." action={<Button secondary onClick={() => setShowAi(!showAi)}><Sparkles size={17}/>AI brief assistant</Button>}/>{showAi && <section className="form-panel ai-panel"><div className="panel-heading"><h3>From rough idea to clear direction</h3><button className="icon-btn" onClick={() => setShowAi(false)} aria-label="Close assistant"><X size={18}/></button></div>{!me?.aiAvailable ? <div className="note">AI assistance is not configured yet. Continue with the complete manual builder below.</div> : <><label htmlFor="idea">Describe your campaign idea</label><textarea id="idea" rows={4} value={idea} onChange={e => setIdea(e.target.value)}/><Button disabled={aiBusy || idea.length < 20} onClick={async () => {
                    setAiBusy(true);
                    setError('');
                    try {
                        setAi(await api('ai', { idea }));
                    }
                    catch (e: any) {
                        setError(e.message);
                    }
                    finally {
                        setAiBusy(false);
                    }
                }}>{aiBusy ? 'Structuring your brief…' : 'Structure my idea'}<Sparkles size={16}/></Button>{ai && <><h4>Extracted from your idea</h4><Review data={ai.extracted} keys={Object.keys(ai.extracted)}/><h4>Suggested details</h4><Review data={ai.suggested} keys={Object.keys(ai.suggested)}/><p>Still needed: {ai.missing_fields.join(', ')}</p><Button secondary onClick={() => { const allowed = new Set(CAMPAIGN_STEPS.flatMap(s => s.fields.map(f => f[0]))); const picked = Object.fromEntries(Object.entries({ ...ai.suggested, ...ai.extracted }).filter(([k, v]) => allowed.has(k) && v !== null && (typeof v === 'string' || typeof v === 'number' || Array.isArray(v)))); setForm(f => ({ ...f, ...picked })); setShowAi(false); toast('Suggestions added. Review every field before publishing.'); }}>Apply & review<Check size={17}/></Button></>}</>}</section>}<div className="wizard-layout"><StepNav steps={CAMPAIGN_STEPS} step={step} setStep={setStep}/><div className="form-panel"><span className="eyebrow">STEP {step + 1} OF 5</span><h2>{CAMPAIGN_STEPS[step].title}</h2><Fields fields={CAMPAIGN_STEPS[step].fields} data={form} set={set}/>{step === 1 && <UploadField label="Reference assets (private to your project)" value={form.assets} multiple set={(v: any) => set('assets', v)}/>}{step === 3 && <div className="note"><Shield size={18}/>Usage requirements are negotiated with your creator. AI tool terms and third-party permissions are separate.</div>}{step === 4 && <Review data={form} keys={['title', 'description', 'industry', 'contentType', 'styles', 'platform', 'aspectRatio', 'resolution', 'duration', 'quantity', 'language', 'tools', 'format', 'budget', 'currency', 'deadline', 'revisions', 'commercialUse', 'territory', 'usageDuration', 'rights', 'exclusivity', 'confidentiality']}/>}{error && <ErrorBox message={error}/>}<div className="form-actions">{step > 0 && <Button secondary onClick={() => setStep(step - 1)}><ArrowLeft size={15}/>Back</Button>}<Button secondary disabled={busy} onClick={() => save('draft')}>Save draft</Button>{step < 4 ? <Button disabled={busy} onClick={() => save('draft', true)}>Save & continue<ArrowRight size={16}/></Button> : <Button disabled={busy} onClick={() => save('published')}>Publish brief<ArrowUpRight size={17}/></Button>}</div><p className="micro">Drafts are saved to your account when you select Save. Your last saved version is available after refreshing.</p></div></div></>;
}
function Campaigns({ data, base }: any) { return <><PageTitle eyebrow="IDEAS WITH INTENTION" title="Your campaigns." description="From first direction to the final frame." action={<Button href={base + '/campaigns/new'}><Plus size={17}/>New campaign</Button>}/>{data.campaigns.length ? <div className="campaign-grid">{data.campaigns.map((c: any) => <a className="campaign-card" key={c.id} href={base + '/campaigns/' + c.id}><div><Badge>{c.status}</Badge><ArrowUpRight size={21}/></div><h3>{c.data.title || 'Untitled campaign'}</h3><p>{c.data.description || 'Your saved brief is ready to develop.'}</p><div className="tags">{c.data.contentType && <Badge>{c.data.contentType}</Badge>}{c.data.aspectRatio && <Badge>{c.data.aspectRatio}</Badge>}</div><footer><strong>{money(c.data.budget, c.data.currency)}</strong><span>Due {date(c.data.deadline)}</span></footer></a>)}</div> : <Empty icon={FileText} title="Every great campaign starts somewhere." description="Define your idea, creative format, budget and rights to find the right creative partner." action="Create your first campaign" href={base + '/campaigns/new'}/>}</>; }
function CampaignDetail({ id, data, base }: any) {
    const c = data.campaigns.find((c: any) => c.id === id);
    const [editing, setEditing] = useState(false);
    const { toast } = useApp();
    if (!c)
        return <Empty title="Campaign not found." description="This campaign may not belong to your account." action="View campaigns" href={base + '/campaigns'}/>;
    if (editing)
        return <CampaignEditor data={data} base={base} existing={c}/>;
    return <><a className="back-link" href={base + '/campaigns'}><ArrowLeft size={16}/>All campaigns</a><PageTitle eyebrow={c.status.toUpperCase() + ' / CAMPAIGN'} title={c.data.title || 'Untitled campaign'} description={c.data.description} action={<div className="inline-actions"><Button secondary onClick={() => setEditing(true)}>Edit brief</Button><Button href={base + '/campaigns/' + id + '/matches'}>Find matching creators<ArrowUpRight size={17}/></Button></div>}/><CampaignTools campaign={c} base={base}/><div className="form-panel"><Review data={c.data} keys={['industry', 'goal', 'audience', 'contentType', 'styles', 'platform', 'aspectRatio', 'resolution', 'duration', 'quantity', 'language', 'tools', 'format', 'budget', 'currency', 'deadline', 'revisions', 'commercialUse', 'territory', 'usageDuration', 'rights', 'exclusivity', 'confidentiality', 'attribution', 'thirdParty']}/>{c.data.assets?.length > 0 && <><h3>Reference assets</h3><div className="file-list">{c.data.assets.map((f: string) => <a className="file-link" key={f} href={'/api/files/' + f} target="_blank" rel="noopener noreferrer"><Download size={15}/>Open asset</a>)}</div></>}<div className="form-actions">{['published', 'draft'].includes(c.status) && <Button secondary onClick={async () => {
                try {
                    await api('campaign', { ...c.data, id: c.id, status: 'closed' });
                    location.reload();
                }
                catch (e: any) {
                    toast(e.message);
                }
            }}>Close campaign</Button>}{c.status !== 'archived' && <Button secondary onClick={async () => {
                try {
                    await api('campaign', { ...c.data, id: c.id, status: 'archived' });
                    location.reload();
                }
                catch (e: any) {
                    toast(e.message);
                }
            }}>Archive campaign</Button>}</div></div></>;
}
function Matches({ id, base }: any) {
    const r = useResource('matches/' + id);
    if (r.loading)
        return <Loading />;
    if (r.error)
        return <ErrorBox message={r.error} retry={r.refresh}/>;
    return <><a className="back-link" href={base + '/campaigns/' + id}><ArrowLeft size={16}/>Campaign details</a><PageTitle eyebrow="CAPABILITIES MEET YOUR BRIEF" title="Your creative connections." description={r.data.campaign.data.title}/><div className="note">Compatibility uses styles and specialization (30), tools (20), format (20), industry (15), and budget and availability (15). Required format, commercial-use and budget constraints determine eligibility. Scores are not success probabilities.</div>{r.data.matches.length ? <div className="creator-grid">{r.data.matches.map((p: any) => <div key={p.id}><CreatorCard p={p} match={p.match}/><Button className="full" href={base + '/invitations?creator=' + encodeURIComponent(p.id) + '&campaign=' + id}>Invite creator<ArrowUpRight size={16}/></Button></div>)}</div> : <Empty icon={Users} title="No eligible creators yet." description="Try a broader brief or check again when creators publish profiles matching your required formats, availability and budget." action="Browse all creators" href="/discover"/>}</>;
}
function Invitations({ data, base, refresh }: any) {
    const creator = data.account.role === 'creator';
    const [creating, setCreating] = useState(false), [form, setForm] = useState<Obj>({ campaign: '', creator: '', budget: 0, message: '', start: '', responseDeadline: '', rights: '', revisions: 1 }), [busy, setBusy] = useState(false), [error, setError] = useState('');
    const cr = useResource('creators');
    const { toast } = useApp();
    useEffect(() => {
        const q = new URLSearchParams(location.search);
        if (q.get('creator') && !creator) {
            setForm(f => ({ ...f, creator: q.get('creator'), campaign: q.get('campaign') || '' }));
            setCreating(true);
        }
    }, [creator]);
    const update = (k: string, v: any) => {
        if (k === 'campaign') {
            const c = data.campaigns.find((c: any) => c.id === v);
            setForm(f => ({ ...f, campaign: v, budget: c?.data.budget || 0, rights: c?.data.rights || '', revisions: c?.data.revisions || 0 }));
        }
        else
            setForm(f => ({ ...f, [k]: v }));
    };
    return <><PageTitle eyebrow="A NEW COLLABORATION" title={creator ? 'Your invitations.' : 'Make a creative connection.'} description={creator ? 'Review the brief, budget, scope and rights before accepting.' : 'Invite a creator to a published campaign with clear expectations.'} action={!creator && !creating && <Button onClick={() => setCreating(true)}><Plus size={17}/>New invitation</Button>}/>{creating && <form className="form-panel" onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setError('');
                try {
                    await api('invitation', form);
                    setCreating(false);
                    refresh();
                    toast('Invitation sent.');
                }
                catch (e: any) {
                    setError(e.message);
                }
                finally {
                    setBusy(false);
                }
            }}><div className="panel-heading"><h2>Invite your creative partner</h2><button type="button" className="icon-btn" aria-label="Close invitation" onClick={() => setCreating(false)}><X /></button></div><div className="form-grid"><div className="field"><label>Published campaign *</label><AppSelect value={form.campaign} onChange={v => update('campaign', v)} placeholder="Choose a campaign" options={data.campaigns.filter((c: any) => c.status === 'published').map((c: any) => ({ value: c.id, label: c.data.title }))} ariaLabel="Published campaign"/></div><div className="field"><label>Creator *</label><AppSelect value={form.creator} onChange={v => update('creator', v)} placeholder="Choose a published creator" options={(cr.data || []).map((p: any) => ({ value: p.id, label: p.data.name + ' · ' + p.data.headline }))} ariaLabel="Creator"/></div></div>{cr.error && <ErrorBox message={cr.error} retry={cr.refresh}/>}<Fields fields={[["budget", "Proposed budget", "number", null, true], ["start", "Preferred start date", "date", null, true], ["responseDeadline", "Response deadline", "date", null, true], ["revisions", "Proposed revision rounds", "number", null, true], ["rights", "Proposed rights terms", "textarea", null, true], ["message", "Your invitation message", "textarea", null, true]]} data={form} set={update}/>{error && <ErrorBox message={error}/>}<Button disabled={busy}>{busy ? 'Sending invitation…' : 'Send invitation'}<Send size={17}/></Button></form>}{data.invitations.length ? <div className="invitation-list">{data.invitations.map((i: any) => {
                const c = JSON.parse(i.campaign_data || '{}'), p = JSON.parse(i.creator_data || '{}'), expired = i.status === 'pending' && new Date(i.data.responseDeadline + 'T23:59:59Z').getTime() < Date.now();
                return <article className="panel invitation" key={i.id}><div className="panel-heading"><div><Badge>{expired ? 'expired' : i.status}</Badge><h3>{c.title}</h3>{!creator && <p>To {p.name || 'Creator'}</p>}</div><strong>{money(i.data.budget, c.currency)}</strong></div><p className="preserve">{i.data.message}</p><div className="invitation-facts"><span><Clock size={15}/>Respond by {date(i.data.responseDeadline)}</span><span>{i.data.revisions} revision rounds</span><span>Start {date(i.data.start)}</span></div><details><summary>Scope & rights<ChevronDown size={15}/></summary><Review data={{ ...c, ...i.data }} keys={['description', 'contentType', 'platform', 'aspectRatio', 'duration', 'quantity', 'deadline', 'commercialUse', 'territory', 'usageDuration', 'rights']}/></details>{i.status === 'pending' && !expired && <div className="form-actions">{(creator ? ['accept', 'decline'] : ['withdraw']).map(action => <Button key={action} secondary={action !== 'accept'} disabled={busy} onClick={async () => {
                                if (!confirm(action === 'accept' ? 'Accept this scope, budget and rights agreement?' : action + ' this invitation?'))
                                    return;
                                setBusy(true);
                                try {
                                    await api('invitation/' + i.id, { action });
                                    refresh();
                                    toast('Invitation ' + (action === 'accept' ? 'accepted' : action === 'decline' ? 'declined' : 'withdrawn') + '.');
                                }
                                catch (e: any) {
                                    toast(e.message);
                                }
                                finally {
                                    setBusy(false);
                                }
                            }}>{action === 'accept' ? 'Accept & start project' : action === 'decline' ? 'Decline' : 'Withdraw invitation'}{action === 'accept' && <ArrowUpRight size={16}/>}</Button>)}</div>}{i.status === 'accepted' && <a className="text-link" href={base + '/engagements'}>Open your projects<ArrowRight size={16}/></a>}</article>;
            })}</div> : <Empty icon={Mail} title="A new connection is a brief away." description={creator ? 'Invitations from brands and agencies will appear here. Publish a complete profile so your skills can be discovered.' : 'Create a campaign, find a creator, and send a thoughtful invitation.'} action={!creator ? 'Create a campaign' : undefined} href={base + '/campaigns/new'}/>}</>;
}
function Engagements({ data, base }: any) { return <><PageTitle eyebrow="MAKE SOMETHING TOGETHER" title="Your projects." description="Messages, revisions, approvals and delivery, all in one place."/>{data.engagements.length ? <div className="campaign-grid">{data.engagements.map((e: any) => <a className="campaign-card" key={e.id} href={base + '/engagements/' + e.id}><div><Badge>{e.status}</Badge><ArrowUpRight size={20}/></div><h3>{e.data.title}</h3><p>{e.data.message}</p><footer><strong>{money(e.data.budget, e.data.currency)}</strong><span>Due {date(e.data.deadline)}</span></footer></a>)}</div> : <Empty icon={Briefcase} title="Your next collaboration will live here." description="A project workspace opens when a creator accepts an invitation." action="View invitations" href={base + '/invitations'}/>}</>; }
function Workspace({ id, base }: any) {
    const r = useResource('workspace/' + id);
    const [message, setMessage] = useState(''), [deliverable, setDeliverable] = useState(''), [files, setFiles] = useState<string[]>([]), [busy, setBusy] = useState(false), [error, setError] = useState('');
    const { toast } = useApp();
    useEffect(() => {
        let cleanup: (() => void) | null = null;
        import('../lib/supabase').then(({ subscribeToWorkspaceEvents }) => {
            cleanup = subscribeToWorkspaceEvents(id, () => {
                r.refresh();
            });
        }).catch(() => {});
        return () => { cleanup?.(); };
    }, [id]);
    if (r.loading && !r.data)
        return <Loading />;
    if (r.error)
        return <ErrorBox message={r.error} retry={r.refresh}/>;
    const e = r.data.engagement, creator = e.creator === r.data.viewer, events = r.data.events;
    const submits = events.filter((ev: any) => ev.type === 'submit'), latest = submits[submits.length - 1];
    const cancellation = events.filter((ev: any) => ev.type === 'request_cancel').at(-1);
    const actions = e.status === 'cancellation requested' ? ['resume', ...(cancellation?.author !== r.data.viewer ? ['confirm_cancel'] : [])] : creator ? (e.status === 'accepted' ? ['start'] : ['in progress', 'changes requested'].includes(e.status) ? ['submit'] : e.status === 'approved' ? ['deliver'] : []) : ['submitted', 'resubmitted'].includes(e.status) ? ['approve', ...(e.revisions < e.data.revisions ? ['revise'] : [])] : e.status === 'delivered' ? ['complete'] : [];
    const act = async (action: string) => {
        if (['approve', 'deliver', 'complete', 'request_cancel', 'confirm_cancel'].includes(action) && !confirm(action === 'approve' ? 'Approve the latest submitted version?' : action === 'deliver' ? 'Deliver the approved files under the agreed scope and rights?' : action === 'request_cancel' ? 'Request cancellation? Your partner must confirm.' : action === 'confirm_cancel' ? 'Confirm cancellation of this project?' : 'Mark this project completed? This records delivery, not payment settlement.'))
            return;
        setBusy(true);
        setError('');
        try {
            await api('workspace/' + id, { action, message, files, deliverable });
            setMessage('');
            setDeliverable('');
            setFiles([]);
            r.refresh();
            toast('Project updated.');
        }
        catch (e: any) {
            setError(e.message);
        }
        finally {
            setBusy(false);
        }
    };
    const labels: Obj = { start: 'Start production', submit: submits.length ? 'Submit revised version' : 'Submit deliverables', approve: 'Approve latest version', revise: 'Request changes', deliver: 'Deliver approved files', complete: 'Complete project', request_cancel: 'Request cancellation', confirm_cancel: 'Confirm cancellation', resume: 'Continue project' };
    return <><a className="back-link" href={base + '/engagements'}><ArrowLeft size={16}/>All projects</a><PageTitle eyebrow="SHARED PROJECT WORKSPACE" title={e.data.title} action={<Badge>{e.status}</Badge>}/><div className="project-progress">{['accepted', 'in progress', 'submitted', 'approved', 'delivered', 'completed'].map(s => <span key={s} className={e.status === s || (s === 'submitted' && ['resubmitted', 'changes requested'].includes(e.status)) ? 'active' : ''}>{s}</span>)}</div><div className="workspace-project-grid"><div><section className="panel"><div className="panel-heading"><h3>Conversation & activity</h3><span>{events.length} update{events.length !== 1 ? 's' : ''}</span></div>{events.length ? <div className="event-stream">{events.map((ev: any) => <article key={ev.id} className={'event ' + (ev.author === r.data.viewer ? 'own' : '')}><div><strong>{ev.author_name || 'Project participant'}</strong><Badge>{ev.type === 'submit' ? 'Version ' + (submits.findIndex((s: any) => s.id === ev.id) + 1) : ev.type}</Badge><span>{date(ev.created)}</span></div>{ev.data.deliverable && <h4 className="event-deliverable">{ev.data.deliverable}</h4>}{ev.data.message && <p className="preserve">{ev.data.message}</p>}{ev.data.files?.length > 0 && <div className="file-list">{ev.data.files.map((f: string, i: number) => <a className="file-link" key={f} href={'/api/files/' + f} target="_blank" rel="noopener noreferrer"><Download size={15}/>File {i + 1}</a>)}</div>}</article>)}</div> : <Empty icon={Mail} title="A shared space for a shared vision." description="Start the conversation and keep decisions close to the work."/>}<div className="composer">{creator && actions.includes('submit') && <div className="field"><label htmlFor="deliverable-name">Deliverable name *</label><input id="deliverable-name" value={deliverable} onChange={e => setDeliverable(e.target.value)} maxLength={200}/></div>}<label htmlFor="project-message">Message or submission notes</label><textarea id="project-message" value={message} onChange={e => setMessage(e.target.value)} rows={3} maxLength={10000}/><UploadField label={creator ? 'Attach files / deliverables' : 'Attach reference files'} value={files} multiple set={setFiles}/>{error && <ErrorBox message={error}/>}<div className="form-actions"><Button secondary disabled={busy || !message.trim()} onClick={() => act('message')}>Send message<Send size={15}/></Button>{actions.map(a => <Button key={a} secondary={a === 'revise'} disabled={busy} onClick={() => act(a)}>{labels[a]}<ArrowUpRight size={16}/></Button>)}</div>{!['completed', 'cancelled', 'cancellation requested'].includes(e.status) && <button className="danger-text" disabled={busy} onClick={() => act('request_cancel')}>Request project cancellation</button>}{e.revisions >= e.data.revisions && ['submitted', 'resubmitted'].includes(e.status) && !creator && <p className="micro">The agreed revision allowance has been used. Discuss any additional scope with your creator before proceeding.</p>}</div></section><ProjectTasks id={id} viewer={r.data.viewer} status={e.status}/><ProjectReview engagement={e} viewer={r.data.viewer}/></div><aside><section className="panel agreement"><span className="eyebrow">THE AGREED SCOPE</span><h3>Project agreement</h3><Review data={e.data} keys={['contentType', 'aspectRatio', 'quantity', 'duration', 'budget', 'currency', 'deadline', 'commercialUse', 'rights', 'territory', 'usageDuration']}/><div className="revision-meter"><strong>{e.revisions} / {e.data.revisions}</strong><span>Revision rounds requested</span></div><p className="micro">Delivery status does not represent payment settlement.</p></section>{latest && <section className="panel"><h3>{['approved', 'delivered', 'completed'].includes(e.status) ? 'Approved version' : 'Latest submission'}</h3><p>Version {submits.length} · {date(latest.created)}</p><div className="file-list">{latest.data.files.map((id: string, i: number) => <a className="file-link" key={id} href={'/api/files/' + id} target="_blank" rel="noopener noreferrer"><Download size={15}/>Download file {i + 1}</a>)}</div></section>}{e.data.assets?.length > 0 && <section className="panel"><h3>Brand reference assets</h3>{e.data.assets.map((id: string, i: number) => <a className="file-link" key={id} href={'/api/files/' + id} target="_blank" rel="noopener noreferrer"><FileText size={15}/>Reference {i + 1}</a>)}</section>}</aside></div></>;
}
function Notifications({ data, refresh }: any) {
    const { toast } = useApp();
    return <><PageTitle eyebrow="KEEP THE CONVERSATION CONNECTED" title="Your notifications." action={<Button secondary disabled={!data.notifications.some((n: any) => !n.read)} onClick={async () => {
                try {
                    await api('notifications', {});
                    refresh();
                    toast('All notifications marked read.');
                }
                catch (e: any) {
                    toast(e.message);
                }
            }}><Check size={17}/>Mark all read</Button>}/>{data.notifications.length ? <div className="panel">{data.notifications.map((n: any) => <div className={'list-row ' + (!n.read ? 'unread-row' : '')} key={n.id}><Bell size={18}/><a href={n.href} onClick={() => { api('notifications', { id: n.id }).catch(() => { }); }}><strong>{n.title}</strong><p>{date(n.created)}</p></a>{!n.read && <button className="icon-btn" aria-label="Mark read" onClick={async () => {
                        try {
                            await api('notifications', { id: n.id });
                            refresh();
                        }
                        catch (e: any) {
                            toast(e.message);
                        }
                    }}><Check size={16}/></button>}<a href={n.href} aria-label="Open notification"><ArrowUpRight size={17}/></a></div>)}</div> : <Empty icon={Bell} title="You’re all caught up." description="Real invitation and project updates appear here as your collaborations progress."/>}</>;
}
function Verification({ data, refresh }: any) {
    const [form, setForm] = useState<Obj>({ claim: '', description: '', files: [] }), [busy, setBusy] = useState(false), [error, setError] = useState('');
    const { toast } = useApp();
    return <><PageTitle eyebrow="TRUST WITH CONTEXT" title="Evidence behind your skills." description="Submit evidence for a specific capability. Only reviewed claims can become verified."/><div className="note"><Shield size={20}/>Evidence is private. Verification of a workflow or tool claim does not establish copyright ownership or commercial rights.</div><form className="form-panel" onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError('');
            try {
                await api('evidence', form);
                setForm({ claim: '', description: '', files: [] });
                refresh();
                toast('Evidence submitted for review.');
            }
            catch (e: any) {
                setError(e.message);
            }
            finally {
                setBusy(false);
            }
        }}><Fields fields={[["claim", "Specific capability / tool claim", "text", null, true], ["description", "Explain your evidence", "textarea", null, true]]} data={form} set={(k: string, v: any) => setForm({ ...form, [k]: v })}/><UploadField label="Private supporting files" value={form.files} multiple set={(v: any) => setForm({ ...form, files: v })}/>{error && <ErrorBox message={error}/>}<Button disabled={busy}>Submit evidence<ArrowUpRight size={17}/></Button></form>{data.evidence.length > 0 && <section className="panel"><h3>Your submissions</h3>{data.evidence.map((e: any) => <div className="list-row" key={e.id}><Shield size={20}/><div><strong>{e.data.claim}</strong><p>{e.data.description}</p>{e.data.review && <p>Review: {e.data.review}</p>}</div><Badge>{e.status}</Badge></div>)}</section>}</>;
}
function EmailSettingsPanel({ account, onUpdated }: any) {
    const { toast, refreshMe } = useApp();
    const [email, setEmail] = useState(account?.data?.verifiedContactEmail || account?.data?.contactEmail || account?.email || '');
    const [verifiedEmail, setVerifiedEmail] = useState(account?.data?.verifiedContactEmail || (account?.data?.contactEmailVerified ? account?.data?.contactEmail : ''));
    const [otpCode, setOtpCode] = useState('');
    const [step, setStep] = useState<'idle' | 'code_sent' | 'verified'>(verifiedEmail ? 'verified' : 'idle');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleSendOtp = async (e?: any) => {
        if (e) e.preventDefault();
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address you control.');
            return;
        }
        setBusy(true);
        setError('');
        try {
            await api('auth/otp/send', { email: email.trim(), purpose: 'contact_email_verification' });
            setStep('code_sent');
            setCooldown(60);
            toast('Verification code sent to ' + email.trim());
        } catch (err: any) {
            setError(err.message || 'Failed to send verification code.');
        } finally {
            setBusy(false);
        }
    };

    const handleVerifyOtp = async (e: any) => {
        e.preventDefault();
        if (otpCode.trim().length !== 6) {
            setError('Please enter the complete 6-digit verification code.');
            return;
        }
        setBusy(true);
        setError('');
        try {
            await api('auth/otp/verify', {
                email: email.trim(),
                code: otpCode.trim(),
                purpose: 'contact_email_verification'
            });
            await api('account', {
                ...account.data,
                name: account.name || account.data?.name || 'User',
                role: account.role,
                contactEmail: email.trim(),
                verifiedContactEmail: email.trim(),
                contactEmailVerified: true,
                terms: true
            });
            setVerifiedEmail(email.trim());
            setStep('verified');
            toast('Email verified via Resend! You will receive campaign updates here.');
            if (onUpdated) onUpdated();
            refreshMe();
        } catch (err: any) {
            setError(err.message || 'Invalid or expired verification code.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <section className="panel email-settings-panel" id="email-settings">
            <ContactEmailModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                initialEmail={verifiedEmail || email || account?.email || ''}
                isDismissable={true}
                onVerified={(newVerifiedEmail) => {
                    setVerifiedEmail(newVerifiedEmail);
                    setEmail(newVerifiedEmail);
                    setStep('verified');
                    setShowModal(false);
                    if (onUpdated) onUpdated();
                    refreshMe();
                }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                <div>
                    <h3 style={{ margin: 0 }}>Email Settings</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--muted)' }}>
                        Add and verify an email address you control to receive direct campaign updates, briefs, and revision alerts.
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        type="button"
                        className="button secondary"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                        onClick={() => setShowModal(true)}
                    >
                        <Shield size={13} style={{ marginRight: '4px' }} />
                        {verifiedEmail ? 'Re-verify with Modal' : 'Interactive OTP Modal'}
                    </button>
                    {step === 'verified' && (
                        <span className="badge" style={{ background: 'var(--accent)', color: '#080a08', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '999px' }}>
                            <CheckCircle2 size={13} /> Verified via Resend
                        </span>
                    )}
                </div>
            </div>

            <div style={{ background: 'var(--bg)', border: '1px solid var(--line)', padding: '12px 16px', borderRadius: '8px', fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <Shield size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>
                    <strong>Note:</strong> The verified email added here is used for direct platform notifications and campaign briefs delivered via Resend. It does not replace your primary Firebase sign-in email.
                </span>
            </div>

            {step === 'verified' ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '8px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Mail size={18} style={{ color: 'var(--accent)' }} />
                        <div>
                            <strong style={{ fontSize: '14px', display: 'block' }}>{verifiedEmail}</strong>
                            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Active Verified Contact &amp; Notification Address</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button
                            type="button"
                            className="button secondary"
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                            onClick={() => setShowModal(true)}
                        >
                            Change Email
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={step === 'code_sent' ? handleVerifyOtp : handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '6px' }}>
                            Email address you control
                        </label>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Enter an email you control (e.g. name@company.com)"
                                disabled={busy || step === 'code_sent'}
                                required
                                style={{ flex: 1, minWidth: '220px' }}
                            />
                            {step !== 'code_sent' && (
                                <button
                                    type="button"
                                    className="button"
                                    disabled={busy || cooldown > 0}
                                    onClick={handleSendOtp}
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    {busy ? 'Sending...' : cooldown > 0 ? `Resend (${cooldown}s)` : 'Send Verification Code'}
                                </button>
                            )}
                        </div>
                    </div>

                    {step === 'code_sent' && (
                        <div style={{ padding: '16px', background: 'var(--raised)', border: '1px solid var(--accent)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                                <Mail size={16} style={{ color: 'var(--accent)' }} />
                                <span>A 6-digit code was sent to <strong>{email}</strong> via Resend. Check your inbox.</span>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                    placeholder="123456"
                                    autoFocus
                                    style={{ width: '130px', fontSize: '16px', letterSpacing: '4px', textAlign: 'center', fontWeight: 'bold' }}
                                />
                                <button type="submit" className="button" disabled={busy || otpCode.trim().length !== 6}>
                                    {busy ? 'Verifying...' : 'Verify Code'}
                                </button>
                                <button
                                    type="button"
                                    className="text-link"
                                    disabled={busy || cooldown > 0}
                                    onClick={handleSendOtp}
                                    style={{ fontSize: '11px' }}
                                >
                                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                                </button>
                            </div>
                        </div>
                    )}

                    {error && <ErrorBox message={error} />}
                </form>
            )}
        </section>
    );
}

function AccountSettings({ data, refresh }: any) {
    const { toast, theme, setTheme, refreshMe } = useApp();
    const [form, setForm] = useState<Obj>(data.account.data), [busy, setBusy] = useState(false), [error, setError] = useState('');
    return <><PageTitle eyebrow="YOUR WORKSPACE, YOUR WAY" title="Account settings."/><form className="form-panel" onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError('');
            try {
                await api('account', { ...form, role: data.account.role, terms: true });
                refresh();
                refreshMe();
                toast('Account updated.');
            }
            catch (e: any) {
                setError(e.message);
            }
            finally {
                setBusy(false);
            }
        }}><h3>Profile & organization</h3><Fields fields={data.account.role === 'creator' ? [['name', 'Your name', 'text', null, true]] : [['name', 'Your name', 'text', null, true], ['organization', 'Organization name', 'text'], ['industry', 'Industry', 'select', INDUSTRIES], ['website', 'Website', 'url'], ['contactEmail', 'Business contact email', 'email'], ['country', 'Country', 'text'], ['currency', 'Default currency', 'select', ['INR', 'USD', 'EUR']], ['description', 'Organization overview', 'textarea'], ['goals', 'Creative goals', 'textarea']]} data={form} set={(k: string, v: any) => setForm({ ...form, [k]: v })}/>{data.account.role !== 'creator' && <UploadField label="Organization logo" value={form.logo} set={(v: any) => setForm({ ...form, logo: v })} accept="image/jpeg,image/png,image/webp"/>}<div className="account-email"><Mail size={17}/>{data.account.email}<Badge>{data.account.role}</Badge></div>{error && <ErrorBox message={error}/>}<Button disabled={busy}>Save changes<Check size={16}/></Button></form><EmailSettingsPanel account={data.account} onUpdated={refresh} /><section className="panel"><h3>Appearance</h3><p>Choose a visual perspective. Your choice is saved on this device.</p><div className="theme-grid">{THEMES.map((t, i) => <button className={theme === i ? 'selected' : ''} key={t} onClick={() => setTheme(i)}><span className={'swatch swatch-' + i}/>{t}{theme === i && <Check size={14}/>}</button>)}</div></section><section className="panel"><h3>Security & notifications</h3><p>Authentication is secured by Firebase. Manage your login credentials and connected single sign-on providers below.</p><p>Project and invitation notifications are delivered to your notification center.</p><div className="inline-actions"><Button secondary href="/forgot-password">Reset password<ArrowUpRight size={15}/></Button><Button secondary href="/app/notifications">Notification center<Bell size={16}/></Button></div></section><AccountExport /><section className="panel danger-panel"><h3>Delete account</h3><p>Deleting your CreaXa account permanently removes your creator profile, published campaigns, portfolio media, and project records. Complete active engagements first.</p><button className="danger-text" disabled={busy} onClick={async () => {
            if (!confirm('Permanently delete your CreaXa account and its marketplace records?'))
                return;
            setBusy(true);
            try {
                await api('account', undefined, 'DELETE');
                location.href = '/';
            }
            catch (e: any) {
                setError(e.message);
                toast(e.message);
            }
            finally {
                setBusy(false);
            }
        }}>Delete my marketplace account<Trash2 size={16}/></button></section></>;
}
function Admin() {
    const r = useResource('admin');
    const { toast } = useApp();
    if (r.loading)
        return <Loading />;
    if (r.error)
        return <ErrorBox message={r.error} retry={r.refresh} />;
    return <AdminDashboard data={r.data} onRefresh={r.refresh} toast={toast} />;
}
function ContactForm() {
    const { me, toast } = useApp();
    const [subject, setSubject] = useState(''), [message, setMessage] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('');
    return me?.account ? <form className="form-panel" onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError('');
            try {
                await api('support', { subject, message });
                setSubject('');
                setMessage('');
                toast('Your enquiry has been received.');
            }
            catch (e: any) {
                setError(e.message);
            }
            finally {
                setBusy(false);
            }
        }}><Fields fields={[["subject", "Subject", "text", null, true], ["message", "How can we help?", "textarea", null, true]]} data={{ subject, message }} set={(k: string, v: any) => k === 'subject' ? setSubject(v) : setMessage(v)}/>{error && <ErrorBox message={error}/>}<Button disabled={busy}>Send enquiry<Send size={16}/></Button></form> : <div className="panel"><h3>A conversation starts with a connection.</h3><p>Sign in and set up your account to send a private support enquiry.</p><Button href="/login">Sign in to contact us<ArrowUpRight size={17}/></Button></div>;
}
const INFO: Record<string, Obj> = {
    '/about': { tag: 'THE PEOPLE BEHIND THE POSSIBILITIES', title: 'Built around creative people.', desc: 'AI opens new creative possibilities. The right collaboration turns those possibilities into work that matters.', sections: [['Our purpose', 'CreaXa connects brands and agencies with creators who work with generative tools. We put capability, process and creative context alongside the final image or film.'], ['Clarity makes better work', 'Every campaign starts with a documented brief. Every collaboration keeps its scope, files, revisions and delivery connected.'], ['Trust is specific', 'Creative capabilities start as self-declared claims. Evidence and review are clearly distinguished. No automatic verification badge replaces the context behind the work.']] },
    '/for-brands': { tag: 'FOR BRANDS & AGENCIES', title: 'Your ambition. Their perspective.', desc: 'Find AI creative partners through capabilities, original work and a brief that means business.', sections: [['Start with a clear vision', 'Define content type, creative style, platform, aspect ratio, language and deliverables. Set a real budget, deadline, revision allowance and intended usage.'], ['Find capability that fits', 'Search creator tools, specialization, industries and supported formats. Campaign matching explains the underlying factors and respects required capabilities.'], ['Keep the whole process together', 'Send an invitation with clear terms. When accepted, a shared workspace tracks messages, versioned files, revision requests, approval and delivery.']] },
    '/for-creators': { tag: 'FOR ORIGINAL MINDS', title: 'Make your process part of your story.', desc: 'A place for the vision, tools and creative thinking behind your work.', sections: [['Publish your perspective', 'Build a profile with your specializations, toolkit, output formats, industries, rates and availability. Keep your capabilities accurate and current.'], ['Show more than the result', 'Add original image and video projects with tools, workflow, contribution and commercial-use declarations. Private evidence stays separate from public media.'], ['Choose your collaborations', 'Review campaign invitations, agree the scope and work alongside your client through submission, revision, approval and final delivery.']] },
    '/how-it-works': { tag: 'FROM FIRST SPARK TO FINAL FRAME', title: 'An idea. A connection. A creation.', desc: 'A considered process for brands, agencies and AI creators.', sections: [['01 / Define the brief', 'Brands and agencies set the campaign objective, creative requirements, budget, timeline, deliverables and commercial-use expectations.'], ['02 / Discover your partner', 'Browse published profiles and original work. Refine by style, tools, format, industry and availability, or view explained campaign compatibility.'], ['03 / Agree the scope', 'Invite a creator with a proposed budget, start date, revision allowance and rights terms. Review and acceptance create the shared project agreement.'], ['04 / Create and refine', 'Keep messages and reference files in one workspace. Creators submit versioned deliverables; brands approve or request changes within the agreed allowance.'], ['05 / Deliver with clarity', 'After approval, the creator delivers the final version and the brand completes the workspace. Delivery and payment settlement remain separate.']] },
    '/privacy': { tag: 'YOUR DATA, WITH CONTEXT', title: 'Privacy policy.', desc: 'Last updated 13 October 2026.', sections: [['Account information', 'CreaXa authenticates users via Firebase Authentication (supporting Email/Password and Google OAuth). Marketplace account details, role, profile and organization information are securely stored in the Supabase PostgreSQL database. Passwords are never received or stored directly by CreaXa application servers.'], ['Public and private content', 'Published creator profiles and portfolio media are visible across the creative marketplace directory. Campaigns, invitations, project files and conversations are accessible only to their authorized owners and participants. Verification evidence remains strictly private to its owner and authorized moderators.'], ['Storage and providers', 'Structured marketplace records are stored in Supabase PostgreSQL, and uploaded media files use Cloudflare R2 object storage. Firebase provides authentication services. A configured AI brief assistant receives only the creative idea you explicitly submit to it; automated AI processing of private data does not occur.'], ['Purpose and retention', 'Data supports creator discovery, campaign collaboration, capability review and support enquiries. Records remain while your account exists. You can delete unpublished portfolio projects and remove your marketplace account from Settings after completing active engagements. Project records shared with collaborators are also removed by account deletion.'], ['Device preferences', 'The chosen visual theme is stored in your browser’s local storage. This preference contains no project or profile data. No advertising tracker is included in the application.'], ['Requests and questions', 'Use the signed-in Contact form to send a privacy enquiry. This policy describes the current application. The operator must review hosting-provider terms and any additional integrations before opening broader commercial access.']] },
    '/terms': { tag: 'CLEAR EXPECTATIONS, BETTER COLLABORATIONS', title: 'Terms of use.', desc: 'Last updated 13 October 2026.', sections: [['Marketplace participation', 'Provide accurate account, capability, portfolio and campaign information. Upload only content you are authorized to share and display. Do not impersonate others, misrepresent evidence or submit unlawful, abusive or infringing material.'], ['Scope and agreements', 'Brands, agencies and creators are responsible for agreeing price, deliverables, schedule, revisions, confidentiality, attribution and rights. An accepted invitation stores the agreed project scope. Discuss additional work and revised terms before exceeding that scope.'], ['Commercial and intellectual-property rights', 'AI-generated content is not automatically free of third-party restrictions. Participants must check tool/model terms, source assets, likeness permissions and intended commercial usage. A rights request in a campaign does not by itself transfer ownership or grant a license.'], ['Capabilities and verification', 'Unreviewed profile information is self-declared. Evidence submitted, under review, verified and rejected are distinct states. Verification refers only to the reviewed claim and does not certify copyright ownership or guarantee a project outcome.'], ['Payments and delivery', 'CreaXa does not currently collect payments, hold escrow or settle invoices. Participants arrange payment directly. Submitted, approved, delivered and completed are creative-workflow states and do not prove payment settlement.'], ['Account security and removal', 'Sign-in is managed by Firebase Authentication. Keep your account credentials and OAuth providers secure. Marketplace account deletion is available in Settings after active engagements are completed and removes associated marketplace records.'], ['Disputes and support', 'Use the Contact form for support, abuse or rights-related enquiries. Project participants remain responsible for their agreements and disputes. Before wider commercial release, the operator must finalize business identity, applicable governing terms and operational support arrangements.']] }
};
function Info({ path }: any) {
    if (path === '/faq')
        return <div className="page info-page"><span className="eyebrow">GOOD QUESTIONS. CLEAR ANSWERS.</span><h1>A little more <em>clarity.</em></h1><FaqList /></div>;
    if (path === '/contact')
        return <div className="page info-page"><span className="eyebrow">LET’S KEEP THE CONVERSATION OPEN</span><h1>How can we <em>help?</em></h1><p className="large-copy">Account questions, creative-workflow issues, or a concern about published content. Send a private enquiry.</p><ContactForm /></div>;
    const info = INFO[path];
    if (!info)
        return <div className="page"><Empty title="This page couldn’t be found." description="Explore the creative directory or return to the homepage." action="Back to CreaXa" href="/"/></div>;
    return <div className="page info-page"><span className="eyebrow">{info.tag}</span><h1>{info.title}</h1><p className="large-copy">{info.desc}</p>{info.sections.map(([h, p]: any) => <section key={h}><h2>{h}</h2><p>{p}</p></section>)}{!['/privacy', '/terms'].includes(path) && <div className="info-cta"><Button href={path === '/for-creators' ? '/signup' : '/app/brand/campaigns/new'}>{path === '/for-creators' ? 'Publish your perspective' : 'Start a campaign'}<ArrowUpRight size={18}/></Button><Button secondary href="/discover">Discover creators<ArrowUpRight size={18}/></Button></div>}</div>;
}

