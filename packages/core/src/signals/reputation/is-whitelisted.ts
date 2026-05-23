import type { Signal } from "../types"

export const isWhitelisted: Signal<boolean> = {
  id: "isWhitelisted",
  name: "Is Whitelisted",
  category: "reputation",
  type: "boolean",
  description: "Whether the user is on the repo whitelist",
  resolve: ({ repoReputation }) => repoReputation?.isWhitelisted ?? false,
}
