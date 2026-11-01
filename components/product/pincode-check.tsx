"use client";

import { useId, useState } from "react";
import { checkPincode, formatDeliveryDate, type PincodeResult } from "@/lib/delivery";
import { formatPrice, getPolicy } from "@/lib/commerce";

export function PincodeCheck() {
  const id = useId();
  const policy = getPolicy();
  const [value, setValue] = useState("");
  const [result, setResult] = useState<PincodeResult | null>(null);

  return (
    <div>
      <form
        noValidate
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setResult(checkPincode(value));
        }}
      >
        <label htmlFor={id} className="sr-only">
          Pincode
        </label>
        <input
          id={id}
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="Pincode"
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/[^\d]/g, ""))}
          aria-invalid={result && !result.ok ? true : undefined}
          aria-describedby={`${id}-result`}
          className="h-11 w-36 rounded-field border border-basalt/25 bg-chalk px-4 text-body"
        />
        <button type="submit" className="h-11 rounded-full border border-basalt/25 px-5 text-small font-medium hover:border-basalt">
          Check
        </button>
      </form>
      <div id={`${id}-result`} aria-live="polite" className="mt-2 text-small">
        {result && !result.ok && <p className="text-error">{result.error}</p>}
        {result?.ok && (
          <ul className="flex flex-col gap-1">
            <li>
              Standard delivery by <strong>{formatDeliveryDate(result.standard)}</strong>
              <span className="text-basalt/70"> · free over {formatPrice(policy.freeShippingThreshold)}</span>
            </li>
            <li>
              Express by <strong>{formatDeliveryDate(result.express)}</strong>
              <span className="text-basalt/70"> · {formatPrice(policy.expressShipping)}</span>
            </li>
            <li>
              {result.cod
                ? `Cash on delivery available (${formatPrice(policy.codFee)} fee)`
                : "Cash on delivery isn't available here. Pay by UPI or card instead."}
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
