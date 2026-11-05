/** Shared typography scale. Font files are loaded centrally in the app root. */
export const typography = {
    family: {
        display: "Exo2_800ExtraBold",
        displayBlack: "Exo2_900Black",
        heading: "Exo2_700Bold",
        body: "NunitoSans_400Regular",
        bodyMedium: "NunitoSans_600SemiBold",
        bodyBold: "NunitoSans_700Bold",
        bodyExtraBold: "NunitoSans_800ExtraBold",
        code: "monospace",
    },
    size: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 22,
        "2xl": 28,
        "3xl": 36,
    },
    lineHeight: {
        xs: 16,
        sm: 20,
        md: 24,
        lg: 28,
        xl: 30,
        "2xl": 36,
        "3xl": 44,
    },
    weight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extraBold: "800",
        black: "900",
    },
} as const;
