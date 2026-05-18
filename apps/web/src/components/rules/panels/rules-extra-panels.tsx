import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { RepoFilesTree } from "#/components/rules/repo-files-tree";
import { PeopleTab } from "#/components/rules/people-tab";
import { useRulesWorkspace } from "#/components/rules/rules-workspace-context";
import { useTRPC } from "#/integrations/trpc/react";
import { useWorkspace } from "#/lib/workspace-context";
import { workflowSupportsManualRun } from "#/lib/workflow-simulation";

export function RulesPeoplePanel() {
	const {
		repoId,
		suggestedQuery,
		blacklistUsers,
		whitelistUsers,
		addBlacklist,
		removeBlacklist,
		addWhitelist,
		removeWhitelist,
		isAdmin,
	} = useRulesWorkspace();

	return (
		<PeopleTab
			suggestedContributors={suggestedQuery.data ?? undefined}
			blacklistUsers={blacklistUsers.map((u) => ({
				...u,
				reason: null,
				addedBy: null,
				addedAt: null,
			}))}
			whitelistUsers={whitelistUsers.map((u) => ({
				...u,
				reason: null,
				addedBy: null,
				addedAt: null,
			}))}
			onAddBlacklist={async (username) => {
				if (repoId) await addBlacklist.mutateAsync({ repoId, githubUsername: username });
			}}
			onRemoveBlacklist={async (username) => {
				if (repoId) await removeBlacklist.mutateAsync({ repoId, githubUsername: username });
			}}
			onAddWhitelist={async (username) => {
				if (repoId) await addWhitelist.mutateAsync({ repoId, githubUsername: username });
			}}
			onRemoveWhitelist={async (username) => {
				if (repoId) await removeWhitelist.mutateAsync({ repoId, githubUsername: username });
			}}
			isAddingBlacklist={addBlacklist.isPending}
			isAddingWhitelist={addWhitelist.isPending}
			isAdmin={isAdmin}
		/>
	);
}

export function RulesRequestsPanel() {
	const { requestsQuery, vouchRequestsQuery, decideRequest, decideVouchRequest } = useRulesWorkspace();

	return (
		<RequestsTab
			repoRequests={requestsQuery.data ?? []}
			repoRequestsLoading={requestsQuery.isLoading}
			vouchRequests={vouchRequestsQuery.data ?? []}
			vouchRequestsLoading={vouchRequestsQuery.isLoading}
			onDecideRepoRequest={(id, decision) => decideRequest.mutate({ requestId: id, decision })}
			onDecideVouchRequest={(id, decision) => decideVouchRequest.mutate({ requestId: id, decision })}
			isDecidingRepo={decideRequest.isPending}
			isDecidingVouch={decideVouchRequest.isPending}
		/>
	);
}

