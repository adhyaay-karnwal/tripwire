import { useEffect, useRef } from "react"
import { Button } from "#/components/ui/button"
import type { SlashCommand } from "#/lib/chat-commands"

interface CommandPaletteProps {
  commands: SlashCommand[]
  selectedIndex: number
  onSelect: (command: SlashCommand) => void
  onHover: (index: number) => void
}

/**
 * Dropdown shown above the chat input when the user is typing a slash
 * command.
 */
export function CommandPalette({
  commands,
  selectedIndex,
  onSelect,
  onHover,
}: CommandPaletteProps) {
  const activeRef = useRef<HTMLButtonElement>(null)
  const safeSelectedIndex = Math.min(selectedIndex, commands.length - 1)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" })
  }, [safeSelectedIndex])

  if (commands.length === 0) return null

  return (
    <div className="absolute right-1.5 bottom-full left-1.5 z-50 mb-1.5 overflow-hidden rounded-xl border border-tw-border bg-tw-card shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
      <div className="border-b border-tw-border/50 px-3 py-1.5 text-[10px] tracking-wider text-tw-text-tertiary uppercase">
        Commands
      </div>
      <div className="max-h-[260px] overflow-y-auto py-1">
        {commands.map((cmd, i) => {
          const isActive = i === safeSelectedIndex
          return (
            <Button
              variant="ghost"
              key={cmd.command}
              ref={isActive ? activeRef : undefined}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault()
              }}
              onClick={() => onSelect(cmd)}
              onMouseEnter={() => onHover(i)}
              className={`h-auto w-full rounded-none px-3 py-1.5 text-left transition-colors ${
                isActive ? "bg-tw-hover" : ""
              }`}
            >
              <span className="flex min-w-0 items-baseline gap-2.5">
                <span className="min-w-[88px] shrink-0 tabular-nums text-[13px] font-medium text-tw-text-primary">
                  {cmd.command}
                </span>
                <span className="truncate text-[12px] text-tw-text-muted">
                  {cmd.description}
                </span>
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
