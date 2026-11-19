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
        marginBottom: spacing["2xl"],
    },

    heading: {
        alignItems: "center",
    },

    title: {
        color: colors.textPrimary,
        fontFamily: typography.family.displayBlack,
        fontSize: 30,
        lineHeight: 38,
        textAlign: "center",
    },

    subtitle: {
        marginTop: spacing.md,
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
        minHeight: 60,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.lg,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: 18,
        backgroundColor: colors.surface,
    },

    inputContainerFocused: {
        borderColor: colors.primary,
    },

    inputContainerError: {
        borderColor: colors.error,
    },

    input: {
        flex: 1,
        minHeight: 58,
        paddingVertical: spacing.sm,
        color: colors.textPrimary,
        fontFamily: typography.family.bodyBold,
        fontSize: typography.size.md,
    },

    usernamePrefix: {
        marginRight: spacing.sm,
        color: colors.textMuted,
        fontFamily: typography.family.bodyBold,
        fontSize: typography.size.md,
    },

    characterCount: {
        marginTop: spacing.sm,
        color: colors.textMuted,
        fontFamily: typography.family.body,
        fontSize: typography.size.xs,
        textAlign: "right",
    },

    characterCountError: {
        color: colors.error,
    },

    helperText: {
        marginTop: spacing.md,
        color: colors.textSecondary,
        fontFamily: typography.family.body,
        fontSize: typography.size.xs,
        lineHeight: typography.lineHeight.md,
    },

    errorText: {
        marginTop: spacing.md,
        padding: spacing.md,
        borderRadius: radius.md,
        backgroundColor: colors.errorBackground,
        color: colors.error,
        fontFamily: typography.family.bodyMedium,
        fontSize: typography.size.xs,
        lineHeight: typography.lineHeight.md,
    },

    primaryButton: {
        width: "100%",
        minHeight: 58,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: spacing["2xl"],
        paddingHorizontal: spacing.xl,
        borderRadius: radius.full,
        backgroundColor: colors.primary,
    },

    primaryButtonText: {
        color: colors.white,
        fontFamily: typography.family.bodyExtraBold,
        fontSize: typography.size.md,
    },

    buttonArrow: {
        marginLeft: spacing.sm,
        color: colors.white,
        fontFamily: typography.family.bodyExtraBold,
        fontSize: typography.size.xl,
    },

    buttonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },

    disabledButton: {
        opacity: 0.55,
    },

    footer: {
        marginTop: spacing.xl,
        alignItems: "center",
    },

    footerText: {
        color: colors.textMuted,
        fontFamily: typography.family.body,
        fontSize: typography.size.xs,
        textAlign: "center",
    },
});