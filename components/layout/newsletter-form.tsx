"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** UI only: shows the confirmation a real signup would, without sending anything. */
export function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const shouldReset = useRef(false);

  // Activity keeps hidden pages mounted; don't show a stale success message on return.
  useLayoutEffect(
    () => () => {
      if (shouldReset.current) {
        setDone(null);
        setEmail("");
        shouldReset.current = false;
      }
    },
    [],
  );

  if (done) {
    return (
      <p role="status" className="mt-6 max-w-[34ch] text-body-lg">
        Subscribed. We&rsquo;ll email {done} when something new arrives.
      </p>
    );
  }

  return (
    <form
      noValidate
      className="mt-6 max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        const value = email.trim();
        if (!value) return setError("Enter your email address.");
        if (!EMAIL.test(value)) return setError("Enter an email address like name@example.com.");
        setError(null);
        setDone(value);
        shouldReset.current = true;
      }}
    >
      <label htmlFor={`${id}-email`} className="text-small text-chalk/80">
        Email address
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-12 min-w-0 flex-1 rounded-field border border-chalk/30 bg-basalt/30 px-4 text-body text-chalk placeholder:text-chalk/50 focus:border-chalk focus:outline-none"
          placeholder="name@example.com"
        />
        <button
          type="submit"
          className="h-12 shrink-0 rounded-full bg-cobalt px-6 text-body font-medium text-chalk transition-colors hover:bg-cobalt-press active:scale-[0.98]"
        >
          Subscribe
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-small text-chalk">
          {error}
        </p>
      )}
    </form>
  );
}
