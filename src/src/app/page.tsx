// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBooks, getAuthors, getEvents, Book, Author, Event } from '@/lib/api';

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBooks(), getAuthors(), getEvents()])
      .then(([b, a, e]) => { 
        // Rimosso il reverse distorsivo per catturare le reali ultime novità stoccate nel DB
        setBooks(b); 
        // Filtriamo Sofocle anche dall'estratto della home page per coerenza di catalogo
        setAuthors(a.filter(author => author.name.toLowerCase() !== 'sofocle')); 
        setEvents(e); 
      })
      .catch((error) => console.error("Errore di sincronizzazione:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--paper)] pt-48 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
           {Array(8).fill(0).map((_, i) => (
             <div key={i} className="animate-pulse">
               <div className="aspect-[2/3] bg-[var(--paper-deep)] mb-4 border border-[var(--paper-border)]" />
               <div className="h-2 bg-[var(--paper-deep)] w-3/4 mb-2" />
               <div className="h-4 bg-[var(--paper-deep)] w-full mb-1" />
             </div>
           ))}
         </div>
      </div>
    );
  }

  const now = new Date().getTime();
  const upcomingEvents = events
    .filter(e => new Date(e.date).getTime() >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <main className="bg-[var(--paper)] text-[var(--ink)] pb-32">
      
      <section className="relative pt-[180px] pb-24 px-6 border-b border-[var(--paper-border)] bg-[var(--paper-bright)]">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center animate-in fade-in duration-1000">
          <span className="mono-sm text-[var(--ink-light)] mb-6 block">
            Casa Editrice Indipendente
          </span>
          <h1 className="display-xl mb-8 text-[var(--ink)]">
            Pace Edizioni
          </h1>
          <div className="w-16 h-px bg-[var(--ink-ghost)] mb-8" />
          <p className="prose-lg max-w-2xl mx-auto italic text-[var(--ink-mid)]">
            Letteratura, Poesia e Saggistica d'eccellenza.<br/>
            Il rigore della parola, la cura del dettaglio editoriale.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-b border-[var(--paper-border)]">
        <div className="flex justify-between items-baseline mb-16">
          <h2 className="display-md">Ultime Novità</h2>
          <Link href="/libri" className="mono-sm text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors">
            Esplora il Catalogo →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16 md:gap-x-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {books.slice(0, 8).map((book) => (
            <Link key={book.id} href={`/libri/${book.slug}`} className="group flex flex-col book-card">
              <div className="aspect-[2/3] relative overflow-hidden bg-[var(--paper-deep)] mb-6 border border-[var(--paper-border)] book-cover-3d">
                {book.coverUrl ? (
                  <Image 
                    src={book.coverUrl} 
                    alt={`Copertina del libro "${book.title}"`} 
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    style={{ objectFit: 'cover' }}
                    quality={85}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <span className="font-serif italic text-[var(--ink-ghost)] text-lg line-clamp-3">{book.title}</span>
                  </div>
                )}
              </div>
              <span className="mono-sm text-[var(--ink-ghost)] mb-2 truncate">
                {book.collana || 'Fuori Collana'}
              </span>
              <h3 className="font-serif text-xl text-[var(--ink)] leading-tight editorial-link line-clamp-2 w-fit">
                {book.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          
          <div>
            <div className="flex justify-between items-baseline border-b border-[var(--paper-border)] pb-6 mb-8">
              <h2 className="display-md text-[var(--ink)]">I Nostri Scrittori</h2>
              <Link href="/autori" className="mono-sm text-[var(--ink-light)] hover:text-[var(--ink)]">Tutti gli Autori →</Link>
            </div>
            <div className="flex flex-col animate-in fade-in duration-1000">
              {authors.slice(0, 6).map((author) => (
                <Link key={author.id} href={`/autori/${author.slug}`} className="group flex justify-between items-center py-5 border-b border-[var(--paper-deep)] hover:border-[var(--ink-light)] transition-colors">
                  <span className="font-serif text-xl md:text-2xl text-[var(--ink)] author-link">{author.name}</span>
                  <span className="mono-sm text-[var(--ink-ghost)] opacity-0 group-hover:opacity-100 transition-opacity">Profilo</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline border-b border-[var(--paper-border)] pb-6 mb-8">
              <h2 className="display-md text-[var(--ink)]">Agenda</h2>
              <Link href="/eventi" className="mono-sm text-[var(--ink-light)] hover:text-[var(--ink)]">Calendario Completo →</Link>
            </div>
            <div className="flex flex-col animate-in fade-in duration-1000">
              {upcomingEvents.length > 0 ? upcomingEvents.slice(0, 4).map((event) => (
                <div key={event.id} className="py-5 border-b border-[var(--paper-deep)] group">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="mono-sm text-[var(--ink-light)]">
                      {new Date(event.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="ui-label text-[var(--ink-ghost)]">{event.location}</span>
                  </div>
                  <h4 className="font-serif text-xl text-[var(--ink)] group-hover:text-[var(--ink-light)] transition-colors editorial-link w-fit">{event.title}</h4>
                </div>
              )) : (
                <p className="prose-md text-[var(--ink-ghost)] py-6 italic border-b border-[var(--paper-deep)]">
                  Nessun evento imminente a calendario.
                </p>
              )}
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}