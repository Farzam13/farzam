import { Chunk } from "@/lib/types";
import { RETRIEVAL_RULES } from "./rules";
export function scoreChunk(chunk: Chunk): Chunk {
  const lower = chunk.text.toLowerCase();
  const pronouns = RETRIEVAL_RULES.ambiguousPronouns.filter(p => new RegExp(`\\b${p}\\b`).test(lower)).length;
  const answerFirst = /^(definition|answer|key point|in summary|)/i.test(chunk.text.trim()) ? 1 : 0.86;
  const citationHits = RETRIEVAL_RULES.citationSignals.filter(s => lower.includes(s)).length;
  const ambiguity = Math.min(1, pronouns / 8);
  const autonomy = Math.max(0, Math.min(1, answerFirst - ambiguity * 0.4));
  const citationDensity = Math.min(1, citationHits / 5);
  return { ...chunk, ambiguity, autonomy, citationDensity };
}
export const retrievalConfidence = (chunks: Chunk[]) => chunks.reduce((a, c) => a + c.autonomy, 0) / Math.max(chunks.length, 1);
