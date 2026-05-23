import type { Signal } from "../types"

export const closedPrs: Signal<number> = {
  id: "closedPrs",
  name: "Closed PRs",
  category: "contributions",
  type: "number",
  description: "Total number of closed pull requests",
  resolve: () => 0,
}
