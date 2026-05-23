export function isBotOrGhost(username: string | null | undefined): boolean {
  if (!username) return true
  const lower = username.toLowerCase()
  if (lower === "ghost") return true
  if (lower.endsWith("[bot]")) return true
  if (lower.endsWith("bot")) return true
  return false
}
