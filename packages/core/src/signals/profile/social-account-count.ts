import type { Signal } from "../types"

export const socialAccountCount: Signal<number> = {
  id: "socialAccountCount",
  name: "Social Account Count",
  category: "profile",
  type: "number",
  description: "Number of linked social accounts",
  requiresEnrichment: true,
  resolve: ({ enrichment }) => enrichment?.graphql?.socialAccounts.length ?? 0,
}
