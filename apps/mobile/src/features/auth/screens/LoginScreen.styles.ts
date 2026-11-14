import { StyleSheet } from "react-native";

import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/spacing";
import { typography } from "../../../theme/typography";
import { radius } from "../../../theme/shape";

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },

    keyboardAvoiding: {
        flex: 1,
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

    brand: {
        alignItems: "center",
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },

    heading: {
        alignItems: "center",
        marginTop: spacing.lg,
    },

    title: {
        color: colors.textPrimary,
        fontFamily: typography.family.displayBlack,
        fontSize: 32,
        lineHeight: 40,
        textAlign: "center",
    },

    subtitle: {
        marginTop: spacing.sm,
        color: colors.textSecondary,
        fontFamily: typography.family.body,
        fontSize: typography.size.md,
        lineHeight: typography.lineHeight.lg,
        textAlign: "center",
    },

    form: {
        marginTop: spacing["2xl"],
    },

    label: {
        marginBottom: spacing.sm,
        color: colors.textPrimary,
        fontFamily: typography.family.bodyBold,
        fontSize: typography.size.sm,
    },

    inputContainer: {
        minHeight: 58,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 18,
        backgroundColor: colors.surface,
    },

    input: {
        flex: 1,
        minHeight: 56,
        paddingVertical: spacing.sm,
        color: colors.textPrimary,
        fontFamily: typography.family.body,
        fontSize: typography.size.md,
    },

    visibilityButton: {
        minHeight: 44,
        justifyContent: "center",
        paddingLeft: spacing.md,
    },

    visibilityText: {
        color: colors.primary,
        fontFamily: typography.family.bodyExtraBold,
        fontSize: typography.size.xs,
    },

    optionsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing.sm,
        marginTop: 0,
    },

    rememberOption: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        minHeight: 36,
    },

    checkbox: {
        width: 19,
        height: 19,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: colors.borderStrong,
        borderRadius: 5,
        backgroundColor: colors.surface,
    },

    checkboxChecked: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
    },

    checkmark: {
        color: colors.white,
        fontFamily: typography.family.bodyExtraBold,
        fontSize: 13,
    },

    rememberText: {
        color: colors.textSecondary,
        fontFamily: typography.family.body,
        fontSize: typography.size.xs,
    },

    linkText: {
        color: colors.primary,
        fontFamily: typography.family.bodyExtraBold,
        fontSize: typography.size.xs,
    },

    errorText: {
        marginTop: spacing.md,
        padding: spacing.md,
        borderRadius: 12,
        backgroundColor: colors.errorBackground,
        color: colors.error,
        fontFamily: typography.family.bodyMedium,
        fontSize: typography.size.xs,
        lineHeight: typography.lineHeight.sm,
    },

    errorButtonSpacing: {
        marginTop: spacing.md,
    },

    primaryButton: {
        width: "100%",
        minHeight: 58,
        marginTop: spacing.xl,
        borderRadius: radius.full,
        overflow: "hidden",
        elevation: 4,
        shadowColor: colors.brandPurpleDeep,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },

    gradientPrimaryButton: {
        minHeight: 58,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.xl,
    },

    primaryButtonText: {
        color: colors.white,
        fontFamily: typography.family.bodyExtraBold,
        fontSize: typography.size.md,
    },

    buttonArrow: {
        marginLeft: spacing.xs,
        color: colors.white,
        fontFamily: typography.family.bodyExtraBold,
        fontSize: typography.size.xl,
    },

    buttonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },

    disabledButton: {
        opacity: 0.65,
    },

    secureNote: {
        marginTop: spacing.md,
        color: colors.textMuted,
        fontFamily: typography.family.body,
        fontSize: typography.size.xs,
        textAlign: "center",
    },

    divider: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        marginTop: spacing.xl,
    },

    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },

    dividerText: {
        color: colors.textMuted,
        fontFamily: typography.family.bodyExtraBold,
        fontSize: 10,
        letterSpacing: 1,
    },

    socialRow: {
        flexDirection: "row",
        gap: spacing.md,
        marginTop: spacing.lg,
    },

    socialButton: {
        flex: 1,
        minHeight: 58,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 18,
        backgroundColor: colors.surface,
    },

    socialText: {
        color: colors.textPrimary,
        fontFamily: typography.family.bodyBold,
        fontSize: typography.size.md,
    },

    footer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.xs,
        marginTop: spacing.xl,
    },

    footerText: {
        color: colors.textSecondary,
        fontFamily: typography.family.body,
        fontSize: typography.size.sm,
    },

    centeredState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.xl,
        backgroundColor: colors.background,
    },

    statusBadge: {
        width: 52,
        height: 52,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.lg,
        borderRadius: 26,
        backgroundColor: colors.primarySoft,
    },

    statusBadgeText: {
        color: colors.primary,
        fontFamily: typography.family.display,
        fontSize: typography.size.xl,
    },

    stateTitle: {
        color: colors.textPrimary,
        fontFamily: typography.family.display,
        fontSize: typography.size.xl,
        textAlign: "center",
    },

    stateMessage: {
        marginTop: spacing.md,
        color: colors.textSecondary,
        fontFamily: typography.family.body,
        fontSize: typography.size.sm,
        lineHeight: typography.lineHeight.lg,
        textAlign: "center",
    },
});