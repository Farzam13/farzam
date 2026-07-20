import { RelationType } from "@/lib/types";
const relationSet: RelationType[] = ["treated_by","causes","associated_with","minimizes","increases_risk_of","indicated_for"];
export function buildEntityRelations(entities: string[]) {
  return entities.flatMap((e, i) => entities.slice(i + 1, i + 3).map(t => ({ from: e, to: t, type: relationSet[(i + t.length) % relationSet.length] })));
}
