import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@tripwire/db/client";
import { workflows } from "@tripwire/db";
import {
  assertRepoOwner,
  getNodesByCategory,
  NODE_REGISTRY,
  applyWorkflowOperations,
} from "@tripwire/core";
import { workflowOperationsArraySchema } from "@tripwire/core";
import { logEvent } from "@tripwire/core";
import {
  type AnyToolDefinition,
  defineTool,
  makeSpec,
} from "../registry";
import { requireRepoId } from "../helpers";

const getNodeTypes = defineTool({
  name: "get_node_types",
  description:
    "Returns the node type registry so you know what nodes are available for building workflows. Optionally filter by category (Triggers, Rules, Conditions, Logic Gates, Actions, Delays, Transforms).",
  needsRepo: false,
  surfaces: ["chat"] as const,
  inputSchema: z.object({
    category: z
      .string()
      .optional()
      .describe(
        "Filter by category name: Triggers, Rules, Conditions, Logic Gates, Actions, Delays, or Transforms",
      ),
  }),
  handler: async ({ category }) => {
    if (category) {
      const map = getNodesByCategory(category);
      const entries = map.get(category);
      if (!entries || entries.length === 0) {
        return { categories: {}, hint: `No nodes found for category "${category}". Available: Triggers, Rules, Conditions, Logic Gates, Actions, Delays, Transforms.` };
      }
      return { categories: { [category]: entries } };
    }
    const map = getNodesByCategory();
    const categories: Record<string, typeof NODE_REGISTRY> = {};
    for (const [cat, entries] of map) {
      categories[cat] = entries;
    }
    return { categories };
  },
  chatRender: (output) =>
    makeSpec("Text", {
      content: Object.entries(output.categories)
        .map(
          ([cat, entries]) =>
            `**${cat}**: ${(entries as Array<{ name: string; subtype: string }>).map((e) => `${e.name} (${e.subtype})`).join(", ")}`,
        )
        .join("\n\n"),
    }),
});

const createWorkflow = defineTool({
  name: "create_workflow",
  description:
    "Create a new automation workflow for the current repo. Returns the workflow ID. Use edit_workflow next to add nodes and edges.",
  needsApproval: true,
  inputSchema: z.object({
    name: z.string().min(1).describe("Workflow name"),
    description: z.string().optional().describe("Optional description"),
  }),
  handler: async ({ name, description }, ctx) => {
    const repoId = requireRepoId(ctx);
    await assertRepoOwner(ctx.userId, repoId);

    const [row] = await db
      .insert(workflows)
      .values({
        repoId,
        name,
        description: description ?? null,
        definition: { nodes: [], edges: [] },
        enabled: false,
      })
      .returning({ id: workflows.id });

    await logEvent({
      repoId,
      action: "rule_config_updated",
      severity: "info",
      description: `Workflow "${name}" created`,
      metadata: {
        workflowId: row.id,
        updatedBy: ctx.userName ?? null,
        viaTool: true,
      },
    });

    return { ok: true, message: `Workflow "${name}" created.`, data: { workflowId: row.id } };
  },
});

const editWorkflow = defineTool({
  name: "edit_workflow",
  description:
    "Apply operations to modify a workflow's node graph. Operations: add_node (type + subtype), edit_node (update data/position), delete_node, add_edge (connect nodes), delete_edge. Call get_node_types first to see available node types and subtypes.",
  needsApproval: true,
  inputSchema: z.object({
    workflowId: z.string().uuid().describe("Workflow ID"),
    operations: workflowOperationsArraySchema.describe(
      "Array of operations to apply (add_node, edit_node, delete_node, add_edge, delete_edge)",
    ),
  }),
  handler: async ({ workflowId, operations }, ctx) => {
    const repoId = requireRepoId(ctx);
    await assertRepoOwner(ctx.userId, repoId);

    const [wf] = await db
      .select()
      .from(workflows)
      .where(eq(workflows.id, workflowId))
      .limit(1);

    if (!wf) {
      return { ok: false, message: `Workflow "${workflowId}" not found.` };
    }
    if (wf.repoId !== repoId) {
      return { ok: false, message: "Workflow does not belong to this repo." };
    }

    const current = wf.definition ?? { nodes: [], edges: [] };
    const { state: next, errors, warnings } = applyWorkflowOperations(current, operations);

    if (errors.length > 0) {
      return {
        ok: false,
        message: `Operations failed: ${errors.join("; ")}`,
        data: { errors, warnings },
      };
    }

    await db
      .update(workflows)
      .set({ definition: next, updatedAt: new Date() })
      .where(eq(workflows.id, workflowId));

    const addedNodes = operations.filter((o) => o.op === "add_node").length;
    const editedNodes = operations.filter((o) => o.op === "edit_node").length;
    const deletedNodes = operations.filter((o) => o.op === "delete_node").length;
    const addedEdges = operations.filter((o) => o.op === "add_edge").length;
    const deletedEdges = operations.filter((o) => o.op === "delete_edge").length;

    const parts: string[] = [];
    if (addedNodes) parts.push(`${addedNodes} node(s) added`);
    if (editedNodes) parts.push(`${editedNodes} node(s) edited`);
    if (deletedNodes) parts.push(`${deletedNodes} node(s) deleted`);
    if (addedEdges) parts.push(`${addedEdges} edge(s) added`);
    if (deletedEdges) parts.push(`${deletedEdges} edge(s) deleted`);
    const summary = parts.join(", ") || "No changes";

    await logEvent({
      repoId,
      action: "rule_config_updated",
      severity: "info",
      description: `Workflow "${wf.name}" edited: ${summary}`,
      metadata: {
        workflowId,
        operationCount: operations.length,
        updatedBy: ctx.userName ?? null,
        viaTool: true,
      },
    });

    return {
      ok: true,
      message: summary,
      data: {
        workflowId,
        nodeCount: next.nodes.length,
        edgeCount: next.edges.length,
        warnings: warnings.length > 0 ? warnings : undefined,
      },
    };
  },
});

