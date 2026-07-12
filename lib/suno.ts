import { updateOrder } from "./orders";
import { sendPreviewNotifications } from "./notifications";
import { generateLyrics } from "./llm";
import { type QuizAnswers } from "@/data/quizData";

export async function generateSunoPreview(orderId: string, answers: QuizAnswers) {
  try {
    const APIFRAME_API_KEY = process.env.APIFRAME_API_KEY;
    
    if (!APIFRAME_API_KEY) {
      console.error("[Suno API] APIFRAME_API_KEY non défini dans .env.local.");
      updateOrder(orderId, { previewStatus: "failed" });
      return;
    }

    // 1. Mark as generating
    updateOrder(orderId, { previewStatus: "generating" });
    console.log(`[Suno API] Début de la génération pour la commande ${orderId}...`);

    // 1.5 Generate Lyrics with OpenAI
    console.log(`[LLM] Génération des paroles via OpenAI...`);
    const { title, lyrics } = await generateLyrics(answers);
    console.log(`[LLM] Paroles générées : "${title}"`);

    // 2. Lancer la génération sur APIFrame
    const sunoParams: Record<string, any> = {
      custom_mode: true,
      title: title,
      style: answers.genre,
      prompt: lyrics,
      instrumental: false
    };

    if (answers.voiceGender === "female") sunoParams.vocal_gender = "f";
    if (answers.voiceGender === "male") sunoParams.vocal_gender = "m";

    const generateRes = await fetch(`https://api.apiframe.ai/v2/music/generate`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${APIFRAME_API_KEY}`
      },
      body: JSON.stringify({
        model: "suno",
        sunoParams: sunoParams
      })
    });

    if (!generateRes.ok) {
      throw new Error(`Erreur lors de la création du Job: ${await generateRes.text()}`);
    }

    const data = await generateRes.json();
    const jobId = data.id;
    
    if (!jobId) {
      throw new Error("Aucun Job ID retourné par APIFrame.");
    }
    
    console.log(`[Suno API] Job APIFrame créé avec l'ID: ${jobId}. Attente du résultat...`);

    // 3. Polling (Vérifier le statut toutes les 10 secondes jusqu'à ce que ce soit prêt)
    let audioUrl = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 45; // Max 7.5 minutes d'attente (45 * 10s)

    while (attempts < MAX_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Attendre 10 secondes
      attempts++;

      const statusRes = await fetch(`https://api.apiframe.ai/v2/jobs/${jobId}`, {
        headers: {
          "Authorization": `Bearer ${APIFRAME_API_KEY}`
        }
      });
      
      if (!statusRes.ok) continue;

      const jobData = await statusRes.json();
      
      if (jobData.status === "COMPLETED") {
        const tracks = jobData.result?.tracks;
        if (tracks && tracks.length > 0 && tracks[0].audioUrl) {
          audioUrl = tracks[0].audioUrl;
          break;
        } else {
          throw new Error("Job complété mais aucune piste audio trouvée.");
        }
      } else if (jobData.status === "FAILED") {
        throw new Error(`Le Job APIFrame a échoué: ${jobData.error || "Raison inconnue"}`);
      }
      // PENDING or PROCESSING -> Continue polling
    }

    if (!audioUrl) {
      throw new Error("Délai d'attente dépassé pour la génération Suno.");
    }

    console.log(`[Suno API] Génération terminée ! URL: ${audioUrl}`);

    // 4. Mark as ready
    updateOrder(orderId, { 
      previewStatus: "ready", 
      previewAudioUrl: audioUrl 
    });

    // 5. Send notifications (Email + WhatsApp)
    await sendPreviewNotifications(orderId);

  } catch (error) {
    console.error("[Suno API] Erreur lors de la génération:", error);
    updateOrder(orderId, { previewStatus: "failed" });
  }
}
