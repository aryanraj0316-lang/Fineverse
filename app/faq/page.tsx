import type { Metadata } from "next";
import { FaqList, type FaqGroup } from "@/components/content/faq-list";
import { formatPrice, getKit, getPolicy } from "@/lib/commerce";

export const metadata: Metadata = { title: "FAQ", description: "Answers about orders, delivery, returns, products and your account." };

export default function FaqPage() {
  const p = getPolicy();
  const kit = getKit();
  const groups: FaqGroup[] = [
    {
      title: "Orders and payment",
      items: [
        { q: "Which payment methods do you accept?", a: `UPI, credit and debit cards, net banking, and cash on delivery (${formatPrice(p.codFee)} fee) on most pincodes.` },
        { q: "Can I change or cancel my order?", a: "Yes, until it ships. Contact us with your order number. Once it has shipped, you can return it instead." },
        { q: "Do prices include GST?", a: "Yes. Every price on the site includes GST, and your invoice shows the GST breakdown." },
        { q: "How does the Everyday Kit discount work?", a: `Buy all five kit pieces together and you pay ${kit.discountPercent}% less than buying them separately. The default kit is ${formatPrice(kit.price)}. Swapping pieces changes the price, and the saving updates as you choose.` },
      ],
    },
    {
      title: "Delivery",
      items: [
        { q: "How long does delivery take?", a: "Standard delivery takes 2 working days in metros and up to 5 elsewhere. Express takes 1 to 3. Check the exact date with your pincode on any product page." },
        { q: "How much is delivery?", a: `Standard delivery is free over ${formatPrice(p.freeShippingThreshold)}, otherwise ${formatPrice(p.standardShipping)}. Express is ${formatPrice(p.expressShipping)}.` },
        { q: "How do I track my order?", a: "Use the Track an order page with your order number and mobile number, or open the order in your account." },
      ],
    },
    {
      title: "Returns and warranty",
      items: [
        { q: "What's your return policy?", a: `Return anything unused within ${p.returnDays} days of delivery. We pick it up for free and refund within 5 working days of receiving it.` },
        { q: "Can I return earbuds?", a: "Unsealed earbuds and headphones can be returned only if faulty, for hygiene reasons. They're covered by a 1-year warranty." },
        { q: "Is there a warranty?", a: "Electronics and wearables have a 1-year warranty against manufacturing faults." },
      ],
    },
    {
      title: "Products and care",
      items: [
        { q: "How do I choose a size?", a: "Open the size guide on any clothing page. It has body measurements and a diagram of where to measure. Between sizes? Size up for a boxier fit." },
        { q: "Does the Tide Watch work with iPhone?", a: "Yes. It works with iOS 15 or later and Android 9 or later." },
        { q: "Can I take the Tide Watch swimming?", a: "Yes. It's water resistant to 50 m (5 ATM) and tracks pool swims." },
        { q: "How do I wash the Field Overshirt?", a: "Machine wash cold and dry flat. It's pre-washed, so it keeps its size." },
      ],
    },
    {
      title: "Account",
      items: [
        { q: "Do I need an account to order?", a: "No. You can check out as a guest. An account just keeps your orders and addresses in one place." },
        { q: "How do I log in?", a: "With your mobile number. We text you a 6-digit code; there's no password to remember." },
      ],
    },
  ];

  return (
    <div className="px-gutter pt-[calc(var(--nav-h)+2.5rem)] pb-24">
      <h1 className="type-display text-display">FAQ</h1>
      <p className="mt-4 max-w-2xl text-body-lg text-basalt/80">Quick answers about orders, delivery, returns and products.</p>
      <div className="mt-10">
        <FaqList groups={groups} />
      </div>
    </div>
  );
}
