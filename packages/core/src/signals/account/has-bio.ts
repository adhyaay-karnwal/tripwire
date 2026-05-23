import type { Signal } from "../types"

export const hasBio: Signal<boolean> = {
  id: "hasBio",
  name: "Has Bio",
  category: "account",
  type: "boolean",
  description: "Whether the user has a bio on their profile",
  resolve: ({ ghUser }) => !!ghUser?.bio,
}
