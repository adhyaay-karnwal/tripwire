import { describe, it, expect } from "vitest"
import { accountType } from "./account-type"
import { makeUser } from "../../test-fixtures"

describe("accountType", () => {
  it("returns the GitHub user type when set", () => {
    const input = makeUser({ ghUser: { type: "Organization" } })
    expect(accountType.resolve(input)).toBe("Organization")
  })

  it("defaults to User when ghUser is null", () => {
    expect(accountType.resolve(makeUser({ ghUser: null }))).toBe("User")
  })

  it("defaults to User when type is missing", () => {
    const input = makeUser({ ghUser: { type: undefined } })
    expect(accountType.resolve(input)).toBe("User")
  })
})
