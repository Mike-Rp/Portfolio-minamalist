import { experience, projects, stack } from '../homepageData';
import PhotoStack, { type StackPhoto } from './PhotoStack';

type Props = { pathname: string; navigate: (path: string) => void };

function InternalLink({ href, children, navigate, className }: { href: string; children: React.ReactNode; navigate: Props['navigate']; className?: string }) {
  return <a href={href} className={className} onClick={event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    navigate(href);
  }}>{children}</a>;
}

function PageFrame({ title, children, navigate }: { title: string; children: React.ReactNode; navigate: Props['navigate'] }) {
  return <div className="portfolio-page">
    <header className="portfolio-page-header">
      <InternalLink href="/" navigate={navigate} className="page-back">← Home</InternalLink>
      <h1 tabIndex={-1}>{title}</h1>
    </header>
    {children}
    <footer className="portfolio-page-footer">© 2026 Mikhail Respicio</footer>
  </div>;
}

function ExperienceRows({ limit }: { limit?: number }) {
  return <div>{experience.slice(0, limit).map(item => <div className="experience-row" key={`${item.role}-${item.year}`}><div><h3>{item.role}</h3><p>{item.organization}</p></div><time>{item.year}</time></div>)}</div>;
}

function Education() {
  return <section className="page-section" aria-labelledby="education-page-title"><h2 id="education-page-title">Education</h2><div className="experience-row"><div><h3>BS Information Technology</h3><p>STI College</p></div><time>2023</time></div></section>;
}

const aboutPhotos: StackPhoto[] = [
  { src: '/about/1.webp', alt: 'Mikhail wearing medals at an event' },
  { src: '/about/2.webp', alt: 'Mikhail presenting beside a display' },
  { src: '/about/3.webp', alt: 'Mikhail holding an award' },
  { src: '/about/4.webp', alt: 'Mikhail playing badminton' },
  { src: '/about/5.webp', alt: 'Mikhail holding a certificate' },
  { src: '/about/6.webp', alt: 'Mikhail taking a mirror photograph' },
  { src: '/about/7.webp', alt: 'Computer workstation with multiple displays' },
  { src: '/about/8.webp', alt: 'Mikhail speaking beside a projected screen' },
];

function AboutPage({ navigate }: { navigate: Props['navigate'] }) {
  return <div className="portfolio-page about-page">
    <header className="portfolio-page-header">
      <InternalLink href="/" navigate={navigate} className="about-home-link"><span aria-hidden="true">←</span> Home</InternalLink>
      <h1 tabIndex={-1}>More about me</h1>
    </header>
    <PhotoStack photos={aboutPhotos} />
    <section className="about-copy" aria-label="About Mikhail Respicio">
      <div className="about-identity"><h2>Mikhail Respicio</h2><p>Software Developer · UI/UX Designer · Graphic Designer</p></div>
      <p>I'm a developer who enjoys turning ideas into useful, well-designed digital experiences that make everyday tasks easier.</p>
      <p>I enjoy exploring new technologies, designing in Figma, and using AI to improve my development workflow. I like experimenting, solving problems, and finding better ways to bring ideas to life.</p>
      <InternalLink href="/contact" navigate={navigate} className="about-contact-link">Get in touch</InternalLink>
    </section>
    <section className="page-section about-experience" aria-labelledby="about-experience-title"><h2 id="about-experience-title">Experience</h2><ExperienceRows /></section>
    <Education />
    <footer className="portfolio-page-footer">© 2026 Mikhail Respicio</footer>
  </div>;
}

export default function PortfolioPages({ pathname, navigate }: Props) {
  if (pathname === '/about') return <AboutPage navigate={navigate} />;

  if (pathname === '/projects') return <PageFrame title="Projects" navigate={navigate}>
    <section className="page-section" aria-labelledby="projects-page-title"><h2 id="projects-page-title">Featured Projects <span>{String(projects.length).padStart(2, '0')}</span></h2>
      {projects.map(project => <div className="project-row" key={project.title}><div className="project-thumb" aria-hidden="true" /><div className="project-copy"><h3>{project.title}</h3><p>{project.category}</p></div></div>)}
    </section>
  </PageFrame>;

  if (pathname === '/experience') return <PageFrame title="Experience" navigate={navigate}>
    <section className="page-section" aria-labelledby="experience-page-title"><h2 id="experience-page-title">Experience <span>{String(experience.length).padStart(2, '0')}</span></h2><ExperienceRows /></section>
    <Education />
  </PageFrame>;

  if (pathname === '/stack') return <PageFrame title="Stack" navigate={navigate}>
    <section className="page-section" aria-labelledby="stack-page-title"><h2 id="stack-page-title">Stack and Skills</h2>
      {stack.map(group => <div className="stack-row" key={group.category}><h3>{group.category}</h3><p>{group.skills.join(', ')}</p></div>)}
    </section>
  </PageFrame>;

  if (pathname === '/certifications') return <PageFrame title="Certifications" navigate={navigate}>
    <section className="page-section" aria-labelledby="certifications-page-title"><h2 id="certifications-page-title">Certifications</h2><p className="page-empty">Certification details and credential images have not been added yet.</p></section>
  </PageFrame>;

  if (pathname === '/contact') return <PageFrame title="Contact" navigate={navigate}>
    <section className="page-section" aria-labelledby="contact-page-title"><h2 id="contact-page-title">Connect</h2>
      <a className="page-contact-row" href="https://github.com/Mike-Rp" target="_blank" rel="noopener noreferrer"><span>GitHub</span><span>github.com/Mike-Rp ↗</span></a>
      <p className="page-empty">Email and LinkedIn details have not been added yet.</p>
    </section>
  </PageFrame>;

  return <PageFrame title="Page not found" navigate={navigate}><p className="page-empty">This page is not available.</p></PageFrame>;
}
