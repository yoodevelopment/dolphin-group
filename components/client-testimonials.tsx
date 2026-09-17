import { Star } from "lucide-react";

const testimonials = [
  {
    author: "Caucasian Delights (CDelights)",
    context: "E-commerce website",
    quote:
      "They created a modern, user-friendly, and professional e-commerce website that represents our brand very well. We especially appreciated their attention to detail, communication, and willingness to make adjustments throughout the project. The final result exceeded our expectations.",
  },
  {
    author: "Business Owner / Entrepreneur",
    context: "Finance / Cash operations & reporting",
    quote:
      "We can now manage cash transactions, track financial activity, and generate reports much faster and more efficiently. The system is easy to use, saves our team a considerable amount of time, and gives us a much clearer overview of our finances.",
  },
] as const;

export function ClientTestimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      data-nav-section="work"
      className="scroll-mt-24 border-y bg-blue-50 py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3" data-reveal>
            <span className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
              <span className="h-px w-7 bg-brand" aria-hidden="true" />
              Client feedback
            </span>
          </div>
          <h2
            id="testimonials-heading"
            className="max-w-[900px] text-[clamp(2.5rem,5vw,5.1rem)] font-extrabold leading-[0.98] tracking-[-0.065em] text-ink lg:col-span-8 lg:col-start-5"
            data-reveal
          >
            From the teams <span className="text-brand">we build with.</span>
          </h2>
        </div>

        <div className="mt-12 border-t sm:mt-16 lg:mt-20">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.author}
              className="grid gap-7 border-b py-9 last:border-b-0 last:pb-0 sm:py-12 lg:grid-cols-12 lg:gap-10 lg:py-14"
              data-reveal
            >
              <figcaption className="lg:col-span-3 lg:pt-10">
                <span className="block max-w-xs text-lg font-extrabold leading-7 tracking-[-0.035em] text-ink sm:text-xl">
                  {testimonial.author}
                </span>
                <span className="mt-2 block font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-muted">
                  {testimonial.context}
                </span>
              </figcaption>
              <div className="min-w-0 lg:col-span-8 lg:col-start-5">
                <div
                  role="img"
                  aria-label="5 out of 5 stars"
                  className="mb-5 flex items-center gap-3 text-brand sm:mb-6"
                >
                  <span className="flex gap-1" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        size={16}
                        fill="currentColor"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    ))}
                  </span>
                  <span className="font-mono text-xs font-bold" aria-hidden="true">
                    5.0 / 5
                  </span>
                  <span className="h-px flex-1 bg-blue-200" aria-hidden="true" />
                </div>
                <blockquote className="text-xl font-medium leading-[1.6] tracking-[-0.025em] text-ink sm:text-2xl lg:text-[1.75rem] lg:leading-[1.5]">
                  <p>&ldquo;{testimonial.quote}&rdquo;</p>
                </blockquote>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
