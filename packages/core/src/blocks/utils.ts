import type { EvalContext } from "./types"

export function num(ctx: EvalContext, key: string, fallback = 0): number {
  const v = ctx[key]
  return typeof v === "number" ? v : fallback
}

export function bool(ctx: EvalContext, key: string): boolean {
  return ctx[key] === true || ctx[key] === "true"
}

export function str(ctx: EvalContext, key: string): string {
  const v = ctx[key]
  return typeof v === "string" ? v : String(v ?? "")
}

export function getParam<T = unknown>(
  data: Record<string, unknown>,
  key: string,
  fallback: T
): T {
  const params = (data.params as Record<string, unknown>) ?? data
  const v = params[key]
  return v === undefined ? fallback : (v as T)
}

export function parseDurationMs(duration: string): number {
  const match = duration.match(/^(\d+)\s*(s|m|h|d)$/i)
  if (!match) return 5000
  const value = parseInt(match[1], 10)
  switch (match[2].toLowerCase()) {
    case "s":
      return value * 1000
    case "m":
      return value * 60_000
    case "h":
      return value * 3_600_000
    case "d":
      return value * 86_400_000
    default:
      return 5000
  }
}
