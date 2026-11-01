"use client";

import { WorldMap } from "@/components/ui/map";
import Reveal from "@/components/ui/reveal";

export default function TravelNetwork() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
      <Reveal className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-sm font-medium text-accent-green">
          Global Network
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl lg:text-5xl">
          Every Trip, Connected
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-muted md:text-base">
          From Dhaka to the world&apos;s most sought-after coastlines and
          skylines — Movade plans the route, you enjoy the journey.
        </p>
      </Reveal>

      <WorldMap
        lineColor="#B6FF3C"
        dots={[
          {
            start: { lat: 23.8103, lng: 90.4125, label: "Dhaka", labelDir: "w" },
            end: { lat: 13.7563, lng: 100.5018, label: "Thailand", labelDir: "s" },
          },
          {
            start: { lat: 23.8103, lng: 90.4125, label: "Dhaka", labelDir: "w" },
            end: { lat: 35.6762, lng: 139.6503, label: "Tokyo", labelDir: "n" },
          },
          {
            start: { lat: 23.8103, lng: 90.4125, label: "Dhaka", labelDir: "w" },
            end: { lat: 41.8781, lng: -87.6298, label: "Chicago", labelDir: "n" },
          },
          {
            start: { lat: 23.8103, lng: 90.4125, label: "Dhaka", labelDir: "w" },
            end: { lat: 21.4272, lng: 92.0058, label: "Cox's Bazar", labelDir: "e" },
          },
          {
            start: { lat: 23.8103, lng: 90.4125, label: "Dhaka", labelDir: "w" },
            end: { lat: 36.3932, lng: 25.4615, label: "Santorini", labelDir: "s" },
          },
          {
            start: { lat: 23.8103, lng: 90.4125, label: "Dhaka", labelDir: "w" },
            end: { lat: 42.6507, lng: 18.0944, label: "Dubrovnik", labelDir: "n" },
          },
        ]}
      />
    </section>
  );
}
