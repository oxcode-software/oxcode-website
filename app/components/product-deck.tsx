"use client";

import { useEffect, useRef, useState } from "react";

import { ProductScreen } from "@/app/components/fragments";
import { describeProduct, type ProductItem } from "@/app/lib/content";

/** Scrolling through the list brings each product's screen to the front of a 3D stack. */
export default function ProductDeck({ products }: { products: ProductItem[] }) {
  const [active, setActive] = useState(0);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const steps = stepsRef.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!steps) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, [products.length]);

  return (
    <div className="deck">
      <div className="deck-steps" ref={stepsRef}>
        {products.map((product, index) => (
          <article
            className={`deck-step ${index === active ? "is-active" : ""}`}
            data-step={index}
            key={product.title}
          >
            <h3>{product.title}</h3>
            <p>{describeProduct(product)}</p>
            <a className="text-link" href="#contact">
              Request a demo
              <span aria-hidden="true"> &rarr;</span>
            </a>
            <div className="deck-inline" aria-hidden="true">
              <div className="window">
                <ProductScreen title={product.title} />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="deck-stage" aria-hidden="true">
        <div className="deck-scene">
          {products.map((product, index) => {
            const offset = index - active;
            const depth = Math.abs(offset);
            return (
              <div
                className="window deck-window"
                key={product.title}
                style={{
                  transform: `translate3d(${offset * 62}px, ${offset * -44}px, ${depth * -190}px) rotateY(-16deg) rotateX(7deg)`,
                  opacity: offset === 0 ? 1 : Math.max(0.16, 0.42 - depth * 0.12),
                  zIndex: 10 - depth,
                }}
              >
                <ProductScreen title={product.title} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
