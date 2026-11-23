import { useEffect, useRef, useState } from 'react';
import HalftoneReveal from './components/reactbits/HalftoneReveal';
import SplitText from './components/reactbits/SplitText';
import CountUp from './components/reactbits/CountUp';
import VariableProximity from './components/reactbits/VariableProximity';
import PortfolioActionButton from './components/PortfolioActionButton';
import profilePhoto from '../imageprofileportfolio.png';

const pendingNavigation = ['About', 'Projects', 'Experience', 'Contact'];

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

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-heading">
        <a className="sidebar-brand" href="#home" onClick={() => setOpen(false)}>Mikhail Respicio<span className="brand-dot">.</span></a>
        <button className="menu-toggle" type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(value => !value)}>
          <span /><span /><span />
        </button>
      </div>
      <nav id="primary-navigation" className={`sidebar-nav${open ? ' is-open' : ''}`} aria-label="Primary navigation">
        <a className="nav-item is-current" href="#home" aria-current="page" onClick={() => setOpen(false)}>Home</a>
        {pendingNavigation.map(item => <span className="nav-item is-pending" key={item} title={`${item} is planned for a future phase`}>{item}</span>)}
      </nav>
      <p className="sidebar-caption">Portfolio · 2026</p>
    </aside>
  );
}

function ProfilePhoto({ reduced }: { reduced: boolean }) {
  return (
    <div className="profile-photo">
      <img src={profilePhoto} alt="Mikhail Respicio taking a mirror portrait" width="307" height="291" fetchPriority="high" />
      {!reduced && <HalftoneReveal src={profilePhoto} fit="cover" mode="mono" shape="dot" cellSize={4} dotScale={0.88} halftoneStrength={0.12} inkColor="#111111" paperColor="#f5f5f5" contrast={1.2} brightness={0.12} invert={false} roughness={0} misregistration={0} revealRadius={150} softness={0.38} linger={0.9} reverse={false} wander={false} clickBurst={false} intro className="photo-effect" />}
    </div>
  );
}

function Statistic({ value, suffix, label, reduced }: { value: number; suffix: string; label: string; reduced: boolean }) {
  return (
    <div className="statistic">
      <div className="statistic-value" aria-label={`${value}${suffix}`}>
        {reduced ? <span>{value}</span> : <CountUp to={value} duration={1.35} easing="easeOut" trigger="view" />}
        <span>{suffix}</span>
      </div>
      <p className="statistic-label">{label}</p>
    </div>
  );
}

export default function App() {
  const reduced = useReducedMotion();
  const biographyRef = useRef<HTMLDivElement>(null);
  const [notice, setNotice] = useState('');

  return (
    <div className="site-shell">
      <Sidebar />
      <main id="home" className="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="profile-introduction">
            <ProfilePhoto reduced={reduced} />
            <div className="intro-copy" ref={biographyRef}>
              <h1 id="hero-title">Mikhail Respicio</h1>
              <p className="roles">Software Developer <span aria-hidden="true">·</span> UI/UX Designer<br />Graphic Designer</p>
              <div className="biography">
                <p>I'm a developer who <strong>{reduced ? 'learns fast' : <VariableProximity label="learns fast" containerRef={biographyRef} fromFontVariationSettings="'wght' 600" toFontVariationSettings="'wght' 650" radius={55} smoothing={0.18} />}</strong>, adapts easily, and loves turning ideas into things people actually use.</p>
                <p>I enjoy exploring new technologies, creating designs in <strong>Figma</strong>, and using <strong>AI to improve my development workflow</strong>. I'm always learning, experimenting, and building solutions that make everyday tasks easier.</p>
              </div>
              <button type="button" className="about-link" onClick={() => setNotice('The About section is planned for a later phase.')}>
                {reduced ? <span>More about me</span> : <SplitText text="More about me" tag="span" splitType="words" effect="fade" from={{ opacity: 0.55 }} to={{ opacity: 1 }} duration={0.35} delay={0.05} trigger="load" textAlign="left" />}
                <span className="about-arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <div className="actions" aria-label="Portfolio actions">
            <PortfolioActionButton variant="primary" reducedMotion={reduced} onClick={() => setNotice('Resume file has not been added yet.')}>
              <DocumentIcon /><span>View Resume</span><span className="action-trailing" aria-hidden="true">↗</span>
            </PortfolioActionButton>
            <PortfolioActionButton variant="secondary" reducedMotion={reduced} onClick={() => setNotice('Contact address has not been added yet.')}>
              <MailIcon /><span>Contact Me</span>
            </PortfolioActionButton>
          </div>
          <p className="action-notice" role="status" aria-live="polite">{notice}</p>

          <div className="statistics" aria-label="Portfolio statistics">
            <Statistic value={5} suffix={'+\u00a0yrs'} label="Creative Design" reduced={reduced} />
            <Statistic value={4} suffix={'\u00a0yrs'} label="Web Development" reduced={reduced} />
            <Statistic value={4} suffix="" label="Featured Projects" reduced={reduced} />
          </div>
        </section>
      </main>
    </div>
  );
}
