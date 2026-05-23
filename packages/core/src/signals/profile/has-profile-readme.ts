import type { Signal } from "../types"

export const hasProfileReadme: Signal<boolean> = {
  id: "hasProfileReadme",
  name: "Has Profile README",
  category: "profile",
  type: "boolean",
  description: "Whether the user has a profile README",
  requiresEnrichment: true,
  resolve: ({ enrichment }) => enrichment?.hasProfileReadme ?? false,
}
