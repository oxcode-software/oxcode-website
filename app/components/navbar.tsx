"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type NavLink = { id: string; label: string };

type NavbarProps = {
  links: NavLink[];
  activeId: string;
};

export default function Navbar({ links, activeId }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

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
    <header className="topbar">
      <div className="topbar-inner">
        <a className="logo" href="#home" aria-label="Oxcode home">
          <Image src="/logo-full.svg" alt="Oxcode Software Solutions LLP" width={542} height={132} priority />
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={activeId === link.id ? "true" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a className="btn btn-primary nav-cta" href="#contact">
          Start a project
        </a>

        <button
          type="button"
          className="nav-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </div>

      {isOpen ? (
        <div className="mobile-menu" id="mobile-menu">
          {links.map((link) => (
            <a key={link.id} href={`#${link.id}`} onClick={() => setIsOpen(false)}>
              {link.label}
            </a>
          ))}
          <a className="btn btn-primary" href="#contact" onClick={() => setIsOpen(false)}>
            Start a project
          </a>
        </div>
      ) : null}
    </header>
  );
}
