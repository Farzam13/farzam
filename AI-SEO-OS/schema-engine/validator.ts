export function validateSchemaGraph(graph: any): string[] {
  const issues: string[] = [];
  if (graph?.["@context"] !== "https://schema.org") issues.push("Invalid @context");
  if (!Array.isArray(graph?.["@graph"]) || graph["@graph"].length < 3) issues.push("@graph missing nodes");
  return issues;
}
