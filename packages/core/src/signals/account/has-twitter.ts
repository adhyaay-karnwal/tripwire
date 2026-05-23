import type { Signal } from "../types"

export const hasTwitter: Signal<boolean> = {
  id: "hasTwitter",
  name: "Has Twitter",
  category: "account",
  type: "boolean",
  description: "Whether the user has a Twitter username linked",
  resolve: ({ ghUser }) => !!ghUser?.twitter_username,
}
