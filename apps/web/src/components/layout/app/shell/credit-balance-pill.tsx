import { useCustomer } from "autumn-js/react"

export function CreditBalancePill() {
  const { data: customer } = useCustomer()
  const balance = customer?.balances?.ai_credits

  if (!balance) return null

  const remaining = balance.remaining ?? 0
  const granted = balance.granted ?? 0
  const unlimited = balance.unlimited ?? false

  if (unlimited) return null

  const isEmpty = remaining <= 0
  const isLow = !isEmpty && granted > 0 && remaining / granted < 0.2

  return (
    <span
      className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[14px] font-medium tabular-nums transition-colors ${
        isEmpty
          ? "bg-red-500/10 text-red-400"
          : isLow
            ? "bg-amber-500/10 text-amber-400"
            : "bg-[#FAFAFA08] text-muted-foreground"
      }`}
    >
      ${(remaining / 100).toFixed(2)}
    </span>
  )
}
