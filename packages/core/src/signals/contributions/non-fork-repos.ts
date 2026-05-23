import type { Signal } from "../types"

export const nonForkRepos: Signal<number> = {
  id: "nonForkRepos",
  name: "Non-Fork Repos",
  category: "contributions",
  type: "number",
  description: "Number of public non-fork repositories",
  requiresEnrichment: true,
  resolve: ({ enrichment }) => enrichment?.nonForkRepoCount ?? 0,
}
