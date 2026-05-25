import type * as React from "react"

/** Handles inline markdown: **bold**, `code`, [links](url) */
export function InlineMarkdown({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  const regex = /(\*\*(.+?)\*\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null = regex.exec(text)

  while (match !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    if (match[2]) {
      parts.push(
        <strong key={match.index} className="font-medium text-tw-text-primary">
          {match[2]}
        </strong>
      )
    } else if (match[3]) {
      parts.push(
        <code
          key={match.index}
          className="rounded bg-[#FAFAFA10] px-1 py-px font-mono text-[10px]"
        >
          {match[3]}
        </code>
      )
    } else if (match[4] && match[5]) {
      parts.push(
        <a
          key={match.index}
          href={match[5]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-tw-accent hover:underline"
        >
          {match[4]}
        </a>
      )
    }
    lastIndex = match.index + match[0].length
    match = regex.exec(text)
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <>{parts}</>
}

/** Lightweight markdown-to-JSX for tool card bodies (no deps). */
export function MiniMarkdown({ content }: { content: string }) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    if (!trimmed) {
      elements.push(<br key={i} />)
      continue
    }

    if (trimmed.startsWith("> ")) {
      elements.push(
        <div
          key={i}
          className="border-l-2 border-tw-border pl-2 text-tw-text-muted italic"
        >
          <InlineMarkdown text={trimmed.slice(2)} />
        </div>
      )
      continue
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const cls =
        level === 1
          ? "text-[12px] font-semibold text-tw-text-primary"
          : "text-[11px] font-medium text-tw-text-secondary"
      elements.push(
        <div key={i} className={cls}>
          <InlineMarkdown text={headingMatch[2]} />
        </div>
      )
      continue
    }

    if (trimmed.match(/^[-*]\s/)) {
      elements.push(
        <div key={i} className="flex items-start gap-1.5">
          <span className="mt-px shrink-0 text-tw-text-muted">·</span>
          <span>
            <InlineMarkdown text={trimmed.replace(/^[-*]\s/, "")} />
          </span>
        </div>
      )
      continue
    }

    if (trimmed.startsWith("```")) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <pre
          key={i}
          className="overflow-x-auto rounded-md bg-[#FAFAFA08] px-2 py-1.5 font-mono text-[10px] whitespace-pre-wrap"
        >
          {codeLines.join("\n")}
        </pre>
      )
      continue
    }

    elements.push(
      <div key={i}>
        <InlineMarkdown text={trimmed} />
      </div>
    )
  }

  return <div className="flex flex-col gap-0.5">{elements}</div>
}
