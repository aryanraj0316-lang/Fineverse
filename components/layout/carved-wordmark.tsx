/**
 * "Fineverse" cut into the terrace floor. An SVG filter draws the cut: the
 * floor of each letter is a soft darkening of the stone (multiplied onto the
 * photo, so its texture shows through) and the far wall, just inside each
 * letter's top edge, is in deeper shadow. The plane is then laid flat in
 * perspective with CSS (see .carve-plane in globals.css).
 *
 * `textLength` makes the word fill the stage exactly, whatever the font metrics.
 */
export function CarvedWordmark() {
  return (
    <div aria-hidden className="carve-stage">
      <svg className="carve-plane carve-plane--wide" viewBox="0 0 1000 196" preserveAspectRatio="xMidYMax meet">
        <CarveFilter id="carve-wide" />
        <text x="500" y="194" textAnchor="middle" textLength="976" {...textProps} filter="url(#carve-wide)">
          Fineverse
        </text>
      </svg>
      <svg className="carve-plane carve-plane--stacked" viewBox="0 0 1000 730" preserveAspectRatio="xMidYMax meet">
        <CarveFilter id="carve-stacked" />
        <text x="12" y="342" {...textProps} fontSize="493" filter="url(#carve-stacked)">
          Fine
        </text>
        <text x="12" y="726" textLength="976" {...textProps} fontSize="493" filter="url(#carve-stacked)">
          verse
        </text>
      </svg>
    </div>
  );
}

const textProps = {
  fontSize: 280,
  fontWeight: 900,
  lengthAdjust: "spacingAndGlyphs",
  fill: "rgb(84 40 26)",
  style: { fontStretch: "70%", letterSpacing: "-0.04em" },
} as const;

function CarveFilter({ id }: { id: string }) {
  return (
    <defs>
      <filter id={id} x="-2%" y="-10%" width="104%" height="120%" colorInterpolationFilters="sRGB">
        {/* Floor of the cut */}
        <feFlood floodColor="rgb(84 40 26)" floodOpacity="0.42" result="floorColour" />
        <feComposite in="floorColour" in2="SourceAlpha" operator="in" result="floor" />
        {/* Far wall: the band inside the top edge, uncovered when the letter shifts down */}
        <feOffset in="SourceAlpha" dy="14" result="shifted" />
        <feComposite in="SourceAlpha" in2="shifted" operator="out" result="wallShape" />
        <feGaussianBlur in="wallShape" stdDeviation="1.2" result="wallSoft" />
        <feFlood floodColor="rgb(36 16 10)" floodOpacity="0.72" result="wallColour" />
        <feComposite in="wallColour" in2="wallSoft" operator="in" result="wall" />
        <feMerge>
          <feMergeNode in="floor" />
          <feMergeNode in="wall" />
        </feMerge>
      </filter>
    </defs>
  );
}
