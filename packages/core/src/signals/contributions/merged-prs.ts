import type { Signal } from "../types"

export const mergedPrs: Signal<number> = {
  id: "mergedPrs",
  name: "Merged PRs",
  category: "contributions",
  type: "number",
  description: "Total number of merged pull requests",
  resolve: () => 0,
}
