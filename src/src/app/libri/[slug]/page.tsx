// app/libri/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getBookBySlug, getAuthors, Book, Author } from '@/lib/api';

export default function BookDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const bookData = await getBookBySlug(slug as string);
        if (!bookData) { setLoading(false); return; }
        setBook(bookData);
        const authors = await getAuthors();
        setAuthor(authors.find(a => a.id === bookData.authorId) ?? null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--paper)] pt-48 px-6 animate-pulse max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-5 aspect-[2/3] bg-[var(--paper-deep)] border border-[var(--paper-border)]" />
          <div className="lg:col-span-7 space-y-8">
            <div className="h-4 bg-[var(--paper-deep)] w-24" />
            <div className="h-16 bg-[var(--paper-deep)] w-full" />
            <div className="h-4 bg-[var(--paper-deep)] w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) return null;
  const amazonLink = book.amazonUrl || "#";

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] pt-32 pb-32">
      <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-16">
        <Link href="/libri" className="mono-sm text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors">
          ← Indice Archivio
        </Link>
      </div>

      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-32 items-start">
          <div className="lg:sticky lg:top-32 flex flex-col gap-8 animate-in fade-in duration-1000">
            <div className="aspect-[2/3] relative overflow-hidden bg-[var(--paper-deep)] border border-[var(--paper-border)] shadow-2xl w-full max-w-md mx-auto lg:mx-0 book-cover-3d">
              {book.coverUrl ? (
                <Image src={book.coverUrl} alt={`Copertina di ${book.title}`} fill priority style={{ objectFit: 'cover' }} quality={90} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <span className="font-serif italic text-[var(--ink-ghost)] text-xl mb-2">{book.title}</span>
                </div>
              )}
            </div>
            <div className="hidden lg:flex flex-col gap-4 border-t border-[var(--paper-border)] pt-6 max-w-md">
              <div className="flex justify-between items-baseline">
                <span className="mono-sm text-[var(--ink-light)]">Collana</span>
                <span className="font-sans text-xs text-[var(--ink)] font-medium uppercase tracking-widest">{book.collana || 'Fuori Collana'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col animate-in slide-in-from-bottom-8 duration-700">
            <div className="mb-16">
              <h1 className="display-lg mb-8 text-[var(--ink)]">{book.title}</h1>
              {author && (
                <div className="flex items-center gap-4">
                  <span className="mono-sm text-[var(--ink-light)]">A cura di:</span>
                  <Link href={`/autori/${author.slug}`} className="font-serif italic text-2xl md:text-3xl text-[var(--ink)] hover:text-[var(--ink-light)] transition-colors border-b border-[var(--paper-border)] hover:border-[var(--ink-light)]">
                    {author.name}
                  </Link>
                </div>
              )}
            </div>

            <div className="mb-16">
              <span className="ui-label text-[var(--ink)] border-b border-[var(--ink)] pb-1 mb-8 inline-block uppercase tracking-widest">
                Estratto / Analisi
              </span>
              <p className="prose-lg text-justify prose-intro">
                {book.description || "Nessuna documentazione testuale attualmente disponibile."}
              </p>
            </div>

            <div className="border-t border-[var(--paper-border)] pt-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <span className="mono-sm text-[var(--ink-light)] block mb-2">Valore dell'Opera</span>
                <span className="font-serif text-4xl text-[var(--ink)]">€ {book.price?.toFixed(2) || '0.00'}</span>
              </div>

              {/* Rimodulato pulsante secondo le direttive con stringa esatta */}
              <a href={amazonLink} target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center justify-center bg-[var(--ink)] text-[var(--paper-bright)] px-12 py-5 transition-all hover:opacity-90 w-full md:w-auto">
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-medium">
                  ACQUISTA IL LIBRO →
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}