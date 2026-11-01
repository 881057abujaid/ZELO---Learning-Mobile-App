import { z } from "zod";

const emailDeliveryConfigSchema = z.object({
    RESEND_API_KEY: z.string().trim().min(1),

    RESEND_FROM_EMAIL: z
        .string()
        .trim()
        .refine(
            (value) => {
                const match = value.match(
                    /^(?:[^<>]+<)?([^<>@\s]+@[^<>@\s]+\.[^<>@\s]+)>?$/,
                );

                return match !== null;
            },
            "Must be a valid email address or a sender in the format Name <email@example.com>.",
        ),
});

const passwordResetUrlConfigSchema = z.object({
    PASSWORD_RESET_URL_BASE: z.string().trim().url(),
});

export interface EmailConfig {
    resendApiKey: string;
    resendFromEmail: string;
}

export interface PasswordResetUrlConfig {
    passwordResetUrlBase: string;
}

function formatConfigError(issues: z.ZodIssue[]): Error {
    const details = issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");

    return new Error(`Invalid email configuration: ${details}`);
}

export function getEmailConfig(
    env: NodeJS.ProcessEnv = process.env,
): EmailConfig {
    const result = emailDeliveryConfigSchema.safeParse(env);

    if (!result.success) {
        throw formatConfigError(result.error.issues);
    }

    return {
        resendApiKey: result.data.RESEND_API_KEY,
        resendFromEmail: result.data.RESEND_FROM_EMAIL,
    };
}

export function getPasswordResetUrlConfig(
    env: NodeJS.ProcessEnv = process.env,
): PasswordResetUrlConfig {
    const result = passwordResetUrlConfigSchema.safeParse(env);

    if (!result.success) {
        throw formatConfigError(result.error.issues);
    }

    return {
        passwordResetUrlBase: result.data.PASSWORD_RESET_URL_BASE,
    };
}