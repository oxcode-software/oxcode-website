export type ProjectCategory = "Mobile" | "Web" | "Enterprise";

export type ServiceItem = {
  title: string;
  description: string;
  sortOrder?: number;
};

export type ProjectItem = {
  title: string;
  description: string;
  category: ProjectCategory;
  image: string;
  sortOrder?: number;
};

export type ProductItem = {
  title: string;
  description: string;
  sortOrder?: number;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedIn?: string;
  github?: string;
  instagram?: string;
  sortOrder?: number;
};

export type TestimonialItem = {
  quote: string;
  name: string;
  title: string;
  company: string;
  sortOrder?: number;
};

export type SiteSettings = {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  copyrightText: string;
};

export const defaultSettings: SiteSettings = {
  companyName: "Oxcode Software Solutions LLP",
  contactEmail: "info@oxcode.com",
  contactPhone: "+91 7012704540",
  address: "Perinthalmanna, Malappuram, Kerala",
  copyrightText: "Copyright © 2026 Oxcode Software Solutions LLP",
};

export const defaultServices: ServiceItem[] = [
  { title: "Mobile App Development (Flutter)", description: "" },
  { title: "Website & Web App Development", description: "" },
  { title: "UI/UX Design", description: "" },
  { title: "Custom Software", description: "" },
  { title: "Maintenance & Support", description: "" },
];

export const defaultProjects: ProjectItem[] = [
  {
    title: "MedTrack Mobile Suite",
    description:
      "Healthcare appointment and records app with secure patient workflows.",
    category: "Mobile",
    image: "",
  },
  {
    title: "RetailOps Command Center",
    description:
      "Enterprise monitoring workspace with sales, stock, and branch performance.",
    category: "Enterprise",
    image: "",
  },
];

/* Demo team, shown until the admin adds members in Firestore. */
export const defaultTeam: TeamMember[] = [
  {
    name: "Arjun Nair",
    role: "Founder & CEO",
    bio: "Leads product strategy, delivery standards, and long-term client success.",
    image: "",
  },
  {
    name: "Nisha Thomas",
    role: "Lead Flutter Developer",
    bio: "Builds resilient cross-platform apps with clean architecture principles.",
    image: "",
  },
  {
    name: "Rahul Menon",
    role: "UI/UX Designer",
    bio: "Designs intuitive, conversion-focused interfaces grounded in user behavior.",
    image: "",
  },
];

export const defaultProducts: ProductItem[] = [
  {
    title: "POS System",
    description:
      "A smart point-of-sale platform for billing, inventory, and customer history.",
  },
  {
    title: "Payroll & Attendance Software",
    description:
      "Automated payroll, shift tracking, and attendance reporting for modern teams.",
  },
  {
    title: "Business Dashboard Tool",
    description:
      "Executive dashboards for KPIs, operations intelligence, and data-driven decisions.",
  },
];

/* Site-owned wording for the known services and products. Anything added later
   in Firestore under another title keeps showing its own description. */
const serviceCopy: Record<string, { copy: string; includes: string[] }> = {
  "mobile app development (flutter)": {
    copy: "One Flutter codebase for Android and iOS, from the first screen to the store listing.",
    includes: ["Android and iOS", "Play Store and App Store release", "Payments and notifications"],
  },
  "website & web app development": {
    copy: "Company sites that load fast and can be found, and web apps with logins, roles and admin panels.",
    includes: ["Next.js builds", "Search setup", "Admin panels"],
  },
  "ui/ux design": {
    copy: "We design the screens and put a clickable prototype in your hands before anyone writes code.",
    includes: ["Wireframes", "Clickable prototypes", "Design systems"],
  },
  "custom software": {
    copy: "Software shaped around how your business already works, connected to the tools you keep.",
    includes: ["Workflow mapping", "Cloud deployment", "Integrations and data sync"],
  },
  "maintenance & support": {
    copy: "We stay after launch with updates, fixes, monitoring and the small changes every product needs.",
    includes: ["Monitoring", "Updates and fixes", "Ongoing improvements"],
  },
};

