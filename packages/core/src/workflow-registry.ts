import type { WorkflowNodeType } from "@tripwire/db";
import { RULE_META } from "@tripwire/db/schema/rule-meta";

export interface ParamDefinition {
  key: string;
  name: string;
  type: "string" | "number" | "boolean" | "select";
  required?: boolean;
  default?: unknown;
  options?: { label: string; value: string }[];
  description?: string;
}

export interface HandleDefinition {
  id: string;
  type: "source" | "target";
  position: "top" | "bottom";
  label?: string;
}

export interface NodeRegistryEntry {
  type: WorkflowNodeType;
  subtype: string;
  name: string;
  category: string;
  description: string;
  params: ParamDefinition[];
  handles: HandleDefinition[];
  hidden?: boolean;
}

const sourceBottom = (id = "source", label?: string): HandleDefinition => ({
  id,
  type: "source",
  position: "bottom",
  label,
});

const targetTop = (id = "target"): HandleDefinition => ({
  id,
  type: "target",
  position: "top",
});

const triggerHandles: HandleDefinition[] = [sourceBottom()];

const ruleHandles: HandleDefinition[] = [
  targetTop(),
  sourceBottom("pass", "pass"),
  sourceBottom("fail", "fail"),
];

const conditionHandles: HandleDefinition[] = [
  targetTop(),
  sourceBottom("true", "true"),
  sourceBottom("false", "false"),
];

const logicHandles: HandleDefinition[] = [targetTop(), sourceBottom()];
const actionHandles: HandleDefinition[] = [targetTop()];
const delayHandles: HandleDefinition[] = [targetTop(), sourceBottom()];
const transformHandles: HandleDefinition[] = [targetTop(), sourceBottom()];

const TRIGGER_ENTRIES: NodeRegistryEntry[] = [
  { type: "trigger", subtype: "pr_opened", name: "PR Opened", category: "Triggers", description: "Fires when a pull request is opened", params: [], handles: triggerHandles },
  { type: "trigger", subtype: "pr_edited", name: "PR Edited", category: "Triggers", description: "Fires when a pull request is edited", params: [], handles: triggerHandles },
  { type: "trigger", subtype: "issue_opened", name: "Issue Opened", category: "Triggers", description: "Fires when an issue is opened", params: [], handles: triggerHandles },
  { type: "trigger", subtype: "issue_edited", name: "Issue Edited", category: "Triggers", description: "Fires when an issue is edited", params: [], handles: triggerHandles },
  { type: "trigger", subtype: "comment_created", name: "Comment Created", category: "Triggers", description: "Fires when a comment is created on an issue or PR", params: [], handles: triggerHandles },
  { type: "trigger", subtype: "contributor_first_interaction", name: "First Interaction", category: "Triggers", description: "Fires on a contributor's first interaction with the repo", params: [], handles: triggerHandles },
  { type: "trigger", subtype: "schedule_daily", name: "Daily Schedule", category: "Triggers", description: "Fires once per day on a schedule", params: [], handles: triggerHandles },
  { type: "trigger", subtype: "schedule_weekly", name: "Weekly Schedule", category: "Triggers", description: "Fires once per week on a schedule", params: [], handles: triggerHandles },
  { type: "trigger", subtype: "manual", name: "Manual Run", category: "Triggers", description: "Fires when manually triggered by a user", params: [], handles: triggerHandles },
  { type: "trigger", subtype: "repo_scan", name: "Repo History Scan", category: "Triggers", description: "Scans repo history for past offenders", params: [], handles: triggerHandles },
];

