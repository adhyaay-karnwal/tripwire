import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { authClient } from "@tripwire/auth/client"
import { Button } from "@tripwire/ui/button"
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPanel,
  DialogFooter,
  DialogClose,
} from "#/components/ui/dialog"
import { useTRPC } from "#/integrations/trpc/react"
import { useWorkspace } from "#/lib/workspace-context"
import { toastFromError } from "#/lib/toast-error"
import {
  ORG_SLUG_PATTERN,
  isReservedOrgSlug,
  slugify,
} from "#/lib/reserved-org-slugs"

interface CreateOrgDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const FORMAT_HINT =
  "Lowercase letters, numbers, and hyphens. 1–39 chars, starts with a letter or number."

export function CreateOrgDialog({ open, onOpenChange }: CreateOrgDialogProps) {
  const trpc = useTRPC()
  const { setOrg } = useWorkspace()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setName("")
      setSlug("")
      setSlugTouched(false)
      setSubmitting(false)
    }
  }, [open])

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name))
  }, [name, slugTouched])

  const localError = ((): string | null => {
    if (slug.length === 0) return null
    if (!ORG_SLUG_PATTERN.test(slug)) return FORMAT_HINT
    if (isReservedOrgSlug(slug)) return "That URL is reserved by Tripwire."
    return null
  })()

  const remoteCheck = useQuery({
    ...trpc.orgs.checkSlugAvailable.queryOptions({ slug }),
    enabled: open && slug.length > 0 && localError === null,
    staleTime: 5_000,
  })

  const remoteError =
    remoteCheck.data && !remoteCheck.data.available
      ? remoteCheck.data.reason === "taken"
        ? "That URL is already taken."
        : remoteCheck.data.reason === "reserved"
          ? "That URL is reserved by Tripwire."
          : FORMAT_HINT
      : null

  const error = localError ?? remoteError
  const canSubmit =
    !submitting &&
    name.trim().length > 0 &&
    slug.length > 0 &&
    !error &&
    !remoteCheck.isFetching &&
    remoteCheck.data?.available === true

  const create = useMutation({
    mutationFn: async () => {
      const res = await authClient.organization.create({
        name: name.trim(),
        slug,
      })
      if (res.error) throw res.error
      return res.data
    },
    onSuccess: async (data) => {
      if (data) {
        setOrg({
          id: data.id,
          name: data.name,
          slug: data.slug ?? slug,
          logo: data.logo ?? null,
        })
      }
      onOpenChange(false)
    },
    onError: (err) =>
      toastFromError(err, { fallbackTitle: "Couldn't create organization" }),
    onSettled: () => setSubmitting(false),
  })

  const handleSubmit = () => {
    if (!canSubmit) return
    setSubmitting(true)
    create.mutate()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription>
            Group repos under a separate workspace. You'll be the owner.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-tw-text-secondary">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Inc."
                autoComplete="off"
                className="h-9 w-full rounded-lg border border-tw-border bg-tw-inner px-2.5 text-[13px] text-tw-text-primary outline-none placeholder:text-tw-text-muted focus:border-tw-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-tw-text-secondary">
                URL
              </label>
              <div className="flex items-stretch overflow-hidden rounded-lg border border-tw-border bg-tw-inner focus-within:border-tw-accent">
                <span className="flex items-center bg-tw-inner px-2.5 font-mono text-[12px] text-tw-text-muted">
                  tripwire.dev/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    setSlug(e.target.value.toLowerCase())
                  }}
                  placeholder="acme"
                  autoComplete="off"
                  spellCheck={false}
                  className="h-9 flex-1 bg-transparent px-0 font-mono text-[13px] text-tw-text-primary outline-none placeholder:text-tw-text-muted"
                />
              </div>
              {error ? (
                <span className="text-[11px] text-tw-error">{error}</span>
              ) : remoteCheck.isFetching ? (
                <span className="text-[11px] text-tw-text-muted">
                  Checking availability…
                </span>
              ) : remoteCheck.data?.available && slug.length > 0 ? (
                <span className="text-[11px] text-tw-success">Available</span>
              ) : (
                <span className="text-[11px] text-tw-text-muted">
                  {FORMAT_HINT}
                </span>
              )}
            </div>
          </div>
        </DialogPanel>
        <DialogFooter variant="bare">
          <DialogClose
            render={
              <Button variant="ghost" size="sm" type="button">
                Cancel
              </Button>
            }
          />
          <Button
            variant="default"
            size="sm"
            type="button"
            disabled={!canSubmit}
            loading={submitting}
            onClick={handleSubmit}
          >
            Create organization
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}
