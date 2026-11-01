"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * The year is read only in the browser (the server snapshot is empty), so
 * prerendered pages never bake in a stale year.
 */
export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null,
  );
  return <span>{year}</span>;
}
