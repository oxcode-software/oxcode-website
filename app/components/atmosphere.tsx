"use client";

import { useCursorSpotlight } from "@/app/lib/motion";
import { IconArrowUp } from "./icons";

/** Film grain + cursor spotlight layers that sit behind the whole page. */
export function Atmosphere() {
  const spotlightRef = useCursorSpotlight<HTMLDivElement>();

  return (
    <>
      <div className="cursor-spotlight" ref={spotlightRef} aria-hidden="true" />
      <div className="grain-layer" aria-hidden="true" />
    </>
  );
}

/** Thin reading-progress bar pinned to the top of the viewport. */
export function ScrollProgress({ progress }: { progress: number }) {
  return (
    <div
      className="scroll-progress"
      style={{ ["--progress" as string]: progress }}
      aria-hidden="true"
    />
  );
}

/** Floating "back to top" control, revealed once past the fold. */
export function BackToTop({ visible }: { visible: boolean }) {
  return (
    <button
      type="button"
      className={`to-top ${visible ? "is-on" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <IconArrowUp />
    </button>
  );
}
