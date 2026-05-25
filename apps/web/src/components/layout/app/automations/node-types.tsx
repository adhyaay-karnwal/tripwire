import { memo, useCallback } from "react"
import { Handle, Position, useStoreApi, type NodeProps } from "@xyflow/react"
import { HANDLE_COLORS } from "#/lib/workflow/node-styles"
import { formatScheduleSublabel } from "#/lib/schedule-format"
import {
  SIGNAL_REGISTRY,
  SIGNAL_CATEGORIES,
  getSignalsByCategory,
  getOperatorsForType,
} from "@tripwire/core/rules/signal-registry"
import {
  EditableParam,
  EditableText,
  HIDDEN_RULES,
  NodeShell,
  Param,
  RULE_KEYS,
  actionLabels,
  handleBase,
  nodeColors,
  nodeIcons,
  ruleLabels,
  triggerLabels,
  unitLabels,
} from "./nodes/node-shell"

export const TriggerNode = memo(({ data, selected }: NodeProps) => {
  const trigger = (data.trigger as string) ?? "pr_opened"
  const isSchedule =
    trigger === "schedule" ||
    trigger === "schedule_daily" ||
    trigger === "schedule_weekly"
  const sublabel = isSchedule
    ? formatScheduleSublabel(data as Record<string, unknown>)
    : "Trigger"
  return (
    <>
      <NodeShell
        type="trigger"
        icon={isSchedule ? nodeIcons.schedule : nodeIcons.trigger}
        label={triggerLabels[trigger] ?? trigger}
        sublabel={sublabel}
        selected={selected}
      >
        {data.filters ? (
          <Param label="Filter" value={String(data.filters)} />
        ) : null}
      </NodeShell>
      <Handle
        type="source"
        position={Position.Bottom}
        className={`${handleBase} !-bottom-1.5`}
      />
    </>
  )
})
TriggerNode.displayName = "TriggerNode"

