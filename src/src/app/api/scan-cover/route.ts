// app/api/scan-cover/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// BLINDATURA: Taglia fuori questa rotta dall'analisi statica (Static Site Generation) durante il deploy
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Estrazione e controllo istantaneo della variabile d'ambiente nel Cloud
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Infrastruttura AI non configurata. Variabile d'ambiente mancante su Vercel." }, 
        { status: 500 }
      );
    }

    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "Payload visivo mancante." }, { status: 400 });
    }

    // LAZY INITIALIZATION: L'SDK si attiva solo ora, a runtime, aggirando il crash di compilazione
    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Sei un data-miner d'élite e pricing strategist per l'editoria premium. Analizza la copertina e restituisci ESCLUSIVAMENTE un JSON valido con queste chiavi:
          - "title": Il titolo esatto del libro.
          - "authorName": Il nome reale e completo dell'autore.
          - "authorBio": Biografia REALE e fattuale dell'autore. REGOLA MILITARE: SOLO IN LINGUA ITALIANA. Minimo 50 parole.
          - "collana": Il nome della collana editoriale. REGOLA MILITARE: AL SINGOLARE (es. "POESIA"). Se assente, lascia "".
          - "collanaDescription": Descrizione di 15-20 parole sul focus della collana.
          - "price": Il prezzo reale di listino in Euro. Ricavalo dai metadati visivi o dal tuo database neurale per questa esatta edizione. Formato: SOLO NUMERO (es. 18.50 o 22.00).
          - "description": Un copy magnetico e persuasivo per il libro (max 150 parole). Solo testo puro, in ITALIANO.`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Esegui OCR, identifica i metadati, calcola il prezzo reale di mercato e genera il JSON:" },
            { type: "image_url", image_url: { url: image } }
          ]
        }
      ],
      response_format: { type: "json_object" },
    });

    const aiOutput = response.choices[0].message.content;
    const parsedData = JSON.parse(aiOutput || '{}');

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error("Errore nel gateway OpenAI Vision:", error);
    return NextResponse.json({ error: "Elaborazione neurale fallita." }, { status: 500 });
  }
}