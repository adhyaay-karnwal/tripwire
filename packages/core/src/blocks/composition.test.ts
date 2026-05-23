import { describe, it, expect } from "vitest"
import { executeWorkflow } from "../workflow-executor"
import { makeCtx } from "../test-fixtures"

interface Node {
  id: string
  type: string
  data: Record<string, unknown>
}

interface Edge {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
}

describe("workflow composition", () => {
  it("runs trigger → rule (pass) → action end-to-end", () => {
    const nodes: Node[] = [
      { id: "t", type: "trigger", data: { trigger: "pr_opened" } },
      {
        id: "r",
        type: "rule",
        data: { rule: "accountAge", params: { days: 30 } },
      },
      {
        id: "a",
        type: "action",
        data: { action: "log", message: "ok" },
      },
    ]
    const edges: Edge[] = [
      { id: "e1", source: "t", target: "r" },
      { id: "e2", source: "r", target: "a", sourceHandle: "pass" },
    ]
    const steps = executeWorkflow(
      nodes,
      edges,
      makeCtx({ signals: { accountAgeDays: 365 } })
    )

    expect(steps.map((s) => s.nodeId)).toEqual(["t", "r", "a"])
    expect(steps[1].status).toBe("pass")
    expect(steps[2].status).toBe("executed")
    expect(steps[2].detail).toContain("log")
  })

  it("routes to the fail branch when a rule fails", () => {
    const nodes: Node[] = [
      { id: "t", type: "trigger", data: { trigger: "pr_opened" } },
      {
        id: "r",
        type: "rule",
        data: { rule: "accountAge", params: { days: 365 } },
      },
      { id: "pass", type: "action", data: { action: "log" } },
      { id: "fail", type: "action", data: { action: "block" } },
    ]
    const edges: Edge[] = [
      { id: "e1", source: "t", target: "r" },
      { id: "e2", source: "r", target: "pass", sourceHandle: "pass" },
      { id: "e3", source: "r", target: "fail", sourceHandle: "fail" },
    ]
    const steps = executeWorkflow(
      nodes,
      edges,
      makeCtx({ signals: { accountAgeDays: 5 } })
    )

    expect(steps.find((s) => s.nodeId === "r")?.status).toBe("fail")
    expect(steps.find((s) => s.nodeId === "fail")?.status).toBe("executed")
    expect(steps.find((s) => s.nodeId === "pass")?.status).toBe("skipped")
  })

  it("combines rules with an AND gate", () => {
    const nodes: Node[] = [
      { id: "t", type: "trigger", data: { trigger: "pr_opened" } },
      {
        id: "r1",
        type: "rule",
        data: { rule: "accountAge", params: { days: 30 } },
      },
      {
        id: "r2",
        type: "rule",
        data: { rule: "minMergedPrs", params: { count: 5 } },
      },
      { id: "g", type: "logic", data: { gate: "AND" } },
      { id: "a", type: "action", data: { action: "log" } },
    ]
    const edges: Edge[] = [
      { id: "e1", source: "t", target: "r1" },
      { id: "e2", source: "t", target: "r2" },
      { id: "e3", source: "r1", target: "g", sourceHandle: "pass" },
      { id: "e4", source: "r2", target: "g", sourceHandle: "pass" },
      { id: "e5", source: "g", target: "a" },
    ]
    const steps = executeWorkflow(
      nodes,
      edges,
      makeCtx({ signals: { accountAgeDays: 365, mergedPrs: 20 } })
    )

    const gate = steps.find((s) => s.nodeId === "g")
    expect(gate?.status).toBe("pass")
    expect(gate?.detail).toBe("2 of 2 inputs passed (needs all)")
    expect(steps.find((s) => s.nodeId === "a")?.status).toBe("executed")
  })

  it("AND gate reports FALSE when one rule fails (failing rule's pass-edge is skipped)", () => {
    const nodes: Node[] = [
      { id: "t", type: "trigger", data: { trigger: "pr_opened" } },
      {
        id: "r1",
        type: "rule",
        data: { rule: "accountAge", params: { days: 30 } },
      },
      {
        id: "r2",
        type: "rule",
        data: { rule: "minMergedPrs", params: { count: 50 } },
      },
      { id: "g", type: "logic", data: { gate: "AND" } },
    ]
    const edges: Edge[] = [
      { id: "e1", source: "t", target: "r1" },
      { id: "e2", source: "t", target: "r2" },
      { id: "e3", source: "r1", target: "g", sourceHandle: "pass" },
      { id: "e4", source: "r2", target: "g", sourceHandle: "pass" },
    ]
    const steps = executeWorkflow(
      nodes,
      edges,
      makeCtx({ signals: { accountAgeDays: 365, mergedPrs: 2 } })
    )

    expect(steps.find((s) => s.nodeId === "r2")?.status).toBe("fail")
    const gate = steps.find((s) => s.nodeId === "g")
    expect(gate?.status).toBe("fail")
    expect(gate?.detail).toBe("1 of 2 inputs passed (needs all)")
  })

  it("regression: repoActivityMinimum reads from nonForkRepos signal", () => {
    const nodes: Node[] = [
      { id: "t", type: "trigger", data: { trigger: "pr_opened" } },
      {
        id: "r",
        type: "rule",
        data: { rule: "repoActivityMinimum", params: { minRepos: 3 } },
      },
      { id: "pass", type: "action", data: { action: "log" } },
      { id: "fail", type: "action", data: { action: "block" } },
    ]
    const edges: Edge[] = [
      { id: "e1", source: "t", target: "r" },
      { id: "e2", source: "r", target: "pass", sourceHandle: "pass" },
      { id: "e3", source: "r", target: "fail", sourceHandle: "fail" },
    ]
    const passingCtx = makeCtx({ signals: { nonForkRepos: 5 } })
    const passingSteps = executeWorkflow(nodes, edges, passingCtx)
    expect(passingSteps.find((s) => s.nodeId === "r")?.status).toBe("pass")

    const failingCtx = makeCtx({ signals: { nonForkRepos: 1 } })
    const failingSteps = executeWorkflow(nodes, edges, failingCtx)
    expect(failingSteps.find((s) => s.nodeId === "r")?.status).toBe("fail")
  })

  it("regression: repoActivityMinimum does NOT read the dead publicNonForkRepos key", () => {
    const nodes: Node[] = [
      { id: "t", type: "trigger", data: { trigger: "pr_opened" } },
      {
        id: "r",
        type: "rule",
        data: { rule: "repoActivityMinimum", params: { minRepos: 3 } },
      },
    ]
    const edges: Edge[] = [{ id: "e1", source: "t", target: "r" }]
    const ctx = makeCtx({
      signals: { publicNonForkRepos: 100, nonForkRepos: 0 },
    })
    const steps = executeWorkflow(nodes, edges, ctx)
    expect(steps.find((s) => s.nodeId === "r")?.status).toBe("fail")
  })

  it("condition node splits true/false branches by signal value", () => {
    const nodes: Node[] = [
      { id: "t", type: "trigger", data: { trigger: "pr_opened" } },
      {
        id: "c",
        type: "condition",
        data: { field: "score", operator: ">", value: "50" },
      },
      { id: "tBranch", type: "action", data: { action: "log" } },
      { id: "fBranch", type: "action", data: { action: "block" } },
    ]
    const edges: Edge[] = [
      { id: "e1", source: "t", target: "c" },
      { id: "e2", source: "c", target: "tBranch", sourceHandle: "true" },
      { id: "e3", source: "c", target: "fBranch", sourceHandle: "false" },
    ]
    const steps = executeWorkflow(
      nodes,
      edges,
      makeCtx({ signals: { score: 88 } })
    )
    expect(steps.find((s) => s.nodeId === "tBranch")?.status).toBe("executed")
    expect(steps.find((s) => s.nodeId === "fBranch")?.status).toBe("skipped")
  })

  it("flags nodes that aren't reachable from any trigger as skipped", () => {
    const nodes: Node[] = [
      { id: "t", type: "trigger", data: { trigger: "pr_opened" } },
      {
        id: "orphan",
        type: "action",
        data: { action: "log" },
      },
    ]
    const steps = executeWorkflow(nodes, [], makeCtx())
    expect(steps.find((s) => s.nodeId === "orphan")?.status).toBe("skipped")
    expect(steps.find((s) => s.nodeId === "orphan")?.detail).toContain(
      "Unreachable"
    )
  })

  it("NOT gate inverts the input outcome", () => {
    const nodes: Node[] = [
      { id: "t", type: "trigger", data: { trigger: "pr_opened" } },
      {
        id: "r",
        type: "rule",
        data: { rule: "accountAge", params: { days: 30 } },
      },
      { id: "g", type: "logic", data: { gate: "NOT" } },
    ]
    const edges: Edge[] = [
      { id: "e1", source: "t", target: "r" },
      { id: "e2", source: "r", target: "g", sourceHandle: "pass" },
    ]

    const failSteps = executeWorkflow(
      nodes,
      edges,
      makeCtx({ signals: { accountAgeDays: 5 } })
    )
    expect(failSteps.find((s) => s.nodeId === "g")?.status).toBe("skipped")

    const passSteps = executeWorkflow(
      nodes,
      edges,
      makeCtx({ signals: { accountAgeDays: 365 } })
    )
    const gateStep = passSteps.find((s) => s.nodeId === "g")
    expect(gateStep?.status).toBe("fail")
    expect(gateStep?.detail).toBe("input passed (inverted)")
  })
})
