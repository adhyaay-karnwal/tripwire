import type { Signal } from "../types"

export const publicRepos: Signal<number> = {
  id: "publicRepos",
  name: "Public Repos",
  category: "contributions",
  type: "number",
  description: "Total number of public repositories",
  resolve: ({ ghUser }) => ghUser?.public_repos ?? 0,
}
