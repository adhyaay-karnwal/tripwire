import { triggerHandles } from "../handles"
import type { Block } from "../types"

export const scheduleWeekly: Block = {
  type: "trigger",
  subtype: "schedule_weekly",
  name: "Weekly Schedule",
  category: "Triggers",
  description: "Fires once per week on a schedule",
  params: [],
  handles: triggerHandles,
  hidden: true,
  requiredContext: [],
  evaluate(_data) {
    return { pass: true, detail: `Triggered: schedule_weekly` }
  },
}
