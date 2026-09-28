"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LanguageSwitcher, useLocale } from "@/lib/i18n";

export function SiteHeader() {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [pageProgress, setPageProgress] = useState(0);
  const navItems = [
    { id: "services", label: t("nav.services", "Services"), href: "#services" },
    { id: "work", label: t("nav.work", "Work"), href: "#work" },
    { id: "process", label: t("nav.approach", "Approach"), href: "#process" },
    {
      id: "technology",
      label: t("nav.technology", "Technology"),
      href: "#technology",
    },
    { id: "about", label: t("nav.company", "Company"), href: "#about" },
  ];

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    let frame = 0;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-section]"),
    );
    const update = () => {
      const maximum =
        document.documentElement.scrollHeight - window.innerHeight;
      setPageProgress(maximum > 0 ? Math.min(window.scrollY / maximum, 1) : 0);
      const marker = Math.min(window.innerHeight * 0.34, 360);
      let current = "top";
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= marker)
          current = section.dataset.navSection || section.id;
      });
      setActiveSection(current);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-canvas/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <a
          href="#top"
          className="group flex min-h-11 items-center gap-3 rounded-sm text-ink"
          aria-label={t("header.home", "Dolphin Group — home")}
          onClick={() => setIsOpen(false)}
        >
          <span className="relative grid size-8 place-items-center overflow-hidden bg-brand text-[11px] font-extrabold tracking-[-0.04em] text-white">
            DG
            <span className="absolute right-0 top-0 size-1.5 bg-cyan" />
          </span>
          <span className="text-[15px] font-extrabold tracking-[-0.035em]">
            Dolphin Group<span className="text-brand">.</span>
          </span>
        </a>

        <nav
          className="hidden items-center gap-6 lg:flex"
          aria-label={t("header.primary", "Primary navigation")}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={activeSection === item.id ? "location" : undefined}
              className={`relative py-3 text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:bottom-2 after:h-px after:bg-brand after:transition-transform hover:text-ink ${activeSection === item.id ? "text-ink after:scale-x-100" : "text-muted after:scale-x-0 hover:after:scale-x-100"}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <a
            href="#contact"
            className="group hidden min-h-11 items-center gap-2 bg-ink px-5 text-sm font-bold text-white transition-colors hover:bg-brand sm:flex"
          >
            {t("nav.contact", "Discuss a project")}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center text-ink transition-colors hover:bg-blue-100 lg:hidden"
            aria-label={
              isOpen
                ? t("header.close", "Close menu")
                : t("header.menu", "Open menu")
            }
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="block h-full origin-left bg-gradient-to-r from-brand to-cyan"
          style={{ transform: `scaleX(${pageProgress})` }}
        />
      </div>

      <div
        id="mobile-navigation"
        className={`absolute inset-x-0 top-[72px] h-[calc(100dvh-72px)] border-t bg-canvas px-4 py-8 transition duration-300 lg:hidden ${isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"}`}
      >
        <nav
          className="mx-auto flex h-full max-w-2xl flex-col"
          aria-label={t("header.primary", "Primary navigation")}
        >
          <span className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
            {t("header.primary", "Navigation")} / 05
          </span>
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={activeSection === item.id ? "location" : undefined}
              className={`flex min-h-16 items-center justify-between border-t text-2xl font-bold tracking-[-0.04em] ${activeSection === item.id ? "text-brand" : "text-ink"}`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
              <span className="font-mono text-xs font-normal text-muted">
                0{index + 1}
              </span>
            </a>
          ))}
          <a
            href="#contact"
            className="mt-auto flex min-h-14 items-center justify-between bg-brand px-5 font-bold text-white"
            onClick={() => setIsOpen(false)}
          >
            {t("nav.contact", "Discuss a project")}
            <ArrowUpRight aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}
