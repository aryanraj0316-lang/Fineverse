import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content/content-page";
import { formatPrice, getPolicy } from "@/lib/commerce";
import { policySeed } from "@/data/policy";

export const metadata: Metadata = {
  title: "Shipping",
  description: "Delivery times, costs and cash on delivery across India.",
};

export default function ShippingPage() {
  const p = getPolicy();
  const { standardDays, expressDays } = policySeed;
  return (
    <ContentPage
      title="Shipping"
      intro={`Free standard delivery on orders over ${formatPrice(p.freeShippingThreshold)}. Most metro orders arrive in ${standardDays.metro} working days.`}
      sections={[
        {
          id: "costs",
          title: "Costs and times",
          body: (
            <table className="w-full text-left text-small" data-price>
              <thead>
                <tr className="border-b border-basalt/15">
                  <th scope="col" className="py-2 pr-4 font-semibold">Option</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Cost</th>
                  <th scope="col" className="py-2 font-semibold">Arrives in</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-basalt/10">
                  <th scope="row" className="py-2 pr-4 font-semibold">Standard</th>
                  <td className="py-2 pr-4">
                    Free over {formatPrice(p.freeShippingThreshold)}, otherwise {formatPrice(p.standardShipping)}
                  </td>
                  <td className="py-2">
                    {standardDays.metro} working days in metros, up to {standardDays.other} elsewhere
                  </td>
                </tr>
                <tr className="border-b border-basalt/10">
                  <th scope="row" className="py-2 pr-4 font-semibold">Express</th>
                  <td className="py-2 pr-4">{formatPrice(p.expressShipping)}</td>
                  <td className="py-2">
                    {expressDays.metro} working day in metros, up to {expressDays.other} elsewhere
                  </td>
                </tr>
              </tbody>
            </table>
          ),
        },
        {
          id: "dispatch",
          title: "When orders ship",
          body: (
            <p>
              Orders placed before 2 pm IST, Monday to Saturday, leave our warehouse the same day. Orders placed later, or on Sundays and
              national holidays, ship the next working day. You&rsquo;ll get an SMS with the courier and tracking number when your order ships.
            </p>
          ),
        },
        {
          id: "cod",
          title: "Cash on delivery",
          body: (
            <p>
              Available on most pincodes for a {formatPrice(p.codFee)} fee. Pay the courier in cash or by UPI at the door. Enter your pincode
              on any product page to check.
            </p>
          ),
        },
        {
          id: "tracking",
          title: "Tracking",
          body: (
            <p>
              Track any order on the <Link href="/track" className="underline underline-offset-4">track an order</Link> page with your order number
              and mobile number. No login needed.
            </p>
          ),
        },
      ]}
    />
  );
}
