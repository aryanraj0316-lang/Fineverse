import type { Metadata } from "next";
import { SearchResults } from "@/components/search/search-results";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

export default function SearchPage() {
  return <SearchResults />;
}
