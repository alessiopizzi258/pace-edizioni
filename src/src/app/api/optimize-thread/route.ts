// app/api/optimize-thread/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// DIRETTIVA ASSOLUTA: Esclude questa rotta dall'analisi statica in fase di build
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Contenuto mancante" }, { status: 400 });
    }

    // Estrarre la variabile all'interno dell'esecuzione della richiesta
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Infrastruttura di IA non configurata. Chiave d'ambiente mancante." }, 
        { status: 500 }
      );
    }

    // LAZY INITIALIZATION: L'istanza si attiva solo su chiamata dell'utente
    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Sei un Senior Editor e SEO Specialist per una casa editrice premium.
          Un utente ha proposto una discussione per la community. Il tuo compito è:
          1. "title": Riscrivere il titolo originale rendendolo magnetico, autorevole e ottimizzato per le query di ricerca (Long-tail keyword, max 65 caratteri).
          2. "slug": Generare l'URL SEO-friendly dal nuovo titolo.
          3. "content": Correggere errori grammaticali, di sintassi o di formattazione nel corpo del testo, mantenendo intatto il significato originale e il pensiero dell'utente.
          Restituisci ESCLUSIVAMENTE un JSON valido con queste tre chiavi.`
        },
        { role: "user", content: `Titolo originale: ${title}\nContenuto originale: ${content}` }
      ],
      response_format: { type: "json_object" },
    });

    const data = JSON.parse(response.choices[0].message.content || '{}');
    return NextResponse.json(data);
  } catch (error) {
    console.error("Errore nel gateway OpenAI:", error);
    return NextResponse.json({ error: "Errore neurale durante l'ottimizzazione" }, { status: 500 });
  }
}