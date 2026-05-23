import type { Signal } from "../types"

export const hasTwoFactor: Signal<boolean> = {
  id: "hasTwoFactor",
  name: "Has 2FA",
  category: "account",
  type: "boolean",
  description: "Whether two-factor authentication is enabled",
  resolve: ({ ghUser }) =>
    (ghUser?.two_factor_authentication as boolean) ?? false,
}
