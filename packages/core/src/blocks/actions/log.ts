import { actionHandles } from "../handles"
import type { Block } from "../types"

export const log: Block = {
  type: "action",
  subtype: "log",
  name: "Log Event",
  category: "Actions",
  description: "Record the event silently without taking any GitHub action",
  definition: "Records the event silently without any GitHub action.",
  example: "Log suspicious activity for later review without blocking.",
  params: [
    {
      key: "message",
      name: "Message",
      type: "string",
      description: "Log message",
    },
  ],
  handles: actionHandles,
  requiredContext: [],
  evaluate(data) {
    let detail = `Execute: log`
    if (data.message) detail += ` -- "${data.message}"`
    if (data.label) detail += ` -- label "${data.label}"`
    if (data.url) detail += ` -- ${data.url}`
    return { pass: true, detail }
  },
}
