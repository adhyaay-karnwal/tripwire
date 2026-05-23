import { actionHandles } from "../handles"
import type { Block } from "../types"

export const addToWhitelist: Block = {
  type: "action",
  subtype: "add_to_whitelist",
  name: "Whitelist",
  category: "Actions",
  description: "Add the contributor to the repo whitelist",
  definition: "Adds the contributor to the repo whitelist.",
  example: "Auto-whitelist users who pass all rule checks.",
  params: [],
  handles: actionHandles,
  requiredContext: [],
  evaluate(data) {
    let detail = `Execute: add_to_whitelist`
    if (data.message) detail += ` -- "${data.message}"`
    if (data.label) detail += ` -- label "${data.label}"`
    if (data.url) detail += ` -- ${data.url}`
    return { pass: true, detail }
  },
}
