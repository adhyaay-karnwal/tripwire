import { actionHandles } from "../handles"
import type { Block } from "../types"

export const blockAction: Block = {
  type: "action",
  subtype: "block",
  name: "Block",
  category: "Actions",
  description: "Close the PR/issue immediately",
  definition: "Closes the PR or issue immediately.",
  example: "Use after a rule fails to auto-close spam PRs with a message.",
  params: [
    {
      key: "message",
      name: "Message",
      type: "string",
      description: "Optional message to include when blocking",
    },
  ],
  handles: actionHandles,
  requiredContext: [],
  evaluate(data) {
    let detail = `Execute: block`
    if (data.message) detail += ` -- "${data.message}"`
    if (data.label) detail += ` -- label "${data.label}"`
    if (data.url) detail += ` -- ${data.url}`
    return { pass: true, detail }
  },
}