export const RuleNode = memo(({ id, data, selected }: NodeProps) => {
  const rule = (data.rule as string) ?? "accountAge"
  const params = data.params as Record<string, unknown> | undefined
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className={`${handleBase} !-top-1.5`}
      />
      <NodeShell
        type="rule"
        icon={nodeIcons.rule}
        label={ruleLabels[rule] ?? rule}
        sublabel="Rule Check"
        selected={selected}
      >
        {params &&
          Object.entries(params).map(([k, v]) => {
            if (typeof v === "number") {
              return (
                <EditableParam
                  key={k}
                  label={k}
                  value={v}
                  nodeId={id}
                  paramKey={k}
                />
              )
            }
            return <Param key={k} label={k} value={String(v)} />
          })}
      </NodeShell>
      <Handle
        type="source"
        position={Position.Bottom}
        id="pass"
        className={`${handleBase} !-bottom-1.5 !left-[30%]`}
        style={{
          backgroundColor: HANDLE_COLORS.pass.bg,
          borderColor: HANDLE_COLORS.pass.border,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="fail"
        className={`${handleBase} !-bottom-1.5 !left-[70%]`}
        style={{
          backgroundColor: HANDLE_COLORS.fail.bg,
          borderColor: HANDLE_COLORS.fail.border,
        }}
      />
    </>
  )
})
RuleNode.displayName = "RuleNode"

export const ConditionNode = memo(({ id, data, selected }: NodeProps) => {
  const signalMode = data.signalMode === true
  const store = useStoreApi()

  const updateData = useCallback(
    (patch: Record<string, unknown>) => {
      const { nodes, setNodes } = store.getState()
      setNodes(
        nodes.map((n) =>
          n.id !== id ? n : { ...n, data: { ...n.data, ...patch } }
        )
      )
    },
    [id, store]
  )

  if (!signalMode) {
    const field = (data.field as string) ?? "score"
    const op = (data.operator as string) ?? ">"
    const val = data.value ?? "50"
    return (
      <>
        <Handle
          type="target"
          position={Position.Top}
          className={`${handleBase} !-top-1.5`}
        />
        <NodeShell
          type="condition"
          icon={nodeIcons.condition}
          label="Condition"
          sublabel={`${field} ${op} ${val}`}
          selected={selected}
        >
          <Param label="Field" value={String(field)} />
          <Param label="Operator" value={String(op)} />
          <EditableParam
            label="Value"
            value={Number(val) || 0}
            nodeId={id}
            paramKey="value"
            directData
          />
        </NodeShell>
        <Handle
          type="source"
          position={Position.Bottom}
          id="true"
          className={`${handleBase} !-bottom-1.5 !left-[30%]`}
          style={{
            backgroundColor: HANDLE_COLORS.pass.bg,
            borderColor: HANDLE_COLORS.pass.border,
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          className={`${handleBase} !-bottom-1.5 !left-[70%]`}
          style={{
            backgroundColor: HANDLE_COLORS.fail.bg,
            borderColor: HANDLE_COLORS.fail.border,
          }}
        />
      </>
    )
  }

  const signalId = (data.signal as string) ?? ""
  const op = (data.operator as string) ?? ""
  const val = data.value
  const signal = SIGNAL_REGISTRY.find((s) => s.id === signalId)
  const signalType = signal?.type ?? "number"
  const operators = getOperatorsForType(signalType)
  const sublabel = signalId
    ? `${signal?.name ?? signalId} ${op} ${val ?? "?"}`
    : "Select a signal"

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className={`${handleBase} !-top-1.5`}
      />
      <NodeShell
        type="condition"
        icon={nodeIcons.condition}
        label="Signal Condition"
        sublabel={sublabel}
        selected={selected}
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2 py-0.5">
            <span className="shrink-0 text-[11px] text-tw-text-tertiary">
              Signal
            </span>
            <select
              value={signalId}
              onChange={(e) => {
                const newSignal = SIGNAL_REGISTRY.find(
                  (s) => s.id === e.target.value
                )
                const newOps = newSignal
                  ? getOperatorsForType(newSignal.type)
                  : []
                const defaultOp = newOps[0] ?? ""
                const defaultVal =
                  newSignal?.type === "boolean"
                    ? "true"
                    : newSignal?.type === "number"
                      ? "0"
                      : ""
                updateData({
                  signal: e.target.value,
                  operator: defaultOp,
                  value: defaultVal,
                })
              }}
              onClick={(e) => e.stopPropagation()}
              className="min-w-0 flex-1 cursor-pointer rounded-md border border-tw-border bg-tw-surface px-1.5 py-0.5 text-[11px] text-tw-text-primary outline-none"
            >
              <option value="">Select signal...</option>
              {SIGNAL_CATEGORIES.map((cat) => {
                const signals = getSignalsByCategory(cat.id)
                if (signals.length === 0) return null
                return (
                  <optgroup key={cat.id} label={cat.name}>
                    {signals.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                        {s.requiresEnrichment ? " (Pro)" : ""}
                      </option>
                    ))}
                  </optgroup>
                )
              })}
            </select>
          </div>

          {signalId && (
            <div className="flex items-center justify-between gap-2 py-0.5">
              <span className="shrink-0 text-[11px] text-tw-text-tertiary">
                Operator
              </span>
              <select
                value={op}
                onChange={(e) => updateData({ operator: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                className="min-w-0 flex-1 cursor-pointer rounded-md border border-tw-border bg-tw-surface px-1.5 py-0.5 text-[11px] text-tw-text-primary outline-none"
              >
                {operators.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          )}

          {signalId && signalType === "boolean" && (
            <div className="flex items-center justify-between gap-2 py-0.5">
              <span className="shrink-0 text-[11px] text-tw-text-tertiary">
                Value
              </span>
              <select
                value={String(val ?? "true")}
                onChange={(e) => updateData({ value: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                className="min-w-0 flex-1 cursor-pointer rounded-md border border-tw-border bg-tw-surface px-1.5 py-0.5 text-[11px] text-tw-text-primary outline-none"
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </div>
          )}

          {signalId && signalType === "number" && (
            <EditableParam
              label="Value"
              value={Number(val) || 0}
              nodeId={id}
              paramKey="value"
              directData
            />
          )}

          {signalId && signalType === "string" && (
            <EditableText
              label="Value"
              value={String(val ?? "")}
              nodeId={id}
              fieldKey="value"
              placeholder="Enter value..."
            />
          )}

          {signal?.requiresEnrichment && (
            <span className="text-[10px] text-tw-accent">Pro</span>
          )}
        </div>
      </NodeShell>
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className={`${handleBase} !-bottom-1.5 !left-[30%]`}
        style={{
          backgroundColor: HANDLE_COLORS.pass.bg,
          borderColor: HANDLE_COLORS.pass.border,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className={`${handleBase} !-bottom-1.5 !left-[70%]`}
        style={{
          backgroundColor: HANDLE_COLORS.fail.bg,
          borderColor: HANDLE_COLORS.fail.border,
        }}
      />
    </>
  )
})
ConditionNode.displayName = "ConditionNode"

export const LogicNode = memo(({ data, selected }: NodeProps) => {
  const gate = (data.gate as string) ?? "AND"
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        id="a"
        className={`${handleBase} !-top-1.5 !left-[30%]`}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="b"
        className={`${handleBase} !-top-1.5 !left-[70%]`}
      />
      <NodeShell
        type="logic"
        icon={nodeIcons.logic}
        label={gate}
        sublabel="Logic Gate"
        selected={selected}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={`${handleBase} !-bottom-1.5`}
      />
    </>
  )
})
LogicNode.displayName = "LogicNode"

export const ActionNode = memo(({ id, data, selected }: NodeProps) => {
  const action = (data.action as string) ?? "block"
  const showMessage = ["block", "warn", "comment", "log"].includes(action)
  const showLabel = action === "label"
  const showUrl = ["send_webhook", "notify_slack", "notify_discord"].includes(
    action
  )
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className={`${handleBase} !-top-1.5`}
      />
      <NodeShell
        type="action"
        icon={nodeIcons.action}
        label={actionLabels[action] ?? action}
        sublabel="Action"
        selected={selected}
      >
        {showMessage && (
          <EditableText
            label="Message"
            value={String(data.message ?? "")}
            nodeId={id}
            fieldKey="message"
            placeholder="Enter message..."
          />
        )}
        {showLabel && (
          <EditableText
            label="Label"
            value={String(data.label ?? "")}
            nodeId={id}
            fieldKey="label"
            placeholder="label-name"
          />
        )}
        {showUrl && (
          <EditableText
            label="URL"
            value={String(data.url ?? "")}
            nodeId={id}
            fieldKey="url"
            placeholder="https://..."
          />
        )}
      </NodeShell>
    </>
  )
})
ActionNode.displayName = "ActionNode"

export const DelayNode = memo(({ data, selected }: NodeProps) => {
  const value = (data.durationValue as number) ?? 5
  const unit = (data.durationUnit as string) ?? "m"
  const label = `${value}${unitLabels[unit] ?? unit}`
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className={`${handleBase} !-top-1.5`}
      />
      <NodeShell
        type="delay"
        icon={nodeIcons.delay}
        label="Delay"
        sublabel={`Wait ${label}`}
        selected={selected}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={`${handleBase} !-bottom-1.5`}
      />
    </>
  )
})
DelayNode.displayName = "DelayNode"

const transformLabels: Record<string, string> = {
  fetch_github_user: "Fetch GitHub User",
  compute_score: "Compute Score",
  fetch_pr_files: "Fetch PR Files",
  fetch_repo_activity: "Fetch Repo Activity",
  count_recent_prs: "Count Recent PRs",
  detect_language: "Detect Language",
  scan_history: "Scan Repo History",
}

export const TransformNode = memo(({ data, selected }: NodeProps) => {
  const transform = (data.transform as string) ?? "fetch_github_user"
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className={`${handleBase} !-top-1.5`}
      />
      <NodeShell
        type="transform"
        icon={nodeIcons.transform}
        label={transformLabels[transform] ?? transform}
        sublabel="Transform / Enrich"
        selected={selected}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={`${handleBase} !-bottom-1.5`}
      />
    </>
  )
})
TransformNode.displayName = "TransformNode"

export const nodeTypes = {
  trigger: TriggerNode,
  rule: RuleNode,
  condition: ConditionNode,
  logic: LogicNode,
  action: ActionNode,
  delay: DelayNode,
  transform: TransformNode,
}

export {
  HIDDEN_RULES,
  RULE_KEYS,
  actionLabels,
  nodeColors,
  nodeIcons,
  ruleLabels,
  triggerLabels,
}
