import type { Signal } from "../types"

export const forkRepos: Signal<number> = {
  id: "forkRepos",
  name: "Fork Repos",
  category: "contributions",
  type: "number",
  description: "Number of public fork repositories",
  requiresEnrichment: true,
  resolve: ({ enrichment }) => enrichment?.forkRepoCount ?? 0,
}
