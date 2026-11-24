import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';

export type StackPhoto = { src: string; alt: string; fit?: 'cover' | 'contain' };

export default function PhotoStack({ photos, interval = 3800 }: { photos: StackPhoto[]; interval?: number }) {
  const count = photos.length;
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState(0);
  const [settled, setSettled] = useState(true);
  const [fits, setFits] = useState<Record<number, 'cover' | 'contain'>>({});
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const activeRef = useRef(0);
  const paused = useRef(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const advance = useCallback((target: number) => {
    if (count < 2) return;
    setPrevious(activeRef.current);
    activeRef.current = ((target % count) + count) % count;
    setActive(activeRef.current);
    setSettled(false);
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => setSettled(true), 40);
  }, [count]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (count < 2 || reduced) return;
    const timer = window.setInterval(() => {
      if (!paused.current && !document.hidden) advance(activeRef.current + 1);
    }, interval);
    return () => window.clearInterval(timer);
  }, [count, interval, reduced, advance]);

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  const relative = (index: number, center: number) => {
    const half = Math.floor(count / 2);
    let distance = index - center;
    if (distance > half) distance -= count;
    if (distance < -(half - (count % 2 === 0 ? 1 : 0))) distance += count;
    return distance;
  };

  if (!count) return null;

  return <div className="photo-stack">
    <div className="photo-stack-cards" role="group" aria-roledescription="carousel" aria-label="About photographs"
      onPointerEnter={event => { if (event.pointerType === 'mouse') paused.current = true; }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') paused.current = false; }}
      onFocusCapture={() => { paused.current = true; }}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) paused.current = false; }}>
      {photos.map((photo, index) => {
        const distance = relative(index, active);
        const before = relative(index, previous);
        const jumped = Math.abs(distance - before) > Math.floor(count / 2);
        const arrival = jumped && !reduced ? (settled ? ' is-arriving' : ' is-jumping') : '';
        return <button key={photo.src} type="button" className={`photo-card${arrival}`} style={{ '--d': distance, '--a': Math.abs(distance), zIndex: count - Math.abs(distance) } as CSSProperties}
          aria-label={`${photo.alt}, photo ${index + 1} of ${count}${distance === 0 ? '. Click to show the next photo' : '. Click to bring forward'}`}
          aria-current={distance === 0 ? 'true' : undefined}
          onClick={() => advance(distance === 0 ? active + 1 : index)}>
          {failed[index] ? <span className="photo-card-empty">Photo {index + 1} unavailable</span> :
            <img src={photo.src} alt="" draggable={false} loading={Math.abs(distance) < 2 ? 'eager' : 'lazy'}
              className={photo.fit ?? fits[index] ?? 'contain'}
              onLoad={event => {
                if (photo.fit) return;
                const image = event.currentTarget;
                const ratio = image.naturalWidth / image.naturalHeight;
                const fit = Math.abs(ratio - 0.8) <= 0.08 ? 'cover' : 'contain';
                setFits(current => current[index] === fit ? current : { ...current, [index]: fit });
              }}
              onError={() => setFailed(current => ({ ...current, [index]: true }))} />}
        </button>;
      })}
    </div>
    <div className="photo-dots" aria-label={`Photo ${active + 1} of ${count}`}>
      {photos.map((photo, index) => <span key={photo.src} className={index === active ? 'is-active' : ''} aria-hidden="true" />)}
    </div>
    <span className="photo-hint">Click the stack to shuffle</span>
  </div>;
}
