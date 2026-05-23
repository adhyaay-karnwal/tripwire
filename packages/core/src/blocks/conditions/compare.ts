import { conditionHandles } from "../handles"
import type { Block } from "../types"

export const compare: Block = {
  type: "condition",
  subtype: "custom",
  name: "Condition",
  category: "Conditions",
  description: "Compare a field against a value using an operator",
  definition: "Compares a data field against a value using an operator.",
  example: "Check if score > 50 to split the workflow into pass/fail branches.",
  params: [
    {
      key: "field",
      name: "Field",
      type: "select",
      required: true,
      default: "score",
      options: [
        { label: "Score", value: "score" },
        { label: "Account Age (days)", value: "accountAgeDays" },
        { label: "Public Repos", value: "publicRepos" },
        { label: "Non-Fork Repos", value: "nonForkRepos" },
        { label: "Followers", value: "followers" },
        { label: "Following", value: "following" },
        { label: "Public Gists", value: "publicGists" },
        { label: "Merged PRs", value: "mergedPrs" },
        { label: "Has Profile README", value: "hasProfileReadme" },
        { label: "Files Changed", value: "filesChanged" },
        { label: "Username", value: "username" },
      ],
      description: "The data field to evaluate",
    },
    {
      key: "operator",
      name: "Operator",
      type: "select",
      required: true,
      default: ">",
      options: [
        { label: ">", value: ">" },
        { label: ">=", value: ">=" },
        { label: "<", value: "<" },
        { label: "<=", value: "<=" },
        { label: "==", value: "==" },
        { label: "!=", value: "!=" },
        { label: "matches", value: "matches" },
      ],
      description: "Comparison operator",
    },
    {
      key: "value",
      name: "Value",
      type: "string",
      required: true,
      default: "50",
      description: "The value to compare against",
    },
  ],
  handles: conditionHandles,
  requiredContext: [],
  evaluate(data, ctx) {
    const field = (data.field as string) ?? "score"
    const operator = (data.operator as string) ?? ">"
    const value = String(data.value ?? "0")
    const actual = ctx[field]

    if (actual === undefined) {
      return { pass: true, detail: `SKIP -- field "${field}" not in context` }
    }

    let pass: boolean
    if (typeof actual === "boolean") {
      pass = actual === (value === "true")
    } else if (typeof actual === "string") {
      if (operator === "matches") {
        try {
          pass = new RegExp(value).test(actual)
        } catch {
          pass = actual.includes(value)
        }
      } else {
        pass = operator === "==" ? actual === value : actual !== value
      }
    } else {
      const numActual = Number(actual)
      const numValue = parseFloat(value)
      switch (operator) {
        case ">":
          pass = numActual > numValue
          break
        case ">=":
          pass = numActual >= numValue
          break
        case "<":
          pass = numActual < numValue
          break
        case "<=":
          pass = numActual <= numValue
          break
        case "==":
          pass = numActual === numValue
          break
        case "!=":
          pass = numActual !== numValue
          break
        default:
          pass = true
      }
    }
    return {
      pass,
      detail: `${pass ? "PASS" : "FAIL"} -- ${field} is ${actual} (check: ${operator} ${value})`,
    }
  },
}
