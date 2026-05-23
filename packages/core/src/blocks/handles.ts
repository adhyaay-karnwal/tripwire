import type { HandleDefinition } from "./types"

export const sourceBottom = (
  id = "source",
  label?: string
): HandleDefinition => ({
  id,
  type: "source",
  position: "bottom",
  label,
})

export const targetTop = (id = "target"): HandleDefinition => ({
  id,
  type: "target",
  position: "top",
})

export const triggerHandles: HandleDefinition[] = [sourceBottom()]

export const ruleHandles: HandleDefinition[] = [
  targetTop(),
  sourceBottom("pass", "pass"),
  sourceBottom("fail", "fail"),
]

export const conditionHandles: HandleDefinition[] = [
  targetTop(),
  sourceBottom("true", "true"),
  sourceBottom("false", "false"),
]

export const logicHandles: HandleDefinition[] = [targetTop(), sourceBottom()]
export const actionHandles: HandleDefinition[] = [targetTop()]
export const delayHandles: HandleDefinition[] = [targetTop(), sourceBottom()]
export const transformHandles: HandleDefinition[] = [
  targetTop(),
  sourceBottom(),
]
