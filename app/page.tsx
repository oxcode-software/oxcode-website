"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import Image from "next/image";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import Navbar, { type NavLink } from "@/app/components/navbar";
import StatValue from "@/app/components/stat-value";
import { Atmosphere, BackToTop, ScrollProgress } from "@/app/components/atmosphere";
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconGitHub,
  IconInstagram,
  IconLinkedIn,
  IconMail,
  IconPhone,
  IconPin,
  IconShield,
  IconSpark,
  IconStar,
  IconTarget,
  resolveIcon,
} from "@/app/components/icons";
import {
  useActiveSection,
  usePointerParallax,
  useScrollReveal,
  useScrollState,
  useTilt,
} from "@/app/lib/motion";

type PortfolioCategory = "All" | "Mobile" | "Web" | "Enterprise";

type ServiceItem = {
  title: string;
  description: string;
  icon: string;
  sortOrder?: number;
};

type ProjectItem = {
  title: string;
  description: string;
  category: Exclude<PortfolioCategory, "All">;
  image: string;
  sortOrder?: number;
};

type ProductItem = {
  title: string;
  description: string;
  icon: string;
  sortOrder?: number;
};

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedIn?: string;
  github?: string;
  instagram?: string;
  sortOrder?: number;
};

type TestimonialItem = {
  quote: string;
  name: string;
  title: string;
  company: string;
  sortOrder?: number;
};

type SiteSettings = {
  companyName: string;
  heroHeadline: string;
  heroSubtext: string;
  consultationCtaText: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  mapQuery: string;
  copyrightText: string;
};

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const defaultSettings: SiteSettings = {
  companyName: "Oxcode Software Solutions LLP",
  heroHeadline: "We Build Scalable Apps, Web Solutions & Digital Products",
  heroSubtext:
    "Delivering professional software development with modern UI/UX and reliable long-term support.",
  consultationCtaText: "Get a Free Consultation",
  contactEmail: "hello@oxcode.io",
  contactPhone: "+91 90000 12345",
  address: "Business District, India",
  mapQuery: "Bengaluru India",
  copyrightText: "Copyright © 2026 Oxcode Software Solutions LLP",
};

const defaultServices: ServiceItem[] = [
  {
    title: "Mobile App Development (Flutter)",
    description:
      "Cross-platform mobile apps with production-ready architecture and scalable codebases.",
    icon: "FL",
  },
  {
    title: "Website & Web App Development",
    description:
      "Fast, secure, SEO-friendly websites and web apps built for business growth.",
    icon: "WB",
  },

  {
    title: "UI/UX Design",
    description:
      "Human-centered interfaces focused on clarity, usability, and conversion outcomes.",
    icon: "UX",
  },
  {
    title: "Custom SOftware",
    description:
      "Cloud-native deployments, data sync, and platform integrations for modern teams.",
    icon: "CL",
  },
  {
    title: "Maintenance & Support",
    description:
      "Long-term product care with proactive monitoring, updates, and issue resolution.",
    icon: "MS",
  },
];