const RULE_ENTRIES: NodeRegistryEntry[] = [
  {
    type: "rule", subtype: "accountAge", name: RULE_META.accountAge.name, category: "Rules",
    description: RULE_META.accountAge.description,
    params: [{ key: "days", name: "Minimum account age (days)", type: "number", default: 30, description: "Minimum number of days since account creation" }],
    handles: ruleHandles,
  },
  {
    type: "rule", subtype: "minMergedPrs", name: RULE_META.minMergedPrs.name, category: "Rules",
    description: RULE_META.minMergedPrs.description,
    params: [{ key: "count", name: "Minimum merged PRs", type: "number", default: 15, description: "Required number of merged PRs across GitHub" }],
    handles: ruleHandles,
  },
  {
    type: "rule", subtype: "requireProfileReadme", name: RULE_META.requireProfileReadme.name, category: "Rules",
    description: RULE_META.requireProfileReadme.description,
    params: [],
    handles: ruleHandles,
  },
  {
    type: "rule", subtype: "repoActivityMinimum", name: RULE_META.repoActivityMinimum.name, category: "Rules",
    description: RULE_META.repoActivityMinimum.description,
    params: [{ key: "minRepos", name: "Minimum public repos", type: "number", default: 3, description: "Minimum number of public non-fork repositories" }],
    handles: ruleHandles,
  },
  {
    type: "rule", subtype: "maxPrsPerDay", name: RULE_META.maxPrsPerDay.name, category: "Rules",
    description: RULE_META.maxPrsPerDay.description,
    params: [{ key: "limit", name: "Maximum PRs per day", type: "number", default: 5, description: "Maximum pull requests a single user can open per day" }],
    handles: ruleHandles,
  },
  {
    type: "rule", subtype: "maxFilesChanged", name: RULE_META.maxFilesChanged.name, category: "Rules",
    description: RULE_META.maxFilesChanged.description,
    params: [{ key: "limit", name: "Maximum files changed", type: "number", default: 20, description: "Maximum number of files a PR can touch" }],
    handles: ruleHandles,
  },
  {
    type: "rule", subtype: "language", name: RULE_META.languageRequirement.name, category: "Rules",
    description: RULE_META.languageRequirement.description,
    params: [{ key: "language", name: "Language", type: "string", default: "English", description: "Required language for contributions" }],
    handles: ruleHandles,
  },
  {
    type: "rule", subtype: "crypto", name: RULE_META.cryptoAddressDetection.name, category: "Rules",
    description: RULE_META.cryptoAddressDetection.description,
    params: [],
    handles: ruleHandles,
  },
  {
    type: "rule", subtype: "vouchedUsersOnly", name: RULE_META.vouchedUsersOnly.name, category: "Rules",
    description: RULE_META.vouchedUsersOnly.description,
    params: [
      {
        key: "vouchScope", name: "Vouch scope", type: "select", default: "repo",
        options: [
          { label: "Repo whitelist only", value: "repo" },
          { label: "Global vouches only", value: "global" },
          { label: "Both", value: "both" },
        ],
        description: "Which vouch source to check",
      },
    ],
    handles: ruleHandles,
  },
  {
    type: "rule", subtype: "aiHoneypot", name: RULE_META.aiHoneypot.name, category: "Rules",
    description: RULE_META.aiHoneypot.description,
    params: [],
    handles: ruleHandles,
  },
];

const CONDITION_ENTRIES: NodeRegistryEntry[] = [
  {
    type: "condition", subtype: "custom", name: "Condition", category: "Conditions",
    description: "Compare a field against a value using an operator",
    params: [
      { key: "field", name: "Field", type: "string", required: true, default: "score", description: "The data field to evaluate (e.g. score, accountAgeDays, publicRepos)" },
      {
        key: "operator", name: "Operator", type: "select", required: true, default: ">",
        options: [
          { label: ">", value: ">" },
          { label: ">=", value: ">=" },
          { label: "<", value: "<" },
          { label: "<=", value: "<=" },
          { label: "==", value: "==" },
          { label: "!=", value: "!=" },
          { label: "matches", value: "matches" },
        ],
        description: "Comparison operator",
      },
      { key: "value", name: "Value", type: "string", required: true, default: "50", description: "The value to compare against" },
    ],
    handles: conditionHandles,
  },
];

const LOGIC_ENTRIES: NodeRegistryEntry[] = [
  { type: "logic", subtype: "AND", name: "AND Gate", category: "Logic Gates", description: "All inputs must pass for output to pass", params: [{ key: "gate", name: "Gate", type: "string", default: "AND" }], handles: logicHandles },
  { type: "logic", subtype: "OR", name: "OR Gate", category: "Logic Gates", description: "Any input passing causes output to pass", params: [{ key: "gate", name: "Gate", type: "string", default: "OR" }], handles: logicHandles },
  { type: "logic", subtype: "NOT", name: "NOT Gate", category: "Logic Gates", description: "Inverts the input result", params: [{ key: "gate", name: "Gate", type: "string", default: "NOT" }], handles: logicHandles },
];

