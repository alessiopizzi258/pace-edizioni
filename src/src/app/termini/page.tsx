// app/termini/page.tsx
import Link from 'next/link';

export default function TerminiPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--ink)] selection:text-[var(--paper-bright)] pb-32">

      {/* ── 1. HEADER DOCUMENTO ── */}
      <section className="pt-[160px] pb-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-b border-[var(--paper-border)]">
        <span className="mono-sm text-[var(--ink-light)] block mb-8">
          09 — Condizioni d'Uso
        </span>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-end">
          <div>
            <h1 className="display-xl text-[var(--ink)] animate-in slide-in-from-bottom-8 duration-1000">
              Termini di<br />Servizio
            </h1>
          </div>
          <div className="flex flex-col gap-6 max-w-[280px]">
            <p className="font-sans text-[var(--ink-mid)] text-sm leading-relaxed">
              Le regole d'ingaggio per l'utilizzo della nostra infrastruttura digitale.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. CORPO DEL DOCUMENTO ── */}
      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32 max-w-7xl mx-auto animate-in fade-in duration-700">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          <div className="lg:col-span-4">
            <h2 className="mono-sm text-[var(--ink-light)] lg:sticky lg:top-32">
              Disposizioni Legali
            </h2>
          </div>
          
          <div className="lg:col-span-8 flex flex-col gap-16">

            <div>
              <span className="mono-sm text-[var(--ink-light)] block mb-4 border-b border-[var(--paper-border)] pb-2">Articolo 01</span>
              <h4 className="font-serif text-3xl md:text-4xl text-[var(--ink)] mb-6">Accettazione dei Termini</h4>
              <p className="prose-lg text-justify">
                L'accesso e l'utilizzo del sito web <em>paceedizioni.it</em> (di seguito "Sito") subordinano l'utente all'accettazione integrale dei presenti Termini e Condizioni. Qualora l'utente non intenda accettare tali disposizioni, è invitato ad abbandonare l'infrastruttura web.
              </p>
            </div>

            <div>
              <span className="mono-sm text-[var(--ink-light)] block mb-4 border-b border-[var(--paper-border)] pb-2">Articolo 02</span>
              <h4 className="font-serif text-3xl md:text-4xl text-[var(--ink)] mb-6">Proprietà Intellettuale</h4>
              <p className="prose-lg text-justify mb-4">
                Tutti i contenuti presenti sul Sito (inclusi ma non limitati a testi, grafica, logo, icone, immagini, architettura del codice e materiali audio/video) sono di proprietà esclusiva di Pace Edizioni o dei rispettivi autori/licenzianti e sono protetti dalle leggi italiane e internazionali sul diritto d'autore.
              </p>
              <p className="prose-lg text-justify">
                È severamente vietata la riproduzione, modifica, distribuzione o alterazione di qualsiasi materiale senza esplicito consenso scritto da parte della direzione editoriale. I diritti di pubblicazione e distribuzione delle singole opere letterarie sono invece disciplinati dagli specifici <em>Contratti Editoriali</em> stipulati con i singoli autori.
              </p>
            </div>

            <div>
              <span className="mono-sm text-[var(--ink-light)] block mb-4 border-b border-[var(--paper-border)] pb-2">Articolo 03</span>
              <h4 className="font-serif text-3xl md:text-4xl text-[var(--ink)] mb-6">Limitazione di Responsabilità</h4>
              <p className="prose-lg text-justify">
                Pace Edizioni si impegna a mantenere l'infrastruttura aggiornata e priva di errori tecnici. Tuttavia, non si garantisce che il Sito sia immune da interruzioni o vulnerabilità impreviste. Il Titolare declina ogni responsabilità per eventuali danni diretti o indiretti derivanti dall'utilizzo o dall'impossibilità di utilizzo dell'ecosistema web o dei link esterni in esso contenuti (ad esempio link verso la piattaforma Amazon).
              </p>
            </div>

            <div>
              <span className="mono-sm text-[var(--ink-light)] block mb-4 border-b border-[var(--paper-border)] pb-2">Articolo 04</span>
              <h4 className="font-serif text-3xl md:text-4xl text-[var(--ink)] mb-6">Giurisdizione e Foro Competente</h4>
              <p className="prose-lg text-justify">
                I presenti Termini sono disciplinati e interpretati in conformità con la legge italiana. Per qualsiasi controversia inerente l'interpretazione o l'esecuzione delle presenti disposizioni legali, si stabilisce la competenza esclusiva del <strong>Foro di Reggio Calabria</strong>.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-[var(--ink)]">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--ink-light)] leading-loose">
                Ultima revisione: Marzo 2026<br />
                Pace Edizioni — Direzione Editoriale: Oreste Kessel Pace<br />
                Sede legale: Via San Leonardo, 72 – 89015 Palmi (RC)
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER NAV ── */}
      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mt-16 pt-16 border-t border-[var(--paper-border)] flex justify-between items-center">
        <Link href="/privacy" className="mono-sm text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors">
          ← Informativa Privacy
        </Link>
        <Link href="/contratto-editoriale" className="mono-sm text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors">
          Contratto Editoriale →
        </Link>
      </section>

    </main>
  );
}