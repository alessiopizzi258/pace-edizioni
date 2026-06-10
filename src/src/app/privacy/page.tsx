// app/privacy/page.tsx
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--ink)] selection:text-[var(--paper-bright)] pb-32">

      {/* ── 1. HEADER DOCUMENTO ── */}
      <section className="pt-[160px] pb-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-b border-[var(--paper-border)]">
        <span className="mono-sm text-[var(--ink-light)] block mb-8">
          08 — Tutela dei Dati
        </span>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-end">
          <div>
            <h1 className="display-xl text-[var(--ink)] animate-in slide-in-from-bottom-8 duration-1000">
              Informativa<br />Privacy
            </h1>
          </div>
          <div className="flex flex-col gap-6 max-w-[280px]">
            <p className="font-sans text-[var(--ink-mid)] text-sm leading-relaxed">
              Trattiamo le informazioni con lo stesso rigore che applichiamo alle nostre edizioni. Nessuna concessione a terzi, massima trasparenza.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. CORPO DELL'INFORMATIVA ── */}
      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32 max-w-7xl mx-auto animate-in fade-in duration-700">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          <div className="lg:col-span-4">
            <h2 className="mono-sm text-[var(--ink-light)] lg:sticky lg:top-32">
              GDPR & Normative
            </h2>
          </div>
          
          <div className="lg:col-span-8 flex flex-col gap-16">

            <div>
              <span className="mono-sm text-[var(--ink-light)] block mb-4 border-b border-[var(--paper-border)] pb-2">Sezione 01</span>
              <h4 className="font-serif text-3xl md:text-4xl text-[var(--ink)] mb-6">Titolare del Trattamento</h4>
              <p className="prose-lg text-justify">
                Il Titolare del trattamento dei dati raccolti attraverso questo sito web è <strong>Oreste Kessel Pace</strong>, con sede legale in Via San Leonardo, 72 – 89015 Palmi (RC). Per qualsiasi comunicazione inerente la privacy, è possibile scrivere all'indirizzo email direzionale: <em>info@paceedizioni.it</em>.
              </p>
            </div>

            <div>
              <span className="mono-sm text-[var(--ink-light)] block mb-4 border-b border-[var(--paper-border)] pb-2">Sezione 02</span>
              <h4 className="font-serif text-3xl md:text-4xl text-[var(--ink)] mb-6">Dati Raccolti e Finalità</h4>
              <p className="prose-lg text-justify mb-4">
                Pace Edizioni raccoglie esclusivamente i dati forniti volontariamente dall'utente attraverso il modulo di contatto o l'iscrizione alla newsletter (indirizzo email, nome e cognome, contenuto del messaggio, eventuali manoscritti allegati/linkati).
              </p>
              <ul className="prose-lg list-disc pl-6 space-y-2">
                <li><strong>Comunicazioni:</strong> Per rispondere a richieste di informazioni o valutare proposte editoriali.</li>
                <li><strong>Accesso Riservato:</strong> Per l'invio di comunicazioni relative a nuove acquisizioni, eventi o apertura invio manoscritti (solo previo esplicito consenso).</li>
              </ul>
            </div>

            <div>
              <span className="mono-sm text-[var(--ink-light)] block mb-4 border-b border-[var(--paper-border)] pb-2">Sezione 03</span>
              <h4 className="font-serif text-3xl md:text-4xl text-[var(--ink)] mb-6">Base Giuridica e Conservazione</h4>
              <p className="prose-lg text-justify mb-4">
                Il trattamento si basa sul consenso esplicito dell'utente fornito al momento della compilazione dei moduli. I dati sono trattati con strumenti informatici idonei a garantirne la sicurezza e la riservatezza.
              </p>
              <p className="prose-lg text-justify">
                I dati comunicati per la valutazione di manoscritti non accettati per la pubblicazione verranno distrutti o cancellati dai nostri archivi al termine della valutazione (massimo 90 giorni). I dati per le comunicazioni "Accesso Riservato" sono conservati fino a richiesta di disiscrizione da parte dell'utente.
              </p>
            </div>

            <div>
              <span className="mono-sm text-[var(--ink-light)] block mb-4 border-b border-[var(--paper-border)] pb-2">Sezione 04</span>
              <h4 className="font-serif text-3xl md:text-4xl text-[var(--ink)] mb-6">Diritti dell'Utente</h4>
              <p className="prose-lg text-justify">
                L'utente ha il diritto, in qualunque momento, di chiedere al Titolare l'accesso ai propri dati personali, la rettifica, la cancellazione degli stessi, la limitazione del trattamento. Le richieste vanno rivolte per iscritto ai recapiti indicati nella Sezione 01. È inoltre garantito il diritto di proporre reclamo a un'autorità di controllo (Garante per la Protezione dei Dati Personali).
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER NAV ── */}
      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mt-16 pt-16 border-t border-[var(--paper-border)] flex justify-between items-center">
        <Link href="/" className="mono-sm text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors">
          ← Ritorna all'Indice
        </Link>
        <Link href="/termini" className="mono-sm text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors">
          Termini di Servizio →
        </Link>
      </section>

    </main>
  );
}