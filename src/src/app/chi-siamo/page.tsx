// app/chi-siamo/page.tsx
import Link from 'next/link';

export default function ChiSiamoPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--ink)] selection:text-[var(--paper-bright)] pb-32">

      {/* ── 1. HEADER ISTITUZIONALE ───────────────────────────────────── */}
      <section className="pt-[160px] pb-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-b border-[var(--paper-border)]">
        <span className="mono-sm text-[var(--ink-light)] block mb-8">
          01 — Profilo Societario
        </span>
        {/* Niente data-reveal qui per garantire la visibilità immediata del brand */}
        <h1 className="display-xl text-[var(--ink)] animate-in slide-in-from-bottom-8 duration-1000">
          La Casa<br />Editrice
        </h1>
      </section>

      {/* ── 2. GENESI (Con Drop Cap pulito) ─────────────────────────────── */}
      <section className="px-6 md:px-12 lg:px-24 py-24 max-w-7xl mx-auto border-b border-[var(--paper-border)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-4">
            <h2 className="mono-sm text-[var(--ink-light)] lg:sticky lg:top-32">
              La Genesi
            </h2>
          </div>
          
          <div className="lg:col-span-8 space-y-8">
            {/* L'approccio pulito: .prose-intro si occupa del Drop Cap. Il testo è completo: "La Pace Edizioni nasce..." */}
            <p className="prose-lg prose-intro">
              La Pace Edizioni nasce da un progetto a lungo coltivato dallo scrittore Oreste Kessel Pace: fondare una casa editrice gratuita per gli scrittori, con una distribuzione internazionale reale ed efficace.
            </p>
            <p className="prose-lg">
              Dopo oltre vent&apos;anni di carriera, con più di trenta libri all&apos;attivo, traduzioni all&apos;estero e cinque premi alla carriera, Oreste Kessel Pace ha scelto di ingegnerizzare la propria esperienza e di metterla al servizio esclusivo di altri autori.
            </p>
            <p className="prose-md text-[var(--ink-light)]">
              Il lettore acquista prevalentemente online. La nostra infrastruttura garantisce disponibilità illimitata di copie, accesso a sconti, consegna rapida e presenza globale su Amazon, eliminando totalmente le inefficienze dei circuiti di micro-distribuzione, senza alcun costo per l&apos;autore.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. POLITICA EDITORIALE E MANIFESTO ───────────────────────── */}
      <section className="px-6 md:px-12 lg:px-24 py-24 max-w-7xl mx-auto border-b border-[var(--paper-border)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-4">
            <h2 className="mono-sm text-[var(--ink-light)] lg:sticky lg:top-32">
              Politica Editoriale
            </h2>
          </div>
          
          <div className="lg:col-span-8 space-y-12">
            {/* Raggruppiamo i testi per non appesantire il rendering con data-reveal */}
            <div className="space-y-8 prose-lg">
              <p>
                Dalla stesura originaria alla pubblicazione, l&apos;opera viene affidata ai direttori delle collane editoriali e ai collaboratori, tutti professionisti certificati del settore, per un&apos;attenta valutazione tecnica e strutturale.
              </p>
              <p>
                In caso di approvazione, Pace Edizioni offre un contratto editoriale all&apos;autore con una royalty del <span className="font-medium text-[var(--ink)]">15% sul prezzo di copertina</span>, garantendo inoltre un listino agevolato per le copie richieste a uso privato.
              </p>
            </div>

            <blockquote className="border-l-2 border-[var(--ink)] pl-8 py-2 my-12">
              <p className="font-serif italic text-3xl md:text-4xl leading-tight text-[var(--ink)]">
                Contratto trasparente. Tutela totale e inattaccabile del diritto d&apos;autore.
              </p>
            </blockquote>
            
            <div>
              <Link 
                href="/contatti" 
                className="inline-block mono-sm text-[var(--ink)] border-b border-[var(--ink)] pb-1 hover:text-[var(--ink-light)] hover:border-[var(--ink-light)] transition-colors"
              >
                Invia la tua opera per una valutazione →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. L'ORGANICO AZIENDALE ────────────────────────────────────── */}
      <section className="px-6 md:px-12 lg:px-24 py-24 max-w-7xl mx-auto border-b border-[var(--paper-border)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-4">
            <h2 className="mono-sm text-[var(--ink-light)] lg:sticky lg:top-32">
              L&apos;Organico
            </h2>
          </div>
          
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
              
              <div className="space-y-2">
                <span className="ui-label text-[var(--ink-light)] uppercase block">Direzione Legale</span>
                <h3 className="font-serif text-3xl text-[var(--ink)]">Oreste Kessel Pace</h3>
              </div>

              <div className="space-y-2">
                <span className="ui-label text-[var(--ink-light)] uppercase block">Direzione</span>
                <h3 className="font-serif text-3xl text-[var(--ink)]">Natale Pace</h3>
              </div>

              <div className="space-y-2 sm:col-span-2 pt-6 border-t border-[var(--paper-border)]">
                <span className="ui-label text-[var(--ink-light)] uppercase block">Direttori di Collana / Editor</span>
                <p className="font-serif text-2xl text-[var(--ink)]">Prof. Saverio Verduci, Dott.ssa Amalia Papasidero</p>
              </div>

              <div className="space-y-2 sm:col-span-2 pt-6 border-t border-[var(--paper-border)]">
                <span className="ui-label text-[var(--ink-light)] uppercase block">Grafici e Tecnici</span>
                <p className="font-serif text-2xl text-[var(--ink)]">Oreste Kessel Pace, Mena Nada</p>
              </div>

              <div className="space-y-2 sm:col-span-2 pt-6 border-t border-[var(--paper-border)]">
                <span className="ui-label text-[var(--ink-light)] uppercase block">Correzione Bozze & Supervisione</span>
                <p className="font-serif text-2xl text-[var(--ink)]">Prof. Nicodemo Misiti, Dott.ssa Amalia Papasidero, Natale Pace</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 5. L'ICONOGRAFIA (Il Marchio) ────────────────────────────── */}
      <section className="px-6 md:px-12 lg:px-24 py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-4">
            <h2 className="mono-sm text-[var(--ink-light)] lg:sticky lg:top-32">
              Il Marchio
            </h2>
          </div>
          
          <div className="lg:col-span-8 space-y-8 prose-lg">
            <h3 className="font-serif text-4xl text-[var(--ink)] mb-6">L&apos;Iconografia del Logo</h3>
            <p>
              Il sigillo visivo di Pace Edizioni è stato elaborato dal fotografo e grafico <span className="font-medium text-[var(--ink)]">Roberto Pace</span>. Al centro esatto della geometria si colloca la ruota dentata, attributo iconografico di <span className="font-medium text-[var(--ink)]">Santa Caterina d&apos;Alessandria</span>.
            </p>
            <p>
              Santa Caterina è, nel perimetro artistico e letterario, l&apos;archetipo della sapienza e dell&apos;intelletto. Viene tradizionalmente raffigurata con un tomo aperto — simbolo indiscusso di conoscenza — a protezione del rigore editoriale e della ricerca accademica.
            </p>
            <p>
              La ruota, antico strumento storico del martirio, si converte nell&apos;identità visiva della casa editrice in un simbolo polivalente: rappresenta la spinta cinetica, il movimento delle idee e la propensione ad affrontare con incisività i flussi del mercato contemporaneo.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. FOOTER NAVIGAZIONALE ────────────────────────────────────── */}
      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mt-16 pt-16 border-t border-[var(--paper-border)] flex justify-between items-center">
        <Link href="/" className="mono-sm text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors">
          ← Home
        </Link>
        <Link href="/libri" className="mono-sm text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors">
          Esplora il Catalogo →
        </Link>
      </section>

    </main>
  );
}