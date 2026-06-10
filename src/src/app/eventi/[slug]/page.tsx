// app/eventi/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getEventBySlug, Event } from '@/lib/api';

export default function EventLandingPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof slug === 'string') {
      getEventBySlug(slug)
        .then((data) => {
          if (!data) router.replace('/eventi');
          else setEvent(data);
        })
        .catch(() => router.replace('/eventi'))
        .finally(() => setLoading(false));
    }
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-[var(--ink)] rounded-full animate-spin mb-4"></div>
          <span className="mono-sm text-[var(--ink-light)] tracking-[0.3em]">Decrittazione Coordinate...</span>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const eventDate = new Date(event.date);
  const isPast = eventDate.getTime() < new Date().getTime();

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--ink)] selection:text-[var(--paper-bright)]">
      
      {/* ── HEADER NAVIGAZIONE RAPIDA ── */}
      <div className="pt-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <Link href="/eventi" className="mono-sm text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors">
          ← Torna al Calendario
        </Link>
      </div>

      {/* ── SEZIONE HERO: SPLIT LAYOUT EDITORIALE ── */}
      <section className="py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Colonna Sinistra: Copy & Dati */}
          <div className="flex flex-col order-2 lg:order-1 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4 mb-8">
              <span className={`w-2 h-2 rounded-full ${isPast ? 'bg-[var(--ink-ghost)]' : 'bg-[var(--accent)] animate-pulse'}`} />
              <span className="mono-sm text-[var(--ink-light)]">
                {isPast ? 'Evento Concluso' : 'Accesso Disponibile'}
              </span>
            </div>

            <h1 className="display-lg mb-8 text-[var(--ink)]">
              {event.title}
            </h1>

            <div className="flex flex-col gap-6 py-8 border-y border-[var(--paper-border)] mb-8">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
                <span className="mono-sm text-[var(--ink-light)] w-24">Data & Ora</span>
                <span className="font-sans text-lg text-[var(--ink)]">
                  {eventDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} — {eventDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
                <span className="mono-sm text-[var(--ink-light)] w-24">Location</span>
                <span className="font-sans text-lg text-[var(--ink)] font-medium">
                  {event.location}
                </span>
              </div>
            </div>

            <div className="prose-lg mb-12 whitespace-pre-wrap text-justify">
              {event.description}
            </div>

            {/* CALL TO ACTION (CTA) */}
            {!isPast && (
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => window.location.href = 'mailto:info@paceedizioni.it?subject=Richiesta Accesso Evento: ' + event.title}
                  className="bg-[var(--ink)] text-[var(--paper-bright)] py-5 px-8 font-sans text-[10px] uppercase tracking-[0.3em] hover:bg-[var(--accent)] transition-colors text-center"
                >
                  Richiedi Accesso Esclusivo
                </button>
                <p className="mono-sm text-[var(--ink-ghost)] text-center">
                  L'accesso è strettamente limitato per garantire l'integrità dell'esperienza.
                </p>
              </div>
            )}
          </div>

          {/* Colonna Destra: Visual Asset */}
          <div className="order-1 lg:order-2 animate-in fade-in duration-1000">
            <div className="aspect-[4/5] bg-[var(--paper-deep)] w-full shadow-2xl relative overflow-hidden border border-[var(--paper-border)]">
              {event.coverUrl ? (
                <Image 
                  src={event.coverUrl} 
                  alt={event.title} 
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover" 
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
                  <span className="font-serif italic text-[var(--ink-ghost)] text-2xl mb-4">{event.title}</span>
                  <span className="mono-sm text-[var(--ink-ghost)]">Asset Visivo Non Disponibile</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}