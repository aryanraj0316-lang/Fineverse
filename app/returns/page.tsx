import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content/content-page";
import { getPolicy } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Returns",
  description: "Return anything unused within 7 days. We pick it up for free.",
};

export default function ReturnsPage() {
  const { returnDays } = getPolicy();
  return (
    <ContentPage
      title="Returns"
      intro={`Return anything unused within ${returnDays} days of delivery. We pick it up from your door for free.`}
      sections={[
        {
          id: "how",
          title: "How to return",
          body: (
            <ol className="list-decimal pl-5">
              <li>
                Go to <Link href="/account" className="underline underline-offset-4">your account</Link>, open the order and choose the items to
                return. No account? <Link href="/contact" className="underline underline-offset-4">Contact us</Link> with your order number.
              </li>
              <li>Pack the items in their original box with the tags still on.</li>
              <li>A courier picks the parcel up within 2 working days.</li>
            </ol>
          ),
        },
        {
          id: "refunds",
          title: "Refunds",
          body: (
            <p>
              Once the return reaches us and passes a quick check, we refund within 5 working days: to the original payment method for online
              orders, or by bank transfer or UPI for cash-on-delivery orders. The cash-on-delivery fee isn&rsquo;t refunded.
            </p>
          ),
        },
        {
          id: "exchanges",
          title: "Exchanges",
          body: <p>Need a different size or colour? Choose &ldquo;exchange&rdquo; instead of &ldquo;return&rdquo;, and we&rsquo;ll ship the new item as soon as the pickup is done.</p>,
        },
        {
          id: "exceptions",
          title: "What can't be returned",
          body: (
            <p>
              Earbuds and headphones that have been unsealed can be returned only if they&rsquo;re faulty, for hygiene reasons. Anything damaged
              by use isn&rsquo;t covered. Faulty items are covered by the warranty instead: 1 year on electronics and wearables.
            </p>
          ),
        },
      ]}
    />
  );
}
