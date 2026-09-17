import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function CDelightsShowcase() {
  return (
    <article id="cdelights-project" aria-labelledby="cdelights-title">
      <div className="border bg-canvas" data-reveal>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-4 sm:px-6">
          <span className="flex items-center gap-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
            <span className="size-1.5 bg-success" aria-hidden="true" />
            Client project
          </span>
          <span className="font-mono text-[10px] tracking-[0.08em] text-muted">cdelights.com</span>
        </div>
        <div className="relative p-4 pb-6 sm:p-8 sm:pb-10 lg:p-12 lg:pb-14">
          <div className="w-[88%] overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-900/5 sm:w-[86%]">
            <div className="flex h-6 items-center gap-1 border-b bg-white px-2 sm:h-9 sm:gap-1.5 sm:px-3" aria-hidden="true">
              <span className="size-1 rounded-full bg-slate-300 sm:size-1.5" />
              <span className="size-1 rounded-full bg-slate-300 sm:size-1.5" />
              <span className="size-1 rounded-full bg-slate-300 sm:size-1.5" />
              <span className="ml-2 font-mono text-[8px] text-muted sm:ml-4 sm:text-[10px]">cdelights.com</span>
            </div>
            <Image
              src="/images/projects/cdelights-desktop.webp"
              alt="Caucasian Delights online store on desktop, with its product collections and brand showcase"
              width={1440}
              height={1080}
              sizes="(min-width: 1440px) 1080px, (min-width: 640px) 80vw, 78vw"
              className="h-auto w-full"
            />
          </div>
          <div className="absolute bottom-4 right-3 w-[24%] overflow-hidden rounded-[8px] border-[3px] border-navy bg-white shadow-xl shadow-slate-900/15 sm:bottom-6 sm:right-6 sm:w-[23%] sm:rounded-[14px] sm:border-[5px] lg:bottom-9 lg:right-10">
            <Image
              src="/images/projects/cdelights-mobile.webp"
              alt="Mobile Caucasian Delights website showing the Bizon product collection"
              width={390}
              height={844}
              sizes="(min-width: 1440px) 312px, 24vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-7 border-t pt-5 sm:mt-6 sm:gap-10 sm:pt-6 lg:grid-cols-12">
        <div className="lg:col-span-7" data-reveal>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand">E-commerce / Food & beverages</span>
          <h3 id="cdelights-title" className="mt-2 text-4xl font-extrabold tracking-[-0.055em] text-ink sm:text-5xl">CDelights</h3>
          <p className="mt-2 text-lg font-semibold text-ink">Caucasian Delights</p>
          <p className="mt-4 max-w-2xl leading-7 text-muted">
            An online store bringing food and beverage brands together through a product catalog, category browsing, and a responsive shopping experience.
          </p>
          <a
            href="https://cdelights.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-12 items-center gap-6 border-b border-ink font-bold text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline-brand!"
          >
            Visit cdelights.com
            <ArrowUpRight size={19} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <div className="border-t pt-5 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0" data-reveal>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Project focus</span>
          <ul className="mt-3 space-y-2 text-sm font-bold text-ink">
            {["Website development", "E-commerce", "Responsive design"].map((item) => (
              <li key={item} className="flex items-center justify-between gap-4 border-b py-2">
                {item}
                <ArrowUpRight size={14} className="text-brand" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
