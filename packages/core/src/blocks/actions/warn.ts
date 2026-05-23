import { actionHandles } from "../handles"
import type { Block } from "../types"

export const warn: Block = {
  type: "action",
  subtype: "warn",
  name: "Warn",
  category: "Actions",
  description: "Leave a warning comment but keep the content open",
  definition: "Posts a warning comment but keeps the content open.",
  example: "Warn new contributors about missing profile info.",
  params: [
    {
      key: "message",
      name: "Message",
      type: "string",
      description: "Warning message text",
    },
  ],
  handles: actionHandles,
  requiredContext: [],
  evaluate(data) {
    let detail = `Execute: warn`
    if (data.message) detail += ` -- "${data.message}"`
    if (data.label) detail += ` -- label "${data.label}"`
    if (data.url) detail += ` -- ${data.url}`
    return { pass: true, detail }
  },
}
