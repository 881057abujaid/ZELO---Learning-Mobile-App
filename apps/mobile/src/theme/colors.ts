export const colors = {
    // Brand
    primary: "#6955E8",
    primaryDark: "#5540D0",
    primaryLight: "#F0EDFF",

    // Backgrounds
    background: "#FAF9FF",
    surface: "#FFFFFF",
    surfaceSecondary: "#F5F2FF",

    // Text
    textPrimary: "#292541",
    textSecondary: "#858098",
    textMuted: "#9690A9",
    textInverse: "#FFFFFF",

    // Borders and inputs
    border: "#E5E1F1",
    inputBackground: "#FFFFFF",
    inputPlaceholder: "#9995AA",

    // Feedback
    success: "#238653",
    successBackground: "#E8F7EE",
    error: "#C62845",
    errorBackground: "#FDECEF",
    warning: "#B7791F",
    warningBackground: "#FFF4DE",

    // General
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",
} as const;

export type ColorToken = keyof typeof colors;
