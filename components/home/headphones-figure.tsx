/**
 * Hush Headphones as a layered technical figure, used until the exploded
 * renders (or a `headphones-explode` frame sequence) arrive. Each part is its
 * own group so the Electronics world can pull them apart on scroll.
 * viewBox 0 0 800 640. Part anchors (for leader lines) are in PART_ANCHORS.
 */
export const PART_ANCHORS = {
  headband: { x: 400, y: 132 },
  cushion: { x: 300, y: 430 },
  driver: { x: 262, y: 430 },
  shell: { x: 600, y: 470 },
  mic: { x: 640, y: 400 },
} as const;

export function HeadphonesFigure() {
  return (
    <svg viewBox="0 0 800 640" className="h-auto w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="hp-shell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a40" />
          <stop offset="0.35" stopColor="#1c1c20" />
          <stop offset="1" stopColor="#0d0d10" />
        </linearGradient>
        <linearGradient id="hp-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4a52" />
          <stop offset="1" stopColor="#141417" />
        </linearGradient>
        <radialGradient id="hp-cushion" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#2e2e33" />
          <stop offset="1" stopColor="#121215" />
        </radialGradient>
        <radialGradient id="hp-driver" cx="0.5" cy="0.45" r="0.55">
          <stop offset="0" stopColor="#5b5b63" />
          <stop offset="0.5" stopColor="#25252a" />
          <stop offset="1" stopColor="#101013" />
        </radialGradient>
      </defs>

      <g data-part="headband">
        <path d="M200 330 C 200 96, 600 96, 600 330" fill="none" stroke="url(#hp-band)" strokeWidth="34" strokeLinecap="round" />
        <path d="M222 318 C 226 128, 574 128, 578 318" fill="none" stroke="#202024" strokeWidth="12" strokeLinecap="round" />
        <path d="M206 300 C 214 120, 586 120, 594 300" fill="none" stroke="rgb(255 255 255 / 0.16)" strokeWidth="1.5" />
        <rect x="188" y="300" width="24" height="70" rx="6" fill="#2a2a2f" />
        <rect x="588" y="300" width="24" height="70" rx="6" fill="#2a2a2f" />
      </g>

      {/* Left side, pulled apart: shell (outside), driver, cushion (inside) */}
      <g data-part="shell-left">
        <ellipse cx="200" cy="440" rx="78" ry="112" fill="url(#hp-shell)" />
        <ellipse cx="200" cy="440" rx="78" ry="112" fill="none" stroke="rgb(255 255 255 / 0.14)" strokeWidth="1.5" />
        <ellipse cx="188" cy="402" rx="30" ry="44" fill="rgb(255 255 255 / 0.04)" />
      </g>
      <g data-part="driver-left">
        <circle cx="262" cy="430" r="52" fill="url(#hp-driver)" />
        <circle cx="262" cy="430" r="52" fill="none" stroke="rgb(255 255 255 / 0.18)" strokeWidth="1.2" />
        <circle cx="262" cy="430" r="30" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="1" />
        <circle cx="262" cy="430" r="9" fill="#3d3d44" />
      </g>
      <g data-part="cushion-left">
        <ellipse cx="300" cy="440" rx="40" ry="98" fill="url(#hp-cushion)" />
        <ellipse cx="300" cy="440" rx="40" ry="98" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="1.2" />
      </g>

      {/* Right side mirrored */}
      <g data-part="cushion-right">
        <ellipse cx="500" cy="440" rx="40" ry="98" fill="url(#hp-cushion)" />
        <ellipse cx="500" cy="440" rx="40" ry="98" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="1.2" />
      </g>
      <g data-part="driver-right">
        <circle cx="538" cy="430" r="52" fill="url(#hp-driver)" />
        <circle cx="538" cy="430" r="52" fill="none" stroke="rgb(255 255 255 / 0.18)" strokeWidth="1.2" />
        <circle cx="538" cy="430" r="30" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="1" />
        <circle cx="538" cy="430" r="9" fill="#3d3d44" />
      </g>
      <g data-part="shell-right">
        <ellipse cx="600" cy="440" rx="78" ry="112" fill="url(#hp-shell)" />
        <ellipse cx="600" cy="440" rx="78" ry="112" fill="none" stroke="rgb(255 255 255 / 0.14)" strokeWidth="1.5" />
        <ellipse cx="612" cy="402" rx="30" ry="44" fill="rgb(255 255 255 / 0.04)" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={636 + i * 2} cy={392 + i * 12} r="2.2" fill="#5b5b63" />
        ))}
      </g>
    </svg>
  );
}
