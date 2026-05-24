import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { Edge, Node } from "@xyflow/react"
import { Button } from "@tripwire/ui/button"
import { UserCircleMutedIcon13 } from "@tripwire/ui/icons/app-chrome-icons"
import { useTRPC } from "#/integrations/trpc/react"
import {
  simulateWorkflow,
  type SimMode,
  type SimNodeResult,
} from "#/lib/workflow/graph-evaluator"
import { collectSimInputs, type SimInput } from "#/lib/workflow/sim-context"
import {
  actionLabels,
  ruleLabels,
  triggerLabels,
} from "#/components/layout/app/automations/node-types"

interface SimulationPanelProps {
  nodes: Node[]
  edges: Edge[]
  simResults: SimNodeResult[] | null
  setSimResults: (r: SimNodeResult[] | null) => void
  simStep: number
  setSimStep: (s: number) => void
  repoId?: string
}

export function SimulationPanel({
  nodes,
  edges,
  simResults,
  setSimResults,
  simStep,
  setSimStep,
  repoId,
}: SimulationPanelProps) {
  const trpc = useTRPC()
  const [mode, setMode] = useState<SimMode>("user")
  const [username, setUsername] = useState("")
  const [contextValues, setContextValues] = useState<Record<string, unknown>>(
    {}
  )
  const [error, setError] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [userCard, setUserCard] = useState<{
    login: string
    avatarUrl: string
    name: string | null
  } | null>(null)

  const fetchUser = useMutation(trpc.workflows.simulate.mutationOptions())

  const suggestionsQuery = useQuery(
    trpc.events.activeUsers.queryOptions(
      { repoId: repoId ?? "", days: 90 },
      { enabled: !!repoId && mode === "user", staleTime: 60_000 }
    )
  )
  const suggestions = (suggestionsQuery.data ?? []).slice(0, 8)

  const simInputs = useMemo(
    () => collectSimInputs(nodes, edges),
    [nodes, edges]
  )

  useEffect(() => {
    if (!isAnimating || !simResults) return
    if (simStep >= simResults.length) {
      setIsAnimating(false)
      return
    }
    const currentResult = simResults[simStep - 1]
    const delay = currentResult?.pauseMs ?? 400
    const timer = setTimeout(() => setSimStep(simStep + 1), delay)
    return () => clearTimeout(timer)
  }, [isAnimating, simStep, simResults, setSimStep])

  const setField = (key: string, value: unknown) => {
    setContextValues((prev) => ({ ...prev, [key]: value }))
  }

  const fetchAndFill = async () => {
    if (!username.trim()) {
      setError("Enter a GitHub username")
      return
    }
    setError(null)
    const result = await fetchUser.mutateAsync({
      username: username.trim(),
      repoId,
    })
    if (!result.found) {
      setError(`User "${username}" not found`)
      return
    }
    setUserCard(result.user)
    setContextValues((prev) => ({
      ...prev,
      ...(result.data as Record<string, unknown>),
      username: result.user.login,
    }))
  }

  const runSim = () => {
    setError(null)
    setSimStep(0)
    const results = simulateWorkflow(
      nodes,
      edges,
      mode,
      contextValues,
      actionLabels
    )
    setSimResults(results)
    setSimStep(0)
    setIsAnimating(true)
  }

  const clear = () => {
    setSimResults(null)
    setUserCard(null)
    setError(null)
    setSimStep(0)
    setIsAnimating(false)
  }

  const visibleResults = simResults?.slice(0, simStep) ?? []
  const passCount = visibleResults.filter((r) => r.status === "pass").length
  const failCount = visibleResults.filter((r) => r.status === "fail").length
  const execCount = visibleResults.filter((r) => r.status === "executed").length

  const displayRows = useMemo(
    () => groupResultsByGate(visibleResults, nodes, edges),
    [visibleResults, nodes, edges]
  )

  const groupedInputs = useMemo(() => {
    const groups: Record<string, SimInput[]> = {}
    for (const input of simInputs) {
      const group =
        input.source === "user"
          ? "User Data"
          : input.source === "content"
            ? "Content"
            : "Manual"
      if (!groups[group]) groups[group] = []
      groups[group].push(input)
    }
    return groups
  }, [simInputs])

  const hasUserInputs = Object.keys(groupedInputs).some(
    (g) => g === "User Data"
  )
  const hasContentInputs = Object.keys(groupedInputs).some(
    (g) => g === "Content"
  )

  return (
    <div className="flex w-[300px] shrink-0 flex-col overflow-auto border-l border-tw-border bg-tw-surface">
      <div className="px-3 pt-3 pb-2">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[13px] font-medium text-tw-text-primary">
            Test run
          </span>
          {simResults && (
            <Button
              variant="ghost"
              size="xs"
              onClick={clear}
              className="text-[11px] text-[#FFFFFF40] hover:text-[#FFFFFF73]"
            >
              Clear
            </Button>
          )}
        </div>
        <p className="m-0 mb-3 text-[11px] leading-relaxed text-[#FFFFFF40]">
          Run your workflow against test data to see how each node evaluates.
        </p>

        <div className="mb-3 flex items-center gap-1 rounded-[10px] bg-tw-card p-1">
          {[
            ["user", "Real User"] as const,
            ["pass", "Force Pass"] as const,
            ["fail", "Force Fail"] as const,
          ].map(([m, label]) => (
            <Button
              variant="ghost"
              key={m}
              type="button"
              onClick={() => {
                setMode(m)
                clear()
              }}
              className={`flex h-7 flex-1 cursor-pointer items-center justify-center rounded-[6px] px-2 text-[12px] font-medium transition-colors ${
                mode === m
                  ? "bg-[#FAFAFA1A] text-[#EEEEEE]"
                  : "text-[#9F9FA9] hover:text-[#EEEEEE]"
              }`}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {mode === "user" && (
        <div className="px-3 pb-3">
          <div className="mb-2 flex h-9 items-center gap-2 rounded-[10px] bg-tw-card px-2.5">
            <UserCircleMutedIcon13 className="text-[#6E6E6E]" />
            <input
              type="text"
              placeholder="GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchAndFill()}
              className="flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-[#6E6E6E]"
            />
            <Button
              variant="link"
              size="xs"
              onClick={fetchAndFill}
              disabled={fetchUser.isPending || !username.trim()}
              className="h-auto shrink-0 p-0 text-[11px] text-tw-accent"
            >
              {fetchUser.isPending ? "..." : "Fetch"}
            </Button>
          </div>

          {suggestions.length > 0 && !username && !userCard && (
            <div className="mb-2 flex flex-wrap gap-1">
              {suggestions.map((s) => (
                <Button
                  key={s.username}
                  variant="ghost"
                  size="xs"
                  onClick={() => setUsername(s.username ?? "")}
                  className="gap-1.5 bg-tw-card text-left hover:bg-tw-hover"
                >
                  <img
                    src={`https://github.com/${s.username}.png?size=24`}
                    alt=""
                    className="size-4 rounded-full"
                  />
                  <span className="text-[11px] text-tw-text-secondary">
                    {s.username}
                  </span>
                </Button>
              ))}
            </div>
          )}

          {userCard && (
            <div className="mb-3 flex items-center gap-2.5">
              <img
                src={userCard.avatarUrl}
                alt=""
                className="size-7 rounded-full"
              />
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-[12px] font-medium text-tw-text-primary">
                  {userCard.name ?? userCard.login}
                </p>
                <p className="m-0 text-[10px] text-[#FFFFFF40]">
                  @{userCard.login}
                </p>
              </div>
            </div>
          )}

          {simInputs.length > 0 && (
            <>
              {hasUserInputs && (
                <div className="mb-3">
                  <p className="m-0 mb-2 text-[11px] text-[#FFFFFF40]">
                    {userCard
                      ? "Fetched from GitHub. Edit to test edge cases."
                      : "Enter test values for the contributor profile."}
                  </p>
                  <div className="overflow-hidden rounded-[10px] bg-tw-card">
                    {(groupedInputs["User Data"] ?? []).map((input, idx) => (
                      <div
                        key={input.key}
                        className={`flex h-8 items-center justify-between gap-2 px-3 ${idx > 0 ? "border-t border-[#FFFFFF08]" : ""}`}
                      >
                        <span className="shrink-0 text-[11px] text-[#FFFFFF59]">
                          {input.label}
                        </span>
                        {input.type === "boolean" ? (
                          <Button
                            variant="ghost"
                            type="button"
                            onClick={() =>
                              setField(input.key, !contextValues[input.key])
                            }
                            className="bg-transparent text-right text-[12px] text-tw-text-primary tabular-nums outline-none"
                          >
                            {contextValues[input.key] ? "true" : "false"}
                          </Button>
                        ) : (
                          <input
                            type={input.type === "number" ? "number" : "text"}
                            value={String(contextValues[input.key] ?? "")}
                            onChange={(e) =>
                              setField(
                                input.key,
                                input.type === "number"
                                  ? Number(e.target.value)
                                  : e.target.value
                              )
                            }
                            className="min-w-0 flex-1 bg-transparent text-right text-[12px] text-tw-text-primary tabular-nums outline-none"
                            placeholder="0"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasContentInputs && (
                <div className="mb-3">
                  <p className="m-0 mb-2 text-[11px] text-[#FFFFFF40]">
                    Content to test against language and pattern rules.
                  </p>
                  {(groupedInputs["Content"] ?? []).map((input) => (
                    <textarea
                      key={input.key}
                      value={String(contextValues[input.key] ?? "")}
                      onChange={(e) => setField(input.key, e.target.value)}
                      placeholder="Paste PR body, issue text, or comment..."
                      rows={3}
                      className="w-full resize-none rounded-[10px] bg-tw-card px-3 py-2 text-[12px] text-tw-text-primary outline-none placeholder:text-[#6E6E6E]"
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="mt-auto px-3 pb-3">
        {error && <p className="mb-2 text-[11px] text-tw-error">{error}</p>}
        <Button
          variant="default"
          size="sm"
          onClick={runSim}
          disabled={fetchUser.isPending}
          className="w-full"
        >
          Run test
        </Button>
      </div>

      {simResults && (
        <div className="flex-1 overflow-auto">
          <div className="flex items-center gap-3 border-t border-tw-border px-3 py-2.5">
            <span className="text-[11px] text-tw-text-tertiary tabular-nums">
              {passCount} pass
            </span>
            <span className="text-[11px] text-tw-text-tertiary tabular-nums">
              {failCount} fail
            </span>
            <span className="text-[11px] text-tw-text-tertiary tabular-nums">
              {execCount} exec
            </span>
            {isAnimating && (
              <span className="ml-auto text-[10px] text-tw-text-tertiary tabular-nums">
                {simStep}/{simResults.length}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-0.5 px-3 pb-3">
            {displayRows.map((row) => {
              if (row.kind === "single") {
                const r = row.result
                const latestIdx = visibleResults.length - 1
                const isLatest =
                  isAnimating && r.nodeId === visibleResults[latestIdx]?.nodeId
                const isDelayWaiting =
                  isLatest && r.pauseMs != null && r.pauseMs > 400
                return (
                  <div
                    key={r.nodeId}
                    className={`rounded-lg px-2.5 py-2 transition-colors duration-200 ${
                      isLatest ? "bg-tw-card" : "hover:bg-[#ffffff04]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[13px] text-tw-text-primary">
                        {labelFor(r, nodes)}
                      </span>
                      {isDelayWaiting ? (
                        <div className="h-3 w-3 shrink-0 animate-spin rounded-full border-[1.5px] border-[#FFFFFF40] border-t-transparent" />
                      ) : (
                        <span
                          className={`text-[10px] tabular-nums ${statusColorFor(r.status)} shrink-0`}
                        >
                          {statusTextFor(r.status)}
                        </span>
                      )}
                    </div>
                    {r.detail && (
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[#FFFFFF40]">
                        {r.detail}
                      </p>
                    )}
                  </div>
                )
              }

              const { gate } = row
              const latestIdx = visibleResults.length - 1
              const latestId = visibleResults[latestIdx]?.nodeId
              const isLatest = isAnimating && gate.nodeId === latestId
              const lineColor =
                gate.status === "fail"
                  ? "bg-tw-error/40"
                  : gate.status === "pass"
                    ? "bg-white/15"
                    : "bg-white/10"
              return (
                <div
                  key={gate.nodeId}
                  className={`flex flex-col items-stretch gap-0.5 px-1 py-1.5 ${
                    isLatest ? "rounded-md bg-tw-card/40" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-px flex-1 ${lineColor}`} />
                    <span className="text-[11px] font-medium text-tw-text-secondary">
                      {labelFor(gate, nodes)}
                    </span>
                    <span
                      className={`text-[10px] tabular-nums ${statusColorFor(gate.status)}`}
                    >
                      {statusTextFor(gate.status)}
                    </span>
                    <div className={`h-px flex-1 ${lineColor}`} />
                  </div>
                  {gate.detail && (
                    <p className="text-center text-[10px] leading-snug text-[#FFFFFF40]">
                      {gate.detail}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

type DisplayRow =
  | { kind: "single"; result: SimNodeResult }
  | { kind: "divider"; gate: SimNodeResult }

function groupResultsByGate(
  visibleResults: SimNodeResult[],
  nodes: Node[],
  edges: Edge[]
): DisplayRow[] {
  const gateInputs = new Map<string, SimNodeResult[]>()
  const usedAsInput = new Set<string>()
  for (const r of visibleResults) {
    const node = nodes.find((n) => n.id === r.nodeId)
    if (node?.type !== "logic") continue
    const ids = edges.filter((e) => e.target === r.nodeId).map((e) => e.source)
    const ins = visibleResults.filter((vr) => ids.includes(vr.nodeId))
    gateInputs.set(r.nodeId, ins)
    for (const inp of ins) usedAsInput.add(inp.nodeId)
  }

  const out: DisplayRow[] = []
  const emitted = new Set<string>()
  for (const r of visibleResults) {
    if (emitted.has(r.nodeId)) continue
    if (usedAsInput.has(r.nodeId)) continue
    const node = nodes.find((n) => n.id === r.nodeId)
    if (node?.type === "logic") {
      const ins = gateInputs.get(r.nodeId) ?? []
      if (ins.length === 2) {
        out.push({ kind: "single", result: ins[0] })
        out.push({ kind: "divider", gate: r })
        out.push({ kind: "single", result: ins[1] })
        emitted.add(ins[0].nodeId)
        emitted.add(ins[1].nodeId)
        emitted.add(r.nodeId)
        continue
      }
      if (ins.length === 1) {
        out.push({ kind: "single", result: ins[0] })
        out.push({ kind: "divider", gate: r })
        emitted.add(ins[0].nodeId)
        emitted.add(r.nodeId)
        continue
      }
      if (ins.length >= 3) {
        for (const inp of ins) {
          out.push({ kind: "single", result: inp })
          emitted.add(inp.nodeId)
        }
        out.push({ kind: "divider", gate: r })
        emitted.add(r.nodeId)
        continue
      }
    }
    out.push({ kind: "single", result: r })
    emitted.add(r.nodeId)
  }
  return out
}

function labelFor(r: SimNodeResult, nodes: Node[]): string {
  const node = nodes.find((n) => n.id === r.nodeId)
  if (!node) return "Node"
  if (node.type === "trigger")
    return triggerLabels[node.data.trigger as string] ?? "Trigger"
  if (node.type === "rule")
    return ruleLabels[node.data.rule as string] ?? "Rule"
  if (node.type === "action")
    return actionLabels[node.data.action as string] ?? "Action"
  if (node.type === "logic") return `${node.data.gate as string} Gate`
  if (node.type === "condition") return "Condition"
  if (node.type === "delay") return "Delay"
  if (node.type === "transform") return "Transform"
  return node.type ?? "Node"
}

function statusTextFor(s: SimNodeResult["status"]): string {
  return s === "pass"
    ? "pass"
    : s === "fail"
      ? "fail"
      : s === "executed"
        ? "exec"
        : "skip"
}

function statusColorFor(s: SimNodeResult["status"]): string {
  return s === "pass"
    ? "text-[#FFFFFF59]"
    : s === "fail"
      ? "text-tw-error"
      : "text-[#FFFFFF40]"
}
