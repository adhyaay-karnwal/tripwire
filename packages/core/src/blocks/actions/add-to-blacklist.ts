import { actionHandles } from "../handles"
import type { Block } from "../types"

export const addToBlacklist: Block = {
  type: "action",
  subtype: "add_to_blacklist",
  name: "Blacklist",
  category: "Actions",
  description: "Add the contributor to the repo blacklist",
  definition: "Adds the contributor to the repo blacklist.",
  example: "Blacklist repeat offenders caught by multiple rules.",
  params: [],
  handles: actionHandles,
  requiredContext: [],
  evaluate(data) {
    let detail = `Execute: add_to_blacklist`
    if (data.message) detail += ` -- "${data.message}"`
    if (data.label) detail += ` -- label "${data.label}"`
    if (data.url) detail += ` -- ${data.url}`
    return { pass: true, detail }
  },
}
