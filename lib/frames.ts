import { readdirSync } from "node:fs";
import { join } from "node:path";

export interface FrameSet {
  /** Public URL of the folder, e.g. /frames/hero-bg/desktop */
  path: string;
  count: number;
  /** Digits in the file names (0001.webp → 4). */
  pad: number;
}

export interface FrameSources {
  desktop?: FrameSet;
  mobile?: FrameSet;
}

function readSet(publicPath: string): FrameSet | undefined {
  try {
    const files = readdirSync(join(process.cwd(), "public", publicPath))
      .filter((f) => /^\d+\.webp$/.test(f))
      .sort();
    if (files.length < 2) return undefined;
    return { path: publicPath, count: files.length, pad: files[0]!.length - ".webp".length };
  } catch {
    return undefined;
  }
}

/**
 * Finds an optional video-frame sequence in public/frames/<name>/. Supports
 * desktop/ and mobile/ subfolders, or a single folder used for both.
 * Returns undefined when no frames are present, so callers fall back to stills.
 * Runs on the server at build time (synchronous file reads are prerender-safe).
 */
export function getFrameSources(name: string): FrameSources | undefined {
  const base = `/frames/${name}`;
  const desktop = readSet(`${base}/desktop`);
  const mobile = readSet(`${base}/mobile`);
  if (desktop || mobile) return { desktop, mobile };
  const flat = readSet(base);
  return flat ? { desktop: flat, mobile: flat } : undefined;
}
