'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Assicurati che il percorso sia corretto

export default function SeedDatabase() {
  const [status, setStatus] = useState<string>('In attesa...');
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    setStatus('Iniezione dati in corso...');

    try {
      // 1. INSERIMENTO AUTORI
      setStatus('Creazione Autori...');
      const author1Ref = await addDoc(collection(db, 'authors'), {
        name: 'Mario Rossi',
        slug: 'mario-rossi',
        bio: 'Esperto di geopolitica e saggista di fama internazionale.',
        photoUrl: 'https://via.placeholder.com/150',
      });

      const author2Ref = await addDoc(collection(db, 'authors'), {
        name: 'Elena Bianchi',
        slug: 'elena-bianchi',
        bio: 'Romanziera pluripremiata, esplora la psicologia umana.',
        photoUrl: 'https://via.placeholder.com/150',
      });

      // 2. INSERIMENTO LIBRI (Usando gli ID degli autori appena creati)
      setStatus('Creazione Libri...');
      await addDoc(collection(db, 'books'), {
        title: 'Il Crollo delle Illusioni',
        slug: 'il-crollo-delle-illusioni',
        authorId: author1Ref.id,
        price: 24.90,
        coverUrl: 'https://via.placeholder.com/400x600?text=Crollo+Illusioni',
        description: 'Un saggio spietato sulle dinamiche di potere del ventunesimo secolo.',
        createdAt: Date.now(),
      });

      await addDoc(collection(db, 'books'), {
        title: 'Silenzi Assordanti',
        slug: 'silenzi-assordanti',
        authorId: author2Ref.id,
        price: 18.50,
        coverUrl: 'https://via.placeholder.com/400x600?text=Silenzi+Assordanti',
        description: 'Un thriller psicologico che non lascia respiro al lettore.',
        createdAt: Date.now(),
      });

      // 3. INSERIMENTO EVENTI
      setStatus('Creazione Eventi...');
      await addDoc(collection(db, 'events'), {
        title: 'Presentazione Saggio Geopolitica',
        location: 'Milano, Libreria Centrale',
        date: '2026-06-15T18:00',
        description: 'Incontro con Mario Rossi per discutere le nuove dinamiche globali.',
      });

      // 4. INSERIMENTO FORUM THREADS
      setStatus('Creazione Forum...');
      await addDoc(collection(db, 'forumThreads'), {
        title: 'Discussione sul finale di Silenzi Assordanti',
        slug: 'discussione-finale-silenzi-assordanti',
        content: 'Ho appena finito di leggere il libro. Secondo voi, il protagonista era consapevole dall\'inizio?',
        authorName: 'LettoreAccanito',
        createdAt: Date.now(),
      });

      setStatus('Operazione completata con successo. Database popolato.');
    } catch (error: any) {
      console.error(error);
      setStatus(`Errore critico: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-900 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4 font-serif">Database Seeder</h1>
        <p className="mb-6 text-sm text-stone-500">
          Questo script inietterà dati fittizi in Firestore. Eseguire solo su database vuoto.
        </p>
        
        <button
          onClick={handleSeed}
          disabled={loading}
          className="w-full bg-black text-white py-3 px-4 rounded hover:bg-stone-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Elaborazione...' : 'Inizia Iniezione Dati'}
        </button>

        <div className="mt-6 p-4 bg-stone-100 rounded text-sm text-left font-mono">
          <strong>Status:</strong> {status}
        </div>
      </div>
    </div>
  );
}