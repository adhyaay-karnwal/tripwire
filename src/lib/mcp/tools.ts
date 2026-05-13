import { z } from "zod";
import { and, desc, eq, sql } from "drizzle-orm";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { db } from "#/db";
import {
	blacklistEntries,
	events,
	githubReputation,
	organizations,
	repositories,
	ruleConfigs,
	whitelistEntries,
	DEFAULT_RULE_CONFIG,
	RULE_KEYS,
	type RuleConfig,
	type RuleKey,
} from "#/db/schema";
import {
	assertEventOwner,
	assertRepoOwner,
} from "#/integrations/trpc/init";
import { ruleConfigSchema } from "#/lib/rules/config-schema";
import { normalizeRuleConfig } from "#/lib/rules/config-draft";
import { logEvent } from "#/lib/events";
import { GUIDES } from "./instructions";

function ok(value: unknown) {
	return {
		content: [
			{ type: "text" as const, text: JSON.stringify(value, null, 2) },
		],
	};
}

function err(message: string) {
	return {
		content: [{ type: "text" as const, text: `Error: ${message}` }],
		isError: true,
	};
}

const ruleIdEnum = z.enum(RULE_KEYS);
const GUIDE_TOPICS = Object.keys(GUIDES) as readonly string[];

export function registerTripwireTools(server: McpServer, userId: string) {
	server.tool(
		"get_guide",
		`Return Tripwire MCP documentation for a topic. Topics: ${GUIDE_TOPICS.join(", ")}. Use this for conceptual docs (event taxonomy, list semantics). Tool schemas already document their own inputs — you don't need a guide call to figure out a tool.`,
		{ topic: z.enum(GUIDE_TOPICS as [string, ...string[]]) },
		async ({ topic }) => {
			const body = GUIDES[topic];
			if (!body) return err(`Unknown guide topic: ${topic}`);
			return {
				content: [{ type: "text" as const, text: body }],
			};
		},
	);

	server.tool(
		"list_repos",
		"List GitHub repositories the caller has connected to Tripwire. Returns repo id (use this for other tools), full name, privacy, and the owning GitHub org login.",
		{},
		async () => {
			const rows = await db
				.select({
					id: repositories.id,
					fullName: repositories.fullName,
					name: repositories.name,
					isPrivate: repositories.isPrivate,
					orgId: repositories.orgId,
					orgLogin: organizations.githubAccountLogin,
				})
				.from(repositories)
				.innerJoin(organizations, eq(repositories.orgId, organizations.id))
				.where(eq(organizations.ownerId, userId));
			return ok(rows);
		},
	);

	server.tool(
		"get_repo_rules",
		"Get the full moderation rule configuration for a Tripwire repo — every rule with its enabled flag, action, type-specific fields, and any scopeOverride.",
		{ repoId: z.string().uuid() },
		async ({ repoId }) => {
			await assertRepoOwner(userId, repoId);
			const [row] = await db
				.select()
				.from(ruleConfigs)
				.where(eq(ruleConfigs.repoId, repoId));
			return ok(row?.config ?? DEFAULT_RULE_CONFIG);
		},
	);

	server.tool(
		"list_events",
		"List recent moderation events for a repo (newest first). Use `limit` 1-50.",
		{
			repoId: z.string().uuid(),
			limit: z.number().int().min(1).max(50).optional(),
		},
		async ({ repoId, limit = 20 }) => {
			await assertRepoOwner(userId, repoId);
			const rows = await db
				.select()
				.from(events)
				.where(eq(events.repoId, repoId))
				.orderBy(desc(events.createdAt))
				.limit(limit);
			return ok(rows);
		},
	);

	server.tool(
		"get_event",
		"Fetch a single Tripwire event by id.",
		{ eventId: z.string().uuid() },
		async ({ eventId }) => {
			const { event, repo } = await assertEventOwner(userId, eventId);
			return ok({ event, repo: { id: repo.id, fullName: repo.fullName } });
		},
	);

	server.tool(
		"lookup_user",
		"Get Tripwire's record of a GitHub user inside a specific repo: reputation score, totals, and recent events.",
		{
			repoId: z.string().uuid(),
			username: z.string().min(1),
		},
		async ({ repoId, username }) => {
			await assertRepoOwner(userId, repoId);
			const lower = username.toLowerCase();
			const [reputation] = await db
				.select()
				.from(githubReputation)
				.where(
					and(
						eq(githubReputation.repoId, repoId),
						sql`lower(${githubReputation.githubUsername}) = ${lower}`,
					),
				)
				.limit(1);
			const recent = await db
				.select()
				.from(events)
				.where(
					and(
						eq(events.repoId, repoId),
						sql`lower(${events.targetGithubUsername}) = ${lower}`,
					),
				)
				.orderBy(desc(events.createdAt))
				.limit(10);
			return ok({ reputation: reputation ?? null, recentEvents: recent });
		},
	);

	server.tool(
		"list_lists",
		"Return both the whitelist and blacklist for a repo.",
		{ repoId: z.string().uuid() },
		async ({ repoId }) => {
			await assertRepoOwner(userId, repoId);
			const [white, black] = await Promise.all([
				db
					.select()
					.from(whitelistEntries)
					.where(eq(whitelistEntries.repoId, repoId)),
				db
					.select()
					.from(blacklistEntries)
					.where(eq(blacklistEntries.repoId, repoId)),
			]);
			return ok({ whitelist: white, blacklist: black });
		},
	);

	server.tool(
		"add_to_blacklist",
		"Add a GitHub user to a repo's blacklist. Removes any existing whitelist entry for the same user in the same transaction.",
		{
			repoId: z.string().uuid(),
			username: z.string().min(1),
		},
		async ({ repoId, username }) => {
			await assertRepoOwner(userId, repoId);
			const inserted = await db.transaction(async (tx) => {
				await tx
					.delete(whitelistEntries)
					.where(
						and(
							eq(whitelistEntries.repoId, repoId),
							sql`lower(${whitelistEntries.githubUsername}) = lower(${username})`,
						),
					);
				const [row] = await tx
					.insert(blacklistEntries)
					.values({
						repoId,
						githubUsername: username,
						addedById: userId,
					})
					.onConflictDoNothing()
					.returning();
				return row;
			});
			if (!inserted) {
				return ok({ alreadyBlacklisted: true, username });
			}
			await logEvent({
				repoId,
				action: "blacklist_added",
				severity: "info",
				description: `@${username} added to blacklist via MCP`,
				targetGithubUsername: username,
			});
			return ok({ added: true, entry: inserted });
		},
	);

	server.tool(
		"remove_from_blacklist",
		"Remove a GitHub user from a repo's blacklist.",
		{
			repoId: z.string().uuid(),
			username: z.string().min(1),
		},
		async ({ repoId, username }) => {
			await assertRepoOwner(userId, repoId);
			const deleted = await db
				.delete(blacklistEntries)
				.where(
					and(
						eq(blacklistEntries.repoId, repoId),
						sql`lower(${blacklistEntries.githubUsername}) = lower(${username})`,
					),
				)
				.returning();
			if (deleted.length === 0) {
				return ok({ wasOnList: false, username });
			}
			await logEvent({
				repoId,
				action: "blacklist_removed",
				severity: "info",
				description: `@${username} removed from blacklist via MCP`,
				targetGithubUsername: username,
			});
			return ok({ removed: true, count: deleted.length });
		},
	);

	server.tool(
		"add_to_whitelist",
		"Add a GitHub user to a repo's whitelist. Rejects if the user is on the blacklist (remove first).",
		{
			repoId: z.string().uuid(),
			username: z.string().min(1),
		},
		async ({ repoId, username }) => {
			await assertRepoOwner(userId, repoId);
			const [blocked] = await db
				.select({ id: blacklistEntries.id })
				.from(blacklistEntries)
				.where(
					and(
						eq(blacklistEntries.repoId, repoId),
						sql`lower(${blacklistEntries.githubUsername}) = lower(${username})`,
					),
				)
				.limit(1);
			if (blocked) {
				return err(
					`@${username} is on the blacklist for this repo. Remove from blacklist before whitelisting.`,
				);
			}
			const [inserted] = await db
				.insert(whitelistEntries)
				.values({
					repoId,
					githubUsername: username,
					addedById: userId,
				})
				.onConflictDoNothing()
				.returning();
			if (!inserted) {
				return ok({ alreadyWhitelisted: true, username });
			}
			await logEvent({
				repoId,
				action: "whitelist_added",
				severity: "info",
				description: `@${username} added to whitelist via MCP`,
				targetGithubUsername: username,
			});
			return ok({ added: true, entry: inserted });
		},
	);

	server.tool(
		"remove_from_whitelist",
		"Remove a GitHub user from a repo's whitelist.",
		{
			repoId: z.string().uuid(),
			username: z.string().min(1),
		},
		async ({ repoId, username }) => {
			await assertRepoOwner(userId, repoId);
			const deleted = await db
				.delete(whitelistEntries)
				.where(
					and(
						eq(whitelistEntries.repoId, repoId),
						sql`lower(${whitelistEntries.githubUsername}) = lower(${username})`,
					),
				)
				.returning();
			if (deleted.length === 0) {
				return ok({ wasOnList: false, username });
			}
			await logEvent({
				repoId,
				action: "whitelist_removed",
				severity: "info",
				description: `@${username} removed from whitelist via MCP`,
				targetGithubUsername: username,
			});
			return ok({ removed: true, count: deleted.length });
		},
	);

	server.tool(
		"toggle_rule",
		"Enable or disable a moderation rule.",
		{
			repoId: z.string().uuid(),
			ruleId: ruleIdEnum,
			enabled: z.boolean(),
		},
		async ({ repoId, ruleId, enabled }) => {
			return mutateRule(userId, repoId, (config) => {
				(config[ruleId] as { enabled: boolean }).enabled = enabled;
				return {
					summary: `${ruleId} ${enabled ? "enabled" : "disabled"}`,
					result: { ruleId, enabled, persisted: true },
				};
			});
		},
	);

	server.tool(
		"update_rule_action",
		"Set a rule's action. 'block' closes content, 'warn' leaves it open with a comment, 'log' records silently, 'threshold' counts violations per user and blocks at thresholdCount (provide thresholdCount when action='threshold').",
		{
			repoId: z.string().uuid(),
			ruleId: ruleIdEnum,
			action: z.enum(["block", "warn", "log", "threshold"]),
			thresholdCount: z.number().int().min(1).optional(),
		},
		async ({ repoId, ruleId, action, thresholdCount }) => {
			return mutateRule(userId, repoId, (config) => {
				const rule = config[ruleId] as { action: string; thresholdCount?: number };
				rule.action = action;
				if (action === "threshold" && thresholdCount !== undefined) {
					rule.thresholdCount = thresholdCount;
				}
				return {
					summary: `${ruleId} action → ${action}${action === "threshold" && thresholdCount ? ` (×${thresholdCount})` : ""}`,
					result: { ruleId, action, thresholdCount, persisted: true },
				};
			});
		},
	);

	// ─── Typed per-rule value setters ────────────────────────────
	// One tool per rule field. The zod schema is the documentation:
	// no free-form `field: string`, no `value: union`, no guessing.

	server.tool(
		"set_min_merged_prs",
		"Set the minimum-merged-PRs threshold. Authors with fewer merged PRs across GitHub will trip the rule.",
		{
			repoId: z.string().uuid(),
			count: z.number().int().min(0),
		},
		async ({ repoId, count }) => {
			return mutateRule(userId, repoId, (config) => {
				config.minMergedPrs.count = count;
				return {
					summary: `minMergedPrs.count → ${count}`,
					result: { ruleId: "minMergedPrs", count, persisted: true },
				};
			});
		},
	);

	server.tool(
		"set_account_age",
		"Set the minimum account age in days. Authors with newer accounts will trip the rule.",
		{
			repoId: z.string().uuid(),
			days: z.number().int().min(0),
		},
		async ({ repoId, days }) => {
			return mutateRule(userId, repoId, (config) => {
				config.accountAge.days = days;
				return {
					summary: `accountAge.days → ${days}`,
					result: { ruleId: "accountAge", days, persisted: true },
				};
			});
		},
	);

	server.tool(
		"set_max_prs_per_day",
		"Set the per-author daily PR cap for this repo.",
		{
			repoId: z.string().uuid(),
			limit: z.number().int().min(1),
		},
		async ({ repoId, limit }) => {
			return mutateRule(userId, repoId, (config) => {
				config.maxPrsPerDay.limit = limit;
				return {
					summary: `maxPrsPerDay.limit → ${limit}`,
					result: { ruleId: "maxPrsPerDay", limit, persisted: true },
				};
			});
		},
	);

	server.tool(
		"set_max_files_changed",
		"Set the per-PR files-changed cap.",
		{
			repoId: z.string().uuid(),
			limit: z.number().int().min(1),
		},
		async ({ repoId, limit }) => {
			return mutateRule(userId, repoId, (config) => {
				config.maxFilesChanged.limit = limit;
				return {
					summary: `maxFilesChanged.limit → ${limit}`,
					result: { ruleId: "maxFilesChanged", limit, persisted: true },
				};
			});
		},
	);

	server.tool(
		"set_repo_activity_minimum",
		"Set the minimum number of public non-fork repos an author must own to pass.",
		{
			repoId: z.string().uuid(),
			minRepos: z.number().int().min(1),
		},
		async ({ repoId, minRepos }) => {
			return mutateRule(userId, repoId, (config) => {
				config.repoActivityMinimum.minRepos = minRepos;
				return {
					summary: `repoActivityMinimum.minRepos → ${minRepos}`,
					result: { ruleId: "repoActivityMinimum", minRepos, persisted: true },
				};
			});
		},
	);

	server.tool(
		"set_language_requirement",
		"Set the required content language (e.g. 'English', 'Spanish'). Used when languageRequirement is enabled.",
		{
			repoId: z.string().uuid(),
			language: z.string().min(1),
		},
		async ({ repoId, language }) => {
			return mutateRule(userId, repoId, (config) => {
				config.languageRequirement.language = language;
				return {
					summary: `languageRequirement.language → ${language}`,
					result: { ruleId: "languageRequirement", language, persisted: true },
				};
			});
		},
	);

	// ─── Scope tools ─────────────────────────────────────────────
	// contentScope is the repo-wide default for which content types the
	// pipeline watches. Each rule may also carry a scopeOverride that wins
	// over the repo default for that rule.

	server.tool(
		"set_content_scope",
		"Set the repo-wide content scope — which content types the pipeline watches by default. Pass only the keys you want to change; omitted keys stay as-is.",
		{
			repoId: z.string().uuid(),
			pullRequests: z.boolean().optional(),
			issues: z.boolean().optional(),
			comments: z.boolean().optional(),
		},
		async ({ repoId, pullRequests, issues, comments }) => {
			if (pullRequests === undefined && issues === undefined && comments === undefined) {
				return err("Provide at least one of pullRequests, issues, comments.");
			}
			return mutateRule(userId, repoId, (config) => {
				if (pullRequests !== undefined) config.contentScope.pullRequests = pullRequests;
				if (issues !== undefined) config.contentScope.issues = issues;
				if (comments !== undefined) config.contentScope.comments = comments;
				return {
					summary: `contentScope → ${JSON.stringify(config.contentScope)}`,
					result: { contentScope: config.contentScope, persisted: true },
				};
			});
		},
	);

	server.tool(
		"set_rule_scope",
		"Override which content types a single rule applies to, instead of inheriting the repo's contentScope. Pass only the keys you want to override; omitted keys inherit. Example: setting issues=true on cryptoAddressDetection makes the crypto rule watch issues even if the rest of the pipeline doesn't.",
		{
			repoId: z.string().uuid(),
			ruleId: ruleIdEnum,
			pullRequests: z.boolean().optional(),
			issues: z.boolean().optional(),
			comments: z.boolean().optional(),
		},
		async ({ repoId, ruleId, pullRequests, issues, comments }) => {
			if (pullRequests === undefined && issues === undefined && comments === undefined) {
				return err("Provide at least one of pullRequests, issues, comments. To remove an override entirely, use clear_rule_scope.");
			}
			return mutateRule(userId, repoId, (config) => {
				const rule = config[ruleId] as RuleConfig[RuleKey];
				const next = { ...(rule.scopeOverride ?? {}) };
				if (pullRequests !== undefined) next.pullRequests = pullRequests;
				if (issues !== undefined) next.issues = issues;
				if (comments !== undefined) next.comments = comments;
				rule.scopeOverride = next;
				return {
					summary: `${ruleId}.scopeOverride → ${JSON.stringify(next)}`,
					result: { ruleId, scopeOverride: next, persisted: true },
				};
			});
		},
	);

	server.tool(
		"clear_rule_scope",
		"Remove a rule's scopeOverride entirely. The rule then inherits the repo-wide contentScope for all content types.",
		{
			repoId: z.string().uuid(),
			ruleId: ruleIdEnum,
		},
		async ({ repoId, ruleId }) => {
			return mutateRule(userId, repoId, (config) => {
				const rule = config[ruleId] as RuleConfig[RuleKey];
				rule.scopeOverride = undefined;
				return {
					summary: `${ruleId}.scopeOverride cleared`,
					result: { ruleId, persisted: true },
				};
			});
		},
	);

	server.tool(
		"copy_rules",
		"Copy rule configuration between two repos you own. Pass a ruleId to copy a single rule (preserves the destination's other rules). Omit ruleId to replace the destination's entire rule config with the source's.",
		{
			fromRepoId: z.string().uuid(),
			toRepoId: z.string().uuid(),
			ruleId: ruleIdEnum.optional(),
		},
		async ({ fromRepoId, toRepoId, ruleId }) => {
			if (fromRepoId === toRepoId) {
				return err("fromRepoId and toRepoId must be different repos.");
			}
			const [{ repo: fromRepo }, { repo: toRepo }] = await Promise.all([
				assertRepoOwner(userId, fromRepoId),
				assertRepoOwner(userId, toRepoId),
			]);
			const sourceConfig = await loadRuleConfig(fromRepoId);

			let nextConfig: RuleConfig;
			let summary: string;
			if (ruleId) {
				const target = await loadRuleConfig(toRepoId);
				nextConfig = structuredClone(target) as RuleConfig;
				(nextConfig as Record<string, unknown>)[ruleId] = structuredClone(sourceConfig[ruleId]);
				summary = `Copied rule "${ruleId}" from ${fromRepo.fullName} → ${toRepo.fullName}`;
			} else {
				nextConfig = structuredClone(sourceConfig) as RuleConfig;
				summary = `Copied full rule config from ${fromRepo.fullName} → ${toRepo.fullName}`;
			}

			const parsed = ruleConfigSchema.safeParse(nextConfig);
			if (!parsed.success) {
				return err(`Invalid rule config after copy: ${parsed.error.message}`);
			}
			await persistRuleConfig(toRepoId, parsed.data);

			await logEvent({
				repoId: toRepoId,
				action: "rule_config_updated",
				severity: "info",
				description: summary + " (via MCP)",
				metadata: {
					sourceRepoId: fromRepoId,
					sourceRepoFullName: fromRepo.fullName,
					ruleId: ruleId ?? null,
				},
			});

			return ok({
				summary,
				from: { id: fromRepo.id, fullName: fromRepo.fullName },
				to: { id: toRepo.id, fullName: toRepo.fullName },
				ruleId: ruleId ?? null,
				persisted: true,
			});
		},
	);
}

