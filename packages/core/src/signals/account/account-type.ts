import type { Signal } from "../types"

export const accountType: Signal<string> = {
  id: "accountType",
  name: "Account Type",
  category: "account",
  type: "string",
  description: "GitHub account type (User or Organization)",
  resolve: ({ ghUser }) => ghUser?.type ?? "User",
}
