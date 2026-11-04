import type { Metadata } from "next";
import { AudienceShop } from "@/components/shop/audience-shop";

export const metadata: Metadata = { title: "Women", description: "Shop women's clothing, footwear, bags and wearables from Fineverse." };

export default function WomenPage() { return <AudienceShop audience="women" />; }
