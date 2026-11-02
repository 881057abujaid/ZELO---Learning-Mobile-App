import { ApiError } from "./api-error";
import { getApiBaseUrl } from "./config";
import type {
    ApiEnvelope,
    ApiErrorBody,
    HttpMethod,
} from "./api-types";

const REQUEST_TIMEOUT_MS = 15_000;

export interface ApiRequestOptions {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
    accessToken?: string;
    timeoutMs?: number;
}

function isRecord(
    value: unknown,
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

function isApiErrorBody(
    value: unknown,
): value is ApiErrorBody {
    return (
        isRecord(value) &&
        typeof value.code === "string" &&
        typeof value.message === "string"
    );
}

function isApiEnvelope<T>(
    value: unknown,
): value is ApiEnvelope<T> {
    if (!isRecord(value)) {
        return false;
    }

    if (value.success === true) {
        return "data" in value;
    }

    if (value.success === false) {
        return isApiErrorBody(value.error);
    }

    return false;
}

function createHttpError(
    status: number,
    payload: unknown,
): ApiError {
    if (
        isRecord(payload) &&
        payload.success === false &&
        isApiErrorBody(payload.error)
    ) {
        return new ApiError(
            payload.error.message,
            status,
            payload.error.code,
            payload.error.details,
        );
    }

    return new ApiError(
        status >= 500
            ? "The server encountered an error."
            : "The request could not be completed.",
        status,
        "HTTP_ERROR",
    );
}

/**
 * Sends a JSON request to the ZELO API and returns its data payload.
 */
export async function apiRequest<T>(
    path: string,
    options: ApiRequestOptions = {},
): Promise<T> {
    const {
        method = "GET",
        body,
        headers: customHeaders,
        accessToken,
        timeoutMs = REQUEST_TIMEOUT_MS,
    } = options;

    if (
        !path.startsWith("/") ||
        path.startsWith("//") ||
        path.includes("?") ||
        path.includes("#")
    ) {
        throw new ApiError(
            "API path must be an absolute path without a query or fragment.",
            0,
            "INVALID_API_PATH",
        );
    }

    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
        throw new ApiError(
            "Request timeout must be a positive number.",
            0,
            "INVALID_TIMEOUT",
        );
    }

    let apiBaseUrl: string;

    try {
        apiBaseUrl = getApiBaseUrl();
    } catch (error: unknown) {
        throw new ApiError(
            error instanceof Error
                ? error.message
                : "The API URL is not configured correctly.",
            0,
            "API_CONFIGURATION_ERROR",
        );
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(
        () => controller.abort(),
        timeoutMs,
    );

    const headers: Record<string, string> = {
        Accept: "application/json",
        ...customHeaders,
    };

    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    try {
        const response = await fetch(
            `${apiBaseUrl}${path}`,
            {
                method,
                headers,
                body:
                    body === undefined
                        ? undefined
                        : JSON.stringify(body),
                signal: controller.signal,
            },
        );

        let payload: unknown;

        try {
            payload = await response.json();
        } catch {
            if (!response.ok) {
                throw createHttpError(response.status, null);
            }

            throw new ApiError(
                "The server returned an invalid response.",
                response.status,
                "INVALID_RESPONSE",
            );
        }

        if (!response.ok) {
            throw createHttpError(response.status, payload);
        }

        if (!isApiEnvelope<T>(payload)) {
            throw new ApiError(
                "The server returned an invalid response.",
                response.status,
                "INVALID_RESPONSE",
            );
        }

        if (payload.success === false) {
            throw new ApiError(
                payload.error.message,
                response.status,
                payload.error.code,
                payload.error.details,
            );
        }

        return payload.data;
    } catch (error: unknown) {
        if (error instanceof ApiError) {
            throw error;
        }

        if (
            error instanceof Error &&
            error.name === "AbortError"
        ) {
            throw new ApiError(
                "The request timed out. Please try again.",
                0,
                "REQUEST_TIMEOUT",
            );
        }

        throw new ApiError(
            "Unable to connect to ZELO. Check your network connection and try again.",
            0,
            "NETWORK_ERROR",
        );
    } finally {
        clearTimeout(timeoutId);
    }
}
