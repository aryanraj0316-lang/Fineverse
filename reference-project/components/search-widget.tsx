"use client";

import { useRef, useState, MouseEvent, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { gsap } from "@/lib/gsap-config";
import { Chip } from "@/components/ui/pill";
import MagneticButton from "@/components/ui/magnetic-button";
import { useToast } from "@/components/ui/toast";
import clsx from "clsx";

const RESIDENCE_TABS = ["All Residences", "Hotel", "Apartment", "Villa"];
const FILTER_CHIPS = ["House", "Hotel", "Residential", "Apartment"];

export default function SearchWidget({
  progressRef,
}: {
  progressRef?: React.MutableRefObject<number>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeChip, setActiveChip] = useState(0);
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");
  const { showToast } = useToast();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  // Fade out search bar as hero scrolls
  useEffect(() => {
    if (!progressRef) return;
    const el = wrapRef.current;
    if (!el) return;

    const onProgress = (e: Event) => {
      const progress = (e as CustomEvent<number>).detail;
      // Stay fully visible for first 20% of scroll, then fade out by 35%
      const opacity = 1 - Math.min(1, Math.max(0, (progress - 0.20) / 0.15));
      const translateY = Math.max(0, (progress - 0.20)) * -50;
      el.style.opacity = String(opacity);
      el.style.transform = `translateY(${translateY}px)`;
      el.style.pointerEvents = opacity < 0.1 ? "none" : "auto";
    };

    window.addEventListener("hero-scroll-progress", onProgress);
    return () => window.removeEventListener("hero-scroll-progress", onProgress);
  }, [progressRef]);

  const handleSearch = () => {
    if (!location.trim()) {
      showToast("Please enter a destination to search!", "warning", "📍");
      return;
    }
    showToast(
      `Searching ${RESIDENCE_TABS[activeTab]} in ${location}…`,
      "success",
      "🔍"
    );
  };

  return (
    <div ref={wrapRef} className="w-full max-w-6xl">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        className="glass w-full rounded-3xl border border-white/40 p-4 shadow-floating md:p-6"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="font-display text-lg font-bold md:text-2xl">
            Find the best place
          </h3>
          <div className="flex flex-wrap items-center gap-1 rounded-full border border-border-subtle bg-white/60 p-1">
            {RESIDENCE_TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={clsx(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-300 md:px-4 md:py-2 md:text-sm",
                  activeTab === i
                    ? "bg-text-primary text-white"
                    : "text-text-primary hover:text-text-muted"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
          <Field
            label="Location"
            placeholder="Type the destination"
            value={location}
            onChange={setLocation}
          />
          <Field
            label="Check In"
            placeholder="Add date"
            type="date"
            value={checkIn}
            onChange={setCheckIn}
          />
          <Field
            label="Check Out"
            placeholder="Add date"
            type="date"
            value={checkOut}
            onChange={setCheckOut}
          />
          <Field
            label="Participants"
            placeholder="Add guests"
            value={guests}
            onChange={setGuests}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-text-muted">Filter:</span>
            {FILTER_CHIPS.map((chip, i) => (
              <Chip
                key={chip}
                active={activeChip === i}
                onClick={() => setActiveChip(i)}
              >
                {chip}
              </Chip>
            ))}
          </div>

          <MagneticButton
            onClick={handleSearch}
            className="w-full bg-accent-green px-6 py-3 text-sm font-semibold text-text-primary md:w-auto"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#0B0F0D" strokeWidth="1.5" />
              <path
                d="M11 11L14.5 14.5"
                stroke="#0B0F0D"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Search Properties
          </MagneticButton>
        </div>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-muted">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-border-subtle bg-white/70 px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-text-primary"
      />
    </div>
  );
}
