// app/contatti/page.tsx
'use client';

import { useState } from 'react';

export default function ContattiPage() {
  const [formType, setFormType] = useState<'messaggio' | 'opera'>('messaggio');

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] pb-32">
      <section className="pt-[160px] pb-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-b border-[var(--paper-border)]">
        <span className="mono-sm text-[var(--ink-light)] block mb-8">04 — Segreteria & Manoscritti</span>
        <h1 className="display-xl animate-in slide-in-from-bottom-8 duration-1000">Contatti</h1>
      </section>

      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        
        {/* INFO COLUMN */}
        <div className="lg:col-span-4 space-y-12 lg:sticky lg:top-32">
          {/* Testo sostituito integralmente secondo le precise specifiche fornite */}
          <p className="prose-md text-[var(--ink-mid)] leading-relaxed text-justify">
            Le valutazioni dei manoscritti inediti richiedono un tempo tecnico di lettura e analisi di circa 3 mesi. Se gli autori non riceveranno risposta, dovranno intendere il nostro silenzio come disinteresse verso l'opera. Si pregano gli autori di visionare il contratto editoriale prima di inviare le opere.
          </p>
          
          <div className="space-y-8">
            <div>
              <h3 className="ui-label text-[var(--ink-light)] uppercase tracking-widest mb-2 block">Segreteria Editoriale</h3>
              {/* Mail corretta inserita */}
              <a href="mailto:manoscritti@pacedizioni.it" className="font-serif text-2xl hover:text-[var(--ink-light)] transition-colors text-[var(--accent)] font-medium">
                manoscritti@pacedizioni.it
              </a>
            </div>

            <div>
              {/* Sostituito in Sede Legale */}
              <h3 className="ui-label text-[var(--ink-light)] uppercase tracking-widest mb-2 block">Sede Legale</h3>
              <p className="prose-md text-[var(--ink)]">
                Via San Leonardo, 72<br />
                89015 Palmi (RC) — Italia
              </p>
            </div>

            {/* Ingegnerizzazione del Pulsante Monumentale per il Contratto PDF */}
            <div className="pt-8 border-t border-[var(--paper-border)]">
              <a 
                href="/contratto-editoriale.pdf" 
                download
                className="inline-flex items-center justify-center gap-4 w-full bg-[var(--accent)] text-[var(--paper-bright)] font-sans text-xs uppercase tracking-[0.25em] font-semibold px-8 py-5 shadow-md hover:bg-[var(--ink)] transition-colors group"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                SCARICA IL CONTRATTO EDITORIALE
              </a>
            </div>
          </div>
        </div>

        {/* FORM COLUMN */}
        <div className="lg:col-span-8">
          <div className="flex gap-8 mb-16 border-b border-[var(--paper-border)] pb-4">
            <button onClick={() => setFormType('messaggio')} className={`ui-label tracking-[0.2em] uppercase transition-colors pb-4 -mb-[17px] border-b-2 ${formType === 'messaggio' ? 'text-[var(--ink)] border-[var(--ink)]' : 'text-[var(--ink-ghost)] border-transparent'}`}>
              Messaggio Generale
            </button>
            <button onClick={() => setFormType('opera')} className={`ui-label tracking-[0.2em] uppercase transition-colors pb-4 -mb-[17px] border-b-2 ${formType === 'opera' ? 'text-[var(--ink)] border-[var(--ink)]' : 'text-[var(--ink-ghost)] border-transparent'}`}>
              Proposta Editoriale
            </button>
          </div>

          <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <label className="ui-label text-[var(--ink-light)] uppercase block mb-4">Nome e Cognome *</label>
                <input type="text" required className="w-full bg-transparent border-b border-[var(--ink-ghost)] pb-3 font-serif-alt text-[1.3rem] font-light text-[var(--ink)] focus:outline-none focus:border-[var(--ink)] transition-colors" placeholder="Il tuo nome" />
              </div>
              <div>
                <label className="ui-label text-[var(--ink-light)] uppercase block mb-4">Email di recapito *</label>
                <input type="email" required className="w-full bg-transparent border-b border-[var(--ink-ghost)] pb-3 font-serif-alt text-[1.3rem] font-light text-[var(--ink)] focus:outline-none focus:border-[var(--ink)] transition-colors" placeholder="indirizzo@email.com" />
              </div>
            </div>

            {formType === 'opera' && (
              <div className="animate-in fade-in duration-500">
                <label className="ui-label text-[var(--ink-light)] uppercase block mb-4">Titolo dell'Opera *</label>
                <input type="text" required className="w-full bg-transparent border-b border-[var(--ink-ghost)] pb-3 font-serif-alt text-[1.3rem] font-light text-[var(--ink)] focus:outline-none focus:border-[var(--ink)] transition-colors" placeholder="Inserisci il titolo provvisorio" />
              </div>
            )}

            <div>
              <label className="ui-label text-[var(--ink-light)] uppercase block mb-4">{formType === 'opera' ? 'Sinossi e Note Biografiche *' : 'Il tuo Messaggio *'}</label>
              <textarea required rows={formType === 'opera' ? 8 : 5} className="w-full bg-transparent border-b border-[var(--ink-ghost)] pb-3 font-serif-alt text-[1.3rem] font-light text-[var(--ink)] focus:outline-none focus:border-[var(--ink)] transition-colors resize-none" placeholder={formType === 'opera' ? "Raccontaci dell'opera..." : "Scrivi qui..."} />
            </div>

            {formType === 'opera' && (
              <div className="animate-in fade-in duration-500">
                <label className="ui-label text-[var(--ink-light)] uppercase block mb-4">Allegato (PDF / DOC / DOCX)</label>
                <input type="file" className="font-sans text-sm text-[var(--ink-mid)] file:mr-6 file:py-3 file:px-6 file:border-0 file:bg-[var(--paper-deep)] file:text-[var(--ink)] file:tracking-widest file:text-[10px] cursor-pointer" accept=".pdf,.doc,.docx" />
              </div>
            )}

            <div className="pt-12 mt-12 border-t border-[var(--paper-border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <button type="submit" className="bg-[var(--ink)] text-[var(--paper-bright)] font-sans text-[10px] uppercase tracking-[0.25em] px-10 py-5 hover:opacity-90 transition-opacity w-full md:w-auto">
                {formType === 'opera' ? 'Invia Manoscritto' : 'Invia Messaggio'}
              </button>
            </div>
          </form>
        </div>

      </section>
    </main>
  );
}