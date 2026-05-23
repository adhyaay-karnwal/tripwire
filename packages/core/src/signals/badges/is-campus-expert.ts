import type { Signal } from "../types"

export const isCampusExpert: Signal<boolean> = {
  id: "isCampusExpert",
  name: "Campus Expert",
  category: "badges",
  type: "boolean",
  description: "Whether the user is a GitHub Campus Expert",
  requiresEnrichment: true,
  resolve: ({ enrichment }) => enrichment?.graphql?.isCampusExpert ?? false,
}
