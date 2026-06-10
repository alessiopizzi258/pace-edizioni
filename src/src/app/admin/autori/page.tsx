// app/admin/autori/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getAuthors, createAuthor, updateAuthor, deleteAuthor, Author } from '@/lib/api';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AIGeneratorButton from '@/components/AIGeneratorButton';

const EMPTY_FORM = { name: '', slug: '', bio: '', photoUrl: '' };

/* ─── Utils ─── */
const generateSlug = (text: string) => 
  text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <label className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.2em] text-[#9a8e78]">{label}</label>
    {children}
  </div>
);

export default function AdminAuthorsPage() {
  const [authors, setAuthors]       = useState<Author[]>([]);
  const [loading, setLoading]       = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [panelOpen, setPanelOpen]         = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [photoFile, setPhotoFile]         = useState<File | null>(null);
  const [formData, setFormData]           = useState(EMPTY_FORM);
  const [submitting, setSubmitting]       = useState(false);
  const [formError, setFormError]         = useState<string | null>(null);

  const fetchAuthors = async () => {
    setLoading(true);
    try { setAuthors(await getAuthors()); }
    catch { /* silent fallback */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAuthors(); }, []);

  const openCreate = () => {
    setEditingAuthor(null);
    setPhotoFile(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setPanelOpen(true);
  };

  const openEdit = (author: Author) => {
    setEditingAuthor(author);
    setPhotoFile(null);
    setFormData({ name: author.name, slug: author.slug, bio: author.bio || '', photoUrl: author.photoUrl || '' });
    setFormError(null);
    setPanelOpen(true);
  };

  const closePanel = () => { setPanelOpen(false); setFormError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      setFormError('Nome e slug sono vincoli di sistema obbligatori.');
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      let finalPhotoUrl = formData.photoUrl;
      if (photoFile) {
        const fileRef = ref(storage, `authors/${Date.now()}_${photoFile.name}`);
        const snapshot = await uploadBytes(fileRef, photoFile);
        finalPhotoUrl = await getDownloadURL(snapshot.ref);
      }
      const authorData = { ...formData, photoUrl: finalPhotoUrl };
      if (editingAuthor) {
        await updateAuthor(editingAuthor.id, authorData);
      } else {
        await createAuthor(authorData as Omit<Author, 'id'>);
      }
      closePanel();
      fetchAuthors();
    } catch {
      setFormError('Errore critico durante la sincronizzazione su Firebase. Verifica permessi Storage.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare permanentemente questo autore? La rimozione disabiliterà il collegamento con i libri nel DB.')) return;
    setDeletingId(id);
    try { await deleteAuthor(id); fetchAuthors(); }
    catch { /* silent */ }
    finally { setDeletingId(null); }
  };

  const inputCls = "bg-transparent border-b border-[#c9c3b8] outline-none py-2 font-playfair font-light text-lg text-[#1a1916] focus:border-[#1a1916] transition-colors w-full";

  return (
    <div className="min-h-screen bg-[#f5f2eb] px-6 md:px-16 lg:px-24 pt-16 pb-24">

      {/* Header Strategico */}
      <div className="mb-10">
        <span className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#9a8e78] block mb-3">
          Dashboard — Autori
        </span>
        <div className="flex items-end justify-between gap-4">
          <h1 className="font-playfair font-light text-[clamp(28px,4vw,44px)] tracking-[-0.02em] leading-none text-[#1a1916]">
            Gestione Autori
          </h1>
          <button
            onClick={openCreate}
            className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#f5f2eb] bg-[#1a1916] px-5 py-3 hover:bg-[#3a3630] transition-colors shrink-0"
          >
            + Nuova Entità
          </button>
        </div>
      </div>

      <div className="border-b border-[#c9c3b8] mb-10" />

      {/* Modulo Dati Operativo */}
      {panelOpen && (
        <div className="mb-10 border border-[#c9c3b8] bg-white p-8 md:p-10 shadow-sm transition-all duration-300">
          <span className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.2em] text-[#9a8e78] block mb-8">
            {editingAuthor ? 'Modifica Struttura Autore' : 'Inizializzazione Nuovo Autore'}
          </span>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field label="Nome e Cognome (Auto-Slug) *">
                <input 
                  value={formData.name} 
                  onChange={e => setFormData({ 
                    ...formData, 
                    name: e.target.value,
                    slug: generateSlug(e.target.value)
                  })} 
                  required 
                  className={inputCls} 
                  placeholder="Inserisci per generare l'URL..."
                />
              </Field>
              <Field label="Slug SEO (URL) *">
                <input 
                  value={formData.slug} 
                  onChange={e => setFormData({ ...formData, slug: e.target.value })} 
                  required 
                  className={inputCls} 
                />
              </Field>
            </div>

            <Field label="Ritratto Autore">
              <div
                onClick={() => document.getElementById('author-photo-input')?.click()}
                className={`cursor-pointer border border-dashed border-[#c9c3b8] p-8 flex flex-col items-center justify-center gap-3 hover:border-[#9a8e78] transition-colors ${photoFile ? 'bg-[#1a1916]' : ''}`}
              >
                <input id="author-photo-input" type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files?.[0] || null)} className="hidden" />
                {photoFile ? (
                  <>
                    <svg className="w-5 h-5 text-[#f5f2eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.2em] text-[#c9c3b8]">Asset Acquisito</span>
                    <span className="font-playfair italic text-sm text-[#9a8e78]">{photoFile.name}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-[#c9c3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.2em] text-[#9a8e78]">
                      Seleziona Ritratto Fotografico
                    </span>
                    {formData.photoUrl && (
                      <span className="font-[family-name:var(--font-josefin)] text-[9px] tracking-[0.1em] text-[#c9c3b8]">
                        Immagine attualmente in db — clicca per sovrascrivere
                      </span>
                    )}
                  </>
                )}
              </div>
            </Field>

            <Field label="Copy Biografico">
              <textarea
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                rows={5}
                className="bg-transparent border-b border-[#c9c3b8] outline-none py-2 font-playfair font-light text-lg text-[#1a1916] focus:border-[#1a1916] transition-colors resize-none leading-relaxed w-full"
              />
              {/* Motore di Generazione IA integrato */}
              <AIGeneratorButton 
                type="author" 
                authorName={formData.name || 'Autore Sconosciuto'} 
                onSuccess={(text) => setFormData({ ...formData, bio: text })} 
              />
            </Field>

            {formError && (
              <p className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-red-500 bg-red-50 p-3 border border-red-100">
                {formError}
              </p>
            )}

            <div className="flex items-center gap-6 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#f5f2eb] bg-[#1a1916] px-8 py-3 hover:bg-[#3a3630] disabled:bg-[#c9c3b8] transition-colors"
              >
                {submitting ? 'Sincronizzazione DB...' : 'Esegui Salvataggio →'}
              </button>
              <button
                type="button"
                onClick={closePanel}
                disabled={submitting}
                className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#9a8e78] hover:text-[#1a1916] transition-colors"
              >
                Annulla Operazione
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Database View */}
      {loading ? (
        <p className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.3em] text-[#9a8e78] animate-pulse">Interrogazione Database in corso...</p>
      ) : authors.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[#c9c3b8]">
          <p className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#9a8e78]">Nessun asset autore nel CRM.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#e0dbd0]">
          {authors.map((author, i) => (
            <div key={author.id} className="py-6 flex items-center gap-6 group">

              {/* Foto Thumbnail */}
              {author.photoUrl && (
                <div className="w-10 h-10 bg-[#e0dbd0] shrink-0 overflow-hidden shadow-sm">
                  <img src={author.photoUrl} alt={author.name} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Info Autore */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-[family-name:var(--font-josefin)] text-[9px] text-[#c9c3b8] tracking-[0.2em] shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-playfair font-light text-lg text-[#1a1916] truncate">{author.name}</h3>
                </div>
                <div className="flex items-center gap-4 font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#9a8e78]">
                  <span>{author.slug}</span>
                  {author.bio && (
                    <>
                      <span className="w-1 h-1 bg-[#c9c3b8] rounded-full" />
                      <span className="truncate max-w-xs normal-case font-playfair not-italic text-[11px] text-[#c9c3b8]">
                        {author.bio.slice(0, 60)}{author.bio.length > 60 ? '…' : ''}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Azioni Editor */}
              <div className="flex items-center gap-5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => openEdit(author)} className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#9a8e78] hover:text-[#1a1916] transition-colors">
                  Configura
                </button>
                <button onClick={() => handleDelete(author.id)} disabled={deletingId === author.id} className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#c9c3b8] hover:text-red-500 disabled:opacity-50 transition-colors">
                  {deletingId === author.id ? '...' : 'Elimina'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}