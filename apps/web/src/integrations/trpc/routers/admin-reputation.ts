import { z } from "zod"
import { and, desc, eq, inArray, sql } from "drizzle-orm"
import { adminProcedure } from "../init"
import { trpcError } from "../error"
import { db } from "@tripwire/db/client"
import {
  events as eventsTable,
  githubReputation,
  repositories,
} from "@tripwire/db"
import { inngest } from "#/inngest/client"

import type { TRPCRouterRecord } from "@trpc/server"

export const adminReputationRouter = {
  lookup: adminProcedure
    .input(z.object({ username: z.string().min(1) }))
    .query(async ({ input }) => {
      const username = input.username.trim().toLowerCase()

      const reputations = await db
        .select({
          repoId: githubReputation.repoId,
          repoFullName: repositories.fullName,
          githubUsername: githubReputation.githubUsername,
          githubUserId: githubReputation.githubUserId,
          score: githubReputation.score,
          totalAllows: githubReputation.totalAllows,
          totalBlocks: githubReputation.totalBlocks,
          totalNearMisses: githubReputation.totalNearMisses,
          firstSeenAt: githubReputation.firstSeenAt,
          lastSeenAt: githubReputation.lastSeenAt,
          scoreResetAt: githubReputation.scoreResetAt,
          updatedAt: githubReputation.updatedAt,
        })
        .from(githubReputation)
        .leftJoin(repositories, eq(repositories.id, githubReputation.repoId))
        .where(sql`lower(${githubReputation.githubUsername}) = ${username}`)
        .orderBy(desc(githubReputation.lastSeenAt))

      const recentEvents = await db
        .select({
          id: eventsTable.id,
          repoId: eventsTable.repoId,
          repoFullName: repositories.fullName,
          action: eventsTable.action,
          severity: eventsTable.severity,
          description: eventsTable.description,
          githubRef: eventsTable.githubRef,
          ruleName: eventsTable.ruleName,
          metadata: eventsTable.metadata,
          createdAt: eventsTable.createdAt,
        })
        .from(eventsTable)
        .leftJoin(repositories, eq(repositories.id, eventsTable.repoId))
        .where(sql`lower(${eventsTable.targetGithubUsername}) = ${username}`)
        .orderBy(desc(eventsTable.createdAt))
        .limit(100)

      return { reputations, events: recentEvents }
    }),

  setReputation: adminProcedure
    .input(
      z.object({
        repoId: z.string().uuid(),
        username: z.string().min(1),
        score: z.number().int().min(0).max(100).optional(),
        totalAllows: z.number().int().min(0).optional(),
        totalBlocks: z.number().int().min(0).optional(),
        totalNearMisses: z.number().int().min(0).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const setFields: Partial<typeof githubReputation.$inferInsert> & {
        updatedAt: Date
      } = { updatedAt: new Date() }
      if (typeof input.score === "number") setFields.score = input.score
      if (typeof input.totalAllows === "number")
        setFields.totalAllows = input.totalAllows
      if (typeof input.totalBlocks === "number")
        setFields.totalBlocks = input.totalBlocks
      if (typeof input.totalNearMisses === "number")
        setFields.totalNearMisses = input.totalNearMisses

      const [updated] = await db
        .update(githubReputation)
        .set(setFields)
        .where(
          and(
            eq(githubReputation.repoId, input.repoId),
            sql`lower(${githubReputation.githubUsername}) = ${input.username.trim().toLowerCase()}`
          )
        )
        .returning()

      if (!updated) {
        throw trpcError({
          code: "admin.reputation.not_found",
          status: 404,
          message: `No reputation row for @${input.username} on this repo`,
        })
      }
      return { updated }
    }),

  deleteEvents: adminProcedure
    .input(
      z.object({
        eventIds: z.array(z.string().uuid()).min(1).max(100),
      })
    )
    .mutation(async ({ input }) => {
      const deleted = await db
        .delete(eventsTable)
        .where(inArray(eventsTable.id, input.eventIds))
        .returning({ id: eventsTable.id })
      return { deletedCount: deleted.length }
    }),

  triggerRescore: adminProcedure
    .input(
      z.object({
        repoId: z.string().uuid(),
        username: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      await inngest.send({
        name: "visibility/score-user.requested",
        data: { repoId: input.repoId, username: input.username.trim() },
      })
      return { ok: true }
    }),
} satisfies TRPCRouterRecord
