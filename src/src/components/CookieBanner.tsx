// components/CookieBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('pace_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('pace_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] bg-[var(--dark-mid)] text-[var(--paper)] border-t border-[var(--dark-border)] shadow-2xl animate-in slide-in-from-bottom duration-700">
      <div className="max-w-7xl mx-auto px-6 py-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex-1">
          <p className="mono-sm text-[var(--ink-ghost)] mb-2">
            Informativa Privacy & Tracciamento
          </p>
          <p className="font-sans font-light text-sm text-[var(--ink-light)] leading-relaxed max-w-3xl">
            Utilizziamo cookie tecnici essenziali per garantire la sicurezza dell'infrastruttura e cookie analitici per ottimizzare l'esperienza di navigazione. Proseguendo, accetti il nostro protocollo di tracciamento.
          </p>
        </div>

        <div className="flex items-center gap-6 shrink-0 w-full md:w-auto">
          <Link 
            href="/privacy" 
            className="mono-sm text-[var(--ink-ghost)] hover:text-[var(--paper)] transition-colors"
          >
            Dettagli Tecnici
          </Link>
          <button 
            onClick={handleAccept}
            className="bg-[var(--paper)] text-[var(--ink)] px-8 py-4 font-sans text-[10px] uppercase tracking-[0.3em] hover:bg-[var(--paper-deep)] transition-colors w-full md:w-auto text-center font-medium"
          >
            Accetto e Proseguo
          </button>
        </div>

      </div>
    </div>
  );
}