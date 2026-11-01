import { z } from "zod";

const authConfigSchema = z.object({
    ACCESS_TOKEN_SECRET: z
        .string()
        .min(32, "ACCESS_TOKEN_SECRET must contain at least 32 characters."),
});

export interface AuthConfig {
    accessTokenSecret: string;
}

export function getAuthConfig(
    env: NodeJS.ProcessEnv = process.env,
): AuthConfig {
    const result = authConfigSchema.safeParse(env);

    if (!result.success) {
        const issues = result.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join("; ");

        throw new Error(
            `Invalid authentication configuration: ${issues}`,
        );
    }

    return {
        accessTokenSecret: result.data.ACCESS_TOKEN_SECRET,
    };
}