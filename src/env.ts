import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

const isProd = process.env.NODE_ENV === 'production'

export const env = createEnv({
  server: {
    BETTER_AUTH_URL: z.string().url().optional(),
    BETTER_AUTH_SECRET: z
      .string()
      .min(1)
      .optional()
      .refine(
        (val) => !isProd || (val !== undefined && val !== '' && val !== 'tripwire'),
        {
          message:
            'BETTER_AUTH_SECRET must be a strong unique value in production (generate with: openssl rand -hex 32)',
        },
      ),
    GITHUB_CLIENT_ID: z.string().min(1).optional(),
    GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
    GITHUB_APP_ID: z.string().min(1).optional(),
    GITHUB_APP_PRIVATE_KEY: z
      .string()
      .min(1)
      .optional()
      .refine((val) => !isProd || (val !== undefined && val !== ''), {
        message: 'GITHUB_APP_PRIVATE_KEY must be set in production',
      }),
    GITHUB_WEBHOOK_SECRET: z
      .string()
      .min(1)
      .optional()
      .refine((val) => !isProd || (val !== undefined && val !== ''), {
        message: 'GITHUB_WEBHOOK_SECRET must be set in production',
      }),
    DATABASE_URL: z
      .string()
      .min(1)
      .optional()
      .refine((val) => !isProd || (val !== undefined && val !== ''), {
        message: 'DATABASE_URL must be set in production',
      }),
    UNKEY_ROOT_KEY: z.string().min(1).optional(),
    OPENROUTER_API_KEY: z.string().min(1).optional(),
    AUTUMN_SECRET_KEY: z.string().min(1).optional(),
    BETTER_AUTH_API_KEY: z.string().min(1).optional(),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: 'VITE_',

  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
    VITE_GITHUB_APP_SLUG: z.string().min(1).optional(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   *
   * Client (VITE_*) vars come from `import.meta.env` (Vite inlines them at
   * build time). Server vars must be pulled from `process.env` explicitly —
   * `import.meta.env` does not expose non-VITE_ vars on the server.
   */
  runtimeEnv: {
    ...import.meta.env,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_APP_ID: process.env.GITHUB_APP_ID,
    GITHUB_APP_PRIVATE_KEY: process.env.GITHUB_APP_PRIVATE_KEY,
    GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    UNKEY_ROOT_KEY: process.env.UNKEY_ROOT_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    AUTUMN_SECRET_KEY: process.env.AUTUMN_SECRET_KEY,
    BETTER_AUTH_API_KEY: process.env.BETTER_AUTH_API_KEY,
  },

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
})
