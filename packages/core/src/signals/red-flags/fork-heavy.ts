import type { Signal } from "../types"

export const forkHeavy: Signal<boolean> = {
  id: "forkHeavy",
  name: "Fork Heavy",
  category: "redFlags",
  type: "boolean",
  description: "Whether the user has 50+ forks but 2 or fewer non-fork repos",
  requiresEnrichment: true,
  resolve: ({ enrichment }) => {
    const fork = enrichment?.forkRepoCount ?? 0
    const nonFork = enrichment?.nonForkRepoCount ?? 0
    return fork >= 50 && nonFork <= 2
  },
}
