// app/admin/auto-fill/page.tsx
'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { getAuthors, getBooks, updateAuthor, updateBook, Author, Book } from '@/lib/api';
import Link from 'next/link';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function AutoFillEnginePage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [a, b] = await Promise.all([getAuthors(), getBooks()]);
      setAuthors(a);
      setBooks(b);
    } catch (e) {
      console.error("Errore recupero dati:", e);
    } finally {
      setLoading(false);
    }
  };

  const log = (msg: string) => setLogs(prev => [...prev, msg]);

  // Calcolo delle entità vuote
  const missingBioAuthors = authors.filter(a => !a.bio || a.bio.trim() === '');
  const missingDescBooks = books.filter(b => !b.description || b.description.trim() === '');
  const missingMetadataBooks = books.filter(b => !b.coverUrl || b.coverUrl === '' || !b.amazonUrl || b.amazonUrl === '');

  /* ─── 1. MOTORE BIO AUTORI ─── */
  const runBulkAuthorEngine = async () => {
    if (!confirm(`Generare biografie per ${missingBioAuthors.length} autori?`)) return;
    setIsRunning(true);
    setLogs(['INIZIALIZZAZIONE MOTORE NEURALE: AUTORI...']);
    setProgress({ current: 0, total: missingBioAuthors.length });

    for (let i = 0; i < missingBioAuthors.length; i++) {
      const author = missingBioAuthors[i];
      setProgress({ current: i + 1, total: missingBioAuthors.length });
      log(`[${i + 1}/${missingBioAuthors.length}] Generazione testo: ${author.name}...`);

      try {
        const res = await fetch('/api/ai-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'author', name: author.name }),
        });
        const data = await res.json();
        if (data.text) {
          await updateAuthor(author.id, { ...author, bio: data.text });
          log(`  [✓] Biografia generata e iniettata.`);
        }
      } catch (err) { log(`  [!] Errore su ${author.name}.`); }
      await delay(1500);
    }
    log('=== BATCH AUTORI COMPLETATO ===');
    await fetchData(); setIsRunning(false);
  };

  /* ─── 2. MOTORE SINOSSI LIBRI ─── */
  const runBulkBookEngine = async () => {
    if (!confirm(`Generare sinossi per ${missingDescBooks.length} libri?`)) return;
    setIsRunning(true);
    setLogs(['INIZIALIZZAZIONE MOTORE NEURALE: CATALOGO...']);
    setProgress({ current: 0, total: missingDescBooks.length });

    for (let i = 0; i < missingDescBooks.length; i++) {
      const book = missingDescBooks[i];
      const targetAuthor = authors.find(a => a.id === book.authorId);
      setProgress({ current: i + 1, total: missingDescBooks.length });
      log(`[${i + 1}/${missingDescBooks.length}] Generazione testo: ${book.title}...`);

      try {
        const res = await fetch('/api/ai-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'book', name: targetAuthor?.name || '', title: book.title, collana: book.collana }),
        });
        const data = await res.json();
        if (data.text) {
          await updateBook(book.id, { ...book, description: data.text });
          log(`  [✓] Sinossi generata e iniettata.`);
        }
      } catch (err) { log(`  [!] Errore su ${book.title}.`); }
      await delay(1500);
    }
    log('=== BATCH SINOSSI COMPLETATO ===');
    await fetchData(); setIsRunning(false);
  };

  /* ─── 3. MOTORE SCRAPING METADATI (Copertine & Link Amazon) ─── */
  const runBulkScraperEngine = async () => {
    if (!confirm(`Avviare la scansione della rete pubblica per ${missingMetadataBooks.length} volumi? L'operazione recupererà copertine e link di acquisto.`)) return;
    setIsRunning(true);
    setLogs(['INIZIALIZZAZIONE RADAR METADATI...']);
    setProgress({ current: 0, total: missingMetadataBooks.length });

    for (let i = 0; i < missingMetadataBooks.length; i++) {
      const book = missingMetadataBooks[i];
      const targetAuthor = authors.find(a => a.id === book.authorId);
      setProgress({ current: i + 1, total: missingMetadataBooks.length });
      log(`[${i + 1}/${missingMetadataBooks.length}] Scansione DB Globali per: ${book.title}...`);

      try {
        const res = await fetch('/api/fetch-metadata', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: book.title, author: targetAuthor?.name || '' }),
        });
        const data = await res.json();
        
        let updates: Partial<Book> = {};
        if (data.coverUrl && !book.coverUrl) {
          updates.coverUrl = data.coverUrl;
          log(`  [✓] Asset copertina individuato.`);
        }
        if (data.amazonUrl && !book.amazonUrl) {
          updates.amazonUrl = data.amazonUrl;
          log(`  [✓] Link acquisizione commerciale (Amazon) generato.`);
        }

        if (Object.keys(updates).length > 0) {
          await updateBook(book.id, { ...book, ...updates });
          log(`  [✓] Metadati iniettati nel database centrale.`);
        } else {
          log(`  [-] Nessun nuovo metadato rilevato.`);
        }
      } catch (err) { log(`  [!] Scansione fallita per ${book.title}.`); }
      
      // Delay ridotto, i DB pubblici sono meno restrittivi di OpenAI
      await delay(500);
    }
    log('=== BATCH METADATI COMPLETATO ===');
    await fetchData(); setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] px-6 md:px-16 lg:px-24 pt-16 pb-24">
      
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link href="/admin/libri" className="font-sans text-[10px] uppercase tracking-widest text-[var(--ink-ghost)] hover:text-[var(--ink)] block mb-4">
            ← Torna al CRM Generale
          </Link>
          <h1 className="font-serif text-5xl text-[var(--ink)]">
            Centro di Comando Neurale
          </h1>
        </div>
        <div className="font-sans text-[10px] uppercase tracking-widest text-[var(--ink-light)] text-right">
          Architettura Asincrona Coda/Rate-Limit Attiva
        </div>
      </div>

      <div className="border-b border-[var(--paper-border)] mb-12" />

      {loading ? (
        <div className="animate-pulse font-sans text-xs tracking-widest text-[var(--ink-light)] uppercase">
          Scansione anomalie database in corso...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 1. Card Autori */}
          <div className="border border-[var(--paper-border)] bg-[var(--paper-bright)] p-8 flex flex-col items-start shadow-sm hover:border-[var(--ink)] transition-colors">
            <h2 className="font-serif text-2xl text-[var(--ink)] mb-4">Biografie Autori</h2>
            <p className="font-sans text-xs text-[var(--ink-mid)] mb-8 flex-1 leading-relaxed">
              Il sistema interrogherà il modello linguistico e applicherà un copy di posizionamento editoriale formale.
            </p>
            <div className="w-full border-t border-[var(--paper-border)] pt-6 flex flex-col gap-4">
              <span className="font-sans text-[10px] uppercase tracking-widest text-[var(--ink-light)]">
                Firme incomplete: <strong className="text-[var(--ink)] text-lg ml-2">{missingBioAuthors.length}</strong>
              </span>
              <button
                onClick={runBulkAuthorEngine}
                disabled={isRunning || missingBioAuthors.length === 0}
                className="w-full bg-[var(--ink)] text-[var(--paper-bright)] px-6 py-4 font-sans text-[10px] uppercase tracking-widest hover:bg-[var(--accent)] transition-colors disabled:opacity-50"
              >
                Innesca Generazione
              </button>
            </div>
          </div>

          {/* 2. Card Libri */}
          <div className="border border-[var(--paper-border)] bg-[var(--paper-bright)] p-8 flex flex-col items-start shadow-sm hover:border-[var(--ink)] transition-colors">
            <h2 className="font-serif text-2xl text-[var(--ink)] mb-4">Sinossi Catalogo</h2>
            <p className="font-sans text-xs text-[var(--ink-mid)] mb-8 flex-1 leading-relaxed">
              L'algoritmo genererà una quarta di copertina persuasiva basata sull'incrocio tra autore e posizionamento della collana.
            </p>
            <div className="w-full border-t border-[var(--paper-border)] pt-6 flex flex-col gap-4">
              <span className="font-sans text-[10px] uppercase tracking-widest text-[var(--ink-light)]">
                Volumi vuoti: <strong className="text-[var(--ink)] text-lg ml-2">{missingDescBooks.length}</strong>
              </span>
              <button
                onClick={runBulkBookEngine}
                disabled={isRunning || missingDescBooks.length === 0}
                className="w-full bg-[var(--ink)] text-[var(--paper-bright)] px-6 py-4 font-sans text-[10px] uppercase tracking-widest hover:bg-[var(--accent)] transition-colors disabled:opacity-50"
              >
                Innesca Generazione
              </button>
            </div>
          </div>

          {/* 3. Card Scraping (NUOVA) */}
          <div className="border border-[var(--paper-border)] bg-[var(--paper-bright)] p-8 flex flex-col items-start shadow-sm hover:border-[var(--ink)] transition-colors">
            <h2 className="font-serif text-2xl text-[var(--ink)] mb-4">Scraping Metadati</h2>
            <p className="font-sans text-xs text-[var(--ink-mid)] mb-8 flex-1 leading-relaxed">
              Il Radar scansionerà i Database Globali per estrarre immagini di copertina in alta risoluzione e calcolare i link di acquisizione commerciale Amazon.
            </p>
            <div className="w-full border-t border-[var(--paper-border)] pt-6 flex flex-col gap-4">
              <span className="font-sans text-[10px] uppercase tracking-widest text-[var(--ink-light)]">
                Volumi senza asset: <strong className="text-[var(--ink)] text-lg ml-2">{missingMetadataBooks.length}</strong>
              </span>
              <button
                onClick={runBulkScraperEngine}
                disabled={isRunning || missingMetadataBooks.length === 0}
                className="w-full bg-blue-900 text-white px-6 py-4 font-sans text-[10px] uppercase tracking-widest hover:bg-blue-800 transition-colors disabled:opacity-50"
              >
                Innesca Radar Rete
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Terminale di Esecuzione Neurale */}
      {(isRunning || logs.length > 0) && (
        <div className="mt-16 border border-[var(--ink)] bg-[var(--ink)] text-[var(--paper-bright)] p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6 border-b border-[#333] pb-4">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--ink-ghost)]">
              Terminale di Processo
            </span>
            {isRunning && (
              <span className="font-sans text-[10px] uppercase tracking-widest text-[var(--accent)] animate-pulse">
                In esecuzione: {progress.current} / {progress.total}
              </span>
            )}
          </div>
          
          <div className="bg-black border border-[#222] p-6 font-mono text-[11px] text-green-500 h-80 overflow-y-auto rounded-sm flex flex-col gap-1">
            {logs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap">{log}</div>
            ))}
            {isRunning && (
              <div className="flex items-center gap-2 mt-2 text-yellow-500 animate-pulse">
                <span>_ Protocollo attivo. Attesa sincronizzazione moduli...</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}