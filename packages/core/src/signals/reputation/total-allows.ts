import type { Signal } from "../types"

export const totalAllows: Signal<number> = {
  id: "totalAllows",
  name: "Total Allows",
  category: "reputation",
  type: "number",
  description: "Total number of times this user has been allowed in this repo",
  resolve: ({ repoReputation }) => repoReputation?.totalAllows ?? 0,
}
