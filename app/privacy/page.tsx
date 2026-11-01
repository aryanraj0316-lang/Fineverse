import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";
import { support } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy", description: "What we collect, why, and how to ask us to delete it." };

const TEMPLATE = (
  <p>
    <strong>Template text.</strong> This page describes how a store like this typically handles data. Have it reviewed by your legal
    adviser, and checked against India&rsquo;s Digital Personal Data Protection Act, before launch.
  </p>
);

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy"
      intro="We collect what we need to deliver your order and nothing to sell."
      notice={TEMPLATE}
      sections={[
        {
          id: "collect",
          title: "What we collect",
          body: (
            <ul className="list-disc pl-5">
              <li>Your name, mobile number, email and delivery address, to deliver orders and send receipts.</li>
              <li>Your order history, so you can track orders and make returns.</li>
              <li>Basic usage data (pages viewed, device type) to fix problems and improve the site.</li>
            </ul>
          ),
        },
        {
          id: "payments",
          title: "Payments",
          body: <p>Card and UPI details are handled by our payment provider. We never see or store your full card number.</p>,
        },
        {
          id: "sharing",
          title: "Who we share it with",
          body: <p>Only couriers (to deliver), our payment provider (to take payment) and our email and SMS providers (to send updates). We don&rsquo;t sell your data.</p>,
        },
        {
          id: "device",
          title: "On your device",
          body: <p>Your cart, wishlist and recently viewed products are stored in your browser so they&rsquo;re there when you come back. Clearing your browser data removes them.</p>,
        },
        {
          id: "rights",
          title: "Your choices",
          body: (
            <p>
              Ask us for a copy of your data, or to correct or delete it, by emailing {support.email}. We reply {support.replyTime}.
            </p>
          ),
        },
      ]}
    />
  );
}
