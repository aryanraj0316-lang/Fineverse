import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/content/contact-form";
import { buttonClasses } from "@/components/ui/button";
import { support } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", description: "Write to us or message us on WhatsApp. We reply within one working day." };

export default function ContactPage() {
  return (
    <div className="px-gutter pt-[calc(var(--nav-h)+2.5rem)] pb-24">
      <h1 className="type-display text-display">Contact</h1>
      <p className="mt-4 max-w-2xl text-body-lg text-basalt/80">
        Write to us about an order, a return or a product. We reply {support.replyTime}.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
        <aside className="flex flex-col gap-8 lg:col-span-4 lg:col-start-9">
          <div className="rounded-surface bg-chalk p-6">
            <h2 className="type-heading text-h3">WhatsApp</h2>
            <p className="mt-2 text-body text-basalt/80">The quickest way to reach us about an order.</p>
            <a
              href={`https://wa.me/${support.whatsappNumber}?text=${encodeURIComponent("Hi Fineverse, I have a question about ")}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("secondary", "md", "mt-4")}
            >
              <MessageCircle aria-hidden className="size-5" strokeWidth={1.5} />
              Message us on WhatsApp
            </a>
          </div>
          <dl className="grid gap-4 text-body">
            <div>
              <dt className="text-small font-semibold">Email</dt>
              <dd>
                <a href={`mailto:${support.email}`} className="underline underline-offset-4">
                  {support.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-small font-semibold">Hours</dt>
              <dd>{support.hours}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
