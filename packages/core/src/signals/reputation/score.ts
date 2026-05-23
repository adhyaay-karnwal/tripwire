import type { Signal } from "../types"

export const score: Signal<number> = {
  id: "score",
  name: "Contributor Score",
  category: "reputation",
  type: "number",
  description: "Tripwire contributor trust score (0-100)",
  resolve: ({ repoReputation }) => repoReputation?.score ?? 0,
}
