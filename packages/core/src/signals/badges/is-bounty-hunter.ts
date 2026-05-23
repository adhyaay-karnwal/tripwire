import type { Signal } from "../types"

export const isBountyHunter: Signal<boolean> = {
  id: "isBountyHunter",
  name: "Bounty Hunter",
  category: "badges",
  type: "boolean",
  description: "Whether the user has the Bug Bounty Hunter badge",
  requiresEnrichment: true,
  resolve: ({ enrichment }) => enrichment?.graphql?.isBountyHunter ?? false,
}
