"use client";

import { MotionConfig } from "motion/react";
import { SmoothScroll } from "./smooth-scroll";
import { StoreHydration } from "./store-hydration";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <StoreHydration />
        {children}
      </SmoothScroll>
    </MotionConfig>
  );
}
