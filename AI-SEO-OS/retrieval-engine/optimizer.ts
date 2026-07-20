import { semanticChunk } from "./chunker";
import { scoreChunk, retrievalConfidence } from "./scorer";
export function optimizeForRetrieval(input: string) {
  const chunks = semanticChunk(input).map(scoreChunk);
  return { chunks, retrievalConfidence: retrievalConfidence(chunks), executiveSummary: chunks[0]?.text.slice(0, 320) ?? "" };
}
