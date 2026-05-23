import type { Signal } from "../types"

export const hasBlog: Signal<boolean> = {
  id: "hasBlog",
  name: "Has Blog",
  category: "account",
  type: "boolean",
  description: "Whether the user has a blog/website listed",
  resolve: ({ ghUser }) => !!ghUser?.blog,
}
