import { describe, expect, it } from "vitest"
import {
  filterCommands,
  isSlashCommandDiscovery,
  parseCommand,
} from "./chat-commands"

describe("slash command helpers", () => {
  it("filterCommands matches partial command names", () => {
    const r = filterCommands("/look")
    expect(r.some((c) => c.command === "/lookup")).toBe(true)
  })

  it("filterCommands returns empty once input contains a space", () => {
    expect(filterCommands("/lookup @x")).toEqual([])
  })

  it("isSlashCommandDiscovery is false after a space", () => {
    expect(isSlashCommandDiscovery("/lookup")).toBe(true)
    expect(isSlashCommandDiscovery("/lookup @x")).toBe(false)
  })

  it("isSlashCommandDiscovery is false for non-matching prefixes", () => {
    expect(isSlashCommandDiscovery("/zzz")).toBe(false)
  })

  it("parseCommand extracts command and args", () => {
    const p = parseCommand("/lookup @alice")
    expect(p?.command.command).toBe("/lookup")
    expect(p?.args).toBe("@alice")
  })
})
