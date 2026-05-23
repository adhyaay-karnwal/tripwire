import { triggerHandles } from "../handles"
import type { Block } from "../types"

export const contributorFirstInteraction: Block = {
  type: "trigger",
  subtype: "contributor_first_interaction",
  name: "First Interaction",
  category: "Triggers",
  description: "Fires on a contributor's first interaction with the repo",
  definition: "Fires the first time a user interacts with the repo.",
  example: "Run extra checks on brand-new contributors.",
  params: [],
  handles: triggerHandles,
  requiredContext: [],
  evaluate(_data) {
    return { pass: true, detail: `Triggered: contributor_first_interaction` }
  },
}
