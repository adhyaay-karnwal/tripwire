import { triggerHandles } from "../handles"
import type { Block } from "../types"

export const repoScan: Block = {
  type: "trigger",
  subtype: "repo_scan",
  name: "Repo History Scan",
  category: "Triggers",
  description: "Scans repo history for past offenders",
  definition: "Scans repo history to find past offenders.",
  example: "Retroactively check existing PRs against new rules.",
  params: [],
  handles: triggerHandles,
  requiredContext: [],
  evaluate(_data) {
    return { pass: true, detail: `Triggered: repo_scan` }
  },
}
