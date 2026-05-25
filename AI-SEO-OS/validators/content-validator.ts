export function validateContentRules(input: { maxChunkWords: number; salience: number; answerFirst: number; graphDepth: number; citationDensity: number; ambiguity: number; }) {
  const violations: string[] = [];
  if (input.maxChunkWords > 220) violations.push("chunk size exceeds 220 words");
  if (input.salience < 0.65) violations.push("entity salience below 0.65");
  if (input.answerFirst < 0.9) violations.push("answer-first compliance below 90%");
  if (input.graphDepth < 3) violations.push("graph depth below 3");
  if (input.citationDensity < 0.3) violations.push("citation density too low");
  if (input.ambiguity > 0.35) violations.push("semantic ambiguity too high");
  return { pass: violations.length === 0, violations };
}
