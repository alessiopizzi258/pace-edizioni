// app/admin/migration/page.tsx
'use client';

import { useState } from 'react';
import { createAuthor, createCollana, createBook, getAuthors } from '@/lib/api';

// Il Dump Dati Normalizzato
const DB_DUMP = {
  collane: [
    { name: "Grandi Autori Calabresi", slug: "grandi-autori-calabresi" },
    { name: "Grandi Poeti Internazionali: Dante Maffia", slug: "grandi-poeti-internazionali" },
    { name: "Poesia: Lorenzo Calogero", slug: "poesia-lorenzo-calogero" },
    { name: "Musica: Francesco Cilea", slug: "musica-francesco-cilea" },
    { name: "Narrativa", slug: "narrativa" },
    { name: "Ragazzi", slug: "ragazzi" },
    { name: "Rhegium Julii", slug: "rhegium-julii" },
    { name: "Saggistica", slug: "saggistica" },
    { name: "Leucopetra: Studi Storici Calabresi", slug: "leucopetra-studi-storici" },
    { name: "Vernacolo", slug: "vernacolo" },
    { name: "La Scrittura", slug: "la-scrittura" },
    { name: "Teatro e Sceneggiature", slug: "teatro-e-sceneggiature" }
  ],
  autori: [
    { name: "Rocco Militano", slug: "rocco-militano" }, { name: "Gianni Mazzei", slug: "gianni-mazzei" },
    { name: "Rodolfo Chirico", slug: "rodolfo-chirico" }, { name: "Leonida Repaci", slug: "leonida-repaci" },
    { name: "Domenico Zappone", slug: "domenico-zappone" }, { name: "Jeton Kelmendi", slug: "jeton-kelmendi" },
    { name: "Dante Maffia", slug: "dante-maffia" }, { name: "Engjëll I. Berisha", slug: "engjell-i-berisha" },
    { name: "German Droogenbroodt", slug: "german-droogenbroodt" }, { name: "Tru'o'ng văn dân", slug: "truong-van-dan" },
    { name: "Giuseppe Gervasi", slug: "giuseppe-gervasi" }, { name: "Claudio Romano", slug: "claudio-romano" },
    { name: "Bruno Magno", slug: "bruno-magno" }, { name: "Caterina Landro", slug: "caterina-landro" },
    { name: "Marco Onofrio", slug: "marco-onofrio" }, { name: "Vincenza Armino", slug: "vincenza-armino" },
    { name: "Giuseppe Calabrese", slug: "giuseppe-calabrese" }, { name: "Pietro Sorrentino", slug: "piietro-sorrentino" },
    { name: "Natale Pace", slug: "natale-pace" }, { name: "Maurizio Martena", slug: "maurizio-martena" },
    { name: "Irene Carlevale", slug: "irene-carlevale" }, { name: "Gianfranco Italo Tricolore", slug: "gianfranco-italo-tricolore" },
    { name: "Rosamaria Scordo", slug: "rosamaria-scordo" }, { name: "Lidia Popa", slug: "lidia-popa" },
    { name: "AA.VV.", slug: "aa-vv" }, { name: "Antonino Franco", slug: "antonino-franco" },
    { name: "Ylenia Ranuccio", slug: "ylenia-ranuccio" }, { name: "Sandro Le Grazie", slug: "sandro-le-grazie" },
    { name: "Giuseppe Stranieri", slug: "giuseppe-stranieri" }, { name: "Massimo De Leo", slug: "massimo-de-leo" },
    { name: "Barbara Pasqua", slug: "barbara-pasqua" }, { name: "Beatrice Zoccali", slug: "beatrice-zoccali" },
    { name: "Davide Summaria", slug: "davide-summaria" }, { name: "Francesco Ravenda", slug: "francesco-ravenda" },
    { name: "Massimo Scarpa", slug: "massimo-scarpa" }, { name: "Pino Vitaliano", slug: "pino-vitaliano" },
    { name: "Antonino Tramontana", slug: "antonino-tramontana" }, { name: "Francesca Scudiero", slug: "francesca-scudiero" },
    { name: "Matteo De Palma", slug: "matteo-de-palma" }, { name: "Ana Maria Papa", slug: "ana-maria-papa" },
    { name: "Francesco Presta", slug: "francesco-presta" }, { name: "Ulderico Nisticò", slug: "ulderico-nistico" },
    { name: "Rocco Petitto", slug: "rocco-petitto" }, { name: "Angela Crea", slug: "angela-crea" },
    { name: "Guido Musco", slug: "guido-musco" }, { name: "Teresa Catone", slug: "teresa-catone" },
    { name: "Antonella Sanso", slug: "antonella-sanso" }, { name: "Annunziata Cilona", slug: "annunziata-cilona" },
    { name: "Endrio Gigliotti", slug: "endrio-gigliotti" }, { name: "Rodolfo Alessandro Neri", slug: "rodolfo-alessandro-neri" },
    { name: "Carlo Monteleone", slug: "carlo-monteleone" }, { name: "Antonino Falcomatà", slug: "antonino-falcomata" },
    { name: "Nino Mallamaci", slug: "nino-mallamaci" }, { name: "Francesco Fazio", slug: "francesco-fazio" },
    { name: "Roberta Calabrese", slug: "roberta-calabrese" }, { name: "Benedetto Minuto", slug: "benedetto-minuto" },
    { name: "Barbara Cutrupi", slug: "barbara-cutrupi" }, { name: "Letizia Bonvicino", slug: "letizia-bonvicino" },
    { name: "Corrado Calabrò", slug: "corrado-calabro" }, { name: "Benedetta Borrata", slug: "benedetta-borrata" },
    { name: "Liceo Scientifico L. Da Vinci", slug: "liceo-scientifico-l-da-vinci" }, { name: "Gianfranco Cordì", slug: "gianfranco-cordi" },
    { name: "Mariano Giordano", slug: "mariano-giordano" }, { name: "Luigi G. Felicetti", slug: "luigi-g-felicetti" },
    { name: "Rosa Perrone", slug: "rosa-perrone" }, { name: "Pasquale Giordano e Alessandro Panetta", slug: "pasquale-giordano-alessandro-panetta" },
    { name: "Saverio Verduci", slug: "saverio-verduci" }, { name: "Lino Licari", slug: "lino-licari" },
    { name: "Domenico Mazzù", slug: "domenico-mazzu" }, { name: "Riccardo Guerrieri", slug: "riccardo-guerrieri" },
    { name: "Rosamaria Puzzanghera", slug: "rosamaria-puzzanghera" }, { name: "Mimmo Bagalà", slug: "mimmo-bagala" },
    { name: "I.C. M. Macrì di Bianco", slug: "ic-m-macri-bianco" }, { name: "Daniele Tommaso Mellace", slug: "daniele-tommaso-mellace" },
    { name: "Pasquale Rudi", slug: "pasquale-rudi" }, { name: "Maurizio Traversari", slug: "maurizio-traversari" },
    { name: "Pasquale Sucace", slug: "pasquale-sucace" }, { name: "Giovanni Musolino", slug: "giovanni-musolino" },
    { name: "Ettore Gallelli", slug: "ettore-gallelli" }, { name: "Romolo Piscioneri", slug: "romolo-piscioneri" },
    { name: "Giuseppe Tripodi", slug: "giuseppe-tripodi" }, { name: "Mario Bagalà", slug: "mario-bagala" },
    { name: "Franco Lucido", slug: "franco-lucido" }, { name: "Adriana Giotti", slug: "adriana-giotti" },
    { name: "Giovanni Parrello", slug: "giovanni-parrello" }
  ],
  libri: [
    { title: "Leonida Repaci", author: "Rocco Militano", collana: "Grandi Autori Calabresi", slug: "leonida-repaci-rocco-militano" },
    { title: "Domenico Zappone", author: "Gianni Mazzei", collana: "Grandi Autori Calabresi", slug: "domenico-zappone-gianni-mazzei" },
    { title: "Lorenzo Calogero", author: "Rodolfo Chirico", collana: "Grandi Autori Calabresi", slug: "lorenzo-calogero-rodolfo-chirico" },
    { title: "Poesia aperta", author: "Leonida Repaci", collana: "Grandi Autori Calabresi", slug: "poesia-aperta" },
    { title: "Le cinque fiale", author: "Domenico Zappone", collana: "Grandi Autori Calabresi", slug: "le-cinque-fiale" },
    { title: "La Pietrosa racconta", author: "Leonida Repaci", collana: "Grandi Autori Calabresi", slug: "la-pietrosa-racconta" },
    { title: "Quando dormono i risvegli", author: "Jeton Kelmendi", collana: "Grandi Poeti Internazionali: Dante Maffia", slug: "quando-dormono-i-risvegli" },
    { title: "Pane e olio", author: "Dante Maffia", collana: "Grandi Poeti Internazionali: Dante Maffia", slug: "pane-e-olio" },
    { title: "Età dei fiori", author: "Engjëll I. Berisha", collana: "Grandi Poeti Internazionali: Dante Maffia", slug: "eta-dei-fiori" },
    { title: "Il cammino dell'Essere", author: "German Droogenbroodt", collana: "Grandi Poeti Internazionali: Dante Maffia", slug: "il-cammino-dell-essere" },
    { title: "Canzoniere del XXI° secolo", author: "Tru'o'ng văn dân", collana: "Grandi Poeti Internazionali: Dante Maffia", slug: "canzoniere-del-xxi-secolo" },
    { title: "Che non sia l'ultimo", author: "Giuseppe Gervasi", collana: "Poesia: Lorenzo Calogero", slug: "che-non-sia-l-ultimo" },
    { title: "Ulisse, io, l'interprete dell'abisso", author: "Gianni Mazzei", collana: "Poesia: Lorenzo Calogero", slug: "ulisse-io-l-interprete-dell-abisso" },
    { title: "Sentiero di luce", author: "Claudio Romano", collana: "Poesia: Lorenzo Calogero", slug: "sentiero-di-luce" },
    { title: "Primula", author: "Bruno Magno", collana: "Poesia: Lorenzo Calogero", slug: "primula" },
    { title: "Cercatrice di albe", author: "Caterina Landro", collana: "Poesia: Lorenzo Calogero", slug: "cercatrice-di-albe" },
    { title: "L'ingegnere del silenzio", author: "Marco Onofrio", collana: "Poesia: Lorenzo Calogero", slug: "l-ingegnere-del-silenzio" },
    { title: "Gigli di mare", author: "Vincenza Armino", collana: "Poesia: Lorenzo Calogero", slug: "gigli-di-mare" },
    { title: "La vita sospesa", author: "Giuseppe Calabrese", collana: "Poesia: Lorenzo Calogero", slug: "la-vita-sospesa" },
    { title: "Canzoniere d'amore", author: "Gianni Mazzei", collana: "Poesia: Lorenzo Calogero", slug: "canzoniere-d-amore" },
    { title: "Canto la vita, nonostante tutto", author: "Gianni Mazzei", collana: "Poesia: Lorenzo Calogero", slug: "canto-la-vita-nonostante-tutto" },
    { title: "I sogni aiutano a volare", author: "Pietro Sorrentino", collana: "Poesia: Lorenzo Calogero", slug: "i-sogni-aiutano-a-volare" },
    { title: "Domenica in Albis", author: "Gianni Mazzei", collana: "Poesia: Lorenzo Calogero", slug: "domenica-in-albis" },
    { title: "Battiti", author: "Vincenza Armino", collana: "Poesia: Lorenzo Calogero", slug: "battiti" },
    { title: "Vento di luna", author: "Natale Pace", collana: "Poesia: Lorenzo Calogero", slug: "vento-di-luna" },
    { title: "Versi di vita", author: "Maurizio Martena", collana: "Poesia: Lorenzo Calogero", slug: "versi-di-vita" },
    { title: "Magnolia", author: "Bruno Magno", collana: "Poesia: Lorenzo Calogero", slug: "magnolia" },
    { title: "Canzoniere due", author: "Gianni Mazzei", collana: "Poesia: Lorenzo Calogero", slug: "canzoniere-due" },
    { title: "Fuoco di poesia", author: "Claudio Romano", collana: "Poesia: Lorenzo Calogero", slug: "fuoco-di-poesia" },
    { title: "Si confonde ciò che non si separa mai", author: "Irene Carlevale", collana: "Poesia: Lorenzo Calogero", slug: "si-confonde-cio-che-non-si-separa-mai" },
    { title: "Cuore", author: "Gianfranco Italo Tricolore", collana: "Poesia: Lorenzo Calogero", slug: "cuore" },
    { title: "Tra cielo e mare", author: "Rosamaria Scordo", collana: "Poesia: Lorenzo Calogero", slug: "tra-cielo-e-mare" },
    { title: "Segni silenti", author: "Lidia Popa", collana: "Poesia: Lorenzo Calogero", slug: "segni-silenti" },
    { title: "100 e più poeti per la pace", author: "AA.VV.", collana: "Poesia: Lorenzo Calogero", slug: "100-e-piu-poeti-per-la-pace" },
    { title: "Nell'infinito dei miei sogni", author: "Antonino Franco", collana: "Poesia: Lorenzo Calogero", slug: "nell-infinito-dei-miei-sogni" },
    { title: "Orchidea", author: "Bruno Magno", collana: "Poesia: Lorenzo Calogero", slug: "orchidea" },
    { title: "Luna di mezzanotte", author: "Ylenia Ranuccio", collana: "Poesia: Lorenzo Calogero", slug: "luna-di-mezzanotte" },
    { title: "Germogli", author: "Sandro Le Grazie", collana: "Poesia: Lorenzo Calogero", slug: "germogli" },
    { title: "Assimetrica sei ad ogni altro destino", author: "Gianni Mazzei", collana: "Poesia: Lorenzo Calogero", slug: "assimetrica-sei-ad-ogni-altro-destino" },
    { title: "Quinto rigo", author: "Gianni Mazzei", collana: "Poesia: Lorenzo Calogero", slug: "quinto-rigo" },
    { title: "Pensieri al risveglio", author: "Giuseppe Stranieri", collana: "Poesia: Lorenzo Calogero", slug: "pensieri-al-risveglio" },
    { title: "L'arca di carta", author: "Massimo De Leo", collana: "Poesia: Lorenzo Calogero", slug: "l-arca-di-carta" },
    { title: "Ananke", author: "Barbara Pasqua", collana: "Poesia: Lorenzo Calogero", slug: "ananke" },
    { title: "Il pianismo di Francesco Cilea", author: "Beatrice Zoccali", collana: "Musica: Francesco Cilea", slug: "il-pianismo-di-francesco-cilea" },
    { title: "… Per chitarra", author: "Davide Summaria", collana: "Musica: Francesco Cilea", slug: "per-chitarra" },
    { title: "… Per sax", author: "Davide Summaria", collana: "Musica: Francesco Cilea", slug: "per-sax" },
    { title: "Concerto per vibrafono ed archi", author: "Davide Summaria", collana: "Musica: Francesco Cilea", slug: "concerto-per-vibrafono-ed-archi" },
    { title: "… per Pianoforte", author: "Davide Summaria", collana: "Musica: Francesco Cilea", slug: "per-pianoforte" },
    { title: "… per Accordion", author: "Davide Summaria", collana: "Musica: Francesco Cilea", slug: "per-accordion" },
    { title: "… per Ocarina", author: "Davide Summaria", collana: "Musica: Francesco Cilea", slug: "per-ocarina" },
    { title: "… per Ocarina e Pianoforte", author: "Davide Summaria", collana: "Musica: Francesco Cilea", slug: "per-ocarina-e-pianoforte" },
    { title: "… per Sax - 2", author: "Davide Summaria", collana: "Musica: Francesco Cilea", slug: "per-sax-2" },
    { title: "Dov'è l'origine là è la salvezza", author: "Francesco Ravenda", collana: "Narrativa", slug: "dove-l-origine-la-e-la-salvezza" },
    { title: "I 12 apostoli", author: "Massimo Scarpa", collana: "Narrativa", slug: "i-12-apostoli" },
    { title: "Il paese dei pazzi", author: "Pino Vitaliano", collana: "Narrativa", slug: "il-paese-dei-pazzi" },
    { title: "Retrospettive", author: "Antonino Tramontana", collana: "Narrativa", slug: "retrospettive" },
    { title: "Vieni vestita solo dell'anima", author: "Francesca Scudiero", collana: "Narrativa", slug: "vieni-vestita-solo-dell-anima" },
    { title: "Manicomio", author: "Pino Vitaliano", collana: "Narrativa", slug: "manicomio" },
    { title: "Storia di Ilde", author: "Matteo De Palma", collana: "Narrativa", slug: "storia-di-ilde" },
    { title: "Lasciando tutto alle spalle", author: "Ana Maria Papa", collana: "Narrativa", slug: "lasciando-tutto-alle-spalle" },
    { title: "Solitudine condivisa", author: "Francesco Presta", collana: "Narrativa", slug: "solitudine-condivisa" },
    { title: "Santa Eufemia De Cordoba", author: "Ulderico Nisticò", collana: "Narrativa", slug: "santa-eufemia-de-cordoba" },
    { title: "La storia di Sara", author: "Rocco Petitto", collana: "Narrativa", slug: "la-storia-di-sara" },
    { title: "Il mondo che non c'è", author: "Angela Crea", collana: "Narrativa", slug: "il-mondo-che-non-c-e" },
    { title: "Forse domani", author: "Guido Musco", collana: "Narrativa", slug: "forse-domani" },
    { title: "Gli uomini di MAG", author: "Teresa Catone", collana: "Narrativa", slug: "gli-uomini-di-mag" },
    { title: "Le sbarre di cristallo", author: "Antonella Sanso", collana: "Narrativa", slug: "le-sbarre-di-cristallo" },
    { title: "Cicatrici dell'anima", author: "Annunziata Cilona", collana: "Narrativa", slug: "cicatrici-dell-anima" },
    { title: "In Exitu Israel e Io, Giulio", author: "Gianni Mazzei", collana: "Narrativa", slug: "in-exitu-israel-e-io-giulio" },
    { title: "Manipolatrici seduttive", author: "Endrio Gigliotti", collana: "Narrativa", slug: "manipolatrici-seduttive" },
    { title: "L'amico fragile", author: "Francesco Presta", collana: "Narrativa", slug: "l-amico-fragile" },
    { title: "La tennista", author: "Rodolfo Alessandro Neri", collana: "Narrativa", slug: "la-tennista" },
    { title: "Magazzino 18", author: "Carlo Monteleone", collana: "Narrativa", slug: "magazzino-18" },
    { title: "I racconti della cordigliera reggina", author: "Antonino Falcomatà", collana: "Narrativa", slug: "i-racconti-della-cordigliera-reggina" },
    { title: "Racconti", author: "Nino Mallamaci", collana: "Narrativa", slug: "racconti-nino-mallamaci" },
    { title: "Donne, sentimenti, pandemia", author: "Teresa Catone", collana: "Narrativa", slug: "donne-sentimenti-pandemia" },
    { title: "Racconti Villapianesi", author: "Gianni Mazzei", collana: "Narrativa", slug: "racconti-villapianesi" },
    { title: "La tigre e il re", author: "Francesco Fazio", collana: "Narrativa", slug: "la-tigre-e-il-re" },
    { title: "Omicidio a La Grande Poele", author: "Roberta Calabrese", collana: "Narrativa", slug: "omicidio-a-la-grande-poele" },
    { title: "Le sentinelle di Alarico", author: "Rocco Petitto", collana: "Narrativa", slug: "le-sentinelle-di-alarico" },
    { title: "Le stelle di Lorenzo", author: "Carlo Monteleone", collana: "Narrativa", slug: "le-stelle-di-lorenzo" },
    { title: "La Concordia: tredici anni per raggiungere la riva", author: "Benedetto Minuto", collana: "Narrativa", slug: "la-concordia" },
    { title: "I ricordi di un Ulisside", author: "Pino Vitaliano", collana: "Narrativa", slug: "i-ricordi-di-un-ulisside" },
    { title: "Scilla e Cariddi", author: "Barbara Cutrupi", collana: "Ragazzi", slug: "scilla-e-cariddi" },
    { title: "Le dodici nazioni", author: "Letizia Bonvicino", collana: "Ragazzi", slug: "le-dodici-nazioni" },
    { title: "La figlia della guerra", author: "Letizia Bonvicino", collana: "Ragazzi", slug: "la-figlia-della-guerra" },
    { title: "Manca qualcosa", author: "Corrado Calabrò", collana: "Rhegium Julii", slug: "manca-qualcosa" },
    { title: "Le più belle poesie d'amore di tutti i tempi vol. I", author: "Dante Maffia", collana: "Rhegium Julii", slug: "poesie-amore-vol-1" },
    { title: "Le più belle poesie d'amore di tutti i tempi vol. II", author: "Dante Maffia", collana: "Rhegium Julii", slug: "poesie-amore-vol-2" },
    { title: "Le più belle poesie d'amore di tutti i tempi vol. III", author: "Dante Maffia", collana: "Rhegium Julii", slug: "poesie-amore-vol-3" },
    { title: "Le più belle poesie d'amore di tutti i tempi vol. IV", author: "Dante Maffia", collana: "Rhegium Julii", slug: "poesie-amore-vol-4" },
    { title: "Non è pareggio da picciola barca: curiosando nell'officina di Natale Pace", author: "Benedetta Borrata", collana: "Rhegium Julii", slug: "non-e-pareggio-da-picciola-barca" },
    { title: "Emilio Argiroffi", author: "Liceo Scientifico L. Da Vinci", collana: "Rhegium Julii", slug: "emilio-argiroffi" },
    { title: "Fortunato Semina", author: "Liceo Scientifico L. Da Vinci", collana: "Rhegium Julii", slug: "fortunato-semina" },
    { title: "Gilda Trisolini", author: "Liceo Scientifico L. Da Vinci", collana: "Rhegium Julii", slug: "gilda-trisolini" },
    { title: "Il diniego", author: "Gianfranco Cordì", collana: "Saggistica", slug: "il-diniego" },
    { title: "Che cos'è l'amore", author: "Dante Maffia", collana: "Saggistica", slug: "che-cos-e-l-amore" },
    { title: "Ljubimaya Moja – Amata mia: Le donne di Gramsci", author: "Natale Pace", collana: "Saggistica", slug: "ljubimaya-moja-amata-mia" },
    { title: "Pesca e non solo", author: "Mariano Giordano", collana: "Saggistica", slug: "pesca-e-non-solo" },
    { title: "Storia di un socialista ottuagenario", author: "Dante Maffia", collana: "Saggistica", slug: "storia-di-un-socialista-ottuagenario" },
    { title: "La reiterazione proficua: Sabino Caronia", author: "Dante Maffia", collana: "Saggistica", slug: "la-reiterazione-proficua" },
    { title: "Intervista a Dante Maffia", author: "Gianni Mazzei", collana: "Saggistica", slug: "intervista-a-dante-maffia" },
    { title: "Che cos'è la poesia", author: "Dante Maffia", collana: "Saggistica", slug: "che-cos-e-la-poesia" },
    { title: "Radicamento ideologico del sistema clientelare", author: "Luigi G. Felicetti", collana: "Saggistica", slug: "radicamento-ideologico" },
    { title: "Crederci", author: "Gianni Mazzei", collana: "Saggistica", slug: "crederci" },
    { title: "Oltre le montagne, il cielo.", author: "Rosa Perrone", collana: "Saggistica", slug: "oltre-le-montagne-il-cielo" },
    { title: "Occhi giovani su una questione antica", author: "Pasquale Giordano e Alessandro Panetta", collana: "Saggistica", slug: "occhi-giovani-su-una-questione-antica" },
    { title: "Profilo Storico dei Beni Culturali del Comune di Motta San Giovanni", author: "Saverio Verduci", collana: "Leucopetra: Studi Storici Calabresi", slug: "profilo-storico-beni-culturali-motta-san-giovanni" },
    { title: "Leucopetra", author: "Saverio Verduci", collana: "Leucopetra: Studi Storici Calabresi", slug: "leucopetra" },
    { title: "Medma", author: "Lino Licari", collana: "Leucopetra: Studi Storici Calabresi", slug: "medma" },
    { title: "Un mare di storie: Gallico Marina", author: "Domenico Mazzù", collana: "Leucopetra: Studi Storici Calabresi", slug: "un-mare-di-storie" },
    { title: "Antonio Pitaro, un medico calabrese", author: "Riccardo Guerrieri", collana: "Leucopetra: Studi Storici Calabresi", slug: "antonio-pitaro-medico-calabrese" },
    { title: "Conversazione con Giuseppe Ginestra", author: "Rosamaria Puzzanghera", collana: "Leucopetra: Studi Storici Calabresi", slug: "conversazione-con-giuseppe-ginestra" },
    { title: "Tauro", author: "Mimmo Bagalà", collana: "Leucopetra: Studi Storici Calabresi", slug: "tauro" },
    { title: "L'architettura poetica di Saverio Strati", author: "Benedetta Borrata", collana: "Leucopetra: Studi Storici Calabresi", slug: "l-architettura-poetica-di-saverio-strati" },
    { title: "Il dialetto della Vallata La Verde", author: "I.C. M. Macrì di Bianco", collana: "Leucopetra: Studi Storici Calabresi", slug: "il-dialetto-della-vallata-la-verde" },
    { title: "Una città di minatori: la storia dei minatori di Motta San Giovanni", author: "Saverio Verduci", collana: "Leucopetra: Studi Storici Calabresi", slug: "una-citta-di-minatori" },
    { title: "I Mellace di Olivadi", author: "Daniele Tommaso Mellace", collana: "Leucopetra: Studi Storici Calabresi", slug: "i-mellace-di-olivadi" },
    { title: "Per una storia della Medicina in Calabria", author: "Ulderico Nisticò", collana: "Leucopetra: Studi Storici Calabresi", slug: "storia-medicina-calabria" },
    { title: "I riti della Settimana Santa a Badolato Superiore", author: "Pasquale Rudi", collana: "Leucopetra: Studi Storici Calabresi", slug: "riti-settimana-santa-badolato" },
    { title: "L'ultimo dei Mohicani: Mario Brunetti", author: "Gianni Mazzei", collana: "Leucopetra: Studi Storici Calabresi", slug: "l-ultimo-dei-mohicani-mario-brunetti" },
    { title: "Pitaro Antonio", author: "Riccardo Guerrieri", collana: "Leucopetra: Studi Storici Calabresi", slug: "pitaro-antonio" },
    { title: "Abbazia Calybita", author: "Maurizio Traversari", collana: "Leucopetra: Studi Storici Calabresi", slug: "abbazia-calybita" },
    { title: "Francesco Carbone, sindaco di Palmi", author: "Pasquale Sucace", collana: "Leucopetra: Studi Storici Calabresi", slug: "francesco-carbone-sindaco-palmi" },
    { title: "Reggio, una città che cambia", author: "Giovanni Musolino", collana: "Leucopetra: Studi Storici Calabresi", slug: "reggio-una-citta-che-cambia" },
    { title: "Elenco Ufficiale della Nobiltà Calabrese", author: "Ettore Gallelli", collana: "Leucopetra: Studi Storici Calabresi", slug: "elenco-ufficiale-nobilta-calabrese" },
    { title: "Tracce", author: "Romolo Piscioneri", collana: "Leucopetra: Studi Storici Calabresi", slug: "tracce" },
    { title: "Il ciarlatano e la bella", author: "Giuseppe Tripodi", collana: "Leucopetra: Studi Storici Calabresi", slug: "il-ciarlatano-e-la-bella" },
    { title: "C'era una volta un paese", author: "Pino Vitaliano", collana: "Leucopetra: Studi Storici Calabresi", slug: "c-era-una-volta-un-paese" },
    { title: "Predicati Nobiliari e Repubblica Italiana", author: "Ettore Gallelli", collana: "Leucopetra: Studi Storici Calabresi", slug: "predicati-nobiliari-repubblica-italiana" },
    { title: "Due vite: Leonida Repaci e Antonio Gramsci", author: "Natale Pace", collana: "Leucopetra: Studi Storici Calabresi", slug: "due-vite-reapaci-gramsci" },
    { title: "Motta San Giovanni. Feudo e successioni feudali tra XV e XIX secolo.", author: "Saverio Verduci", collana: "Leucopetra: Studi Storici Calabresi", slug: "motta-san-giovanni-feudo-e-successioni" },
    { title: "Ferrari Zumbini", author: "Ettore Gallelli", collana: "Leucopetra: Studi Storici Calabresi", slug: "ferrari-zumbini" },
    { title: "Chiedi chi erano i Fagiani", author: "Pino Vitaliano", collana: "Leucopetra: Studi Storici Calabresi", slug: "chiedi-chi-erano-i-fagiani" },
    { title: "Biografie di una città: la memoria della storia", author: "Saverio Verduci", collana: "Leucopetra: Studi Storici Calabresi", slug: "biografie-di-una-citta" },
    { title: "‘U Chiantu d’Alaricu", author: "Mario Bagalà", collana: "Vernacolo", slug: "u-chiantu-d-alaricu" },
    { title: "Poesie", author: "Franco Lucido", collana: "Vernacolo", slug: "poesie-franco-lucido" },
    { title: "La mortice del pensiero: I talenti", author: "Adriana Giotti", collana: "La Scrittura", slug: "la-mortice-del-pensiero-i-talenti" },
    { title: "Elettra di Sofocle", author: "Giovanni Parrello", collana: "Teatro e Sceneggiature", slug: "elettra-di-sofocle" }
  ]
};

