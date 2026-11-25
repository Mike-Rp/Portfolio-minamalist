import { designDemoProjects, softwareDemoProjects, type DemoProject } from '../demoProjects';
import './ProjectsShowcase.css';
import ScrollReveal from './ScrollReveal';

function Preview({ project, design = false }: { project: DemoProject; design?: boolean }) {
  return <div className={`showcase-preview${design ? ' is-design' : ''}`}>
    {project.imagePath && !project.placeholder
      ? <img src={project.imagePath} alt={`${project.name} preview`} style={{ objectFit: project.imageFit, objectPosition: project.imagePosition }} loading="lazy" />
      : <div className="showcase-placeholder" aria-label={design ? 'Image placeholder' : 'Project preview'}>
        {design
          ? <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="26" height="22" rx="2" /><circle cx="11" cy="12" r="2" /><path d="m5 24 8-8 5 5 4-4 6 6" /></svg>
          : <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="26" height="20" rx="2" /><path d="M3 10h26M13 28h6M16 25v3" /><circle cx="7" cy="7.5" r=".5" fill="currentColor" stroke="none" /></svg>}
        <span>{design ? 'Image placeholder' : 'Project preview'}</span>
      </div>}
  </div>;
}

function SoftwareCard({ project, index }: { project: DemoProject; index: number }) {
  const destination = project.detailPageUrl || project.projectUrl;
  const arrow = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 19 19 5M8 5h11v11" /></svg>;
  return <article className="software-showcase-card">
    <Preview project={project} />
    <div className="software-showcase-body">
      <p className="showcase-number">{String(index + 1).padStart(2, '0')} / {String(softwareDemoProjects.length).padStart(2, '0')}</p>
      <h3>{project.name}</h3>
      <p className="showcase-description">{project.description}</p>
      <div className="showcase-card-bottom">
        <ul className="showcase-tags" aria-label="Demonstration technologies">{project.technologies.map(tag => <li key={tag}>{tag}</li>)}</ul>
        {destination && !project.placeholder
          ? <a className="showcase-project-action" href={destination} target={project.projectUrl ? '_blank' : undefined} rel={project.projectUrl ? 'noopener noreferrer' : undefined}>View project {arrow}</a>
          : <button className="showcase-project-action" type="button" disabled title="Demo project — destination not available">View project {arrow}</button>}
      </div>
    </div>
  </article>;
}

function DesignItem({ project }: { project: DemoProject }) {
  return <article className="design-showcase-item">
    <Preview project={project} design />
    <h3>{project.name}</h3>
    <p>{project.category}</p>
  </article>;
}

export default function ProjectsShowcase() {
  return <div className="projects-showcase" aria-label="Temporary project layout examples">
    <p className="projects-demo-note">Layout preview · Temporary project content and images</p>
    <section className="showcase-section" aria-labelledby="software-showcase-title">
      <ScrollReveal>
      <h2 id="software-showcase-title"><span>01</span><span aria-hidden="true">—</span> Building Software <span className="showcase-count">(06)</span></h2>
      </ScrollReveal>
      <ScrollReveal className="software-showcase-list" stagger={0.06}>{softwareDemoProjects.map((project, index) => <SoftwareCard key={project.id} project={project} index={index} />)}</ScrollReveal>
    </section>
    <section className="showcase-section" aria-labelledby="design-showcase-title">
      <ScrollReveal>
      <h2 id="design-showcase-title"><span>02</span><span aria-hidden="true">—</span> Graphic Design &amp; UI/UX <span className="showcase-count">(04)</span></h2>
      </ScrollReveal>
      <ScrollReveal className="design-showcase-grid" stagger={0.06}>{designDemoProjects.map(project => <DesignItem key={project.id} project={project} />)}</ScrollReveal>
    </section>
  </div>;
}
