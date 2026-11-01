"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { buttonClasses } from "@/components/ui/button";
import { Stars } from "@/components/ui/stars";
import type { Review } from "@/lib/commerce";
import { cx } from "@/lib/cx";
import { toast } from "@/stores/toast";

export function ReviewsSection({ reviews, productTitle }: { reviews: Review[]; productTitle: string }) {
  const [filter, setFilter] = useState<number | null>(null);
  const [writing, setWriting] = useState(false);
  const count = reviews.length;
  const average = count ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10 : 0;
  const shown = filter ? reviews.filter((r) => r.rating === filter) : reviews;
  const withPhotos = reviews.flatMap((r) => r.photos.map((p) => ({ ...p, author: r.author })));

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-[calc(var(--nav-h)+1rem)] border-t border-basalt/10 px-gutter py-16 lg:py-24">
      <div className="lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <h2 id="reviews-heading" className="type-heading text-h2">
            Reviews
          </h2>
          {count > 0 ? (
            <>
              <p className="mt-4 flex items-center gap-3">
                <span data-price className="text-h1 font-semibold">
                  {average}
                </span>
                <span className="flex flex-col gap-1 text-small text-basalt/75">
                  <Stars rating={average} />
                  {count} {count === 1 ? "review" : "reviews"}
                </span>
              </p>
              <ul className="mt-6 flex flex-col gap-2" aria-label="Rating breakdown">
                {[5, 4, 3, 2, 1].map((star) => {
                  const n = reviews.filter((r) => r.rating === star).length;
                  return (
                    <li key={star} className="flex items-center gap-3 text-small">
                      <span className="w-12 shrink-0">{star} star</span>
                      <span aria-hidden className="h-1.5 flex-1 overflow-hidden rounded-full bg-basalt/10">
                        <span className="block h-full origin-left bg-basalt" style={{ transform: `scaleX(${count ? n / count : 0})` }} />
                      </span>
                      <span data-price className="w-6 text-right text-basalt/70">
                        {n}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="mt-4 text-body text-basalt/75">No reviews yet.</p>
          )}
          <button type="button" onClick={() => setWriting(true)} className={buttonClasses("secondary", "md", "mt-8")}>
            Write a review
          </button>
        </div>

        <div className="mt-10 lg:col-span-8 lg:mt-0">
          {withPhotos.length > 0 && (
            <div className="mb-8">
              <h3 className="text-small font-semibold">Photos from customers</h3>
              <ul className="mt-3 flex gap-3">
                {withPhotos.map((p, i) => (
                  <li key={i} className="w-24 overflow-hidden rounded-surface bg-sand">
                    <Image src={p.src} alt={`${p.alt}`} width={p.width} height={p.height} sizes="96px" className="aspect-square h-auto w-full object-cover" />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {count > 0 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by rating">
              {[null, 5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star ?? "all"}
                  type="button"
                  aria-pressed={filter === star}
                  onClick={() => setFilter(star)}
                  className={cx(
                    "h-9 rounded-full border px-3.5 text-small",
                    filter === star ? "border-basalt bg-basalt text-chalk" : "border-basalt/20 hover:border-basalt",
                  )}
                >
                  {star ? `${star} star` : "All"}
                </button>
              ))}
            </div>
          )}

          <ul className="mt-6 flex flex-col">
            {shown.map((r) => (
              <li key={r.id} className="border-b border-basalt/10 py-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Stars rating={r.rating} />
                  <time dateTime={r.date} className="text-micro text-basalt/70">
                    {new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })}
                  </time>
                </div>
                <h3 className="mt-2 text-body font-semibold">{r.title}</h3>
                <p className="mt-1 text-body text-basalt/85">{r.body}</p>
                <p className="mt-3 text-micro text-basalt/70">
                  {r.author}, {r.city}
                  {r.variant && ` · ${r.variant}`} · Verified purchase
                </p>
              </li>
            ))}
            {count > 0 && shown.length === 0 && <li className="py-6 text-body text-basalt/75">No {filter}-star reviews yet.</li>}
          </ul>
        </div>
      </div>

      <WriteReview open={writing} onClose={() => setWriting(false)} productTitle={productTitle} />
    </section>
  );
}

function WriteReview({ open, onClose, productTitle }: { open: boolean; onClose: () => void; productTitle: string }) {
  const id = useId();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!rating) next.rating = "Choose a rating from 1 to 5 stars.";
    if (!title.trim()) next.title = "Add a short title, like “Comfortable all day”.";
    if (body.trim().length < 20) next.body = `Write at least 20 characters. You have ${body.trim().length}.`;
    if (!name.trim()) next.name = "Add the name to show with your review.";
    setErrors(next);
    if (Object.keys(next).length) return;
    toast("Review submitted");
    setRating(0);
    setTitle("");
    setBody("");
    setName("");
    onClose();
  };

  const field = "mt-2 w-full rounded-field border border-basalt/25 px-4 text-body";
  const err = (k: string) =>
    errors[k] && (
      <p id={`${id}-${k}-err`} className="mt-1.5 text-small text-error">
        {errors[k]}
      </p>
    );

  return (
    <Dialog open={open} onClose={onClose} title={`Review the ${productTitle}`}>
      <form noValidate onSubmit={submit} className="flex flex-col gap-5 p-5">
        <fieldset>
          <legend className="text-small font-medium">Your rating</legend>
          <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Rating" aria-describedby={errors.rating ? `${id}-rating-err` : undefined}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setRating(n)}
                className="grid size-10 place-items-center rounded-full hover:bg-basalt/5"
              >
                <svg viewBox="0 0 24 24" className={cx("size-6", n <= rating ? "fill-basalt" : "fill-basalt/15")}>
                  <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.4l-6.1 3.5 1.5-6.8L2.2 9.5l6.9-.7z" />
                </svg>
              </button>
            ))}
          </div>
          {err("rating")}
        </fieldset>
        <div>
          <label htmlFor={`${id}-title`} className="text-small font-medium">
            Title
          </label>
          <input id={`${id}-title`} value={title} onChange={(e) => setTitle(e.target.value)} aria-invalid={errors.title ? true : undefined} aria-describedby={errors.title ? `${id}-title-err` : undefined} className={cx(field, "h-12")} />
          {err("title")}
        </div>
        <div>
          <label htmlFor={`${id}-body`} className="text-small font-medium">
            Review
          </label>
          <textarea id={`${id}-body`} rows={5} value={body} onChange={(e) => setBody(e.target.value)} aria-invalid={errors.body ? true : undefined} aria-describedby={errors.body ? `${id}-body-err` : undefined} className={cx(field, "py-3")} />
          {err("body")}
        </div>
        <div>
          <label htmlFor={`${id}-name`} className="text-small font-medium">
            Name shown with your review
          </label>
          <input id={`${id}-name`} autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? `${id}-name-err` : undefined} className={cx(field, "h-12")} />
          {err("name")}
        </div>
        <button type="submit" className={buttonClasses("primary", "md")}>
          Submit review
        </button>
      </form>
    </Dialog>
  );
}
