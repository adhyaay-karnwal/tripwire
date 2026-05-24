import { Streamdown, type StreamdownProps } from "streamdown"
import { code } from "@streamdown/code"

const ALLOWED_LINK_PREFIXES: readonly string[] = [
  "https://github.com/",
  "https://api.github.com/",
  "https://gist.github.com/",
  "https://docs.github.com/",
  "https://avatars.githubusercontent.com/",
  "https://user-images.githubusercontent.com/",
]

const ALLOWED_IMAGE_PREFIXES: readonly string[] = [
  "https://avatars.githubusercontent.com/",
  "https://user-images.githubusercontent.com/",
  "https://github.com/",
]

function isAllowed(
  url: string | undefined,
  allowlist: readonly string[]
): boolean {
  if (!url) return false
  return allowlist.some((prefix) => url.startsWith(prefix))
}

// `urlTransform` is called by Streamdown for every href/src; returning the URL
// unchanged keeps it, returning an empty/non-matching string drops it.
// First-line filter; the `a`/`img` component overrides below are a defensive
// second layer.
const safeUrlTransform = (url: string, key: string): string => {
  if (key === "src") {
    return isAllowed(url, ALLOWED_IMAGE_PREFIXES) ? url : ""
  }
  if (key === "href") {
    return isAllowed(url, ALLOWED_LINK_PREFIXES) ? url : ""
  }
  return url
}

// Streamdown lacks a built-in image/link allowlist prop. We layer a custom
// `urlTransform` (filters URLs) with `components` overrides for `a` and `img`
// (renders the disallowed URL as inert text instead of a clickable/loaded element).
const SAFE_STREAMDOWN_CONFIG = {
  linkSafety: { enabled: true },
  urlTransform: safeUrlTransform,
  components: {
    a: ({ href, children, ...rest }) => {
      if (!isAllowed(href, ALLOWED_LINK_PREFIXES)) {
        return <span className="tw-chat-blocked-link">{children}</span>
      }
      return (
        <a {...rest} href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    },
    img: ({ src, alt }) => {
      if (typeof src !== "string" || !isAllowed(src, ALLOWED_IMAGE_PREFIXES)) {
        return null
      }
      return (
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      )
    },
  },
} satisfies Pick<StreamdownProps, "linkSafety" | "urlTransform" | "components">

export function MarkdownText({ content }: { content: string }) {
  return (
    <Streamdown
      className="tw-chat-markdown"
      mode="static"
      plugins={{ code }}
      controls={false}
      {...SAFE_STREAMDOWN_CONFIG}
    >
      {content}
    </Streamdown>
  )
}
