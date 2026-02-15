"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type MouseEvent,
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

const sortByOrder = <T extends { sortOrder?: number }>(items: T[]): T[] => {
  return [...items].sort((a, b) => (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999));
};

export default function Home() {
  const [activeCategory, setActiveCategory] =
    useState<PortfolioCategory>("All");
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [projects, setProjects] = useState<ProjectItem[]>(defaultProjects);
  const [products, setProducts] = useState<ProductItem[]>(defaultProducts);
  const [team, setTeam] = useState<TeamMember[]>(defaultTeam);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(
    defaultTestimonials,
  );
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [contactStatus, setContactStatus] = useState("");

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
            companyName: (data.companyName as string) || defaultSettings.companyName,
            heroHeadline:
              (data.heroHeadline as string) || defaultSettings.heroHeadline,
            heroSubtext: (data.heroSubtext as string) || defaultSettings.heroSubtext,
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

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${(index % 8) * 70}ms`);
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") {
      return projects;
    }
    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory, projects]);

  const handleTilt = (event: MouseEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const relativeY = event.clientY - rect.top;
    const rotateY = ((relativeX / rect.width) * 2 - 1) * 8;
    const rotateX = (1 - (relativeY / rect.height) * 2) * 8;

    element.style.setProperty("--rotate-x", `${rotateX.toFixed(2)}deg`);
    element.style.setProperty("--rotate-y", `${rotateY.toFixed(2)}deg`);
    element.style.setProperty("--glow-x", `${(relativeX / rect.width) * 100}%`);
    element.style.setProperty("--glow-y", `${(relativeY / rect.height) * 100}%`);
  };

  const resetTilt = (event: MouseEvent<HTMLElement>) => {
    const element = event.currentTarget;
    element.style.setProperty("--rotate-x", "0deg");
    element.style.setProperty("--rotate-y", "0deg");
    element.style.setProperty("--glow-x", "50%");
    element.style.setProperty("--glow-y", "50%");
  };

  const tiltProps = {
    onMouseMove: handleTilt,
    onMouseLeave: resetTilt,
  };

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmittingLead) return;
    setIsSubmittingLead(true);
    setContactStatus("");
    try {
      await addDoc(collection(db, "contact_leads"), {
        ...contactForm,
        createdAt: serverTimestamp(),
      });
      setContactForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setContactStatus("Thanks. Your message has been sent.");
    } catch (error) {
      console.error("Failed to submit lead", error);
      setContactStatus("Could not submit right now. Please try again.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <div className="site">
      <header className="topbar">
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
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#products">Products</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />
          <div className="hero-grid-overlay" />
          <div className="hero-layout section-container">
            <div className="hero-content" data-reveal>
              <p className="eyebrow">Enterprise Software Partner</p>
              <div className="hero-company">
                <Image
                  className="hero-company-mark"
                  src="/logo.svg"
                  alt="Oxcode logo"
                  width={358}
                  height={232}
                />
                <span>{settings.companyName}</span>
              </div>
              <h1>{settings.heroHeadline}</h1>
              <p className="hero-sub">{settings.heroSubtext}</p>
              <div className="hero-cta">
                <a className="btn btn-primary" href="#contact">
                  {settings.consultationCtaText}
                </a>
                <a className="btn btn-outline" href="#services">
                  View Our Services
                </a>
              </div>
              <div className="hero-stats">
                <div className="stat-chip">
                  <strong>120+</strong>
                  <span>Projects Delivered</span>
                </div>
                <div className="stat-chip">
                  <strong>99.2%</strong>
                  <span>Client Retention</span>
                </div>
                <div className="stat-chip">
                  <strong>24/7</strong>
                  <span>Support Coverage</span>
                </div>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true" data-reveal>
              <div className="orbit-ring orbit-ring-one" />
              <div className="orbit-ring orbit-ring-two" />
              <div className="hero-stack">
                <article className="float-panel panel-primary">
                  <p>Launch Velocity</p>
                  <h3>4x Faster</h3>
                  <span>Agile Delivery Framework</span>
                </article>
                <article className="float-panel panel-secondary">
                  <p>Uptime Score</p>
                  <h3>99.95%</h3>
                  <span>Cloud-First Infrastructure</span>
                </article>
                <article className="float-panel panel-tertiary">
                  <p>Code Quality</p>
                  <h3>A+</h3>
                  <span>Architecture &amp; Automation</span>
                </article>
              </div>
            </div>
          </div>
        </section>

        <div className="tech-marquee" aria-hidden="true">
          <div className="tech-track">
            <span>Flutter Engineering</span>
            <span>Next.js Platforms</span>
            <span>Enterprise APIs</span>
            <span>Cloud Integration</span>
            <span>UX Systems</span>
            <span>Product Strategy</span>
          </div>
        </div>

        <section className="section section-dark" id="about">
          <div className="section-container two-column">
            <div>
              <p className="eyebrow">About Us</p>
              <h2>{settings.companyName}</h2>
              <p className="section-copy">
                We help startups and enterprises launch high-performance digital
                products through strategic engineering, design excellence, and
                transparent collaboration.
              </p>
              <div className="values">
                <span>Innovation</span>
                <span>Quality</span>
                <span>Reliability</span>
              </div>
            </div>
            <div
              className="about-card premium-card"
              data-reveal
              onMouseLeave={resetTilt}
              onMouseMove={handleTilt}
            >
              <h3>Vision &amp; Mission</h3>
              <p>
                Our vision is to become a trusted global software partner for
                ambitious businesses.
              </p>
              <p>
                Our mission is to deliver modern, scalable, and maintainable
                digital solutions that drive measurable impact.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="section-container">
            <p className="eyebrow">Services</p>
            <h2>Software Services Built For Growth</h2>
            <div className="grid cards-3">
              {services.map((service) => (
                <article
                  className="card service-card premium-card"
                  key={service.title}
                  data-reveal
                  {...tiltProps}
                >
                  <span className="card-icon">{service.icon}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark" id="portfolio">
          <div className="section-container">
            <p className="eyebrow">Portfolio</p>
            <h2>Recent Projects</h2>
            <div className="portfolio-filter" role="tablist" aria-label="Filter projects">
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
                  </button>
                ),
              )}
            </div>
            <div className="grid cards-3">
              {filteredProjects.map((project) => (
                <article
                  className="card project-card premium-card"
                  key={project.title}
                  data-reveal
                  {...tiltProps}
                >
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    width={1200}
                    height={800}
                    loading="lazy"
                  />
                  <div className="project-body">
                    <p className="project-tag">{project.category}</p>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <a href="#contact">View Case Study</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="products">
          <div className="section-container">
            <p className="eyebrow">Products</p>
            <h2>Flagship Software Products</h2>
            <div className="grid cards-3">
              {products.map((product) => (
                <article
                  className="card product-card premium-card"
                  key={product.title}
                  data-reveal
                  {...tiltProps}
                >
                  <span className="card-icon">{product.icon}</span>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark" id="why-us">
          <div className="section-container">
            <p className="eyebrow">Why Choose Us</p>
            <h2>Built Around Quality, Speed, and Clarity</h2>
            <ul className="why-list">
              <li>Modern architecture &amp; clean code</li>
              <li>Cross-platform expertise</li>
              <li>Quality design &amp; UI focus</li>
              <li>Transparent pricing</li>
              <li>Fast delivery &amp; support</li>
            </ul>
          </div>
        </section>

        <section className="section" id="team">
          <div className="section-container">
            <p className="eyebrow">Team Members</p>
            <h2>Experts Behind Every Build</h2>
            <div className="grid cards-4">
              {team.map((member) => (
                <article
                  className="card team-card premium-card"
                  key={member.name}
                  data-reveal
                  {...tiltProps}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={160}
                    height={160}
                    loading="lazy"
                  />
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p>{member.bio}</p>
                  <div className="team-socials">
                    <a href={member.linkedIn || "#"} aria-label={`${member.name} on LinkedIn`}>
                      LinkedIn
                    </a>
                    <a href={member.github || "#"} aria-label={`${member.name} on GitHub`}>
                      GitHub
                    </a>
                    <a href={member.instagram || "#"} aria-label={`${member.name} on Instagram`}>
                      Instagram
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark" id="testimonials">
          <div className="section-container">
            <p className="eyebrow">Testimonials</p>
            <h2>What Clients Say</h2>
            <div className="grid cards-3">
              {testimonials.map((testimonial) => (
                <article
                  className="card testimonial-card premium-card"
                  key={testimonial.name}
                  data-reveal
                  {...tiltProps}
                >
                  <p className="quote">&ldquo;{testimonial.quote}&rdquo;</p>
                  <p className="client-name">{testimonial.name}</p>
                  <p className="client-role">
                    {testimonial.title}, {testimonial.company}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="contact">
          <div className="section-container contact-grid">
            <div>
              <p className="eyebrow">Contact Us</p>
              <h2>Start Your Project</h2>
              <p className="section-copy">
                Tell us about your product goals, timeline, and scope. We will
                get back to you with a practical roadmap.
              </p>
              <form
                className="contact-form premium-card"
                data-reveal
                onSubmit={handleContactSubmit}
                {...tiltProps}
              >
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={contactForm.name}
                  onChange={(event) =>
                    setContactForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                />

                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  value={contactForm.email}
                  onChange={(event) =>
                    setContactForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  required
                />

                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 000 000 0000"
                  value={contactForm.phone}
                  onChange={(event) =>
                    setContactForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                />

                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your project requirements."
                  rows={5}
                  value={contactForm.message}
                  onChange={(event) =>
                    setContactForm((prev) => ({ ...prev, message: event.target.value }))
                  }
                  required
                />

                <button className="btn btn-primary" type="submit" disabled={isSubmittingLead}>
                  {isSubmittingLead ? "Sending..." : "Start Your Project"}
                </button>
                {contactStatus ? <p>{contactStatus}</p> : null}
              </form>
            </div>

            <aside className="contact-aside premium-card" data-reveal {...tiltProps}>
              <h3>Address</h3>
              <p>{settings.companyName}</p>
              <p>{settings.address}</p>
              <p>{settings.contactEmail}</p>
              <p>{settings.contactPhone}</p>
              <iframe
                loading="lazy"
                src={`https://www.google.com/maps?q=${encodeURIComponent(settings.mapQuery)}&output=embed`}
                title="Oxcode office location map"
              />
            </aside>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-container footer-inner">
          <div className="footer-brand-block">
            <Image
              className="footer-logo"
              src="/logo-full.svg"
              alt="Oxcode Software Solutions LLP"
              width={542}
              height={132}
            />
            <p className="footer-tagline">
              Scalable digital solutions engineered for long-term value.
            </p>
          </div>
          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#portfolio">Portfolio</a>
          </div>
          <div className="footer-socials">
            <a href="#" aria-label="LinkedIn">
              LinkedIn
            </a>
            <a href="#" aria-label="GitHub">
              GitHub
            </a>
            <a href="#" aria-label="Instagram">
              Instagram
            </a>
          </div>
        </div>
        <p className="copyright">
          {settings.copyrightText}
        </p>
      </footer>
    </div>
  );
}
