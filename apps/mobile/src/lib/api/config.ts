const API_VERSION_PREFIX = "/api/v1";

function normalizeBaseUrl(value: string): string {
    return value.trim().replace(/\/+$/, "");
}

/**
 * Returns the configured ZELO API base URL.
 *
 * EXPO_PUBLIC_API_URL must contain the server origin,
 * for example: http://192.168.1.10:3000
 *
 * Do not include /api/v1 in the environment variable.
 */
export function getApiBaseUrl(): string {
    const configuredUrl = process.env.EXPO_PUBLIC_API_URL;

    if (!configuredUrl?.trim()) {
        throw new Error(
            "API URL is not configured. Set EXPO_PUBLIC_API_URL in apps/mobile/.env.local.",
        );
    }

    const baseUrl = normalizeBaseUrl(configuredUrl);

    let parsedUrl: URL;

    try {
        parsedUrl = new URL(baseUrl);
    } catch {
        throw new Error("The configured API URL is invalid.");
    }

    if (
        parsedUrl.protocol !== "http:" &&
        parsedUrl.protocol !== "https:"
    ) {
        throw new Error(
            "The API URL must use HTTP or HTTPS.",
        );
    }

    if (parsedUrl.username || parsedUrl.password) {
        throw new Error(
            "The API URL must not contain credentials.",
        );
    }

    if (
        parsedUrl.pathname !== "/" ||
        parsedUrl.search ||
        parsedUrl.hash
    ) {
        throw new Error(
            "The API URL must contain only the server origin.",
        );
    }

    return `${baseUrl}${API_VERSION_PREFIX}`;
}
