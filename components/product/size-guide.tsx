"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import type { SizeGuideKind } from "@/lib/commerce";

const TOPS = {
  head: ["Size", "Chest (cm)", "Length (cm)", "Sleeve (cm)"],
  rows: [
    ["S", "96–101", "70", "61"],
    ["M", "102–107", "72", "62"],
    ["L", "108–113", "74", "63"],
    ["XL", "114–119", "76", "64"],
    ["XXL", "120–125", "78", "65"],
  ],
};
const TROUSERS = {
  head: ["Waist", "Waist (cm)", "Hip (cm)", "Inseam (cm)"],
  rows: [
    ["28", "71–73", "92", "78"],
    ["30", "76–78", "97", "78"],
    ["32", "81–83", "102", "79"],
    ["34", "86–88", "107", "79"],
    ["36", "91–93", "112", "80"],
  ],
};

export function SizeGuide({ kind }: { kind: SizeGuideKind }) {
  const [open, setOpen] = useState(false);
  const table = kind === "tops" ? TOPS : TROUSERS;
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-small underline underline-offset-4">
        <Ruler aria-hidden className="size-4" strokeWidth={1.5} />
        Size guide
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Size guide">
        <div className="p-5">
          <figure>
            {kind === "tops" ? <TopDiagram /> : <TrouserDiagram />}
            <figcaption className="mt-3 text-small text-basalt/75">
              Measure your body, not the garment. Between sizes? For a boxier fit, size up.
            </figcaption>
          </figure>
          <table className="mt-6 w-full text-left text-small" data-price>
            <thead>
              <tr className="border-b border-basalt/15">
                {table.head.map((h) => (
                  <th key={h} scope="col" className="py-2 pr-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((r) => (
                <tr key={r[0]} className="border-b border-basalt/10">
                  {r.map((c, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="py-2 pr-3 font-semibold">
                        {c}
                      </th>
                    ) : (
                      <td key={i} className="py-2 pr-3">
                        {c}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Dialog>
    </>
  );
}

const line = { stroke: "#0039fe", strokeWidth: 2, markerStart: "url(#arrow)", markerEnd: "url(#arrow)" } as const;

function Defs() {
  return (
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10z" fill="#0039fe" />
      </marker>
    </defs>
  );
}

function TopDiagram() {
  return (
    <svg viewBox="0 0 360 260" className="mx-auto w-full max-w-sm" role="img" aria-label="Shirt diagram showing chest across, length from shoulder to hem, and sleeve from shoulder to cuff">
      <Defs />
      <path d="M130 30 L160 22 Q180 40 200 22 L230 30 L300 70 L280 110 L250 95 L250 240 L110 240 L110 95 L80 110 L60 70 Z" fill="#d6ccbc" stroke="#1d1c1a" strokeWidth="1.5" />
      <line x1="114" y1="120" x2="246" y2="120" {...line} />
      <text x="180" y="112" textAnchor="middle" fontSize="12" fill="#1d1c1a">Chest</text>
      <line x1="268" y1="32" x2="268" y2="238" {...line} transform="translate(46 0)" />
      <text x="322" y="140" fontSize="12" fill="#1d1c1a">Length</text>
      <line x1="232" y1="36" x2="292" y2="76" {...line} transform="translate(8 -14)" />
      <text x="262" y="38" fontSize="12" fill="#1d1c1a">Sleeve</text>
    </svg>
  );
}

function TrouserDiagram() {
  return (
    <svg viewBox="0 0 360 280" className="mx-auto w-full max-w-sm" role="img" aria-label="Trousers diagram showing waist across, hip across, and inseam from crotch to hem">
      <Defs />
      <path d="M110 20 L250 20 L262 270 L196 270 L180 110 L164 270 L98 270 Z" fill="#d6ccbc" stroke="#1d1c1a" strokeWidth="1.5" />
      <line x1="112" y1="34" x2="248" y2="34" {...line} />
      <text x="180" y="54" textAnchor="middle" fontSize="12" fill="#1d1c1a">Waist</text>
      <line x1="106" y1="80" x2="254" y2="80" {...line} />
      <text x="180" y="98" textAnchor="middle" fontSize="12" fill="#1d1c1a">Hip</text>
      <line x1="186" y1="118" x2="202" y2="266" {...line} />
      <text x="214" y="200" fontSize="12" fill="#1d1c1a">Inseam</text>
    </svg>
  );
}
