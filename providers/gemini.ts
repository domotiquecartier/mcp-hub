// providers/gemini.ts
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const execFileAsync = promisify(execFile);

export async function callGeminiCli(prompt: string) {
  // Exemple générique: adapte au binaire exact que tu utilises
  const { stdout, stderr } = await execFileAsync("gemini", ["-p", prompt], {
    maxBuffer: 10 * 1024 * 1024
  });
  if (stderr?.trim()) {
    // pas forcément une erreur, mais loggable
  }
  return stdout.trim();
}
