import type { Signal } from "../types"

export const hasCompany: Signal<boolean> = {
  id: "hasCompany",
  name: "Has Company",
  category: "account",
  type: "boolean",
  description: "Whether the user has a company listed",
  resolve: ({ ghUser }) => !!ghUser?.company,
}
