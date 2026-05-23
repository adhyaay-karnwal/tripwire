import type { Signal } from "../types"

export const isBlacklisted: Signal<boolean> = {
  id: "isBlacklisted",
  name: "Is Blacklisted",
  category: "reputation",
  type: "boolean",
  description: "Whether the user is on the repo blacklist",
  resolve: ({ repoReputation }) => repoReputation?.isBlacklisted ?? false,
}
