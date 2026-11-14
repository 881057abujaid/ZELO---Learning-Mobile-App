import { StyleSheet } from "react-native";

import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/spacing";
import { radius } from "../../../theme/shape";
import { typography } from "../../../theme/typography";

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },

    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
        justifyContent: "space-between",
    },

    container: {
        flex: 1,
        width: "100%",
        maxWidth: 440,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "space-between",
    },

    brandContainer: {
        alignItems: "center",
        marginTop: spacing.sm,
    },

    illustrationContainer: {
        width: "100%",
        maxWidth: 380,
        aspectRatio: 0.85,
        alignItems: "center",
        justifyContent: "center",
        marginTop: spacing.md,
    },

    mascot: {
        width: "100%",
        height: "100%",
    },

    content: {
        width: "100%",
        alignItems: "center",
        marginTop: spacing.md,
    },

    heading: {
        color: colors.textPrimary,
        fontFamily: typography.family.displayBlack,
        fontSize: 32,
        lineHeight: 40,
        textAlign: "center",
    },

    headingHighlight: {
        color: colors.brandViolet,
    },

    description: {
        maxWidth: 330,
        marginTop: spacing.md,
        color: colors.textSecondary,
        fontFamily: typography.family.body,
        fontSize: typography.size.md,
        lineHeight: typography.lineHeight.lg,
        textAlign: "center",
    },

    actions: {
        width: "100%",
        marginTop: spacing["2xl"],
    },

    buttonWrapper: {
        width: "100%",
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

    buttonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },

    gradientButton: {
        minHeight: 58,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius.full,
        paddingHorizontal: spacing.xl,
    },

    buttonText: {
        color: colors.white,
        fontFamily: typography.family.bodyExtraBold,
        fontSize: typography.size.md,
    },

    buttonArrow: {
        position: "absolute",
        right: spacing.xl,
        color: colors.white,
        fontFamily: typography.family.bodyExtraBold,
        fontSize: typography.size.xl,
    },

    centeredState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.xl,
        backgroundColor: colors.background,
    },

    stateMessage: {
        marginTop: spacing.md,
        marginBottom: spacing.lg,
        color: colors.textSecondary,
        fontFamily: typography.family.body,
        fontSize: typography.size.sm,
        lineHeight: typography.lineHeight.lg,
        textAlign: "center",
    },

    errorTitle: {
        color: colors.textPrimary,
        fontFamily: typography.family.display,
        fontSize: typography.size.xl,
        textAlign: "center",
    },
});