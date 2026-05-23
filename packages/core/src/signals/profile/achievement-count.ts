import type { Signal } from "../types"

export const achievementCount: Signal<number> = {
  id: "achievementCount",
  name: "Achievement Count",
  category: "profile",
  type: "number",
  description: "Number of GitHub achievements earned",
  requiresEnrichment: true,
  resolve: ({ enrichment }) => enrichment?.achievementCount ?? 0,
}
