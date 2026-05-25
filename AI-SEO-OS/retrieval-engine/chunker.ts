import { RETRIEVAL_RULES } from "./rules";
import { Chunk } from "@/lib/types";
const splitSentences = (text: string) => text.split(/(?<=[.!?])\s+/).filter(Boolean);
export function semanticChunk(text: string): Chunk[] {
  const sentences = splitSentences(text);
  const chunks: Chunk[] = []; let bucket: string[] = [];
  for (const sentence of sentences) {
    const candidate = [...bucket, sentence].join(" ");
    if (candidate.split(/\s+/).length > RETRIEVAL_RULES.targetMaxWords && bucket.length) {
      const joined = bucket.join(" ");
      chunks.push({ id: crypto.randomUUID(), text: joined, words: joined.split(/\s+/).length, autonomy: 0, ambiguity: 0, citationDensity: 0 });
      bucket = [sentence];
    } else bucket.push(sentence);
  }
  if (bucket.length) { const joined = bucket.join(" "); chunks.push({ id: crypto.randomUUID(), text: joined, words: joined.split(/\s+/).length, autonomy: 0, ambiguity: 0, citationDensity: 0 }); }
  return chunks;
}
