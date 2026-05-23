import { actionHandles } from "../handles"
import type { Block } from "../types"

export const close: Block = {
  type: "action",
  subtype: "close",
  name: "Close",
  category: "Actions",
  description: "Close the PR or issue",
  definition: "Closes the PR or issue without posting a comment.",
  example: "Silently close PRs from blacklisted accounts.",
  params: [],
  handles: actionHandles,
  requiredContext: [],
  evaluate(data) {
    let detail = `Execute: close`
    if (data.message) detail += ` -- "${data.message}"`
    if (data.label) detail += ` -- label "${data.label}"`
    if (data.url) detail += ` -- ${data.url}`
    return { pass: true, detail }
  },
}
