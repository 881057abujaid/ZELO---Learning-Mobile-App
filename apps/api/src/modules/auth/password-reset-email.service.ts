import { Resend } from "resend";
import { getEmailConfig } from "../../config/email-config.js";

interface SendPasswordResetEmailInput {
    to: string;
    resetUrl: string;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export async function sendPasswordResetEmail(
    input: SendPasswordResetEmailInput,
): Promise<void> {
    let config: ReturnType<typeof getEmailConfig>;

    try {
        config = getEmailConfig();
    } catch {
        throw new Error(
            "Password recovery email service is not configured.",
        );
    }

    const resend = new Resend(config.resendApiKey);
    const safeResetUrl = escapeHtml(input.resetUrl);

    const { error } = await resend.emails.send({
        from: config.resendFromEmail,
        to: input.to,
        subject: "Reset your ZELO password",

        text: [
            "We received a request to reset your ZELO password.",
            "",
            "Open the following link to reset your password:",
            input.resetUrl,
            "",
            "This link expires in 30 minutes.",
            "If you did not request this, you can ignore this email.",
        ].join("\n"),

        html: `
            <div>
                <h2>Reset your ZELO password</h2>

                <p>
                    We received a request to reset your ZELO password.
                </p>

                <p>
                    Use the link below to choose a new password.
                </p>

                <p>
                    <a href="${safeResetUrl}">
                        Reset Password
                    </a>
                </p>

                <p>This link expires in 30 minutes.</p>

                <p>
                    If you did not request this, you can ignore
                    this email.
                </p>
            </div>
        `,
    });

    if (error) {
        throw new Error(
            "Password recovery email delivery failed.",
        );
    }
}