// hooks/useReveal.ts
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function useReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Selezioniamo tutti gli elementi da animare
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els.length) return;

    // 2. Gestiamo il ritardo a cascata (stagger)
    document.querySelectorAll("[data-stagger]").forEach(container => {
      container.querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el, i) => el.style.setProperty("--rd", `${i * 80}ms`));
    });

    // 3. Creiamo l'osservatore (più sensibile)
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      });
    }, { 
      threshold: 0, // Scatta appena un pixel dell'elemento entra nello schermo
      rootMargin: "0px 0px -50px 0px" // Fa scattare l'animazione un po' prima
    });

    // 4. Innesco: controlla subito e osserva
    els.forEach(el => {
      // Se l'elemento è già visibile al caricamento (es. il titolo), forzalo ad apparire
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        // Piccolo timeout per permettere al CSS di registrarsi
        setTimeout(() => el.classList.add("in"), 100);
      } else {
        obs.observe(el);
      }
    });

    return () => obs.disconnect();
  }, [pathname]); // Si riattiva al cambio pagina
}