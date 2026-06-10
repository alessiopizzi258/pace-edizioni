// app/admin/libri/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getBooks, createBook, updateBook, deleteBook, getAuthors, createAuthor, deleteAuthor, Author, getCollane, createCollana, deleteCollana, Collana, Book } from '@/lib/api';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AIGeneratorButton from '@/components/AIGeneratorButton';

const EMPTY_FORM = {
  title: '', slug: '', authorId: '', collana: '',
  price: 0, description: '', coverUrl: '', amazonUrl: '',
};

/* ─── Utils ─── */
const generateSlug = (text: string) => 
  text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <label className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.2em] text-[#9a8e78]">{label}</label>
    {children}
  </div>
);

export default function AdminBooksPage() {
  const [books, setBooks]       = useState<Book[]>([]);
  const [authors, setAuthors]   = useState<Author[]>([]);
  const [collane, setCollane]   = useState<Collana[]>([]);
  const [loading, setLoading]   = useState(true);
  
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen]     = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [coverFile, setCoverFile]     = useState<File | null>(null);
  const [formData, setFormData]       = useState(EMPTY_FORM);
  const [submitting, setSubmitting]   = useState(false);
  const [formError, setFormError]     = useState<string | null>(null);

  // Stati Bulk Import & Nuke
  const [bulkPanelOpen, setBulkPanelOpen] = useState(false);
  const [isBulkScanning, setIsBulkScanning] = useState(false);
  const [bulkLogs, setBulkLogs] = useState<string[]>([]);
  const [isNuking, setIsNuking] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [b, a, c] = await Promise.all([getBooks(), getAuthors(), getCollane()]);
      setBooks(b); setAuthors(a); setCollane(c);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditingBook(null); setCoverFile(null); setFormData(EMPTY_FORM); setFormError(null); setPanelOpen(true); setBulkPanelOpen(false); };
  const openBulk = () => { setBulkPanelOpen(true); setPanelOpen(false); setBulkLogs([]); };
  const closePanels = () => { setPanelOpen(false); setBulkPanelOpen(false); setFormError(null); };

  const logBulk = (msg: string) => setBulkLogs(prev => [...prev, msg]);

  /* ─── PROTOCOLLO ZERO: DISINTEGRAZIONE GLOBALE ─── */
  const handleNukeDatabase = async () => {
    const confirmation = prompt('ATTENZIONE: Questa azione distruggerà in modo irreversibile tutti i Libri, Autori e Collane. Scrivi "CONFERMO" per eseguire il Protocollo Zero.');
    if (confirmation !== 'CONFERMO') return;

    setIsNuking(true);
    setBulkPanelOpen(true);
    setBulkLogs(['INIZIALIZZAZIONE PROTOCOLLO ZERO...']);
    
    try {
      logBulk('Disintegrazione Libri in corso...');
      for (const b of books) await deleteBook(b.id);
      
      logBulk('Disintegrazione Autori in corso...');
      for (const a of authors) await deleteAuthor(a.id);
      
      logBulk('Disintegrazione Collane in corso...');
      for (const c of collane) await deleteCollana(c.id);

      logBulk('=== PROTOCOLLO ZERO COMPLETATO. DATABASE STERILIZZATO. ===');
      await fetchData();
    } catch (e) {
      logBulk('[!] ERRORE DURANTE LA DISINTEGRAZIONE. Alcuni asset potrebbero essere rimasti.');
    } finally {
      setIsNuking(false);
    }
  };

  /* ─── Motore di Estrazione Massiva Sequenziale ─── */
  const handleBulkUpload = async (files: FileList) => {
    if (files.length === 0) return;
    setIsBulkScanning(true);
    setBulkLogs([]);
    let successCount = 0;

    logBulk(`INIZIALIZZAZIONE PIPELINE: Rilevati ${files.length} asset visivi.`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      logBulk(`\n[${i + 1}/${files.length}] Processamento asset: ${file.name}...`);
      
      try {
        const base64 = await fileToBase64(file);
        
        const res = await fetch('/api/scan-cover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });

        if (!res.ok) throw new Error('Fallimento OCR/AI Endpoint');
        const data = await res.json();
        
        logBulk(`  > OCR Completato: "${data.title}" di ${data.authorName}`);

        let finalAuthorId = '';
        if (data.authorName) {
          let currentAuthors = await getAuthors();
          let existingAuthor = currentAuthors.find(a => a.name.toLowerCase() === data.authorName.toLowerCase());
          
          if (existingAuthor) {
            finalAuthorId = existingAuthor.id;
          } else {
            logBulk(`  > Iniezione nuovo autore + Bio Reale in Italiano...`);
            await createAuthor({ 
              name: data.authorName, 
              slug: generateSlug(data.authorName), 
              bio: data.authorBio || '', 
              photoUrl: '',
              role: 'author' 
            } as any);
            currentAuthors = await getAuthors();
            setAuthors(currentAuthors);
            existingAuthor = currentAuthors.find(a => a.name.toLowerCase() === data.authorName.toLowerCase());
            if (existingAuthor) finalAuthorId = existingAuthor.id;
          }
        }

        let finalCollana = '';
        if (data.collana && data.collana.trim() !== '') {
          let currentCollane = await getCollane();
          let existingCollana = currentCollane.find(c => c.name.toLowerCase() === data.collana.toLowerCase());
          
          if (existingCollana) {
            finalCollana = existingCollana.name;
          } else {
            logBulk(`  > Generazione architettura collana (Singolare) + Descrizione...`);
            await createCollana({ 
              name: data.collana.toUpperCase(), 
              slug: generateSlug(data.collana), 
              description: data.collanaDescription || '' 
            });
            currentCollane = await getCollane();
            setCollane(currentCollane);
            finalCollana = data.collana.toUpperCase();
          }
        }

        logBulk(`  > Trasferimento copertina su Firebase Storage...`);
        const fileRef = ref(storage, `covers/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        const coverUrl = await getDownloadURL(snapshot.ref);

        const generatedAmazonUrl = `https://www.amazon.it/s?k=${encodeURIComponent((data.title + ' ' + (data.authorName || '')).trim())}`;

        const extractedPrice = parseFloat(data.price);
        const finalPrice = (!isNaN(extractedPrice) && extractedPrice > 0) ? extractedPrice : 19.90;

        logBulk(`  > Compilazione record DB libro... (Valore calcolato: €${finalPrice.toFixed(2)})`);
        await createBook({
          title: data.title || 'Senza Titolo',
          slug: data.title ? generateSlug(data.title) : `libro-${Date.now()}`,
          authorId: finalAuthorId,
          collana: finalCollana,
          price: finalPrice,
          description: data.description || '',
          coverUrl: coverUrl,
          amazonUrl: generatedAmazonUrl
        });

        successCount++;
        logBulk(`  [✓] SISTEMA AGGIORNATO: Asset strutturato con successo.`);

      } catch (error) {
        logBulk(`  [X] ERRORE CRITICO su ${file.name}. Asset ignorato.`);
      }
    }

    logBulk(`\n=== ESECUZIONE TERMINATA: ${successCount} su ${files.length} libri inseriti a sistema. ===`);
    fetchData();
    setIsBulkScanning(false);
  };

  const openEdit = (book: Book) => {
    setEditingBook(book); setCoverFile(null); setBulkPanelOpen(false);
    setFormData({
      title: book.title, slug: book.slug, authorId: book.authorId || '',
      collana: book.collana || '', price: book.price,
      description: book.description || '', coverUrl: book.coverUrl || '', amazonUrl: book.amazonUrl || '',
    });
    setFormError(null); setPanelOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let finalCoverUrl = formData.coverUrl;
      if (coverFile) {
        const fileRef = ref(storage, `covers/${Date.now()}_${coverFile.name}`);
        const snapshot = await uploadBytes(fileRef, coverFile);
        finalCoverUrl = await getDownloadURL(snapshot.ref);
      }
      const bookData = { ...formData, coverUrl: finalCoverUrl };
      if (editingBook) await updateBook(editingBook.id, bookData);
      else await createBook(bookData as Omit<Book, 'id'>);
      closePanels(); fetchData();
    } catch { setFormError("Errore durante il salvataggio."); } 
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Confermi la disintegrazione permanente?')) return;
    setDeletingId(id);
    try { await deleteBook(id); fetchData(); } catch { /* silent */ } finally { setDeletingId(null); }
  };

  const inputCls = "bg-transparent border-b border-[#c9c3b8] outline-none py-2 font-playfair font-light text-lg text-[#1a1916] focus:border-[#1a1916] transition-colors w-full";
  const selectCls = "bg-[#f5f2eb] border-b border-[#c9c3b8] outline-none py-2 font-[family-name:var(--font-josefin)] text-[11px] uppercase tracking-[0.15em] text-[#1a1916] focus:border-[#1a1916] transition-colors w-full";

  // Lookup nome autore per il prompt IA
  const getSelectedAuthorName = () => {
    const author = authors.find(a => a.id === formData.authorId);
    return author ? author.name : 'Autore non specificato';
  };

  return (
    <div className="min-h-screen bg-[#f5f2eb] px-6 md:px-16 lg:px-24 pt-16 pb-24">

      {/* Header Strategico */}
      <div className="mb-10">
        <span className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#9a8e78] block mb-3">
          Dashboard — Catalogo Operativo
        </span>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <h1 className="font-playfair font-light text-[clamp(28px,4vw,44px)] tracking-[-0.02em] leading-none text-[#1a1916]">
            Gestione Libri
          </h1>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleNukeDatabase}
              disabled={isNuking}
              className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-white bg-red-600 px-5 py-3 hover:bg-red-700 disabled:opacity-50 transition-colors shrink-0"
            >
              Reset DB Globale
            </button>
            <button
              onClick={openBulk}
              className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#1a1916] bg-transparent border border-[#1a1916] px-5 py-3 hover:bg-[#1a1916] hover:text-[#f5f2eb] transition-colors shrink-0"
            >
              Importazione globale
            </button>
            <button
              onClick={openCreate}
              className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#f5f2eb] bg-[#1a1916] px-5 py-3 hover:bg-[#3a3630] transition-colors shrink-0"
            >
              + Inserimento Singolo
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-[#c9c3b8] mb-10" />

      {/* Pannello BULK IMPORT & NUKE LOGS */}
      {bulkPanelOpen && (
        <div className="mb-10 border border-[#1a1916] bg-[#1a1916] p-8 md:p-10 shadow-lg text-[#f5f2eb] transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <span className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#9a8e78]">
              Terminale di Sistema
            </span>
            <button onClick={closePanels} disabled={isBulkScanning || isNuking} className="text-[#9a8e78] hover:text-white uppercase text-[9px] tracking-widest disabled:opacity-50">Chiudi [X]</button>
          </div>

          {!isBulkScanning && !isNuking && bulkLogs.length === 0 && (
            <div
              onClick={() => document.getElementById('bulk-upload-input')?.click()}
              className="cursor-pointer border border-dashed border-[#9a8e78] p-12 flex flex-col items-center justify-center gap-4 hover:border-[#f5f2eb] transition-colors bg-[#23211c]"
            >
              <input 
                id="bulk-upload-input" 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={e => { if (e.target.files) handleBulkUpload(e.target.files); }} 
                className="hidden" 
              />
              <svg className="w-8 h-8 text-[#9a8e78]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              <span className="font-playfair text-xl text-[#f5f2eb]">Seleziona cartella o trascina file</span>
              <span className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.2em] text-[#9a8e78]">Carica copertine per Auto-Ingestion</span>
            </div>
          )}

          {/* Terminale di Log in Tempo Reale */}
          {(isBulkScanning || isNuking || bulkLogs.length > 0) && (
            <div className="bg-black border border-[#333] p-4 font-mono text-[11px] text-green-500 h-64 overflow-y-auto mt-4 rounded-sm">
              {bulkLogs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">{log}</div>
              ))}
              {(isBulkScanning || isNuking) && (
                <div className="flex items-center gap-2 mt-2 text-yellow-500 animate-pulse">
                  <span>_ Elaborazione in corso...</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pannello Form Singolo - Nascosto se bulk aperto */}
      {panelOpen && !bulkPanelOpen && (
        <div className="mb-10 border border-[#c9c3b8] bg-white p-8 md:p-10 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Titolo (Auto-Slug) *">
                  <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })} required className={inputCls} />
                </Field>
                <Field label="Slug SEO (URL) *">
                  <input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required className={inputCls} />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Target Autore">
                  <select value={formData.authorId} onChange={e => setFormData({ ...formData, authorId: e.target.value })} required className={selectCls}>
                    <option value="">Seleziona dal CRM...</option>
                    {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </Field>
                <Field label="Posizionamento Collana">
                  <select value={formData.collana} onChange={e => setFormData({ ...formData, collana: e.target.value })} className={selectCls}>
                    <option value="">Nessuna (Indipendente)</option>
                    {collane.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Valore Transazionale (€) *">
                  <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} required className={inputCls} />
                </Field>
                <Field label="Infrastruttura Amazon (URL)">
                  <input type="url" value={formData.amazonUrl} onChange={e => setFormData({ ...formData, amazonUrl: e.target.value })} className={inputCls} />
                </Field>
              </div>

              <Field label="Asset Visivo Manuale (O sovrascrittura AI)">
                 <div onClick={() => document.getElementById('cover-input')?.click()} className={`cursor-pointer border border-dashed border-[#c9c3b8] p-8 flex flex-col items-center justify-center gap-3 hover:border-[#9a8e78] transition-colors ${coverFile ? 'bg-[#1a1916]' : ''}`}>
                  <input id="cover-input" type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="hidden" />
                  {coverFile ? <span className="font-playfair italic text-[#9a8e78]">Caricata: {coverFile.name}</span> : <span className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.2em] text-[#9a8e78]">Carica copertina manuale</span>}
                </div>
              </Field>

              <Field label="Copy Persuasivo">
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={5} className="bg-transparent border-b border-[#c9c3b8] outline-none py-2 font-playfair font-light text-lg text-[#1a1916] focus:border-[#1a1916] transition-colors resize-none leading-relaxed w-full" />
                {/* Motore di Generazione IA integrato */}
                <AIGeneratorButton 
                  type="book" 
                  authorName={getSelectedAuthorName()}
                  bookTitle={formData.title}
                  collana={formData.collana}
                  onSuccess={(text) => setFormData({ ...formData, description: text })} 
                />
              </Field>

              <div className="flex items-center gap-6 pt-4">
                <button type="submit" disabled={submitting} className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#f5f2eb] bg-[#1a1916] px-8 py-3 hover:bg-[#3a3630] disabled:bg-[#c9c3b8] transition-colors">
                  {submitting ? 'Salvataggio...' : 'Esegui Salvataggio →'}
                </button>
                <button type="button" onClick={closePanels} className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#9a8e78] hover:text-[#1a1916]">Annulla</button>
              </div>
            </form>
        </div>
      )}

      {/* Lista Libri */}
      <div className="divide-y divide-[#e0dbd0]">
          {books.map((book, i) => (
            <div key={book.id} className="py-6 flex items-center gap-6 group">
              <div className="w-10 h-14 bg-[#e0dbd0] shrink-0 overflow-hidden shadow-sm">
                {book.coverUrl && <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-[family-name:var(--font-josefin)] text-[9px] text-[#c9c3b8] tracking-[0.2em] shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-playfair font-light text-lg text-[#1a1916] truncate">{book.title}</h3>
                </div>
                <div className="flex items-center gap-4 font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#9a8e78]">
                  <span>{book.collana || 'Fuori collana'}</span><span className="w-1 h-1 bg-[#c9c3b8] rounded-full" />
                  <span className="font-semibold text-[#1a1916]">€ {book.price.toFixed(2)}</span>
                </div>
                {book.amazonUrl && (
                  <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" className="text-[9px] font-[family-name:var(--font-josefin)] text-blue-600 hover:underline tracking-widest uppercase mt-1 inline-block">
                    [↘ Link Amazon Generato]
                  </a>
                )}
              </div>
              <div className="flex items-center gap-5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => openEdit(book)} className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#9a8e78] hover:text-[#1a1916]">Configura</button>
                <button onClick={() => handleDelete(book.id)} disabled={deletingId === book.id} className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#c9c3b8] hover:text-red-500 disabled:opacity-50">{deletingId === book.id ? '...' : 'Elimina'}</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}