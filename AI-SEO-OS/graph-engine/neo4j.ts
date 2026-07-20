import neo4j from "neo4j-driver";
import { GraphEdge, GraphNode } from "./entity-map";
export async function writeKnowledgeGraph(nodes: GraphNode[], edges: GraphEdge[]) {
  const driver = neo4j.driver(process.env.NEO4J_URI!, neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!));
  const session = driver.session();
  try {
    for (const n of nodes) await session.run("MERGE (e:Entity {id:$id}) SET e.label=$label, e.type=$type", n);
    for (const e of edges) await session.run("MATCH (a:Entity {id:$source}), (b:Entity {id:$target}) MERGE (a)-[r:RELATION {type:$relation}]->(b)", e);
  } finally { await session.close(); await driver.close(); }
}
