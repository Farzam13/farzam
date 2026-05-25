export function buildCooccurrence(chunks: string[]) {
  const matrix: Record<string, Record<string, number>> = {};
  for (const chunk of chunks) {
    const terms = [...new Set(chunk.match(/\b[A-Z][a-z]+\b/g) ?? [])];
    for (const a of terms) for (const b of terms) if (a !== b) matrix[a] = { ...(matrix[a] ?? {}), [b]: ((matrix[a] ?? {})[b] ?? 0) + 1 };
  }
  return matrix;
}
