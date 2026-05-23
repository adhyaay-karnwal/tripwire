import type { Signal } from "../types"

export const isGitHubStar: Signal<boolean> = {
  id: "isGitHubStar",
  name: "GitHub Star",
  category: "badges",
  type: "boolean",
  description: "Whether the user has the GitHub Star badge",
  requiresEnrichment: true,
  resolve: ({ enrichment }) => enrichment?.graphql?.isGitHubStar ?? false,
}
