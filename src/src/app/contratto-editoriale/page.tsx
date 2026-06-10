// app/contratto-editoriale/page.tsx
import Link from 'next/link';

export default function ContrattoEditorialePage() {
  const premessaPoints = [
    "La pubblicazione riguarda la poesia, la saggistica, la narrativa e tutte le altre categorie letterarie, comprese forme editoriali come cataloghi, riviste, antologie, libri d'arte, fotografia e musica, ordinate in collane.",
    "Le opere potranno essere inedite o edite, purché libere da altri contratti editoriali.",
    "Non è prevista alcuna richiesta di denaro all'autore, soltanto l'acquisto di una quantità minima di copie quale stimolo a un impegno logistico condiviso con quello della Casa Editrice.",
    "ISBN, QR Code e ASIN gratuiti.",
    "Nessuna limitazione sulla quantità delle copie disponibili sul mercato.",
    "I libri saranno disponibili sul mercato internazionale, acquistabili in ogni parte del mondo sulla piattaforma Amazon, anche con bonus insegnanti, sconti cliente e carte regalo.",
    "All'autore sarà corrisposta una percentuale del prezzo di copertina; è previsto un prezzo autore per l'eventuale acquisto di copie.",
    "Non sono previste copie omaggio all'autore né ad altro soggetto.",
    "Non sono previste copie in deposito o destinate al macero.",
    "L'opera sarà pubblicizzata sul sito internet della Casa Editrice e verrà realizzata una locandina sui principali social e nella mail list.",
    "Pace Edizioni è una casa editrice gratuita e autofinanziata: non è un agente letterario, un operatore culturale né una redazione giornalistica, e non organizza manifestazioni culturali, rassegne stampa o presentazioni di libri."
  ];

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1A1918] selection:bg-[#1A1918] selection:text-[#F4F1EA] pb-32">

      {/* ── 1. HEADER DOCUMENTO ────────────────────────────────────────── */}
      <section className="pt-40 pb-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-b border-[#E2DFD8]">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#8C877D] block mb-8">
          07 — Documentazione Ufficiale
        </span>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-end">
          <div>
            <h1 className="font-playfair text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-[0.85] text-[#1A1918]">
              Contratto<br />Editoriale
            </h1>
          </div>
          <div className="flex flex-col gap-6 max-w-[280px]">
            <p className="font-inter text-[#5C5852] text-sm leading-relaxed">
              La nostra promessa di trasparenza. Nessun costo nascosto, nessuna asimmetria. Solo valore per l'opera e rispetto per l'autore.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. PREMESSA ────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32 max-w-7xl mx-auto border-b border-[#E2DFD8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-4">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8C877D] lg:sticky lg:top-32">
              01. Dichiarazione d'Intenti
            </h2>
          </div>
          
          <div className="lg:col-span-8">
            <p className="font-inter text-[#5C5852] text-lg leading-loose mb-12 text-justify">
              <span className="font-playfair text-[#1A1918] text-2xl">Oreste Kessel Pace</span>, scrittore, docente di tecnica della narrativa e grafico editoriale, mette a disposizione le proprie competenze acquisite nel settore dell'editoria allo scopo di agevolare i colleghi scrittori nella pubblicazione delle opere. Dopo oltre vent'anni di carriera, con più di trenta libri all'attivo tradotti anche all'estero e cinque premi alla carriera e all'impegno culturale, ha fondato la <strong>Pace Edizioni</strong>.
            </p>

            <h3 className="font-playfair text-3xl text-[#1A1918] mb-8">Linee Guida di Pubblicazione</h3>
            
            <ul className="flex flex-col border-t border-[#E2DFD8]">
              {premessaPoints.map((item, index) => (
                <li key={index} className="flex gap-6 md:gap-8 py-6 border-b border-[#E2DFD8]">
                  <span className="font-mono text-[10px] text-[#8C877D] mt-1 shrink-0">
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  <p className="font-inter font-light text-[#5C5852] leading-relaxed text-justify">
                    {item}
                  </p>
                </li>
              ))}
            </ul>

            {/* Clausola Autori */}
            <div className="bg-[#EAE5DA] border border-[#E2DFD8] p-8 md:p-12 mt-16">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#8C877D] block mb-4">
                Clausola di Impegno
              </span>
              <p className="font-inter font-light text-[#1A1918] leading-relaxed text-justify">
                La Casa Editrice si autofinanzia con i proventi sulle percentuali delle vendite dei libri. Non ha altre tipologie di entrate o finanziamenti. Non riceve denaro dagli autori. Affinché possa sopravvivere, è essenziale che i libri siano apprezzati dal lettore e vendano. Per questo motivo è fondamentale che dietro ogni opera ci sia un impegno anche da parte dell'autore: che abbia una progettualità per i suoi libri e sia attivo nel settore culturale. La Casa Editrice non accetta opere che non rispondano a questi requisiti.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. CORPO DEL CONTRATTO ─────────────────────────────────────── */}
      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-4">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8C877D] lg:sticky lg:top-32">
              02. Accordi di Edizione
            </h2>
          </div>
          
          <div className="lg:col-span-8 flex flex-col gap-16">

            {/* Art. 1 */}
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8C877D] block mb-4 border-b border-[#E2DFD8] pb-2">Articolo 01</span>
              <h4 className="font-playfair text-3xl md:text-4xl text-[#1A1918] mb-6">Oggetto del contratto</h4>
              <p className="font-inter font-light text-[#5C5852] leading-loose text-justify">
                L'Autore, agendo per sé, eredi ed aventi causa, cede in esclusiva all'Editore, che accetta, il diritto di pubblicazione e utilizzazione economica a mezzo stampa dell'Opera.
              </p>
            </div>

            {/* Art. 2 */}
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8C877D] block mb-4 border-b border-[#E2DFD8] pb-2">Articolo 02</span>
              <h4 className="font-playfair text-3xl md:text-4xl text-[#1A1918] mb-6">Durata della cessione e tipo di contratto</h4>
              <p className="font-inter font-light text-[#5C5852] leading-loose text-justify mb-4">
                Il presente accordo costituisce contratto di edizione a termine. La cessione dei diritti ha la durata di <strong>3 anni (tre)</strong> decorrenti dalla data della firma. L'Opera sarà disponibile sul mercato internazionale di Amazon; il numero minimo di esemplari stampati su carta sarà proporzionale alle vendite sulla piattaforma, senza forniture in deposito. Le spese di editing, impaginazione, grafica, pubblicazione e stampa sono interamente a carico dell'Editore. Eventuali nuove edizioni saranno concordate tra le parti e sottoposte a nuovo contratto, in ogni caso totalmente gratuite per l'Autore.
              </p>
              <p className="font-inter font-light text-[#5C5852] leading-loose text-justify">
                In caso di estinzione anticipata o scadenza del contratto, l'ISBN e l'ASIN resteranno associati alla pubblicazione, senza disponibilità di copie per l'acquisto.
              </p>
            </div>

            {/* Art. 3 */}
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8C877D] block mb-4 border-b border-[#E2DFD8] pb-2">Articolo 03</span>
              <h4 className="font-playfair text-3xl md:text-4xl text-[#1A1918] mb-6">Utilizzazione dell'Opera in forma diversa</h4>
              <p className="font-inter font-light text-[#5C5852] leading-loose text-justify">
                Qualunque utilizzo dell'Opera o di parti di essa in forma diversa dalla pubblicazione integrale su Amazon — compresi adattamenti cinematografici, ebook e audiolibri — dovrà essere esplicitamente richiesto per iscritto all'Editore, che avrà facoltà di rifiutare o accettare. Per qualunque opera derivata sarà necessario un ulteriore accordo tra Autore ed Editore. Il presente contratto riguarda unicamente l'opera in oggetto.
              </p>
            </div>

            {/* Art. 4 */}
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8C877D] block mb-4 border-b border-[#E2DFD8] pb-2">Articolo 04</span>
              <h4 className="font-playfair text-3xl md:text-4xl text-[#1A1918] mb-6">Pacifico godimento dei diritti</h4>
              <p className="font-inter font-light text-[#5C5852] leading-loose text-justify">
                L'Autore dichiara di essere l'unico autore ed esclusivo proprietario dell'Opera, di averne la piena disponibilità e tutte le facoltà necessarie a stipulare il presente contratto. Dichiara altresì di non aver ceduto ad altri alcuno dei diritti di utilizzazione economica e garantisce, per tutta la durata del contratto, il pacifico possesso e godimento dei diritti ceduti, ivi compreso quello relativo al titolo. Assicura che la pubblicazione non viola diritti di terzi né norme penali, manlevando l'Editore da tutti i danni e le spese che potessero derivargliene. L'Autore si impegna inoltre a collaborare qualora il pacifico godimento dei diritti ceduti venisse turbato da parte di terzi.
              </p>
            </div>

            {/* Art. 5 */}
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8C877D] block mb-4 border-b border-[#E2DFD8] pb-2">Articolo 05</span>
              <h4 className="font-playfair text-3xl md:text-4xl text-[#1A1918] mb-6">Obblighi dell'Autore</h4>
              <p className="font-inter font-light text-[#5C5852] leading-loose text-justify mb-4">
                L'Autore si impegna, per tutta la durata del contratto, a non pubblicare né far pubblicare — né in proprio, né in collaborazione, né in forma anonima o sotto pseudonimo — la medesima opera o altra opera dal contenuto analogo che possa farle concorrenza. L'Autore ha piena facoltà di pubblicare altri testi con altri editori e di trattare temi analoghi ma di contenuto diverso, salvo il patto di non concorrenza con la presente Opera.
              </p>
              <p className="font-inter font-light text-[#5C5852] leading-loose text-justify mb-4">
                La grafica del libro (copertina, dorso, IV di copertina e impaginazione) è considerata opera d'ingegno dell'Editore: tutti gli elementi grafici generati dall'Editore sono di sua proprietà e non riproducibili — fatta eccezione per i singoli elementi (immagini, soggetti e porzioni) il cui copyright rimane al soggetto indicato all'interno della pubblicazione. L'Autore non potrà utilizzarli in alcun modo, durante o dopo la cessazione del contratto, senza accordo con l'Editore.
              </p>
              <p className="font-inter font-medium text-[#1A1918] leading-loose text-justify">
                Come citato in premessa, l'Autore si impegna ad acquistare un numero minimo di copie al prezzo autore concordato tra le parti.
              </p>
            </div>

            {/* Art. 6 */}
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8C877D] block mb-4 border-b border-[#E2DFD8] pb-2">Articolo 06</span>
              <h4 className="font-playfair text-3xl md:text-4xl text-[#1A1918] mb-6">Consegna dell'opera e del materiale</h4>
              <p className="font-inter font-light text-[#5C5852] leading-loose text-justify">
                L'Autore si impegna a consegnare una breve biografia per la IV di copertina e la copia definitiva dell'Opera — corretta nella grammatica e nella tecnica — su supporto digitale, con eventuali file di supporto, tramite posta elettronica secondo le indicazioni e i tempi concordati con l'Editore. Non sono accettati manoscritti, copie cartacee o opere contenenti errori di qualsiasi tipologia.
              </p>
            </div>

            {/* Art. 7 */}
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8C877D] block mb-4 border-b border-[#E2DFD8] pb-2">Articolo 07</span>
              <h4 className="font-playfair text-3xl md:text-4xl text-[#1A1918] mb-6">Forma e termine della pubblicazione</h4>
              <p className="font-inter font-light text-[#5C5852] leading-loose text-justify">
                L'Opera sarà riprodotta in conformità dell'originale e posta in vendita con indicazione del nome dell'Autore, come per legge. Il prezzo di vendita al pubblico è stabilito dall'Editore, che può variarlo a seconda delle esigenze commerciali, dando preventivo avviso all'Autore tramite posta elettronica. L'impaginazione, la copertina, il dorso, la IV di copertina e tutti gli altri dettagli editoriali saranno realizzati dall'Editore in forma totalmente gratuita e in accordo con l'Autore, nel rispetto delle linee editoriali delle collane. Il libro sarà dotato di ISBN, ASIN e QR Code totalmente gratuiti.
              </p>
            </div>

            {/* Art. 8 */}
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8C877D] block mb-4 border-b border-[#E2DFD8] pb-2">Articolo 08</span>
              <h4 className="font-playfair text-3xl md:text-4xl text-[#1A1918] mb-6">Corrispettivo a favore dell'Autore e rendiconti</h4>
              <p className="font-inter font-light text-[#5C5852] leading-loose text-justify mb-4">
                Quale corrispettivo dei diritti ceduti spetterà all'Autore la percentuale del <strong>10% (dieci per cento)</strong> sul prezzo di copertina, al netto d'IVA, di ciascuna copia effettivamente venduta a terzi, a esclusione delle copie eventualmente acquistate dall'Autore di propria iniziativa.
              </p>
              <p className="font-inter font-light text-[#5C5852] leading-loose text-justify mb-4">
                L'Editore darà rendiconto all'Autore nel corso del mese di marzo di ogni anno, con riferimento alle vendite dell'anno solare precedente. Le royalty maturate saranno versate tramite bonifico bancario sulle coordinate fornite dall'Autore, per importi superiori a 20,00 euro (gli importi inferiori saranno sommati fino al raggiungimento della soglia). In alternativa, su richiesta dell'Autore, potranno essere scontate sull'acquisto di copie al prezzo autore.
              </p>
              <p className="font-inter font-light text-[#5C5852] leading-loose text-justify">
                L'Autore potrà acquistare copie dell'opera al prezzo autore per quantità pari o superiori a 20 copie, e a prezzo speciale per ordini pari o superiori a 150 copie (con unico ordine e fattura). Non sono previste copie omaggio, copie per il macero né copie in deposito. Le copie avranno disponibilità illimitata fino al termine del presente contratto, rinnovabile.
              </p>
            </div>

            {/* Art. 9 & 10 (Condensati) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8C877D] block mb-4 border-b border-[#E2DFD8] pb-2">Articolo 09</span>
                <h4 className="font-playfair text-2xl text-[#1A1918] mb-4">Forma delle modifiche</h4>
                <p className="font-inter font-light text-[#5C5852] leading-loose text-justify">
                  Ogni eventuale modifica del contenuto del presente contratto sarà valida e operante solo se effettuata in forma scritta e congiunta tra Autore ed Editore.
                </p>
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8C877D] block mb-4 border-b border-[#E2DFD8] pb-2">Articolo 10</span>
                <h4 className="font-playfair text-2xl text-[#1A1918] mb-4">Autorità giudiziaria</h4>
                <p className="font-inter font-light text-[#5C5852] leading-loose text-justify">
                  Unico competente per ogni eventuale controversia derivante dall'interpretazione, esecuzione e cessazione del presente contratto sarà il <strong>Foro della città di Reggio Calabria</strong>.
                </p>
              </div>
            </div>

            {/* Colophon Legale */}
            <div className="mt-8 pt-8 border-t border-[#1A1918]">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8C877D] leading-loose">
                Documento in vigore: Marzo 2026<br />
                Pace Edizioni — Direzione Editoriale: Oreste Kessel Pace<br />
                Sede legale: Via San Leonardo, 72 – 89015 Palmi (RC)
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. CTA FINALE ──────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 bg-[#1A1918] text-[#F4F1EA] text-center flex flex-col items-center justify-center">
        <h2 className="font-playfair text-4xl md:text-6xl tracking-tighter mb-8">
          Sottoponi la tua Opera
        </h2>
        <p className="font-inter font-light text-[#A69E93] max-w-lg mb-12">
          Le regole d'ingaggio sono chiare. Se il tuo manoscritto possiede il peso specifico richiesto, procedi con la sottoposizione formale.
        </p>
        <Link
          href="/contatti"
          className="inline-flex items-center gap-4 border border-[#F4F1EA] px-8 py-5 font-mono text-[10px] uppercase tracking-[0.3em] hover:bg-[#F4F1EA] hover:text-[#1A1918] transition-all group"
        >
          <span>Accedi al Protocollo di Trasmissione</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </section>

    </main>
  );
}