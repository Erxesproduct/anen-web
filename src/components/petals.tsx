/**
 * Petals drifting slowly upwards (pure CSS, hidden for reduced motion). Positions are fixed, so server and client
 * render the same markup.
 */
const P = [
  [6, 14, 19, 0, 40],
  [18, 10, 23, 6, -30],
  [31, 16, 17, 11, 60],
  [44, 9, 26, 3, -50],
  [58, 13, 21, 9, 30],
  [69, 11, 18, 14, -40],
  [81, 15, 24, 2, 50],
  [92, 10, 20, 8, -20],
] as const;

export function Petals({ count = 8 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {P.slice(0, count).map(([left, s, t, d, x]) => (
        <span key={left} className="petal" style={{ left: `${left}%`, "--s": `${s}px`, "--t": `${t}s`, "--d": `${d}s`, "--x": `${x}px` } as React.CSSProperties} />
      ))}
    </div>
  );
}

/** Soft leaf-branch shadows like the ones across the shop's banner, swaying very slowly. */
export function LeafShadows({ className = "" }: { className?: string }) {
  const branch = (
    <g fill="currentColor">
      <path d="M10 300 C 90 230 160 160 250 20" stroke="currentColor" strokeWidth="3" fill="none" />
      {[
        [40, 270, -40],
        [70, 240, 20],
        [95, 215, -50],
        [125, 185, 15],
        [150, 160, -55],
        [175, 125, 10],
        [200, 95, -60],
        [222, 60, 5],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="34" ry="12" transform={`rotate(${r} ${x} ${y})`} />
      ))}
    </g>
  );
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden text-ink ${className}`} aria-hidden>
      <svg viewBox="0 0 260 320" className="sway absolute -top-10 -left-16 w-[46vw] max-w-[520px] opacity-[0.07] blur-[6px]" style={{ "--t": "13s" } as React.CSSProperties}>
        {branch}
      </svg>
      <svg viewBox="0 0 260 320" className="sway absolute -right-20 -bottom-10 w-[42vw] max-w-[480px] rotate-180 opacity-[0.06] blur-[7px]" style={{ "--t": "17s" } as React.CSSProperties}>
        {branch}
      </svg>
    </div>
  );
}
