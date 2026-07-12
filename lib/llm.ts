import OpenAI from "openai";
import { type QuizAnswers } from "@/data/quizData";

export async function generateLyrics(answers: QuizAnswers): Promise<{ title: string; lyrics: string }> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not defined in .env.local");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
Tu es un auteur-compositeur professionnel.
Écris une chanson avec le style musical suivant : ${answers.genre}.
La chanson est destinée à : ${answers.recipientName}.
Langue demandée pour la chanson : ${answers.songLanguage}.

Histoire et souvenirs importants à inclure :
- Qualités : ${answers.beautifulQualities}
- Souvenirs : ${answers.specialMoments}
- Message du cœur : ${answers.specialMessage}

Consignes strictes :
1. Respecte la langue demandée (${answers.songLanguage}). Si c'est de la Darija, écris en transcription phonétique compréhensible (arabe dialectal en lettres latines ou arabes, selon ce qui est le plus approprié pour le chant).
2. Ne mets PAS de guillemets autour des paroles.
3. Utilise la structure standard Suno : [Verse 1], [Chorus], [Verse 2], [Chorus], [Outro].
4. La chanson doit durer environ 1 à 2 minutes en chant (pas trop longue).
5. Retourne ta réponse sous format JSON strict avec deux clés : "title" (le titre de la chanson) et "lyrics" (les paroles complètes).
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // ou gpt-4o
      messages: [
        {
          role: "system",
          content: "Tu es une IA experte en écriture de paroles pour la plateforme Suno. Tu dois toujours retourner du JSON valide.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const parsed = JSON.parse(content);
    return {
      title: parsed.title || "Chanson personnalisée",
      lyrics: parsed.lyrics || "",
    };
  } catch (error) {
    console.error("[LLM] OpenAI Error:", error);
    throw error;
  }
}
