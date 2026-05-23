import { triggerHandles } from "../handles"
import type { Block } from "../types"

export const scheduleDaily: Block = {
  type: "trigger",
  subtype: "schedule_daily",
  name: "Daily Schedule",
  category: "Triggers",
  description: "Fires once per day on a schedule",
  params: [],
  handles: triggerHandles,
  hidden: true,
  requiredContext: [],
  evaluate(_data) {
    return { pass: true, detail: `Triggered: schedule_daily` }
  },
}
