// providers/ollama.ts
import fetch from "node-fetch";
export async function callOllama(opts: {
  baseUrl: string; // e.g. http://192.168.0.197:11434
  model: string;
  prompt: string;
}) {
  const res = await fetch(`${opts.baseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: opts.model,
      prompt: opts.prompt,
      stream: false
    })
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.response as string;
}
