// app/api/ai-generate/route.ts
import { NextResponse } from 'next/server';

// Utilizziamo le API standard. Dovrai inserire la tua OPENAI_API_KEY nel file .env.local
export async function POST(req: Request) {
  try {
    const { type, name, title, collana } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'Chiave API OpenAI mancante nel server.' }, { status: 500 });
    }

    let prompt = '';

    if (type === 'author') {
      prompt = `Agisci come un critico letterario e curatore editoriale. Scrivi una nota biografica formale, elegante e persuasiva per lo scrittore "${name}". Dato che le informazioni pubbliche potrebbero essere limitate, mantieni il testo su un tono professionale, evidenziando la sua dedizione alla scrittura, la sua poetica e il suo contributo alla letteratura contemporanea. Stile: giornalismo letterario di alto livello. Lunghezza: max 150 parole.`;
    } else if (type === 'book') {
      prompt = `Agisci come un copywriter editoriale esperto. Scrivi una sinossi persuasiva (quarta di copertina) per il libro intitolato "${title}" scritto da "${name}", pubblicato nella collana "${collana}". Crea un testo magnetico che catturi il lettore. Inizia con un hook potente. Non rivelare finali, ma crea mistero e interesse attorno ai temi trattati nella collana indicata. Stile: misterioso, colto, incalzante. Lunghezza: max 200 parole.`;
    } else {
      return NextResponse.json({ error: 'Tipo di generazione non valido.' }, { status: 400 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // O gpt-4-turbo / gpt-3.5-turbo per risparmiare costi
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    return NextResponse.json({ text: generatedText });

  } catch (error) {
    console.error('Errore Motore IA:', error);
    return NextResponse.json({ error: 'Errore interno del server IA.' }, { status: 500 });
  }
}