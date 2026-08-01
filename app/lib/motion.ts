"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

/**
 * Reveals every `[data-reveal]` / `[data-stagger]` element as it scrolls into
 * view, applying an index-based delay so grids cascade instead of popping.
 * Pass changing values in `deps` to re-scan after the DOM updates.
 */
export function useScrollReveal(deps: unknown[] = []) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      document
        .querySelectorAll<HTMLElement>("[data-reveal], [data-stagger]")
        .forEach((node) => node.classList.add("is-visible"));
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
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    const nodes = document.querySelectorAll<HTMLElement>(
      "[data-reveal], [data-stagger]",
    );

    nodes.forEach((node) => {
      if (node.classList.contains("is-visible")) return;

      if (node.hasAttribute("data-reveal")) {
        const siblings = node.parentElement
          ? Array.from(node.parentElement.children).filter((child) =>
              child.hasAttribute("data-reveal"),
            )
          : [];
        const position = Math.max(0, siblings.indexOf(node));
        node.style.setProperty("--reveal-delay", `${Math.min(position, 7) * 85}ms`);
      }

      if (node.hasAttribute("data-stagger")) {
        Array.from(node.children).forEach((child, index) => {
          (child as HTMLElement).style.setProperty(
            "--stagger-delay",
            `${index * 70}ms`,
          );
        });
      }

      observer.observe(node);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** 3D pointer tilt + cursor-tracked glow for `.premium-card` surfaces. */
export function useTilt(maxTilt = 7) {
  const handleMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (!isFinePointer() || prefersReducedMotion()) return;
      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      element.style.setProperty(
        "--rotate-y",
        `${((px * 2 - 1) * maxTilt).toFixed(2)}deg`,
      );
      element.style.setProperty(
        "--rotate-x",
        `${((1 - py * 2) * maxTilt).toFixed(2)}deg`,
      );
      element.style.setProperty("--glow-x", `${(px * 100).toFixed(1)}%`);
      element.style.setProperty("--glow-y", `${(py * 100).toFixed(1)}%`);
    },
    [maxTilt],
  );

  const handleLeave = useCallback((event: MouseEvent<HTMLElement>) => {
    const element = event.currentTarget;
    element.style.setProperty("--rotate-x", "0deg");
    element.style.setProperty("--rotate-y", "0deg");
    element.style.setProperty("--glow-x", "50%");
    element.style.setProperty("--glow-y", "50%");
  }, []);

  return { onMouseMove: handleMove, onMouseLeave: handleLeave };
}

/** Pulls an element slightly toward the cursor while hovered. */
export function useMagnetic<T extends HTMLElement>(strength = 0.28) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !isFinePointer() || prefersReducedMotion()) return;

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      node.classList.add("is-pulling");
      node.style.setProperty("--mx", `${(dx * strength).toFixed(1)}px`);
      node.style.setProperty("--my", `${(dy * strength).toFixed(1)}px`);
    };

    const onLeave = () => {
      node.classList.remove("is-pulling");
      node.style.setProperty("--mx", "0px");
      node.style.setProperty("--my", "0px");
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return ref;
}

/** Normalised (-1..1) pointer offset from viewport centre, for parallax. */
export function usePointerParallax<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !isFinePointer() || prefersReducedMotion()) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = (event.clientY / window.innerHeight) * 2 - 1;
        node.style.setProperty("--parallax-x", x.toFixed(3));
        node.style.setProperty("--parallax-y", y.toFixed(3));
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}

/** Page scroll ratio (0..1) plus a "past the fold" flag for the sticky nav. */
export function useScrollState() {
  const [progress, setProgress] = useState(0);
  const [isStuck, setIsStuck] = useState(false);
  const [isDeep, setIsDeep] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
      setIsStuck(y > 24);
      setIsDeep(y > window.innerHeight * 0.9);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return { progress, isStuck, isDeep };
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

/** Moves the ambient spotlight layer with the pointer. */
export function useCursorSpotlight<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !isFinePointer() || prefersReducedMotion()) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        node.classList.add("is-active");
        node.style.setProperty("--spot-x", `${event.clientX}px`);
        node.style.setProperty("--spot-y", `${event.clientY}px`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}

/** Counts a numeric value up once its element scrolls into view. */
export function useCountUp<T extends HTMLElement>(
  target: number,
  decimals = 0,
  duration = 1500,
) {
  const ref = useRef<T | null>(null);
  const [value, setValue] = useState(prefersReducedMotion() ? target : 0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;

    if (prefersReducedMotion()) {
      frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          setValue(Number((target * eased).toFixed(decimals)));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target, decimals, duration]);

  return { ref, value };
}
