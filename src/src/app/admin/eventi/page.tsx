// app/admin/eventi/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent, Event } from '@/lib/api';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const EMPTY_EVENT: Omit<Event, 'id'> = { title: '', slug: '', location: '', description: '', date: '', coverUrl: '' };

/* ─── Utils ─── */
const generateSlug = (text: string) => 
  text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <label className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.2em] text-[#9a8e78]">{label}</label>
    {children}
  </div>
);

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_EVENT);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    setEvents(await getEvents());
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_EVENT);
    setCoverFile(null);
    setPanelOpen(true);
  };

  const openEdit = (event: Event) => {
    setEditingId(event.id);
    setFormData({ 
      title: event.title, 
      slug: event.slug || generateSlug(event.title), // Fallback di sicurezza per vecchi eventi
      location: event.location, 
      description: event.description, 
      date: event.date,
      coverUrl: event.coverUrl || ''
    });
    setCoverFile(null);
    setPanelOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let finalCoverUrl = formData.coverUrl;
      
      if (coverFile) {
        const fileRef = ref(storage, `events/${Date.now()}_${coverFile.name}`);
        const snapshot = await uploadBytes(fileRef, coverFile);
        finalCoverUrl = await getDownloadURL(snapshot.ref);
      }

      const payload = { ...formData, coverUrl: finalCoverUrl };

      if (editingId) {
        await updateEvent(editingId, payload);
      } else {
        await createEvent(payload);
      }
      setPanelOpen(false);
      fetchEvents();
    } catch (error) {
      console.error("Errore di sincronizzazione evento.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "bg-transparent border-b border-[#c9c3b8] outline-none py-2 font-playfair font-light text-lg text-[#1a1916] focus:border-[#1a1916] transition-colors w-full";

  return (
    <div className="min-h-screen bg-[#f5f2eb] px-6 md:px-16 lg:px-24 pt-16 pb-24">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <span className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#9a8e78] block mb-3">
            Dashboard — Operations
          </span>
          <h1 className="font-playfair font-light text-[clamp(28px,4vw,44px)] tracking-[-0.02em] leading-none text-[#1a1916]">
            Gestione Eventi Live
          </h1>
        </div>
        <button onClick={openCreate} className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#f5f2eb] bg-[#1a1916] px-5 py-3 hover:bg-[#3a3630] transition-colors shrink-0">
          + Allestisci Evento
        </button>
      </div>

      <div className="border-b border-[#c9c3b8] mb-10" />

      {panelOpen && (
        <div className="mb-10 border border-[#c9c3b8] bg-white p-8 md:p-10 shadow-sm transition-all duration-300">
          <span className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.2em] text-[#9a8e78] block mb-8">
            {editingId ? 'Modifica Coordinate Evento' : 'Inizializzazione Nuovo Evento'}
          </span>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field label="Titolo dell'Evento (Masterclass / Presentazione) *">
                <input 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })} 
                  required 
                  className={inputCls} 
                  placeholder="Es. Presentazione Radici di Carta..." 
                />
              </Field>
              <Field label="Slug SEO (URL Identificativo) *">
                <input 
                  value={formData.slug} 
                  onChange={e => setFormData({ ...formData, slug: e.target.value })} 
                  required 
                  className={inputCls} 
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field label="Data e Ora *">
                <input type="datetime-local" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required className={inputCls} />
              </Field>
              <Field label="Location (Indirizzo Fisico o Link Zoom) *">
                <input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required className={inputCls} placeholder="Es. Roma, Via Roma 1 / Link Zoom" />
              </Field>
            </div>

            <Field label="Locandina (Cover Image)">
              <input type="file" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="text-[10px] pt-2" accept="image/*" />
            </Field>

            <Field label="Descrizione Strategica (Copywriting)">
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required rows={4} className="bg-transparent border border-[#c9c3b8] p-4 font-serif text-lg leading-relaxed outline-none focus:border-[#1a1916] transition-colors resize-y w-full" />
            </Field>

            <div className="flex items-center gap-6 pt-4">
              <button type="submit" disabled={submitting} className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#f5f2eb] bg-[#1a1916] px-8 py-3 hover:bg-[#3a3630] disabled:bg-[#c9c3b8] transition-colors">
                {submitting ? 'Sincronizzazione...' : 'Salva Evento →'}
              </button>
              <button type="button" onClick={() => setPanelOpen(false)} className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#9a8e78] hover:text-[#1a1916] transition-colors">
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.3em] text-[#9a8e78] animate-pulse">Sincronizzazione Radar...</p>
      ) : events.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[#c9c3b8]">
          <p className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#9a8e78]">Nessun evento in programma.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#e0dbd0]">
          {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event) => (
            <div key={event.id} className="py-6 flex items-center gap-6 group">
              <div className="w-16 h-16 bg-[#e0dbd0] shrink-0 overflow-hidden">
                {event.coverUrl && <img src={event.coverUrl} alt={event.title} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-playfair font-light text-xl text-[#1a1916] truncate mb-1">{event.title}</h3>
                <div className="flex items-center gap-4 font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#9a8e78]">
                  <span>{new Date(event.date).toLocaleString('it-IT', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  <span className="w-1 h-1 bg-[#c9c3b8] rounded-full" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => openEdit(event)} className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#9a8e78] hover:text-[#1a1916]">Modifica</button>
                <button onClick={() => { if(confirm('Cancellare evento?')) deleteEvent(event.id).then(fetchEvents); }} className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#c9c3b8] hover:text-red-500">Disintegra</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}