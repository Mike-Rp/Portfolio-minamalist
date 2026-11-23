const DURATION = 820;
const CELL = 7;
const BAND = 100;

function maskAt(progress: number, width: number, height: number): string {
  if (progress <= 0) return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E';
  const boundary = progress * (height + BAND) - BAND / 2;
  const solidEnd = Math.max(0, Math.min(height, boundary - BAND / 2));
  const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">`];
  if (solidEnd > 0) parts.push(`<path fill="white" d="M0 0H${width}V${solidEnd}H0Z"/>`);

  const startRow = Math.max(0, Math.floor(solidEnd / CELL));
  const endRow = Math.min(Math.ceil(height / CELL), Math.ceil((boundary + BAND / 2) / CELL));
  for (let row = startRow; row < endRow; row++) {
    const y = row * CELL;
    const chance = Math.max(0, Math.min(1, (boundary + BAND / 2 - y) / BAND));
    for (let x = 0; x < width; x += CELL) {
      if (Math.random() < chance) parts.push(`<path fill="white" d="M${x} ${y}h${CELL}v${CELL}h-${CELL}z"/>`);
    }
  }
  parts.push('</svg>');
  return `data:image/svg+xml,${encodeURIComponent(parts.join(''))}`;
}

export async function switchThemeWithGrain(applyTheme: () => void): Promise<void> {
  if (!document.startViewTransition || !CSS.supports('mask-image', 'url("data:image/svg+xml,%3Csvg/%3E")')) {
    applyTheme();
    return;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const style = document.createElement('style');
  style.dataset.themeGrain = '';
  const setMask = (progress: number) => {
    const mask = maskAt(progress, width, height);
    style.textContent = `::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}::view-transition-old(root){z-index:1}::view-transition-new(root){z-index:2;mask-image:url("${mask}");mask-size:100% 100%;mask-repeat:no-repeat}`;
  };
  setMask(0);
  document.head.append(style);

  let applied = false;
  let frame = 0;
  let skipTransition: (() => void) | undefined;
  try {
    const transition = document.startViewTransition(() => { applyTheme(); applied = true; });
    skipTransition = () => transition.skipTransition();
    await transition.ready;
    const hold = document.documentElement.animate({ opacity: [1, 1] }, {
      duration: DURATION,
      easing: 'linear',
      fill: 'both',
      pseudoElement: '::view-transition-new(root)',
    });
    const start = performance.now();
    await new Promise<void>(resolve => {
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / DURATION);
        setMask(progress);
        if (progress < 1) frame = requestAnimationFrame(tick);
        else resolve();
      };
      frame = requestAnimationFrame(tick);
    });
    await hold.finished;
    await transition.finished;
  } catch {
    skipTransition?.();
    if (!applied) applyTheme();
  } finally {
    cancelAnimationFrame(frame);
    style.remove();
  }
}
