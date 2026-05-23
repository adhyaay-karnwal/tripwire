import type { Signal } from "../types"

export const isSiteAdmin: Signal<boolean> = {
  id: "isSiteAdmin",
  name: "Site Admin",
  category: "badges",
  type: "boolean",
  description: "Whether the user is a GitHub staff member",
  requiresEnrichment: true,
  resolve: ({ enrichment }) => enrichment?.graphql?.isSiteAdmin ?? false,
}
