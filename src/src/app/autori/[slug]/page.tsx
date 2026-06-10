// app/autori/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAuthors, getBooks, Author, Book } from '@/lib/api';

export default function AutoreSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAuthors(), getBooks()]).then(([authorsData, allBooks]) => {
      const found = authorsData.find(a => a.slug === slug) ?? null;
      setAuthor(found);
      if (found) {
        const rawAuthorBooks = allBooks.filter(b => b.authorId === found.id);
        // MATRICE DI PROTEZIONE: Iniettiamo in una mappa usando il titolo o l'ID come chiave per distruggere i duplicati
        const uniqueBooks = Array.from(new Map(rawAuthorBooks.map(book => [book.title.trim().toLowerCase(), book])).values());
        setBooks(uniqueBooks);
      }
    }).finally(() => setLoading(false));
  }, [slug]);

  if (!author) return null;

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] pt-32 pb-32">
      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-32 items-start">
          <div className="lg:sticky lg:top-32 flex flex-col gap-8">
            <div className="aspect-[3/4] relative overflow-hidden bg-[var(--paper-deep)] border border-[var(--paper-border)] shadow-xl w-full max-w-sm mx-auto lg:mx-0">
              {author.photoUrl && <Image src={author.photoUrl} alt={author.name} fill className="object-cover grayscale" />}
            </div>
          </div>

          <div className="flex flex-col animate-in slide-in-from-bottom-8 duration-700">
            <h1 className="display-lg mb-8 text-[var(--ink)]">{author.name}</h1>
            
            <div className="mb-24">
              <span className="ui-label text-[var(--ink)] border-b border-[var(--ink)] pb-1 mb-8 inline-block uppercase tracking-widest">Nota Biografica</span>
              <p className="prose-lg text-justify prose-intro">{author.bio || "Nessuna nota biografica disponibile."}</p>
            </div>

            {/* Ridenominata la sezione esattamente in "Opere" */}
            <div className="border-t border-[var(--paper-border)] pt-16">
              <div className="flex items-baseline justify-between mb-12">
                <h2 className="font-serif text-3xl md:text-4xl text-[var(--ink)]">Opere</h2>
                <span className="mono-sm text-[var(--ink-light)]">{books.length} Titoli</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {books.map(book => (
                  <Link key={book.id} href={`/libri/${book.slug}`} className="group flex flex-col book-card">
                    <div className="aspect-[2/3] relative overflow-hidden bg-[var(--paper-deep)] border border-[var(--paper-border)] mb-4 book-cover-3d">
                      {book.coverUrl && <Image src={book.coverUrl} alt={book.title} fill sizes="20vw" className="object-cover" />}
                    </div>
                    <h3 className="font-serif text-lg text-[var(--ink)] leading-tight line-clamp-2 w-fit mb-2">{book.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}