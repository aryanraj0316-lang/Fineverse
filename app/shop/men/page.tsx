import type { Metadata } from "next";
import { AudienceShop } from "@/components/shop/audience-shop";

export const metadata: Metadata = { title: "Men", description: "Shop men's clothing, footwear, bags and wearables from Fineverse." };

export default function MenPage() { return <AudienceShop audience="men" />; }