export default function MigrationPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runMigration = async () => {
    setIsRunning(true);
    setLogs(['Inizializzazione Migrazione...']);

    try {
      // 1. COLLANE
      setLogs(prev => [...prev, 'Scrittura Collane...']);
      for (const c of DB_DUMP.collane) {
        await createCollana({ name: c.name, slug: c.slug, description: '' });
      }

      // 2. AUTORI
      setLogs(prev => [...prev, 'Scrittura Autori...']);
      for (const a of DB_DUMP.autori) {
        await createAuthor({ name: a.name, slug: a.slug, bio: '', photoUrl: '', role: 'author' } as any);
      }

      // Estrazione Mappa Autori Reale
      const liveAuthors = await getAuthors();

      // 3. LIBRI
      setLogs(prev => [...prev, 'Scrittura Libri con Mappatura Relazionale...']);
      for (const b of DB_DUMP.libri) {
        const authorRecord = liveAuthors.find(la => la.name === b.author);
        await createBook({
          title: b.title,
          slug: b.slug,
          collana: b.collana,
          authorId: authorRecord ? authorRecord.id : '',
          price: 19.90,
          description: '',
          amazonUrl: '',
          coverUrl: ''
        });
      }

      setLogs(prev => [...prev, 'MIGRAZIONE COMPLETATA CON SUCCESSO.']);
    } catch (e) {
      setLogs(prev => [...prev, 'ERRORE CRITICO DURANTE LA MIGRAZIONE.']);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-[var(--dark-mid)] text-[var(--paper-bright)] p-12 shadow-2xl">
        <h1 className="font-serif text-4xl mb-6">Pannello di Migrazione Dati</h1>
        <p className="font-sans text-[11px] uppercase tracking-widest text-[var(--ink-light)] mb-12">
          Assicurati di aver svuotato le vecchie collezioni in Firebase Console prima di procedere.
        </p>
        
        <button
          onClick={runMigration}
          disabled={isRunning}
          className="w-full bg-[var(--accent)] text-[var(--paper-bright)] py-5 font-sans text-xs uppercase tracking-[0.3em] hover:bg-[var(--ink)] transition-colors disabled:opacity-50"
        >
          {isRunning ? 'Esecuzione in corso...' : 'ESEGUI MIGRAZIONE'}
        </button>

        {logs.length > 0 && (
          <div className="mt-8 bg-black p-6 font-mono text-[10px] text-green-500 h-64 overflow-y-auto">
            {logs.map((log, i) => <div key={i}>{log}</div>)}
          </div>
        )}
      </div>
    </div>
  );
}