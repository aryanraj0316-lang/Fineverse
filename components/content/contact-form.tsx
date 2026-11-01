"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { validate } from "@/lib/checkout";
import { support } from "@/lib/site";
import { cx } from "@/lib/cx";

const TOPICS = ["An order I've placed", "Returns or exchanges", "Product question", "Something else"];

/** UI only: shows the confirmation a real form would, without sending anything. */
export function ContactForm() {
  const id = useId();
  const [v, setV] = useState({ name: "", contact: "", order: "", topic: TOPICS[0]!, message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<string | null>(null);
  const resetOnHide = useRef(false);

  // Activity keeps hidden pages mounted: don't greet a returning visitor with a stale "sent" message.
  useLayoutEffect(
    () => () => {
      if (resetOnHide.current) {
        setSent(null);
        resetOnHide.current = false;
      }
    },
    [],
  );

  if (sent) {
    return (
      <p role="status" className="rounded-surface bg-chalk p-6 text-body-lg">
        Thanks, {sent}. We&rsquo;ll reply {support.replyTime}.
      </p>
    );
  }

  const field = (k: "name" | "contact" | "order", label: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`${id}-${k}`} className="text-small font-medium">
        {label}
      </label>
      <input
        id={`${id}-${k}`}
        value={v[k]}
        onChange={(e) => setV({ ...v, [k]: e.target.value })}
        aria-invalid={errors[k] ? true : undefined}
        aria-describedby={errors[k] ? `${id}-${k}-err` : undefined}
        className={cx("mt-1.5 h-12 w-full rounded-field border bg-chalk px-4 text-body", errors[k] ? "border-error" : "border-basalt/25")}
        {...extra}
      />
      {errors[k] && (
        <p id={`${id}-${k}-err`} className="mt-1.5 text-small text-error">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <form
      noValidate
      className="grid gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        const next: Record<string, string> = {};
        if (!v.name.trim()) next.name = "Enter your name.";
        const contact = v.contact.trim();
        if (!contact) next.contact = "Enter an email address or a mobile number so we can reply.";
        else if (contact.includes("@") ? validate.email(contact) : validate.phone(contact))
          next.contact = contact.includes("@") ? "Enter an email address like name@example.com." : (validate.phone(contact) ?? "");
        if (v.order.trim() && !/^FV-?\d{5}$/i.test(v.order.trim())) next.order = "Order numbers look like FV-10482. Leave it empty if you don't have one.";
        if (v.message.trim().length < 10) next.message = `Tell us a little more: at least 10 characters. You have ${v.message.trim().length}.`;
        setErrors(next);
        if (Object.keys(next).length) {
          document.getElementById(`${id}-${Object.keys(next)[0]}`)?.focus();
          return;
        }
        setSent(v.name.trim().split(" ")[0] ?? "");
        resetOnHide.current = true;
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", "Your name", { autoComplete: "name" })}
        {field("contact", "Email or mobile number", { autoComplete: "email" })}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-topic`} className="text-small font-medium">
            Topic
          </label>
          <select id={`${id}-topic`} value={v.topic} onChange={(e) => setV({ ...v, topic: e.target.value })} className="mt-1.5 h-12 w-full rounded-field border border-basalt/25 bg-chalk px-4 text-body">
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        {field("order", "Order number (optional)", { placeholder: "FV-10482" })}
      </div>
      <div>
        <label htmlFor={`${id}-message`} className="text-small font-medium">
          Message
        </label>
        <textarea
          id={`${id}-message`}
          rows={6}
          value={v.message}
          onChange={(e) => setV({ ...v, message: e.target.value })}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${id}-message-err` : undefined}
          className={cx("mt-1.5 w-full rounded-field border bg-chalk px-4 py-3 text-body", errors.message ? "border-error" : "border-basalt/25")}
        />
        {errors.message && (
          <p id={`${id}-message-err`} className="mt-1.5 text-small text-error">
            {errors.message}
          </p>
        )}
      </div>
      <button type="submit" className={buttonClasses("primary", "lg", "justify-self-start")}>
        Send message
      </button>
    </form>
  );
}
