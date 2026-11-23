import { useEffect, useRef, useState } from 'react';
import { switchThemeWithGrain } from './themeGrainTransition';
import './DayNightToggle.css';

type Theme = 'light' | 'dark';
const currentTheme = (): Theme => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

export default function DayNightToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme);
  const transitioning = useRef(false);

  useEffect(() => {
    const sync = () => setTheme(currentTheme());
    window.addEventListener('portfolio-theme-change', sync);
    return () => window.removeEventListener('portfolio-theme-change', sync);
  }, []);

  function toggleTheme() {
    if (transitioning.current) return;
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    const apply = () => {
      document.documentElement.dataset.theme = next;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#111216' : '#ffffff');
      try { localStorage.setItem('portfolio-theme', next); } catch { /* The button still works without storage. */ }
      setTheme(next);
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply();
      return;
    }
    transitioning.current = true;
    void switchThemeWithGrain(apply).finally(() => { transitioning.current = false; });
  }

  return <button className="theme-toggle" type="button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} aria-pressed={theme === 'dark'} onClick={toggleTheme}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="8" cy="8" r="5.75" /><path d="M8 2.25a5.75 5.75 0 0 1 0 11.5z" fill="currentColor" /></svg>
  </button>;
}
