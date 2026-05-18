import type { Node, Edge } from "@xyflow/react";

export type SimMode = "pass" | "fail" | "user";

export interface SimNodeResult {
	nodeId: string;
	edgeId?: string;
	status: "pass" | "fail" | "skipped" | "executed";
	detail?: string;
}

export interface SimUserData {
	accountAgeDays: number;
	followers: number;
	following: number;
	publicRepos: number;
	publicNonForkRepos: number;
	publicGists: number;
	hasProfileReadme: boolean;
	mergedPrs: number;
	score: number;
}

function evaluateCondition(
	field: string,
	operator: string,
	value: string,
	userData: SimUserData,
): { pass: boolean; detail: string } {
	const numVal = parseFloat(value);
	const fieldMap: Record<string, number | boolean> = {
		score: userData.score,
		accountAgeDays: userData.accountAgeDays,
		publicRepos: userData.publicRepos,
		publicNonForkRepos: userData.publicNonForkRepos,
		followers: userData.followers,
		following: userData.following,
		publicGists: userData.publicGists,
		hasProfileReadme: userData.hasProfileReadme,
	};
	const actual = fieldMap[field];
	if (actual === undefined)
		return { pass: true, detail: `${field} -- unknown field` };

	let pass: boolean;
	if (typeof actual === "boolean") {
		pass = actual === (value === "true");
	} else {
		switch (operator) {
			case ">":
				pass = actual > numVal;
				break;
			case ">=":
				pass = actual >= numVal;
				break;
			case "<":
				pass = actual < numVal;
				break;
			case "<=":
				pass = actual <= numVal;
				break;
			case "==":
				pass = actual === numVal;
				break;
			case "!=":
				pass = actual !== numVal;
				break;
			default:
				pass = true;
		}
	}
	return {
		pass,
		detail: `${pass ? "PASS" : "FAIL"} -- ${field} is ${actual} (check: ${operator} ${value})`,
	};
}

function evaluateRule(
	rule: string,
	params: Record<string, unknown> | undefined,
	userData: SimUserData,
): { pass: boolean; detail: string } {
	switch (rule) {
		case "accountAge": {
			const threshold = (params?.days as number) ?? 30;
			const pass = userData.accountAgeDays >= threshold;
			return {
				pass,
				detail: `${pass ? "PASS" : "FAIL"} -- account is ${userData.accountAgeDays}d old (requires >= ${threshold}d)`,
			};
		}
		case "minMergedPrs": {
			const threshold = (params?.count as number) ?? 15;
			if (userData.mergedPrs === 0)
				return { pass: true, detail: "SKIP -- merged PR count unavailable" };
			const pass = userData.mergedPrs >= threshold;
			return {
				pass,
				detail: `${pass ? "PASS" : "FAIL"} -- ${userData.mergedPrs} merged PRs (requires >= ${threshold})`,
			};
		}
		case "repoActivityMinimum": {
			const threshold = (params?.minRepos as number) ?? 3;
			const pass = userData.publicNonForkRepos >= threshold;
			return {
				pass,
				detail: `${pass ? "PASS" : "FAIL"} -- ${userData.publicNonForkRepos} non-fork repos (requires >= ${threshold})`,
			};
		}
		case "requireProfileReadme": {
			const pass = userData.hasProfileReadme;
			return {
				pass,
				detail: `${pass ? "PASS" : "FAIL"} -- profile README ${pass ? "exists" : "missing"}`,
			};
		}
		case "contributorScore": {
			const threshold = (params?.minScore as number) ?? 50;
			const pass = userData.score >= threshold;
			return {
				pass,
				detail: `${pass ? "PASS" : "FAIL"} -- score is ${userData.score} (requires >= ${threshold})`,
			};
		}
		case "maxFilesChanged":
			return { pass: true, detail: "SKIP -- no file data in simulation" };
		case "maxPrsPerDay":
			return { pass: true, detail: "SKIP -- no PR rate data in simulation" };
		case "cryptoAddressDetection":
			return {
				pass: true,
				detail: "SKIP -- requires content text to analyze",
			};
		case "aiHoneypot":
			return {
				pass: true,
				detail: "SKIP -- requires content text to analyze",
			};
		case "languageRequirement":
			return {
				pass: true,
				detail: "SKIP -- requires content text to analyze",
			};
		case "vouchedUsersOnly":
			return {
				pass: true,
				detail: "SKIP -- requires vouch database lookup",
			};
		default:
			return { pass: true, detail: "Unknown rule" };
	}
}

