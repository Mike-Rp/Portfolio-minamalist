import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { designDemoProjects, softwareDemoProjects, type DemoProject } from '../demoProjects';
import './ProjectsShowcase.css';

gsap.registerPlugin(ScrollTrigger);

function Preview({ project, index, design = false }: { project: DemoProject; index: number; design?: boolean }) {
  return <div className={`showcase-preview${design ? ' is-design' : ''}`}>
    {project.imagePath && !project.placeholder
      ? <img src={project.imagePath} alt={`${project.name} preview`} style={{ objectFit: project.imageFit, objectPosition: project.imagePosition }} loading="lazy" />
      : <div className={`showcase-placeholder tone-${index % 6}`} role="img" aria-label={`${project.name} ${design ? 'artwork' : 'project'} placeholder`}>
        {design
          ? <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="26" height="22" rx="2" /><circle cx="11" cy="12" r="2" /><path d="m5 24 8-8 5 5 4-4 6 6" /></svg>
          : <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="26" height="20" rx="2" /><path d="M3 10h26M13 28h6M16 25v3" /><circle cx="7" cy="7.5" r=".5" fill="currentColor" stroke="none" /></svg>}
        <span>{String(index + 1).padStart(2, '0')} / {design ? '04' : '06'}</span>
        <small>{design ? 'Image placeholder' : 'Project preview'}</small>
      </div>}
  </div>;
}

function ProjectCard({ project, index, design = false }: { project: DemoProject; index: number; design?: boolean }) {
  const destination = project.detailPageUrl || project.projectUrl;
  const arrow = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 19 19 5M8 5h11v11" /></svg>;
  return <article className="software-showcase-card" style={{ '--stack-offset': `${76 + index * 18}px`, '--stack-layer': index + 1 } as CSSProperties}>
    <Preview project={project} index={index} design={design} />
    <div className="software-showcase-body">
      <p className="showcase-number">{String(index + 1).padStart(2, '0')} / {String(design ? designDemoProjects.length : softwareDemoProjects.length).padStart(2, '0')}</p>
      <h3>{project.name}</h3>
      {design && <p className="showcase-category">{project.category}</p>}
      {project.description && <p className="showcase-description">{project.description}</p>}
      <div className="showcase-card-bottom">
        {project.technologies.length > 0 && <ul className="showcase-tags" aria-label="Demonstration technologies">{project.technologies.map(tag => <li key={tag}>{tag}</li>)}</ul>}
        {destination && !project.placeholder
          ? <a className="showcase-project-action" href={destination} target={project.projectUrl ? '_blank' : undefined} rel={project.projectUrl ? 'noopener noreferrer' : undefined}>View project {arrow}</a>
          : <button className="showcase-project-action" type="button" disabled title="Demo project — destination not available">View project {arrow}</button>}
      </div>
    </div>
  </article>;
}

export default function ProjectsShowcase() {
  const softwareRef = useRef<HTMLDivElement>(null);
  const designRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stacks = [softwareRef.current, designRef.current].filter((stack): stack is HTMLDivElement => Boolean(stack));
    if (stacks.length !== 2) return;

    const media = gsap.matchMedia();
    media.add('(min-width: 701px) and (prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {});
      try {
        context.add(() => {
          stacks.forEach(stack => {
            const cards = Array.from(stack.querySelectorAll<HTMLElement>('.software-showcase-card'));
            cards.slice(0, -1).forEach((card, index) => {
              gsap.fromTo(card, { scale: 1 }, {
                scale: 0.97,
                ease: 'none',
                scrollTrigger: {
                  trigger: cards[index + 1],
                  start: 'top bottom',
                  end: () => `top top+=${76 + (index + 1) * 18}`,
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              });
            });
          });
        });
      } catch {
        context.revert();
        gsap.set(stacks.flatMap(stack => Array.from(stack.children)), { clearProps: 'transform' });
        return;
      }

      let refreshFrame = 0;
      const refresh = () => {
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(refresh);
      stacks.forEach(stack => observer?.observe(stack));
      const images = stacks.flatMap(stack => Array.from(stack.querySelectorAll('img')));
      images.forEach(image => image.addEventListener('load', refresh));
      refresh();

      return () => {
        cancelAnimationFrame(refreshFrame);
        observer?.disconnect();
        images.forEach(image => image.removeEventListener('load', refresh));
        context.revert();
      };
    });
    return () => media.revert();
  }, []);

  return <div className="projects-showcase" aria-label="Temporary project layout examples">
    <p className="projects-demo-note">Layout preview · Temporary project content and images</p>
    <section className="showcase-section" aria-labelledby="software-showcase-title">
      <div className="showcase-sticky-heading"><h2 id="software-showcase-title"><span>01</span><span aria-hidden="true">—</span> Building Software <span className="showcase-count">(06)</span></h2></div>
      <div ref={softwareRef} className="software-showcase-list">{softwareDemoProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
    </section>
    <section className="showcase-section" aria-labelledby="design-showcase-title">
      <div className="showcase-sticky-heading"><h2 id="design-showcase-title"><span>02</span><span aria-hidden="true">—</span> Graphic Design &amp; UI/UX <span className="showcase-count">(04)</span></h2></div>
      <div ref={designRef} className="software-showcase-list">{designDemoProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} design />)}</div>
    </section>
  </div>;
}
