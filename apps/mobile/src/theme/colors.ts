/**
 * ZELO brand palette.
 * Clean ivory/white surfaces with violet actions and green success accents,
 * aligned with the approved ZELO 2.0 design-system direction.
 */
export const colors = {
    // Brand
    primary: "#7357E8",
    primaryPressed: "#5F43D2",
    primarySoft: "#F0EDFF",
    primaryTint: "#F7F5FF",
    brandPurple: "#4B087F",
    brandPurpleDeep: "#28004E",
    brandViolet: "#762BFF",
    brandLime: "#A8FF00",
    brandGreen: "#20D600",

    // App surfaces
    background: "#FBFAFF",
    surface: "#FFFFFF",
    surfaceSecondary: "#F5F2FF",
    surfaceTint: "#F8F7FF",

    // Text
    textPrimary: "#201447",
    textSecondary: "#626080",
    textMuted: "#85819A",
    textInverse: "#FFFFFF",

    // Borders and inputs
    border: "#E3DFF2",
    borderStrong: "#C9C1E8",
    inputBackground: "#FFFFFF",
    inputPlaceholder: "#918CA8",

    // Feedback
    success: "#168653",
    successBackground: "#E8F8F0",
    error: "#C62845",
    errorBackground: "#FDECEF",
    warning: "#9A6500",
    warningBackground: "#FFF4DE",

    // General
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",
} as const;

export type ColorToken = keyof typeof colors;
