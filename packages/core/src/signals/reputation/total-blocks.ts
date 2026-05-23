import type { Signal } from "../types"

export const totalBlocks: Signal<number> = {
  id: "totalBlocks",
  name: "Total Blocks",
  category: "reputation",
  type: "number",
  description: "Total number of times this user has been blocked in this repo",
  resolve: ({ repoReputation }) => repoReputation?.totalBlocks ?? 0,
}
