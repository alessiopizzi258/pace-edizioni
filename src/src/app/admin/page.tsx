// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBooks, getAuthors, getEvents, getForumThreads } from '@/lib/api';

type Stat = {
  label: string;
  value: number;
  index: string;
  href: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Omit<Stat, 'index' | 'href'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [books, authors, events, threads] = await Promise.all([
          getBooks(),
          getAuthors(),
          getEvents(),
          getForumThreads(),
        ]);
        setStats([
          { label: 'Libri',      value: books.length },
          { label: 'Autori',     value: authors.length },
          { label: 'Eventi',     value: events.length },
          { label: 'Forum',      value: threads.length },
        ]);
      } catch (error) {
        console.error('Errore nel caricamento delle statistiche:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const hrefs = ['/admin/libri', '/admin/autori', '/admin/eventi', '/admin/forum'];

  return (
    <div className="min-h-screen bg-[#f5f2eb] px-6 md:px-16 lg:px-24 pt-16 pb-24">

      {/* Header */}
      <div className="mb-10">
        <span className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#9a8e78] block mb-3">
          Pannello di controllo
        </span>
        <h1 className="font-playfair font-light text-[clamp(32px,5vw,48px)] tracking-[-0.02em] leading-none text-[#1a1916]">
          Dashboard
        </h1>
      </div>

      <div className="border-b border-[#c9c3b8] mb-12" />

      {/* Stat cards (Rimodulate su 4 colonne) */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e0dbd0]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#f5f2eb] p-8 animate-pulse">
              <div className="h-2 bg-[#e0dbd0] w-16 mb-6 rounded-none" />
              <div className="h-12 bg-[#e0dbd0] w-10 rounded-none" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e0dbd0]">
          {stats.map((s, i) => (
            <Link key={s.label} href={hrefs[i]} className="group bg-[#f5f2eb] p-8 flex flex-col justify-between min-h-[160px] hover:bg-white transition-colors duration-300">
              <div className="flex items-start justify-between">
                <span className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.2em] text-[#c9c3b8]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.18em] text-[#c9c3b8] group-hover:text-[#1a1916] transition-colors">
                  →
                </span>
              </div>
              <div>
                <p className="font-playfair font-light text-[52px] leading-none text-[#1a1916] mb-2">
                  {s.value}
                </p>
                <p className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.18em] text-[#9a8e78]">
                  {s.label}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Accesso rapido sezioni */}
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.2em] text-[#c9c3b8]">
            Gestione rapida
          </span>
          <div className="flex-1 h-px bg-[#e0dbd0]" />
        </div>

        <div className="divide-y divide-[#e0dbd0]">
          {[
            { label: 'Libri',    sub: 'Catalogo generale',        href: '/admin/libri' },
            { label: 'Autori',   sub: 'Schede autori',            href: '/admin/autori' },
            { label: 'Eventi',   sub: 'Calendario eventi',        href: '/admin/eventi' },
            { label: 'Forum',    sub: 'Discussioni e thread',     href: '/admin/forum' },
          ].map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between py-6 group"
            >
              <div className="flex items-center gap-6">
                <span className="font-[family-name:var(--font-josefin)] text-[9px] text-[#c9c3b8] tracking-[0.2em]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="font-playfair font-light text-xl text-[#1a1916] group-hover:text-[#5a5448] transition-colors">
                    {item.label}
                  </p>
                  <p className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#c9c3b8]">
                    {item.sub}
                  </p>
                </div>
              </div>
              <span className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.18em] text-[#c9c3b8] group-hover:text-[#1a1916] transition-colors">
                Gestisci →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}