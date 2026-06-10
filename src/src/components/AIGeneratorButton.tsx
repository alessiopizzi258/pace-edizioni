// components/AIGeneratorButton.tsx
'use client';

import { useState } from 'react';

interface AIGeneratorProps {
  type: 'author' | 'book';
  authorName: string;
  bookTitle?: string;
  collana?: string;
  onSuccess: (generatedText: string) => void;
}

export default function AIGeneratorButton({ type, authorName, bookTitle, collana, onSuccess }: AIGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name: authorName, title: bookTitle, collana }),
      });

      if (!response.ok) throw new Error('Fallimento connessione neurale');

      const data = await response.json();
      if (data.text) {
        onSuccess(data.text); // Invia il testo generato alla textarea del tuo form
      } else {
        throw new Error(data.error || 'Nessun testo generato');
      }
    } catch (err: any) {
      setError('Errore di connessione IA. Riprovare.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 mt-4">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
        className="flex items-center gap-2 px-4 py-2 border border-[var(--ink)] bg-[var(--paper-bright)] text-[var(--ink)] font-sans text-[10px] uppercase tracking-widest hover:bg-[var(--ink)] hover:text-[var(--paper-bright)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <span className="w-3 h-3 border-2 border-t-transparent border-current rounded-full animate-spin" />
            Elaborazione Sinaptica...
          </>
        ) : (
          <>
            <span>✦</span> Genera Copy con IA
          </>
        )}
      </button>
      {error && <span className="text-red-800 text-xs font-mono">{error}</span>}
    </div>
  );
}