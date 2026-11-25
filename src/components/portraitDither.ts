const CELL = 4;
const BAND = 44;

// A stable threshold per cell keeps the boundary irregular without flickering.
function threshold(x: number, y: number) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function portraitDitherMask(progress: number, width: number, height: number) {
  const boundary = progress * (height + BAND) - BAND / 2;
  const solidEnd = Math.max(0, Math.min(height, Math.floor((boundary - BAND / 2) / CELL) * CELL));
  const paths = [`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" shape-rendering="crispEdges">`];
  if (solidEnd) paths.push(`<path fill="white" d="M0 0H${width}V${solidEnd}H0Z"/>`);
  for (let y = solidEnd; y < Math.min(height, boundary + BAND / 2); y += CELL) {
    const coverage = Math.max(0, Math.min(1, (boundary + BAND / 2 - y) / BAND));
    for (let x = 0; x < width; x += CELL) {
      if (threshold(x / CELL, y / CELL) < coverage) paths.push(`<path fill="white" d="M${x} ${y}h${CELL}v${CELL}h-${CELL}z"/>`);
    }
  }
  paths.push('</svg>');
  return `url("data:image/svg+xml,${encodeURIComponent(paths.join(''))}")`;
}
