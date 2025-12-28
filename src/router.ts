// src/router.ts

/* ======================================================
   TYPES
====================================================== */

export type Task =
  | "chat"
  | "summarize"
  | "research"
  | "code"
  | "debug"
  | "design";

export type Target =
  | "OLLAMA_GEMMA2"
  | "OLLAMA_LLAMA3_2"
  | "OLLAMA_MISTRAL7B"
  | "GEMINI"
  | "CLAUDE";

export type RouteInput = {
  user_message: string;
};

export type RouteDecision = {
  target: Target;
  model?: string;
  reason: string;
  prompt_final: string;
};

/* ======================================================
   ROUTER
====================================================== */

export function route(input: RouteInput): RouteDecision {
  const msg = input.user_message.toLowerCase();

  /* ---------------------------
     INTENT DETECTION
  --------------------------- */

  const isCode = [
    "code",
    "javascript",
    "typescript",
    "js",
    "fonction",
    "script",
    "classe",
    "méthode",
    "bug",
    "test",
    "écris",
    "écrire",
    "implémente",
    "implémenter"
  ].some(k => msg.includes(k));

  const isResearch = [
    "cherche",
    "recherche",
    "documentation",
    "docs",
    "api",
    "référence",
    "web"
  ].some(k => msg.includes(k));

  /* ---------------------------
     ROUTING RULES
  --------------------------- */

  // 🔎 Recherche / Web
  if (isResearch) {
    return {
      target: "GEMINI",
      reason: "Recherche / documentation → Gemini",
      prompt_final: input.user_message
    };
  }

  // 💻 CODE (PRIORITÉ ABSOLUE)
  if (isCode) {
    return {
      target: "OLLAMA_MISTRAL7B",
      model: "mistral-code", // modèle discipliné
      reason: "Écriture de code → Mistral (code-only)",
      prompt_final:
        "Donne UNIQUEMENT le code. Pas d'explication.\n\n" +
        input.user_message
    };
  }

  // 💬 Chat simple / orchestration
  return {
    target: "OLLAMA_LLAMA3_2",
    model: "llama3.2:3b",
    reason: "Chat général → Llama 3.2",
    prompt_final: input.user_message
  };
}