const defaultProjects: ProjectItem[] = [
  {
    title: "MedTrack Mobile Suite",
    description:
      "Healthcare appointment and records app with secure patient workflows.",
    category: "Mobile" as const,
    image:
      "https://images.pexels.com/photos/7654055/pexels-photo-7654055.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "FinCore Admin Portal",
    description:
      "A web operations platform for finance teams with role-based dashboards.",
    category: "Web" as const,
    image:
      "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "RetailOps Command Center",
    description:
      "Enterprise monitoring workspace with sales, stock, and branch performance.",
    category: "Enterprise" as const,
    image:
      "https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "EduFlow Classroom App",
    description:
      "Mobile learning app for student engagement, assignments, and attendance.",
    category: "Mobile" as const,
    image:
      "https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "ProcureLink Vendor Panel",
    description:
      "Web application streamlining procurement approvals and vendor communication.",
    category: "Web" as const,
    image:
      "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "FactoryPulse Insights",
    description:
      "Enterprise analytics layer for production, quality control, and planning.",
    category: "Enterprise" as const,
    image:
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

const defaultProducts: ProductItem[] = [
  {
    title: "POS System",
    description:
      "A smart point-of-sale platform for billing, inventory, and customer history.",
    icon: "POS",
  },
  {
    title: "Payroll & Attendance Software",
    description:
      "Automated payroll, shift tracking, and attendance reporting for modern teams.",
    icon: "PAY",
  },
  {
    title: "Business Dashboard Tool",
    description:
      "Executive dashboards for KPIs, operations intelligence, and data-driven decisions.",
    icon: "DB",
  },
];

const defaultTeam: TeamMember[] = [
  {
    name: "Arjun Nair",
    role: "Founder & CEO",
    bio: "Leads product strategy, delivery standards, and long-term client success.",
    image: "https://i.pravatar.cc/400?img=12",
  },
  {
    name: "Nisha Thomas",
    role: "Lead Flutter Developer",
    bio: "Builds resilient cross-platform apps with clean architecture principles.",
    image: "https://i.pravatar.cc/400?img=5",
  },
  {
    name: "Rahul Menon",
    role: "UI/UX Designer",
    bio: "Designs intuitive, conversion-focused interfaces grounded in user behavior.",
    image: "https://i.pravatar.cc/400?img=15",
  },
  {
    name: "Devika Sharma",
    role: "Backend Engineer",
    bio: "Engineers secure APIs and distributed systems with strong performance.",
    image: "https://i.pravatar.cc/400?img=9",
  },
];

const defaultTestimonials: TestimonialItem[] = [
  {
    quote:
      "Oxcode transformed our product experience and shipped faster than expected.",
    name: "Anita Rao",
    title: "Operations Head",
    company: "Nexora Retail",
  },
  {
    quote:
      "Their engineering quality and communication made every release predictable.",
    name: "Suresh Iyer",
    title: "CTO",
    company: "FinBridge Technologies",
  },
  {
    quote:
      "From design to deployment, the team delivered a polished and scalable solution.",
    name: "Fathima Ali",
    title: "Product Manager",
    company: "MediAxis Health",
  },
];

const navLinks: NavLink[] = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "products", label: "Products" },
  { id: "team", label: "Team" },
  { id: "contact", label: "Contact" },
];

const heroStats = [
  { value: "120+", label: "Projects Delivered" },
  { value: "99.2%", label: "Client Retention" },
  { value: "24/7", label: "Support Coverage" },
];

const marqueeItems = [
  "Flutter Engineering",
  "Next.js Platforms",
  "Enterprise APIs",
  "Cloud Integration",
  "UX Systems",
  "Product Strategy",
  "DevOps & CI/CD",
  "Data Dashboards",
];

const processSteps = [
  {
    title: "Discover",
    copy: "Requirement workshops, technical feasibility, and a scoped delivery roadmap.",
  },
  {
    title: "Design",
    copy: "Wireframes, design systems, and clickable prototypes signed off before code.",
  },
  {
    title: "Build",
    copy: "Agile sprints with clean architecture, peer review, and automated checks.",
  },
  {
    title: "Scale",
    copy: "Deployment, monitoring, and continuous improvement long after go-live.",
  },
];

const whyPoints = [
  "Modern architecture & clean code",
  "Cross-platform engineering expertise",
  "Design-led, conversion-focused UI",
  "Transparent, milestone-based pricing",
  "Fast delivery with dedicated support",
  "NDA-backed confidentiality on every build",
];

const sortByOrder = <T extends { sortOrder?: number }>(items: T[]): T[] => {
  return [...items].sort((a, b) => (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999));
};

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

