"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
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
import CountUp from "@/app/components/count-up";
import { ProjectScreen } from "@/app/components/fragments";
import LogoScene from "@/app/components/logo-scene";
import ProductDeck from "@/app/components/product-deck";
import {
  defaultProducts,
  defaultProjects,
  defaultServices,
  defaultSettings,
  defaultTeam,
  describeService,
  faqs,
  mission,
  initialsOf,
  isRealTestimonial,
  principles,
  processSteps,
  realImage,
  realLink,
  stats,
  technologies,
  vision,
  type ProductItem,
  type ProjectCategory,
  type ProjectItem,
  type ServiceItem,
  type SiteSettings,
  type TeamMember,
  type TestimonialItem,
} from "@/app/lib/content";
import { useActiveSection, usePageMotion, useScrollReveal } from "@/app/lib/motion";

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const emptyForm: ContactFormData = { name: "", email: "", phone: "", message: "" };

const sortByOrder = <T extends { sortOrder?: number }>(items: T[]): T[] =>
  [...items].sort((a, b) => (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999));

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [projects, setProjects] = useState<ProjectItem[]>(defaultProjects);
  const [products, setProducts] = useState<ProductItem[]>(defaultProducts);
  const [team, setTeam] = useState<TeamMember[]>(defaultTeam);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [contactForm, setContactForm] = useState<ContactFormData>(emptyForm);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [contactStatus, setContactStatus] = useState<{
    tone: "ok" | "err";
    text: string;
  } | null>(null);

  const navLinks = useMemo<NavLink[]>(
    () => [
      { id: "about", label: "About" },
      { id: "services", label: "Services" },
      { id: "products", label: "Products" },
      { id: "portfolio", label: "Portfolio" },
      ...(team.length > 0 ? [{ id: "team", label: "Team" }] : []),
    ],
    [team.length],
  );

  const activeSection = useActiveSection(
    useMemo(() => ["home", ...navLinks.map((link) => link.id), "contact"], [navLinks]),
  );

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
            contactEmail: (data.contactEmail as string) || defaultSettings.contactEmail,
            contactPhone: (data.contactPhone as string) || defaultSettings.contactPhone,
            address: (data.address as string) || defaultSettings.address,
            copyrightText: (data.copyrightText as string) || defaultSettings.copyrightText,
          });
        }

        const servicesItems = servicesSnap.docs.map((item) => {
          const data = item.data();
          return {
            title: (data.title as string) || "",
            description: (data.description as string) || "",
            sortOrder: Number(data.sortOrder ?? 9999),
          };
        });
        if (servicesItems.length > 0) setServices(sortByOrder(servicesItems));

        const projectsItems = projectsSnap.docs.map((item) => {
          const data = item.data();
          return {
            title: (data.title as string) || "",
            description: (data.description as string) || "",
            category: ((data.category as string) || "Web") as ProjectCategory,
            image: realImage((data.imageUrl as string) || (data.image as string) || ""),
            sortOrder: Number(data.sortOrder ?? 9999),
          };
        });
        if (projectsItems.length > 0) setProjects(sortByOrder(projectsItems));

        const productsItems = productsSnap.docs.map((item) => {
          const data = item.data();
          return {
            title: (data.title as string) || "",
            description: (data.description as string) || "",
            sortOrder: Number(data.sortOrder ?? 9999),
          };
        });
        if (productsItems.length > 0) setProducts(sortByOrder(productsItems));

        const teamItems = teamSnap.docs.map((item) => {
          const data = item.data();
          return {
            name: (data.name as string) || "",
            role: (data.role as string) || "",
            bio: (data.bio as string) || "",
            image: realImage((data.imageUrl as string) || (data.image as string) || ""),
            linkedIn: realLink(data.linkedIn),
            github: realLink(data.github),
            instagram: realLink(data.instagram),
            sortOrder: Number(data.sortOrder ?? 9999),
          };
        });
        if (teamItems.length > 0) setTeam(sortByOrder(teamItems));

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
        setTestimonials(sortByOrder(testimonialsItems.filter(isRealTestimonial)));
      } catch (error) {
        console.error("Failed to load website content from Firestore", error);
      }
    };

    void fetchContent();
  }, []);

  useScrollReveal([services, projects, products, team, testimonials]);
  usePageMotion();

  const updateField =
    (field: keyof ContactFormData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setContactForm((prev) => ({ ...prev, [field]: event.target.value }));

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
      setContactForm(emptyForm);
      setContactStatus({
        tone: "ok",
        text: "Thanks, your message has been sent. We reply within one business day.",
      });
    } catch (error) {
      console.error("Failed to submit lead", error);
      setContactStatus({
        tone: "err",
        text: `Could not send right now. Please try again, or email ${settings.contactEmail}.`,
      });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const phoneHref = `tel:${settings.contactPhone.replace(/\s+/g, "")}`;
  const mailHref = `mailto:${settings.contactEmail}`;
  const address = settings.address.replace(/,\s*/g, ", ");

  return (
    <div className="site">
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <div className="scroll-bar" aria-hidden="true" />

      <Navbar links={navLinks} activeId={activeSection} />

      <main>
        {/* ---------------------------------------------- Hero */}
        <section className="hero" id="home">
          <div className="hero-stage">
            <LogoScene />
            <div className="hero-copy">
              <h1>Software, engineered to last.</h1>
              <p>
                Oxcode designs and builds mobile apps, web platforms and custom software
                for businesses that are ready to grow.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary btn-large" href="#contact">
                  Start a project
                </a>
                <a className="btn btn-ghost btn-large" href="#services">
                  Explore services
                </a>
              </div>
            </div>
            <p className="hero-line">One team, from first idea to long after launch.</p>
          </div>
        </section>

        {/* ---------------------------------------------- Technology strip */}
        <section className="strip" aria-label="Technologies we use">
          <div className="strip-track">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1}>
                {technologies.map((item) => (
                  <li key={item.name}>
                    <i style={{ maskImage: `url(/tech/${item.icon}.svg)`, WebkitMaskImage: `url(/tech/${item.icon}.svg)` }} />
                    {item.name}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------- About */}
        <section className="shell section" id="about">
          <div className="about">
            <div>
              <h2 data-reveal>A software partner you can build on.</h2>
              <p className="lead" data-reveal>
                {settings.companyName} is a software development company in Perinthalmanna,
                Kerala. We work with startups and established businesses, turning the way
                they work into dependable digital products.
              </p>
              <dl className="stats" data-reveal>
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt>{stat.label}</dt>
                    <dd>
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="about-cards">
              <article className="card tilt" data-tilt data-reveal>
                <h3>Our vision</h3>
                <p>{vision}</p>
              </article>
              <article className="card tilt" data-tilt data-reveal>
                <h3>Our mission</h3>
                <p>{mission}</p>
              </article>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- Services */}
        <section className="orbit" id="services">
          <div className="orbit-stage">
            <div className="shell orbit-head">
              <h2>Our services</h2>
              <p className="lead">Strategy, design, engineering and support from one team.</p>
            </div>
            <div className="orbit-track">
              {services.map((service) => {
                const detail = describeService(service);
                return (
                  <a className="orbit-card" href="#contact" key={service.title}>
                    <h3>{service.title}</h3>
                    <p>{detail.copy}</p>
                    {detail.includes.length > 0 ? (
                      <ul>
                        {detail.includes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                    <span className="text-link">
                      Discuss this service <span aria-hidden="true">&rarr;</span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- Products */}
        <section className="shell section" id="products">
          <h2 data-reveal>Our products</h2>
          <p className="lead head-lead" data-reveal>
            Ready platforms we adapt and brand for your business, so you launch in less time
            than a build from scratch.
          </p>
          <ProductDeck products={products} />
        </section>

        {/* ---------------------------------------------- Portfolio */}
        <section className="shell section" id="portfolio">
          <h2 data-reveal>Selected work</h2>
          <p className="lead head-lead" data-reveal>
            Products we have designed, built and shipped.
          </p>

          <div className="work-list">
            {projects.map((project) => (
              <article className="work tilt" data-tilt key={project.title} data-reveal>
                <div className="work-media">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={`${project.title} screens`}
                      width={1200}
                      height={900}
                      sizes="(max-width: 900px) 100vw, 50vw"
                      unoptimized
                    />
                  ) : (
                    <div className="work-depth">
                      <ProjectScreen category={project.category} />
                    </div>
                  )}
                </div>
                <div className="work-text">
                  <p className="work-category">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------- Process */}
        <section className="shell section" id="process">
          <h2 data-reveal>How we work</h2>
          <p className="lead head-lead" data-reveal>
            Clear milestones and visible progress, with no surprises at launch.
          </p>

          <ol className="process">
            {processSteps.map((step) => (
              <li key={step.title} data-reveal>
                <i aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
                <p className="process-output">{step.output}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------- Why us */}
        <section className="shell section" id="why-us">
          <h2 data-reveal>Why choose Oxcode</h2>
          <ul className="reasons">
            {principles.map((point) => (
              <li className="card tilt" data-tilt key={point.title} data-reveal>
                <h3>{point.title}</h3>
                <p>{point.copy}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------- Team */}
        {team.length > 0 ? (
          <section className="shell section" id="team">
            <h2 data-reveal>Meet the team</h2>
            <p className="lead head-lead" data-reveal>
              The people who design, build and support your product.
            </p>

            <ul className="team">
              {team.map((member) => (
                <li className="member" key={member.name} data-reveal>
                  <div className="member-flip" tabIndex={0}>
                    <div className="member-front">
                      {member.image ? (
                        <Image src={member.image} alt={member.name} fill sizes="400px" unoptimized />
                      ) : (
                        <span aria-hidden="true">{initialsOf(member.name)}</span>
                      )}
                    </div>
                    <div className="member-back">
                      <p>{member.bio}</p>
                      {member.linkedIn || member.github || member.instagram ? (
                        <div className="member-links">
                          {member.linkedIn ? <a href={member.linkedIn}>LinkedIn</a> : null}
                          {member.github ? <a href={member.github}>GitHub</a> : null}
                          {member.instagram ? <a href={member.instagram}>Instagram</a> : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <h3>{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ---------------------------------------------- Testimonials (real entries only) */}
        {testimonials.length > 0 ? (
          <section className="shell section" id="testimonials">
            <h2 data-reveal>What clients say</h2>
            <div className="quotes">
              {testimonials.map((item) => (
                <blockquote className="card" key={item.name} data-reveal>
                  <p>{item.quote}</p>
                  <footer>
                    {item.name}, {item.title}, {item.company}
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        ) : null}

        {/* ---------------------------------------------- FAQ */}
        <section className="shell section" id="faq">
          <div className="faq-grid">
            <h2 data-reveal>Questions, answered</h2>
            <div className="faq">
              {faqs.map((item) => (
                <details key={item.question} data-reveal>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- Contact */}
        <section className="shell section" id="contact">
          <div className="contact card" data-reveal>
            <div className="contact-intro">
              <h2>Let&rsquo;s build something solid.</h2>
              <p className="lead">
                Tell us about your goals, timeline and scope. We reply within one business
                day with a practical next step.
              </p>
              <dl className="contact-list">
                <div>
                  <dt>Phone</dt>
                  <dd><a href={phoneHref}>{settings.contactPhone}</a></dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd><a href={mailHref}>{settings.contactEmail}</a></dd>
                </div>
                <div>
                  <dt>Office</dt>
                  <dd>{address}</dd>
                </div>
              </dl>
              <div className="map">
                <iframe
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
                  title={`Map of ${settings.address}`}
                />
              </div>
            </div>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              <div className="form-row">
                <label className="field">
                  <span>Name</span>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={contactForm.name}
                    onChange={updateField("name")}
                    required
                  />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={contactForm.email}
                    onChange={updateField("email")}
                    required
                  />
                </label>
              </div>
              <label className="field">
                <span>Phone (optional)</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={contactForm.phone}
                  onChange={updateField("phone")}
                />
              </label>
              <label className="field field-grow">
                <span>About your project</span>
                <textarea
                  name="message"
                  rows={6}
                  value={contactForm.message}
                  onChange={updateField("message")}
                  required
                />
              </label>
              <button className="btn btn-primary btn-large" type="submit" disabled={isSubmittingLead}>
                {isSubmittingLead ? "Sending…" : "Send message"}
              </button>
              {contactStatus ? (
                <p className={`form-status ${contactStatus.tone}`} role="status">
                  {contactStatus.text}
                </p>
              ) : null}
            </form>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------- Footer */}
      <footer className="shell footer">
        <div className="footer-columns">
          <div className="footer-brand">
            <Image src="/logo-full.svg" alt="Oxcode Software Solutions LLP" width={542} height={132} />
            <p>{address}</p>
          </div>
          <nav aria-label="Footer navigation">
            <h3>Company</h3>
            {navLinks.map((link) => (
              <a key={link.id} href={`#${link.id}`}>
                {link.label}
              </a>
            ))}
            <a href="#contact">Contact</a>
          </nav>
          <div>
            <h3>Services</h3>
            {services.map((service) => (
              <a key={service.title} href="#services">
                {service.title}
              </a>
            ))}
          </div>
          <div>
            <h3>Contact</h3>
            <a href={phoneHref}>{settings.contactPhone}</a>
            <a href={mailHref}>{settings.contactEmail}</a>
          </div>
        </div>
        <p className="footer-legal">{settings.copyrightText}</p>
      </footer>

      <a
        className="whatsapp"
        href={`https://wa.me/${settings.contactPhone.replace(/\D/g, "")}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Oxcode on WhatsApp"
      >
        <i style={{ maskImage: "url(/tech/whatsapp.svg)", WebkitMaskImage: "url(/tech/whatsapp.svg)" }} />
      </a>
    </div>
  );
}
