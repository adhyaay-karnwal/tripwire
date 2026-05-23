import { actionHandles } from "../handles"
import type { Block } from "../types"

export const removeFromWhitelist: Block = {
  type: "action",
  subtype: "remove_from_whitelist",
  name: "Remove Whitelist",
  category: "Actions",
  description: "Remove the contributor from the repo whitelist",
  definition: "Removes the contributor from the repo whitelist.",
  example: "Revoke whitelist status when a user starts failing checks.",
  params: [],
  handles: actionHandles,
  requiredContext: [],
  evaluate(data) {
    let detail = `Execute: remove_from_whitelist`
    if (data.message) detail += ` -- "${data.message}"`
    if (data.label) detail += ` -- label "${data.label}"`
    if (data.url) detail += ` -- ${data.url}`
    return { pass: true, detail }
  },
}
