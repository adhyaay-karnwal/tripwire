import type { Signal } from "../types"

export const followers: Signal<number> = {
  id: "followers",
  name: "Followers",
  category: "social",
  type: "number",
  description: "Number of followers",
  resolve: ({ ghUser }) => ghUser?.followers ?? 0,
}
