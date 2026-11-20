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

    scrollContent: {
        flexGrow: 1,
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
        marginBottom: spacing.xl,
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

    avatarGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: spacing["2xl"],
    },

    avatarCard: {
        width: "48%",
        marginBottom: spacing.lg,
        alignItems: "center",
        padding: spacing.md,
        borderWidth: 1.5,
        borderBottomWidth: 3,
        borderColor: colors.border,
        borderRadius: radius.xl,
        backgroundColor: colors.surface,
        position: "relative",
    },

    avatarCardSelected: {
        borderWidth: 2.5,
        borderBottomWidth: 4,
        borderColor: colors.primary,
        backgroundColor: colors.primaryTint,
    },

    selectionIndicator: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1,
        width: 24,
        height: 24,
        borderRadius: radius.full,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
    },

    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: radius.xl,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },

    avatarImageContent: {
        width: "100%",
        height: "100%",
    },

    avatarName: {
        marginTop: spacing.md,
        color: colors.textSecondary,
        fontFamily: typography.family.bodyBold,
        fontSize: typography.size.md,
    },

    avatarNameSelected: {
        color: colors.primary,
    },

    selectionMessage: {
        minHeight: 32,
        alignItems: "center",
        justifyContent: "center",
        marginTop: spacing.sm,
    },

    selectionText: {
        color: colors.textSecondary,
        fontFamily: typography.family.bodyMedium,
        fontSize: typography.size.sm,
        textAlign: "center",
    },

    primaryButton: {
        width: "100%",
        minHeight: 58,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: spacing.xl,
        paddingHorizontal: spacing.xl,
        borderRadius: radius.full,
        backgroundColor: colors.primary,
    },

    primaryButtonDisabled: {
        opacity: 0.45,
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

    skipButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: spacing.lg,
    },

    skipButtonText: {
        color: colors.textMuted,
        fontFamily: typography.family.bodyBold,
        fontSize: typography.size.sm,
    },
});