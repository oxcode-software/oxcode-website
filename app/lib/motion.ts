"use client";

import { useEffect, useState } from "react";

/**
 * Reveals every `[data-reveal]` element as it scrolls into view, with an
 * index-based delay so the parts of a section arrive one after another.
 * Pass changing values in `deps` to re-scan after the DOM updates.
 */
export function useScrollReveal(deps: unknown[] = []) {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );

    nodes.forEach((node) => {
      if (node.classList.contains("is-visible")) return;
      const siblings = node.parentElement
        ? Array.from(node.parentElement.children).filter((child) =>
            child.hasAttribute("data-reveal"),
          )
        : [];
      const position = Math.max(0, siblings.indexOf(node));
      node.style.setProperty("--reveal-delay", `${Math.min(position, 6) * 80}ms`);
      observer.observe(node);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Everything tied to scroll or pointer position: the progress bar, the hero copy,
 * the services carousel, the process line and the card tilt.
 */
export function usePageMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      root.classList.toggle("is-scrolled", window.scrollY > 12);
      const height = window.innerHeight;
      const width = window.innerWidth;
      const scrollable = root.scrollHeight - height;
      root.style.setProperty("--scroll", (scrollable > 0 ? window.scrollY / scrollable : 0).toFixed(4));
      if (reduced) return;

      const hero = document.querySelector<HTMLElement>(".hero");
      if (hero) {
        const box = hero.getBoundingClientRect();
        hero.style.setProperty("--p", clamp(-box.top / Math.max(box.height - height, 1)).toFixed(3));
      }

      const orbit = document.querySelector<HTMLElement>(".orbit");
      const track = orbit?.querySelector<HTMLElement>(".orbit-track");
      if (orbit && track) {
        if (width > 900) {
          const box = orbit.getBoundingClientRect();
          const progress = clamp(-box.top / Math.max(box.height - height, 1));
          const travel = Math.max(track.scrollWidth - width, 0);
          track.style.transform = `translate3d(${(-progress * travel).toFixed(1)}px, 0, 0)`;
          track.querySelectorAll<HTMLElement>(".orbit-card").forEach((card) => {
            const rect = card.getBoundingClientRect();
            const distance = (rect.left + rect.width / 2 - width / 2) / width;
            card.style.transform = `rotateY(${clamp(distance * -46, -40, 40).toFixed(2)}deg) translateZ(${(-Math.abs(distance) * 170).toFixed(1)}px)`;
            card.style.opacity = clamp(1.08 - Math.abs(distance) * 0.62, 0.3, 1).toFixed(3);
          });
        } else {
          track.style.transform = "";
          track.querySelectorAll<HTMLElement>(".orbit-card").forEach((card) => {
            card.style.transform = "";
            card.style.opacity = "";
          });
        }
      }

      const process = document.querySelector<HTMLElement>(".process");
      if (process) {
        const box = process.getBoundingClientRect();
        process.style.setProperty("--progress", clamp((height * 0.8 - box.top) / (box.height + height * 0.25)).toFixed(3));
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    let tilted: HTMLElement | null = null;
    const resetTilt = () => {
      if (!tilted) return;
      tilted.style.setProperty("--rx", "0deg");
      tilted.style.setProperty("--ry", "0deg");
      tilted = null;
    };
    const onPointer = (event: PointerEvent) => {
      if (reduced || event.pointerType === "touch") return;
      const target = (event.target as Element | null)?.closest?.<HTMLElement>("[data-tilt]") ?? null;
      if (target !== tilted) resetTilt();
      if (!target) return;
      tilted = target;
      const box = target.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width;
      const y = (event.clientY - box.top) / box.height;
      target.style.setProperty("--ry", `${((x - 0.5) * 11).toFixed(2)}deg`);
      target.style.setProperty("--rx", `${((0.5 - y) * 11).toFixed(2)}deg`);
      target.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      target.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);
}

/** Tracks which section id is currently in the viewport. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.6, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
