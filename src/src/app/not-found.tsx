// app/not-found.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname() || '';
  
  let destination = '/';
  let title = 'Rotta Dispersa';
  let description = 'Il documento o la risorsa richiesta non è attualmente depositata nei nostri archivi pubblici.';
  let ctaText = '← Ritorna all\'Indice Generale';
  let codeLabel = 'Coordinate Non Valide';

  if (pathname.startsWith('/admin')) {
    destination = '/admin/login';
    title = 'Accesso Direttivo Interrotto';
    description = 'Il pannello di controllo direzionale esige credenziali di massimo livello. L\'accesso libero è stato revocato.';
    ctaText = 'Autenticati nella Direzione →';
    codeLabel = 'Protocollo di Sicurezza';
  } else if (pathname.startsWith('/autori-area')) {
    destination = '/autori-area/login';
    title = 'Accesso Firme Interrotto';
    description = 'L\'archivio riservato agli autori richiede il superamento del filtro di autenticazione.';
    ctaText = 'Autenticati nell\'Area Autori →';
    codeLabel = 'Settore Riservato';
  }

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--ink)] selection:text-[var(--paper-bright)] flex flex-col items-center justify-center p-6">
      <div className="max-w-md text-center animate-in fade-in zoom-in-95 duration-1000">
        
        <span className="font-serif text-[var(--ink)] text-5xl md:text-6xl mb-6 block font-light">—</span>
        
        <span className="mono-sm text-[var(--ink-light)] mb-8 block">
          Codice 404 — {codeLabel}
        </span>
        
        <h1 className="font-serif text-5xl md:text-7xl tracking-tighter text-[var(--ink)] mb-8 leading-[0.9]">
          {title}
        </h1>
        
        <p className="prose-md text-[var(--ink-mid)] mb-16">
          {description}
        </p>
        
        <Link
          href={destination}
          className="inline-block mono-sm text-[var(--ink)] border-b border-[var(--ink)] pb-1 hover:text-[var(--ink-light)] hover:border-[var(--ink-light)] transition-colors"
        >
          {ctaText}
        </Link>
        
      </div>
    </main>
  );
}