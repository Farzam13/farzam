import { Entity } from "@/lib/types";
export function extractEntities(text: string): Entity[] {
  const matches = [...text.matchAll(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/g)].map(m => m[1]);
  const uniq = [...new Set(matches)].slice(0, 100);
  return uniq.map(name => ({ id: crypto.randomUUID(), name, type: "Thing", salience: 0.7 + Math.random() * 0.3 }));
}
