import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import './DayNightToggle.css';

type Theme = 'light' | 'dark';

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export default function DayNightToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const transitioning = useRef(false);

  function toggleTheme() {
    if (transitioning.current) return;

    const next: Theme = theme === 'light' ? 'dark' : 'light';
    const applyTheme = () => {
      document.documentElement.dataset.theme = next;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#111216' : '#ffffff');
      try { localStorage.setItem('portfolio-theme', next); } catch { /* Keep the control usable without storage. */ }
      flushSync(() => setTheme(next));
    };

    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyTheme();
      return;
    }

    const rect = buttonRef.current?.querySelector('.theme-track')?.getBoundingClientRect();
    if (!rect) {
      applyTheme();
      return;
    }

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    transitioning.current = true;

    const transition = document.startViewTransition(applyTheme);
    void transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 450, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(() => { /* The theme has still changed if the transition is skipped. */ });
    void transition.finished.finally(() => { transitioning.current = false; });
  }

  return (
    <button
      ref={buttonRef}
      className={`theme-toggle is-${theme}`}
      type="button"
      role="switch"
      aria-label="Switch theme"
      aria-checked={theme === 'dark'}
      onClick={toggleTheme}
    >
      <span className="theme-track" aria-hidden="true">
        <svg className="theme-scene theme-scene-day" viewBox="0 0 92 38" preserveAspectRatio="none">
          <rect width="92" height="38" fill="#79d9f7" />
          <path d="M14 0h26c-2 13-3 25 5 38H14z" fill="#b4edfb" opacity=".78" />
          <path d="M39 0h14c-3 13-3 25 3 38H43C37 25 37 13 39 0z" fill="#9ae6fa" opacity=".8" />
          <path d="M56 0h15c-3 13-2 24 5 38H62C56 26 53 13 56 0z" fill="#8de2f9" opacity=".85" />
          <path d="M35 38c2-7 6-11 12-11 5-7 13-7 18-1 5-7 14-8 20-3 1-8 5-12 10-12v27z" fill="#d9f5fc" />
          <path d="M32 38c4-5 9-7 15-6 6-8 16-8 21-1 6-7 14-7 20-2 2-6 5-8 10-8v17z" fill="#ffffff" />
        </svg>
        <svg className="theme-scene theme-scene-night" viewBox="0 0 92 38" preserveAspectRatio="none">
          <rect width="92" height="38" fill="#080808" />
          <ellipse cx="107" cy="19" rx="81" ry="75" fill="#303030" />
          <ellipse cx="107" cy="19" rx="68" ry="75" fill="#4a4a4a" />
          <ellipse cx="107" cy="19" rx="55" ry="75" fill="#626262" />
          <ellipse cx="107" cy="19" rx="42" ry="75" fill="#777777" />
          <circle cx="12" cy="11" r=".9" fill="white" />
          <circle cx="23" cy="26" r=".7" fill="white" />
          <circle cx="34" cy="8" r=".8" fill="white" />
          <circle cx="44" cy="25" r=".8" fill="white" />
          <path d="m21 8 .7 2.1L24 11l-2.3.8-.7 2.2-.8-2.2L18 11l2.2-.9zM47 11l.5 1.5L49 13l-1.5.5L47 15l-.5-1.5L45 13l1.5-.5z" fill="white" />
        </svg>
        <span className="theme-knob">
          <span className="moon-crater moon-crater-one" />
          <span className="moon-crater moon-crater-two" />
          <span className="moon-crater moon-crater-three" />
        </span>
      </span>
    </button>
  );
}
