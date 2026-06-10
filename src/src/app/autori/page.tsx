// app/autori/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { getAuthors, Author } from '@/lib/api';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getAuthors()
      .then(setAuthors)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const groupedAuthors = useMemo(() => {
    // Escludiamo Sofocle ed eseguiamo il matching di ricerca
    let filtered = authors.filter(author => author.name.toLowerCase() !== 'sofocle');

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((author) =>
        author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }));
    const groups: { [key: string]: Author[] } = {};
    
    filtered.forEach(author => {
      const primaLettera = author.name.charAt(0).toUpperCase();
      const key = /[A-Z]/.test(primaLettera) ? primaLettera : '#';
      if (!groups[key]) groups[key] = [];
      groups[key].push(author);
    });

    return groups;
  }, [authors, searchQuery]);

  const sortedLetters = Object.keys(groupedAuthors).sort();

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] pb-32">
      <section className="pt-40 pb-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-b border-[var(--paper-border)]">
        <h1 className="display-xl text-[var(--ink)]">I Nostri Scrittori</h1>
      </section>

      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto animate-in fade-in duration-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {sortedLetters.map((letter) => (
            <div key={letter} className="flex flex-col">
              <div className="border-b-2 border-[var(--ink)] pb-4 mb-6">
                <h2 className="font-serif text-5xl text-[var(--ink)] leading-none font-normal">{letter}</h2>
              </div>
              <ul className="flex flex-col gap-5">
                {groupedAuthors[letter].map((author) => (
                  <li key={author.id}>
                    <Link href={`/autori/${author.slug}`} className="group inline-flex flex-col items-start">
                      {/* Rimosso qualsiasi sub-tag o dicitura AUTHOR per un minimalismo assoluto */}
                      <span className="font-serif text-xl md:text-2xl text-[var(--ink)] author-link tracking-tight">
                        {author.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}