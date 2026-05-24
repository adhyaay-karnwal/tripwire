import { Link } from "@tanstack/react-router"
import { Button } from "@tripwire/ui/button"
import { GithubIcon } from "@tripwire/ui/icons/github"
import { TripwireLogo } from "@tripwire/ui/icons/tripwire-logo"
import { routes } from "#/lib/routes"

export function InstallGitHubPrompt() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex max-w-sm flex-col items-center gap-4 px-4 text-center">
        <div className="flex size-12 items-center justify-center">
          <TripwireLogo className="size-8 text-tw-text-secondary" />
        </div>
        <div>
          <h2 className="mb-1 text-[15px] font-medium text-tw-text-primary">
            Install the GitHub App
          </h2>
          <p className="text-[13px] leading-relaxed text-tw-text-secondary">
            Connect a repository to start using Tripwire. You'll be able to
            configure rules, run automations, and monitor contributions.
          </p>
        </div>
        <Button variant="default" size="sm">
          <Link to={routes.api.githubInstall} className="flex gap-2">
            <GithubIcon className="mt-0.5 size-4" />
            Install GitHub App
          </Link>
        </Button>
      </div>
    </div>
  )
}
