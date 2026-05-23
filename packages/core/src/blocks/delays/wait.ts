import { delayHandles } from "../handles"
import type { Block } from "../types"
import { parseDurationMs } from "../utils"

export const wait: Block = {
  type: "delay",
  subtype: "wait",
  name: "Delay",
  category: "Delays",
  description: "Wait for a configurable duration before proceeding",
  definition: "Pauses the workflow for a set duration before continuing.",
  example: "Wait 5 minutes before re-checking a contributor's profile data.",
  params: [
    {
      key: "durationValue",
      name: "Duration",
      type: "number",
      default: 5,
      required: true,
      description: "How long to wait",
    },
    {
      key: "durationUnit",
      name: "Unit",
      type: "select",
      default: "m",
      required: true,
      options: [
        { label: "Seconds", value: "s" },
        { label: "Minutes", value: "m" },
        { label: "Hours", value: "h" },
        { label: "Days", value: "d" },
      ],
    },
  ],
  handles: delayHandles,
  requiredContext: [],
  evaluate(data) {
    const value = (data.durationValue as number) ?? 5
    const unit = (data.durationUnit as string) ?? "m"
    const duration = `${value}${unit}`
    const ms = parseDurationMs(duration)
    return {
      pass: true,
      detail: `Delay: waiting ${duration}...`,
      pauseMs: Math.min(ms, 10_000),
    }
  },
}
