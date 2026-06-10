// app/eventi/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getEvents, Event } from '@/lib/api';

export default function PublicEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-[var(--ink)] rounded-full animate-spin mb-4"></div>
          <span className="mono-sm text-[var(--ink-light)] tracking-[0.3em]">Radar Attivo...</span>
        </div>
      </div>
    );
  }

  const now = new Date().getTime();
  const upcomingEvents = events.filter(e => new Date(e.date).getTime() >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = events.filter(e => new Date(e.date).getTime() < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--ink)] selection:text-[var(--paper-bright)] pb-32">

      {/* ── 1. HEADER ── */}
      <section className="pt-[160px] pb-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-b border-[var(--paper-border)]">
        <div className="flex justify-between items-center mb-12">
          <span className="mono-sm text-[var(--ink-light)] tracking-[0.4em]">
            05 — Calendario Operativo
          </span>
          <span className="mono-sm text-[var(--ink-light)] tracking-[0.2em]">
            {upcomingEvents.length} {upcomingEvents.length === 1 ? 'Data Attiva' : 'Date Attive'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-end">
          <div>
            <h1 className="display-xl text-[var(--ink)] animate-in slide-in-from-bottom-8 duration-1000">
              Esperienze<br />dal Vivo
            </h1>
          </div>
          <div className="flex flex-col gap-6 max-w-[280px]">
            <p className="font-sans text-[var(--ink-mid)] text-sm leading-relaxed">
              Il momento di massima esposizione. Masterclass, presentazioni editoriali e incontri a porte chiuse. La conversione passa dalla presenza fisica.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. EVENTI IN ARRIVO ── */}
      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto py-24 animate-in fade-in duration-700">
        <h2 className="mono-sm text-[var(--ink-light)] mb-12 block">Prossimi Appuntamenti</h2>
        
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {upcomingEvents.map((event) => (
              <Link 
                key={event.id} 
                href={`/eventi/${event.slug || ''}`} 
                className="group flex flex-col border border-[var(--paper-border)] bg-[var(--paper-bright)] hover:border-[var(--ink)] transition-colors"
              >
                <div className="aspect-video bg-[var(--paper-deep)] relative overflow-hidden">
                  {event.coverUrl ? (
                    <Image 
                      src={event.coverUrl} 
                      alt={event.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-serif italic text-[var(--ink-ghost)]">Pace Edizioni</div>
                  )}
                  <div className="absolute top-4 right-4 bg-[var(--ink)] text-[var(--paper-bright)] px-3 py-2 text-center shadow-lg">
                    <span className="block font-serif text-2xl leading-none mb-1">{new Date(event.date).getDate()}</span>
                    <span className="block font-sans text-[9px] uppercase tracking-widest">{new Date(event.date).toLocaleString('it-IT', { month: 'short' })}</span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="mono-sm text-[var(--ink-light)] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" /> Live Event
                  </div>
                  <h3 className="font-serif text-3xl text-[var(--ink)] mb-4 group-hover:text-[var(--ink-light)] transition-colors">{event.title}</h3>
                  <p className="prose-md text-[var(--ink-mid)] line-clamp-3 mb-8 flex-1">{event.description}</p>
                  
                  <div className="flex flex-col gap-2 pt-6 border-t border-[var(--paper-border)] mt-auto">
                    <span className="mono-sm text-[var(--ink-light)]">Coordinate:</span>
                    <span className="font-sans text-sm text-[var(--ink)] font-medium">{event.location}</span>
                    <span className="font-sans text-sm text-[var(--ink)]">{new Date(event.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-[var(--paper-border)] bg-[var(--paper-bright)]">
            <p className="font-serif italic text-2xl text-[var(--ink-ghost)]">Nessuna operazione sul campo programmata al momento.</p>
          </div>
        )}
      </section>

      {/* ── 3. ARCHIVIO EVENTI PASSATI ── */}
      {pastEvents.length > 0 && (
        <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto pb-24">
          <h2 className="mono-sm text-[var(--ink-light)] mb-12 block border-t border-[var(--paper-border)] pt-12">Archivio Storico</h2>
          <div className="flex flex-col">
            {pastEvents.map((event) => (
              <Link 
                key={event.id} 
                href={`/eventi/${event.slug || ''}`}
                className="flex flex-col md:flex-row justify-between md:items-center py-6 border-b border-[var(--paper-border)] opacity-70 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center gap-6">
                  <span className="mono-sm text-[var(--ink-light)] w-24">
                    {new Date(event.date).toLocaleDateString('it-IT')}
                  </span>
                  <h3 className="font-serif text-2xl text-[var(--ink)]">{event.title}</h3>
                </div>
                <span className="font-sans text-sm text-[var(--ink-mid)] mt-2 md:mt-0">{event.location}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}