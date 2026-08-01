"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";

import { useMagnetic } from "@/app/lib/motion";
import { IconArrowRight } from "./icons";

export type NavLink = { id: string; label: string };

type NavbarProps = {
  links: NavLink[];
  activeId: string;
  ctaText: string;
  isStuck: boolean;
};

export default function Navbar({ links, activeId, ctaText, isStuck }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.22);

  /* The pill is positioned imperatively — it is a measurement of the DOM,
     not application state, so it never needs to trigger a re-render. */
  const syncIndicator = useCallback(() => {
    const pill = indicatorRef.current;
    if (!pill) return;

    const item = itemRefs.current[activeId];
    if (!item) {
      pill.classList.remove("is-on");
      return;
    }

    pill.style.setProperty("--nav-x", `${item.offsetLeft}px`);
    pill.style.setProperty("--nav-w", `${item.offsetWidth}px`);
    pill.classList.add("is-on");
  }, [activeId]);

  useLayoutEffect(() => {
    syncIndicator();
  }, [syncIndicator]);

  useEffect(() => {
    window.addEventListener("resize", syncIndicator);
    return () => window.removeEventListener("resize", syncIndicator);
  }, [syncIndicator]);

  useEffect(() => {
    document.body.classList.toggle("nav-locked", isOpen);
    return () => document.body.classList.remove("nav-locked");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <>
      <header className={`topbar ${isStuck ? "is-stuck" : ""}`}>
        <a className="logo" href="#home" aria-label="Oxcode home">
          <Image
            className="logo-wordmark"
            src="/logo-full.svg"
            alt="Oxcode Software Solutions LLP"
            width={542}
            height={132}
            priority
          />
        </a>

        <div className="nav-cluster">
          <nav className="nav-links" aria-label="Primary navigation">
            <span className="nav-indicator" ref={indicatorRef} aria-hidden="true" />
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={activeId === link.id ? "is-active" : ""}
                aria-current={activeId === link.id ? "page" : undefined}
                ref={(node) => {
                  itemRefs.current[link.id] = node;
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a className="btn btn-ghost nav-cta magnetic" href="#contact" ref={ctaRef}>
            {ctaText}
            <IconArrowRight className="arrow" width={16} height={16} />
          </a>

          <button
            type="button"
            className={`nav-toggle ${isOpen ? "is-open" : ""}`}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-drawer"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <span />
          </button>
        </div>
      </header>

      {isOpen ? (
        <div className="mobile-drawer" id="mobile-drawer">
          {links.map((link, index) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setIsOpen(false)}
              style={{ ["--item-delay" as string]: `${index * 55}ms` }}
            >
              {link.label}
              <span>0{index + 1}</span>
            </a>
          ))}
          <a
            className="btn btn-primary"
            href="#contact"
            onClick={() => setIsOpen(false)}
          >
            {ctaText}
            <IconArrowRight className="arrow" width={16} height={16} />
          </a>
        </div>
      ) : null}
    </>
  );
}
