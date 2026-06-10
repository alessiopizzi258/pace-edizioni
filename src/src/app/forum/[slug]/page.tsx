// app/forum/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getThreadBySlug, ForumThread } from '@/lib/api';

export default function ForumThreadPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [thread, setThread] = useState<ForumThread | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchThread = async () => {
      setLoading(true);
      try {
        const threadData = await getThreadBySlug(slug);
        setThread(threadData);
      } catch (error) {
        console.error('Errore nel caricamento del thread:', error);
        setThread(null);
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-[var(--ink)] rounded-full animate-spin mb-4"></div>
          <span className="mono-sm text-[var(--ink-light)]">Recupero Fascicolo...</span>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <main className="min-h-screen bg-[var(--paper)] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <span className="font-serif text-[var(--ink)] text-4xl mb-4 block">✦</span>
          <p className="mono-sm text-[var(--ink-light)] mb-8">Documento Non Trovato</p>
          <p className="prose-md text-[var(--ink-mid)] mb-12">
            La discussione richiesta non esiste o è stata ritirata dalla direzione editoriale.
          </p>
          <button
            onClick={() => router.back()}
            className="mono-sm text-[var(--ink)] border-b border-[var(--ink)] pb-1 hover:text-[var(--ink-light)] transition-colors"
          >
            ← Ritorna all'Archivio
          </button>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(thread.createdAt).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--ink)] selection:text-[var(--paper-bright)] pt-32 pb-32">

      {/* ── BREADCRUMB ── */}
      <div className="max-w-3xl mx-auto px-6 mb-16">
        <button
          onClick={() => router.back()}
          className="mono-sm text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors flex items-center gap-4"
        >
          <span>←</span> Indice Discussioni
        </button>
      </div>

      {/* ── ARTICOLO ── */}
      <article className="max-w-3xl mx-auto px-6 animate-in slide-in-from-bottom-8 duration-1000">

        <span className="mono-sm text-[var(--ink-ghost)] block mb-8">
          Documento di Analisi
        </span>

        <h1 className="display-md mb-12 text-[var(--ink)]">
          {thread.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 mono-sm text-[var(--ink-light)] border-y border-[var(--paper-border)] py-6 mb-16">
          <span className="text-[var(--ink)]">Firma: {thread.authorName}</span>
          <span className="hidden md:block w-px h-4 bg-[var(--paper-border)]" />
          <time dateTime={new Date(thread.createdAt).toISOString()}>
            Data: {formattedDate}
          </time>
        </div>

        {/* Corpo del Testo con Drop Cap se supportato */}
        <div className="prose-lg prose-intro whitespace-pre-wrap text-justify mb-24">
          {thread.content}
        </div>

        {/* ── DIRITTO DI REPLICA ── */}
        <div className="bg-[var(--paper-deep)] border border-[var(--paper-border)] p-8 md:p-12 mt-16">
          <h3 className="font-serif text-3xl text-[var(--ink)] mb-4">
            Diritto di Replica
          </h3>
          <p className="prose-md text-[var(--ink-mid)] mb-8">
            Pace Edizioni non ammette sistemi di commento istantanei. Promuoviamo la riflessione lenta e verticale. Se desideri contribuire a questa analisi, puoi sottoporre la tua replica alla direzione.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <a
              href={`mailto:info@paceedizioni.it?subject=Replica: ${thread.title}`}
              className="w-full sm:w-auto inline-flex justify-center bg-[var(--ink)] text-[var(--paper-bright)] px-8 py-5 font-sans text-[10px] uppercase tracking-[0.3em] hover:bg-[var(--accent)] transition-colors"
            >
              Rispondi via Email
            </a>
          </div>
        </div>

      </article>
    </main>
  );
}