const deleteWorkflow = defineTool({
  name: "delete_workflow",
  description: "Delete a workflow by ID.",
  needsApproval: true,
  inputSchema: z.object({
    workflowId: z.string().uuid().describe("Workflow ID to delete"),
  }),
  handler: async ({ workflowId }, ctx) => {
    const repoId = requireRepoId(ctx);
    await assertRepoOwner(ctx.userId, repoId);

    const [wf] = await db
      .select({ id: workflows.id, name: workflows.name, repoId: workflows.repoId })
      .from(workflows)
      .where(eq(workflows.id, workflowId))
      .limit(1);

    if (!wf) {
      return { ok: false, message: `Workflow "${workflowId}" not found.` };
    }
    if (wf.repoId !== repoId) {
      return { ok: false, message: "Workflow does not belong to this repo." };
    }

    await db.delete(workflows).where(eq(workflows.id, workflowId));

    await logEvent({
      repoId,
      action: "rule_config_updated",
      severity: "info",
      description: `Workflow "${wf.name}" deleted`,
      metadata: {
        workflowId,
        updatedBy: ctx.userName ?? null,
        viaTool: true,
      },
    });

    return { ok: true, message: `Workflow "${wf.name}" deleted.` };
  },
});

const enableWorkflow = defineTool({
  name: "enable_workflow",
  description: "Enable or disable a workflow.",
  needsApproval: true,
  inputSchema: z.object({
    workflowId: z.string().uuid().describe("Workflow ID"),
    enabled: z.boolean().describe("true to enable, false to disable"),
  }),
  handler: async ({ workflowId, enabled }, ctx) => {
    const repoId = requireRepoId(ctx);
    await assertRepoOwner(ctx.userId, repoId);

    const [wf] = await db
      .select({ id: workflows.id, name: workflows.name, repoId: workflows.repoId })
      .from(workflows)
      .where(eq(workflows.id, workflowId))
      .limit(1);

    if (!wf) {
      return { ok: false, message: `Workflow "${workflowId}" not found.` };
    }
    if (wf.repoId !== repoId) {
      return { ok: false, message: "Workflow does not belong to this repo." };
    }

    await db
      .update(workflows)
      .set({ enabled, updatedAt: new Date() })
      .where(eq(workflows.id, workflowId));

    const action = enabled ? "enabled" : "disabled";

    await logEvent({
      repoId,
      action: "rule_config_updated",
      severity: "info",
      description: `Workflow "${wf.name}" ${action}`,
      metadata: {
        workflowId,
        enabled,
        updatedBy: ctx.userName ?? null,
        viaTool: true,
      },
    });

    return { ok: true, message: `Workflow "${wf.name}" ${action}.` };
  },
});

const getWorkflow = defineTool({
  name: "get_workflow",
  description:
    "Get the full definition of a workflow by ID, including all nodes and edges.",
  inputSchema: z.object({
    workflowId: z.string().uuid().describe("Workflow ID"),
  }),
  handler: async ({ workflowId }, ctx) => {
    const repoId = requireRepoId(ctx);
    await assertRepoOwner(ctx.userId, repoId);

    const [wf] = await db
      .select()
      .from(workflows)
      .where(eq(workflows.id, workflowId))
      .limit(1);

    if (!wf) {
      return { found: false, workflowId };
    }
    if (wf.repoId !== repoId) {
      return { found: false, workflowId };
    }

    return {
      found: true,
      id: wf.id,
      name: wf.name,
      description: wf.description,
      enabled: wf.enabled,
      definition: wf.definition,
      updatedAt: wf.updatedAt.toISOString(),
    };
  },
  chatRender: (output) => {
    if (!output.found) {
      return makeSpec("Text", { content: `Workflow not found.` });
    }
    const def = output.definition as { nodes: Array<Record<string, unknown>>; edges: Array<Record<string, unknown>> };
    const nodeCount = (def.nodes ?? []).length;
    const edgeCount = (def.edges ?? []).length;
    return makeSpec("Text", {
      content: `**${output.name}** (${output.enabled ? "Active" : "Draft"})\n${nodeCount} nodes, ${edgeCount} edges`,
    });
  },
});

export const workflowTools: AnyToolDefinition[] = [
  getNodeTypes,
  createWorkflow,
  editWorkflow,
  deleteWorkflow,
  enableWorkflow,
  getWorkflow,
];