export function simulateWorkflow(
	nodes: Node[],
	edges: Edge[],
	mode: SimMode,
	userData: SimUserData,
	actionLabels: Record<string, string>,
): SimNodeResult[] {
	const results: SimNodeResult[] = [];
	const nodeMap = new Map(nodes.map((n) => [n.id, n]));
	const outgoing = new Map<string, Edge[]>();
	for (const e of edges) {
		if (!outgoing.has(e.source)) outgoing.set(e.source, []);
		outgoing.get(e.source)!.push(e);
	}
	const nodeOutcome = new Map<string, boolean>();
	const triggers = nodes.filter((n) => n.type === "trigger");
	const queue = [...triggers.map((n) => n.id)];
	const visited = new Set<string>();

	for (const tid of triggers) {
		results.push({ nodeId: tid.id, status: "executed", detail: "Triggered" });
		nodeOutcome.set(tid.id, true);
	}

	while (queue.length > 0) {
		const current = queue.shift()!;
		if (visited.has(current)) continue;
		visited.add(current);
		const outEdges = outgoing.get(current) ?? [];
		for (const edge of outEdges) {
			const targetNode = nodeMap.get(edge.target);
			if (!targetNode || visited.has(edge.target)) continue;
			const sourceOutcome = nodeOutcome.get(current);
			const sourceHandle = edge.sourceHandle;
			const sourceNode = nodeMap.get(current);
			if (
				sourceNode &&
				(sourceNode.type === "rule" || sourceNode.type === "condition")
			) {
				if (sourceHandle === "pass" && sourceOutcome === false) continue;
				if (sourceHandle === "fail" && sourceOutcome === true) continue;
				if (sourceHandle === "true" && sourceOutcome === false) continue;
				if (sourceHandle === "false" && sourceOutcome === true) continue;
			}
			let pass = true;
			let detail = "";
			switch (targetNode.type) {
				case "rule": {
					if (mode === "pass") {
						pass = true;
						detail = "Forced PASS";
					} else if (mode === "fail") {
						pass = false;
						detail = "Forced FAIL";
					} else {
						const r = evaluateRule(
							targetNode.data.rule as string,
							targetNode.data.params as Record<string, unknown>,
							userData,
						);
						pass = r.pass;
						detail = r.detail;
					}
					results.push({
						nodeId: edge.target,
						edgeId: edge.id,
						status: pass ? "pass" : "fail",
						detail,
					});
					break;
				}
				case "condition": {
					if (mode === "pass") {
						pass = true;
						detail = "Forced PASS";
					} else if (mode === "fail") {
						pass = false;
						detail = "Forced FAIL";
					} else {
						const r = evaluateCondition(
							targetNode.data.field as string,
							targetNode.data.operator as string,
							String(targetNode.data.value),
							userData,
						);
						pass = r.pass;
						detail = r.detail;
					}
					results.push({
						nodeId: edge.target,
						edgeId: edge.id,
						status: pass ? "pass" : "fail",
						detail,
					});
					break;
				}
				case "logic": {
					const incomingEdges = edges.filter((e) => e.target === edge.target);
					const inputResults = incomingEdges
						.map((e) => nodeOutcome.get(e.source))
						.filter((v) => v !== undefined) as boolean[];
					const gate = targetNode.data.gate as string;
					if (gate === "AND")
						pass =
							inputResults.length > 0 && inputResults.every(Boolean);
					else if (gate === "OR") pass = inputResults.some(Boolean);
					else if (gate === "NOT")
						pass = inputResults.length > 0 && !inputResults[0];
					detail = `${gate}(${inputResults.map((r) => (r ? "T" : "F")).join(", ")}) -> ${pass ? "TRUE" : "FALSE"}`;
					results.push({
						nodeId: edge.target,
						edgeId: edge.id,
						status: pass ? "pass" : "fail",
						detail,
					});
					break;
				}
				case "action": {
					const action = targetNode.data.action as string;
					detail = `Would execute: ${actionLabels[action] ?? action}`;
					if (targetNode.data.message)
						detail += ` -- "${targetNode.data.message}"`;
					results.push({
						nodeId: edge.target,
						edgeId: edge.id,
						status: "executed",
						detail,
					});
					break;
				}
				default: {
					results.push({
						nodeId: edge.target,
						edgeId: edge.id,
						status: "executed",
						detail: "Processed",
					});
					break;
				}
			}
			nodeOutcome.set(edge.target, pass);
			queue.push(edge.target);
		}
	}
	return results;
}
