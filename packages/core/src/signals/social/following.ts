import type { Signal } from "../types"

export const following: Signal<number> = {
  id: "following",
  name: "Following",
  category: "social",
  type: "number",
  description: "Number of users being followed",
  resolve: ({ ghUser }) => ghUser?.following ?? 0,
}