// ─── Helpers ─────────────────────────────────────────────────────

type MutateResult = { summary: string; result: Record<string, unknown> };

async function mutateRule(
	userId: string,
	repoId: string,
	mutator: (config: RuleConfig) => MutateResult,
) {
	await assertRepoOwner(userId, repoId);
	const current = await loadRuleConfig(repoId);
	const next = structuredClone(current) as RuleConfig;
	const { summary, result } = mutator(next);
	const parsed = ruleConfigSchema.safeParse(next);
	if (!parsed.success) {
		const issue = parsed.error.issues[0];
		const path = issue?.path.join(".") ?? "config";
		return err(`Invalid rule config: ${path} — ${issue?.message ?? "validation failed"}`);
	}
	await persistRuleConfig(repoId, parsed.data);
	await logEvent({
		repoId,
		action: "rule_config_updated",
		severity: "info",
		description: `${summary} (via MCP)`,
		metadata: result,
	});
	return ok(result);
}

async function loadRuleConfig(repoId: string): Promise<RuleConfig> {
	const [row] = await db
		.select()
		.from(ruleConfigs)
		.where(eq(ruleConfigs.repoId, repoId));
	return normalizeRuleConfig(row?.config ?? DEFAULT_RULE_CONFIG);
}

async function persistRuleConfig(repoId: string, config: RuleConfig) {
	const normalized = normalizeRuleConfig(config);
	const [existing] = await db
		.select({ id: ruleConfigs.id })
		.from(ruleConfigs)
		.where(eq(ruleConfigs.repoId, repoId));
	if (existing) {
		await db
			.update(ruleConfigs)
			.set({ config: normalized, updatedAt: new Date() })
			.where(eq(ruleConfigs.repoId, repoId));
	} else {
		await db.insert(ruleConfigs).values({ repoId, config: normalized });
	}
}
