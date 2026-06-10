// app/admin/collane/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getCollane, createCollana, updateCollana, deleteCollana, Collana } from '@/lib/api';

const EMPTY_FORM = { name: '', slug: '', description: '' };

/* ─── Utils ─── */
const generateSlug = (text: string) => 
  text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

export default function AdminCollanePage() {
  const [collane, setCollane]       = useState<Collana[]>([]);
  const [loading, setLoading]       = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [panelOpen, setPanelOpen]           = useState(false);
  const [editingCollana, setEditingCollana] = useState<Collana | null>(null);
  const [formData, setFormData]             = useState(EMPTY_FORM);
  const [submitting, setSubmitting]         = useState(false);
  const [formError, setFormError]           = useState<string | null>(null);

  const fetchCollane = async () => {
    setLoading(true);
    try { setCollane(await getCollane()); }
    catch { /* silent fallback */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCollane(); }, []);

  const openCreate = () => {
    setEditingCollana(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setPanelOpen(true);
  };

  const openEdit = (collana: Collana) => {
    setEditingCollana(collana);
    setFormData({ name: collana.name, slug: collana.slug, description: collana.description || '' });
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
      if (editingCollana) {
        await updateCollana(editingCollana.id, formData);
      } else {
        await createCollana(formData as Omit<Collana, 'id'>);
      }
      closePanel();
      fetchCollane();
    } catch {
      setFormError('Errore critico di comunicazione con il database. Riprova.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare permanentemente questa collana? I libri associati manterranno il nome come metadato, ma l\'entità sarà distrutta.')) return;
    setDeletingId(id);
    try { await deleteCollana(id); fetchCollane(); }
    catch { /* silent */ }
    finally { setDeletingId(null); }
  };

  const inputCls = "bg-transparent border-b border-[#c9c3b8] outline-none py-2 font-playfair font-light text-lg text-[#1a1916] focus:border-[#1a1916] transition-colors w-full";
  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-2">
      <label className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.2em] text-[#9a8e78]">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f2eb] px-6 md:px-16 lg:px-24 pt-16 pb-24">

      {/* Header Strategico */}
      <div className="mb-10">
        <span className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#9a8e78] block mb-3">
          Dashboard — Architettura Editoriale
        </span>
        <div className="flex items-end justify-between gap-4">
          <h1 className="font-playfair font-light text-[clamp(28px,4vw,44px)] tracking-[-0.02em] leading-none text-[#1a1916]">
            Gestione Collane
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
            {editingCollana ? 'Modifica Struttura Collana' : 'Inizializzazione Nuova Collana'}
          </span>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field label="Nome collana (Auto-Slug) *">
                <input 
                  value={formData.name} 
                  onChange={e => setFormData({ 
                    ...formData, 
                    name: e.target.value,
                    slug: generateSlug(e.target.value)
                  })} 
                  required 
                  className={inputCls} 
                  placeholder="Inserisci il nome per generare l'URL..."
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

            <Field label="Copy Posizionamento (Opzionale)">
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="bg-transparent border-b border-[#c9c3b8] outline-none py-2 font-playfair font-light text-lg text-[#1a1916] focus:border-[#1a1916] transition-colors resize-none leading-relaxed w-full"
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
      ) : collane.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[#c9c3b8]">
          <p className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#9a8e78]">Nessun asset collana attivo.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#e0dbd0]">
          {collane.map((collana, i) => (
            <div key={collana.id} className="py-6 flex items-center gap-6 group">
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-[family-name:var(--font-josefin)] text-[9px] text-[#c9c3b8] tracking-[0.2em] shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-playfair font-light text-lg text-[#1a1916] truncate">{collana.name}</h3>
                </div>
                <div className="flex items-center gap-4 font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#9a8e78]">
                  <span>{collana.slug}</span>
                  {collana.description && (
                    <>
                      <span className="w-1 h-1 bg-[#c9c3b8] rounded-full" />
                      <span className="truncate max-w-xs normal-case">{collana.description}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => openEdit(collana)}
                  className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#9a8e78] hover:text-[#1a1916] transition-colors"
                >
                  Configura
                </button>
                <button
                  onClick={() => handleDelete(collana.id)}
                  disabled={deletingId === collana.id}
                  className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#c9c3b8] hover:text-red-500 disabled:opacity-50 transition-colors"
                >
                  {deletingId === collana.id ? '...' : 'Elimina'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}