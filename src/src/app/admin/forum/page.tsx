'use client';

import { useEffect, useState } from 'react';
import { getForumThreads, createThread, updateThread, deleteThread, ForumThread } from '@/lib/api';

const EMPTY_THREAD: Omit<ForumThread, 'id' | 'createdAt'> = { 
  title: '', slug: '', content: '', authorName: '', status: 'published' 
};

/* ─── Utils ─── */
const generateSlug = (text: string) => 
  text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <label className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.2em] text-[#9a8e78]">{label}</label>
    {children}
  </div>
);

export default function AdminForumPage() {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingThread, setEditingThread] = useState<ForumThread | null>(null);
  const [formData, setFormData] = useState(EMPTY_THREAD);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // STATO PER OTTIMIZZAZIONE IA
  const [isOptimizing, setIsOptimizing] = useState(false);

  const fetchThreads = async () => {
    setLoading(true);
    try { setThreads(await getForumThreads()); }
    catch { /* silent fallback */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchThreads(); }, []);

  // FUNZIONE DI OTTIMIZZAZIONE IA
  const handleAiOptimize = async () => {
    if (!formData.content) return;
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/optimize-thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, content: formData.content })
      });
      const data = await res.json();
      
      setFormData(prev => ({ 
        ...prev, 
        title: data.title || prev.title, 
        slug: data.slug || prev.slug, 
        content: data.content || prev.content 
      }));
    } catch (err) {
      setFormError("Il server AI non risponde. Procedi manualmente.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const openCreate = () => {
    setEditingThread(null);
    setFormData(EMPTY_THREAD);
    setFormError(null);
    setPanelOpen(true);
  };

  const openEdit = (thread: ForumThread) => {
    setEditingThread(thread);
    setFormData({ 
      title: thread.title, 
      slug: thread.slug, 
      content: thread.content, 
      authorName: thread.authorName,
      status: thread.status || 'published'
    });
    setFormError(null);
    setPanelOpen(true);
  };

  const closePanel = () => { setPanelOpen(false); setFormError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim() || !formData.authorName.trim()) {
      setFormError('Titolo, slug e autore sono vincoli di sistema obbligatori.');
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingThread) {
        await updateThread(editingThread.id, formData);
      } else {
        await createThread(formData as Omit<ForumThread, 'id' | 'createdAt'>);
      }
      closePanel();
      fetchThreads();
    } catch {
      setFormError('Errore critico di comunicazione con il database. Riprova.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Disintegrare questo thread? L\'azione eliminerà il contenuto dal database in modo irreversibile.')) return;
    setDeletingId(id);
    try { await deleteThread(id); fetchThreads(); }
    catch { /* silent */ }
    finally { setDeletingId(null); }
  };

  const inputCls = "bg-transparent border-b border-[#c9c3b8] outline-none py-2 font-playfair font-light text-lg text-[#1a1916] focus:border-[#1a1916] transition-colors w-full";
  const selectCls = "bg-[#f5f2eb] border-b border-[#c9c3b8] outline-none py-2 font-[family-name:var(--font-josefin)] text-[11px] uppercase tracking-[0.15em] text-[#1a1916] focus:border-[#1a1916] transition-colors w-full";

  return (
    <div className="min-h-screen bg-[#f5f2eb] px-6 md:px-16 lg:px-24 pt-16 pb-24">

      <div className="mb-10">
        <span className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#9a8e78] block mb-3">
          Dashboard — Community Hub
        </span>
        <div className="flex items-end justify-between gap-4">
          <h1 className="font-playfair font-light text-[clamp(28px,4vw,44px)] tracking-[-0.02em] leading-none text-[#1a1916]">
            Moderazione Forum
          </h1>
          <button onClick={openCreate} className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#f5f2eb] bg-[#1a1916] px-5 py-3 hover:bg-[#3a3630] transition-colors shrink-0">
            + Apri Discussione
          </button>
        </div>
      </div>

      <div className="border-b border-[#c9c3b8] mb-10" />

      {panelOpen && (
        <div className="mb-10 border border-[#c9c3b8] bg-white p-8 md:p-10 shadow-sm transition-all duration-300 relative">
          
          {/* TASTO IA POSIZIONATO IN ALTO A DESTRA */}
          <div className="absolute top-8 right-10">
            <button 
              type="button" 
              onClick={handleAiOptimize} 
              disabled={isOptimizing || !formData.content}
              className="font-[family-name:var(--font-josefin)] text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {isOptimizing ? 'Elaborazione...' : '⚡ Ottimizza con IA'}
            </button>
          </div>

          <span className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.2em] text-[#9a8e78] block mb-8">
            {editingThread ? 'Gestione Thread (Moderazione)' : 'Inizializzazione Nuova Discussione'}
          </span>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field label="Stato di Pubblicazione *">
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })} 
                  className={selectCls}
                >
                  <option value="pending">In Quarantena (Invisibile agli utenti)</option>
                  <option value="published">Approvato (Visibile sul sito)</option>
                </select>
              </Field>
              <Field label="Titolo Discussione (Auto-Slug) *">
                <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })} required className={inputCls} placeholder="Titolo del thread..." />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field label="Slug SEO (URL) *">
                <input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required className={inputCls} />
              </Field>
              <Field label="Nome Autore / Utente *">
                <input value={formData.authorName} onChange={e => setFormData({ ...formData, authorName: e.target.value })} required className={inputCls} />
              </Field>
            </div>

            <Field label="Corpo del Messaggio">
              <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} required rows={6} className="bg-transparent border border-[#c9c3b8] p-4 font-serif text-lg leading-relaxed outline-none focus:border-[#1a1916] transition-colors resize-y w-full" />
            </Field>

            <div className="flex items-center gap-6 pt-4">
              <button type="submit" disabled={submitting || isOptimizing} className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#f5f2eb] bg-[#1a1916] px-8 py-3 hover:bg-[#3a3630] disabled:bg-[#c9c3b8] transition-colors">
                {submitting ? 'Sincronizzazione...' : 'Salva Modifiche →'}
              </button>
              <button type="button" onClick={closePanel} className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#9a8e78] hover:text-[#1a1916] transition-colors">
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.3em] text-[#9a8e78] animate-pulse">Sincronizzazione...</p>
      ) : threads.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[#c9c3b8]">
          <p className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#9a8e78]">Nessuna discussione attiva.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#e0dbd0]">
          {threads.map((thread, i) => (
            <div key={thread.id} className={`py-6 flex items-center gap-6 group ${thread.status === 'pending' ? 'bg-[#fdf9e8] px-4 -mx-4' : ''}`}>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-[family-name:var(--font-josefin)] text-[9px] text-[#c9c3b8] tracking-[0.2em] shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-playfair font-light text-xl text-[#1a1916] truncate">
                    {thread.title}
                  </h3>
                  {thread.status === 'pending' && (
                    <span className="bg-yellow-200 text-yellow-800 text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-sm">In Attesa</span>
                  )}
                  {thread.status === 'published' && (
                    <span className="bg-green-200 text-green-800 text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-sm">Pubblicato</span>
                  )}
                </div>
                <div className="flex items-center gap-4 font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#9a8e78]">
                  <span>Autore: <strong className="text-[#1a1916]">{thread.authorName}</strong></span>
                  <span className="w-1 h-1 bg-[#c9c3b8] rounded-full" />
                  <span>{new Date(thread.createdAt).toLocaleDateString('it-IT')}</span>
                </div>
              </div>

              <div className="flex items-center gap-5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => openEdit(thread)} className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#9a8e78] hover:text-[#1a1916]">
                  Modera
                </button>
                <button onClick={() => handleDelete(thread.id)} disabled={deletingId === thread.id} className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#c9c3b8] hover:text-red-500 disabled:opacity-50">
                  {deletingId === thread.id ? '...' : 'Disintegra'}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}