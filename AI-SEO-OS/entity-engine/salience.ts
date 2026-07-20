import { Entity } from "@/lib/types";
export const scoreSalience = (entities: Entity[]) => entities.map(e => ({ ...e, salience: Number(e.salience.toFixed(3)) }));
export const averageSalience = (entities: Entity[]) => entities.reduce((a, e) => a + e.salience, 0) / Math.max(entities.length, 1);
