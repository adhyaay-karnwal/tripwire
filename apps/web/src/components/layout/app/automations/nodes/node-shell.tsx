import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { useStoreApi } from "@xyflow/react"
import { Button } from "@tripwire/ui/button"
import { getNodeStyle, NODE_STYLE_MAP } from "#/lib/workflow/node-styles"
import {
  ActionIcon,
  ConditionIcon,
  DelayIcon,
  LogicGateIcon,
  RuleIcon,
  ScheduleIcon,
  TransformIcon,
  TriggerIcon,
} from "@tripwire/ui/icons/node-icons"
import { RULE_META } from "@tripwire/db/schema/rule-meta"
import { formatCamelCase } from "#/lib/format"

export function NodeShell({
  children,
  type,
  icon,
  label,
  sublabel,
  selected,
}: {
  children?: ReactNode
  type: string
  icon: ReactNode
  label: string
  sublabel?: string
  selected?: boolean
}) {
  const style = getNodeStyle(type)
  return (
    <div
      className={`max-w-[260px] min-w-[200px] rounded-xl bg-tw-card transition-shadow ${
        selected ? "shadow-[0_0_0_2px_var(--color-tw-accent)]" : ""
      }`}
      style={{ border: `1px solid ${style.border}` }}
    >
      <div
        className="flex items-center gap-2 border-b px-3 py-2"
        style={{ borderColor: style.border }}
      >
        <span style={{ color: style.accent }} className="shrink-0">
          {icon}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[13px] leading-tight font-medium text-tw-text-primary">
            {label}
          </span>
          {sublabel && (
            <span className="truncate text-[11px] leading-tight text-tw-text-tertiary">
              {sublabel}
            </span>
          )}
        </div>
      </div>
      {children && <div className="px-3 py-2">{children}</div>}
    </div>
  )
}

export function Param({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 py-0.5">
      <span className="text-[11px] text-tw-text-tertiary">{label}</span>
      <span className="rounded bg-tw-inner px-1.5 py-0.5 font-mono text-[11px] text-tw-text-secondary">
        {value}
      </span>
    </div>
  )
}

export function EditableParam({
  label,
  value,
  nodeId,
  paramKey,
  directData,
}: {
  label: string
  value: number
  nodeId: string
  paramKey: string
  directData?: boolean
}) {
  const store = useStoreApi()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<string>(String(value))
  const inputRef = useRef<HTMLInputElement>(null)

  if (draft !== String(value) && !editing) {
    setDraft(String(value))
  }
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  const commit = useCallback(() => {
    const val = Number(draft)
    if (draft !== "" && Number.isFinite(val) && val > 0 && val !== value) {
      const { nodes, setNodes } = store.getState()
      setNodes(
        nodes.map((n) => {
          if (n.id !== nodeId) return n
          if (directData) {
            return { ...n, data: { ...n.data, [paramKey]: Math.floor(val) } }
          }
          const params = {
            ...((n.data.params as Record<string, unknown>) ?? {}),
            [paramKey]: Math.floor(val),
          }
          return { ...n, data: { ...n.data, params } }
        })
      )
    } else {
      setDraft(String(value))
    }
    setEditing(false)
  }, [draft, value, nodeId, paramKey, directData, store])

  return (
    <div className="flex items-center justify-between gap-2 py-0.5">
      <span className="text-[11px] text-tw-text-tertiary">{label}</span>
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              commit()
            } else if (e.key === "Escape") {
              e.preventDefault()
              setDraft(String(value))
              setEditing(false)
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-14 rounded-md border border-tw-accent/40 bg-tw-surface px-2 py-0.5 text-center text-[11px] font-medium text-tw-text-primary outline-none"
        />
      ) : (
        <Button
          variant="ghost"
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setDraft(String(value))
            setEditing(true)
          }}
          className="cursor-pointer rounded-md bg-tw-surface px-2 py-0.5 text-[11px] font-medium text-tw-text-secondary hover:bg-tw-hover-light"
          title={`Edit ${label.toLowerCase()}`}
        >
          {value}
        </Button>
      )}
    </div>
  )
}

