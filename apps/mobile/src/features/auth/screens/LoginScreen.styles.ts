import { StyleSheet } from "react-native";

import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/spacing";
import { typography } from "../../../theme/typography";

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.xl,
    },
    container: {
        width: "100%",
        maxWidth: 440,
        alignSelf: "center",
    },
    backButton: {
        width: 42,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        backgroundColor: colors.primaryLight,
    },
    backArrow: {
        color: colors.textPrimary,
        fontSize: 32,
        lineHeight: 36,
    },
    brand: {
        alignItems: "center",
        marginTop: spacing.sm,
    },
    brandName: {
        color: colors.primary,
        fontSize: 35,
        fontWeight: "900",
        letterSpacing: 4,
    },
    tagline: {
        marginTop: 3,
        color: colors.textSecondary,
        fontSize: typography.size.xs,
        letterSpacing: 1,
    },
    heading: {
        marginTop: 34,
        alignItems: "center",
    },
    title: {
        color: colors.textPrimary,
        fontSize: 29,
        fontWeight: "800",
        textAlign: "center",
    },
    subtitle: {
        marginTop: 9,
        color: colors.textSecondary,
        fontSize: typography.size.sm,
        lineHeight: 21,
        textAlign: "center",
    },
    form: {
        marginTop: 30,
    },
    label: {
        marginBottom: 9,
        color: colors.textPrimary,
        fontSize: typography.size.sm,
        fontWeight: "700",
    },
    inputContainer: {
        minHeight: 56,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 15,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.white,
    },
    inputIcon: {
        width: 27,
        color: colors.primary,
        fontSize: 19,
        textAlign: "center",
    },
    input: {
        flex: 1,
        minHeight: 54,
        paddingHorizontal: spacing.sm,
        color: colors.textPrimary,
        fontSize: typography.size.sm,
    },
    passwordLabel: {
        marginTop: 21,
    },
    visibilityButton: {
        paddingHorizontal: 5,
        paddingVertical: 12,
    },
    visibilityText: {
        color: colors.primary,
        fontSize: typography.size.xs,
        fontWeight: "700",
    },
    optionsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 18,
    },
    rememberOption: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    checkbox: {
        width: 19,
        height: 19,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: 5,
        backgroundColor: colors.white,
    },
    checkboxChecked: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
    },
    checkmark: {
        color: colors.white,
        fontSize: 13,
        fontWeight: "800",
    },
    rememberText: {
        color: colors.textSecondary,
        fontSize: typography.size.xs,
    },
    linkText: {
        color: colors.primary,
        fontSize: typography.size.xs,
        fontWeight: "700",
    },
    errorText: {
        marginTop: spacing.md,
        color: colors.error,
        fontSize: 13,
        lineHeight: 19,
    },
    primaryButton: {
        minHeight: 56,
        marginTop: 25,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        backgroundColor: colors.primary,
    },
    primaryButtonText: {
        color: colors.white,
        fontSize: typography.size.md,
        fontWeight: "800",
    },
    disabledButton: {
        opacity: 0.65,
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: spacing.xl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        color: colors.textMuted,
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 1,
    },
    socialRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 19,
    },
    socialButton: {
        flex: 1,
        minHeight: 49,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 13,
        backgroundColor: colors.white,
    },
    socialIcon: {
        color: colors.textPrimary,
        fontSize: typography.size.md,
        fontWeight: "800",
    },
    socialText: {
        color: colors.textSecondary,
        fontSize: 13,
        fontWeight: "600",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        marginTop: 29,
    },
    footerText: {
        color: colors.textSecondary,
        fontSize: typography.size.xs,
    },
    centeredState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundColor: colors.background,
    },
    stateTitle: {
        color: colors.textPrimary,
        fontSize: typography.size.xl,
        fontWeight: "800",
        textAlign: "center",
    },
    stateMessage: {
        marginTop: 14,
        color: colors.textSecondary,
        fontSize: typography.size.sm,
        lineHeight: 22,
        textAlign: "center",
    },
});