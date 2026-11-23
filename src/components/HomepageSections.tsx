import { useEffect, useState } from 'react';
import { experience, projects, stack } from '../homepageData';

type ContributionDay = { date: string; count: number; level: number };
type ContributionData = { days: ContributionDay[]; total: number };
const contributionUrl = 'https://github-contributions-api.jogruber.de/v4/Mike-Rp?y=last';
const cacheKey = 'mikhail-github-contributions-v1';

function SectionHeading({ id, children, count }: { id: string; children: string; count?: number }) {
  return <div className="editorial-heading"><h2 id={id}>{children}</h2>{count !== undefined && <span>{String(count).padStart(2, '0')}</span>}</div>;
}

function ExperienceSection() {
  const [expanded, setExpanded] = useState(false);
  return <section className="editorial-section" aria-labelledby="experience-title">
    <SectionHeading id="experience-title" count={experience.length}>Experience</SectionHeading>
    <div id="experience-list">
      {experience.slice(0, expanded ? experience.length : 3).map(item => <div className="experience-row" key={`${item.role}-${item.year}`}>
        <div><h3>{item.role}</h3><p>{item.organization}</p></div><time>{item.year}</time>
      </div>)}
    </div>
    <button className="editorial-more" type="button" aria-expanded={expanded} aria-controls="experience-list" onClick={() => setExpanded(value => !value)}>{expanded ? 'Show less' : '+ 3 more'}</button>
    <div className="education-block">
      <h3 className="editorial-subheading">Education</h3>
      <div className="experience-row"><div><h4>BS Information Technology</h4><p>STI College</p></div><time>2023</time></div>
    </div>
  </section>;
}

function ProjectsSection() {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? projects : projects.slice(0, 3);
  return <section className="editorial-section" aria-labelledby="projects-title">
    <SectionHeading id="projects-title" count={projects.length}>Featured Projects</SectionHeading>
    <div id="projects-list">
      {shown.map((project, index) => <div className={`project-row${!expanded && index === 2 ? ' is-preview' : ''}`} key={project.title}>
        <div className="project-thumb" aria-hidden="true" />
        <div className="project-copy"><h3>{project.title}</h3><p>{project.category}</p></div>
      </div>)}
    </div>
    <button className="editorial-more" type="button" aria-expanded={expanded} aria-controls="projects-list" onClick={() => setExpanded(value => !value)}>{expanded ? 'Show less' : '+ 10 more'}</button>
  </section>;
}

function StackSection() {
  return <section className="editorial-section" aria-labelledby="stack-title">
    <SectionHeading id="stack-title">Stack and Skills</SectionHeading>
    <div>{stack.map(group => <div className="stack-row" key={group.category}><h3>{group.category}</h3><p>{group.skills.join(', ')}</p></div>)}</div>
  </section>;
}

function validContributionData(value: unknown): ContributionData | null {
  if (!value || typeof value !== 'object') return null;
  const input = value as { contributions?: unknown; total?: { lastYear?: unknown } };
  if (!Array.isArray(input.contributions) || typeof input.total?.lastYear !== 'number') return null;
  const days = input.contributions.filter((day): day is ContributionDay =>
    typeof day?.date === 'string' && typeof day?.count === 'number' && typeof day?.level === 'number');
  return days.length >= 300 ? { days, total: input.total.lastYear } : null;
}

function ContributionsSection() {
  const [data, setData] = useState<ContributionData | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');

  useEffect(() => {
    const controller = new AbortController();
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null') as { saved?: number; data?: ContributionData } | null;
      if (cached?.saved && Date.now() - cached.saved < 12 * 60 * 60 * 1000 && cached.data) {
        setData(cached.data);
        setStatus('ready');
        return () => controller.abort();
      }
    } catch { /* Ignore an invalid cache entry. */ }
    fetch(contributionUrl, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Contribution request failed'); return response.json() as Promise<unknown>; })
      .then(value => {
        const parsed = validContributionData(value);
        if (!parsed) throw new Error('Invalid contribution data');
        setData(parsed);
        setStatus('ready');
        try { localStorage.setItem(cacheKey, JSON.stringify({ saved: Date.now(), data: parsed })); } catch { /* Storage is optional. */ }
      })
      .catch(error => { if (error instanceof Error && error.name !== 'AbortError') setStatus('unavailable'); });
    return () => controller.abort();
  }, []);

  const days = data?.days ?? [];
  return <section className="editorial-section" aria-labelledby="github-title">
    <div className="editorial-heading"><h2 id="github-title">GitHub Contributions</h2><a href="https://github.com/Mike-Rp" target="_blank" rel="noopener noreferrer">View GitHub ↗</a></div>
    {status === 'ready' && data ? <>
      <p className="contribution-total">{data.total.toLocaleString()} contributions in the last year</p>
      <div className="contribution-scroll" role="img" aria-label={`${data.total.toLocaleString()} GitHub contributions in the last year`}>
        <div className="contribution-grid">{days.map(day => <span key={day.date} className={`contribution-day level-${Math.max(0, Math.min(4, day.level))}`} title={`${day.count} ${day.count === 1 ? 'contribution' : 'contributions'} on ${day.date}`} />)}</div>
      </div>
      <div className="contribution-legend" aria-hidden="true">Less <span className="level-0" /><span className="level-1" /><span className="level-2" /><span className="level-3" /><span className="level-4" /> More</div>
    </> : <p className="contribution-status" role="status">{status === 'loading' ? 'Loading contribution activity…' : 'Contribution activity is unavailable right now.'}</p>}
  </section>;
}

export default function HomepageSections() {
  return <div className="homepage-sections"><ExperienceSection /><ProjectsSection /><StackSection /><ContributionsSection /></div>;
}
