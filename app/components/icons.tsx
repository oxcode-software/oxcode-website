import type { ComponentType, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  width: 24,
  height: 24,
};

export const IconMobile = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="6" y="2.5" width="12" height="19" rx="3" />
    <path d="M10.5 5.5h3M11 18.5h2" />
  </svg>
);

export const IconWeb = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
  </svg>
);

export const IconDesign = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 2.8 4 7v10l8 4.2 8-4.2V7z" />
    <path d="m4 7 8 4.2L20 7M12 11.2V21" />
  </svg>
);

export const IconCode = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m8.5 8-4.5 4 4.5 4M15.5 8l4.5 4-4.5 4M13.5 5l-3 14" />
  </svg>
);

export const IconCloud = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M7 18a4 4 0 0 1-.4-7.98A5.5 5.5 0 0 1 17.4 9.2 3.9 3.9 0 0 1 17 18z" />
    <path d="M12 12v5M9.8 14.4 12 12l2.2 2.4" />
  </svg>
);

export const IconSupport = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 13a8 8 0 0 1 16 0" />
    <rect x="2.5" y="13" width="4" height="6" rx="1.6" />
    <rect x="17.5" y="13" width="4" height="6" rx="1.6" />
    <path d="M20 19v.6a2.4 2.4 0 0 1-2.4 2.4H13" />
  </svg>
);

export const IconPos = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="12" rx="2.4" />
    <path d="M7 7h6M7 10.5h3M2.5 19h19M6 19l1-4M18 19l-1-4" />
  </svg>
);

export const IconPayroll = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="2.8" y="5.5" width="18.4" height="13" rx="2.4" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M6.2 9.5v5M17.8 9.5v5" />
  </svg>
);

export const IconDashboard = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M7.5 16v-3.5M12 16V8.5M16.5 16v-5.5" />
  </svg>
);

export const IconShield = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 2.6 4.8 5.6v6c0 4.3 3 8.2 7.2 9.8 4.2-1.6 7.2-5.5 7.2-9.8v-6z" />
    <path d="m9.2 12 2 2 3.6-3.8" />
  </svg>
);

export const IconSpark = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3.2 13.9 9l5.8 1.9-5.8 1.9L12 18.6 10.1 12.8 4.3 10.9 10.1 9z" />
  </svg>
);

export const IconTarget = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <circle cx="12" cy="12" r="4.6" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

export const IconArrowRight = (p: IconProps) => (
  <svg {...base} width={18} height={18} {...p}>
    <path d="M4.5 12h15M13.5 6l6 6-6 6" />
  </svg>
);

export const IconArrowUp = (p: IconProps) => (
  <svg {...base} width={18} height={18} {...p}>
    <path d="M12 19.5v-15M6 10.5l6-6 6 6" />
  </svg>
);

export const IconCheck = (p: IconProps) => (
  <svg {...base} width={14} height={14} strokeWidth={2.4} {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const IconStar = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...p}>
    <path d="m12 2.6 2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.7 6.1 20.8l1.2-6.6-4.8-4.6 6.6-.9z" />
  </svg>
);

export const IconMail = (p: IconProps) => (
  <svg {...base} width={18} height={18} {...p}>
    <rect x="2.8" y="5" width="18.4" height="14" rx="2.6" />
    <path d="m3.5 7.5 8.5 6 8.5-6" />
  </svg>
);

export const IconPhone = (p: IconProps) => (
  <svg {...base} width={18} height={18} {...p}>
    <path d="M7.6 3.5 9.9 8l-2 1.9a12.5 12.5 0 0 0 6.2 6.2l1.9-2 4.5 2.3v3.1a1.9 1.9 0 0 1-2.1 1.9C10.3 20.7 3.3 13.7 2.6 5.6A1.9 1.9 0 0 1 4.5 3.5z" />
  </svg>
);

export const IconPin = (p: IconProps) => (
  <svg {...base} width={18} height={18} {...p}>
    <path d="M12 21.5s7-6.1 7-11.1a7 7 0 1 0-14 0c0 5 7 11.1 7 11.1z" />
    <circle cx="12" cy="10.2" r="2.6" />
  </svg>
);

export const IconClock = (p: IconProps) => (
  <svg {...base} width={18} height={18} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.3l3.4 2" />
  </svg>
);

export const IconLinkedIn = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} {...p}>
    <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5M3 9.75h4v11.25H3zM9.5 9.75h3.83v1.54h.05a4.2 4.2 0 0 1 3.78-2.08c4.04 0 4.79 2.66 4.79 6.12V21h-4v-4.9c0-1.17-.02-2.68-1.63-2.68-1.64 0-1.89 1.28-1.89 2.6V21h-3.93z" />
  </svg>
);

export const IconGitHub = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} {...p}>
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.93.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2" />
  </svg>
);

export const IconInstagram = (p: IconProps) => (
  <svg {...base} width={18} height={18} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

/** Maps the short Firestore icon codes to real vector icons, with a sane fallback. */
const iconRegistry: Record<string, ComponentType<IconProps>> = {
  FL: IconMobile,
  MOB: IconMobile,
  WB: IconWeb,
  WEB: IconWeb,
  UX: IconDesign,
  CL: IconCloud,
  CS: IconCode,
  MS: IconSupport,
  SV: IconSpark,
  POS: IconPos,
  PAY: IconPayroll,
  DB: IconDashboard,
  PD: IconDashboard,
};

const fallbackCycle: ComponentType<IconProps>[] = [
  IconCode,
  IconSpark,
  IconShield,
  IconTarget,
  IconCloud,
];

export const resolveIcon = (
  code: string,
  fallbackIndex = 0,
): ComponentType<IconProps> => {
  const key = (code || "").trim().toUpperCase();
  return iconRegistry[key] ?? fallbackCycle[fallbackIndex % fallbackCycle.length];
};
