import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content/content-page";
import { getPolicy } from "@/lib/commerce";

export const metadata: Metadata = { title: "Terms", description: "The terms for buying from Fineverse." };

export default function TermsPage() {
  const { returnDays } = getPolicy();
  return (
    <ContentPage
      title="Terms"
      intro="The plain version: what you can expect from us, and what we expect from you."
      notice={
        <p>
          <strong>Template text.</strong> Replace with terms reviewed by your legal adviser before launch, including the company&rsquo;s
          registered name, address and GSTIN.
        </p>
      }
      sections={[
        {
          id: "orders",
          title: "Orders and prices",
          body: (
            <p>
              Prices are in Indian rupees and include GST. An order is confirmed when you receive the confirmation email or SMS. If an item
              turns out to be out of stock after you order, we&rsquo;ll tell you and refund it in full.
            </p>
          ),
        },
        {
          id: "delivery",
          title: "Delivery",
          body: <p>Delivery dates are estimates. If an order is more than 3 working days late, contact us and we&rsquo;ll refund the delivery fee.</p>,
        },
        {
          id: "returns",
          title: "Returns and warranty",
          body: (
            <p>
              Unused items can be returned within {returnDays} days of delivery (see <Link href="/returns" className="underline underline-offset-4">Returns</Link>). Electronics and wearables carry a
              1-year warranty against manufacturing faults.
            </p>
          ),
        },
        {
          id: "codes",
          title: "Discount codes",
          body: <p>One code per order. Codes can&rsquo;t be exchanged for cash and may have an end date.</p>,
        },
      ]}
    />
  );
}
