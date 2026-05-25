import { ScoreReport } from "@/lib/types";
export const renderScoreReport = (r: ScoreReport) => ({ headline: r.pass ? "AI-ready" : "Needs remediation", ...r });
