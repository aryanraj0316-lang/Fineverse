"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { NavCategory } from "./nav-types";

const ease = [0.2, 0.7, 0.2, 1] as const;

export function MegaMenu({
  category,
  onNavigate,
}: {
  category: NavCategory | null;
  onNavigate: () => void;
}) {
  return (
    <AnimatePresence>
      {category && (
        <motion.div
          key="mega"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease }}
          className="absolute inset-x-0 top-full hidden border-b border-basalt/10 bg-stone lg:block"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={category.handle}
              id={`mega-${category.handle}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-12 gap-x-8 px-gutter pt-8 pb-12"
            >
              <ul className="col-span-6 flex flex-col gap-1">
                {category.types.map((type) => (
                  <li key={type.href}>
                    <Link
                      href={type.href}
                      onClick={onNavigate}
                      className="type-heading inline-block py-1 text-h3 transition-colors hover:text-basalt/60"
                    >
                      {type.title}
                    </Link>
                  </li>
                ))}
                <li className="mt-4">
                  <Link
                    href={category.href}
                    onClick={onNavigate}
                    className="text-small font-medium underline decoration-basalt/30 underline-offset-4 hover:decoration-basalt"
                  >
                    View all {category.title.toLowerCase()}
                  </Link>
                </li>
              </ul>

              <Link
                href={category.featured.href}
                onClick={onNavigate}
                className="group col-span-3 col-start-10 flex gap-5"
              >
                <div className="w-40 shrink-0 overflow-hidden rounded-surface bg-sand">
                  <Image
                    src={category.featured.image.src}
                    alt={category.featured.image.alt}
                    width={category.featured.image.width}
                    height={category.featured.image.height}
                    sizes="160px"
                    className="aspect-[4/5] h-auto w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-col justify-end pb-1">
                  <span className="text-small font-medium">{category.featured.title}</span>
                  <span data-price className="text-small text-basalt/70">
                    {category.featured.price}
                  </span>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
