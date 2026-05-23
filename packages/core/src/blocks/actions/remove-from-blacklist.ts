import { actionHandles } from "../handles"
import type { Block } from "../types"

export const removeFromBlacklist: Block = {
  type: "action",
  subtype: "remove_from_blacklist",
  name: "Remove Blacklist",
  category: "Actions",
  description: "Remove the contributor from the repo blacklist",
  definition: "Removes the contributor from the repo blacklist.",
  example: "Unblock a user after an appeal is approved.",
  params: [],
  handles: actionHandles,
  requiredContext: [],
  evaluate(data) {
    let detail = `Execute: remove_from_blacklist`
    if (data.message) detail += ` -- "${data.message}"`
    if (data.label) detail += ` -- label "${data.label}"`
    if (data.url) detail += ` -- ${data.url}`
    return { pass: true, detail }
  },
}
