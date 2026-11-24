import { useEffect, useRef, useState } from 'react';
import HalftoneReveal from './components/reactbits/HalftoneReveal';
import SplitText from './components/reactbits/SplitText';
import CountUp from './components/reactbits/CountUp';
import VariableProximity from './components/reactbits/VariableProximity';
import ClickSpark from './components/reactbits/ClickSpark';
import PortfolioActionButton from './components/PortfolioActionButton';
import DayNightToggle from './components/DayNightToggle';
import AnimatedList from './components/reactbits/AnimatedList';
import HomepageSections from './components/HomepageSections';
import PortfolioPages from './components/PortfolioPages';
import profilePhoto from '../imageprofileportfolio.png';

type SidebarItem = { label: string; href?: string; icon: string; external?: boolean };
const portfolioNavigation: SidebarItem[] = [
  { label: 'More about me', href: '/about', icon: 'about' },
  { label: 'Projects', href: '/projects', icon: 'projects' },
  { label: 'Experience', href: '/experience', icon: 'experience' },
  { label: 'Stack', href: '/stack', icon: 'stack' },
  { label: 'Certifications', href: '/certifications', icon: 'certifications' },
];
const exploreNavigation: SidebarItem[] = [
  { label: 'Blog', icon: 'blog' },
  { label: 'GitHub', href: 'https://github.com/Mike-Rp', icon: 'github', external: true },
];
const portfolioLabels = portfolioNavigation.map(item => item.label);
const exploreLabels = exploreNavigation.map(item => item.label);

function SidebarIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    home: <><path d="m2.5 8 5.5-5 5.5 5v5.5H2.5z" /><path d="M6 13.5V9h4v4.5" /></>,
    blog: <><rect x="3" y="2" width="10" height="12" rx="1.5" /><path d="M5.5 5.25h5M5.5 8h5M5.5 10.75h3.5" /></>,
    about: <><circle cx="8" cy="5" r="2.25" /><path d="M3.25 13.25c.5-2.5 2.1-3.75 4.75-3.75s4.25 1.25 4.75 3.75" /></>,
    projects: <><rect x="2" y="2.5" width="5" height="5" rx=".7" /><rect x="9" y="2.5" width="5" height="5" rx=".7" /><rect x="2" y="9.5" width="5" height="4" rx=".7" /><rect x="9" y="9.5" width="5" height="4" rx=".7" /></>,
    experience: <><rect x="2" y="5" width="12" height="8" rx="1" /><path d="M5.5 5V3.5h5V5M2 8.5c4 2 8 2 12 0" /></>,
    stack: <><path d="m8 2 6 3.2-6 3.2-6-3.2zM2 8l6 3.2L14 8M2 10.8 8 14l6-3.2" /></>,
    certifications: <><circle cx="8" cy="6" r="3.5" /><path d="m5.7 9-1 5 3.3-1.8 3.3 1.8-1-5" /></>,
    github: <><path d="M5.2 12.8c-2.1.5-2.1-1.1-3.1-1.4m9.8 1.4v-2.1c0-.7.1-1.1.5-1.5 1.5-.2 2.6-.9 2.6-3.3 0-.8-.3-1.5-.8-2.1.1-.5.1-1.2-.2-1.8 0 0-.7-.2-2.2.8a8.4 8.4 0 0 0-4.1 0c-1.5-1-2.2-.8-2.2-.8-.3.6-.3 1.3-.2 1.8-.5.6-.8 1.3-.8 2.1 0 2.4 1.1 3.1 2.6 3.3.4.4.5.8.5 1.5v2.1" /></>,
    linkedin: <><rect x="2" y="2" width="12" height="12" rx="1.5" /><path d="M5 7v4M5 5v.1M8 11V7m0 1.2c.5-.8 1-1.2 1.9-1.2 1.3 0 1.7.9 1.7 2.2V11" /></>,
  };
  return <svg className="sidebar-nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

function DocumentIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M5 2.75h9l5 5v13.5H5z" strokeLinejoin="round" /><path d="M14 2.75v5h5M8 12h8M8 16h8" strokeLinecap="round" /></svg>;
}

function MailIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="1.5" /><path d="m3 6 9 7 9-7" strokeLinejoin="round" /></svg>;
}