function RequestsTab({
	repoRequests,
	repoRequestsLoading,
	vouchRequests,
	vouchRequestsLoading,
	onDecideRepoRequest,
	onDecideVouchRequest,
	isDecidingRepo,
	isDecidingVouch,
}: {
	repoRequests: Array<{ id: string; kind: string; githubUsername: string; avatarUrl: string | null; reason: string }>;
	repoRequestsLoading: boolean;
	vouchRequests: Array<{ id: string; githubUsername: string; avatarUrl: string | null; reason: string }>;
	vouchRequestsLoading: boolean;
	onDecideRepoRequest: (id: string, decision: "approve" | "deny") => void;
	onDecideVouchRequest: (id: string, decision: "approve" | "deny") => void;
	isDecidingRepo: boolean;
	isDecidingVouch: boolean;
}) {
	const [subtab, setSubtab] = useState<"appeals" | "access" | "vouches">("appeals");
	const appeals = repoRequests.filter((r) => r.kind === "unblock");
	const access = repoRequests.filter((r) => r.kind === "access");
	const loading = subtab === "vouches" ? vouchRequestsLoading : repoRequestsLoading;
	const items = subtab === "appeals" ? appeals : subtab === "access" ? access : vouchRequests;
	const emptyMsg =
		subtab === "appeals"
			? "No pending appeals. Blocked users can appeal via the link in their bot comment."
			: subtab === "access"
				? "No pending access requests."
				: "No pending vouch requests. Users can apply from the vouched contributors page.";

	return (
		<div className="flex flex-col gap-4 min-w-0">
			<div className="flex items-center gap-1 bg-tw-card rounded-[10px] p-1 self-start">
				{(
					[
						{ key: "appeals" as const, label: "Appeals", count: appeals.length },
						{ key: "access" as const, label: "Access", count: access.length },
						{ key: "vouches" as const, label: "Vouches", count: vouchRequests.length },
					] as const
				).map(({ key, label, count }) => (
					<button
						key={key}
						type="button"
						onClick={() => setSubtab(key)}
						className={`flex items-center gap-1.5 h-7 px-2.5 rounded-[6px] text-[12px] font-medium transition-colors cursor-pointer ${subtab === key ? "bg-[#FAFAFA1A] text-[#EEEEEE]" : "text-[#9F9FA9] hover:text-[#EEEEEE]"}`}
					>
						{label}
						{count > 0 && (
							<span className="text-[11px] text-tw-accent tabular-nums ml-0.5">{count}</span>
						)}
					</button>
				))}
			</div>
			{loading ? (
				<div className="rounded-xl bg-tw-card p-6 flex items-center justify-center">
					<div className="h-5 w-5 animate-spin rounded-full border-2 border-tw-accent border-t-transparent" />
				</div>
			) : items.length === 0 ? (
				<div className="rounded-xl bg-tw-card p-6 text-center">
					<p className="text-[13px] text-[#FFFFFF73] m-0">{emptyMsg}</p>
				</div>
			) : (
				<div className="flex flex-col gap-2">
					{items.map((r) => {
						const isVouch = subtab === "vouches";
						const kind = "kind" in r ? r.kind : "vouch";
						const badge = isVouch ? "Vouch" : kind === "unblock" ? "Appeal" : "Access";
						const badgeClass =
							kind === "unblock" ? "bg-amber-500/15 text-amber-300" : "bg-tw-accent/15 text-tw-accent";
						const approveLabel = isVouch ? "Vouch" : kind === "unblock" ? "Unblock" : "Add to whitelist";
						return (
							<div
								key={r.id}
								className="rounded-xl bg-tw-card border border-tw-border-card p-4 flex flex-col gap-3"
							>
								<div className="flex items-start gap-3">
									<img
										src={r.avatarUrl ?? `https://github.com/${r.githubUsername}.png`}
										alt=""
										className="w-8 h-8 rounded-full bg-white/5"
									/>
									<div className="flex flex-col gap-0.5 flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<span className="text-[14px] font-medium text-white">@{r.githubUsername}</span>
											<span className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded ${badgeClass}`}>
												{badge}
											</span>
										</div>
										<p className="text-[13px] text-[#FFFFFFB3] m-0 whitespace-pre-wrap">{r.reason}</p>
									</div>
								</div>
								<div className="flex items-center gap-2 self-end">
									<Button
										size="xs"
										variant="ghost"
										disabled={isVouch ? isDecidingVouch : isDecidingRepo}
										onClick={() =>
											isVouch ? onDecideVouchRequest(r.id, "deny") : onDecideRepoRequest(r.id, "deny")
										}
										className="text-[12px] text-tw-text-tertiary hover:text-red-400"
									>
										Deny
									</Button>
									<Button
										size="xs"
										disabled={isVouch ? isDecidingVouch : isDecidingRepo}
										onClick={() =>
											isVouch
												? onDecideVouchRequest(r.id, "approve")
												: onDecideRepoRequest(r.id, "approve")
										}
										className="text-[12px]"
									>
										{approveLabel}
									</Button>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

export function RulesFilesPanel() {
	const {
		activeConfig,
		repo,
		updateConfig,
		generateRulesMd,
		generatePrTemplate,
		generateAgentsMd,
		updateRepoFileContent,
		toggleRepoFile,
		addHoneypotPhrase,
		removeHoneypotPhrase,
	} = useRulesWorkspace();

	return (
		<RepoFilesTree
			config={activeConfig}
			repoFullName={repo?.fullName ?? "owner/repo"}
			isPending={updateConfig.isPending}
			generateRulesMd={generateRulesMd}
			generatePrTemplate={generatePrTemplate}
			generateAgentsMd={generateAgentsMd}
			onUpdateContent={updateRepoFileContent}
			onToggle={toggleRepoFile}
			onAddHoneypotPhrase={addHoneypotPhrase}
			onRemoveHoneypotPhrase={removeHoneypotPhrase}
		/>
	);
}

export function RulesWorkflowsPanel() {
	const { repoId } = useRulesWorkspace();
	return <WorkflowsTab repoId={repoId} />;
}

function WorkflowsTab({ repoId }: { repoId: string | undefined }) {
	const trpc = useTRPC();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { org } = useWorkspace();
	const [runUsername, setRunUsername] = useState("");
	const [runFeedback, setRunFeedback] = useState<string | null>(null);
	const [pendingWorkflowId, setPendingWorkflowId] = useState<string | null>(null);

	const workflowsQuery = useQuery(
		trpc.workflows.list.queryOptions({ repoId: repoId ?? "" }, { enabled: !!repoId }),
	);
	const inflightQuery = useQuery(
		trpc.workflows.listInflightManualRuns.queryOptions(
			{ repoId: repoId ?? "" },
			{ enabled: !!repoId, refetchInterval: 5_000 },
		),
	);
	const manualRun = useMutation(
		trpc.workflows.manualRun.mutationOptions({
			onMutate: (vars) => {
				setPendingWorkflowId(vars.workflowId);
			},
			onSuccess: (data) => {
				setRunFeedback(
					`${data.simulation.workflowName}: ${data.simulation.result === "blocked" ? "would block" : data.simulation.result === "allowed" ? "would allow" : "no action"}`,
				);
			},
			onError: (err) => {
				const msg = err.message ?? "Run failed";
				if (msg.includes("already in progress")) {
					setRunFeedback("A run is already in progress for that workflow.");
				} else {
					setRunFeedback(msg);
				}
			},
			onSettled: async () => {
				setPendingWorkflowId(null);
				if (repoId) {
					await queryClient.invalidateQueries(trpc.workflows.listInflightManualRuns.queryFilter({ repoId }));
				}
			},
		}),
	);

	const wfList = workflowsQuery.data ?? [];
	const inflight = new Set(inflightQuery.data?.inflightWorkflowIds ?? []);

	const openAutomations = () => navigate({ to: `/${org?.slug}/automations` });
	const openWorkflow = (workflowId: string) =>
		navigate({ to: `/${org?.slug}/automations/${workflowId}` });

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between gap-2">
				<p className="text-[13px] text-tw-text-secondary">Automation workflows for this repo.</p>
				<button type="button" onClick={openAutomations} className="text-[12px] text-tw-accent hover:underline shrink-0">
					Open editor
				</button>
			</div>

			<div className="flex flex-col gap-1">
				<label htmlFor="wf-run-username" className="text-[11px] text-tw-text-muted">
					Username to simulate (required for Run)
				</label>
				<input
					id="wf-run-username"
					type="text"
					placeholder="octocat"
					value={runUsername}
					onChange={(e) => {
						setRunUsername(e.target.value);
						setRunFeedback(null);
					}}
					className="h-9 rounded-[10px] bg-tw-card border border-tw-border-card px-2.5 text-[13px] text-white placeholder:text-[#6E6E6E] outline-none focus:border-[#FFFFFF1A]"
				/>
			</div>
			{runFeedback ? (
				<p className="text-[12px] text-tw-text-secondary m-0">{runFeedback}</p>
			) : null}

			{workflowsQuery.isPending ? (
				<div className="py-8 text-center text-tw-text-muted text-[13px]">Loading...</div>
			) : wfList.length === 0 ? (
				<div className="py-8 text-center">
					<p className="text-[13px] text-tw-text-muted mb-2">No workflows yet.</p>
					<button type="button" onClick={openAutomations} className="text-[12px] text-tw-accent hover:underline">
						Create your first workflow
					</button>
				</div>
			) : (
				<div className="flex flex-col gap-1.5">
					{wfList.map((wf) => {
						const nodeCount = (wf.definition as { nodes: unknown[] }).nodes?.length ?? 0;
						const canManual = workflowSupportsManualRun(wf);
						const busy = inflight.has(wf.id) || pendingWorkflowId === wf.id;
						const runDisabled =
							!repoId ||
							!wf.enabled ||
							!canManual ||
							!runUsername.trim() ||
							busy;
						return (
							<div
								key={wf.id}
								role="button"
								tabIndex={0}
								onClick={() => openWorkflow(wf.id)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										openWorkflow(wf.id);
									}
								}}
								className="flex items-center gap-3 p-3 rounded-xl bg-tw-card border border-tw-border-card hover:border-[#FFFFFF1A] transition-colors text-left cursor-pointer"
							>
								<div className="flex flex-col min-w-0 flex-1">
									<span className="text-[13px] font-medium text-tw-text-primary truncate">{wf.name}</span>
									<span className="text-[11px] text-tw-text-muted">
										{nodeCount} node{nodeCount !== 1 ? "s" : ""} · Updated{" "}
										{new Date(wf.updatedAt).toLocaleDateString()}
									</span>
								</div>
								<div className="flex items-center gap-2 shrink-0">
									{canManual && wf.enabled ? (
										<Button
											size="xs"
											variant="secondary"
											disabled={runDisabled}
											className="text-[12px]"
											onClick={(e) => {
												e.stopPropagation();
												if (!repoId || runDisabled) return;
												setRunFeedback(null);
												manualRun.mutate({
													workflowId: wf.id,
													username: runUsername.trim(),
												});
											}}
										>
											{busy ? "Running…" : "Run"}
										</Button>
									) : null}
									<span
										className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${wf.enabled ? "bg-tw-success/10 text-tw-success" : "bg-tw-inner text-tw-text-muted"}`}
									>
										{wf.enabled ? "Active" : "Draft"}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
