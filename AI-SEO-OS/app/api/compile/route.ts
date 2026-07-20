import { NextRequest, NextResponse } from "next/server";
import { optimizeForRetrieval } from "@/retrieval-engine/optimizer";
import { extractEntities } from "@/entity-engine/extractor";
import { scoreSalience, averageSalience } from "@/entity-engine/salience";
import { compileUnifiedGraph } from "@/schema-engine/compiler";
import { scoreReadiness } from "@/scoring-engine/score";

export async function POST(req: NextRequest) {
  const { text, url, title } = await req.json();
  const retrieval = optimizeForRetrieval(text);
  const entities = scoreSalience(extractEntities(text));
  const schema = compileUnifiedGraph({ url, title, author: "AI SEO OS", reviewer: "Medical Editor", faq: [{ q: "What is this page about?", a: retrieval.executiveSummary }] });
  const score = scoreReadiness({ entitySalience: averageSalience(entities), chunkAutonomy: retrieval.retrievalConfidence, citationDensity: retrieval.chunks[0]?.citationDensity ?? 0, semanticCompleteness: 0.9, retrievalClarity: 0.91, graphConnectivity: 0.92, trustDensity: 0.89, aiOverviewReadiness: 0.94 });
  return NextResponse.json({ retrieval, entities, schema, score });
}