const ACTION_ENTRIES: NodeRegistryEntry[] = [
  { type: "action", subtype: "block", name: "Block", category: "Actions", description: "Close the PR/issue immediately", params: [{ key: "message", name: "Message", type: "string", description: "Optional message to include when blocking" }], handles: actionHandles },
  { type: "action", subtype: "warn", name: "Warn", category: "Actions", description: "Leave a warning comment but keep the content open", params: [{ key: "message", name: "Message", type: "string", description: "Warning message text" }], handles: actionHandles },
  { type: "action", subtype: "log", name: "Log Event", category: "Actions", description: "Record the event silently without taking any GitHub action", params: [{ key: "message", name: "Message", type: "string", description: "Log message" }], handles: actionHandles },
  { type: "action", subtype: "close", name: "Close", category: "Actions", description: "Close the PR or issue", params: [], handles: actionHandles },
  { type: "action", subtype: "label", name: "Add Label", category: "Actions", description: "Add a label to the PR or issue", params: [{ key: "label", name: "Label", type: "string", required: true, description: "Label name to add" }], handles: actionHandles },
  { type: "action", subtype: "comment", name: "Comment", category: "Actions", description: "Post a comment on the PR or issue", params: [{ key: "message", name: "Message", type: "string", required: true, description: "Comment body text" }], handles: actionHandles },
  { type: "action", subtype: "add_to_whitelist", name: "Whitelist", category: "Actions", description: "Add the contributor to the repo whitelist", params: [], handles: actionHandles },
  { type: "action", subtype: "add_to_blacklist", name: "Blacklist", category: "Actions", description: "Add the contributor to the repo blacklist", params: [], handles: actionHandles },
  { type: "action", subtype: "remove_from_whitelist", name: "Remove Whitelist", category: "Actions", description: "Remove the contributor from the repo whitelist", params: [], handles: actionHandles },
  { type: "action", subtype: "remove_from_blacklist", name: "Remove Blacklist", category: "Actions", description: "Remove the contributor from the repo blacklist", params: [], handles: actionHandles },
  { type: "action", subtype: "notify_slack", name: "Notify Slack", category: "Actions", description: "Send a notification to a Slack webhook", params: [{ key: "url", name: "Webhook URL", type: "string", required: true, description: "Slack incoming webhook URL" }], handles: actionHandles },
  { type: "action", subtype: "notify_discord", name: "Notify Discord", category: "Actions", description: "Send a notification to a Discord webhook", params: [{ key: "url", name: "Webhook URL", type: "string", required: true, description: "Discord webhook URL" }], handles: actionHandles },
  { type: "action", subtype: "send_webhook", name: "Send Webhook", category: "Actions", description: "Send an HTTP POST to a custom webhook URL", params: [{ key: "url", name: "Webhook URL", type: "string", required: true, description: "Target URL for the webhook POST" }], handles: actionHandles },
  { type: "action", subtype: "request_review", name: "Request Review", category: "Actions", description: "Request a review from a specified user or team", params: [], handles: actionHandles },
];

const DELAY_ENTRIES: NodeRegistryEntry[] = [
  {
    type: "delay", subtype: "wait", name: "Delay", category: "Delays",
    description: "Wait for a configurable duration before proceeding",
    params: [
      { key: "duration", name: "Duration", type: "string", default: "5m", description: "Wait duration (e.g. 5m, 1h, 1d)" },
    ],
    handles: delayHandles,
  },
];

const TRANSFORM_ENTRIES: NodeRegistryEntry[] = [
  { type: "transform", subtype: "fetch_github_user", name: "Fetch GitHub User", category: "Transforms", description: "Enrich the workflow context with the contributor's GitHub profile data", params: [], handles: transformHandles },
  { type: "transform", subtype: "compute_score", name: "Compute Score", category: "Transforms", description: "Calculate the contributor's Tripwire reputation score", params: [], handles: transformHandles },
  { type: "transform", subtype: "fetch_pr_files", name: "Fetch PR Files", category: "Transforms", description: "Get the list of files changed in the pull request", params: [], handles: transformHandles },
  { type: "transform", subtype: "scan_history", name: "Scan History", category: "Transforms", description: "Check the repo's event history for the contributor", params: [], handles: transformHandles },
  { type: "transform", subtype: "detect_language", name: "Detect Language", category: "Transforms", description: "Analyze content language for language requirement checks", params: [], handles: transformHandles },
];

export const NODE_REGISTRY: NodeRegistryEntry[] = [
  ...TRIGGER_ENTRIES,
  ...RULE_ENTRIES,
  ...CONDITION_ENTRIES,
  ...LOGIC_ENTRIES,
  ...ACTION_ENTRIES,
  ...DELAY_ENTRIES,
  ...TRANSFORM_ENTRIES,
];

export function getNodeEntry(
  type: WorkflowNodeType,
  subtype: string,
): NodeRegistryEntry | undefined {
  return NODE_REGISTRY.find(
    (entry) => entry.type === type && entry.subtype === subtype,
  );
}

export function getNodesByCategory(
  category?: string,
): Map<string, NodeRegistryEntry[]> {
  const map = new Map<string, NodeRegistryEntry[]>();
  for (const entry of NODE_REGISTRY) {
    if (category && entry.category !== category) continue;
    const list = map.get(entry.category) ?? [];
    list.push(entry);
    map.set(entry.category, list);
  }
  return map;
}

export function validateNodeData(
  type: WorkflowNodeType,
  subtype: string,
  data: Record<string, unknown>,
): { valid: boolean; errors: string[] } {
  const entry = getNodeEntry(type, subtype);
  if (!entry) {
    return { valid: false, errors: [`Unknown node type: ${type}/${subtype}`] };
  }

  const errors: string[] = [];
  for (const param of entry.params) {
    if (!param.required) continue;
    const value = data[param.key];
    if (value === undefined || value === null || value === "") {
      errors.push(`Missing required param: ${param.key}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
