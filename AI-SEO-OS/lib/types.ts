export type RelationType = "treated_by" | "causes" | "associated_with" | "minimizes" | "increases_risk_of" | "indicated_for";
export interface Entity { id: string; name: string; type: string; salience: number; sameAs?: string[]; }
export interface Chunk { id: string; text: string; words: number; autonomy: number; ambiguity: number; citationDensity: number; }
export interface ScoreReport { total: number; pass: boolean; metrics: Record<string, number>; reasons: string[]; }
