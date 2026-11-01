import type { Metadata } from "next";
import { ConfirmationView } from "@/components/checkout/confirmation-view";

export const metadata: Metadata = { title: "Order placed", robots: { index: false } };

export default function ConfirmationPage() {
  return <ConfirmationView />;
}