export function EditableText({
  label,
  value,
  nodeId,
  fieldKey,
  placeholder,
}: {
  label: string
  value: string
  nodeId: string
  fieldKey: string
  placeholder?: string
}) {
  const store = useStoreApi()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const prevValueRef = useRef(value)
  const inputRef = useRef<HTMLInputElement>(null)

  if (prevValueRef.current !== value) {
    prevValueRef.current = value
    setDraft(value)
  }
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  const commit = useCallback(() => {
    if (draft !== value) {
      const { nodes, setNodes } = store.getState()
      setNodes(
        nodes.map((n) =>
          n.id !== nodeId ? n : { ...n, data: { ...n.data, [fieldKey]: draft } }
        )
      )
    }
    setEditing(false)
  }, [draft, value, nodeId, fieldKey, store])

  return (
    <div className="flex items-center justify-between gap-2 py-0.5">
      <span className="shrink-0 text-[11px] text-tw-text-tertiary">
        {label}
      </span>
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              commit()
            } else if (e.key === "Escape") {
              e.preventDefault()
              setDraft(value)
              setEditing(false)
            }
          }}
          onClick={(e) => e.stopPropagation()}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-md border border-tw-accent/40 bg-tw-surface px-1.5 py-0.5 text-[11px] text-tw-text-primary outline-none"
        />
      ) : (
        <Button
          variant="ghost"
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setEditing(true)
          }}
          className="max-w-[160px] cursor-pointer truncate rounded bg-tw-inner px-1.5 py-0.5 text-left font-mono text-[11px] text-tw-text-secondary hover:bg-tw-hover-light"
          title={`Edit ${label.toLowerCase()}`}
        >
          {value || (
            <span className="text-tw-text-tertiary italic">
              {placeholder ?? "empty"}
            </span>
          )}
        </Button>
      )}
    </div>
  )
}

export const nodeIcons = {
  trigger: <TriggerIcon />,
  schedule: <ScheduleIcon />,
  rule: <RuleIcon />,
  condition: <ConditionIcon />,
  logic: <LogicGateIcon />,
  action: <ActionIcon />,
  delay: <DelayIcon />,
  transform: <TransformIcon />,
}

export const nodeColors = {
  trigger: NODE_STYLE_MAP.trigger.accent,
  rule: NODE_STYLE_MAP.rule.accent,
  condition: NODE_STYLE_MAP.condition.accent,
  logic: NODE_STYLE_MAP.logic.accent,
  action: NODE_STYLE_MAP.action.accent,
  delay: NODE_STYLE_MAP.delay.accent,
  transform: NODE_STYLE_MAP.transform.accent,
}

export const handleBase =
  "!w-2.5 !h-2.5 !rounded-sm !border !border-tw-border !bg-tw-card"

export const triggerLabels: Record<string, string> = {
  pr_opened: "PR Opened",
  pr_edited: "PR Edited",
  issue_opened: "Issue Opened",
  issue_edited: "Issue Edited",
  comment_created: "Comment Created",
  contributor_first_interaction: "First Interaction",
  schedule: "Schedule",
  schedule_daily: "Daily Schedule",
  schedule_weekly: "Weekly Schedule",
  manual: "Manual Run",
  repo_scan: "Repo History Scan",
}

export const ruleLabels: Record<string, string> = new Proxy(
  Object.fromEntries(Object.entries(RULE_META).map(([k, v]) => [k, v.name])),
  {
    get(target, prop, receiver) {
      if (typeof prop !== "string") return Reflect.get(target, prop, receiver)
      return target[prop] ?? formatCamelCase(prop)
    },
  }
)

export const RULE_KEYS = Object.keys(RULE_META) as string[]

export const HIDDEN_RULES = new Set(
  Object.entries(RULE_META)
    .filter(([, v]) => v.comingSoon)
    .map(([k]) => k)
)

export const actionLabels: Record<string, string> = {
  block: "Block",
  warn: "Warn",
  log: "Log Event",
  close: "Close",
  label: "Add Label",
  comment: "Comment",
  add_to_whitelist: "Whitelist",
  add_to_blacklist: "Blacklist",
  remove_from_whitelist: "Remove Whitelist",
  remove_from_blacklist: "Remove Blacklist",
  notify_slack: "Notify Slack",
  notify_discord: "Notify Discord",
  send_webhook: "Send Webhook",
  request_review: "Request Review",
}

export const unitLabels: Record<string, string> = {
  s: "sec",
  m: "min",
  h: "hr",
  d: "day",
}