function Sidebar({ onContact, collapsed, onToggleCollapse, pathname, navigate }: { onContact: () => void; collapsed: boolean; onToggleCollapse: () => void; pathname: string; navigate: (path: string) => void }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const closeMobileNavigation = (restoreFocus = true) => {
    if (!open) return;
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      } else if (event.key === 'Tab') {
        const controls = [...(sidebarRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  const navigationGroup = (label: string, items: SidebarItem[]) => (
    <div className="sidebar-nav-group">
      <p className="sidebar-group-label">{label}</p>
      <AnimatedList items={items === portfolioNavigation ? portfolioLabels : exploreLabels} selectedIndex={items.findIndex(item => item.href === pathname)} selectOnClick={false} frame={false} showGradients={false} displayScrollbar={false} enableArrowNavigation={false} selectOnHover={false} animation="slide" animateOnce stagger={0.035} width="100%" maxHeight="none" gap={2} className="sidebar-list" renderItem={(_, index) => {
        const item = items[index];
        const content = <><SidebarIcon name={item.icon} /><span className="sidebar-item-label">{item.label}</span></>;
        return item.href
          ? <a className={`nav-item${pathname === item.href ? ' is-current' : ''}`} href={item.href} title={collapsed ? item.label : undefined} aria-label={item.label} aria-current={pathname === item.href ? 'page' : undefined} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} onClick={event => { if (!item.external && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0) { event.preventDefault(); navigate(item.href!); closeMobileNavigation(false); } }}>{content}</a>
          : <span className="nav-item is-pending" aria-disabled="true" title={`${item.label} is planned for a future phase`}>{content}</span>;
      }} />
    </div>
  );

  return (
    <>
      <div className="mobile-sidebar-bar">
        <button ref={triggerRef} className="menu-toggle" type="button" aria-label="Open navigation" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(true)}><span /><span /><span /></button>
        <a className="sidebar-brand" href="/" onClick={event => { event.preventDefault(); navigate('/'); closeMobileNavigation(false); }}>Mikhail Respicio<span className="brand-dot">.</span></a>
      </div>
      {open && <button className="sidebar-backdrop" type="button" tabIndex={-1} aria-label="Close navigation backdrop" onClick={() => closeMobileNavigation()} />}
      <aside ref={sidebarRef} className={`sidebar${open ? ' is-open' : ''}${collapsed ? ' is-collapsed' : ''}`}>
        <div className="sidebar-panel">
          <div className="sidebar-heading">
            <a className="sidebar-brand" href="/" onClick={event => { event.preventDefault(); navigate('/'); closeMobileNavigation(false); }}>Mikhail Respicio<span className="brand-dot">.</span></a>
            <button className="sidebar-collapse" type="button" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={onToggleCollapse}><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1.75" y="2.25" width="12.5" height="11.5" rx="2" /><path d="M6 2.5v11M9.5 6.25 7.75 8l1.75 1.75" /></svg></button>
            <button ref={closeRef} className="sidebar-close" type="button" aria-label="Close navigation" onClick={() => { setOpen(false); triggerRef.current?.focus(); }}>×</button>
          </div>
          <button className={`sidebar-contact${pathname === '/contact' ? ' is-current' : ''}`} type="button" aria-label="Contact" aria-current={pathname === '/contact' ? 'page' : undefined} title={collapsed ? 'Contact' : undefined} onClick={() => { onContact(); closeMobileNavigation(false); }}><MailIcon /><span>Contact</span></button>
          <nav id="primary-navigation" className="sidebar-nav" aria-label="Sidebar navigation">
            {navigationGroup('Portfolio', portfolioNavigation)}
            <div className="sidebar-nav-divider" role="separator" />
            {navigationGroup('Explore', exploreNavigation)}
          </nav>
          <div className="sidebar-foot"><p className="sidebar-caption">GMT+8</p><div className="sidebar-foot-actions"><DayNightToggle /><button className="sidebar-foot-icon" type="button" aria-label="Email unavailable" title="Email address not configured" disabled><MailIcon /></button><button className="sidebar-foot-icon" type="button" aria-label="LinkedIn unavailable" title="LinkedIn URL not configured" disabled><SidebarIcon name="linkedin" /></button></div></div>
        </div>
      </aside>
    </>
  );
}

function ProfilePhoto({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState(false);
  const [suppressHover, setSuppressHover] = useState(false);
  return (
    <button type="button" className={`profile-photo${active ? ' is-active' : ''}`} aria-label="Show profile photo in color" aria-pressed={active} onPointerMove={event => { if (event.pointerType === 'mouse') setSuppressHover(false); }} onClick={() => { setSuppressHover(active); setActive(value => !value); }}>
      <img src={profilePhoto} alt="Mikhail Respicio taking a mirror portrait" width="307" height="291" fetchPriority="high" />
      {!reduced && <HalftoneReveal src={profilePhoto} fullReveal={active} suppressHover={suppressHover} fit="cover" mode="mono" shape="dot" cellSize={4} dotScale={0.88} halftoneStrength={0.12} inkColor="#111111" paperColor="#f5f5f5" contrast={1.2} brightness={0.12} invert={false} roughness={0} misregistration={0} revealRadius={150} softness={0.38} linger={0.9} reverse={false} wander={false} clickBurst={false} intro className="photo-effect" />}
    </button>
  );
}

function Statistic({ value, suffix, label, href, navigate, reduced }: { value: number; suffix: string; label: string; href?: string; navigate: (path: string) => void; reduced: boolean }) {
  const content = <>
      <div className="statistic-value" aria-label={`${value}${suffix}`}>
        {reduced ? <span>{value}</span> : <CountUp to={value} duration={1.35} easing="easeOut" trigger="view" />}
        <span>{suffix}</span>
      </div>
      <p className="statistic-label">{label}</p>
      {href && <span className="statistic-arrow" aria-hidden="true">↗</span>}
    </>;
  return href
    ? <a className="statistic is-interactive" href={href} onClick={event => { if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey) return; event.preventDefault(); navigate(href); }}>{content}</a>
    : <div className="statistic">{content}</div>;
}

export default function App() {
  const reduced = useReducedMotion();
  const biographyRef = useRef<HTMLDivElement>(null);
  const [notice, setNotice] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pathname, setPathname] = useState(() => window.location.pathname.replace(/\/$/, '') || '/');
  const previousPathname = useRef(pathname);
  const navigate = (path: string) => {
    if (window.location.pathname !== path) window.history.pushState(null, '', path);
    setPathname(path);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname.replace(/\/$/, '') || '/');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => { document.title = `${pathname === '/' ? 'Mikhail Respicio' : `${pathname.slice(1).replace(/^[a-z]/, letter => letter.toUpperCase())} — Mikhail Respicio`} — Portfolio`; }, [pathname]);
  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    document.querySelector<HTMLElement>('.portfolio-page-header h1, #hero-title')?.focus();
  }, [pathname]);

  const emphasized = (label: string) => reduced ? label : <VariableProximity label={label} containerRef={biographyRef} fromFontVariationSettings="'wght' 650" toFontVariationSettings="'wght' 700" radius={85} falloff="gaussian" smoothing={0.2} scale={1} lift={0} idleWave={false} />;

  return (
    <ClickSpark sparkColor="currentColor" sparkSize={7} sparkRadius={25} sparkCount={6} sparkWidth={1.4} duration={420} cooldown={600} easing="ease-out" shape="line" randomness={0.1} glow={0} ring={false} layer="front" layerZIndex={30} disabled={reduced} ignoreSelector=".theme-toggle">
    <div className={`site-shell${sidebarCollapsed ? ' sidebar-is-collapsed' : ''}`}>
      <Sidebar onContact={() => navigate('/contact')} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(value => !value)} pathname={pathname} navigate={navigate} />
      <main id={pathname === '/' ? 'home' : undefined} className="main-content">
        {pathname === '/' ? <>
        <section className="hero" aria-labelledby="hero-title">
          <div className="profile-introduction">
            <ProfilePhoto reduced={reduced} />
            <div className="intro-copy" ref={biographyRef}>
              <h1 id="hero-title" tabIndex={-1}>Mikhail Respicio</h1>
              <p className="roles">Software Developer <span aria-hidden="true">·</span> UI/UX Designer<br />Graphic Designer</p>
              <div className="biography">
                <p>I'm a developer who enjoys turning ideas into <strong>{emphasized('useful, well-designed digital experiences')}</strong> that make everyday tasks easier.</p>
                <p>I enjoy exploring new technologies, designing in <span className="biography-tool"><strong>{emphasized('Figma')}</strong><span role="img" aria-label="Figma logo" className="biography-figma"><img src="/icons/figma.svg" alt="" width="16" height="16" /></span></span>, and using <strong><span className="biography-ai-tool">{emphasized('AI')} <span className="biography-ai-icons" role="img" aria-label="Codex, ChatGPT, Claude, and Gemini logos"><img src="/icons/codex.svg" alt="" width="17" height="17" /><img src="/icons/chatgpt.svg" alt="" width="17" height="17" /><img src="/icons/claude.svg" alt="" width="17" height="17" /><img src="/icons/gemini.svg" alt="" width="17" height="17" /></span></span> {emphasized('to improve my development workflow')}</strong>. I like experimenting, solving problems, and finding better ways to bring ideas to life.</p>
              </div>
              <a href="/about" className="about-link" onClick={event => { if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey) return; event.preventDefault(); navigate('/about'); }}>
                <span className="about-arrow" aria-hidden="true">↓</span>
                {reduced ? <span>More about me</span> : <SplitText text="More about me" tag="span" splitType="words" effect="fade" from={{ opacity: 0.55 }} to={{ opacity: 1 }} duration={0.35} delay={0.05} trigger="load" textAlign="left" />}
              </a>
            </div>
          </div>

          <div className="actions" aria-label="Portfolio actions">
            <PortfolioActionButton variant="primary" reducedMotion={reduced} onClick={() => setNotice('Resume file has not been added yet.')}>
              <DocumentIcon /><span>View Resume</span>
            </PortfolioActionButton>
            <PortfolioActionButton variant="secondary" reducedMotion={reduced} onClick={() => navigate('/contact')}>
              <MailIcon /><span>Contact Me</span>
            </PortfolioActionButton>
          </div>
          <p className="action-notice" role="status" aria-live="polite">{notice}</p>

          <div className="statistics" aria-label="Portfolio statistics">
            <Statistic value={5} suffix={'+\u00a0yrs'} label="Creative Design" href="/projects" navigate={navigate} reduced={reduced} />
            <Statistic value={2} suffix={'+\u00a0yrs'} label="Building Software" href="/projects" navigate={navigate} reduced={reduced} />
            <Statistic value={2} suffix="×" label="Hackathon Winner" navigate={navigate} reduced={reduced} />
          </div>
        </section>
        <HomepageSections />
        </> : <PortfolioPages pathname={pathname} navigate={navigate} />}
      </main>
    </div>
    </ClickSpark>
  );
}
