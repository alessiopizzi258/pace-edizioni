// src/components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[var(--dark-mid)] text-[var(--paper)] pt-24 pb-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        
        <div className="flex flex-col gap-8">
          <Link href="/" className="inline-block transition-opacity duration-300 hover:opacity-60">
            <Image
              src="/logo-pace.png"
              alt="Pace Edizioni"
              width={140}
              height={140}
              className="w-32 h-auto object-contain brightness-100 opacity-95 contrast-125 invert-0"
              priority // Risolve il warning LCP di Next.js
            />
          </Link>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4 font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--ink-light)] text-left md:text-right">
          <div className="w-full text-left md:text-right mb-2">
            <span className="font-serif text-[0.75rem] tracking-[0.5em] text-[var(--dark-border)]">— ✦ —</span>
          </div>
          <p className="leading-loose font-medium">
            &copy; {new Date().getFullYear()} Pace Edizioni<br />
            Via San Leonardo, 72<br />
            89015 Palmi (RC)<br />
            P.IVA 03228120808
          </p>
          <div className="flex flex-wrap items-center gap-6 pt-4 mt-2 border-t border-[var(--dark-border)] w-full md:justify-end">
            <Link href="/privacy" className="hover:text-[var(--paper)] transition-colors">Privacy</Link>
            <Link href="/termini" className="hover:text-[var(--paper)] transition-colors">Termini</Link>
            <Link href="/contratto-editoriale" className="hover:text-[var(--paper)] transition-colors">Contratto</Link>
            
            {/* Pulsante Admin ad alto contrasto */}
            <Link 
              href="/admin" 
              className="ml-0 md:ml-4 bg-[var(--paper)] text-[var(--ink)] px-5 py-2 font-mono text-[9px] uppercase tracking-[0.2em] hover:bg-[var(--paper-deep)] transition-colors"
            >
              Area Direzione
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}