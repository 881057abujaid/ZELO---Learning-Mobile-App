import { StyleSheet } from "react-native";

import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
    button: {
        minHeight: 56,
        paddingHorizontal: spacing.lg,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        borderWidth: 1,
        borderRadius: 16,
    },

    primary: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },

    secondary: {
        backgroundColor: colors.primarySoft,
        borderColor: colors.primarySoft,
    },

    outline: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
    },

    ghost: {
        backgroundColor: colors.transparent,
        borderColor: colors.transparent,
    },

    label: {
        fontFamily: typography.family.bodyBold,
        fontSize: typography.size.md,
        textAlign: "center",
    },

    primaryLabel: {
        color: colors.white,
    },

    secondaryLabel: {
        color: colors.primary,
    },

    outlineLabel: {
        color: colors.textPrimary,
    },

    ghostLabel: {
        color: colors.primary,
    },

    pressed: {
        opacity: 0.82,
    },

    disabled: {
        opacity: 0.55,
    },
});