/** Headline that lifts word-by-word, with the tail words in brand gradient. */
function AnimatedHeadline({ text }: { text: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  const accentFrom = Math.max(1, words.length - 2);

  return (
    <h1 data-reveal="fade">
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="word-reveal">
            <span
              className={index >= accentFrom ? "headline-accent" : undefined}
              style={{ ["--word-delay" as string]: `${180 + index * 60}ms` }}
            >
              {word}
            </span>
          </span>{" "}
        </Fragment>
      ))}
    </h1>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>("All");
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [projects, setProjects] = useState<ProjectItem[]>(defaultProjects);
  const [products, setProducts] = useState<ProductItem[]>(defaultProducts);
  const [team, setTeam] = useState<TeamMember[]>(defaultTeam);
  const [testimonials, setTestimonials] =
    useState<TestimonialItem[]>(defaultTestimonials);
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [contactStatus, setContactStatus] = useState<{
    tone: "ok" | "err";
    text: string;
  } | null>(null);

  const tiltProps = useTilt();
  /* Interactive surfaces (form fields, embedded map) keep the cursor glow but
     drop the rotation, so targets don't drift while the pointer is on them. */
  const glowProps = useTilt(0);
  const { progress, isStuck, isDeep } = useScrollState();
  const activeSection = useActiveSection(
    useMemo(() => ["home", ...navLinks.map((link) => link.id)], []),
  );
  const heroVisualRef = usePointerParallax<HTMLDivElement>();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [
          settingsSnap,
          servicesSnap,
          projectsSnap,
          productsSnap,
          teamSnap,
          testimonialsSnap,
        ] = await Promise.all([
          getDoc(doc(db, "site_settings", "home")),
          getDocs(collection(db, "services")),
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "products")),
          getDocs(collection(db, "team")),
          getDocs(collection(db, "testimonials")),
        ]);

        if (settingsSnap.exists()) {
          const data = settingsSnap.data();
          setSettings({
            companyName:
              (data.companyName as string) || defaultSettings.companyName,
            heroHeadline:
              (data.heroHeadline as string) || defaultSettings.heroHeadline,
            heroSubtext:
              (data.heroSubtext as string) || defaultSettings.heroSubtext,
            consultationCtaText:
              (data.consultationCtaText as string) ||
              defaultSettings.consultationCtaText,
            contactEmail:
              (data.contactEmail as string) || defaultSettings.contactEmail,
            contactPhone:
              (data.contactPhone as string) || defaultSettings.contactPhone,
            address: (data.address as string) || defaultSettings.address,
            mapQuery: (data.mapQuery as string) || defaultSettings.mapQuery,
            copyrightText:
              (data.copyrightText as string) || defaultSettings.copyrightText,
          });
        }

        const servicesItems = servicesSnap.docs.map((item) => {
          const data = item.data();
          return {
            title: (data.title as string) || "",
            description: (data.description as string) || "",
            icon: (data.icon as string) || "SV",
            sortOrder: Number(data.sortOrder ?? 9999),
          };
        });
        if (servicesItems.length > 0) {
          setServices(sortByOrder(servicesItems));
        }

        const projectsItems = projectsSnap.docs
          .map((item) => {
            const data = item.data();
            const category = (data.category as PortfolioCategory) || "Web";
            if (category === "All") return null;
            return {
              title: (data.title as string) || "",
              description: (data.description as string) || "",
              category,
              image:
                (data.imageUrl as string) ||
                (data.image as string) ||
                "https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=1200",
              sortOrder: Number(data.sortOrder ?? 9999),
            } as ProjectItem;
          })
          .filter((item): item is ProjectItem => item !== null);
        if (projectsItems.length > 0) {
          setProjects(sortByOrder(projectsItems));
        }

        const productsItems = productsSnap.docs.map((item) => {
          const data = item.data();
          return {
            title: (data.title as string) || "",
            description: (data.description as string) || "",
            icon: (data.icon as string) || "PD",
            sortOrder: Number(data.sortOrder ?? 9999),
          };
        });
        if (productsItems.length > 0) {
          setProducts(sortByOrder(productsItems));
        }

        const teamItems = teamSnap.docs.map((item) => {
          const data = item.data();
          return {
            name: (data.name as string) || "",
            role: (data.role as string) || "",
            bio: (data.bio as string) || "",
            image:
              (data.imageUrl as string) ||
              (data.image as string) ||
              "https://i.pravatar.cc/400?img=10",
            linkedIn: (data.linkedIn as string) || "#",
            github: (data.github as string) || "#",
            instagram: (data.instagram as string) || "#",
            sortOrder: Number(data.sortOrder ?? 9999),
          };
        });
        if (teamItems.length > 0) {
          setTeam(sortByOrder(teamItems));
        }

        const testimonialsItems = testimonialsSnap.docs.map((item) => {
          const data = item.data();
          return {
            quote: (data.quote as string) || "",
            name: (data.name as string) || "",
            title: (data.title as string) || "",
            company: (data.company as string) || "",
            sortOrder: Number(data.sortOrder ?? 9999),
          };
        });
        if (testimonialsItems.length > 0) {
          setTestimonials(sortByOrder(testimonialsItems));
        }
      } catch (error) {
        console.error("Failed to load website content from Firestore", error);
      }
    };

    void fetchContent();
  }, []);

  useScrollReveal([
    services,
    projects,
    products,
    team,
    testimonials,
    activeCategory,
  ]);

  const categoryCounts = useMemo(() => {
    const counts: Record<PortfolioCategory, number> = {
      All: projects.length,
      Mobile: 0,
      Web: 0,
      Enterprise: 0,
    };
    projects.forEach((project) => {
      counts[project.category] += 1;
    });
    return counts;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory, projects]);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmittingLead) return;
    setIsSubmittingLead(true);
    setContactStatus(null);
    try {
      await addDoc(collection(db, "contact_leads"), {
        ...contactForm,
        createdAt: serverTimestamp(),
      });
      setContactForm({ name: "", email: "", phone: "", message: "" });
      setContactStatus({
        tone: "ok",
        text: "Thanks — your message has been sent. We reply within one business day.",
      });
    } catch (error) {
      console.error("Failed to submit lead", error);
      setContactStatus({
        tone: "err",
        text: "Could not submit right now. Please try again.",
      });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <div className="site">
      <Atmosphere />
      <ScrollProgress progress={progress} />

      <Navbar
        links={navLinks}
        activeId={activeSection}
        ctaText="Start a Project"
        isStuck={isStuck}
      />

      <main>
        {/* ---------------------------------------------- Hero */}
        <section className="hero" id="home">
          <div className="hero-glow hero-glow-one" aria-hidden="true" />
          <div className="hero-glow hero-glow-two" aria-hidden="true" />
          <div className="hero-grid-overlay" aria-hidden="true" />

          <div className="hero-layout section-container">
            <div className="hero-content">
              <p className="hero-badge" data-reveal="fade">
                <span className="pulse-dot" aria-hidden="true" />
                Enterprise Software Partner
              </p>

              <div className="hero-company" data-reveal="fade">
                <Image
                  className="hero-company-mark"
                  src="/logo.svg"
                  alt="Oxcode logo"
                  width={358}
                  height={232}
                  priority
                />
                <span>{settings.companyName}</span>
              </div>

              <AnimatedHeadline text={settings.heroHeadline} />

              <p className="hero-sub" data-reveal="fade">
                {settings.heroSubtext}
              </p>

              <div className="hero-cta" data-reveal>
                <a className="btn btn-primary" href="#contact">
                  {settings.consultationCtaText}
                  <IconArrowRight className="arrow" />
                </a>
                <a className="btn btn-outline" href="#services">
                  View Our Services
                </a>
              </div>

              <div className="hero-stats" data-stagger>
                {heroStats.map((stat) => (
                  <div className="stat-chip" key={stat.label}>
                    <strong>
                      <StatValue value={stat.value} />
                    </strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true" ref={heroVisualRef}>
              <div className="orbit-ring orbit-ring-three" />
              <div className="orbit-ring orbit-ring-one" />
              <div className="orbit-ring orbit-ring-two" />

              <div className="hero-stack">
                <article className="float-panel panel-primary">
                  <p>
                    <span className="pulse-dot" />
                    Launch Velocity
                  </p>
                  <h3>4x Faster</h3>
                  <div className="panel-chart">
                    {[38, 52, 44, 66, 58, 82, 100].map((height, index) => (
                      <i
                        key={height + index}
                        style={{
                          ["--h" as string]: `${height}%`,
                          ["--d" as string]: `${index * 90}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="caption">Agile delivery framework</span>
                </article>

                <article className="float-panel panel-secondary">
                  <p>Uptime Score</p>
                  <h3>99.95%</h3>
                  <div className="panel-meter">
                    <i style={{ ["--v" as string]: "94%" }} />
                  </div>
                  <span className="caption">Cloud-first infrastructure</span>
                </article>

                <article className="float-panel panel-tertiary">
                  <p>Code Quality</p>
                  <h3>A+</h3>
                  <svg
                    className="panel-spark"
                    viewBox="0 0 160 44"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(111,224,205,0.45)" />
                        <stop offset="100%" stopColor="rgba(111,224,205,0)" />
                      </linearGradient>
                    </defs>
                    <path
                      className="area"
                      d="M0,34 L20,29 L40,31 L60,20 L80,24 L100,13 L120,17 L140,7 L160,10 L160,44 L0,44 Z"
                    />
                    <path
                      className="line"
                      vectorEffect="non-scaling-stroke"
                      d="M0,34 L20,29 L40,31 L60,20 L80,24 L100,13 L120,17 L140,7 L160,10"
                    />
                  </svg>
                  <span className="caption">Architecture &amp; automation</span>
                </article>
              </div>
            </div>
          </div>

          <div className="scroll-hint" aria-hidden="true">
            <span className="mouse" />
            Scroll
          </div>
        </section>

        {/* ---------------------------------------------- Marquee */}
        <div className="tech-marquee" aria-hidden="true">
          <div className="tech-viewport">
            {[0, 1].map((copy) => (
              <div className="tech-track" key={copy}>
                {marqueeItems.map((item) => (
                  <span key={`${copy}-${item}`}>{item}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------- About */}
        <section className="section section-dark" id="about">
          <div className="section-container two-column">
            <div className="section-head" data-reveal="left">
              <p className="eyebrow">
                <span className="pulse-dot" aria-hidden="true" />
                About Us
              </p>
              <h2>{settings.companyName}</h2>
              <p className="section-copy">
                We help startups and enterprises launch high-performance digital
                products through strategic engineering, design excellence, and
                transparent collaboration.
              </p>
              <div className="values" data-stagger>
                <span>
                  <IconSpark width={15} height={15} /> Innovation
                </span>
                <span>
                  <IconShield width={15} height={15} /> Quality
                </span>
                <span>
                  <IconTarget width={15} height={15} /> Reliability
                </span>
              </div>
            </div>

            <div
              className="about-card premium-card"
              data-reveal="right"
              {...tiltProps}
            >
              <h3>
                <IconTarget width={19} height={19} /> Vision &amp; Mission
              </h3>
              <p>
                Our vision is to become a trusted global software partner for
                ambitious businesses.
              </p>
              <p>
                Our mission is to deliver modern, scalable, and maintainable
                digital solutions that drive measurable impact.
              </p>
              <div className="about-split">
                <div>
                  <strong>
                    <StatValue value="8+" />
                  </strong>
                  <span>Years of combined delivery</span>
                </div>
                <div>
                  <strong>
                    <StatValue value="40+" />
                  </strong>
                  <span>Enterprise & startup clients</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- Services */}
        <section className="section" id="services">
          <div className="section-container">
            <div className="section-head" data-reveal>
              <p className="eyebrow">
                <span className="pulse-dot" aria-hidden="true" />
                Services
              </p>
              <h2>Software Services Built For Growth</h2>
              <p className="section-copy">
                End-to-end product teams — strategy, design, engineering, and
                support under one accountable roof.
              </p>
            </div>

            <div className="grid cards-3">
              {services.map((service, index) => {
                const Icon = resolveIcon(service.icon, index);
                return (
                  <article
                    className="card service-card premium-card"
                    key={service.title}
                    data-reveal
                    {...tiltProps}
                  >
                    <span className="card-sheen" aria-hidden="true" />
                    <span className="card-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="card-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <a className="card-link" href="#contact">
                      Discuss this service
                      <IconArrowRight width={15} height={15} />
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- Process */}
        <section className="section section-dark" id="process">
          <div className="section-container">
            <div className="section-head center" data-reveal>
              <p className="eyebrow">
                <span className="pulse-dot" aria-hidden="true" />
                How We Work
              </p>
              <h2>A Delivery Process You Can Plan Around</h2>
              <p className="section-copy">
                Predictable milestones, visible progress, and no surprises between
                kickoff and launch.
              </p>
            </div>

            <div className="process-track">
              {processSteps.map((step, index) => (
                <div className="process-step" key={step.title} data-reveal>
                  <span className="process-node">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- Portfolio */}
        <section className="section" id="portfolio">
          <div className="section-container">
            <div className="portfolio-head">
              <div className="section-head" data-reveal="left">
                <p className="eyebrow">
                  <span className="pulse-dot" aria-hidden="true" />
                  Portfolio
                </p>
                <h2>Recent Projects</h2>
              </div>

              <div
                className="portfolio-filter"
                role="tablist"
                aria-label="Filter projects"
                data-reveal="right"
              >
                {(["All", "Mobile", "Web", "Enterprise"] as PortfolioCategory[]).map(
                  (category) => (
                    <button
                      className={`filter-btn ${activeCategory === category ? "active" : ""}`}
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      aria-pressed={activeCategory === category}
                      type="button"
                    >
                      {category}
                      <b>{categoryCounts[category]}</b>
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="grid cards-3">
              {filteredProjects.map((project) => (
                <article
                  className="card project-card premium-card"
                  key={`${activeCategory}-${project.title}`}
                  data-reveal
                  {...tiltProps}
                >
                  <div className="project-media">
                    <Image
                      src={project.image}
                      alt={`${project.title} preview`}
                      width={1200}
                      height={800}
                      loading="lazy"
                    />
                    <p className="project-tag">{project.category}</p>
                  </div>
                  <div className="project-body">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <a className="card-link" href="#contact">
                      View Case Study
                      <IconArrowRight width={15} height={15} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- Products */}
        <section className="section section-dark" id="products">
          <div className="section-container">
            <div className="section-head" data-reveal>
              <p className="eyebrow">
                <span className="pulse-dot" aria-hidden="true" />
                Products
              </p>
              <h2>Flagship Software Products</h2>
              <p className="section-copy">
                Ready-to-deploy platforms you can brand, extend, and launch in
                weeks instead of quarters.
              </p>
            </div>

            <div className="grid cards-3">
              {products.map((product, index) => {
                const Icon = resolveIcon(product.icon, index);
                return (
                  <article
                    className="card product-card premium-card"
                    key={product.title}
                    data-reveal
                    {...tiltProps}
                  >
                    <span className="card-sheen" aria-hidden="true" />
                    <span className="card-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="card-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <a className="card-link" href="#contact">
                      Request a demo
                      <IconArrowRight width={15} height={15} />
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- Why us */}
        <section className="section" id="why-us">
          <div className="section-container">
            <div className="section-head" data-reveal>
              <p className="eyebrow">
                <span className="pulse-dot" aria-hidden="true" />
                Why Choose Us
              </p>
              <h2>Built Around Quality, Speed, and Clarity</h2>
            </div>

            <ul className="why-list" data-stagger>
              {whyPoints.map((point) => (
                <li key={point}>
                  <span className="why-check" aria-hidden="true">
                    <IconCheck />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------------------------------------- Team */}
        <section className="section section-dark" id="team">
          <div className="section-container">
            <div className="section-head center" data-reveal>
              <p className="eyebrow">
                <span className="pulse-dot" aria-hidden="true" />
                Team Members
              </p>
              <h2>Experts Behind Every Build</h2>
            </div>

            <div className="grid cards-4">
              {team.map((member) => (
                <article
                  className="card team-card premium-card"
                  key={member.name}
                  data-reveal
                  {...tiltProps}
                >
                  <div className="team-avatar">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={200}
                      height={200}
                      loading="lazy"
                    />
                  </div>
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p>{member.bio}</p>
                  <div className="team-socials">
                    <a
                      href={member.linkedIn || "#"}
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <IconLinkedIn />
                    </a>
                    <a
                      href={member.github || "#"}
                      aria-label={`${member.name} on GitHub`}
                    >
                      <IconGitHub />
                    </a>
                    <a
                      href={member.instagram || "#"}
                      aria-label={`${member.name} on Instagram`}
                    >
                      <IconInstagram />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- Testimonials */}
        <section className="section" id="testimonials">
          <div className="section-container">
            <div className="section-head center" data-reveal>
              <p className="eyebrow">
                <span className="pulse-dot" aria-hidden="true" />
                Testimonials
              </p>
              <h2>What Clients Say</h2>
            </div>

            <div className="grid cards-3">
              {testimonials.map((testimonial) => (
                <article
                  className="card testimonial-card premium-card"
                  key={testimonial.name}
                  data-reveal
                  {...tiltProps}
                >
                  <span className="quote-mark" aria-hidden="true">
                    &ldquo;
                  </span>
                  <div className="stars" aria-label="Rated 5 out of 5">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <IconStar key={star} aria-hidden="true" />
                    ))}
                  </div>
                  <p className="quote">{testimonial.quote}</p>
                  <div className="client-row">
                    <span className="client-avatar" aria-hidden="true">
                      {initialsOf(testimonial.name)}
                    </span>
                    <div>
                      <p className="client-name">{testimonial.name}</p>
                      <p className="client-role">
                        {testimonial.title}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- CTA band */}
        <section className="section">
          <div className="section-container">
            <div className="cta-band aurora-ring" data-reveal="zoom">
              <p className="eyebrow">
                <span className="pulse-dot" aria-hidden="true" />
                Let&rsquo;s Build
              </p>
              <h2>Have a product idea? Let&rsquo;s scope it together.</h2>
              <p>
                Share your goals and we will come back with a practical roadmap,
                timeline, and transparent estimate — no obligation.
              </p>
              <div className="cta-actions">
                <a className="btn btn-primary" href="#contact">
                  {settings.consultationCtaText}
                  <IconArrowRight className="arrow" />
                </a>
                <a
                  className="btn btn-outline"
                  href={`mailto:${settings.contactEmail}`}
                >
                  <IconMail />
                  {settings.contactEmail}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- Contact */}
        <section className="section section-dark" id="contact">
          <div className="section-container contact-grid">
            <div>
              <div className="section-head" data-reveal="left">
                <p className="eyebrow">
                  <span className="pulse-dot" aria-hidden="true" />
                  Contact Us
                </p>
                <h2>Start Your Project</h2>
                <p className="section-copy">
                  Tell us about your product goals, timeline, and scope. We will
                  get back to you with a practical roadmap.
                </p>
              </div>

              <form
                className="contact-form premium-card"
                data-reveal="left"
                onSubmit={handleContactSubmit}
                {...glowProps}
              >
                <div className="form-row">
                  <label className="field" htmlFor="name">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder=" "
                      autoComplete="name"
                      value={contactForm.name}
                      onChange={(event) =>
                        setContactForm((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      required
                    />
                    <span>Name</span>
                  </label>

                  <label className="field" htmlFor="email">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder=" "
                      autoComplete="email"
                      value={contactForm.email}
                      onChange={(event) =>
                        setContactForm((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))
                      }
                      required
                    />
                    <span>Email</span>
                  </label>
                </div>

                <label className="field" htmlFor="phone">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder=" "
                    autoComplete="tel"
                    value={contactForm.phone}
                    onChange={(event) =>
                      setContactForm((prev) => ({
                        ...prev,
                        phone: event.target.value,
                      }))
                    }
                  />
                  <span>Phone (optional)</span>
                </label>

                <label className="field" htmlFor="message">
                  <textarea
                    id="message"
                    name="message"
                    placeholder=" "
                    rows={5}
                    value={contactForm.message}
                    onChange={(event) =>
                      setContactForm((prev) => ({
                        ...prev,
                        message: event.target.value,
                      }))
                    }
                    required
                  />
                  <span>Tell us about your project</span>
                </label>

                <div className="form-footer">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={isSubmittingLead}
                  >
                    {isSubmittingLead ? (
                      <>
                        <span className="btn-spinner" aria-hidden="true" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Start Your Project
                        <IconArrowRight className="arrow" />
                      </>
                    )}
                  </button>

                  {contactStatus ? (
                    <p
                      className={`form-status ${contactStatus.tone}`}
                      role="status"
                    >
                      {contactStatus.text}
                    </p>
                  ) : null}
                </div>
              </form>
            </div>

            <aside
              className="contact-aside premium-card"
              data-reveal="right"
              {...glowProps}
            >
              <h3>Reach Us Directly</h3>

              <div className="contact-line">
                <i aria-hidden="true">
                  <IconPin />
                </i>
                <div>
                  <strong>Office</strong>
                  <p>{settings.companyName}</p>
                  <p>{settings.address}</p>
                </div>
              </div>

              <div className="contact-line">
                <i aria-hidden="true">
                  <IconMail />
                </i>
                <div>
                  <strong>Email</strong>
                  <p>
                    <a href={`mailto:${settings.contactEmail}`}>
                      {settings.contactEmail}
                    </a>
                  </p>
                </div>
              </div>

              <div className="contact-line">
                <i aria-hidden="true">
                  <IconPhone />
                </i>
                <div>
                  <strong>Phone</strong>
                  <p>
                    <a href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}>
                      {settings.contactPhone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="contact-line">
                <i aria-hidden="true">
                  <IconClock />
                </i>
                <div>
                  <strong>Response Time</strong>
                  <p>Within one business day</p>
                </div>
              </div>

              <div className="map-frame">
                <iframe
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(settings.mapQuery)}&output=embed`}
                  title="Oxcode office location map"
                />
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------- Footer */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-inner">
            <div className="footer-brand-block">
              <Image
                className="footer-logo"
                src="/logo-full.svg"
                alt="Oxcode Software Solutions LLP"
                width={542}
                height={132}
              />
              <p className="footer-tagline">
                Scalable digital solutions engineered for long-term value —
                mobile, web, and enterprise platforms built to last.
              </p>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <nav>
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#process">How We Work</a>
                <a href="#team">Team</a>
              </nav>
            </div>

            <div className="footer-col">
              <h4>Explore</h4>
              <nav>
                <a href="#services">Services</a>
                <a href="#portfolio">Portfolio</a>
                <a href="#products">Products</a>
                <a href="#testimonials">Testimonials</a>
              </nav>
            </div>

            <div className="footer-col footer-connect">
              <h4>Connect</h4>
              <nav>
                <a href={`mailto:${settings.contactEmail}`}>
                  {settings.contactEmail}
                </a>
                <a href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}>
                  {settings.contactPhone}
                </a>
              </nav>
              <div className="footer-socials">
                <a href="#" aria-label="Oxcode on LinkedIn">
                  <IconLinkedIn />
                </a>
                <a href="#" aria-label="Oxcode on GitHub">
                  <IconGitHub />
                </a>
                <a href="#" aria-label="Oxcode on Instagram">
                  <IconInstagram />
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="copyright">{settings.copyrightText}</p>
            <p className="footer-meta">
              <span className="pulse-dot" aria-hidden="true" />
              Available for new projects
            </p>
          </div>
        </div>
      </footer>

      <BackToTop visible={isDeep} />
    </div>
  );
}
