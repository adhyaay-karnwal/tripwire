export interface MakeCtxOverrides {
  signals?: Record<string, unknown>
  contentText?: string
  isVouched?: boolean
  prsToday?: number
  username?: string
  extra?: Record<string, unknown>
}

export function makeCtx(
  overrides: MakeCtxOverrides = {}
): Record<string, unknown> {
  return {
    ...(overrides.signals ?? {}),
    ...(overrides.contentText !== undefined
      ? { contentText: overrides.contentText }
      : {}),
    ...(overrides.isVouched !== undefined
      ? { isVouched: overrides.isVouched }
      : {}),
    ...(overrides.prsToday !== undefined
      ? { prsToday: overrides.prsToday }
      : {}),
    ...(overrides.username !== undefined
      ? { username: overrides.username }
      : {}),
    ...(overrides.extra ?? {}),
  }
}