export const describeService = (service: ServiceItem) =>
  serviceCopy[service.title.trim().toLowerCase()] ?? {
    copy: service.description,
    includes: [],
  };

const productCopy: Record<string, string> = {
  "pos system":
    "Billing at the counter, stock that updates itself, and a history for every customer.",
  "payroll & attendance software":
    "Attendance from the shift goes straight into the month's pay, with deductions worked out.",
  "business dashboard tool":
    "Sales and operations across every branch on one screen, with the number that changed called out.",
};

export const describeProduct = (product: ProductItem) =>
  productCopy[product.title.trim().toLowerCase()] ?? product.description;

/* Seed rows still sitting in Firestore: stock photos, avatar-generator faces and
   sample testimonials. They stay off the page until real entries replace them. */
const STOCK_IMAGE = /pexels\.com|pravatar\.cc/;
const SEED_TESTIMONIALS = new Set(["Anita Rao", "Suresh Iyer", "Fathima Ali"]);

export const realImage = (url: string) => (STOCK_IMAGE.test(url) ? "" : url);
export const realLink = (value: unknown) =>
  typeof value === "string" && value !== "#" ? value : "";
export const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
export const isRealTestimonial = (item: TestimonialItem) =>
  !SEED_TESTIMONIALS.has(item.name);

export const vision =
  "To be a trusted software partner for ambitious businesses, in Kerala and beyond.";
export const mission =
  "To deliver modern, scalable and maintainable software that makes a measurable difference to the businesses using it.";

export const stats = [
  { value: 10, suffix: "+", label: "Projects" },
  { value: 1, suffix: "", label: "Year" },
];

export const technologies = [
  { name: "Flutter", icon: "flutter" },
  { name: "Dart", icon: "dart" },
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextdotjs" },
  { name: "Node.js", icon: "nodedotjs" },
  { name: "TypeScript", icon: "typescript" },
  { name: "Firebase", icon: "firebase" },
  { name: "Tailwind", icon: "tailwindcss" },
  { name: "Android", icon: "android" },
  { name: "iOS", icon: "apple" },
  { name: "GitHub", icon: "github" },
  { name: "Figma", icon: "figma" },
];

export const faqs = [
  {
    question: "How do you price a project?",
    answer:
      "We scope the work first, then give you a price for each milestone, so you know what a stage costs before it starts.",
  },
  {
    question: "Can you build for both Android and iOS?",
    answer:
      "Yes. We build with Flutter, which lets one codebase run on both platforms, and we handle the Play Store and App Store release.",
  },
  {
    question: "Will you sign an NDA?",
    answer: "Yes. Every build is covered by an NDA, so your idea and your data stay yours.",
  },
  {
    question: "What happens after launch?",
    answer:
      "We stay available for monitoring, updates, fixes and the improvements your product needs as it grows.",
  },
];

export const processSteps = [
  {
    title: "Discover",
    copy: "We work through your requirements, check what is technically sound, and agree a scoped roadmap.",
    output: "You get a roadmap and an estimate",
  },
  {
    title: "Design",
    copy: "Wireframes become a design system and a clickable prototype that you sign off before code.",
    output: "You get a prototype to approve",
  },
  {
    title: "Build",
    copy: "Short sprints with peer review and automated checks. You see working software as it grows.",
    output: "You get a working release each sprint",
  },
  {
    title: "Scale",
    copy: "We deploy, watch how it runs, and keep improving it long after go-live.",
    output: "You get monitoring and support",
  },
];

export const principles = [
  { title: "A price for each milestone", copy: "You know what a stage costs before it starts." },
  { title: "Designed before it is built", copy: "You approve the screens while they are still cheap to change." },
  { title: "One team for app and web", copy: "Flutter and web engineers work on the same product." },
  { title: "An NDA on every build", copy: "Your idea and your data stay yours." },
  { title: "Code another team can read", copy: "Clean structure and peer review on every change." },
  { title: "Support that continues", copy: "The people who built it stay available after launch." },
];

export const inr = (value: number, fractionDigits = 0) =>
  `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
