"use client";

import { useId, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { buttonClasses } from "@/components/ui/button";
import { toast } from "@/stores/toast";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** "Notify me" for an out-of-stock variant. UI only: nothing is sent. */
export function NotifyMe({ open, onClose, productTitle, variantTitle }: { open: boolean; onClose: () => void; productTitle: string; variantTitle: string }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <Dialog open={open} onClose={onClose} title="Notify me">
      <form
        noValidate
        className="p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email.trim()) return setError("Enter your email address.");
          if (!EMAIL.test(email.trim())) return setError("Enter an email address like name@example.com.");
          toast(`We'll email you when ${productTitle} is back`);
          setEmail("");
          setError(null);
          onClose();
        }}
      >
        <p className="text-body">
          {productTitle} in {variantTitle} is out of stock. We&rsquo;ll send one email when it&rsquo;s back.
        </p>
        <label htmlFor={id} className="mt-5 block text-small font-medium">
          Email address
        </label>
        <input
          id={id}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className="mt-2 h-12 w-full rounded-field border border-basalt/25 px-4 text-body"
        />
        {error && (
          <p id={`${id}-err`} role="alert" className="mt-2 text-small text-error">
            {error}
          </p>
        )}
        <button type="submit" className={buttonClasses("primary", "md", "mt-5 w-full")}>
          Notify me
        </button>
      </form>
    </Dialog>
  );
}
