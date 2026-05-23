import type { Signal } from "../types"

export const accountAgeDays: Signal<number> = {
  id: "accountAgeDays",
  name: "Account Age (days)",
  category: "account",
  type: "number",
  description: "Number of days since the GitHub account was created",
  resolve: ({ ghUser }) => {
    const createdAt = ghUser?.created_at
    if (!createdAt) return 0
    return Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000)
  },
}
