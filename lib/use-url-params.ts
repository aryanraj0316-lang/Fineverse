"use client";

import { useCallback, useSyncExternalStore } from "react";

const EVENT = "fineverse:urlchange";

const subscribe = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(EVENT, cb);
  };
};

/**
 * The page's query string, read without `useSearchParams` (so static pages don't
 * need a Suspense boundary), plus a setter that replaces history entries.
 * Next.js keeps its router in sync with history.replaceState.
 */
export function useUrlParams(): [URLSearchParams, (update: Record<string, string | null>) => void] {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => "");
  const set = useCallback((update: Record<string, string | null>) => {
    const params = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(update)) {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    }
    const qs = params.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return [new URLSearchParams(search), set];
}
