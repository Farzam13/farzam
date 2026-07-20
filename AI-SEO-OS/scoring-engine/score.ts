import { metricWeights } from "./metrics";
import { ScoreReport } from "@/lib/types";
export function scoreReadiness(metrics: Record<string, number>): ScoreReport {
  const total = Math.round(Object.entries(metricWeights).reduce((acc, [k, w]) => acc + (metrics[k] ?? 0) * w, 0) * 100);
  const reasons = total < 80 ? ["Content rejected: below threshold 80/100"] : [];
  return { total, pass: total >= 80, metrics, reasons };
}
