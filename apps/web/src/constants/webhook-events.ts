/**
 * GitHub webhook actions that should (re)run rules + workflows. Shared by the
 * webhook route dispatch and the workflow dispatcher so coverage stays in sync.
 */

/** `pull_request` actions: first open, reopen, new commits, edits, draft→ready. */
export const PR_EVAL_ACTIONS = new Set([
  "opened",
  "reopened",
  "synchronize",
  "edited",
  "ready_for_review",
])

/** `issues` actions: first open, reopen, edits. */
export const ISSUE_EVAL_ACTIONS = new Set(["opened", "reopened", "edited"])
