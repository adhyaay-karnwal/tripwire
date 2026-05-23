import type { WorkflowNodeType } from "@tripwire/db"

export interface ParamCondition {
  field: string
  value: string | string[]
}

export interface ParamDefinition {
  key: string
  name: string
  type: "string" | "number" | "boolean" | "select"
  required?: boolean
  default?: unknown
  options?: { label: string; value: string }[]
  description?: string
  condition?: ParamCondition
}

export interface HandleDefinition {
  id: string
  type: "source" | "target"
  position: "top" | "bottom"
  label?: string
}

export interface ContextField {
  key: string
  label: string
  type: "number" | "string" | "boolean"
  source: "user" | "content" | "manual"
  default?: unknown
}

export interface EvalResult {
  pass: boolean
  detail: string
  pauseMs?: number
  producedContext?: Record<string, unknown>
}

export type EvalContext = Record<string, unknown>

export interface BlockMeta {
  type: WorkflowNodeType
  subtype: string
  name: string
  category: string
  description: string
  definition?: string
  example?: string
  params: ParamDefinition[]
  handles: HandleDefinition[]
  hidden?: boolean
  requiredContext?: ContextField[]
}

export interface Block extends BlockMeta {
  evaluate(data: Record<string, unknown>, ctx: EvalContext): EvalResult
}
