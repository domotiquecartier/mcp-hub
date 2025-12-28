// src/execute.ts

import "dotenv/config";
import { route, RouteInput } from "./router";
import { callOllama } from "./providers/ollama";
import { callGemini } from "./providers/gemini";
// import { callClaude } from "./providers/claude"; // prêt pour plus tard

/* ======================================================
   CONFIG
====================================================== */

const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL || "http://192.168.0.197:11434";

/* ======================================================
   UTIL : NETTOYAGE DU CODE (ANTI ``` )
====================================================== */

function stripCodeFences(text: string): string {
  return text
    .replace(/```[a-zA-Z]*\n?/g, "")
    .replace(/```/g, "")
    .trim();
}

/* ======================================================
   EXECUTION PRINCIPALE
====================================================== */

export async function execute(input: RouteInput) {
  // 1️⃣ ROUTAGE
  const decision = route(input);

  console.log(
    `🧠 ROUTER → ${decision.target} | ${decision.reason}`
  );

  // 2️⃣ EXÉCUTION SELON LA CIBLE
  switch (decision.target) {
    /* -------------------------------
       OLLAMA (LOCAL / NUC)
    ------------------------------- */
    case "OLLAMA_MISTRAL7B":
    case "OLLAMA_LLAMA3_2":
    case "OLLAMA_GEMMA2": {
      if (!decision.model) {
        throw new Error("Modèle Ollama manquant dans la décision.");
      }

      const raw = await callOllama({
        baseUrl: OLLAMA_BASE_URL,
        model: decision.model,
        prompt: decision.prompt_final
      });

      const cleaned = stripCodeFences(raw);

      return {
        provider: "ollama",
        model: decision.model,
        response: cleaned
      };
    }

    /* -------------------------------
       GEMINI (API)
    ------------------------------- */
    case "GEMINI": {
      const output = await callGemini(decision.prompt_final);

      return {
        provider: "gemini",
        model: "gemini-1.5-flash",
        response: output.trim()
      };
    }

    /* -------------------------------
       CLAUDE (À ACTIVER PLUS TARD)
    ------------------------------- */
    case "CLAUDE": {
      throw new Error(
        "Claude non activé. Ajoute providers/claude.ts pour l'utiliser."
      );
    }

    default:
      throw new Error(`Cible inconnue : ${decision.target}`);
  }
}
