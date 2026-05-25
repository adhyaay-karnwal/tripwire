import type { UIMessage } from "#/types/chat"

export function makeSpec(type: string, props: Record<string, unknown>) {
  return {
    root: "main",
    elements: {
      main: { type, props, children: [] },
    },
  }
}

export function makeUserMessage(text: string): UIMessage {
  return {
    id: crypto.randomUUID(),
    role: "user",
    parts: [{ type: "text", text }],
  } as UIMessage
}

interface MakeToolMessageOpts {
  toolName: string
  args: Record<string, unknown>
  state: "input-streaming" | "output-available" | "output-error"
  output?: unknown
  errorText?: string
}

export function makeToolMessage(opts: MakeToolMessageOpts): UIMessage {
  const toolCallId = crypto.randomUUID()
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    parts: [
      {
        type: `tool-${opts.toolName}`,
        toolCallId,
        state: opts.state,
        input: opts.args,
        ...(opts.output !== undefined ? { output: opts.output } : {}),
        ...(opts.errorText ? { errorText: opts.errorText } : {}),
      } as never,
    ],
  } as UIMessage
}

interface ActionResultOpts {
  action: string
  success: boolean
  message: string
  username?: string
}

export function actionResultMessage(opts: ActionResultOpts): UIMessage {
  return makeToolMessage({
    toolName: opts.action,
    args: opts.username ? { username: opts.username } : {},
    state: "output-available",
    output: makeSpec("ActionResult", {
      success: opts.success,
      message: opts.message,
      action: opts.action,
    }),
  })
}
