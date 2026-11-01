"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { formatPhone, normalisePhone, validate } from "@/lib/checkout";
import { cx } from "@/lib/cx";
import { MOCK_OTP, useAuth } from "@/stores/auth";
import { toast } from "@/stores/toast";

/** Phone + one-time code sign-in (mock: the code is always 123456). */
export function LoginForm() {
  const id = useId();
  const router = useRouter();
  const signIn = useAuth((s) => s.signIn);
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState<"phone" | "code">("phone");
  const [error, setError] = useState<string | null>(null);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(0);
  const [shake, setShake] = useState(0);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const sendCode = () => {
    const err = validate.phone(phone);
    setError(err);
    if (err) return;
    setStage("code");
    setSeconds(30);
    setDigits(["", "", "", "", "", ""]);
    toast(`Code sent to ${formatPhone(normalisePhone(phone))}`);
    requestAnimationFrame(() => boxes.current[0]?.focus());
  };

  const verify = (code: string) => {
    if (code.length < 6) return setError(`Enter all 6 digits. You entered ${code.length}.`);
    if (code !== MOCK_OTP) {
      setShake((n) => n + 1);
      return setError(`That code is wrong. Check the SMS and try again. (Demo code: ${MOCK_OTP})`);
    }
    signIn(normalisePhone(phone));
    toast("Logged in");
    router.push("/account");
  };

  const setDigit = (i: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length > 1) {
      // Pasted or autofilled code
      const next = clean.slice(0, 6).split("");
      const filled = [...next, ...Array(6 - next.length).fill("")];
      setDigits(filled);
      boxes.current[Math.min(next.length, 5)]?.focus();
      if (next.length === 6) verify(next.join(""));
      return;
    }
    const next = [...digits];
    next[i] = clean;
    setDigits(next);
    setError(null);
    if (clean && i < 5) boxes.current[i + 1]?.focus();
    if (next.every(Boolean)) verify(next.join(""));
  };

  return (
    <div className="mx-auto max-w-md px-gutter pt-[calc(var(--nav-h)+3rem)] pb-24">
      <h1 className="type-display text-h1">Log in or sign up</h1>
      {stage === "phone" ? (
        <form
          noValidate
          className="mt-8"
          onSubmit={(e) => {
            e.preventDefault();
            sendCode();
          }}
        >
          <label htmlFor={`${id}-phone`} className="text-small font-medium">
            Mobile number
          </label>
          <div className="mt-1.5 flex">
            <span className="grid h-12 place-items-center rounded-l-field border border-r-0 border-basalt/25 bg-stone px-3 text-body">+91</span>
            <input
              id={`${id}-phone`}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-err` : `${id}-hint`}
              className={cx("h-12 min-w-0 flex-1 rounded-r-field border bg-chalk px-4 text-body", error ? "border-error" : "border-basalt/25")}
            />
          </div>
          {error ? (
            <p id={`${id}-err`} className="mt-1.5 text-small text-error">
              {error}
            </p>
          ) : (
            <p id={`${id}-hint`} className="mt-1.5 text-small text-basalt/70">
              We&rsquo;ll text you a 6-digit code. New here? The same code creates your account.
            </p>
          )}
          <button type="submit" className={buttonClasses("primary", "lg", "mt-6 w-full")}>
            Send code
          </button>
        </form>
      ) : (
        <div className="mt-8">
          <p className="text-body">
            Enter the code sent to <span className="font-semibold">+91 {formatPhone(normalisePhone(phone))}</span>.{" "}
            <button type="button" className="underline underline-offset-4" onClick={() => setStage("phone")}>
              Change number
            </button>
          </p>
          <fieldset className="mt-6">
            <legend className="sr-only">6-digit code</legend>
            <div key={shake} className={cx("flex gap-2", shake > 0 && "animate-[otp-shake_300ms_linear]")}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    boxes.current[i] = el;
                  }}
                  value={d}
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  aria-label={`Digit ${i + 1}`}
                  maxLength={i === 0 ? 6 : 1}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !digits[i] && i > 0) boxes.current[i - 1]?.focus();
                  }}
                  className={cx("size-12 rounded-field border bg-chalk text-center text-h3 font-semibold", error ? "border-error" : "border-basalt/25")}
                />
              ))}
            </div>
          </fieldset>
          <p aria-live="polite" className={cx("mt-3 min-h-5 text-small", error && "text-error")}>
            {error}
          </p>
          <button type="button" onClick={() => verify(digits.join(""))} className={buttonClasses("primary", "lg", "mt-4 w-full")}>
            Verify and log in
          </button>
          <p className="mt-4 text-small text-basalt/70">
            {seconds > 0 ? (
              <>Resend code in 0:{String(seconds).padStart(2, "0")}</>
            ) : (
              <button type="button" className="underline underline-offset-4" onClick={sendCode}>
                Resend code
              </button>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
