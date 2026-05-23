import type { Signal } from "../types"

export const totalNearMisses: Signal<number> = {
  id: "totalNearMisses",
  name: "Total Near Misses",
  category: "reputation",
  type: "number",
  description: "Total number of near-miss events for this user in this repo",
  resolve: ({ repoReputation }) => repoReputation?.totalNearMisses ?? 0,
}
