export interface GraphNode { id: string; label: string; type: string }
export interface GraphEdge { source: string; target: string; relation: string }
export const toEntityMap = (nodes: GraphNode[], edges: GraphEdge[]) => ({ nodes, edges, depth: 3 });
