import type { KitSlot } from "@/lib/commerce";

/**
 * A pose in stage coordinates.
 * x, y: centre of the item as a % of the stage width / height.
 * w: width as a % of the stage width. Landscape: the viewport width, capped at
 *    16:9 of its height. Portrait: the viewport width, capped at 390:844 of its
 *    height (see .hero --pw in globals.css), so tablets keep the phone layout.
 * r: rotation in degrees.
 */
export interface Pose {
  x: number;
  y: number;
  w: number;
  r?: number;
}

/** A soft floor shadow: centre (% of stage), width (% of the item's start width), opacity. */
export interface ShadowPose {
  x: number;
  y: number;
  w: number;
  opacity: number;
}

/** start = the mockup. mid = end of beat 1 (drifted apart). landed = on the floor. */
export interface Choreography {
  start: Pose;
  mid: Pose;
  landed: Pose;
  shadow: { start: ShadowPose; landed: ShadowPose };
}

export interface HeroItem {
  slot: KitSlot;
  src: string;
  width: number;
  height: number;
  /** Behind or in front of the wordmark. */
  layer: "back" | "front";
  /** Landing order in beat 2 (0 lands first). */
  order: number;
  desktop: Choreography;
  mobile: Choreography;
}

/**
 * Tune the hero here. Start poses are measured from reference/home-hero.png
 * (1672 × 941); landed poses put every product's base on the floor line
 * (about 86% down on landscape screens). Add `?debug` to the URL to see
 * progress and beat markers while you tune.
 */
export const heroItems: HeroItem[] = [
  {
    slot: "earbuds",
    src: "/hero/items/earbuds.png",
    width: 869,
    height: 851,
    layer: "back",
    order: 1,
    desktop: {
      start: { x: 36.5, y: 19, w: 12.6 },
      mid: { x: 30, y: 11, w: 12, r: -8 },
      landed: { x: 33, y: 79.7, w: 8 },
      shadow: {
        start: { x: 33, y: 84, w: 104, opacity: 0.25 },
        landed: { x: 32, y: 86.2, w: 75, opacity: 0.55 },
      },
    },
    mobile: {
      start: { x: 80, y: 14, w: 30 },
      mid: { x: 84, y: 9, w: 28, r: -8 },
      landed: { x: 72, y: 57, w: 20 },
      shadow: {
        start: { x: 74, y: 80, w: 91, opacity: 0.2 },
        landed: { x: 71, y: 62, w: 75, opacity: 0.45 },
      },
    },
  },
  {
    slot: "sunglasses",
    src: "/hero/items/sunglasses.png",
    width: 1325,
    height: 566,
    layer: "back",
    order: 3,
    desktop: {
      start: { x: 71.9, y: 18.5, w: 26 },
      mid: { x: 80, y: 10, w: 24, r: 6 },
      landed: { x: 67, y: 81.6, w: 13 },
      shadow: {
        start: { x: 68, y: 83, w: 85, opacity: 0.25 },
        landed: { x: 66, y: 86, w: 48, opacity: 0.5 },
      },
    },
    mobile: {
      start: { x: 58, y: 29, w: 58 },
      mid: { x: 62, y: 24, w: 54, r: 5 },
      landed: { x: 72, y: 69.5, w: 32 },
      shadow: {
        start: { x: 54, y: 80, w: 78, opacity: 0.2 },
        landed: { x: 71, y: 73.2, w: 55, opacity: 0.42 },
      },
    },
  },
  {
    slot: "watch",
    src: "/hero/items/watch.png",
    width: 965,
    height: 1048,
    layer: "front",
    order: 0,
    desktop: {
      start: { x: 22.6, y: 49.9, w: 21.2 },
      mid: { x: 14, y: 44, w: 22.5, r: -6 },
      landed: { x: 16, y: 78.2, w: 9 },
      shadow: {
        start: { x: 19, y: 88, w: 111, opacity: 0.56 },
        landed: { x: 15, y: 86.4, w: 40, opacity: 0.6 },
      },
    },
    mobile: {
      start: { x: 27, y: 50, w: 46 },
      mid: { x: 20, y: 46, w: 48, r: -6 },
      landed: { x: 28, y: 57, w: 19 },
      shadow: {
        start: { x: 24, y: 83, w: 104, opacity: 0.47 },
        landed: { x: 27, y: 62.2, w: 70, opacity: 0.5 },
      },
    },
  },
  {
    slot: "overshirt",
    src: "/hero/items/overshirt.png",
    width: 1078,
    height: 906,
    layer: "front",
    order: 2,
    desktop: {
      start: { x: 53.5, y: 56.7, w: 31.2 },
      mid: { x: 56, y: 52, w: 33, r: 4 },
      landed: { x: 50, y: 76.6, w: 14 },
      shadow: {
        start: { x: 50, y: 90, w: 104, opacity: 0.62 },
        landed: { x: 49, y: 86.4, w: 42, opacity: 0.62 },
      },
    },
    mobile: {
      start: { x: 67, y: 57, w: 60 },
      mid: { x: 72, y: 54, w: 62, r: 4 },
      landed: { x: 28, y: 69, w: 23 },
      shadow: {
        start: { x: 63, y: 84, w: 104, opacity: 0.53 },
        landed: { x: 27, y: 73.9, w: 70, opacity: 0.5 },
      },
    },
  },
  {
    slot: "powerbank",
    src: "/hero/items/powerbank.png",
    width: 933,
    height: 879,
    layer: "front",
    order: 4,
    desktop: {
      start: { x: 79.8, y: 61.5, w: 16.7 },
      mid: { x: 88, y: 56, w: 17.5, r: 8 },
      landed: { x: 84, y: 79.6, w: 8.5 },
      shadow: {
        start: { x: 77, y: 89, w: 111, opacity: 0.56 },
        landed: { x: 83, y: 86.2, w: 45, opacity: 0.6 },
      },
    },
    mobile: {
      start: { x: 25, y: 69, w: 32 },
      mid: { x: 18, y: 72, w: 33, r: 8 },
      landed: { x: 50, y: 81, w: 20 },
      shadow: {
        start: { x: 22, y: 85, w: 104, opacity: 0.47 },
        landed: { x: 49, y: 85.8, w: 70, opacity: 0.5 },
      },
    },
  },
];

/** Where each beat starts, as timeline progress (0–1). */
export const beats = { drift: 0, land: 0.34, handoff: 0.7 } as const;
