import type { Signal } from "../types"

export const mergeRatio: Signal<number> = {
  id: "mergeRatio",
  name: "Merge Ratio",
  category: "contributions",
  type: "number",
  description: "Ratio of merged PRs to total closed PRs (0-1)",
  resolve: () => 0,
}
