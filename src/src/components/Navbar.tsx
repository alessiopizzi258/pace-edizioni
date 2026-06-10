// components/Navbar.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  const leftLinks = [
    { name: 'La Casa Editrice', href: '/chi-siamo' },
    { name: 'Catalogo', href: '/libri' },
    { name: 'I Nostri Scrittori', href: '/autori' },
  ];

  const rightLinks = [
    { name: 'Agenda', href: '/eventi' },
    { name: 'Sala Lettura', href: '/forum' },
    { name: 'Contatti', href: '/contatti' },
  ];

  const allLinks = [...leftLinks, ...rightLinks];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--paper)]/95 backdrop-blur-md border-b border-[var(--paper-border)]">
      
      {/* ── NAV DESKTOP (Altezza ottimizzata con logo maggiorato) ── */}
      <nav className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center px-12 xl:px-24 h-28">
        
        {/* Gruppo Sinistra */}
        <div className="flex justify-start gap-8 xl:gap-12">
          {leftLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="nav-link font-sans text-[11px] uppercase tracking-[0.18em] text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors duration-300 whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Logo Centrale Ingrandito */}
        <div className="flex justify-center px-8">
          <Link href="/" className="inline-block transition-transform duration-500 hover:scale-[0.98]" onClick={() => setIsOpen(false)}>
            <Image
              src="/logo-pace.png"
              alt="Pace Edizioni"
              width={240}
              height={140}
              className="h-20 xl:h-[88px] w-auto object-contain"
              priority
              quality={95}
            />
          </Link>
        </div>

        {/* Gruppo Destra */}
        <div className="flex justify-end gap-8 xl:gap-12">
          {rightLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="nav-link font-sans text-[11px] uppercase tracking-[0.18em] text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors duration-300 whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── NAV MOBILE & TABLET ── */}
      <nav className="lg:hidden flex items-center justify-between px-6 h-24">
        <Link href="/" className="inline-block" onClick={() => setIsOpen(false)}>
          <Image
            src="/logo-pace.png"
            alt="Pace Edizioni"
            width={200}
            height={200}
            className="h-16 w-auto object-contain"
            priority
            quality={95}
          />
        </Link>

        <button
          className="text-[var(--ink)] focus:outline-none p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Apri Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* ── MENU MOBILE FULLSCREEN ── */}
      {isOpen && (
        <div className="lg:hidden absolute top-24 left-0 w-full bg-[var(--paper)] border-t border-[var(--paper-border)] px-6 py-8 flex flex-col gap-8 h-[calc(100vh-96px)] overflow-y-auto z-40">
          <span className="mono-sm text-[var(--ink-light)] border-b border-[var(--paper-border)] pb-4">
            Menu Generale
          </span>
          <div className="flex flex-col gap-6">
            {allLinks.map((link, i) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-6 group"
                onClick={() => setIsOpen(false)}
              >
                <span className="mono-sm text-[var(--ink-ghost)] w-6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-serif text-[2.5rem] italic font-light text-[var(--ink)]">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}