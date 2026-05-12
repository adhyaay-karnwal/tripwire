import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { EvlogError } from 'evlog'
import { and, eq } from 'drizzle-orm'
import { auth } from '#/lib/auth'
import { db } from '#/db'
import {
  contributorRequests,
  events,
  organizations,
  repositories,
} from '#/db/schema'
import { trpcError } from './error'

export interface TRPCContext {
  headers: Headers
  user: { id: string; name: string; email: string } | null
}

export async function createContext(opts: { headers: Headers }): Promise<TRPCContext> {
  // Validate session using Better Auth
  const session = await auth.api.getSession({
    headers: opts.headers,
  })

  return {
    headers: opts.headers,
    user: session?.user ?? null,
  }
}

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    // Surface evlog's structured fields on shape.data so clients can use
    // parseError() to branch on `code` and render `why` / `fix` / `link`.
    const cause = error.cause
    if (cause instanceof EvlogError) {
      return {
        ...shape,
        data: {
          ...shape.data,
          code: cause.code ?? shape.data?.code,
          status: cause.statusCode,
          why: cause.why,
          fix: cause.fix,
          link: cause.link,
        },
      }
    }
    return shape
  },
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

// Middleware that requires authentication
const authMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action',
    })
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})

export const authedProcedure = t.procedure.use(authMiddleware)

const NOT_FOUND = () =>
  trpcError({ code: 'resource.not_found', status: 404, message: 'Not found' })

export async function assertOrgOwner(userId: string, orgId: string) {
  const [row] = await db
    .select({ org: organizations })
    .from(organizations)
    .where(and(eq(organizations.id, orgId), eq(organizations.ownerId, userId)))
    .limit(1)
  if (!row) throw NOT_FOUND()
  return row.org
}

export async function assertRepoOwner(userId: string, repoId: string) {
  const [row] = await db
    .select({ repo: repositories, org: organizations })
    .from(repositories)
    .innerJoin(organizations, eq(repositories.orgId, organizations.id))
    .where(and(eq(repositories.id, repoId), eq(organizations.ownerId, userId)))
    .limit(1)
  if (!row) throw NOT_FOUND()
  return row
}

export async function assertEventOwner(userId: string, eventId: string) {
  const [row] = await db
    .select({ event: events, repo: repositories, org: organizations })
    .from(events)
    .innerJoin(repositories, eq(events.repoId, repositories.id))
    .innerJoin(organizations, eq(repositories.orgId, organizations.id))
    .where(and(eq(events.id, eventId), eq(organizations.ownerId, userId)))
    .limit(1)
  if (!row) throw NOT_FOUND()
  return row
}

export async function assertRequestOwner(userId: string, requestId: string) {
  const [row] = await db
    .select({
      request: contributorRequests,
      repo: repositories,
      org: organizations,
    })
    .from(contributorRequests)
    .innerJoin(repositories, eq(contributorRequests.repoId, repositories.id))
    .innerJoin(organizations, eq(repositories.orgId, organizations.id))
    .where(
      and(
        eq(contributorRequests.id, requestId),
        eq(organizations.ownerId, userId),
      ),
    )
    .limit(1)
  if (!row) throw NOT_FOUND()
  return row
}
