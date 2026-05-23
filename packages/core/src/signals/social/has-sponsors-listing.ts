import type { Signal } from "../types"

export const hasSponsorsListing: Signal<boolean> = {
  id: "hasSponsorsListing",
  name: "Has Sponsors Listing",
  category: "social",
  type: "boolean",
  description: "Whether the user has a GitHub Sponsors listing",
  requiresEnrichment: true,
  resolve: ({ enrichment }) => enrichment?.graphql?.hasSponsorsListing ?? false,
}
