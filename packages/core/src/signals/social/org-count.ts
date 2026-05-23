import type { Signal } from "../types"

export const orgCount: Signal<number> = {
  id: "orgCount",
  name: "Org Memberships",
  category: "social",
  type: "number",
  description: "Number of public organization memberships",
  requiresEnrichment: true,
  resolve: ({ enrichment }) => enrichment?.graphql?.organizations.length ?? 0,
}
