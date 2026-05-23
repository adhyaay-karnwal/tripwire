import type { Signal } from "../types"

export const hasCryptoAddress: Signal<boolean> = {
  id: "hasCryptoAddress",
  name: "Has Crypto Address",
  category: "content",
  type: "boolean",
  description: "Whether the content contains cryptocurrency addresses",
  resolve: () => false,
}
