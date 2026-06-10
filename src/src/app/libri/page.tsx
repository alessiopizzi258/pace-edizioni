// app/libri/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBooks, getCollane, Book, Collana } from '@/lib/api';

const ITEMS_PER_PAGE = 12;

// Tassonomie unificate e ripulite da anomalie o doppie voci
const STATIC_CATEGORIES = [
  "Tutte",
  "Grandi Autori Calabresi",
  "Grandi Poeti Internazionali",
  "Poesia: Lorenzo Calogero",
  "Musica: Francesco Cilea",
  "Narrativa",
  "Ragazzi",
  "Rhegium Julii",
  "Saggistica",
  "Leucopetra: Studi Storici Calabresi",
  "Vernacolo",
  "La Scrittura",
  "Teatro e Sceneggiature"
];

export default function LibriPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [collane, setCollane] = useState<Collana[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollana, setSelectedCollana] = useState('Tutte');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    Promise.all([getBooks(), getCollane()])
      .then(([b, c]) => { setBooks(b); setCollane(c); })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return books.filter(b => {
      const matchSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase());
      const cleanSelected = selectedCollana.toLowerCase().replace(/collana/gi, '').trim();
      const matchCollana = selectedCollana === 'Tutte' || (b.collana && b.collana.toLowerCase().includes(cleanSelected));
      return matchSearch && matchCollana;
    });
  }, [books, searchQuery, selectedCollana]);

  const allCategories = useMemo(() => {
    const rawList = [...STATIC_CATEGORIES, ...collane.map(c => c.name)];
    // Sfruttiamo un Set per azzerare matematicamente duplicati o refusi di inserimento
    return Array.from(new Set(rawList.map(cat => cat.trim()))).filter(Boolean);
  }, [collane]);

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] pb-32">
      <section className="pt-40 pb-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-b border-[var(--paper-border)]">
        <h1 className="font-serif text-6xl md:text-8xl tracking-tighter text-[var(--ink)] leading-[0.85]">Le Collane</h1>
      </section>

      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-b border-[var(--paper-border)] py-8 flex flex-col gap-8 sticky top-[96px] bg-[var(--paper)]/95 backdrop-blur-md z-30">
        <div className="flex flex-wrap gap-2">
          {allCategories.map((collanaName, index) => (
            <button key={index} onClick={() => setSelectedCollana(collanaName)} className={`font-sans text-[10px] uppercase tracking-[0.15em] px-4 py-2 border whitespace-nowrap border-[var(--paper-border)] ${selectedCollana === collanaName ? 'bg-[var(--ink)] text-[var(--paper-bright)] border-[var(--ink)]' : 'bg-transparent text-[var(--ink-mid)] hover:border-[var(--ink)]'}`}>
              {collanaName.replace(/collana/gi, '').trim()}
            </button>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16 animate-in fade-in duration-1000">
          {filtered.map((book) => (
            <Link key={book.id} href={`/libri/${book.slug}`} className="group flex flex-col book-card">
              <div className="aspect-[2/3] relative overflow-hidden bg-[var(--paper-deep)] shadow-sm mb-6 border border-[var(--paper-border)] book-cover-3d">
                {book.coverUrl && <Image src={book.coverUrl} alt={book.title} fill sizes="25vw" style={{ objectFit: 'cover' }} quality={85} />}
              </div>
              <h3 className="font-serif text-lg md:text-xl text-[var(--ink)] leading-tight line-clamp-2 w-fit">{book.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}