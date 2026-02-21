import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: z.coerce.number().default(4001),
    DATABASE_URL: z.string().default('postgres://postgres:postgres@db:5432/myapp'),
    TEST_DATABASE_URL: z.string().default('postgres://postgres:postgres@db:5432/myapp'),
    JWT_SECRET: z.string().default('dev-secret-key'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    CORS_ORIGIN: z.string().default('*'),
});

const parsedEnvs = envSchema.safeParse(process.env)
if (!parsedEnvs.success) {
    throw new Error("Environment Variable Load Failed")
}

// Enforce secure JWT_SECRET in production
if (parsedEnvs.data.NODE_ENV === "production" && parsedEnvs.data.JWT_SECRET === "dev-secret-key") {
    throw new Error("JWT_SECRET must be explicitly set in production. Do not use the default value.")
}

export const envs = parsedEnvs.data
