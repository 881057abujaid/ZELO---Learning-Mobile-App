import { describe, expect, it } from "vitest";
import {
    getEmailConfig,
    getPasswordResetUrlConfig,
} from "../../src/config/email-config.js";

const validEmailEnv = {
    RESEND_API_KEY: "re_test_key",
    RESEND_FROM_EMAIL: "ZELO <noreply@example.com>",
};

const validResetUrlEnv = {
    PASSWORD_RESET_URL_BASE: "https://example.com",
};

describe("getEmailConfig", () => {
    it("accepts valid email configuration", () => {
        expect(getEmailConfig(validEmailEnv)).toEqual({
            resendApiKey: validEmailEnv.RESEND_API_KEY,
            resendFromEmail: validEmailEnv.RESEND_FROM_EMAIL,
        });
    });

    it("rejects missing configuration", () => {
        expect(() => getEmailConfig({})).toThrow(
            /Invalid email configuration/,
        );
    });

    it("rejects an invalid sender email", () => {
        expect(() =>
            getEmailConfig({
                RESEND_API_KEY: "re_test_key",
                RESEND_FROM_EMAIL: "invalid-email",
            }),
        ).toThrow(/Invalid email configuration/);
    });
});

describe("getPasswordResetUrlConfig", () => {
    it("accepts a valid reset URL", () => {
        expect(
            getPasswordResetUrlConfig(validResetUrlEnv),
        ).toEqual({
            passwordResetUrlBase:
                validResetUrlEnv.PASSWORD_RESET_URL_BASE,
        });
    });

    it("rejects a missing reset URL", () => {
        expect(() => getPasswordResetUrlConfig({})).toThrow(
            /Invalid email configuration/,
        );
    });

    it("rejects an invalid reset URL", () => {
        expect(() =>
            getPasswordResetUrlConfig({
                PASSWORD_RESET_URL_BASE: "not-a-url",
            }),
        ).toThrow(/Invalid email configuration/);
    });
});
