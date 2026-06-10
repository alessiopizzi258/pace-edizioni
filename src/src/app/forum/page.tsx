// app/forum/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getForumThreads, createThread, ForumThread } from '@/lib/api';

const generateSlug = (text: string) => 
  text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

export default function ForumPage() {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);

  // Stati per il Modulo di Proposta
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', authorName: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getForumThreads()
      .then(all => {
        const published = all.filter(t => t.status === 'published');
        setThreads(published);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createThread({
        ...formData,
        slug: generateSlug(formData.title),
        status: 'pending' 
      });
      setSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess(false);
        setFormData({ title: '', authorName: '', content: '' });
      }, 3000);
    } catch (err) {
      console.error("Errore di trasmissione asset.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "bg-transparent border-b border-[var(--paper-border)] outline-none py-3 font-serif text-2xl text-[var(--ink)] focus:border-[var(--ink)] transition-colors w-full placeholder:text-[var(--ink-ghost)]";

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-[var(--ink)] rounded-full animate-spin mb-4"></div>
          <span className="mono-sm text-[var(--ink-light)]">Accesso all'Archivio...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--ink)] selection:text-[var(--paper-bright)] pb-32">

      {/* ── 1. HEADER EDITORIALE ── */}
      <section className="pt-[160px] pb-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-b border-[var(--paper-border)]">
        <div className="flex justify-between items-center mb-12">
          <span className="mono-sm text-[var(--ink-light)] tracking-[0.4em]">
            06 — Sala Lettura
          </span>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="ui-label text-[var(--ink)] border border-[var(--ink)] px-5 py-3 hover:bg-[var(--ink)] hover:text-[var(--paper-bright)] transition-all uppercase tracking-widest"
          >
            + Proponi Discussione
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-end">
          <div>
            <h1 className="display-xl text-[var(--ink)] animate-in slide-in-from-bottom-8 duration-1000">
              Archivio<br />Discussioni
            </h1>
          </div>
          <div className="flex flex-col gap-6 max-w-[280px]">
            <p className="font-sans text-[var(--ink-mid)] text-sm leading-relaxed">
              Spazio riservato alla riflessione lenta. Nessun commento istantaneo. Solo pensiero verticale sottoposto a revisione editoriale.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. INDICE DEGLI EDITORIALI ── */}
      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto py-16 animate-in fade-in duration-700">
        {threads.length > 0 ? (
          <div className="flex flex-col border-t border-[var(--paper-border)]">
            {threads.map((thread, i) => (
              <Link 
                key={thread.id} 
                href={`/forum/${thread.slug}`} 
                className="group flex flex-col md:flex-row md:items-baseline justify-between py-10 md:py-12 border-b border-[var(--paper-border)] hover:bg-[var(--paper-deep)] transition-colors -mx-6 px-6 md:-mx-12 md:px-12"
              >
                <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 flex-1">
                  <span className="mono-sm text-[var(--ink-ghost)] w-8">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="font-serif text-3xl md:text-4xl text-[var(--ink)] mb-4 group-hover:text-[var(--ink-mid)] transition-colors">
                      {thread.title}
                    </h2>
                    <div className="flex items-center gap-4 mono-sm text-[var(--ink-light)]">
                      <span>{thread.authorName}</span>
                      <span className="w-1 h-1 bg-[var(--paper-border)] rounded-full" />
                      <time>{new Date(thread.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                    </div>
                  </div>
                </div>
                <span className="hidden md:block mono-sm text-[var(--ink-ghost)] group-hover:text-[var(--ink)] transition-all transform group-hover:translate-x-2">Leggi →</span>
              </Link>
            ))}
          </div>
        ) : (
          /* STATO VUOTO DINAMICO */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border border-[var(--paper-border)] bg-[var(--paper-bright)] p-8 md:p-16">
            <div>
              <span className="mono-sm text-[var(--ink-light)] block mb-8">Allestimento in corso</span>
              <p className="font-serif text-3xl md:text-4xl leading-tight text-[var(--ink)] mb-6">La Sala Lettura aprirà a breve.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-block bg-[var(--ink)] text-[var(--paper-bright)] px-8 py-4 font-sans text-[10px] uppercase tracking-[0.3em] hover:bg-[var(--accent)] transition-colors"
              >
                Diventa il primo contributore
              </button>
            </div>
            <div className="border-t lg:border-t-0 lg:border-l border-[var(--paper-border)] pt-12 lg:pt-0 lg:pl-16">
              <span className="mono-sm text-[var(--ink-light)] block mb-8">Direttive di Ammissione</span>
              <ul className="flex flex-col gap-6">
                {['Riflessioni sulla Saggistica', 'Analisi Metrica e Poetica', 'Meccaniche di Distribuzione'].map((tema) => (
                  <li key={tema} className="font-serif text-xl text-[var(--ink-mid)] flex justify-between items-baseline border-b border-[var(--paper-border)] pb-4">
                    {tema}
                    <span className="font-sans text-[9px] uppercase tracking-widest text-[var(--ink-ghost)]">Consentito</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* ── MODALE UGC: PROPOSTA EDITORIALE ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[var(--dark)]/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[var(--paper)] w-full max-w-2xl p-10 md:p-16 relative shadow-2xl border border-[var(--paper-border)]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 mono-sm text-[var(--ink-ghost)] hover:text-[var(--ink)]">Chiudi [X]</button>
            
            <h3 className="font-serif text-4xl mb-2 text-[var(--ink)]">Nuova Proposta</h3>
            <p className="mono-sm text-[var(--ink-light)] mb-12">Il testo sarà revisionato dalla direzione prima della pubblicazione.</p>

            {success ? (
              <div className="py-12 text-center border border-[var(--paper-border)] bg-[var(--paper-bright)]">
                <span className="mono-sm text-[var(--ink)]">Trasmissione completata.<br/>Il tuo asset è in fase di revisione.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <label className="mono-sm text-[var(--ink-light)]">Titolo della discussione *</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className={inputCls} placeholder="Es. L'architettura del verso moderno" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="mono-sm text-[var(--ink-light)]">Il tuo Nome / Pseudonimo *</label>
                  <input value={formData.authorName} onChange={e => setFormData({...formData, authorName: e.target.value})} required className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="mono-sm text-[var(--ink-light)]">Corpo della riflessione *</label>
                  <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required rows={6} className="bg-transparent border-b border-[var(--paper-border)] py-3 font-serif-alt text-xl text-[var(--ink)] outline-none focus:border-[var(--ink)] transition-colors resize-none placeholder:text-[var(--ink-ghost)]" placeholder="Scrivi qui..." />
                </div>
                <button type="submit" disabled={submitting} className="bg-[var(--ink)] text-[var(--paper-bright)] py-5 font-sans text-[10px] uppercase tracking-[0.3em] hover:bg-[var(--accent)] transition-colors disabled:bg-[var(--ink-ghost)]">
                  {submitting ? 'Sincronizzazione...' : 'Sottoponi alla Direzione'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}