import type { Signal } from "../types"

export const isDeveloperProgramMember: Signal<boolean> = {
  id: "isDeveloperProgramMember",
  name: "Developer Program Member",
  category: "badges",
  type: "boolean",
  description: "Whether the user is a GitHub Developer Program member",
  requiresEnrichment: true,
  resolve: ({ enrichment }) =>
    enrichment?.graphql?.isDeveloperProgramMember ?? false,
}
