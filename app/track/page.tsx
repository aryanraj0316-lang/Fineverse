import type { Metadata } from "next";
import { TrackView } from "@/components/orders/track-view";

export const metadata: Metadata = {
  title: "Track an order",
  description: "Track a Fineverse order with your order number and mobile number. No login needed.",
};

export default function TrackPage() {
  return <TrackView />;
}
