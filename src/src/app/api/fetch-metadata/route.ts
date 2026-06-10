// app/api/fetch-metadata/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, author } = await req.json();
    
    if (!title) {
      return NextResponse.json({ error: 'Parametri insufficienti' }, { status: 400 });
    }

    let coverUrl = '';
    let amazonUrl = '';
    let isbn = '';

    // Pulizia chirurgica delle stringhe per massimizzare il matching
    const cleanTitle = title.replace(/[^\w\sàèìòùé]/gi, '').trim();
    const cleanAuthor = author ? author.replace(/[^\w\sàèìòùé]/gi, '').trim() : '';
    const searchQuery = encodeURIComponent(`${cleanTitle} ${cleanAuthor}`);

    /* ─── FASE 1: ATTACCO A GOOGLE BOOKS (Fuzzy Search) ─── */
    try {
      // Estraiamo i primi 3 risultati per aumentare le probabilità di trovare una copertina
      const gbRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&maxResults=3`);
      const gbData = await gbRes.json();

      if (gbData.items && gbData.items.length > 0) {
        for (const item of gbData.items) {
          const vi = item.volumeInfo;
          
          // Sequisizione Copertina (Forziamo rimozione bordi e aumento risoluzione)
          if (!coverUrl && vi.imageLinks?.thumbnail) {
            coverUrl = vi.imageLinks.thumbnail
              .replace('http:', 'https:')
              .replace('&edge=curl', '')
              .replace('zoom=1', 'zoom=3'); // Tenta l'estrazione ad alta risoluzione
          }
          
          // Acquisizione ISBN per tracciamento commerciale
          if (!isbn && vi.industryIdentifiers) {
            const isbnObj = vi.industryIdentifiers.find((id: any) => id.type === 'ISBN_13' || id.type === 'ISBN_10');
            if (isbnObj) isbn = isbnObj.identifier;
          }

          if (coverUrl && isbn) break; // Uscita anticipata se abbiamo tutto
        }
      }
    } catch (e) {
      console.warn("Radar Google Books disconnesso o fallito.");
    }

    /* ─── FASE 2: PROTOCOLLO DI FALLBACK SU OPENLIBRARY ─── */
    if (!coverUrl) {
      try {
        const olRes = await fetch(`https://openlibrary.org/search.json?q=${searchQuery}`);
        const olData = await olRes.json();
        
        if (olData.docs && olData.docs.length > 0) {
          // Cerca il primo documento che possiede l'ID di una copertina
          const doc = olData.docs.find((d: any) => d.cover_i);
          if (doc) {
            // Estrazione immagine formato Large (-L)
            coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
          }
        }
      } catch (e) {
        console.warn("Radar OpenLibrary disconnesso o fallito.");
      }
    }

    /* ─── FASE 3: INGEGNERIZZAZIONE DEL LINK AMAZON ─── */
    if (isbn) {
      // Direct Link tramite ASIN/ISBN
      amazonUrl = `https://www.amazon.it/dp/${isbn}`;
    } else {
      // Safe Search Link: Vincola la query di Amazon ESCLUSIVAMENTE al reparto Libri (i=stripbooks)
      amazonUrl = `https://www.amazon.it/s?i=stripbooks&k=${encodeURIComponent(`${cleanTitle} ${cleanAuthor}`)}`;
    }

    return NextResponse.json({ coverUrl, amazonUrl });
    
  } catch (error) {
    console.error('Errore Scraping Rete:', error);
    return NextResponse.json({ error: 'Errore di connessione ai database globali.' }, { status: 500 });
  }
}